import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../../api.js';

export default function MomentTrackerSection({ token, players, showToast }) {
  const [tracker, setTracker] = useState(null);
  const [entryForm, setEntryForm] = useState({ name: '', type: 'player', moment: 1, color: '#00d4ff', userId: '' });
  const dragEntry = useRef(null);

  useEffect(() => {
    load();
    const iv = setInterval(load, 5000);
    return () => clearInterval(iv);
  }, []);

  function load() { apiFetch('/api/tracker', {}, token).then(d => { if (!d.error) setTracker(d); }); }
  async function advance() { const d = await apiFetch('/api/tracker/advance', { method: 'PATCH' }, token); if (!d.error) setTracker(d); }
  async function retreat() { const d = await apiFetch('/api/tracker/retreat', { method: 'PATCH' }, token); if (!d.error) setTracker(d); }
  async function reset() { if (!confirm('Reset tracker?')) return; const d = await apiFetch('/api/tracker/reset', { method: 'POST' }, token); if (!d.error) setTracker(d); }
  async function addEntry() {
    if (!entryForm.name) return;
    const d = await apiFetch('/api/tracker/entries', { method: 'POST', body: JSON.stringify(entryForm) }, token);
    if (!d.error) { setTracker(d); setEntryForm(f => ({ ...f, name: '' })); } else showToast(d.error, 'err');
  }
  async function rmEntry(id) { const d = await apiFetch(`/api/tracker/entries/${id}`, { method: 'DELETE' }, token); if (!d.error) setTracker(d); }
  async function clearAll() { if (!confirm('Clear all entries?')) return; const d = await apiFetch('/api/tracker/entries', { method: 'DELETE' }, token); if (!d.error) setTracker(d); }
  async function moveEntry(entryId, slot) { const d = await apiFetch(`/api/tracker/entries/${entryId}`, { method: 'PATCH', body: JSON.stringify({ moment: slot }) }, token); if (!d.error) setTracker(d); }

  if (!tracker) return <div style={{ padding: 20, color: 'var(--muted)', fontSize: 11 }}>Loading tracker...</div>;

  const totalSlots = tracker.totalSlots || 10;
  const slotNums = Array.from({ length: totalSlots }, (_, i) => i + 1);
  const entriesBySlot = {};
  (tracker.entries || []).forEach(e => { if (!entriesBySlot[e.moment]) entriesBySlot[e.moment] = []; entriesBySlot[e.moment].push(e); });

  return (
    <>
      <div className="panel">
        <div className="panel-title admin">
          Moment Tracker
          <div className="row gap-sm">
            <button className="btn btn-muted btn-sm" onClick={clearAll}>Clear All</button>
            <button className="btn btn-danger btn-sm" onClick={reset}>Reset</button>
          </div>
        </div>
        <div className="trk-layout">
          <div className="trk-stat-box">
            <div className="trk-stat-label">Clock</div>
            <div className="trk-stat-val" style={{ color: 'var(--gold)' }}>{tracker.clock || 0}</div>
          </div>
          <div className="trk-stat-box">
            <div className="trk-stat-label">Moment</div>
            <div className="trk-stat-val">{tracker.currentMoment || 0}</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="btn btn-muted btn-sm" onClick={retreat}>◀ Back</button>
            <button className="btn btn-purple" onClick={advance}>Advance ▶</button>
          </div>
        </div>
        <div className="trk-rail-wrap">
          {slotNums.map(n => {
            const isCur = n === tracker.currentMoment;
            return (
              <div key={n} className={`admin-trk-slot${isCur ? ' cur' : ''}`}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); if (dragEntry.current) moveEntry(dragEntry.current, n); }}>
                <div className="trk-slot-hdr">
                  <span>{n}</span>
                  {isCur && <span style={{ fontSize: 8, color: 'var(--cyan)' }}>▶</span>}
                </div>
                <div className="trk-slot-body">
                  {(entriesBySlot[n] || []).map(e => (
                    <div key={e.entryId} className="trk-entry"
                      draggable
                      onDragStart={() => dragEntry.current = e.entryId}
                      onDragEnd={() => dragEntry.current = null}
                      style={{ borderColor: e.color, color: e.color, background: `${e.color}18` }}>
                      <span className="trk-entry-name">{e.name}</span>
                      <button className="trk-entry-rm" onClick={() => rmEntry(e.entryId)} style={{ color: e.color }}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="panel">
        <div className="panel-title admin">Add Entry</div>
        <div className="form-row">
          <div className="field-group" style={{ flex: 2 }}>
            <label className="field-label">Name</label>
            <input className="fi" value={entryForm.name} onChange={e => setEntryForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="field-group">
            <label className="field-label">Type</label>
            <select className="fi" value={entryForm.type} onChange={e => setEntryForm(f => ({ ...f, type: e.target.value }))}>
              <option value="player">Player</option><option value="mob">Mob</option>
            </select>
          </div>
          <div className="field-group">
            <label className="field-label">Slot</label>
            <input className="fi" type="number" min="0" max={totalSlots} style={{ width: 70 }} value={entryForm.moment} onChange={e => setEntryForm(f => ({ ...f, moment: +e.target.value }))} />
          </div>
          <div className="field-group">
            <label className="field-label">Player (opt)</label>
            <select className="fi" value={entryForm.userId} onChange={e => {
              const p = players.find(p => p.userId === e.target.value);
              setEntryForm(f => ({ ...f, userId: e.target.value, name: p ? p.characterName || p.username : f.name, color: f.type === 'player' ? '#00d4ff' : f.color }));
            }}>
              <option value="">— none —</option>
              {players.map(p => <option key={p.userId} value={p.userId}>{p.username}</option>)}
            </select>
          </div>
          <div className="field-group">
            <label className="field-label">Color</label>
            <input type="color" value={entryForm.color} onChange={e => setEntryForm(f => ({ ...f, color: e.target.value }))} style={{ width: 38, height: 32, border: '1px solid var(--muted)', borderRadius: 3, background: 'transparent', cursor: 'pointer', padding: 2 }} />
          </div>
          <button className="btn btn-purple btn-sm" onClick={addEntry} style={{ alignSelf: 'flex-end' }}>+ Add</button>
        </div>
      </div>
    </>
  );
}
