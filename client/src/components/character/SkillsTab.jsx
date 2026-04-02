import { useState, useEffect } from 'react';
import { apiFetch } from '../../api.js';
import { uid, ALL_TRAITS, TRAIT_LABELS } from '../../constants.js';

export default function SkillsTab({ state, update, token }) {
  const [lib, setLib] = useState([]);
  const [search, setSearch] = useState('');
  const [showLib, setShowLib] = useState(false);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    apiFetch('/api/character/skills', {}, token).then(d => { if (Array.isArray(d)) setLib(d); });
  }, [token]);

  function toggleExpand(id) { setExpanded(e => ({ ...e, [id]: !e[id] })); }

  function addSkillFromLib(tpl) {
    const sk = {
      id: uid(), name: tpl.name, level: 1,
      capacity: tpl.capacity || 'Active', momentCost: tpl.momentCost || '',
      stats: tpl.stats || [], passive: false, range: tpl.range || '',
      target: tpl.target || '', requirements: tpl.requirements || '',
      effect: tpl.effect || '', description: tpl.description || '',
      unlockedByAchievement: '', levelEffects: tpl.levelEffects || {},
    };
    update(s => ({ ...s, skills: [...s.skills, sk] }));
    setShowLib(false);
  }

  function addBlankSkill() {
    const name = prompt('Skill name:'); if (!name) return;
    update(s => ({ ...s, skills: [...s.skills, {
      id: uid(), name, level: 1, capacity: 'Active', momentCost: '', stats: [],
      passive: false, range: '', target: '', requirements: '', effect: '', description: '',
      unlockedByAchievement: '', levelEffects: {},
    }] }));
  }

  function rmSkill(id) { update(s => ({ ...s, skills: s.skills.filter(sk => sk.id !== id) })); }
  function patchSkill(id, k, v) { update(s => ({ ...s, skills: s.skills.map(sk => sk.id === id ? { ...sk, [k]: v } : sk) })); }
  function setLevel(id, lv) { update(s => ({ ...s, skills: s.skills.map(sk => sk.id === id ? { ...sk, level: lv } : sk) })); }
  function toggleStat(id, stat) {
    update(s => ({ ...s, skills: s.skills.map(sk => {
      if (sk.id !== id) return sk;
      const stats = sk.stats || [];
      return { ...sk, stats: stats.includes(stat) ? stats.filter(x => x !== stat) : [...stats, stat] };
    }) }));
  }
  function patchLevelEffect(id, level, text) {
    update(s => ({ ...s, skills: s.skills.map(sk =>
      sk.id === id ? { ...sk, levelEffects: { ...(sk.levelEffects || {}), [level]: text } } : sk
    ) }));
  }

  function traitTotal(t) { return (state.traits[t] || 0) + (state.traitBonus[t] || 0) + (state.traitLevelBonus[t] || 0); }
  function skillTotal(sk) {
    return (sk.stats || []).reduce((sum, s) => sum + (traitTotal(s.toLowerCase()) || 0), 0);
  }

  const filtered = lib.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="panel">
      <div className="panel-title">
        Skills ({state.skills.length})
        <div className="row gap-sm">
          <button className="btn btn-cyan btn-sm" onClick={() => setShowLib(v => !v)}>Library</button>
          <button className="btn btn-muted btn-sm" onClick={addBlankSkill}>+ Manual</button>
        </div>
      </div>

      {showLib && (
        <div style={{ marginBottom: 12, padding: 10, background: 'rgba(0,0,0,.3)', borderRadius: 4, border: '1px solid var(--border)' }}>
          <div className="panel-title" style={{ marginBottom: 8 }}>Skill Library</div>
          <input className="fi" placeholder="Search skills..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 8 }} />
          <div className="skill-lib-list">
            {filtered.map(t => (
              <div key={t._id} className="lib-row" onClick={() => addSkillFromLib(t)}>
                <span className="lib-row-name">{t.name}</span>
                <span className="lib-row-meta">{t.capacity || 'Active'} · {t.momentCost || '—'}</span>
              </div>
            ))}
            {filtered.length === 0 && <span style={{ color: 'var(--muted)', fontSize: 11 }}>No matches</span>}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {state.skills.map(sk => {
          const isExp = expanded[sk.id];
          const total = skillTotal(sk);
          return (
            <div key={sk.id} className="skill-card">
              <div className="skill-header">
                <input className="skill-name-in" value={sk.name} onChange={e => patchSkill(sk.id, 'name', e.target.value)} />
                <div className="pip-row">
                  {[1, 2, 3, 4, 5].map(n => (
                    <div key={n} className={`pip${sk.level >= n ? ' on' : ''}`} onClick={() => setLevel(sk.id, n)} />
                  ))}
                </div>
                <span className="skill-level-label">Lv {sk.level}</span>
                <button className="btn btn-muted btn-xs" onClick={() => toggleExpand(sk.id)}>{isExp ? '▲' : '▼'}</button>
                <button className="btn btn-danger btn-xs" onClick={() => rmSkill(sk.id)}>✕</button>
              </div>
              <div className="skill-meta-row">
                <span
                  className={`skill-badge${sk.passive ? ' passive' : ''}`}
                  onClick={() => patchSkill(sk.id, 'passive', !sk.passive)}
                >
                  {sk.passive ? 'Passive' : 'Active'}
                </span>
                {ALL_TRAITS.map(t => (
                  <span
                    key={t}
                    className={`skill-badge stat${(sk.stats || []).includes(t) ? ' on' : ''}`}
                    onClick={() => toggleStat(sk.id, t)}
                  >
                    {TRAIT_LABELS[t]}
                  </span>
                ))}
                {(sk.stats || []).length > 0 && <span className="skill-total">{total}</span>}
              </div>
              {isExp && (
                <div className="skill-extra">
                  <div className="skill-extra-row">
                    <div className="field-group" style={{ flex: 1 }}>
                      <label className="field-label">Moment Cost</label>
                      <input className="skill-fi" style={{ width: 80 }} value={sk.momentCost || ''} onChange={e => patchSkill(sk.id, 'momentCost', e.target.value)} />
                    </div>
                    <div className="field-group" style={{ flex: 1 }}>
                      <label className="field-label">Range</label>
                      <input className="skill-fi" style={{ width: 100 }} value={sk.range || ''} onChange={e => patchSkill(sk.id, 'range', e.target.value)} />
                    </div>
                    <div className="field-group" style={{ flex: 1 }}>
                      <label className="field-label">Target</label>
                      <input className="skill-fi" style={{ width: 100 }} value={sk.target || ''} onChange={e => patchSkill(sk.id, 'target', e.target.value)} />
                    </div>
                  </div>
                  <div className="field-group">
                    <label className="field-label">Requirements</label>
                    <input className="skill-fi" style={{ width: '100%' }} value={sk.requirements || ''} onChange={e => patchSkill(sk.id, 'requirements', e.target.value)} />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Effect</label>
                    <textarea className="skill-fi" style={{ width: '100%', minHeight: 44, resize: 'vertical' }} value={sk.effect || ''} onChange={e => patchSkill(sk.id, 'effect', e.target.value)} />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Description</label>
                    <textarea className="skill-fi" style={{ width: '100%', minHeight: 44, resize: 'vertical' }} value={sk.description || ''} onChange={e => patchSkill(sk.id, 'description', e.target.value)} />
                  </div>
                  <div className="level-effects">
                    <div className="field-label" style={{ marginBottom: 4 }}>Level Effects</div>
                    {[1, 2, 3, 4, 5].map(lv => (
                      <div key={lv} className="level-effect-row">
                        <div className="level-effect-label">Level {lv}</div>
                        <textarea
                          className="level-effect-ta"
                          readOnly={sk.level < lv}
                          value={(sk.levelEffects || {})[lv] || ''}
                          onChange={e => patchLevelEffect(sk.id, lv, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {state.skills.length === 0 && <span style={{ color: 'var(--muted)', fontSize: 11 }}>No skills yet — add from library or manually.</span>}
      </div>
    </div>
  );
}
