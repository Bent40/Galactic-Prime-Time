import { useState, useEffect } from 'react';
import { apiFetch } from '../../api.js';
import { ATK_TYPES, DMG_TYPES, ITEM_CATS, ITEM_TIERS } from '../../constants.js';

function toggleArr(arr, val) { return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]; }

function ItemForm({ value, onChange }) {
  return (
    <>
      <div className="modal-grid3">
        <div className="field-group"><label className="field-label">Name</label><input className="fi" value={value.name} onChange={e => onChange({ ...value, name: e.target.value })} /></div>
        <div className="field-group"><label className="field-label">Icon (emoji)</label><input className="fi" value={value.icon} onChange={e => onChange({ ...value, icon: e.target.value })} placeholder="⚔️" /></div>
        <div className="field-group"><label className="field-label">Category</label>
          <select className="fi" value={value.category} onChange={e => onChange({ ...value, category: e.target.value })}>
            {ITEM_CATS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="field-group"><label className="field-label">Tier</label>
          <select className="fi" value={value.tier || ''} onChange={e => onChange({ ...value, tier: e.target.value })}>
            <option value="">— None —</option>
            {ITEM_TIERS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div style={{ marginBottom: 10 }}>
        <div className="field-label" style={{ marginBottom: 5 }}>Attack Types</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {ATK_TYPES.map(t => <button key={t} className={`badge-toggle${(value.attackTypes || []).includes(t) ? ' on' : ''}`} onClick={() => onChange({ ...value, attackTypes: toggleArr(value.attackTypes || [], t) })}>{t}</button>)}
        </div>
      </div>
      <div className="modal-grid2">
        <div className="field-group"><label className="field-label">Range</label><input className="fi" value={value.range} onChange={e => onChange({ ...value, range: e.target.value })} /></div>
        <div className="field-group"><label className="field-label">Damage</label><input className="fi" value={value.damage} onChange={e => onChange({ ...value, damage: e.target.value })} /></div>
      </div>
      <div style={{ marginBottom: 10 }}>
        <div className="field-label" style={{ marginBottom: 5 }}>Damage Type</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {DMG_TYPES.map(t => <button key={t} className={`badge-toggle${(value.damageType || []).includes(t) ? ' on' : ''}`} onClick={() => onChange({ ...value, damageType: toggleArr(value.damageType || [], t) })}>{t}</button>)}
        </div>
      </div>
      <div className="modal-grid2" style={{ marginBottom: 8 }}>
        <div className="field-group"><label className="field-label">Special Effects</label><textarea className="fi" value={value.specialEffects} onChange={e => onChange({ ...value, specialEffects: e.target.value })} /></div>
        <div className="field-group"><label className="field-label">Resistance Granted</label><textarea className="fi" value={value.resistance || ''} onChange={e => onChange({ ...value, resistance: e.target.value })} placeholder="e.g. Fire 2, Crush 1" /></div>
      </div>
      <div className="field-group" style={{ marginBottom: 8 }}><label className="field-label">Requirements</label><input className="fi" value={value.requirements} onChange={e => onChange({ ...value, requirements: e.target.value })} /></div>
      <div className="field-group" style={{ marginBottom: 8 }}><label className="field-label">Description</label><textarea className="fi" value={value.description} onChange={e => onChange({ ...value, description: e.target.value })} /></div>
      <div className="modal-grid2">
        <div className="field-group"><label className="field-label">Default Qty</label><input className="fi" type="number" min="1" style={{ width: 80 }} value={value.qty} onChange={e => onChange({ ...value, qty: +e.target.value })} /></div>
        <div className="field-group">
          <label className="field-label">Max Uses <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(empty = unlimited)</span></label>
          <input className="fi" type="number" min="1" style={{ width: 80 }}
            value={value.uses?.max ?? ''}
            onChange={e => {
              const raw = e.target.value;
              const max = raw === '' ? null : Math.max(1, +raw);
              onChange({ ...value, uses: { max, current: max } });
            }} />
        </div>
      </div>
    </>
  );
}

const BLANK_FORM = { name: '', icon: '', category: 'Misc', tier: '', attackTypes: [], range: '', damage: '', damageType: [], specialEffects: '', resistance: '', requirements: '', description: '', qty: 1, uses: { max: null, current: null } };

const ITEM_TIER_COLOR = { Crude: 'var(--muted)', Basic: 'var(--text)', Quality: 'var(--cyan)', Superior: 'var(--gold)', Exceptional: 'var(--purple)' };

export default function ItemLibrarySection({ token, players, showToast }) {
  const [items, setItems] = useState([]);
  const [editModal, setEditModal] = useState(null);
  const [form, setForm] = useState({ ...BLANK_FORM });
  const [giveModal, setGiveModal] = useState(null);
  const [giveTarget, setGiveTarget] = useState([]);
  const [giveQty, setGiveQty] = useState(1);

  useEffect(() => { load(); }, []);
  function load() { apiFetch('/api/items', {}, token).then(d => { if (Array.isArray(d)) setItems(d); }); }

  async function create() {
    if (!form.name) return;
    const d = await apiFetch('/api/items', { method: 'POST', body: JSON.stringify(form) }, token);
    if (d._id) { showToast('Item created'); setForm({ ...BLANK_FORM }); load(); }
    else showToast(d.error || 'Error', 'err');
  }
  async function saveEdit() {
    const d = await apiFetch(`/api/items/${editModal._id}`, { method: 'PUT', body: JSON.stringify(editModal) }, token);
    if (d._id) { showToast('Saved'); setEditModal(null); load(); } else showToast(d.error, 'err');
  }
  async function del(id) {
    if (!confirm('Delete this item template?')) return;
    const d = await apiFetch(`/api/items/${id}`, { method: 'DELETE' }, token);
    if (d.ok) { showToast('Deleted'); load(); } else showToast(d.error, 'err');
  }
  async function giveItems() {
    if (giveTarget.length === 0 || !giveModal) return;
    const d = await apiFetch('/api/items/give', { method: 'POST', body: JSON.stringify({ itemId: giveModal._id, userIds: giveTarget, qty: giveQty }) }, token);
    const ok = d.results?.filter(r => r.ok).length || 0;
    showToast(`Given to ${ok}/${giveTarget.length} players`);
    setGiveModal(null); setGiveTarget([]); setGiveQty(1);
  }

  const grouped = {};
  items.forEach(it => { if (!grouped[it.category]) grouped[it.category] = []; grouped[it.category].push(it); });

  return (
    <>
      <div className="panel">
        <div className="panel-title admin">Item Library ({items.length})</div>
        {Object.entries(grouped).map(([cat, its]) => (
          <div key={cat} style={{ marginBottom: 16 }}>
            <div className="section-label">{cat}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 8 }}>
              {its.map(it => (
                <div key={it._id} className="item-card">
                  <div className="item-card-name">
                    <span className="item-card-icon">{it.icon || '📦'}</span>
                    {it.name}
                  </div>
                  <div className="item-card-meta">
                    <span className="badge badge-muted">{it.category}</span>
                    {it.tier && <span className="badge" style={{ borderColor: ITEM_TIER_COLOR[it.tier], color: ITEM_TIER_COLOR[it.tier] }}>{it.tier}</span>}
                    {it.damage && <span className="badge badge-danger">⚔ {it.damage}</span>}
                    {(it.attackTypes || []).map(t => <span key={t} className="badge badge-cyan">{t}</span>)}
                    {(it.damageType || []).map(t => <span key={t} className="badge badge-gold">{t}</span>)}
                    {it.qty > 1 && <span className="badge badge-muted">×{it.qty}</span>}
                    {it.uses?.max != null && <span className="badge badge-cyan">{it.uses.max} uses</span>}
                  </div>
                  {it.description && <div className="item-card-effect">{it.description}</div>}
                  <div className="item-card-actions">
                    <button className="btn btn-purple btn-xs" onClick={() => setEditModal({ ...it })}>Edit</button>
                    <button className="btn btn-cyan btn-xs" onClick={() => { setGiveModal(it); setGiveTarget([]); setGiveQty(it.qty || 1); }}>Give</button>
                    <button className="btn btn-danger btn-xs" onClick={() => del(it._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {items.length === 0 && <span style={{ color: 'var(--muted)', fontSize: 11 }}>No items yet.</span>}
        <div style={{ marginTop: 16, padding: 14, background: 'rgba(0,0,0,.3)', borderRadius: 4, border: '1px dashed var(--muted)' }}>
          <div className="panel-title admin" style={{ marginBottom: 12 }}>Create New Item</div>
          <ItemForm value={form} onChange={setForm} />
          <div style={{ marginTop: 12 }}><button className="btn btn-purple btn-sm" onClick={create}>+ Create Item</button></div>
        </div>
      </div>

      {editModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setEditModal(null); }}>
          <div className="modal-box admin">
            <div className="modal-title admin">Edit Item <button className="modal-close" onClick={() => setEditModal(null)}>✕</button></div>
            <ItemForm value={editModal} onChange={setEditModal} />
            <div className="modal-footer">
              <button className="btn btn-muted btn-sm" onClick={() => setEditModal(null)}>Cancel</button>
              <button className="btn btn-purple btn-sm" onClick={saveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {giveModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setGiveModal(null); }}>
          <div className="modal-box admin">
            <div className="modal-title admin">Give &quot;{giveModal.name}&quot; to Players <button className="modal-close" onClick={() => setGiveModal(null)}>✕</button></div>
            <div className="field-group" style={{ marginBottom: 10 }}>
              <label className="field-label">Quantity</label>
              <input className="fi" type="number" min="1" style={{ width: 80 }} value={giveQty} onChange={e => setGiveQty(+e.target.value)} />
            </div>
            <div className="field-label" style={{ marginBottom: 6 }}>Select Players</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxHeight: 260, overflowY: 'auto' }}>
              {players.map(p => (
                <label key={p.userId} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', border: '1px solid var(--border)', borderRadius: 3, cursor: 'pointer', background: giveTarget.includes(p.userId) ? 'rgba(168,85,247,.08)' : 'transparent' }}>
                  <input type="checkbox" checked={giveTarget.includes(p.userId)} onChange={e => setGiveTarget(t => e.target.checked ? [...t, p.userId] : t.filter(x => x !== p.userId))} />
                  <span style={{ fontWeight: 700, fontSize: 11, color: 'var(--text)' }}>{p.username}</span>
                  <span style={{ fontSize: 10, color: 'var(--muted)' }}>{p.characterName || 'No character'}</span>
                </label>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-muted btn-sm" onClick={() => setGiveModal(null)}>Cancel</button>
              <button className="btn btn-purple btn-sm" onClick={giveItems} disabled={giveTarget.length === 0}>
                Give to {giveTarget.length} player{giveTarget.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
