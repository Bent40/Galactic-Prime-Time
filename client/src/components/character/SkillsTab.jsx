import { useEffect, useState } from 'react';
import { apiFetch } from '../../api.js';
import { ALL_TRAITS, TRAIT_LABELS } from '../../constants.js';

export default function SkillsTab({ state, token }) {
  const [lib, setLib] = useState([]);

  useEffect(() => {
    apiFetch('/api/character/skills', {}, token).then(d => { if (Array.isArray(d)) setLib(d); });
  }, [token]);

  function traitTotal(t) { return (state.traits[t] || 0) + (state.traitBonus[t] || 0) + (state.traitLevelBonus[t] || 0); }
  function skillTotal(sk) {
    return (sk.stats || []).reduce((sum, s) => sum + (traitTotal(s.toLowerCase()) || 0), 0);
  }

  // Enrich skills from library for display
  const enriched = state.skills.map(sk => {
    const tpl = lib.find(t => t.name === sk.name);
    return { ...sk, _tpl: tpl };
  });

  return (
    <div className="panel" style={{ flex: 1 }}>
      <div className="panel-title">Skills ({state.skills.length})</div>
      {state.skills.length === 0 && (
        <div style={{ color: 'var(--muted)', fontSize: 11, padding: '8px 0' }}>
          No skills yet. Skills are assigned by the admin.
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
        {enriched.map(sk => {
          const total = skillTotal(sk);
          const levelEffects = sk.levelEffects || {};
          return (
            <div key={sk.id} className="skill-card-ro">
              {/* Header */}
              <div className="skill-ro-header">
                <span className="skill-ro-name">{sk.name}</span>
                <div className="pip-row" style={{ pointerEvents: 'none' }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <div key={n} className={`pip${sk.level >= n ? ' on' : ''}`} />
                  ))}
                </div>
                <span className="skill-level-label">Lv {sk.level}</span>
              </div>

              {/* Badges row */}
              <div className="skill-meta-row">
                <span className={`skill-badge${sk.passive ? ' passive' : ''}`}>
                  {sk.passive ? 'Passive' : 'Active'}
                </span>
                {(sk.stats || []).map(t => (
                  <span key={t} className="skill-badge stat on">{TRAIT_LABELS[t] || t}</span>
                ))}
                {(sk.stats || []).length > 0 && <span className="skill-total">{total}</span>}
                {sk.momentCost && <span className="skill-badge">{sk.momentCost}</span>}
                {sk.range && <span className="skill-badge">{sk.range}</span>}
                {sk.target && <span className="skill-badge">{sk.target}</span>}
              </div>

              {/* Requirements */}
              {sk.requirements && (
                <div className="skill-ro-field">
                  <span className="skill-ro-lbl">Req:</span> {sk.requirements}
                </div>
              )}

              {/* Effect */}
              {sk.effect && (
                <div className="skill-ro-effect">{sk.effect}</div>
              )}

              {/* Description */}
              {sk.description && (
                <div className="skill-ro-desc">{sk.description}</div>
              )}

              {/* Level effects — show up to current level */}
              {[1, 2, 3, 4, 5].some(lv => levelEffects[lv] && lv <= sk.level) && (
                <div className="skill-ro-levels">
                  {[1, 2, 3, 4, 5].map(lv => levelEffects[lv] && lv <= sk.level ? (
                    <div key={lv} className="skill-ro-lvl-row">
                      <span className={`skill-ro-lvl-badge${lv === sk.level ? ' cur' : ''}`}>Lv{lv}</span>
                      <span className="skill-ro-lvl-text">{levelEffects[lv]}</span>
                    </div>
                  ) : null)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
