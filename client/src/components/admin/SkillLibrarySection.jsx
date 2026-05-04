import { useState, useEffect } from 'react';
import { apiFetch } from '../../api.js';

const TIER_LEVELS = [2, 3, 4, 5, 6, 7, 8, 9, 10];

const BLANK_FORM = {
  name: '', momentCost: '', stats: '', passive: false, capacity: 5,
  requirements: '', range: '', target: '', effect: '', description: '',
  achievementUnlock: '', levelEffects: {},
};

function LevelEffectsEditor({ value, onChange }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div className="field-label" style={{ marginBottom: 6 }}>Tier Effects (2–10)</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {TIER_LEVELS.map(lvl => (
          <div key={lvl} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: 'var(--cyan)', width: 24, textAlign: 'right', flexShrink: 0 }}>T{lvl}</span>
            <input
              className="fi"
              style={{ flex: 1, fontSize: 11, padding: '3px 7px' }}
              placeholder={`Effect at tier ${lvl}…`}
              value={value?.[lvl] || ''}
              onChange={e => onChange({ ...value, [lvl]: e.target.value })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SkillLibrarySection({ token, showToast }) {
  const [templates, setTemplates] = useState([]);
  const [editModal, setEditModal] = useState(null);
  const [form, setForm] = useState({ ...BLANK_FORM });
  const [bulkText, setBulkText] = useState('');
  const [showBulk, setShowBulk] = useState(false);

  useEffect(() => { load(); }, []);
  function load() { apiFetch('/api/admin/skill-library', {}, token).then(d => { if (Array.isArray(d)) setTemplates(d); }); }

  function prepareBody(data) {
    return {
      ...data,
      stats: typeof data.stats === 'string'
        ? data.stats.split(',').map(s => s.trim()).filter(Boolean)
        : data.stats || [],
      levelEffects: data.levelEffects || {},
    };
  }

  async function create() {
    if (!form.name) return;
    const d = await apiFetch('/api/admin/skill-library', { method: 'POST', body: JSON.stringify(prepareBody(form)) }, token);
    if (d._id) { showToast('Skill created'); setForm({ ...BLANK_FORM }); load(); }
    else showToast(d.error, 'err');
  }

  async function save() {
    if (!editModal.name) return;
    const d = await apiFetch(`/api/admin/skill-library/${editModal._id}`, { method: 'PUT', body: JSON.stringify(prepareBody(editModal)) }, token);
    if (d._id) { showToast('Saved'); setEditModal(null); load(); }
    else showToast(d.error, 'err');
  }

  async function del(id) {
    if (!confirm('Delete this skill template?')) return;
    const d = await apiFetch(`/api/admin/skill-library/${id}`, { method: 'DELETE' }, token);
    if (d.ok) { showToast('Deleted'); load(); } else showToast(d.error, 'err');
  }

  async function bulkImport() {
    try {
      const skills = JSON.parse(bulkText);
      const d = await apiFetch('/api/admin/skill-library/bulk', { method: 'POST', body: JSON.stringify({ skills }) }, token);
      if (d.ok) { showToast(`Added ${d.added}, skipped ${d.skipped}`); setBulkText(''); setShowBulk(false); load(); }
      else showToast(d.error, 'err');
    } catch { showToast('Invalid JSON', 'err'); }
  }

  return (
    <>
      <div className="panel">
        <div className="panel-title admin">
          Skill Library ({templates.length})
          <button className="btn btn-muted btn-sm" onClick={() => setShowBulk(v => !v)}>Bulk Import</button>
        </div>
        {showBulk && (
          <div style={{ marginBottom: 14, padding: 10, background: 'rgba(0,0,0,.3)', borderRadius: 4, border: '1px solid var(--border)' }}>
            <div className="field-label" style={{ marginBottom: 5 }}>Paste JSON array of skill objects</div>
            <textarea className="fi" style={{ minHeight: 80, marginBottom: 8 }} value={bulkText} onChange={e => setBulkText(e.target.value)} placeholder='[{"name":"Skill Name","effect":"..."},...]' />
            <div className="row"><button className="btn btn-purple btn-sm" onClick={bulkImport}>Import</button></div>
          </div>
        )}
        <div className="template-grid">
          {templates.map(t => (
            <div key={t._id} className="template-card">
              <div className="template-name">{t.name}</div>
              <div className="template-meta">
                {t.passive && <span className="badge badge-gold">Passive</span>}
                {t.momentCost && <span className="badge badge-cyan">{t.momentCost}</span>}
                {(t.stats || []).map(s => <span key={s} className="badge badge-muted">{s}</span>)}
                {t.achievementUnlock && <span className="badge badge-gold">🔒 {t.achievementUnlock}</span>}
                {t.levelEffects && Object.keys(t.levelEffects).filter(k => t.levelEffects[k]).length > 0 && (
                  <span className="badge badge-muted">
                    {Object.keys(t.levelEffects).filter(k => t.levelEffects[k]).length} tier effects
                  </span>
                )}
              </div>
              {t.effect && <div className="template-effect">{t.effect}</div>}
              <div className="template-actions">
                <button className="btn btn-purple btn-xs" onClick={() => setEditModal({ ...t, stats: (t.stats || []).join(', '), levelEffects: { ...(t.levelEffects || {}) } })}>Edit</button>
                <button className="btn btn-danger btn-xs" onClick={() => del(t._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
        <div className="add-form" style={{ marginTop: 14 }}>
          <div className="field-group" style={{ flex: 2 }}><label className="field-label">Name</label><input className="fi" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div className="field-group"><label className="field-label">Cost</label><input className="fi" style={{ width: 70 }} value={form.momentCost} onChange={e => setForm(f => ({ ...f, momentCost: e.target.value }))} /></div>
          <div className="field-group" style={{ flex: 2 }}><label className="field-label">Stats</label><input className="fi" value={form.stats} onChange={e => setForm(f => ({ ...f, stats: e.target.value }))} placeholder="Mind, Reflexes" /></div>
          <div className="field-group" style={{ flex: 1 }}><label className="field-label">Unlock</label><input className="fi" value={form.achievementUnlock} onChange={e => setForm(f => ({ ...f, achievementUnlock: e.target.value }))} /></div>
          <div className="field-group" style={{ flex: 3 }}><label className="field-label">Effect</label><input className="fi" value={form.effect} onChange={e => setForm(f => ({ ...f, effect: e.target.value }))} /></div>
          <button className="btn btn-purple btn-sm" onClick={create} style={{ alignSelf: 'flex-end' }}>+ Create</button>
        </div>
      </div>

      {editModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setEditModal(null); }}>
          <div className="modal-box admin">
            <div className="modal-title admin">Edit Skill Template <button className="modal-close" onClick={() => setEditModal(null)}>✕</button></div>
            <div className="modal-grid2">
              <div className="field-group"><label className="field-label">Name</label><input className="fi" value={editModal.name} onChange={e => setEditModal(m => ({ ...m, name: e.target.value }))} /></div>
              <div className="field-group"><label className="field-label">Moment Cost</label><input className="fi" value={editModal.momentCost || ''} onChange={e => setEditModal(m => ({ ...m, momentCost: e.target.value }))} /></div>
              <div className="field-group"><label className="field-label">Stats (comma-sep)</label><input className="fi" value={editModal.stats || ''} onChange={e => setEditModal(m => ({ ...m, stats: e.target.value }))} /></div>
              <div className="field-group"><label className="field-label">Range</label><input className="fi" value={editModal.range || ''} onChange={e => setEditModal(m => ({ ...m, range: e.target.value }))} /></div>
              <div className="field-group"><label className="field-label">Target</label><input className="fi" value={editModal.target || ''} onChange={e => setEditModal(m => ({ ...m, target: e.target.value }))} /></div>
              <div className="field-group"><label className="field-label">Achievement Unlock</label><input className="fi" value={editModal.achievementUnlock || ''} onChange={e => setEditModal(m => ({ ...m, achievementUnlock: e.target.value }))} /></div>
            </div>
            <div className="field-group" style={{ marginBottom: 8 }}><label className="field-label">Requirements</label><input className="fi" value={editModal.requirements || ''} onChange={e => setEditModal(m => ({ ...m, requirements: e.target.value }))} /></div>
            <div className="field-group" style={{ marginBottom: 8 }}><label className="field-label">Base Effect (Tier 1)</label><textarea className="fi" value={editModal.effect || ''} onChange={e => setEditModal(m => ({ ...m, effect: e.target.value }))} /></div>
            <LevelEffectsEditor value={editModal.levelEffects || {}} onChange={v => setEditModal(m => ({ ...m, levelEffects: v }))} />
            <div className="field-group" style={{ marginBottom: 8 }}><label className="field-label">Description</label><textarea className="fi" value={editModal.description || ''} onChange={e => setEditModal(m => ({ ...m, description: e.target.value }))} /></div>
            <div className="modal-footer">
              <button className="btn btn-muted btn-sm" onClick={() => setEditModal(null)}>Cancel</button>
              <button className="btn btn-purple btn-sm" onClick={save}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
