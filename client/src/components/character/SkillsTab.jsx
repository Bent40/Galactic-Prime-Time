import { useEffect, useState } from 'react';
import { apiFetch } from '../../api.js';
import { ALL_TRAITS, TRAIT_LABELS } from '../../constants.js';

export default function SkillsTab({ state, update, token }) {
  const [lib, setLib] = useState([]);

  useEffect(() => {
    apiFetch('/api/character/skills', {}, token).then(d => { if (Array.isArray(d)) setLib(d); });
  }, [token]);

  function traitTotal(t) {
    return (state.traits[t] || 0) + (state.traitBonus[t] || 0) + (state.traitLevelBonus[t] || 0);
  }

  const traitLevelBonus = state.traitLevelBonus || {};
  const skillPointsSpent = state.skillPointsSpent || {};

  function availableFor(t) {
    return Math.max(0, (traitLevelBonus[t] || 0) - (skillPointsSpent[t] || 0));
  }

  // Returns the best trait to spend for this skill, or null if none available
  function findSpendTrait(sk) {
    const stats = (sk.stats || []).map(s => s.toLowerCase()).filter(s => ALL_TRAITS.includes(s));
    let best = null, bestAmt = -1;
    for (const t of stats) {
      const amt = availableFor(t);
      if (amt > bestAmt) { bestAmt = amt; best = t; }
    }
    return bestAmt > 0 ? best : null;
  }

  function applyUpdate(newState) {
    update(newState);
    // Also save immediately — don't rely solely on the debounce
    apiFetch('/api/character', { method: 'POST', body: JSON.stringify({ state: newState }) }, token);
  }

  function raiseCap(sk) {
    const cap = sk.capacity || 5;
    if (cap >= 10) return;
    const patronTokens = state.tokens?.patronTokens || 0;
    if (patronTokens <= 0) return;
    const newState = {
      ...state,
      skills: state.skills.map(x => x.id === sk.id ? { ...x, capacity: (x.capacity || 5) + 1 } : x),
      tokens: { ...state.tokens, patronTokens: Math.max(0, (state.tokens?.patronTokens || 0) - 1) },
    };
    applyUpdate(newState);
  }

  function levelUp(sk) {
    const cap = sk.capacity || 5;
    if ((sk.level || 0) >= cap) return;

    const stats = (sk.stats || []).map(s => s.toLowerCase()).filter(s => ALL_TRAITS.includes(s));

    let newState;
    if (stats.length === 0) {
      newState = {
        ...state,
        skills: state.skills.map(x => x.id === sk.id ? { ...x, level: (x.level || 0) + 1 } : x),
      };
    } else {
      const spendTrait = findSpendTrait(sk);
      if (!spendTrait) return;
      newState = {
        ...state,
        skills: state.skills.map(x => x.id === sk.id ? {
          ...x,
          level: (x.level || 0) + 1,
          traitCosts: [...(x.traitCosts || []), spendTrait],
        } : x),
        skillPointsSpent: {
          ...(state.skillPointsSpent || {}),
          [spendTrait]: ((state.skillPointsSpent || {})[spendTrait] || 0) + 1,
        },
      };
    }
    applyUpdate(newState);
  }

  const enriched = state.skills.map(sk => {
    const tpl = lib.find(t => t.name === sk.name);
    return { ...sk, _tpl: tpl };
  });

  return (
    <div className="panel" style={{ flex: 1 }}>
      <div className="panel-title">
        Skills ({state.skills.length})
        {/* Available trait points summary */}
        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
          {ALL_TRAITS.map(t => {
            const avail = availableFor(t);
            return (
              <span key={t} style={{
                fontSize: 9, fontWeight: 700, letterSpacing: 1, padding: '2px 6px',
                borderRadius: 3,
                border: `1px solid ${avail > 0 ? 'var(--cyan)' : 'var(--border)'}`,
                color: avail > 0 ? 'var(--cyan)' : 'var(--muted)',
              }}>
                {TRAIT_LABELS[t][0]} {avail}
              </span>
            );
          })}
        </div>
      </div>

      {state.skills.length === 0 && (
        <div style={{ color: 'var(--muted)', fontSize: 11, padding: '8px 0' }}>
          No skills yet. Skills are assigned by the admin.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
        {enriched.map(sk => {
          const cap = sk.capacity || 5;
          const level = sk.level || 0;
          const levelEffects = sk.levelEffects || {};
          const stats = (sk.stats || []).map(s => s.toLowerCase()).filter(s => ALL_TRAITS.includes(s));
          const skillTotal = stats.reduce((sum, t) => sum + (traitTotal(t) || 0), 0);
          const atMax = level >= cap;
          const spendTrait = !atMax ? findSpendTrait(sk) : null;
          const canLevelUp = !atMax && (stats.length === 0 || spendTrait !== null);
          const patronTokens = state.tokens?.patronTokens || 0;
          const canRaiseCap = cap < 10 && patronTokens > 0;

          return (
            <div key={sk.id} className="skill-card-ro">
              {/* Header */}
              <div className="skill-ro-header">
                <span className="skill-ro-name">{sk.name}</span>
                <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  {Array.from({ length: cap }, (_, i) => i + 1).map(n => {
                    const isLit = level >= n;
                    const isNext = n === level + 1; // only the very next pip is clickable
                    return (
                      <div
                        key={n}
                        className={`pip${isLit ? ' on' : ''}`}
                        style={{ cursor: isNext && canLevelUp ? 'pointer' : 'default' }}
                        title={isNext && canLevelUp
                          ? `Level up (costs 1 ${spendTrait ? TRAIT_LABELS[spendTrait] : 'free'} point)`
                          : isNext && !canLevelUp && !atMax
                            ? `Need a level point in: ${stats.map(t => TRAIT_LABELS[t]).join(' or ')}`
                            : undefined}
                        onClick={() => isNext && canLevelUp && levelUp(sk)}
                      />
                    );
                  })}
                </div>
                <span className="skill-level-label">Lv {level}/{cap}</span>
              </div>

              {/* Upgrade hint */}
              {stats.length > 0 && !atMax && (
                <div style={{ fontSize: 9, marginBottom: 4, letterSpacing: 1,
                  color: canLevelUp ? 'var(--cyan)' : 'var(--muted)' }}>
                  {canLevelUp
                    ? `▲ Next level costs 1 ${TRAIT_LABELS[spendTrait]} level point`
                    : `✕ Need a level point in ${stats.map(t => TRAIT_LABELS[t]).join(' or ')}`}
                </div>
              )}
              {atMax && (
                <div style={{ fontSize: 9, color: 'var(--gold)', marginBottom: 4, letterSpacing: 1 }}>
                  ★ Max level
                </div>
              )}

              {/* Raise Cap */}
              {cap < 10 && (
                <button
                  className={`btn btn-xs ${canRaiseCap ? 'btn-gold' : 'btn-muted'}`}
                  style={{ marginBottom: 6, fontSize: 9 }}
                  disabled={!canRaiseCap}
                  title={canRaiseCap ? `Raise cap to ${cap + 1} (costs 1 Patron Token)` : patronTokens <= 0 ? 'No Patron Tokens' : `Cap is already ${cap}`}
                  onClick={() => raiseCap(sk)}
                >
                  ▲ Raise Cap ({cap}/10) — 1 Patron Token
                </button>
              )}

              {/* Badges */}
              <div className="skill-meta-row">
                <span className={`skill-badge${sk.passive ? ' passive' : ''}`}>
                  {sk.passive ? 'Passive' : 'Active'}
                </span>
                {(sk.stats || []).map(t => (
                  <span key={t} className="skill-badge stat on">{TRAIT_LABELS[t.toLowerCase()] || t}</span>
                ))}
                {stats.length > 0 && <span className="skill-total">{skillTotal}</span>}
                {sk.momentCost && <span className="skill-badge">{sk.momentCost}</span>}
                {sk.range && <span className="skill-badge">{sk.range}</span>}
                {sk.target && <span className="skill-badge">{sk.target}</span>}
              </div>

              {sk.requirements && (
                <div className="skill-ro-field">
                  <span className="skill-ro-lbl">Req:</span> {sk.requirements}
                </div>
              )}
              {sk.effect && <div className="skill-ro-effect">{sk.effect}</div>}
              {sk.description && <div className="skill-ro-desc">{sk.description}</div>}

              {/* Level effects: unlocked up to current level + next locked preview */}
              {(() => {
                const nextLv = level + 1;
                const hasUnlocked = Array.from({ length: cap }, (_, i) => i + 1).some(lv => levelEffects[lv] && lv <= level);
                const hasNext = nextLv <= cap && levelEffects[nextLv];
                if (!hasUnlocked && !hasNext) return null;
                return (
                  <div className="skill-ro-levels">
                    {Array.from({ length: cap }, (_, i) => i + 1).map(lv => {
                      if (!levelEffects[lv]) return null;
                      if (lv <= level) {
                        return (
                          <div key={lv} className="skill-ro-lvl-row">
                            <span className={`skill-ro-lvl-badge${lv === level ? ' cur' : ''}`}>Lv{lv}</span>
                            <span className="skill-ro-lvl-text">{levelEffects[lv]}</span>
                          </div>
                        );
                      }
                      if (lv === nextLv) {
                        return (
                          <div key={lv} className="skill-ro-lvl-row" style={{ opacity: 0.45 }}>
                            <span className="skill-ro-lvl-badge" style={{ borderColor: 'var(--muted)', color: 'var(--muted)' }}>Lv{lv} 🔒</span>
                            <span className="skill-ro-lvl-text" style={{ color: 'var(--muted)', fontStyle: 'italic' }}>{levelEffects[lv]}</span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
