import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../api.js';
import { DEFAULT_STATE, TABS, ALL_TRAITS } from '../constants.js';
import { NO_CHARACTER, shouldPoll, pollOutcome, syncMessage } from '../syncGate.js';
import CharacterCreation from '../components/shared/CharacterCreation.jsx';
import LoginOverlay from '../components/shared/LoginOverlay.jsx';
import Toast, { useToast } from '../components/shared/Toast.jsx';
import TrackerBar from '../components/shared/TrackerBar.jsx';
import BodyTab from '../components/character/BodyTab.jsx';
import SkillsTab from '../components/character/SkillsTab.jsx';
import AchievementsTab from '../components/character/AchievementsTab.jsx';
import InventoryTab from '../components/character/InventoryTab.jsx';
import ExposureTab from '../components/character/ExposureTab.jsx';
import ObjectivesTab from '../components/character/ObjectivesTab.jsx';
import CombatModeTab from '../components/character/CombatModeTab.jsx';
import NotesTab from '../components/character/NotesTab.jsx';
import CommsTab from '../components/character/CommsTab.jsx';

// Merge a server state onto DEFAULT_STATE. Hoisted out of the component because
// BOTH the initial load and the 12s poll use it — two copies of this merge is
// exactly the kind of thing that drifts and then loses a field on one path only.
function mergeLoadedState(state) {
  const loadedTraits = state.traits || {};
  const mergedTraits = ALL_TRAITS.reduce((acc, t) => ({
    ...acc, [t]: { ...DEFAULT_STATE.traits[t], ...(loadedTraits[t] || {}) },
  }), {});
  return {
    ...DEFAULT_STATE, ...state,
    identity: { ...DEFAULT_STATE.identity, ...(state.identity || {}) },
    traits: mergedTraits,
    bonusPoints: { ...DEFAULT_STATE.bonusPoints, ...(state.bonusPoints || {}) },
    levelPoints: { ...DEFAULT_STATE.levelPoints, ...(state.levelPoints || {}) },
    tokens: { ...DEFAULT_STATE.tokens, ...(state.tokens || {}) },
    exposure: { ...DEFAULT_STATE.exposure, ...(state.exposure || {}) },
    skillPointsSpent: { ...DEFAULT_STATE.skillPointsSpent, ...(state.skillPointsSpent || {}) },
    cameraCallUsed: state.cameraCallUsed ?? 0,
  };
}

export default function CharacterSheet() {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    return token ? { token, userId, username } : null;
  });
  const [charState, setCharState] = useState(DEFAULT_STATE);
  const [tracker, setTracker] = useState(null);
  const [activeTab, setActiveTab] = useState('body');
  const [saveStatus, setSaveStatus] = useState('saved');
  const [toast, showToast] = useToast();
  const saveTimer = useRef(null);
  const isLoaded = useRef(false);
  // null = not known yet; true = registered with no character, so run creation.
  const [needsCreation, setNeedsCreation] = useState(null);

  // ── GM-grant sync ───────────────────────────────────────────────────────────
  // The sheet used to load once and never look again, so a level the GM granted
  // mid-session was invisible until the player reloaded the page. It now re-reads
  // the character on the same 12s tick as the tracker — but a naive poll would
  // race the 1500ms autosave and clobber whatever the player just typed, so it
  // applies a server version ONLY when the local copy is clean.
  //
  // localGen counts local edits; syncedGen is the one the server has. Equal means
  // clean, and clean means the server is authoritative. serverVersion is the
  // document's updatedAt (already returned by both GET and POST), so an unchanged
  // document costs a fetch and nothing else.
  const localGen = useRef(0);
  const syncedGen = useRef(0);
  const serverVersion = useRef(null);
  const needsCreationRef = useRef(null);
  needsCreationRef.current = needsCreation;
  const poolRef = useRef(0);
  poolRef.current = charState.levelPoints?.pool ?? 0;

  useEffect(() => {
    if (!auth) return;
    apiFetch('/api/character', {}, auth.token).then(d => {
      if (d.state) {
        setCharState(mergeLoadedState(d.state));
        serverVersion.current = d.updatedAt || null;
        setNeedsCreation(false);
      } else if (d.error === NO_CHARACTER) {
        // GET /api/character 404s for a user who registered and has no character
        // document yet. That used to fall through to a blank DEFAULT_STATE sheet.
        setNeedsCreation(true);
      } else {
        // A different error (the 503 DB guard, a dropped request). They may well
        // have a character; do NOT send them into creation. Leave it unknown and
        // let the next poll settle it.
        showToast(d?.error || 'Could not load your sheet', 'err');
      }
      isLoaded.current = true;
    }).catch(() => { isLoaded.current = true; });

    const pollTracker = () => {
      apiFetch('/api/tracker', {}, auth.token).then(d => { if (!d.error) setTracker(d); });
    };

    // Re-read the character so a GM grant lands without a page reload. Every
    // decision here lives in syncGate.js so it can be tested without a DOM.
    const pollCharacter = () => {
      if (!shouldPoll({
        loaded: isLoaded.current, creating: needsCreationRef.current,
        localGen: localGen.current, syncedGen: syncedGen.current,
      })) return;
      const gen = localGen.current;
      apiFetch('/api/character', {}, auth.token).then(d => {
        const outcome = pollOutcome({
          genAtRequest: gen, localGen: localGen.current,
          reply: d, serverVersion: serverVersion.current,
        });
        if (outcome === 'reset') {
          // The GM reset the sheet out from under them. Same path as a new player.
          setNeedsCreation(true);
          serverVersion.current = null;
          return;
        }
        if (outcome !== 'apply') return;
        serverVersion.current = d.updatedAt || null;
        const next = mergeLoadedState(d.state);
        // Read the old pool through a ref, not inside the setCharState updater —
        // an updater must stay pure, and StrictMode calls it twice.
        const { msg, type } = syncMessage(poolRef.current, next.levelPoints?.pool ?? 0);
        setCharState(next);
        showToast(msg, type);
      }).catch(() => {});
    };

    pollTracker();
    const iv = setInterval(() => { pollTracker(); pollCharacter(); }, 12000);
    return () => clearInterval(iv);
  }, [auth]);

  function update(updater) {
    setCharState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (!isLoaded.current) return next;
      setSaveStatus('saving');
      // Mark the sheet dirty BEFORE the debounce. The poll reads this, so the
      // window between a keystroke and the save has to count as dirty too —
      // otherwise a poll landing inside those 1500ms would discard the edit.
      localGen.current += 1;
      const gen = localGen.current;
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        apiFetch('/api/character', { method: 'POST', body: JSON.stringify({ state: next }) }, auth?.token)
          .then(d => {
            setSaveStatus('saved');
            if (gen > syncedGen.current) syncedGen.current = gen;
            if (d?.updatedAt) serverVersion.current = d.updatedAt;
          })
          // A failed save used to report 'SAVED'. It must not: the edit is still
          // only in this browser, and the GM-grant poll deliberately refuses to
          // sync a dirty sheet, so a silent failure would also stop grants
          // arriving. Say so, and let the next edit retry.
          .catch(() => setSaveStatus('error'));
      }, 1500);
      return next;
    });
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setAuth(null);
    setCharState(DEFAULT_STATE);
    isLoaded.current = false;
    localGen.current = 0;
    syncedGen.current = 0;
    serverVersion.current = null;
    setNeedsCreation(null);
  }

  // Write the created character ONCE, synchronously — not through update()'s
  // 1500ms debounce, because the overlay closes immediately after and a pending
  // timer would be the only thing holding the new state.
  // Returns true only if the character actually reached the database. The
  // overlay must NOT close on a failed write: it is the only place the created
  // state exists, so closing would silently lose the whole thing — and a 503
  // from the DB guard is exactly the case that made this matter.
  async function finishCreation(state) {
    const d = await apiFetch('/api/character', { method: 'POST', body: JSON.stringify({ state }) }, auth?.token)
      .catch(() => ({ error: 'Connection error.' }));
    if (!d?.ok) return d?.error || 'Could not save. Try again.';
    setCharState(state);
    if (d.updatedAt) serverVersion.current = d.updatedAt;
    setNeedsCreation(false);
    showToast('Welcome to the arena');
    return null;
  }

  if (!auth) return <LoginOverlay onLogin={setAuth} />;
  if (needsCreation) {
    return (
      <CharacterCreation
        username={auth.username}
        onDone={finishCreation}
        onSkip={() => setNeedsCreation(false)}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Top Bar */}
      <div className="topbar">
        <div className="topbar-live"><div className="live-dot" />LIVE</div>
        <div className="topbar-title">GALACTIC PRIME TIME</div>
        <div className="topbar-right">
          <span className={`save-pill ${saveStatus}`}
                title={saveStatus === 'error' ? 'The last save did not reach the server. Your changes are only in this browser — make another edit to retry.' : undefined}>
            {saveStatus === 'saving' ? 'SAVING…' : saveStatus === 'error' ? 'NOT SAVED' : 'SAVED'}
          </span>
          <span style={{ letterSpacing: 1 }}>{auth.username?.toUpperCase()}</span>
          <button className="btn btn-wiki" onClick={() => window.open('/wiki', '_blank')} title="Open the rulebook">📖 Wiki</button>
          <button className="btn btn-danger btn-sm" onClick={logout}>Logout</button>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="tab-nav">
        {TABS.map(t => (
          <button key={t.id} className={`tab-btn${activeTab === t.id ? ' active' : ''}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'body' && <BodyTab state={charState} update={update} showToast={showToast} />}
        {activeTab === 'skills' && <SkillsTab state={charState} update={update} token={auth.token} />}
        {activeTab === 'achievements' && <AchievementsTab state={charState} />}
        {activeTab === 'inventory' && <InventoryTab state={charState} update={update} token={auth?.token} />}
        {activeTab === 'exposure' && <ExposureTab state={charState} update={update} token={auth?.token} />}
        {activeTab === 'objectives' && <ObjectivesTab state={charState} update={update} />}
        {activeTab === 'combat' && <CombatModeTab state={charState} update={update} tracker={tracker} />}
        {activeTab === 'notes' && <NotesTab state={charState} update={update} />}
        {activeTab === 'comms' && <CommsTab auth={auth} />}
      </div>

      <Toast toast={toast} />
    </div>
  );
}
