import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../../api.js';

const TIER_COLOR = { mob: '#3a4560', elite: '#00d4ff', boss: '#c8a84b', legendary: '#a855f7' };

export default function MomentTrackerSection({ token, players, enemies, showToast }) {
  const [tracker, setTracker] = useState(null);
  const [targetSlot, setTargetSlot] = useState(1);
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
  async function rmEntry(id) { const d = await apiFetch(`/api/tracker/entries/${id}`, { method: 'DELETE' }, token); if (!d.error) setTracker(d); }
  async function clearAll() { if (!confirm('Clear all entries?')) return; const d = await apiFetch('/api/tracker/entries', { method: 'DELETE' }, token); if (!d.error) setTracker(d); }
  async function moveEntry(entryId, slot) { const d = await apiFetch(`/api/tracker/entries/${entryId}`, { method: 'PATCH', body: JSON.stringify({ moment: slot }) }, token); if (!d.error) setTracker(d); }

  async function addPlayer(p) {
    const name = p.characterName || p.username;
    const d = await apiFetch('/api/tracker/entries', {
      method: 'POST',
      body: JSON.stringify({ name, type: 'player', moment: targetSlot, color: '#00d4ff', userId: p.userId }),
    }, token);
    if (!d.error) setTracker(d);
    else showToast(d.error, 'err');
  }

  async function addEnemy(enemy) {
    const existing = (tracker?.entries || []).filter(e => e.name.replace(/ \d+$/, '') === enemy.name);
    let name = enemy.name;
    if (existing.length === 1 && !existing[0].name.match(/ \d+$/)) {
      // Rename the existing un-numbered one to "name 1" isn't possible via UI easily,
      // just number the new one as 2
      name = `${enemy.name} 2`;
    } else if (existing.length > 0) {
      name = `${enemy.name} ${existing.length + 1}`;
    }
    const d = await apiFetch('/api/tracker/entries', {
      method: 'POST',
      body: JSON.stringify({ name, type: 'mob', moment: targetSlot, color: enemy.color }),
    }, token);
    if (!d.error) setTracker(d);
    else showToast(d.error, 'err');
  }

  if (!tracker) return <div style={{ padding: 20, color: 'var(--muted)', fontSize: 11 }}>Loading tracker...</div>;

  const totalSlots = tracker.totalSlots || 10;
  const slotNums = Array.from({ length: totalSlots }, (_, i) => i + 1);
  const entriesBySlot = {};
  (tracker.entries || []).forEach(e => { if (!entriesBySlot[e.moment]) entriesBySlot[e.moment] = []; entriesBySlot[e.moment].push(e); });

  // Which players are already in the tracker this slot
  const slotPlayerIds = (entriesBySlot[targetSlot] || []).map(e => e.userId).filter(Boolean);

  return (
    <>
      {/* Tracker rail */}
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

      {/* Add to tracker panel */}
      <div className="panel">
        <div className="panel-title admin">Add to Tracker</div>

        {/* Slot picker */}
        <div style={{ marginBottom: 14 }}>
          <div className="field-label" style={{ marginBottom: 6 }}>Target Slot</div>
          <div className="trk-slot-picker">
            {slotNums.map(n => (
              <button
                key={n}
                className={`trk-slot-pick-btn${targetSlot === n ? ' active' : ''}${n === tracker.currentMoment ? ' cur' : ''}`}
                onClick={() => setTargetSlot(n)}
              >
                {n}
                {(entriesBySlot[n] || []).length > 0 && (
                  <span className="trk-slot-pick-count">{(entriesBySlot[n] || []).length}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Two card lists */}
        <div className="trk-add-grid">
          {/* Characters */}
          <div>
            <div className="field-label" style={{ marginBottom: 6 }}>Characters</div>
            {players.length === 0 && <div style={{ color: 'var(--muted)', fontSize: 10 }}>No players.</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {players.map(p => {
                const alreadyIn = slotPlayerIds.includes(p.userId);
                return (
                  <button
                    key={p.userId}
                    className={`trk-add-card player${alreadyIn ? ' in-slot' : ''}`}
                    onClick={() => addPlayer(p)}
                    title={alreadyIn ? `${p.characterName || p.username} already in slot ${targetSlot}` : `Add to slot ${targetSlot}`}
                  >
                    <span className="trk-add-avatar">{(p.characterName || p.username)[0].toUpperCase()}</span>
                    <span className="trk-add-info">
                      <span className="trk-add-name">{p.characterName || p.username}</span>
                      {p.characterName && <span className="trk-add-sub">{p.username}</span>}
                    </span>
                    <span className="trk-add-level">Lv{p.level || 1}</span>
                    {alreadyIn && <span className="trk-add-badge">in</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Enemies */}
          <div>
            <div className="field-label" style={{ marginBottom: 6 }}>Enemies</div>
            {(enemies || []).length === 0 && (
              <div style={{ color: 'var(--muted)', fontSize: 10 }}>No enemies in library. Add them in the Enemies tab.</div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {(enemies || []).map(e => {
                const countInTracker = (tracker.entries || []).filter(ent => ent.name.replace(/ \d+$/, '') === e.name).length;
                const tierColor = TIER_COLOR[e.tier] || '#3a4560';
                return (
                  <button
                    key={e._id}
                    className="trk-add-card enemy"
                    onClick={() => addEnemy(e)}
                    style={{ '--enemy-color': e.color }}
                    title={`Add to slot ${targetSlot}`}
                  >
                    <span className="trk-add-dot" style={{ background: e.color }} />
                    <span className="trk-add-info">
                      <span className="trk-add-name" style={{ color: e.color }}>{e.name}</span>
                      <span className="trk-add-sub" style={{ color: tierColor }}>{e.tier}</span>
                    </span>
                    {countInTracker > 0 && (
                      <span className="trk-add-badge" style={{ borderColor: e.color, color: e.color }}>×{countInTracker}</span>
                    )}
                    {(e.bodyParts || []).length > 0 && (
                      <span className="trk-add-bp">{(e.bodyParts || []).length} parts</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
