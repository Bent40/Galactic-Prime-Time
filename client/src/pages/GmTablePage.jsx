import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
import { FX_TYPES, FX_STYLE } from '../table/FxLayer.jsx';
import { moveCost, key } from '../table/hex.js';

/**
 * /gm/:tableId — the GM's table. Same board as the players, plus: every token drags,
 * hide/reveal, add tokens from the enemy library or the seated players, per-part HP
 * (an enemy token's own parts; a player's through the sheet), conditions, the fog
 * brush, visual effects by damage type, the sound cues, GM-only dice, the Clock.
 */
const TIER_COLOR = { mob: '#ff2255', elite: '#00d4ff', boss: '#d9bb63', legendary: '#bd7cff', player: '#00d4ff' };
const initials = (n) => n.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();

export default function GmTablePage() {
  const { tableId } = useParams();
  const [auth, setAuth] = useState(() => { const t = localStorage.getItem('adminToken'); return t ? { token: t, username: localStorage.getItem('adminUsername') } : null; });
  const [toast, showToast] = useToast();
  const [tool, setTool] = useState('move');
  const [fxType, setFxType] = useState('Bleed');
  const [selected, setSelected] = useState(null);
  const [pings, setPings] = useState([]);
  const [tracker, setTracker] = useState(null);
  const [table, setTable] = useState(null);       // full table incl. maps (no images)
  const [enemies, setEnemies] = useState([]);
  const [players, setPlayers] = useState([]);
  const [playerSheets, setPlayerSheets] = useState({});   // userId → state (for player tokens' parts)
  const [rolled, setRolled] = useState([]);
  const [addFilter, setAddFilter] = useState('');
  const [condText, setCondText] = useState('');
  const [ability, setAbility] = useState('');   // fx tool: an ability name makes the click a 'use skill' (announced + inferred type)

  const [chatKey, setChatKey] = useState(0);
  const [socketOn, setSocketOn] = useState(false);
  const { live, error, image, clock, refresh, patchLocal } = useTablePoll(tableId, auth?.token, socketOn ? 15000 : 2000);
  const map = live?.map;
  const loadTracker = () => auth && apiFetch('/api/tracker', {}, auth.token).then(d => { if (d && !d.error) setTracker(d); });
  const loadTable = () => auth && apiFetch(`/api/tables/${tableId}`, {}, auth.token).then(d => { if (d && !d.error) setTable(d); });
  const connected = useTableSocket(tableId, auth?.token, {
    onTable: (e) => { refresh(); if (/map|cues|seats|table/.test(e.event)) loadTable(); },
    onTracker: () => loadTracker(),
    onChat: () => setChatKey(k => k + 1),
  });
  useEffect(() => setSocketOn(connected), [connected]);

  useEffect(() => {
    if (!auth) return;
    const load = () => { loadTable(); loadTracker(); };
    load();
    apiFetch('/api/enemies', {}, auth.token).then(d => { if (Array.isArray(d)) setEnemies(d); });
    apiFetch('/api/admin/players', {}, auth.token).then(d => { if (Array.isArray(d)) setPlayers(d.filter(p => !p.isAdmin)); });
    const iv = setInterval(load, socketOn ? 20000 : 5000); return () => clearInterval(iv);
  }, [auth, tableId, socketOn]);

  const selToken = useMemo(() => map?.tokens.find(t => t.tokenId === selected) || null, [map, selected]);
  // a player token's parts come from the sheet, refreshed with the poll
  useEffect(() => {
    if (!auth || !map) return;
    const ids = map.tokens.filter(t => t.kind === 'player').map(t => t.refId);
    ids.forEach(uid => apiFetch(`/api/admin/players/${uid}`, {}, auth.token).then(d => { if (d && d.state) setPlayerSheets(s => ({ ...s, [uid]: d.state })); }));
  }, [auth, map?.updatedAt, map?.tokens.length]);

  // ── token verbs ──────────────────────────────────────────────────────────
  const mapPath = () => `/api/tables/${tableId}/maps/${map._id}`;
  async function patchToken(tok, body) {
    patchLocal(l => ({ ...l, map: { ...l.map, tokens: l.map.tokens.map(t => t.tokenId === tok.tokenId ? { ...t, ...body } : t) } }));
    const d = await apiFetch(`${mapPath()}/tokens/${tok.tokenId}`, { method: 'PATCH', body: JSON.stringify(body) }, auth.token);
    if (d.error) { showToast(d.error, 'err'); refresh(); }
  }
  async function moveToken(tok, cell, dist) { await patchToken(tok, cell); if (dist) showToast(`${tok.name}: ${dist} space${dist > 1 ? 's' : ''} — ${moveCost(dist).label}`); }
  async function removeToken(tok) {
    if (!confirm(`Remove ${tok.name} from the map?`)) return;
    const d = await apiFetch(`${mapPath()}/tokens/${tok.tokenId}`, { method: 'DELETE' }, auth.token);
    if (d.error) showToast(d.error, 'err'); else { setSelected(null); refresh(); }
  }
  async function addEnemy(en) {
    const parts = (en.bodyParts || []).map(p => ({ name: p.name, maxHp: p.maxHp, currentHp: p.maxHp, lethal: /head|torso/i.test(p.name) }));
    const n = map.tokens.filter(t => t.refId === String(en._id)).length;
    const body = { kind: 'enemy', refId: String(en._id), name: n ? `${en.name} ${n + 1}` : en.name, label: en.tier === 'mob' ? '●' : initials(en.name),
                   color: en.color || TIER_COLOR[en.tier] || '#ff2255', tier: en.tier || 'mob', size: en.size || 'Medium', col: 1, row: 1, hidden: true, parts };
    const d = await apiFetch(`${mapPath()}/tokens`, { method: 'POST', body: JSON.stringify(body) }, auth.token);
    if (d.error) showToast(d.error, 'err'); else { refresh(); setSelected(d.tokenId); showToast(`${d.name} placed (hidden) at 1,1`); }
  }
  async function addPlayer(p) {
    if (map.tokens.some(t => t.kind === 'player' && t.refId === p.userId)) return showToast(`${p.characterName || p.username} is already on the map`, 'err');
    const sheet = await apiFetch(`/api/admin/players/${p.userId}`, {}, auth.token);
    const name = sheet?.state?.identity?.name || p.characterName || p.username;
    const body = { kind: 'player', refId: p.userId, name, label: initials(name), color: '#00d4ff', tier: 'player', size: sheet?.state?.identity?.size || 'Medium', col: 1, row: 1, hidden: false };
    const d = await apiFetch(`${mapPath()}/tokens`, { method: 'POST', body: JSON.stringify(body) }, auth.token);
    if (d.error) showToast(d.error, 'err'); else { refresh(); setSelected(d.tokenId); }
  }
  async function damagePart(tok, part, delta) {
    if (tok.kind === 'player') {
      const d = await apiFetch(`/api/admin/players/${tok.refId}/parts/${part.id ?? part.name}`, { method: 'PATCH', body: JSON.stringify({ delta }) }, auth.token);
      if (d.error) showToast(d.error, 'err'); else setPlayerSheets(s => ({ ...s, [tok.refId]: { ...s[tok.refId], bodyParts: (s[tok.refId]?.bodyParts || []).map(p => (p.id === part.id ? { ...p, currentHp: d.part.currentHp } : p)) } }));
    } else {
      const parts = tok.parts.map(p => p.name === part.name ? { ...p, currentHp: Math.max(0, Math.min(p.maxHp, p.currentHp + delta)) } : p);
      await patchToken(tok, { parts });
    }
  }
  async function toggleCondition(tok, text, add) {
    const conditions = add ? [...(tok.conditions || []), text] : (tok.conditions || []).filter(c => c !== text);
    await patchToken(tok, { conditions });
  }

  // ── fog / fx / ping ───────────────────────────────────────────────────────
  const fogTimer = useMemo(() => ({ t: null, keys: new Set() }), []);
  function fogPaint(keys) {
    if (!map) return;
    const next = new Set(map.revealed || []); let changed = false;
    for (const k of keys) if (!next.has(k)) { next.add(k); changed = true; }
    if (!changed) return;
    const revealed = [...next];
    patchLocal(l => ({ ...l, map: { ...l.map, revealed } }));
    clearTimeout(fogTimer.t);
    fogTimer.t = setTimeout(() => apiFetch(`${mapPath()}`, { method: 'PATCH', body: JSON.stringify({ revealed }) }, auth.token).then(d => d.error && showToast(d.error, 'err')), 400);
  }
  async function setFog(on) { const d = await apiFetch(`${mapPath()}`, { method: 'PATCH', body: JSON.stringify(on === 'reset' ? { revealed: [] } : { fogEnabled: on }) }, auth.token); if (d.error) showToast(d.error, 'err'); else refresh(); }
  async function fireFx(cell, tok) {
    if (ability.trim()) {
      const body = { name: ability.trim(), actorTokenId: selToken?.tokenId, type: fxType === 'auto' ? undefined : fxType, ...(tok ? { targetTokenId: tok.tokenId } : { to: cell }) };
      const d = await apiFetch(`/api/tables/${tableId}/use-skill`, { method: 'POST', body: JSON.stringify(body) }, auth.token);
      if (d.error) showToast(d.error, 'err'); else { refresh(); if (d.message) setRolled(r => [...r, d.message]); }
      return;
    }
    const from = selToken && selToken !== tok ? { col: selToken.col, row: selToken.row } : null;
    const body = { type: fxType, to: cell, from, label: tok ? `${fxType} → ${tok.name}` : fxType };
    const d = await apiFetch(`/api/tables/${tableId}/fx`, { method: 'POST', body: JSON.stringify(body) }, auth.token);
    if (d.error) showToast(d.error, 'err'); else refresh();
  }
  function ping(cell) { const id = Date.now(); setPings(p => [...p, { ...cell, id }]); setTimeout(() => setPings(p => p.filter(x => x.id !== id)), 1300); }

  // ── sound / clock / maps ──────────────────────────────────────────────────
  async function playCue(cueId) { const d = await apiFetch(`/api/tables/${tableId}/sound`, { method: 'POST', body: JSON.stringify(cueId ? { cueId } : { stop: true }) }, auth.token); if (d.error) showToast(d.error, 'err'); else refresh(); }
  async function clockStep(verb) { const d = await apiFetch(`/api/tracker/${verb}`, { method: 'PATCH' }, auth.token); if (!d.error) setTracker(d); }
  async function goLive(mapId) { const d = await apiFetch(`/api/tables/${tableId}`, { method: 'PATCH', body: JSON.stringify({ activeMapId: mapId }) }, auth.token); if (d.error) showToast(d.error, 'err'); else { setSelected(null); refresh(); } }

  if (!auth) return <LoginOverlay onLogin={a => setAuth(a)} isAdmin={true} />;

  const selParts = selToken ? (selToken.kind === 'player' ? (playerSheets[selToken.refId]?.bodyParts || []).map(p => ({ ...p, maxHp: p.maxHp })) : selToken.parts) : [];
  const filteredEnemies = enemies.filter(e => !addFilter || e.name.toLowerCase().includes(addFilter.toLowerCase()));

  return (
    <div className="tablepage gm">
      <header className="topbar admin table-top">
        <div className="topbar-title admin" style={{ fontSize: 13 }}>GM · {live?.name || table?.name || 'Table'}</div>
        <select className="fi" value={live?.activeMapId ? String(live.activeMapId) : ''} onChange={e => goLive(e.target.value || null)} style={{ width: 'auto' }} title="Which map is live">
          <option value="">— no map live —</option>
          {(table?.maps || []).map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
        </select>
        <div className="clock-ctl">
          <button className="btn btn-muted btn-xs" type="button" onClick={() => clockStep('retreat')}>◀</button>
          <span className="lbl">Moment</span><b>{tracker?.currentMoment ?? '—'}</b>
          <button className="btn btn-cyan btn-xs" type="button" onClick={() => clockStep('advance')}>▶ advance</button>
        </div>
        <span className="spacer" />
        <SoundPlayer cue={live?.cue} sound={live?.sound} serverNow={clock.serverNow} syncedAt={clock.syncedAt} compact />
        <span className={`sync-dot${socketOn ? ' on' : ''}`} title={socketOn ? 'live (socket)' : 'polling every 2 s'} />
        <Link to="/admin" className="btn btn-muted btn-xs">Admin</Link>
        {error && <span className="table-err">{error}</span>}
      </header>
      <div className="table-rail"><TrackerBar tracker={tracker} /></div>
      <div className="table-body">
        <aside className="table-side left">
          <h3>Sound cues</h3>
          {(live?.cues || []).length === 0 && <div className="hint">No cues. Add them in Admin → Tables.</div>}
          {(live?.cues || []).map(c => { const on = live.sound?.playing && live.sound.cueId === c.cueId; return (
            <button key={c.cueId} type="button" className={`cue${on ? ' on' : ''}`} onClick={() => playCue(c.cueId)}>
              <span className="cue-name">{on ? '▶ ' : ''}{c.name}</span><span className="cue-seg">{c.source === 'youtube' ? '▶yt' : '♪'} {fmt(c.start)}–{c.end ? fmt(c.end) : 'end'}{c.loop ? ' ⟳' : ''}</span>
            </button>); })}
          {live?.sound?.playing && <button type="button" className="btn btn-danger btn-sm" style={{ width: '100%', marginTop: 4 }} onClick={() => playCue(null)}>■ Stop</button>}

          <h3 style={{ marginTop: 14 }}>Add a token</h3>
          <div className="addlist">
            {players.map(p => <button key={p.userId} type="button" className="add" onClick={() => addPlayer(p)} disabled={!map}><span className="sw" style={{ borderColor: '#00d4ff' }} />{p.characterName || p.username}</button>)}
          </div>
          <input className="fi" placeholder="filter enemies…" value={addFilter} onChange={e => setAddFilter(e.target.value)} style={{ margin: '6px 0' }} />
          <div className="addlist tall">
            {filteredEnemies.map(en => <button key={en._id} type="button" className="add" onClick={() => addEnemy(en)} disabled={!map}><span className="sw" style={{ borderColor: en.color || TIER_COLOR[en.tier] }} />{en.name} <small>{en.tier}</small></button>)}
          </div>
        </aside>

        <main className="table-map">
          {map ? (
            <>
              <div className="board-tools" role="toolbar">
                {['move', 'measure', 'fog', 'ping', 'fx'].map(t => <button key={t} type="button" className={`tool${tool === t ? ' on' : ''}`} onClick={() => setTool(t)}>{t}</button>)}
                {tool === 'fog' && <>
                  <span className="sep" />
                  <button type="button" className="tool" onClick={() => setFog(!map.fogEnabled)}>{map.fogEnabled ? 'fog: on' : 'fog: off'}</button>
                  <button type="button" className="tool" onClick={() => setFog('reset')} disabled={!map.fogEnabled}>cover all</button>
                </>}
                {tool === 'fx' && <>
                  <span className="sep" />
                  {FX_TYPES.map(t => <button key={t} type="button" className={`tool fxpick${fxType === t ? ' on' : ''}`} style={{ color: FX_STYLE[t].color }} onClick={() => setFxType(t)}>{t}</button>)}
                  <button type="button" className={`tool fxpick${fxType === 'auto' ? ' on' : ''}`} onClick={() => setFxType('auto')} title="infer the type from the ability's name">auto</button>
                  <input className="fi" placeholder="ability name (announces it)" value={ability} onChange={e => setAbility(e.target.value)} style={{ width: 170, padding: '3px 6px', fontSize: 11 }} />
                </>}
              </div>
              <HexBoard map={map} image={image} role="gm" selectedId={selected} tool={tool} live={String(map._id) === String(live.activeMapId)}
                        onSelect={t => setSelected(t.tokenId)} onMoveToken={moveToken} onFogPaint={fogPaint} onPing={ping} onFxTarget={fireFx} pings={pings} fx={live.fx} />
              <div className="board-info">{tool === 'fx' ? (ability.trim() ? `click a target: ${selToken ? selToken.name + ' uses ' : ''}${ability.trim()} (${fxType === 'auto' ? 'type from the name' : fxType})` : `click a hex or token to land a ${fxType === 'auto' ? 'Skill' : fxType}${selToken ? ` from ${selToken.name}` : ''}`) : tool === 'fog' ? 'paint to reveal (radius 2)' : 'drag any token · wheel zooms · drag ground to pan'}</div>
            </>
          ) : <div className="table-empty small">Pick a map to put live.</div>}
        </main>

        <aside className="table-side right">
          {selToken ? (
            <div className="selbox">
              <h3>Selected</h3>
              <div className="sel-name">{selToken.name} <small>{selToken.size}{selToken.tier ? ' · ' + selToken.tier : ''}</small></div>
              <div className="sel-actions">
                <button type="button" className={`btn btn-xs ${selToken.hidden ? 'btn-gold' : 'btn-muted'}`} onClick={() => patchToken(selToken, { hidden: !selToken.hidden })}>{selToken.hidden ? 'reveal' : 'hide'}</button>
                <button type="button" className="btn btn-danger btn-xs" onClick={() => removeToken(selToken)}>remove</button>
              </div>
              <div className="partsbox">
                {selParts.map(p => <div key={p.id ?? p.name} className={`part${p.lethal ? ' lethal' : ''}`}>
                  <span>{p.name}</span>
                  <span className="pm"><button type="button" onClick={() => damagePart(selToken, p, -1)}>−</button><b>{p.currentHp}/{p.maxHp}</b><button type="button" onClick={() => damagePart(selToken, p, +1)}>+</button></span>
                </div>)}
                {selParts.length === 0 && <div className="hint">No parts{selToken.kind === 'player' ? ' — loading the sheet' : ''}.</div>}
              </div>
              <div className="condrow">
                {(selToken.conditions || []).map(c => <button key={c} type="button" className="chip" onClick={() => toggleCondition(selToken, c, false)}>{c} ✕</button>)}
                <form onSubmit={e => { e.preventDefault(); if (condText.trim()) { toggleCondition(selToken, condText.trim(), true); setCondText(''); } }}>
                  <input className="fi" list="condlist" placeholder="+ condition (Bleed T1…)" value={condText} onChange={e => setCondText(e.target.value)} />
                  <datalist id="condlist">{['Bleed', 'Crushed', 'Burn', 'Chill', 'Poison', 'Infected', 'Dissolution', 'Exposed', 'Prone', 'Slowed', 'Grappled', 'Shock'].flatMap(c => ['T1', 'T2', 'T3'].map(t => <option key={c + t} value={`${c} ${t}`} />))}</datalist>
                </form>
              </div>
            </div>
          ) : <div className="hint" style={{ marginBottom: 8 }}>Click a token to edit it. With a token selected, the fx tool fires from it.</div>}
          <h3>Dice</h3>
          <DiceTray tableId={tableId} token={auth.token} role="gm" actorName={selToken?.name} onRolled={m => setRolled(r => [...r, m])} showToast={showToast} />
          <h3 style={{ marginTop: 10 }}>Table talk</h3>
          <TableChat token={auth.token} role="gm" players={players.map(p => ({ userId: p.userId, displayName: p.characterName || p.username }))} injected={rolled} refreshKey={chatKey} pollMs={socketOn ? 20000 : 3000} />
        </aside>
      </div>
      <Toast toast={toast} />
    </div>
  );
}

function fmt(sec) { const s = Math.floor(sec || 0); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }
