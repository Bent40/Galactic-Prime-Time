import { useState, useEffect } from 'react';
import { apiFetch } from '../../api.js';

const BLANK_BP    = { name: '', maxHp: 3 };
const BLANK_PHASE = { name: 'Phase', description: '', hpThreshold: '' };
const BLANK = { name: '', tier: 'mob', color: '#ff2255', description: '', notes: '', bodyParts: [], phases: [] };
const TIERS = ['mob', 'elite', 'boss', 'legendary'];
const TIER_COLOR = { mob: 'var(--muted)', elite: 'var(--cyan)', boss: 'var(--gold)', legendary: 'var(--purple)' };

const DEFAULT_BODY_PARTS = [
  { name: 'Head', maxHp: 3 },
  { name: 'Torso', maxHp: 5 },
  { name: 'Left Arm', maxHp: 3 },
  { name: 'Right Arm', maxHp: 3 },
  { name: 'Left Leg', maxHp: 4 },
  { name: 'Right Leg', maxHp: 4 },
];

function BodyPartsEditor({ parts, onChange }) {
  function patch(idx, k, v) {
    const next = parts.map((p, i) => i === idx ? { ...p, [k]: v } : p);
    onChange(next);
  }
  function add() { onChange([...parts, { ...BLANK_BP }]); }
  function remove(idx) { onChange(parts.filter((_, i) => i !== idx)); }
  function useDefaults() { onChange(DEFAULT_BODY_PARTS.map(p => ({ ...p }))); }

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <label className="field-label">Body Parts</label>
        <div style={{ display: 'flex', gap: 5 }}>
          {parts.length === 0 && (
            <button className="btn btn-muted btn-xs" onClick={useDefaults}>Use Defaults</button>
          )}
          <button className="btn btn-cyan btn-xs" onClick={add}>+ Part</button>
        </div>
      </div>
      {parts.length === 0 && (
        <div style={{ color: 'var(--muted)', fontSize: 10, padding: '6px 0' }}>
          No body parts. Click "Use Defaults" for standard humanoid layout or "Add Part" to add manually.
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {parts.map((bp, idx) => (
          <div key={idx} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input
              className="fi"
              style={{ flex: 1 }}
              placeholder="Part name (e.g. Head)"
              value={bp.name}
              onChange={e => patch(idx, 'name', e.target.value)}
            />
            <input
              className="fi"
              type="number"
              min="1"
              style={{ width: 68, textAlign: 'center' }}
              title="Max HP"
              value={bp.maxHp}
              onChange={e => patch(idx, 'maxHp', Math.max(1, +e.target.value))}
            />
            <span style={{ fontSize: 9, color: 'var(--muted)', whiteSpace: 'nowrap' }}>HP</span>
            <button className="btn btn-danger btn-xs" onClick={() => remove(idx)}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhasesEditor({ phases, onChange }) {
  function patch(idx, k, v) {
    onChange(phases.map((p, i) => i === idx ? { ...p, [k]: v } : p));
  }
  function add()        { onChange([...phases, { ...BLANK_PHASE }]); }
  function remove(idx)  { onChange(phases.filter((_, i) => i !== idx)); }

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <label className="field-label" style={{ color: 'var(--gold)' }}>Phases</label>
        <button className="btn btn-gold btn-xs" onClick={add}>+ Phase</button>
      </div>
      {phases.length === 0 && (
        <div style={{ color: 'var(--muted)', fontSize: 10, padding: '6px 0' }}>
          No phases defined. Add phases to track boss transitions.
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {phases.map((ph, idx) => (
          <div key={idx} style={{ background: 'rgba(200,168,75,.06)', border: '1px solid rgba(200,168,75,.25)', borderRadius: 4, padding: '8px 10px' }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 700, minWidth: 18 }}>{idx + 1}</span>
              <input
                className="fi"
                style={{ flex: 1 }}
                placeholder="Phase name (e.g. Enraged)"
                value={ph.name}
                onChange={e => patch(idx, 'name', e.target.value)}
              />
              <input
                className="fi"
                style={{ width: 140 }}
                placeholder="Trigger (e.g. 50% HP)"
                value={ph.hpThreshold}
                onChange={e => patch(idx, 'hpThreshold', e.target.value)}
              />
              <button className="btn btn-danger btn-xs" onClick={() => remove(idx)}>✕</button>
            </div>
            <textarea
              className="fi"
              placeholder="Phase description / abilities..."
              value={ph.description}
              onChange={e => patch(idx, 'description', e.target.value)}
              style={{ width: '100%', minHeight: 42, fontSize: 11, resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function EnemyForm({ value, onChange }) {
  return (
    <>
      <div className="modal-grid3">
        <div className="field-group">
          <label className="field-label">Name</label>
          <input className="fi" value={value.name} onChange={e => onChange({ ...value, name: e.target.value })} />
        </div>
        <div className="field-group">
          <label className="field-label">Tier</label>
          <select className="fi" value={value.tier} onChange={e => onChange({ ...value, tier: e.target.value })}>
            {TIERS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
        <div className="field-group">
          <label className="field-label">Tracker Color</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="color" value={value.color} onChange={e => onChange({ ...value, color: e.target.value })}
              style={{ width: 38, height: 32, border: '1px solid var(--muted)', borderRadius: 3, background: 'transparent', cursor: 'pointer', padding: 2 }} />
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>{value.color}</span>
          </div>
        </div>
      </div>
      <div className="modal-grid2" style={{ marginBottom: 8 }}>
        <div className="field-group">
          <label className="field-label">Description</label>
          <input className="fi" value={value.description} onChange={e => onChange({ ...value, description: e.target.value })} placeholder="Short description..." />
        </div>
        <div className="field-group">
          <label className="field-label">Notes</label>
          <textarea className="fi" value={value.notes} onChange={e => onChange({ ...value, notes: e.target.value })} placeholder="Abilities, weaknesses, lore..." style={{ minHeight: 52 }} />
        </div>
      </div>
      <BodyPartsEditor
        parts={value.bodyParts || []}
        onChange={bps => onChange({ ...value, bodyParts: bps })}
      />
      {(value.tier === 'boss' || value.tier === 'legendary') && (
        <PhasesEditor
          phases={value.phases || []}
          onChange={phs => onChange({ ...value, phases: phs })}
        />
      )}
    </>
  );
}

export default function EnemiesSection({ token, showToast, onEnemiesChange }) {
  const [enemies, setEnemies] = useState([]);
  const [form, setForm] = useState({ ...BLANK, bodyParts: [] });
  const [editModal, setEditModal] = useState(null);

  useEffect(() => { load(); }, []);

  function load() {
    apiFetch('/api/enemies', {}, token).then(d => {
      if (Array.isArray(d)) { setEnemies(d); onEnemiesChange?.(d); }
    });
  }

  async function create() {
    if (!form.name) return;
    const d = await apiFetch('/api/enemies', { method: 'POST', body: JSON.stringify(form) }, token);
    if (d._id) { showToast('Enemy created'); setForm({ ...BLANK, bodyParts: [], phases: [] }); load(); }
    else showToast(d.error || 'Error', 'err');
  }

  async function saveEdit() {
    const d = await apiFetch(`/api/enemies/${editModal._id}`, { method: 'PUT', body: JSON.stringify(editModal) }, token);
    if (d._id) { showToast('Saved'); setEditModal(null); load(); }
    else showToast(d.error, 'err');
  }

  async function del(id) {
    if (!confirm('Delete this enemy?')) return;
    const d = await apiFetch(`/api/enemies/${id}`, { method: 'DELETE' }, token);
    if (d.ok) { showToast('Deleted'); load(); }
    else showToast(d.error, 'err');
  }

  const grouped = {};
  TIERS.forEach(t => { grouped[t] = []; });
  enemies.forEach(e => { grouped[e.tier || 'mob'].push(e); });

  return (
    <>
      <div className="panel">
        <div className="panel-title admin">Enemy Library ({enemies.length})</div>

        {TIERS.map(tier => grouped[tier].length > 0 && (
          <div key={tier} style={{ marginBottom: 16 }}>
            <div className="section-label" style={{ color: TIER_COLOR[tier] }}>
              {tier.charAt(0).toUpperCase() + tier.slice(1)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 8 }}>
              {grouped[tier].map(e => (
                <div key={e._id} className="enemy-card" style={{ borderLeft: `3px solid ${e.color}` }}>
                  <div className="enemy-card-header">
                    <span className="enemy-card-name" style={{ color: e.color }}>{e.name}</span>
                    <span className="badge badge-muted" style={{ borderColor: TIER_COLOR[e.tier], color: TIER_COLOR[e.tier] }}>
                      {e.tier}
                    </span>
                  </div>
                  {e.description && <div className="enemy-card-desc">{e.description}</div>}

                  {(e.bodyParts || []).length > 0 && (
                    <div className="enemy-bp-list">
                      {e.bodyParts.map((bp, i) => (
                        <div key={i} className="enemy-bp-row">
                          <span className="enemy-bp-name">{bp.name}</span>
                          <span className="enemy-bp-hp">{bp.maxHp} HP</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {(e.phases || []).length > 0 && (
                    <div className="enemy-bp-list" style={{ borderTop: '1px solid rgba(200,168,75,.2)', marginTop: 4, paddingTop: 4 }}>
                      {e.phases.map((ph, i) => (
                        <div key={i} className="enemy-bp-row">
                          <span className="enemy-bp-name" style={{ color: 'var(--gold)' }}>Phase {i + 1}: {ph.name}</span>
                          {ph.hpThreshold && <span className="enemy-bp-hp" style={{ color: 'var(--muted)' }}>{ph.hpThreshold}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                  {e.notes && <div className="enemy-card-notes">{e.notes}</div>}
                  <div className="item-card-actions">
                    <button className="btn btn-purple btn-xs" onClick={() => setEditModal({ ...e, bodyParts: e.bodyParts ? [...e.bodyParts] : [], phases: e.phases ? [...e.phases] : [] })}>Edit</button>
                    <button className="btn btn-danger btn-xs" onClick={() => del(e._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {enemies.length === 0 && <div style={{ color: 'var(--muted)', fontSize: 11, marginBottom: 16 }}>No enemies yet.</div>}

        <div style={{ padding: 14, background: 'rgba(0,0,0,.3)', borderRadius: 4, border: '1px dashed var(--muted)' }}>
          <div className="panel-title admin" style={{ marginBottom: 12 }}>Create New Enemy</div>
          <EnemyForm value={form} onChange={setForm} />
          <div style={{ marginTop: 12 }}>
            <button className="btn btn-danger btn-sm" onClick={create}>+ Create Enemy</button>
          </div>
        </div>
      </div>

      {editModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setEditModal(null); }}>
          <div className="modal-box admin" style={{ width: 620 }}>
            <div className="modal-title admin">
              Edit Enemy
              <button className="modal-close" onClick={() => setEditModal(null)}>✕</button>
            </div>
            <EnemyForm value={editModal} onChange={setEditModal} />
            <div className="modal-footer">
              <button className="btn btn-muted btn-sm" onClick={() => setEditModal(null)}>Cancel</button>
              <button className="btn btn-purple btn-sm" onClick={saveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
