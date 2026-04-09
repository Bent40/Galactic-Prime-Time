import { useState, useEffect } from 'react';
import { apiFetch } from '../../api.js';
import { uid, TRAIT_LABELS } from '../../constants.js';

export default function PlayerPanel({ player, token, showToast }) {
  const [charData, setCharData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenForm, setTokenForm] = useState({ narrative: 0, upgrade: 0, patronTokens: 0 });
  const [skillForm, setSkillForm] = useState({ name: '', momentCost: '', stats: '', effect: '', description: '' });
  const [achForm, setAchForm] = useState({ title: '', desc: '', reward: '' });
  const [tagForm, setTagForm] = useState('');
  const [skillLib, setSkillLib] = useState([]);
  const [libSearch, setLibSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    apiFetch(`/api/admin/players/${player.userId}`, {}, token).then(d => {
      setCharData(d);
      if (d.state?.tokens) setTokenForm({ narrative: d.state.tokens.narrative || 0, upgrade: d.state.tokens.upgrade || 0, patronTokens: d.state.tokens.patronTokens || 0 });
      setLoading(false);
    });
    apiFetch('/api/admin/skill-library', {}, token).then(d => { if (Array.isArray(d)) setSkillLib(d); });
  }, [player.userId]);

  if (loading) return <div style={{ padding: 20, color: 'var(--muted)', fontSize: 11, letterSpacing: 2 }}>LOADING...</div>;
  if (!charData) return null;

  const state = charData.state || {};
  const id = state.identity || {};
  function traitTotal(t) { return (state.traits?.[t] || 0) + (state.traitBonus?.[t] || 0) + (state.traitLevelBonus?.[t] || 0); }

  async function adjustTrait(trait, field, delta) {
    const current = (state[field]?.[trait] || 0) + delta;
    const newField = { ...(state[field] || {}), [trait]: Math.max(0, current) };
    const d = await apiFetch(`/api/admin/players/${player.userId}/traits`, {
      method: 'PATCH', body: JSON.stringify({ [field]: newField }),
    }, token);
    if (d.ok) {
      setCharData(cd => ({ ...cd, state: { ...cd.state, [field]: newField } }));
      showToast('Saved');
    } else showToast(d.error || 'Save failed', 'err');
  }
  async function saveTokens() {
    const d = await apiFetch(`/api/admin/players/${player.userId}/tokens`, { method: 'PATCH', body: JSON.stringify(tokenForm) }, token);
    if (d.ok) showToast('Tokens updated'); else showToast(d.error, 'err');
  }
  async function addSkill(fromLib) {
    const sk = fromLib || skillForm;
    const d = await apiFetch(`/api/admin/players/${player.userId}/skills`, {
      method: 'POST',
      body: JSON.stringify({
        name: sk.name, momentCost: sk.momentCost,
        stats: typeof sk.stats === 'string' ? sk.stats.split(',').map(s => s.trim()).filter(Boolean) : sk.stats,
        effect: sk.effect, description: sk.description,
      }),
    }, token);
    if (d.ok) {
      showToast('Skill added');
      setCharData(cd => ({ ...cd, state: { ...cd.state, skills: [...(cd.state?.skills || []), d.skill] } }));
      setSkillForm({ name: '', momentCost: '', stats: '', effect: '', description: '' });
    } else showToast(d.error, 'err');
  }
  async function updateSkillLevel(sk, delta) {
    const newLevel = Math.max(0, (sk.level || 0) + delta);
    const d = await apiFetch(`/api/admin/players/${player.userId}/skills/${sk.id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...sk, level: newLevel }),
    }, token);
    if (d.ok) {
      setCharData(cd => ({ ...cd, state: { ...cd.state, skills: (cd.state?.skills || []).map(s => s.id === sk.id ? { ...s, level: newLevel } : s) } }));
    } else showToast(d.error, 'err');
  }
  async function rmSkill(skillId) {
    if (!confirm('Remove this skill?')) return;
    const d = await apiFetch(`/api/admin/players/${player.userId}/skills/${skillId}`, { method: 'DELETE' }, token);
    if (d.ok) {
      showToast('Skill removed');
      setCharData(cd => ({ ...cd, state: { ...cd.state, skills: (cd.state?.skills || []).filter(s => s.id !== skillId) } }));
    } else showToast(d.error, 'err');
  }
  async function grantAch() {
    if (!achForm.title) return;
    const d = await apiFetch(`/api/admin/players/${player.userId}/achievements`, { method: 'POST', body: JSON.stringify(achForm) }, token);
    if (d.ok) {
      showToast('Achievement granted');
      setCharData(cd => ({ ...cd, state: { ...cd.state, achievements: [...(cd.state?.achievements || []), d.achievement] } }));
      setAchForm({ title: '', desc: '', reward: '' });
    } else showToast(d.error, 'err');
  }
  async function revokeAch(achId) {
    if (!confirm('Revoke this achievement?')) return;
    const d = await apiFetch(`/api/admin/players/${player.userId}/achievements/${achId}`, { method: 'DELETE' }, token);
    if (d.ok) {
      showToast('Achievement revoked');
      setCharData(cd => ({ ...cd, state: { ...cd.state, achievements: (cd.state?.achievements || []).filter(a => a.id !== achId) } }));
    } else showToast(d.error, 'err');
  }
  async function addTag() {
    if (!tagForm.trim()) return;
    const newTags = [...(state.tags || []), { id: uid(), name: tagForm.trim(), state: 'active', effect: '' }];
    const d = await apiFetch(`/api/admin/players/${player.userId}/tags`, { method: 'PATCH', body: JSON.stringify({ tags: newTags }) }, token);
    if (d.ok) { showToast('Tag added'); setCharData(cd => ({ ...cd, state: { ...cd.state, tags: newTags } })); setTagForm(''); }
    else showToast(d.error, 'err');
  }
  async function rmTag(tagId) {
    const newTags = (state.tags || []).filter(t => t.id !== tagId);
    const d = await apiFetch(`/api/admin/players/${player.userId}/tags`, { method: 'PATCH', body: JSON.stringify({ tags: newTags }) }, token);
    if (d.ok) { showToast('Tag removed'); setCharData(cd => ({ ...cd, state: { ...cd.state, tags: newTags } })); }
    else showToast(d.error, 'err');
  }

  const filteredLib = skillLib.filter(s => s.name.toLowerCase().includes(libSearch.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header */}
      <div className="panel">
        <div className="player-panel-header">
          <div className="pp-portrait">
            {id.portrait ? <img src={id.portrait} alt="portrait" /> : (id.name?.[0] || player.username[0]).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div className="pp-name">{id.name || player.username}</div>
            <div className="pp-sub">Player: {player.username} · Updated {charData.updatedAt ? new Date(charData.updatedAt).toLocaleDateString() : '—'}</div>
            <div className="pp-tags">
              <span className="pp-tag lvl">Lv {id.level || 1}</span>
              {id.race && <span className="pp-tag race">{id.race}</span>}
              {player.isAdmin && <span className="pp-tag admin-flag">Admin</span>}
            </div>
          </div>
        </div>
        <div className="stats-grid">
          {['physique', 'reflexes', 'mind', 'charm'].map(t => {
            const base = state.traits?.[t] || 0;
            const bonus = state.traitBonus?.[t] || 0;
            const lvBonus = state.traitLevelBonus?.[t] || 0;
            return (
              <div key={t} className="stat-box">
                <div className="stat-name">{TRAIT_LABELS[t]}</div>
                <div className="stat-val">{traitTotal(t)}</div>
                <div style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 4 }}>
                  Base {base}{bonus ? ` +${bonus}` : ''}{lvBonus ? ` +${lvBonus}Lv` : ''}
                </div>
                <div style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button className="btn btn-muted btn-xs" onClick={() => adjustTrait(t, 'traitBonus', -1)} disabled={bonus <= 0} title="Remove bonus pt">−B</button>
                  <button className="btn btn-cyan btn-xs" onClick={() => adjustTrait(t, 'traitBonus', 1)} title="Add bonus pt">+B</button>
                  <button className="btn btn-muted btn-xs" onClick={() => adjustTrait(t, 'traitLevelBonus', -1)} disabled={lvBonus <= 0} title="Remove level pt">−L</button>
                  <button className="btn btn-gold btn-xs" onClick={() => adjustTrait(t, 'traitLevelBonus', 1)} title="Add level pt">+L</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tokens */}
      <div className="panel">
        <div className="panel-title admin">Tokens</div>
        <div className="token-grid" style={{ marginBottom: 10 }}>
          {[['narrative', 'Narrative'], ['upgrade', 'Upgrade'], ['patronTokens', 'Patron']].map(([k, lbl]) => (
            <div key={k} className="token-box">
              <div className="token-label">{lbl}</div>
              <div className="token-val">{state.tokens?.[k] || 0}</div>
            </div>
          ))}
        </div>
        <div className="form-row">
          {[['narrative', 'Narrative'], ['upgrade', 'Upgrade'], ['patronTokens', 'Patron']].map(([k, lbl]) => (
            <div key={k} className="field-group">
              <label className="field-label">{lbl}</label>
              <input className="fi" type="number" min="0" value={tokenForm[k]} onChange={e => setTokenForm(f => ({ ...f, [k]: +e.target.value }))} />
            </div>
          ))}
          <button className="btn btn-purple btn-sm" onClick={saveTokens} style={{ alignSelf: 'flex-end' }}>Save Tokens</button>
        </div>
      </div>

      {/* Skills */}
      <div className="panel">
        <div className="panel-title admin">Skills ({(state.skills || []).length})</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 10 }}>
          {(state.skills || []).map(sk => (
            <div key={sk.id} className="skill-row">
              <span className="skill-row-name">{sk.name}</span>
              <span className="skill-row-meta">{sk.momentCost || '—'}</span>
              {sk.passive && <span className="skill-badge passive">Passive</span>}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
                <button className="btn btn-muted btn-xs" onClick={() => updateSkillLevel(sk, -1)}>−</button>
                <span style={{ fontSize: 10, minWidth: 32, textAlign: 'center', color: 'var(--cyan)', fontFamily: 'monospace' }}>Lv {sk.level || 0}</span>
                <button className="btn btn-cyan btn-xs" onClick={() => updateSkillLevel(sk, 1)}>+</button>
              </div>
              <button className="btn btn-danger btn-xs" onClick={() => rmSkill(sk.id)}>✕</button>
            </div>
          ))}
          {(!state.skills || state.skills.length === 0) && <span style={{ color: 'var(--muted)', fontSize: 11 }}>No skills.</span>}
        </div>
        <div className="section-label">Add from Library</div>
        <input className="fi" placeholder="Search library..." value={libSearch} onChange={e => setLibSearch(e.target.value)} style={{ marginBottom: 6 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 180, overflowY: 'auto', marginBottom: 10 }}>
          {filteredLib.map(t => (
            <div key={t._id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', border: '1px solid var(--border)', borderRadius: 3, background: 'rgba(0,0,0,.2)', cursor: 'pointer' }}
              onClick={() => addSkill(t)}>
              <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{t.name}</span>
              <span style={{ fontSize: 9, color: 'var(--muted)' }}>{t.capacity || 'Active'} · {t.momentCost || '—'}</span>
            </div>
          ))}
        </div>
        <div className="add-form">
          <div className="field-group" style={{ flex: 2 }}><label className="field-label">Skill Name</label><input className="fi" value={skillForm.name} onChange={e => setSkillForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div className="field-group"><label className="field-label">Cost</label><input className="fi" style={{ width: 60 }} value={skillForm.momentCost} onChange={e => setSkillForm(f => ({ ...f, momentCost: e.target.value }))} /></div>
          <div className="field-group" style={{ flex: 2 }}><label className="field-label">Stats (comma-sep)</label><input className="fi" value={skillForm.stats} onChange={e => setSkillForm(f => ({ ...f, stats: e.target.value }))} /></div>
          <button className="btn btn-purple btn-sm" onClick={() => addSkill(null)} style={{ alignSelf: 'flex-end' }}>+ Add</button>
        </div>
      </div>

      {/* Achievements */}
      <div className="panel">
        <div className="panel-title admin">Achievements ({(state.achievements || []).length})</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 10 }}>
          {(state.achievements || []).map(a => (
            <div key={a.id} className="ach-card">
              <div className="ach-icon">🏆</div>
              <div className="ach-body">
                <div className="ach-title">{a.title}</div>
                {a.desc && <div className="ach-desc">{a.desc}</div>}
                {a.reward && <div className="ach-reward">{a.reward}</div>}
              </div>
              <button className="btn btn-danger btn-xs" onClick={() => revokeAch(a.id)}>✕</button>
            </div>
          ))}
          {(!state.achievements || state.achievements.length === 0) && <span style={{ color: 'var(--muted)', fontSize: 11 }}>No achievements.</span>}
        </div>
        <div className="add-form">
          <div className="field-group" style={{ flex: 2 }}><label className="field-label">Title</label><input className="fi" value={achForm.title} onChange={e => setAchForm(f => ({ ...f, title: e.target.value }))} /></div>
          <div className="field-group" style={{ flex: 3 }}><label className="field-label">Description</label><input className="fi" value={achForm.desc} onChange={e => setAchForm(f => ({ ...f, desc: e.target.value }))} /></div>
          <div className="field-group" style={{ flex: 2 }}><label className="field-label">Reward</label><input className="fi" value={achForm.reward} onChange={e => setAchForm(f => ({ ...f, reward: e.target.value }))} /></div>
          <button className="btn btn-gold btn-sm" onClick={grantAch} style={{ alignSelf: 'flex-end' }}>Grant</button>
        </div>
      </div>

      {/* Tags */}
      <div className="panel">
        <div className="panel-title admin">Tags</div>
        <div className="row" style={{ flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          {(state.tags || []).map(tag => (
            <span key={tag.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, background: 'rgba(0,212,255,.07)', border: '1px solid rgba(0,212,255,.25)', color: 'var(--cyan)', fontSize: 10 }}>
              {tag.name} <span style={{ color: 'var(--muted)', fontSize: 8 }}>({tag.state})</span>
              <button style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 10, padding: 0 }} onClick={() => rmTag(tag.id)}>✕</button>
            </span>
          ))}
          {(!state.tags || state.tags.length === 0) && <span style={{ color: 'var(--muted)', fontSize: 11 }}>No tags.</span>}
        </div>
        <div className="row">
          <input className="fi" style={{ flex: 1 }} placeholder="Tag name..." value={tagForm} onChange={e => setTagForm(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()} />
          <button className="btn btn-cyan btn-sm" onClick={addTag}>+ Tag</button>
        </div>
      </div>
    </div>
  );
}
