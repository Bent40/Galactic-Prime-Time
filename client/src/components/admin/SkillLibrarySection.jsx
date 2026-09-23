import { useState, useEffect } from 'react';
import { apiFetch } from '../../api.js';
import { RACES, SKILL_CEILING_MAX, SKILL_CEILING_DEFAULT, skillCeiling } from '../../constants.js';

// §4.2 — the tier rows run to the SKILL's own ceiling, not a fixed 10 (v1.13). A skill
// that stops at 5 no longer shows five empty rows it can never reach, and a designated
// 15 can be authored all the way up.
const tierLevels = (ceiling) => {
  const top = Math.min(SKILL_CEILING_MAX, Math.max(2, Number(ceiling) || SKILL_CEILING_DEFAULT));
  return Array.from({ length: top - 1 }, (_, i) => i + 2);
};

const BLANK_FORM = {
  name: '', momentCost: '', stats: '', passive: false, capacity: 5, maxCapacity: SKILL_CEILING_DEFAULT,
  requirements: '', range: '', target: '', effect: '', description: '',
  achievementUnlock: '', keywords: '', levelEffects: {},
  // Starting-skill eligibility (owner ruling 2026-09-19) — see models/SkillTemplate.js.
  origin: 'basic', raceLock: '', exclusiveTo: '',
};

function LevelEffectsEditor({ value, onChange, ceiling = SKILL_CEILING_DEFAULT }) {
  const levels = tierLevels(ceiling);
  return (
    <div style={{ marginBottom: 8 }}>
      <div className="field-label" style={{ marginBottom: 6 }}>Tier Effects (2–{levels[levels.length - 1]})</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {levels.map(lvl => (
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
      keywords: typeof data.keywords === 'string'
        ? data.keywords.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
        : data.keywords || [],
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
                {(t.keywords || []).map(k => <span key={k} className="badge badge-purple" title="Gemstone compatibility keyword">◈ {k}</span>)}
                {(t.raceLock || t.animalOnly) && <span className="badge badge-cyan" title={`Race-locked: only a ${t.raceLock || 'Animal'} contestant may take this, as one of its 2 racial starting skills`}>{(t.raceLock || 'Animal') === 'Animal' ? '🐾' : '🤖'} {t.raceLock || 'Animal'}</span>}
                {t.origin === 'compound' && <span className="badge badge-muted" title="A Gemstone merge product (§4.5) — never pickable at character creation">⚗ Compound</span>}
                {(t.damageTypes || []).map(d => <span key={d} className="badge badge-cyan" title="§7.3 damage type — the effect the table fires">⚡ {d}</span>)}
                {t.exclusiveTo && <span className="badge badge-gold" title="§4.4 character-exclusive — tied to one contestant and offered to nobody at creation">★ {t.exclusiveTo} only</span>}
                {skillCeiling(t) !== SKILL_CEILING_DEFAULT && <span className="badge badge-muted" title={`§4.2 — this skill's own ceiling. Patron Tokens raise its cap no further than ${skillCeiling(t)}.`}>⬆ max {skillCeiling(t)}</span>}
                {t.achievementUnlock && <span className="badge badge-gold">🔒 {t.achievementUnlock}</span>}
                {t.levelEffects && Object.keys(t.levelEffects).filter(k => t.levelEffects[k]).length > 0 && (
                  <span className="badge badge-muted">
                    {Object.keys(t.levelEffects).filter(k => t.levelEffects[k]).length} tier effects
                  </span>
                )}
              </div>
              {t.effect && <div className="template-effect">{t.effect}</div>}
              <div className="template-actions">
                <button className="btn btn-purple btn-xs" onClick={() => setEditModal({ ...t, stats: (t.stats || []).join(', '), keywords: (t.keywords || []).join(', '), levelEffects: { ...(t.levelEffects || {}) } })}>Edit</button>
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
          <div className="field-group"><label className="field-label" title="A compound skill is a Gemstone merge product (§4.5) and is never pickable at creation">Origin</label>
            <select className="fi" style={{ width: 110 }} value={form.origin}
                    onChange={e => setForm(f => ({ ...f, origin: e.target.value }))}>
              <option value="basic">Basic</option>
              <option value="compound">Compound</option>
            </select>
          </div>
          <div className="field-group"><label className="field-label" title="Only this race may take the skill at creation, as one of its 2 racial picks. Human is the flat race and has none.">Race lock</label>
            <select className="fi" style={{ width: 118 }} value={form.raceLock}
                    onChange={e => setForm(f => ({ ...f, raceLock: e.target.value }))}>
              <option value="">Anyone</option>
              {RACES.filter(r => r !== 'Human').map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
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
              <div className="field-group"><label className="field-label">Keywords (comma-sep, Gemstone compat)</label><input className="fi" value={editModal.keywords || ''} onChange={e => setEditModal(m => ({ ...m, keywords: e.target.value }))} placeholder="magic, fire" /></div>
              <div className="field-group">
                <label className="field-label" title="Compound = a Gemstone merge product (§4.5). Never pickable at creation.">Origin</label>
                <select className="fi" value={editModal.origin || 'basic'}
                        onChange={e => setEditModal(m => ({ ...m, origin: e.target.value }))}>
                  <option value="basic">Basic — pickable at creation</option>
                  <option value="compound">Compound — merge product, never at creation</option>
                </select>
              </div>
              <div className="field-group">
                <label className="field-label" title="Only this race may take the skill at creation, as one of its 2 racial picks. Human is the flat race and has none.">Race lock</label>
                <select className="fi" value={editModal.raceLock ?? (editModal.animalOnly ? 'Animal' : '')}
                        onChange={e => setEditModal(m => ({ ...m, raceLock: e.target.value }))}>
                  <option value="">General — any contestant</option>
                  {RACES.filter(r => r !== 'Human').map(r =>
                    <option key={r} value={r}>{r === 'Animal' ? '🐾' : '🤖'} {r} only</option>)}
                </select>
              </div>
              <div className="field-group">
                <label className="field-label" title="§4.2 — how far Patron Tokens may ever raise this skill's cap. Most basic skills stop at 5, many go to 10, and a designated few reach 15. This is the skill's OWN ceiling, not a system constant.">Ceiling (max level)</label>
                <select className="fi" value={skillCeiling(editModal)}
                        onChange={e => setEditModal(m => ({ ...m, maxCapacity: Number(e.target.value) }))}>
                  <option value={5}>5 — basic: it has said everything by 5</option>
                  <option value={10}>10 — the ordinary ceiling</option>
                  <option value={15}>15 — designated, deliberately</option>
                </select>
              </div>
              <div className="field-group">
                <label className="field-label" title="§7.3 — the effect the table fires when this skill is used. Blank = inferred from the skill's own text (fire → Burn, frost → Chill …).">⚡ Damage types (fx on the table)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, fontSize: 11 }}>
                  {['Bleed', 'Crush', 'Burn', 'Chill', 'Poison', 'Infection', 'Dissolution'].map(t => (
                    <label key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <input type="checkbox" checked={(editModal.damageTypes || []).includes(t)} onChange={e => setEditModal(m => ({ ...m, damageTypes: e.target.checked ? [...(m.damageTypes || []), t] : (m.damageTypes || []).filter(x => x !== t) }))} />{t}
                    </label>
                  ))}
                </div>
              </div>
              <div className="field-group">
                <label className="field-label" title="§4.4 — tied to one contestant's nature and not obtainable by others. Any name here removes the skill from BOTH creation pools. Blank for none.">★ Exclusive to</label>
                <input className="fi" placeholder="(nobody)" value={editModal.exclusiveTo || ''}
                       onChange={e => setEditModal(m => ({ ...m, exclusiveTo: e.target.value }))} />
              </div>
            </div>
            <div className="field-group" style={{ marginBottom: 8 }}><label className="field-label">Requirements</label><input className="fi" value={editModal.requirements || ''} onChange={e => setEditModal(m => ({ ...m, requirements: e.target.value }))} /></div>
            <div className="field-group" style={{ marginBottom: 8 }}><label className="field-label">Base Effect (Tier 1)</label><textarea className="fi" value={editModal.effect || ''} onChange={e => setEditModal(m => ({ ...m, effect: e.target.value }))} /></div>
            <LevelEffectsEditor value={editModal.levelEffects || {}} ceiling={skillCeiling(editModal)} onChange={v => setEditModal(m => ({ ...m, levelEffects: v }))} />
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
