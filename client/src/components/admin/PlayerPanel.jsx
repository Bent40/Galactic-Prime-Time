import { useState, useEffect } from 'react';
import { apiFetch } from '../../api.js';
import { uid, TRAIT_LABELS, ATK_TYPES, DMG_TYPES } from '../../constants.js';

export default function PlayerPanel({ player, token, showToast }) {
  const [charData, setCharData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenForm, setTokenForm] = useState({ narrative: 0, upgrade: 0, patronTokens: 0 });
  const [skillForm, setSkillForm] = useState({ name: '', momentCost: '', stats: '', effect: '', description: '' });
  const [achForm, setAchForm] = useState({ title: '', desc: '', reward: '' });
  const [tagForm, setTagForm] = useState('');
  const [skillLib, setSkillLib] = useState([]);
  const [libSearch, setLibSearch] = useState('');
  const [itemLib, setItemLib] = useState([]);
  const [itemSearch, setItemSearch] = useState('');
  const [giveQty, setGiveQty] = useState(1);
  const [followersInput, setFollowersInput] = useState('');
  const [viewersInput, setViewersInput] = useState('');
  const [invCats, setInvCats] = useState(null); // local inventory state for editing
  const [invItemModal, setInvItemModal] = useState(null); // { item, catId }
  const [invSaving, setInvSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiFetch(`/api/admin/players/${player.userId}`, {}, token).then(d => {
      setCharData(d);
      if (d.state?.tokens) setTokenForm({ narrative: d.state.tokens.narrative || 0, upgrade: d.state.tokens.upgrade || 0, patronTokens: d.state.tokens.patronTokens || 0 });
      setInvCats(d.state?.inventory?.categories ? JSON.parse(JSON.stringify(d.state.inventory.categories)) : []);
      setLoading(false);
    });
    apiFetch('/api/admin/skill-library', {}, token).then(d => { if (Array.isArray(d)) setSkillLib(d); });
    apiFetch('/api/items', {}, token).then(d => { if (Array.isArray(d)) setItemLib(d); });
  }, [player.userId]);

  if (loading) return <div style={{ padding: 20, color: 'var(--muted)', fontSize: 11, letterSpacing: 2 }}>LOADING...</div>;
  if (!charData) return null;

  const state = charData.state || {};
  const id = state.identity || {};
  function traitTotal(t) {
    const tr = state.traits?.[t] || {};
    return (tr.base || 0) + (tr.bonus || 0) + (tr.levelBonus || 0);
  }

  // subField: 'bonus' or 'levelBonus'
  async function adjustTrait(trait, subField, delta) {
    const currentVal = (state.traits?.[trait]?.[subField] || 0) + delta;
    const newTraitVal = { ...(state.traits?.[trait] || {}), [subField]: Math.max(0, currentVal) };
    const newTraits = { ...(state.traits || {}), [trait]: newTraitVal };
    const d = await apiFetch(`/api/admin/players/${player.userId}/traits`, {
      method: 'PATCH', body: JSON.stringify({ traits: newTraits }),
    }, token);
    if (d.ok) {
      setCharData(cd => ({ ...cd, state: { ...cd.state, traits: newTraits } }));
      showToast('Saved');
    } else showToast(d.error || 'Save failed', 'err');
  }
  async function saveTokens() {
    const d = await apiFetch(`/api/admin/players/${player.userId}/tokens`, { method: 'PATCH', body: JSON.stringify(tokenForm) }, token);
    if (d.ok) showToast('Tokens updated'); else showToast(d.error, 'err');
  }
  async function addSkill(fromLib) {
    const body = fromLib
      ? { templateId: fromLib._id }
      : {
          name: skillForm.name, momentCost: skillForm.momentCost,
          stats: skillForm.stats.split(',').map(s => s.trim()).filter(Boolean),
          effect: skillForm.effect, description: skillForm.description,
        };
    const d = await apiFetch(`/api/admin/players/${player.userId}/skills`, {
      method: 'POST', body: JSON.stringify(body),
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

  async function giveItem(item) {
    const d = await apiFetch('/api/items/give', {
      method: 'POST',
      body: JSON.stringify({ itemId: item._id, userIds: [player.userId], qty: giveQty }),
    }, token);
    const ok = d.results?.filter(r => r.ok).length || 0;
    if (ok) showToast(`Gave ${giveQty}× ${item.name}`);
    else showToast(d.results?.[0]?.error || 'Failed to give item', 'err');
  }
  async function saveFollowers() {
    if (!followersInput.trim()) return;
    const d = await apiFetch(`/api/admin/players/${player.userId}/exposure`, {
      method: 'PATCH', body: JSON.stringify({ followers: followersInput.trim() }),
    }, token);
    if (d.ok) { showToast('Followers updated'); setFollowersInput(''); }
    else showToast(d.error || 'Failed', 'err');
  }
  async function saveViewers() {
    if (!viewersInput.trim()) return;
    const d = await apiFetch(`/api/admin/players/${player.userId}/exposure`, {
      method: 'PATCH', body: JSON.stringify({ viewers: viewersInput.trim() }),
    }, token);
    if (d.ok) { showToast('Viewers updated'); setViewersInput(''); }
    else showToast(d.error || 'Failed', 'err');
  }

  // ---- Inventory helpers ----
  function mutateCats(fn) { setInvCats(prev => fn(JSON.parse(JSON.stringify(prev)))); }
  function invAddItem(catId) {
    mutateCats(cs => cs.map(c => c.id === catId ? {
      ...c, items: [...(c.items || []), {
        id: uid(), name: 'New Item', icon: '', qty: 1, category: 'Misc',
        attackTypes: [], range: '', damage: '', damageType: [],
        specialEffects: '', resistance: '', requirements: '', description: '', tier: '',
      }],
    } : c));
  }
  function invUpdateItem(catId, updated) {
    mutateCats(cs => cs.map(c => c.id === catId
      ? { ...c, items: (c.items || []).map(i => i.id === updated.id ? updated : i) }
      : c));
  }
  function invDeleteItem(catId, itemId) {
    mutateCats(cs => cs.map(c => c.id === catId
      ? { ...c, items: (c.items || []).filter(i => i.id !== itemId) }
      : c));
  }
  function invMoveItem(fromCatId, toCatId, itemId) {
    mutateCats(cs => {
      const item = cs.find(c => c.id === fromCatId)?.items?.find(i => i.id === itemId);
      if (!item) return cs;
      return cs.map(c => {
        if (c.id === fromCatId) return { ...c, items: (c.items || []).filter(i => i.id !== itemId) };
        if (c.id === toCatId) return { ...c, items: [...(c.items || []), item] };
        return c;
      });
    });
  }
  async function saveInventory() {
    setInvSaving(true);
    const newState = { ...charData.state, inventory: { ...charData.state?.inventory, categories: invCats } };
    const d = await apiFetch(`/api/admin/players/${player.userId}/state`, {
      method: 'PUT', body: JSON.stringify({ state: newState }),
    }, token);
    if (d.ok) {
      showToast('Inventory saved');
      setCharData(cd => ({ ...cd, state: newState }));
    } else showToast(d.error || 'Failed', 'err');
    setInvSaving(false);
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
            const base = state.traits?.[t]?.base || 0;
            const bonus = state.traits?.[t]?.bonus || 0;
            const lvBonus = state.traits?.[t]?.levelBonus || 0;
            return (
              <div key={t} className="stat-box">
                <div className="stat-name">{TRAIT_LABELS[t]}</div>
                <div className="stat-val">{traitTotal(t)}</div>
                <div style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 4 }}>
                  Base {base}{bonus ? ` +${bonus}` : ''}{lvBonus ? ` +${lvBonus}Lv` : ''}
                </div>
                <div style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button className="btn btn-muted btn-xs" onClick={() => adjustTrait(t, 'bonus', -1)} disabled={bonus <= 0} title="Remove bonus pt">−B</button>
                  <button className="btn btn-cyan btn-xs" onClick={() => adjustTrait(t, 'bonus', 1)} title="Add bonus pt">+B</button>
                  <button className="btn btn-muted btn-xs" onClick={() => adjustTrait(t, 'levelBonus', -1)} disabled={lvBonus <= 0} title="Remove level pt">−L</button>
                  <button className="btn btn-gold btn-xs" onClick={() => adjustTrait(t, 'levelBonus', 1)} title="Add level pt">+L</button>
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

      {/* Exposure */}
      <div className="panel">
        <div className="panel-title admin">Exposure</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { key: 'followers', label: 'Followers', val: followersInput, set: setFollowersInput, save: saveFollowers },
            { key: 'viewers', label: 'Viewers', val: viewersInput, set: setViewersInput, save: saveViewers },
          ].map(({ key, label, val, set, save }) => (
            <div key={key}>
              <div className="field-label" style={{ marginBottom: 4 }}>{label} — current: <span style={{ color: 'var(--cyan)' }}>{state.exposure?.[key] || '0'}</span></div>
              <div className="row">
                <input className="fi" style={{ flex: 1 }} placeholder="e.g. 1.5B, 200.6T"
                  value={val} onChange={e => set(e.target.value)} onKeyDown={e => e.key === 'Enter' && save()} />
                <button className="btn btn-purple btn-sm" onClick={save}>Set</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Give Items from Library */}
      <div className="panel">
        <div className="panel-title admin">Give Items from Library</div>
        <div className="field-group" style={{ marginBottom: 8 }}>
          <label className="field-label">Quantity</label>
          <input className="fi" type="number" min="1" style={{ width: 80 }} value={giveQty} onChange={e => setGiveQty(+e.target.value)} />
        </div>
        <input className="fi" placeholder="Search items..." value={itemSearch} onChange={e => setItemSearch(e.target.value)} style={{ marginBottom: 6 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 200, overflowY: 'auto' }}>
          {itemLib.filter(it => it.name.toLowerCase().includes(itemSearch.toLowerCase())).map(it => (
            <div key={it._id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', border: '1px solid var(--border)', borderRadius: 3, background: 'rgba(0,0,0,.2)' }}>
              <span style={{ fontSize: 16 }}>{it.icon || '📦'}</span>
              <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{it.name}</span>
              <span style={{ fontSize: 9, color: 'var(--muted)' }}>{it.category}</span>
              <button className="btn btn-cyan btn-xs" onClick={() => giveItem(it)}>Give</button>
            </div>
          ))}
          {itemLib.length === 0 && <span style={{ color: 'var(--muted)', fontSize: 11 }}>No items in library.</span>}
        </div>
      </div>

      {/* Inventory Editor */}
      {invCats !== null && (
        <div className="panel">
          <div className="panel-title admin">
            Inventory Editor
            <button className="btn btn-purple btn-sm" onClick={saveInventory} disabled={invSaving}>
              {invSaving ? 'Saving…' : 'Save Inventory'}
            </button>
          </div>
          {invCats.map(cat => (
            <div key={cat.id} style={{ marginBottom: 12, border: '1px solid var(--border)', borderRadius: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(0,212,255,.04)', borderBottom: '1px solid var(--border)' }}>
                <span style={{ flex: 1, fontSize: 11, fontWeight: 700, color: 'var(--cyan)', letterSpacing: 1, textTransform: 'uppercase' }}>{cat.name}</span>
                <span style={{ fontSize: 10, color: 'var(--muted)' }}>{(cat.items || []).length} items</span>
                <button className="btn btn-cyan btn-xs" onClick={() => invAddItem(cat.id)}>+ Add</button>
              </div>
              <div style={{ padding: '6px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {(cat.items || []).map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 6px', border: '1px solid var(--border)', borderRadius: 3, background: 'rgba(0,0,0,.15)' }}>
                    <span style={{ fontSize: 16 }}>{item.icon || '📦'}</span>
                    <span style={{ flex: 1, fontSize: 12, fontWeight: 700 }}>{item.name}</span>
                    {item.tier && <span style={{ fontSize: 9, color: 'var(--gold)' }}>{item.tier}</span>}
                    {item.qty > 1 && <span style={{ fontSize: 10, color: 'var(--gold)' }}>×{item.qty}</span>}
                    {item.uses?.max != null && <span style={{ fontSize: 10, color: 'var(--cyan)' }}>{item.uses.current ?? 0}/{item.uses.max}</span>}
                    <select
                      className="fi"
                      style={{ fontSize: 9, padding: '2px 4px', width: 100 }}
                      value={String(cat.id)}
                      onChange={e => {
                        const toId = invCats.find(c => String(c.id) === e.target.value)?.id;
                        if (toId !== undefined && toId !== cat.id) invMoveItem(cat.id, toId, item.id);
                      }}
                    >
                      {invCats.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
                    </select>
                    <button className="btn btn-purple btn-xs" onClick={() => setInvItemModal({ item: JSON.parse(JSON.stringify(item)), catId: cat.id })}>Edit</button>
                    <button className="btn btn-danger btn-xs" onClick={() => invDeleteItem(cat.id, item.id)}>✕</button>
                  </div>
                ))}
                {(cat.items || []).length === 0 && <span style={{ color: 'var(--muted)', fontSize: 10, padding: '2px 0' }}>Empty</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Item Edit Modal */}
      {invItemModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setInvItemModal(null); }}>
          <div className="modal-box admin">
            <div className="modal-title admin">
              Edit Item
              <button className="modal-close" onClick={() => setInvItemModal(null)}>✕</button>
            </div>
            {[
              ['name', 'Name', 'text'], ['icon', 'Icon (emoji)', 'text'],
              ['qty', 'Quantity', 'number'], ['tier', 'Tier', 'text'],
              ['range', 'Range', 'text'], ['damage', 'Damage', 'text'],
              ['requirements', 'Requirements', 'text'],
            ].map(([k, lbl, type]) => (
              <div key={k} className="field-group" style={{ marginBottom: 6 }}>
                <label className="field-label">{lbl}</label>
                <input className="fi" type={type} value={invItemModal.item[k] || ''} onChange={e => setInvItemModal(m => ({ ...m, item: { ...m.item, [k]: type === 'number' ? +e.target.value : e.target.value } }))} />
              </div>
            ))}
            <div className="modal-grid2" style={{ marginBottom: 6 }}>
              <div className="field-group">
                <label className="field-label">Max Uses <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(empty = unlimited)</span></label>
                <input className="fi" type="number" min="1"
                  value={invItemModal.item.uses?.max ?? ''}
                  onChange={e => {
                    const raw = e.target.value;
                    const max = raw === '' ? null : Math.max(1, +raw);
                    const curr = max == null ? null : Math.min(invItemModal.item.uses?.current ?? max, max);
                    setInvItemModal(m => ({ ...m, item: { ...m.item, uses: { max, current: curr } } }));
                  }} />
              </div>
              <div className="field-group">
                <label className="field-label">Current Uses</label>
                <input className="fi" type="number" min="0"
                  value={invItemModal.item.uses?.current ?? ''}
                  disabled={invItemModal.item.uses?.max == null}
                  onChange={e => {
                    const raw = e.target.value;
                    const max = invItemModal.item.uses?.max ?? null;
                    const curr = raw === '' ? null : Math.max(0, Math.min(max ?? +raw, +raw));
                    setInvItemModal(m => ({ ...m, item: { ...m.item, uses: { max, current: curr } } }));
                  }} />
              </div>
            </div>
            <div className="field-group" style={{ marginBottom: 6 }}>
              <label className="field-label">Special Effects</label>
              <textarea className="fi" value={invItemModal.item.specialEffects || ''} onChange={e => setInvItemModal(m => ({ ...m, item: { ...m.item, specialEffects: e.target.value } }))} />
            </div>
            <div className="field-group" style={{ marginBottom: 8 }}>
              <label className="field-label">Description</label>
              <textarea className="fi" value={invItemModal.item.description || ''} onChange={e => setInvItemModal(m => ({ ...m, item: { ...m.item, description: e.target.value } }))} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-muted btn-sm" onClick={() => setInvItemModal(null)}>Cancel</button>
              <button className="btn btn-purple btn-sm" onClick={() => { invUpdateItem(invItemModal.catId, invItemModal.item); setInvItemModal(null); }}>Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
