import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api.js';
import LoginOverlay from '../components/shared/LoginOverlay.jsx';
import Toast, { useToast } from '../components/shared/Toast.jsx';
import TrackerBar from '../components/shared/TrackerBar.jsx';
import HexBoard from '../table/HexBoard.jsx';
import SoundPlayer from '../table/SoundPlayer.jsx';
import DiceTray from '../table/DiceTray.jsx';
import TableChat from '../table/TableChat.jsx';
import useTablePoll from '../table/useTablePoll.js';
import useTableSocket from '../table/useTableSocket.js';
import { moveCost } from '../table/hex.js';

/**
 * /table — the PLAYER's seat. Shows the table they are seated at (a picker if several),
 * its live map, their own token draggable, the Clock, the book's dice and the chat.
 * Their body panel reads the character sheet — the token never stores HP.
 */
function readAuth() {
  const token = localStorage.getItem('token'); if (!token) return null;
  let userId = localStorage.getItem('userId');
  if (!userId || userId === 'undefined') { try { userId = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).userId || null; } catch { userId = null; } }
  return { token, userId, username: localStorage.getItem('username') };
}

export default function TablePage() {
  const [auth, setAuth] = useState(readAuth);
  const [tables, setTables] = useState(null);
  const [tableId, setTableId] = useState(() => localStorage.getItem('tableId') || '');
  const [toast, showToast] = useToast();
  const [tool, setTool] = useState('move');
  const [selected, setSelected] = useState(null);
  const [pings, setPings] = useState([]);
  const [tracker, setTracker] = useState(null);
  const [sheet, setSheet] = useState(null);
  const [rolled, setRolled] = useState([]);
  const [players, setPlayers] = useState([]);
  const [armed, setArmed] = useState(null);   // the skill waiting for a target

  useEffect(() => {
    if (!auth) return;
    apiFetch('/api/tables/mine', {}, auth.token).then(d => {
      if (!Array.isArray(d)) { setTables([]); return; }
      setTables(d);
      if (d.length && !d.some(t => String(t._id) === tableId)) setTableId(String(d[0]._id));
    });
    apiFetch('/api/players', {}, auth.token).then(d => { if (Array.isArray(d)) setPlayers(d.filter(p => !p.isNPC && p.userId !== auth.userId)); });
  }, [auth]);
  useEffect(() => { if (tableId) localStorage.setItem('tableId', tableId); }, [tableId]);

  const [chatKey, setChatKey] = useState(0);
  const [socketOn, setSocketOn] = useState(false);
  // the socket is the notifier; the poll is the fallback and slows down while it is up
  const { live, error, image, clock, refresh, patchLocal } = useTablePoll(tableId, auth?.token, socketOn ? 15000 : 2000);
  const loadTracker = () => auth && apiFetch('/api/tracker', {}, auth.token).then(d => { if (d && !d.error) setTracker(d); });
  const loadSheet = () => auth && apiFetch('/api/character', {}, auth.token).then(d => { if (d && d.state) setSheet(d.state); });
  const connected = useTableSocket(tableId, auth?.token, {
    onTable: () => refresh(),
    onTracker: () => loadTracker(),
    onChat: () => setChatKey(k => k + 1),
  });
  useEffect(() => setSocketOn(connected), [connected]);

  // the Clock + my sheet, on the sheet's own cadence
  useEffect(() => {
    if (!auth) return;
    const load = () => { loadTracker(); loadSheet(); };
    load(); const iv = setInterval(load, socketOn ? 20000 : 6000); return () => clearInterval(iv);
  }, [auth, socketOn]);

  const myToken = useMemo(() => live?.map?.tokens.find(t => t.kind === 'player' && t.refId === String(auth?.userId)) || null, [live, auth]);
  const selToken = useMemo(() => live?.map?.tokens.find(t => t.tokenId === selected) || null, [live, selected]);

  async function moveToken(tok, cell, dist) {
    patchLocal(l => ({ ...l, map: { ...l.map, tokens: l.map.tokens.map(t => t.tokenId === tok.tokenId ? { ...t, col: cell.col, row: cell.row } : t) } }));
    const d = await apiFetch(`/api/tables/${tableId}/tokens/${tok.tokenId}/move`, { method: 'PATCH', body: JSON.stringify(cell) }, auth.token);
    if (d.error) { showToast(d.error, 'err'); refresh(); }
    else showToast(`${dist} space${dist > 1 ? 's' : ''} — ${moveCost(dist).label}`);
  }
  async function useSkill(cell, tok) {
    if (!armed) return;
    const body = tok ? { skillId: armed.id, targetTokenId: tok.tokenId } : { skillId: armed.id, to: cell };
    const d = await apiFetch(`/api/tables/${tableId}/use-skill`, { method: 'POST', body: JSON.stringify(body) }, auth.token);
    setArmed(null); setTool('move');
    if (d.error) showToast(d.error, 'err'); else { refresh(); if (d.message) setRolled(r => [...r, d.message]); }
  }
  function armSkill(sk) {
    if (armed?.id === sk.id) { setArmed(null); setTool('move'); return; }
    setArmed(sk); setTool('fx'); showToast(`${sk.name}: click a target on the map`);
  }
  function ping(cell) { const id = Date.now(); setPings(p => [...p, { ...cell, id }]); setTimeout(() => setPings(p => p.filter(x => x.id !== id)), 1300); }

  if (!auth) return <LoginOverlay onLogin={a => setAuth(a)} isAdmin={false} />;
  if (tables && tables.length === 0) return (
    <div className="table-empty"><div className="topbar-title">GPT</div><p>You are not seated at a table yet. Ask the GM to seat you.</p><Link to="/" className="btn btn-cyan btn-sm">Back to the sheet</Link></div>
  );

  const map = live?.map;
  return (
    <div className="tablepage">
      <header className="topbar table-top">
        <div className="topbar-live"><span className="live-dot" />On air</div>
        <div className="topbar-title" style={{ fontSize: 14 }}>{live?.name || 'Table'}</div>
        {tables && tables.length > 1 && <select className="fi" value={tableId} onChange={e => setTableId(e.target.value)} style={{ width: 'auto' }}>{tables.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}</select>}
        <span className="spacer" />
        <SoundPlayer cue={live?.cue} sound={live?.sound} serverNow={clock.serverNow} syncedAt={clock.syncedAt} compact />
        <span className={`sync-dot${socketOn ? ' on' : ''}`} title={socketOn ? 'live (socket)' : 'polling every 2 s'} />
        <Link to="/" className="btn btn-muted btn-xs">Sheet</Link>
        {error && <span className="table-err">{error}</span>}
      </header>
      <div className="table-rail"><TrackerBar tracker={tracker} /></div>
      <div className="table-body">
        <aside className="table-side left">
          <h3>Seated</h3>
          {(live?.seats || []).map(uid => { const p = uid === String(auth.userId) ? { displayName: sheet?.identity?.name || auth.username } : players.find(x => x.userId === uid); return <div key={uid} className="row"><span className="dot on" /><span className="nm">{p?.displayName || p?.username || uid}</span></div>; })}
          <h3 style={{ marginTop: 12 }}>My body</h3>
          {sheet ? (
            <div className="partsbox">{(sheet.bodyParts || []).map(p => <div key={p.id} className={`part${p.lethal ? ' lethal' : ''}`}><span>{p.name}</span><b>{p.currentHp}/{p.maxHp}</b></div>)}</div>
          ) : <div className="hint">No sheet loaded.</div>}
          {!myToken && map && <div className="hint" style={{ marginTop: 8 }}>You have no token on this map yet — the GM places it.</div>}
        </aside>
        <main className="table-map">
          {map ? (
            <>
              <div className="board-tools" role="toolbar">
                {['move', 'measure', 'ping'].map(t => <button key={t} type="button" className={`tool${tool === t ? ' on' : ''}`} onClick={() => { setTool(t); setArmed(null); }}>{t}</button>)}
                {armed && <button type="button" className="tool on" onClick={() => { setArmed(null); setTool('move'); }}>⚡ {armed.name} — pick a target ✕</button>}
              </div>
              <HexBoard map={map} image={image} role="player" myUserId={auth.userId} selectedId={selected} tool={tool}
                        onSelect={t => setSelected(t.tokenId)} onMoveToken={moveToken} onPing={ping} onFxTarget={useSkill} pings={pings} fx={live.fx} />
              <div className="board-info">{armed ? `click a token or hex to use ${armed.name}` : '1 space = 1 hex · free move 1–4 · wheel zooms · drag empty ground to pan'}</div>
            </>
          ) : <div className="table-empty small">{live ? 'The GM has not put a map live yet.' : 'Loading the table…'}</div>}
        </main>
        <aside className="table-side right">
          {selToken && (
            <div className="selbox">
              <h3>Selected</h3>
              <div className="sel-name">{selToken.name} <small>{selToken.size}{selToken.tier ? ' · ' + selToken.tier : ''}</small></div>
              {selToken.conditions?.length > 0 && <div className="hint" style={{ color: 'var(--danger)' }}>{selToken.conditions.join(' · ')}</div>}
              {selToken.kind === 'player' && selToken.refId === String(auth.userId) && <div className="hint">That's you. Drag to move.</div>}
            </div>
          )}
          <h3>Skills — click one, then a target</h3>
          <div className="skilllist">
            {(sheet?.skills || []).filter(sk => sk.name && !sk.passive).map(sk => (
              <button key={sk.id} type="button" className={`skillbtn${armed?.id === sk.id ? ' on' : ''}`} onClick={() => armSkill(sk)} disabled={!map} title={sk.effect || ''}>
                <span className="sk-name">{sk.name}</span>
                <span className="sk-meta">Lv {sk.level || 0}{sk.momentCost ? ` · ${sk.momentCost}` : ''}{sk.damageTypes?.length ? ` · ${sk.damageTypes.join('+')}` : ''}</span>
              </button>
            ))}
            {sheet && !(sheet.skills || []).some(sk => sk.name && !sk.passive) && <div className="hint">No active skills on your sheet.</div>}
          </div>
          <h3 style={{ marginTop: 10 }}>Dice</h3>
          <DiceTray tableId={tableId} token={auth.token} role="player" onRolled={m => setRolled(r => [...r, m])} showToast={showToast} />
          <h3 style={{ marginTop: 10 }}>Table talk</h3>
          <TableChat token={auth.token} role="player" players={players} injected={rolled} refreshKey={chatKey} pollMs={socketOn ? 20000 : 3000} />
        </aside>
      </div>
      <Toast toast={toast} />
    </div>
  );
}
