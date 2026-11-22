import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../api.js';
import { DEFAULT_STATE, TABS, ALL_TRAITS, reconcilePartHp } from '../constants.js';
import { NO_CHARACTER, shouldPoll, pollOutcome, syncMessage,
  saveSucceeded, retryDelay, canKeepalive, pendingKey, restoreDecision } from '../syncGate.js';
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
  const merged = {
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
  // L-18 — a level the GM granted and the player spent raises every part's max, and
  // current HP has to come with it or the sheet reports an injury nobody took. Done
  // on the way IN as well as in update(), because a trait the GM changed arrives
  // through the poll and never touches update(). Idempotent, so an unsaved sheet
  // reconciles to the same numbers on every load.
  return reconcilePartHp(merged);
}

export default function CharacterSheet() {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    // Before 2026-09-23 login never returned userId, so older sessions stored the
    // string "undefined". The JWT payload always carried it — read it from there.
    let userId = localStorage.getItem('userId');
    if (token && (!userId || userId === 'undefined')) {
      try { userId = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).userId || null; } catch { userId = null; }
      if (userId) localStorage.setItem('userId', userId);
    }
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

  // ── Not losing edits ────────────────────────────────────────────────────────
  // pending is the newest edit the server has not confirmed: { state, gen }.
  // It is mirrored into localStorage, saved on a 1500ms debounce, flushed when
  // the page is hidden or closed, and retried with back-off after a failure and
  // the moment the browser comes back online. The pilot lost edits two ways:
  // a reload inside the debounce, and any edit made while offline.
  const pending = useRef(null);
  const retryTimer = useRef(null);
  const retryAttempt = useRef(0);
  // Bumped on logout so a save still in flight cannot write into the next session.
  const epoch = useRef(0);
  const authRef = useRef(auth);
  authRef.current = auth;

  function storeKey() { return pendingKey(authRef.current); }
  function writeStored(extra = {}) {
    const key = storeKey(); const p = pending.current;
    if (!key || !p) return;
    try {
      localStorage.setItem(key, JSON.stringify({
        state: p.state, baseVersion: serverVersion.current, flushed: false, ...extra,
      }));
    } catch { /* full or blocked storage: the server save still runs */ }
  }
  function readStored() {
    const key = storeKey(); if (!key) return null;
    try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
  }
  function clearStored() {
    const key = storeKey(); if (!key) return;
    try { localStorage.removeItem(key); } catch { /* ignore */ }
  }

  // Send the pending edit now. `leaving` = the page is being hidden or closed,
  // so use a keepalive request (the only kind a browser still sends while
  // unloading) when the body is small enough for one.
  function saveNow({ leaving = false } = {}) {
    const p = pending.current;
    const token = authRef.current?.token;
    if (!p || !token) return;
    clearTimeout(saveTimer.current);
    clearTimeout(retryTimer.current);
    const myEpoch = epoch.current;
    const body = JSON.stringify({ state: p.state });
    const keepalive = leaving && canKeepalive(body);
    // Only a keepalive request survives the unload, so only it may be assumed
    // to have landed when the page next loads.
    if (keepalive) writeStored({ flushed: true });
    setSaveStatus('saving');
    apiFetch('/api/character', { method: 'POST', body, ...(keepalive ? { keepalive: true } : {}) }, token)
      .then(d => {
        if (epoch.current !== myEpoch) return;
        if (!saveSucceeded(d)) throw new Error(d?.error || 'save failed');
        if (p.gen > syncedGen.current) syncedGen.current = p.gen;
        if (d.updatedAt) serverVersion.current = d.updatedAt;
        retryAttempt.current = 0;
        if (pending.current === p) {
          pending.current = null;
          clearStored();
          setSaveStatus('saved');
        } else {
          writeStored(); // a newer edit is waiting; re-base it on the new version
        }
      })
      .catch(() => {
        if (epoch.current !== myEpoch) return;
        if (pending.current !== p) return; // a newer edit owns the next save
        // A failed save used to report 'SAVED', and later just sat there. The
        // edit is still only in this browser, so say so AND keep trying.
        setSaveStatus('error');
        writeStored();
        retryTimer.current = setTimeout(() => saveNow(), retryDelay(retryAttempt.current++));
      });
  }
  const saveNowRef = useRef(saveNow);
  saveNowRef.current = saveNow;

  useEffect(() => {
    const flush = () => { if (pending.current) saveNowRef.current({ leaving: true }); };
    const onVisibility = () => { if (document.visibilityState === 'hidden') flush(); };
    const onOnline = () => { if (pending.current) saveNowRef.current(); };
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('online', onOnline);
    return () => {
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('online', onOnline);
    };
  }, []);

  useEffect(() => {
    if (!auth) return;
    apiFetch('/api/character', {}, auth.token).then(d => {
      if (d.state) {
        serverVersion.current = d.updatedAt || null;
        setNeedsCreation(false);
        const stored = readStored();
        const decision = restoreDecision({ stored, serverUpdatedAt: d.updatedAt });
        if (decision === 'restore') {
          // Edits from the last visit never got a confirmed save, and the server
          // has not moved since: they are the newest copy. Put them back and save.
          const restored = mergeLoadedState(stored.state);
          setCharState(restored);
          localGen.current += 1;
          pending.current = { state: restored, gen: localGen.current };
          saveNowRef.current();
          showToast('Restored changes that had not saved yet');
        } else {
          setCharState(mergeLoadedState(d.state));
          if (decision === 'conflict') {
            clearStored();
            showToast('Changes from your last visit did not save, and the GM has changed your sheet since. Showing the GM\'s version.', 'err');
          } else if (decision === 'landed') {
            clearStored();
          }
        }
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
      // Every local edit goes through here, so this is the one place a trait change
      // made on the sheet can carry current HP along with the max it just raised.
      const next = reconcilePartHp(typeof updater === 'function' ? updater(prev) : updater);
      if (!isLoaded.current) return next;
      setSaveStatus('saving');
      // Mark the sheet dirty BEFORE the debounce. The poll reads this, so the
      // window between a keystroke and the save has to count as dirty too —
      // otherwise a poll landing inside those 1500ms would discard the edit.
      localGen.current += 1;
      pending.current = { state: next, gen: localGen.current };
      writeStored();
      retryAttempt.current = 0;
      clearTimeout(retryTimer.current);
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => saveNowRef.current(), 1500);
      return next;
    });
  }

  function logout() {
    // Send any unsaved edit while we still hold the token. It also stays in
    // localStorage under this user, so the next login restores it if this fails.
    if (pending.current) saveNow({ leaving: true });
    epoch.current += 1;
    pending.current = null;
    clearTimeout(saveTimer.current);
    clearTimeout(retryTimer.current);
    retryAttempt.current = 0;
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
        token={auth.token}
        onDone={finishCreation}
        // Skip used to just close the wizard, so the sheet behind it existed only
        // in this tab and a reload sent the player back into creation. It now
        // saves a blank character through the same confirmed write as Done.
        onSkip={() => finishCreation({
          ...DEFAULT_STATE,
          identity: { ...DEFAULT_STATE.identity, name: auth.username || 'Unnamed Contestant' },
        })}
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
                title={saveStatus === 'error' ? 'The last save did not reach the server. Your changes are kept in this browser and will be sent again automatically.' : undefined}>
            {saveStatus === 'saving' ? 'SAVING…' : saveStatus === 'error' ? 'NOT SAVED' : 'SAVED'}
          </span>
          <span style={{ letterSpacing: 1 }}>{auth.username?.toUpperCase()}</span>
          <button className="btn btn-cyan btn-sm" onClick={() => window.open('/table', '_blank')} title="Open the table (map, dice, chat)">🎲 Table</button>
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
