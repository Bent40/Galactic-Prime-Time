import { useState } from 'react';
import { apiFetch } from '../api.js';

/**
 * DiceTray — the book's three dice, as buttons. The server rolls (POST /api/tables/:id/roll)
 * and posts the result to chat, so a result can never be typed. §6.1 Forced Action
 * (Body / Tool, d6, the table row comes back with the number) · §14 threshold die
 * (d4 / d6 / d8, per stat) · §21.5 falling (height in metres).
 */
const STATS = ['Reflexes', 'Mind', 'Physique', 'Charm'];

export default function DiceTray({ tableId, token, role, actorName, onRolled, showToast }) {
  const [gmOnly, setGmOnly] = useState(false);
  const [stat, setStat] = useState('Reflexes');
  const [height, setHeight] = useState(4);
  const [busy, setBusy] = useState(false);

  async function roll(kind, extra = {}) {
    if (busy) return;
    setBusy(true);
    const body = { kind, ...extra };
    if (role === 'gm') { body.gmOnly = gmOnly; if (actorName) body.actorName = actorName; }
    const d = await apiFetch(`/api/tables/${tableId}/roll`, { method: 'POST', body: JSON.stringify(body) }, token);
    setBusy(false);
    if (d.error) showToast?.(d.error, 'err'); else onRolled?.(d);
  }

  return (
    <div className="dicetray">
      <div className="dice-grid">
        <button type="button" className="die body" onClick={() => roll('body')} disabled={busy}><span>Forced Action</span><b>Body d6</b></button>
        <button type="button" className="die tool" onClick={() => roll('tool')} disabled={busy}><span>Forced Action</span><b>Tool d6</b></button>
        <button type="button" className="die" onClick={() => roll('d4', { stat })} disabled={busy}><span>Threshold</span><b>d4</b></button>
        <button type="button" className="die" onClick={() => roll('d6', { stat })} disabled={busy}><span>Threshold</span><b>d6</b></button>
        <button type="button" className="die" onClick={() => roll('d8', { stat })} disabled={busy}><span>Threshold</span><b>d8</b></button>
        <button type="button" className="die" onClick={() => roll('fall', { height })} disabled={busy}><span>Falling</span><b>{height} m</b></button>
      </div>
      <div className="dice-opts">
        <label>stat <select className="fi" value={stat} onChange={e => setStat(e.target.value)}>{STATS.map(s => <option key={s}>{s}</option>)}</select></label>
        <label>fall <input className="fi" type="number" min="1" max="60" value={height} onChange={e => setHeight(Number(e.target.value) || 1)} style={{ width: 52 }} /> m</label>
        {role === 'gm' && <label><input type="checkbox" checked={gmOnly} onChange={e => setGmOnly(e.target.checked)} /> GM-only</label>}
        {role === 'gm' && actorName && <span className="dice-actor">as {actorName}</span>}
      </div>
    </div>
  );
}
