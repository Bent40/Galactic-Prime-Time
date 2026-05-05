import { useState, useEffect } from 'react';
import { apiFetch } from '../api.js';
import LoginOverlay from '../components/shared/LoginOverlay.jsx';
import Toast, { useToast } from '../components/shared/Toast.jsx';
import PlayerPanel from '../components/admin/PlayerPanel.jsx';
import SkillLibrarySection from '../components/admin/SkillLibrarySection.jsx';
import AllAchievementsSection from '../components/admin/AllAchievementsSection.jsx';
import CommsSection from '../components/admin/CommsSection.jsx';
import MomentTrackerSection from '../components/admin/MomentTrackerSection.jsx';
import ItemLibrarySection from '../components/admin/ItemLibrarySection.jsx';
import EnemiesSection from '../components/admin/EnemiesSection.jsx';
import AffixLibrarySection from '../components/admin/AffixLibrarySection.jsx';

const SECTIONS = ['players', 'library', 'achievements', 'comms', 'tracker', 'items', 'affixes', 'enemies'];
const SECTION_LABELS = { players: 'Players', library: 'Skill Library', achievements: 'All Achievements', comms: 'Comms', tracker: 'Moment Tracker', items: 'Item Library', affixes: 'Affixes', enemies: 'Enemies' };

export default function AdminPanel() {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('adminToken');
    const username = localStorage.getItem('adminUsername');
    return token ? { token, username } : null;
  });
  const [players, setPlayers] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [activeSection, setActiveSection] = useState('players');
  const [toast, showToast] = useToast();
  const [bulkSelecting, setBulkSelecting] = useState(false);
  const [bulkSel, setBulkSel] = useState([]);
  const [bulkAchForm, setBulkAchForm] = useState({ title: '', desc: '', reward: '' });
  const [bulkObjForm, setBulkObjForm] = useState({ section: 'main', title: '', description: '', status: 'active' });
  const [bulkFollowers, setBulkFollowers] = useState('');

  useEffect(() => { if (auth) { loadPlayers(); loadEnemies(); } }, [auth]);

  function loadPlayers() {
    apiFetch('/api/admin/players', {}, auth.token).then(d => { if (Array.isArray(d)) setPlayers(d); });
  }
  function loadEnemies() {
    apiFetch('/api/enemies', {}, auth.token).then(d => { if (Array.isArray(d)) setEnemies(d); });
  }
  function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    setAuth(null);
  }

  async function bulkGrantAch() {
    if (!bulkAchForm.title || bulkSel.length === 0) return;
    const d = await apiFetch('/api/admin/players/bulk/achievements', { method: 'POST', body: JSON.stringify({ userIds: bulkSel, ...bulkAchForm }) }, auth.token);
    const ok = d.results?.filter(r => r.ok).length || 0;
    showToast(`Granted to ${ok}/${bulkSel.length} players`);
    setBulkAchForm({ title: '', desc: '', reward: '' });
    setBulkSel([]);
  }
  async function bulkSendObj() {
    if (!bulkObjForm.title || bulkSel.length === 0) return;
    const d = await apiFetch('/api/admin/players/bulk/objectives', { method: 'POST', body: JSON.stringify({ userIds: bulkSel, ...bulkObjForm }) }, auth.token);
    const ok = d.results?.filter(r => r.ok).length || 0;
    showToast(`Sent to ${ok}/${bulkSel.length} players`);
    setBulkObjForm({ section: 'main', title: '', description: '', status: 'active' });
    setBulkSel([]);
  }
  async function bulkSetFollowers() {
    if (!bulkFollowers.trim() || bulkSel.length === 0) return;
    const d = await apiFetch('/api/admin/players/bulk/followers', { method: 'PATCH', body: JSON.stringify({ userIds: bulkSel, followers: bulkFollowers.trim() }) }, auth.token);
    const ok = d.results?.filter(r => r.ok).length || 0;
    showToast(`Followers set for ${ok}/${bulkSel.length} players`);
    setBulkFollowers('');
    setBulkSel([]);
  }

  if (!auth) return <LoginOverlay onLogin={setAuth} isAdmin />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Topbar */}
      <div className="topbar admin">
        <div>
          <div className="topbar-title admin">GALACTIC PRIME TIME</div>
          <div className="topbar-sub">Admin Control Panel</div>
        </div>
        <div className="topbar-right">
          <span className="admin-badge">ADMIN</span>
          <span style={{ color: 'var(--muted)', fontSize: 11, letterSpacing: 1 }}>{auth.username?.toUpperCase()}</span>
          <button className="btn btn-danger btn-sm" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="admin-app-layout">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">
            <span className="sidebar-label">Players ({players.length})</span>
            <div className="row" style={{ gap: 5 }}>
              <button className="btn btn-muted btn-sm" onClick={loadPlayers}>↻</button>
              <button className={`btn btn-sm ${bulkSelecting ? 'btn-purple' : 'btn-muted'}`} onClick={() => { setBulkSelecting(v => !v); setBulkSel([]); }}>Bulk</button>
            </div>
          </div>

          {bulkSelecting && (
            <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--border)', background: 'rgba(168,85,247,.07)' }}>
              <div style={{ fontSize: 9, color: 'var(--purple)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Bulk — {bulkSel.length} selected</div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 8, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Grant Achievement</div>
                <input className="fi" style={{ fontSize: 11, padding: '3px 6px', marginBottom: 4 }} placeholder="Title" value={bulkAchForm.title} onChange={e => setBulkAchForm(f => ({ ...f, title: e.target.value }))} />
                <input className="fi" style={{ fontSize: 11, padding: '3px 6px', marginBottom: 4 }} placeholder="Description" value={bulkAchForm.desc} onChange={e => setBulkAchForm(f => ({ ...f, desc: e.target.value }))} />
                <input className="fi" style={{ fontSize: 11, padding: '3px 6px', marginBottom: 4 }} placeholder="Reward" value={bulkAchForm.reward} onChange={e => setBulkAchForm(f => ({ ...f, reward: e.target.value }))} />
                <button className="btn btn-gold btn-xs" onClick={bulkGrantAch} style={{ width: '100%' }}>Grant to Selected</button>
              </div>
              <div>
                <div style={{ fontSize: 8, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Send Objective</div>
                <select className="fi" style={{ fontSize: 11, padding: '3px 6px', marginBottom: 4 }} value={bulkObjForm.section} onChange={e => setBulkObjForm(f => ({ ...f, section: e.target.value }))}>
                  <option value="main">Main</option><option value="directives">Directives</option><option value="goals">Goals</option>
                </select>
                <input className="fi" style={{ fontSize: 11, padding: '3px 6px', marginBottom: 4 }} placeholder="Objective title" value={bulkObjForm.title} onChange={e => setBulkObjForm(f => ({ ...f, title: e.target.value }))} />
                <input className="fi" style={{ fontSize: 11, padding: '3px 6px', marginBottom: 4 }} placeholder="Description" value={bulkObjForm.description} onChange={e => setBulkObjForm(f => ({ ...f, description: e.target.value }))} />
                <select className="fi" style={{ fontSize: 11, padding: '3px 6px', marginBottom: 4 }} value={bulkObjForm.status} onChange={e => setBulkObjForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="active">Active</option><option value="complete">Complete</option><option value="failed">Failed</option>
                </select>
                <button className="btn btn-cyan btn-xs" onClick={bulkSendObj} style={{ width: '100%' }}>Send to Selected</button>
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 8, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Set Followers</div>
                <input className="fi" style={{ fontSize: 11, padding: '3px 6px', marginBottom: 4 }} placeholder="e.g. 1.5B, 200.6T" value={bulkFollowers} onChange={e => setBulkFollowers(e.target.value)} />
                <button className="btn btn-purple btn-xs" onClick={bulkSetFollowers} style={{ width: '100%' }}>Set for Selected</button>
              </div>
            </div>
          )}

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {players.map(p => (
              <div
                key={p.userId}
                className={`player-item${selectedPlayer?.userId === p.userId && activeSection === 'players' ? ' active' : ''}`}
                onClick={() => {
                  if (bulkSelecting) { setBulkSel(s => s.includes(p.userId) ? s.filter(x => x !== p.userId) : [...s, p.userId]); return; }
                  setSelectedPlayer(p);
                  setActiveSection('players');
                }}
              >
                {bulkSelecting && <input type="checkbox" checked={bulkSel.includes(p.userId)} readOnly />}
                <div className="player-avatar">{p.characterName?.[0] || p.username[0].toUpperCase()}</div>
                <div className="player-info">
                  <div className="player-username">{p.username}</div>
                  <div className="player-charname">{p.characterName || 'No character'}</div>
                </div>
                <div className="player-lvl">Lv{p.level || 1}</div>
              </div>
            ))}
            {players.length === 0 && <div style={{ padding: 20, color: 'var(--muted)', fontSize: 11, textAlign: 'center', letterSpacing: 1 }}>NO PLAYERS</div>}
          </div>
        </div>

        {/* Main Content */}
        <div className="content-area">
          <div className="content-nav">
            {SECTIONS.map(s => (
              <button key={s} className={`cnav-tab${activeSection === s ? ' active' : ''}`} onClick={() => setActiveSection(s)}>
                {SECTION_LABELS[s]}
              </button>
            ))}
          </div>
          <div className="section-page">
            {activeSection === 'players' && (
              selectedPlayer
                ? <PlayerPanel key={selectedPlayer.userId} player={selectedPlayer} token={auth.token} showToast={showToast} onRefresh={loadPlayers} />
                : <div className="empty-state"><div className="empty-icon">👤</div><div className="empty-text">Select a player</div></div>
            )}
            {activeSection === 'library' && <SkillLibrarySection token={auth.token} showToast={showToast} />}
            {activeSection === 'achievements' && <AllAchievementsSection token={auth.token} />}
            {activeSection === 'comms' && <CommsSection token={auth.token} players={players} showToast={showToast} />}
            {activeSection === 'tracker' && <MomentTrackerSection token={auth.token} players={players} enemies={enemies} showToast={showToast} />}
            {activeSection === 'items' && <ItemLibrarySection token={auth.token} players={players} showToast={showToast} />}
            {activeSection === 'affixes' && <AffixLibrarySection token={auth.token} showToast={showToast} />}
            {activeSection === 'enemies' && <EnemiesSection token={auth.token} showToast={showToast} onEnemiesChange={setEnemies} />}
          </div>
        </div>
      </div>

      <Toast toast={toast} />
    </div>
  );
}
