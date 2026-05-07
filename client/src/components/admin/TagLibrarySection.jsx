import { useState, useEffect } from 'react';
import { apiFetch } from '../../api.js';

const BLANK = { name: '', effect: '', conditions: '' };

function TagForm({ value, onChange }) {
  return (
    <>
      <div className="field-group" style={{ marginBottom: 8 }}>
        <label className="field-label">Name</label>
        <input className="fi" value={value.name} onChange={e => onChange({ ...value, name: e.target.value })}
          placeholder="e.g. Bleeding" />
      </div>
      <div className="field-group" style={{ marginBottom: 8 }}>
        <label className="field-label">Effect</label>
        <input className="fi" value={value.effect} onChange={e => onChange({ ...value, effect: e.target.value })}
          placeholder="e.g. Lose 1 HP at the start of each Moment." />
      </div>
      <div className="field-group" style={{ marginBottom: 8 }}>
        <label className="field-label">Conditions</label>
        <input className="fi" value={value.conditions} onChange={e => onChange({ ...value, conditions: e.target.value })}
          placeholder="How is this tag earned? (optional)" />
      </div>
    </>
  );
}

export default function TagLibrarySection({ token, showToast }) {
  const [tags, setTags] = useState([]);
  const [form, setForm] = useState({ ...BLANK });
  const [editModal, setEditModal] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => { load(); }, []);

  function load() {
    apiFetch('/api/tags', {}, token).then(d => { if (Array.isArray(d)) setTags(d); });
  }

  async function create() {
    if (!form.name) return;
    const d = await apiFetch('/api/tags', { method: 'POST', body: JSON.stringify(form) }, token);
    if (d._id) { showToast('Tag created'); setForm({ ...BLANK }); load(); }
    else showToast(d.error || 'Error', 'err');
  }

  async function saveEdit() {
    const d = await apiFetch(`/api/tags/${editModal._id}`, { method: 'PATCH', body: JSON.stringify(editModal) }, token);
    if (d._id) { showToast('Saved'); setEditModal(null); load(); }
    else showToast(d.error || 'Error', 'err');
  }

  async function del(id) {
    if (!confirm('Delete this tag?')) return;
    const d = await apiFetch(`/api/tags/${id}`, { method: 'DELETE' }, token);
    if (d.ok) { showToast('Deleted'); load(); }
    else showToast(d.error || 'Error', 'err');
  }

  const q = search.trim().toLowerCase();
  const visible = tags.filter(t =>
    !q ||
    t.name.toLowerCase().includes(q) ||
    (t.effect || '').toLowerCase().includes(q) ||
    (t.conditions || '').toLowerCase().includes(q)
  );

  return (
    <>
      <div className="panel">
        <div className="panel-title admin">
          Tag Library ({tags.length})
          <input
            className="fi"
            style={{ maxWidth: 220, fontSize: 11, padding: '4px 8px' }}
            placeholder="Search tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 6 }}>
          {visible.map(t => (
            <div key={t._id} style={{
              border: '1px solid var(--border)',
              borderLeft: '3px solid var(--cyan)',
              borderRadius: 4, padding: '8px 10px', background: 'rgba(0,0,0,.2)',
            }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--cyan)', letterSpacing: 1, marginBottom: 3 }}>
                {t.name}
              </div>
              {t.effect && (
                <div style={{ fontSize: 10, color: 'var(--gold)', marginBottom: 2 }}>{t.effect}</div>
              )}
              {t.conditions && (
                <div style={{ fontSize: 10, color: 'var(--muted)', fontStyle: 'italic' }}>
                  Earned: {t.conditions}
                </div>
              )}
              <div className="item-card-actions" style={{ marginTop: 6 }}>
                <button className="btn btn-purple btn-xs" onClick={() => setEditModal({ ...t })}>Edit</button>
                <button className="btn btn-danger btn-xs" onClick={() => del(t._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        {tags.length === 0 && (
          <div style={{ color: 'var(--muted)', fontSize: 11, marginBottom: 16 }}>No tags yet.</div>
        )}
        {tags.length > 0 && visible.length === 0 && (
          <div style={{ color: 'var(--muted)', fontSize: 11, marginBottom: 16, fontStyle: 'italic' }}>No matching tags.</div>
        )}

        {/* Create form */}
        <div style={{ marginTop: 14, padding: 14, background: 'rgba(0,0,0,.3)', borderRadius: 4, border: '1px dashed var(--muted)' }}>
          <div className="panel-title admin" style={{ marginBottom: 12 }}>Create New Tag</div>
          <TagForm value={form} onChange={setForm} />
          <div style={{ marginTop: 4 }}>
            <button className="btn btn-purple btn-sm" onClick={create}>+ Create Tag</button>
          </div>
        </div>
      </div>

      {editModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setEditModal(null); }}>
          <div className="modal-box admin" style={{ width: 560 }}>
            <div className="modal-title admin">
              Edit Tag
              <button className="modal-close" onClick={() => setEditModal(null)}>✕</button>
            </div>
            <TagForm value={editModal} onChange={setEditModal} />
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
