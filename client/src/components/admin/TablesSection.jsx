import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../api.js';
import { parseTimecode, formatTimecode, parseYouTubeRef } from '../../table/soundEngine.js';

/**
 * TablesSection — the GM creates a TABLE (Roll20's "game"), seats players at it,
 * and stacks MAPS on it. One map is LIVE: that is the one a seated player sees.
 *
 * This is the setup half; the play surface is /gm/:tableId (GM) and /table (players).
 * Sound cues are authored here and fired from the GM table. See docs/vtt-research.md.
 */
const MAX_IMAGE_CHARS = 8_000_000;   // mirrors routes/tables.js

function readImage(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      const img = new Image();
      img.onload = () => resolve({ dataUrl: fr.result, width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => reject(new Error('Not an image'));
      img.src = fr.result;
    };
    fr.onerror = () => reject(new Error('Could not read file'));
    fr.readAsDataURL(file);
  });
}

export default function TablesSection({ token, players, showToast }) {
  const [tables, setTables] = useState([]);
  const [sel, setSel] = useState(null);          // full table incl. maps (no images)
  const [newName, setNewName] = useState('');
  const [mapForm, setMapForm] = useState({ name: '', image: '', width: 0, height: 0, size: 40, cols: 30, rows: 20 });
  const [busy, setBusy] = useState(false);
  const [cueForm, setCueForm] = useState({ name: '', source: 'youtube', ref: '', start: '0:00', end: '', loop: true, volume: 80, trigger: 'manual', mapId: '' });

  useEffect(() => { loadTables(); }, []);
  function loadTables() { apiFetch('/api/tables', {}, token).then(d => { if (Array.isArray(d)) setTables(d); }); }
  async function open(id) { const d = await apiFetch(`/api/tables/${id}`, {}, token); if (d.error) showToast(d.error, 'err'); else setSel(d); }
  async function refresh() { if (sel) await open(sel._id); loadTables(); }

  async function createTable(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    const d = await apiFetch('/api/tables', { method: 'POST', body: JSON.stringify({ name: newName }) }, token);
    if (d.error) return showToast(d.error, 'err');
    setNewName(''); loadTables(); open(d._id); showToast('Table created');
  }
  async function patchTable(body) {
    const d = await apiFetch(`/api/tables/${sel._id}`, { method: 'PATCH', body: JSON.stringify(body) }, token);
    if (d.error) showToast(d.error, 'err'); else refresh();
  }
  async function deleteTable() {
    if (!confirm(`Delete table "${sel.name}" and every map on it? This cannot be undone.`)) return;
    const d = await apiFetch(`/api/tables/${sel._id}`, { method: 'DELETE' }, token);
    if (d.error) return showToast(d.error, 'err');
    setSel(null); loadTables(); showToast('Table deleted');
  }
  async function toggleSeat(userId, seated) {
    const d = seated
      ? await apiFetch(`/api/tables/${sel._id}/seats/${userId}`, { method: 'DELETE' }, token)
      : await apiFetch(`/api/tables/${sel._id}/seats`, { method: 'POST', body: JSON.stringify({ userId }) }, token);
    if (d.error) showToast(d.error, 'err'); else refresh();
  }
  async function pickImage(e) {
    const file = e.target.files?.[0]; if (!file) return;
    try {
      const { dataUrl, width, height } = await readImage(file);
      if (dataUrl.length > MAX_IMAGE_CHARS) return showToast(`Image too large (${(file.size / 1048576).toFixed(1)} MB) — export a JPG under ~6 MB`, 'err');
      setMapForm(f => ({ ...f, image: dataUrl, width, height, name: f.name || file.name.replace(/\.[^.]+$/, '') }));
    } catch (err) { showToast(err.message, 'err'); }
  }
  async function addMap(e) {
    e.preventDefault();
    if (!mapForm.name.trim()) return showToast('Name the map', 'err');
    setBusy(true);
    const body = { name: mapForm.name, image: mapForm.image, width: mapForm.width, height: mapForm.height,
                   grid: { type: 'hex', size: Number(mapForm.size), cols: Number(mapForm.cols), rows: Number(mapForm.rows) } };
    const d = await apiFetch(`/api/tables/${sel._id}/maps`, { method: 'POST', body: JSON.stringify(body) }, token);
    setBusy(false);
    if (d.error) return showToast(d.error, 'err');
    setMapForm({ name: '', image: '', width: 0, height: 0, size: 40, cols: 30, rows: 20 });
    refresh(); showToast('Map added');
  }
  async function deleteMap(m) {
    if (!confirm(`Delete map "${m.name}"?`)) return;
    const d = await apiFetch(`/api/tables/${sel._id}/maps/${m._id}`, { method: 'DELETE' }, token);
    if (d.error) showToast(d.error, 'err'); else refresh();
  }

  async function addCue(e) {
    e.preventDefault();
    const ref = cueForm.source === 'youtube' ? parseYouTubeRef(cueForm.ref) : cueForm.ref.trim();
    if (cueForm.source === 'youtube' && !ref) return showToast('Paste a YouTube link or video id', 'err');
    const body = { name: cueForm.name, source: cueForm.source, ref, start: parseTimecode(cueForm.start), end: parseTimecode(cueForm.end), loop: cueForm.loop, volume: Number(cueForm.volume), trigger: cueForm.trigger, mapId: cueForm.trigger === 'map-live' ? cueForm.mapId : '' };
    const d = await apiFetch(`/api/tables/${sel._id}/cues`, { method: 'POST', body: JSON.stringify(body) }, token);
    if (d.error) return showToast(d.error, 'err');
    setCueForm(f => ({ ...f, name: '', start: '0:00', end: '' }));
    refresh(); showToast('Cue added');
  }
  async function deleteCue(c) {
    const d = await apiFetch(`/api/tables/${sel._id}/cues/${c.cueId}`, { method: 'DELETE' }, token);
    if (d.error) showToast(d.error, 'err'); else refresh();
  }
  async function pickAudio(e) {
    const file = e.target.files?.[0]; if (!file) return;
    const fr = new FileReader();
    fr.onload = () => { if (fr.result.length > MAX_IMAGE_CHARS) return showToast('Audio too large — link an https URL or a YouTube video instead', 'err'); setCueForm(f => ({ ...f, source: 'audio', ref: fr.result, name: f.name || file.name.replace(/\.[^.]+$/, '') })); };
    fr.readAsDataURL(file);
  }

  const seatedIds = new Set((sel?.seats || []).map(s => s.userId));
  const nameOf = uid => { const p = players.find(p => p.userId === uid); return p ? (p.characterName || p.username) : uid; };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16, alignItems: 'start' }}>
      {/* ── table list ── */}
      <div className="panel admin">
        <div className="panel-title admin">Tables</div>
        <form onSubmit={createTable} style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          <input className="fi" placeholder="New table name" value={newName} onChange={e => setNewName(e.target.value)} style={{ flex: 1 }} />
          <button className="btn btn-purple btn-sm" type="submit">Create</button>
        </form>
        {tables.length === 0 && <div style={{ color: 'var(--muted-text)', fontSize: 11 }}>No tables yet. A table is one running game: its seated players and its maps.</div>}
        {tables.map(t => (
          <div key={t._id} className={`player-item${sel?._id === t._id ? ' active' : ''}`} onClick={() => open(t._id)} style={{ borderLeft: sel?._id === t._id ? undefined : '3px solid transparent' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 12 }}>{t.name}</div>
              <div style={{ fontSize: 10, color: 'var(--muted-text)', letterSpacing: 1 }}>
                {t.seats.length} seated · {t.mapCount} map{t.mapCount === 1 ? '' : 's'} · {t.status === 'open' ? 'OPEN' : 'CLOSED'}
              </div>
            </div>
            {t.activeMapId && <span style={{ fontSize: 9, color: 'var(--gold)', letterSpacing: 1 }}>LIVE</span>}
          </div>
        ))}
      </div>

      {/* ── selected table ── */}
      {!sel ? (
        <div style={{ color: 'var(--muted-text)', fontSize: 12, padding: 20 }}>
          Pick a table, or create one. Players only ever see the tables they are seated at, and only that table's <b style={{ color: 'var(--gold)' }}>live</b> map.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="panel admin">
            <div className="panel-title admin">Table</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <input className="fi" defaultValue={sel.name} key={sel._id + sel.name} onBlur={e => e.target.value.trim() && e.target.value !== sel.name && patchTable({ name: e.target.value })} style={{ fontWeight: 700, minWidth: 220 }} />
              <select className="fi" value={sel.status} onChange={e => patchTable({ status: e.target.value })} style={{ width: 'auto' }}>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
              <span style={{ flex: 1 }} />
              <Link to={`/gm/${sel._id}`} className="btn btn-gold btn-sm" target="_blank">🎲 Open the GM table</Link>
              <button className="btn btn-danger btn-sm" onClick={deleteTable}>Delete table</button>
            </div>
            <input className="fi" placeholder="Description (players see this)" defaultValue={sel.description} key={'d' + sel._id} onBlur={e => e.target.value !== sel.description && patchTable({ description: e.target.value })} style={{ marginTop: 8 }} />
          </div>

          <div className="panel admin">
            <div className="panel-title admin">Seats — who is at this table</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 6 }}>
              {players.filter(p => !p.isAdmin).map(p => {
                const seated = seatedIds.has(p.userId);
                return (
                  <label key={p.userId} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', border: `1px solid ${seated ? 'var(--cyan)' : 'var(--border)'}`, borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                    <input type="checkbox" checked={seated} onChange={() => toggleSeat(p.userId, seated)} />
                    <span style={{ flex: 1 }}>{p.characterName || p.username}</span>
                    {!p.hasCharacter && <span style={{ fontSize: 9, color: 'var(--muted-text)' }}>no sheet</span>}
                  </label>
                );
              })}
            </div>
            {sel.seats.some(s => !players.find(p => p.userId === s.userId)) && (
              <div style={{ fontSize: 10, color: 'var(--danger)', marginTop: 6 }}>Seated but no longer a player: {sel.seats.filter(s => !players.find(p => p.userId === s.userId)).map(s => nameOf(s.userId)).join(', ')}</div>
            )}
          </div>

          <div className="panel admin">
            <div className="panel-title admin">Maps — one is live</div>
            {sel.maps.length === 0 && <div style={{ color: 'var(--muted-text)', fontSize: 11, marginBottom: 8 }}>No maps yet. Add an Inkarnate export below; a map with no image is a plain hex grid.</div>}
            {sel.maps.map(m => {
              const live = String(sel.activeMapId) === String(m._id);
              return (
                <div key={m._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px', border: `1px solid ${live ? 'var(--gold)' : 'var(--border)'}`, borderRadius: 4, marginBottom: 6 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 12, color: live ? 'var(--gold)' : 'var(--text)' }}>{m.name} {live && <span style={{ fontSize: 9, letterSpacing: 1, marginLeft: 6 }}>● LIVE</span>}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted-text)', fontFamily: "'Courier New', monospace" }}>
                      {m.width && m.height ? `${m.width}×${m.height}px · ` : 'no image · '}hex {m.grid?.size}px · {m.grid?.cols}×{m.grid?.rows} · {m.tokens?.length || 0} tokens{m.fogEnabled ? ' · fog' : ''}
                    </div>
                  </div>
                  {live
                    ? <button className="btn btn-muted btn-xs" onClick={() => patchTable({ activeMapId: null })}>Take off air</button>
                    : <button className="btn btn-gold btn-xs" onClick={() => patchTable({ activeMapId: m._id })}>Go live</button>}
                  <button className="btn btn-danger btn-xs" onClick={() => deleteMap(m)}>✕</button>
                </div>
              );
            })}
            <form onSubmit={addMap} style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'end' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 6 }}>
                <div className="field-group"><span className="field-label">Map name</span><input className="fi" value={mapForm.name} onChange={e => setMapForm(f => ({ ...f, name: e.target.value }))} /></div>
                <div className="field-group"><span className="field-label">Hex size px</span><input className="fi" type="number" min="8" max="400" value={mapForm.size} onChange={e => setMapForm(f => ({ ...f, size: e.target.value }))} /></div>
                <div className="field-group"><span className="field-label">Cols</span><input className="fi" type="number" min="1" max="400" value={mapForm.cols} onChange={e => setMapForm(f => ({ ...f, cols: e.target.value }))} /></div>
                <div className="field-group"><span className="field-label">Rows</span><input className="fi" type="number" min="1" max="400" value={mapForm.rows} onChange={e => setMapForm(f => ({ ...f, rows: e.target.value }))} /></div>
                <div className="field-group" style={{ gridColumn: '1 / -1' }}>
                  <span className="field-label">Background (Inkarnate export · PNG/JPG/WebP · under ~6 MB)</span>
                  <input className="fi" type="file" accept="image/png,image/jpeg,image/webp" onChange={pickImage} />
                  {mapForm.image && <span style={{ fontSize: 10, color: 'var(--success)' }}>✓ {mapForm.width}×{mapForm.height}px loaded · {(mapForm.image.length * 0.75 / 1048576).toFixed(1)} MB</span>}
                </div>
              </div>
              <button className="btn btn-purple btn-sm" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Add map'}</button>
            </form>
          </div>
        
          <div className="panel admin">
            <div className="panel-title admin">Sound cues — a segment of a track, fired from the GM table</div>
            {(sel.cues || []).length === 0 && <div style={{ color: 'var(--muted-text)', fontSize: 11, marginBottom: 8 }}>No cues yet. A cue plays one stretch of a YouTube video or an mp3 — "0:00–0:36, looping" — so a boss with three phases is three cues on one track, and "stop" is a button on the table.</div>}
            {(sel.cues || []).map(c => (
              <div key={c.cueId} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 4, marginBottom: 6, fontSize: 12 }}>
                <span style={{ fontWeight: 700, flex: 1 }}>{c.name}</span>
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: 'var(--muted-text)' }}>{c.source === 'youtube' ? `▶ ${c.ref}` : '♪ audio'} · {formatTimecode(c.start)}–{c.end ? formatTimecode(c.end) : 'end'}{c.loop ? ' ⟳' : ' once'} · vol {c.volume}{c.trigger === 'map-live' ? ` · auto when "${sel.maps.find(m => String(m._id) === c.mapId)?.name || '?'}" goes live` : ''}</span>
                <button className="btn btn-danger btn-xs" onClick={() => deleteCue(c)}>✕</button>
              </div>
            ))}
            <form onSubmit={addCue} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 2fr', gap: 6, marginTop: 8, alignItems: 'end' }}>
              <div className="field-group"><span className="field-label">Cue name</span><input className="fi" value={cueForm.name} onChange={e => setCueForm(f => ({ ...f, name: e.target.value }))} placeholder="Boss — phase 1" /></div>
              <div className="field-group"><span className="field-label">Source</span><select className="fi" value={cueForm.source} onChange={e => setCueForm(f => ({ ...f, source: e.target.value, ref: '' }))}><option value="youtube">YouTube</option><option value="audio">mp3 / audio URL</option></select></div>
              {cueForm.source === 'youtube'
                ? <div className="field-group"><span className="field-label">YouTube link or video id</span><input className="fi" value={cueForm.ref} onChange={e => setCueForm(f => ({ ...f, ref: e.target.value }))} placeholder="https://youtu.be/…" /></div>
                : <div className="field-group"><span className="field-label">https URL, or upload a small file (under ~6 MB)</span><div style={{ display: 'flex', gap: 6 }}><input className="fi" value={cueForm.ref.startsWith('data:') ? '(file loaded)' : cueForm.ref} onChange={e => setCueForm(f => ({ ...f, ref: e.target.value }))} placeholder="https://…/track.mp3" style={{ flex: 1 }} /><input type="file" accept="audio/*" onChange={pickAudio} style={{ width: 110, fontSize: 10 }} /></div></div>}
              <div className="field-group"><span className="field-label">Start (m:ss)</span><input className="fi" value={cueForm.start} onChange={e => setCueForm(f => ({ ...f, start: e.target.value }))} /></div>
              <div className="field-group"><span className="field-label">End (m:ss · blank = track end)</span><input className="fi" value={cueForm.end} onChange={e => setCueForm(f => ({ ...f, end: e.target.value }))} placeholder="0:36" /></div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 11, flexWrap: 'wrap' }}>
                <label><input type="checkbox" checked={cueForm.loop} onChange={e => setCueForm(f => ({ ...f, loop: e.target.checked }))} /> loop the segment</label>
                <label>vol <input className="fi" type="number" min="0" max="100" value={cueForm.volume} onChange={e => setCueForm(f => ({ ...f, volume: e.target.value }))} style={{ width: 56 }} /></label>
                <label>trigger <select className="fi" value={cueForm.trigger} onChange={e => setCueForm(f => ({ ...f, trigger: e.target.value }))} style={{ width: 'auto' }}><option value="manual">button on the table</option><option value="map-live">when a map goes live</option></select></label>
                {cueForm.trigger === 'map-live' && <select className="fi" value={cueForm.mapId} onChange={e => setCueForm(f => ({ ...f, mapId: e.target.value }))} style={{ width: 'auto' }}><option value="">— which map —</option>{sel.maps.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}</select>}
                <button className="btn btn-purple btn-sm" type="submit">Add cue</button>
              </div>
            </form>
            <div style={{ fontSize: 10, color: 'var(--muted-text)', marginTop: 8 }}>Players hear it after clicking "Enable sound" once on their table page (a browser rule, not ours). YouTube must allow embedding for the video; most music does.</div>
          </div>
        </div>
      )}
    </div>
  );
}
