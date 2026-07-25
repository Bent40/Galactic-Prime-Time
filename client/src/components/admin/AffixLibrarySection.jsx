import { useState, useEffect } from 'react';
import { apiFetch } from '../../api.js';
import { AFFIX_TIERS } from '../../constants.js';

const TYPES = ['prefix', 'suffix'];
const TIERS = AFFIX_TIERS;

const TIER_COLOR = {
  Lesser:    'var(--muted)',
  Normal:    'var(--text)',
  Higher:    'var(--cyan)',
  Legendary: 'var(--gold)',
  Mythic:    'var(--purple)',
  Godly:     '#ff6b6b',
};

const BLANK = { name: '', type: 'prefix', tier: 'Normal', effects: '', description: '' };

function AffixForm({ value, onChange }) {
  return (
    <>
      <div className="modal-grid3">
        <div className="field-group">
          <label className="field-label">Name</label>
          <input className="fi" value={value.name} onChange={e => onChange({ ...value, name: e.target.value })}
            placeholder={value.type === 'prefix' ? 'e.g. Blazing' : 'e.g. of the Phoenix'} />
        </div>
        <div className="field-group">
          <label className="field-label">Type</label>
          <select className="fi" value={value.type} onChange={e => onChange({ ...value, type: e.target.value })}>
            {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
        <div className="field-group">
          <label className="field-label">Tier</label>
          <select className="fi" value={value.tier} onChange={e => onChange({ ...value, tier: e.target.value })}
            style={{ color: TIER_COLOR[value.tier] }}>
            {TIERS.map(t => <option key={t} value={t} style={{ color: TIER_COLOR[t] }}>{t}</option>)}
          </select>
        </div>
      </div>
      <div className="modal-grid2" style={{ marginBottom: 8 }}>
        <div className="field-group">
          <label className="field-label">Effects</label>
          <input className="fi" value={value.effects} onChange={e => onChange({ ...value, effects: e.target.value })}
            placeholder="e.g. +2 Burn damage" />
        </div>
        <div className="field-group">
          <label className="field-label">Description</label>
          <input className="fi" value={value.description} onChange={e => onChange({ ...value, description: e.target.value })}
            placeholder="Flavour text..." />
        </div>
      </div>
    </>
  );
}

export default function AffixLibrarySection({ token, showToast }) {
  const [affixes, setAffixes] = useState([]);
  const [form, setForm] = useState({ ...BLANK });
  const [editModal, setEditModal] = useState(null);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => { load(); }, []);

  function load() {
    apiFetch('/api/affixes', {}, token).then(d => { if (Array.isArray(d)) setAffixes(d); });
  }

  async function create() {
    if (!form.name) return;
    const d = await apiFetch('/api/affixes', { method: 'POST', body: JSON.stringify(form) }, token);
    if (d._id) { showToast('Affix created'); setForm({ ...BLANK }); load(); }
    else showToast(d.error || 'Error', 'err');
  }

  async function saveEdit() {
    const d = await apiFetch(`/api/affixes/${editModal._id}`, { method: 'PUT', body: JSON.stringify(editModal) }, token);
    if (d._id) { showToast('Saved'); setEditModal(null); load(); }
    else showToast(d.error || 'Error', 'err');
  }

  async function del(id) {
    if (!confirm('Delete this affix?')) return;
    const d = await apiFetch(`/api/affixes/${id}`, { method: 'DELETE' }, token);
    if (d.ok) { showToast('Deleted'); load(); }
    else showToast(d.error || 'Error', 'err');
  }

  const visible = affixes.filter(a => filterType === 'all' || a.type === filterType);

  // Group: prefix then suffix, each grouped by tier
  const grouped = {};
  for (const t of ['prefix', 'suffix']) {
    grouped[t] = {};
    for (const tier of TIERS) grouped[t][tier] = [];
  }
  visible.forEach(a => {
    if (grouped[a.type]) grouped[a.type][a.tier]?.push(a);
  });

  const prefixCount  = affixes.filter(a => a.type === 'prefix').length;
  const suffixCount  = affixes.filter(a => a.type === 'suffix').length;

  return (
    <>
      <div className="panel">
        <div className="panel-title admin">
          Affix Library ({affixes.length})
          <div style={{ display: 'flex', gap: 5 }}>
            {['all', 'prefix', 'suffix'].map(f => (
              <button key={f} className={`btn btn-xs ${filterType === f ? 'btn-purple' : 'btn-muted'}`}
                onClick={() => setFilterType(f)}>
                {f === 'all' ? `All (${affixes.length})` : f === 'prefix' ? `Prefixes (${prefixCount})` : `Suffixes (${suffixCount})`}
              </button>
            ))}
          </div>
        </div>

        {['prefix', 'suffix'].map(t => {
          const hasSome = TIERS.some(tier => grouped[t][tier].length > 0);
          if ((filterType !== 'all' && filterType !== t) || !hasSome) return null;
          return (
            <div key={t} style={{ marginBottom: 20 }}>
              <div className="section-label" style={{ color: t === 'prefix' ? 'var(--cyan)' : 'var(--purple)', marginBottom: 10 }}>
                {t === 'prefix' ? 'Prefixes' : 'Suffixes'}
              </div>
              {TIERS.map(tier => {
                const list = grouped[t][tier];
                if (list.length === 0) return null;
                return (
                  <div key={tier} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
                      color: TIER_COLOR[tier], marginBottom: 6, paddingLeft: 4 }}>
                      {tier}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 6 }}>
                      {list.map(a => (
                        <div key={a._id} style={{
                          border: `1px solid ${TIER_COLOR[a.tier]}40`,
                          borderLeft: `3px solid ${TIER_COLOR[a.tier]}`,
                          borderRadius: 4, padding: '8px 10px', background: 'rgba(0,0,0,.2)',
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                            <span style={{ fontWeight: 700, fontSize: 12, color: TIER_COLOR[a.tier] }}>
                              {a.type === 'prefix' ? a.name + ' …' : '… ' + a.name}
                            </span>
                            <span style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase' }}>
                              {a.tier}
                            </span>
                          </div>
                          {a.effects && (
                            <div style={{ fontSize: 10, color: 'var(--gold)', marginBottom: 2 }}>{a.effects}</div>
                          )}
                          {a.description && (
                            <div style={{ fontSize: 10, color: 'var(--muted)', fontStyle: 'italic' }}>{a.description}</div>
                          )}
                          <div className="item-card-actions" style={{ marginTop: 6 }}>
                            <button className="btn btn-purple btn-xs" onClick={() => setEditModal({ ...a })}>Edit</button>
                            <button className="btn btn-danger btn-xs" onClick={() => del(a._id)}>Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        {affixes.length === 0 && (
          <div style={{ color: 'var(--muted)', fontSize: 11, marginBottom: 16 }}>No affixes yet.</div>
        )}

        {/* Create form */}
        <div style={{ marginTop: 8, padding: 14, background: 'rgba(0,0,0,.3)', borderRadius: 4, border: '1px dashed var(--muted)' }}>
          <div className="panel-title admin" style={{ marginBottom: 12 }}>Create New Affix</div>
          <AffixForm value={form} onChange={setForm} />
          <div style={{ marginTop: 4 }}>
            <button className="btn btn-purple btn-sm" onClick={create}>+ Create Affix</button>
          </div>
        </div>
      </div>

      {editModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setEditModal(null); }}>
          <div className="modal-box admin" style={{ width: 560 }}>
            <div className="modal-title admin">
              Edit Affix
              <button className="modal-close" onClick={() => setEditModal(null)}>✕</button>
            </div>
            <AffixForm value={editModal} onChange={setEditModal} />
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
