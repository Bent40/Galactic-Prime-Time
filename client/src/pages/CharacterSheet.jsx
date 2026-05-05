import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../api.js';
import { DEFAULT_STATE, TABS, ALL_TRAITS } from '../constants.js';
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

  useEffect(() => {
    if (!auth) return;
    apiFetch('/api/character', {}, auth.token).then(d => {
      if (d.state) {
        const loadedTraits = d.state.traits || {};
        const mergedTraits = ALL_TRAITS.reduce((acc, t) => ({
          ...acc, [t]: { ...DEFAULT_STATE.traits[t], ...(loadedTraits[t] || {}) },
        }), {});
        const merged = {
          ...DEFAULT_STATE, ...d.state,
          identity: { ...DEFAULT_STATE.identity, ...(d.state.identity || {}) },
          traits: mergedTraits,
          bonusPoints: { ...DEFAULT_STATE.bonusPoints, ...(d.state.bonusPoints || {}) },
          levelPoints: { ...DEFAULT_STATE.levelPoints, ...(d.state.levelPoints || {}) },
          tokens: { ...DEFAULT_STATE.tokens, ...(d.state.tokens || {}) },
          exposure: { ...DEFAULT_STATE.exposure, ...(d.state.exposure || {}) },
          skillPointsSpent: { ...DEFAULT_STATE.skillPointsSpent, ...(d.state.skillPointsSpent || {}) },
        };
        setCharState(merged);
      }
      isLoaded.current = true;
    }).catch(() => { isLoaded.current = true; });

    const pollTracker = () => {
      apiFetch('/api/tracker', {}, auth.token).then(d => { if (!d.error) setTracker(d); });
    };
    pollTracker();
    const iv = setInterval(pollTracker, 12000);
    return () => clearInterval(iv);
  }, [auth]);

  function update(updater) {
    setCharState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (!isLoaded.current) return next;
      setSaveStatus('saving');
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        apiFetch('/api/character', { method: 'POST', body: JSON.stringify({ state: next }) }, auth?.token)
          .then(() => setSaveStatus('saved'))
          .catch(() => setSaveStatus('saved'));
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
  }

  if (!auth) return <LoginOverlay onLogin={setAuth} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Top Bar */}
      <div className="topbar">
        <div className="topbar-live"><div className="live-dot" />LIVE</div>
        <div className="topbar-title">GALACTIC PRIME TIME</div>
        <div className="topbar-right">
          <span className={`save-pill ${saveStatus}`}>{saveStatus === 'saving' ? 'SAVING…' : 'SAVED'}</span>
          <span style={{ letterSpacing: 1 }}>{auth.username?.toUpperCase()}</span>
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
        {activeTab === 'exposure' && <ExposureTab state={charState} update={update} />}
        {activeTab === 'objectives' && <ObjectivesTab state={charState} update={update} />}
        {activeTab === 'combat' && <CombatModeTab state={charState} update={update} tracker={tracker} />}
        {activeTab === 'notes' && <NotesTab state={charState} update={update} />}
        {activeTab === 'comms' && <CommsTab auth={auth} />}
      </div>

      <Toast toast={toast} />
    </div>
  );
}
