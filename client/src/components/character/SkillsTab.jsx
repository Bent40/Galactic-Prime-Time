import { useEffect, useState } from 'react';
import { apiFetch } from '../../api.js';
import { ALL_TRAITS, TRAIT_LABELS, traitTotal as traitTotalOf } from '../../constants.js';

export default function SkillsTab({ state, update, token }) {
  const [lib, setLib] = useState([]);

  useEffect(() => {
    apiFetch('/api/character/skills', {}, token).then(d => { if (Array.isArray(d)) setLib(d); });
  }, [token]);

  function traitTotal(t) { return traitTotalOf(state, t); }

  const skillPointsSpent = state.skillPointsSpent || {};

  function availableFor(t) {
    return Math.max(0, traitTotal(t) - 1 - (skillPointsSpent[t] || 0));
  }

  function applyUpdate(newState) {
    update(newState);
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
      // Every listed stat must have at least 1 available level point
      if (!stats.every(t => availableFor(t) > 0)) return;
      const newSpent = { ...(state.skillPointsSpent || {}) };
      for (const t of stats) newSpent[t] = (newSpent[t] || 0) + 1;
      newState = {
        ...state,
        skills: state.skills.map(x => x.id === sk.id ? {
          ...x,
          level: (x.level || 0) + 1,
          // one spend RECORD per level-up (an array), so a later refund returns
          // exactly what this level cost even if the template's stats change
          traitCosts: [...(x.traitCosts || []), stats],
        } : x),
        skillPointsSpent: newSpent,
      };
    }
    applyUpdate(newState);
  }

  function levelDown(sk) {
    const level = sk.level || 0;
    if (level <= 0) return;
    const stats = (sk.stats || []).map(s => s.toLowerCase()).filter(s => ALL_TRAITS.includes(s));
    const traitCosts = [...(sk.traitCosts || [])];
    const refunded = [];
    const last = traitCosts[traitCosts.length - 1];
    if (Array.isArray(last)) {
      // Spend record: refund exactly what this level cost when it was bought
      traitCosts.pop();
      refunded.push(...last);
    } else if (typeof last === 'string' && stats.length > 0) {
      // Legacy flat entries (pre-record data): best effort — one per listed stat
      while (refunded.length < stats.length && typeof traitCosts[traitCosts.length - 1] === 'string') {
        refunded.push(traitCosts.pop());
      }
    }
    // A level with no spend history (admin-set, free skill) refunds nothing.
    const newSpent = { ...(state.skillPointsSpent || {}) };
    for (const t of refunded) {
      if (ALL_TRAITS.includes(t)) newSpent[t] = Math.max(0, (newSpent[t] || 0) - 1);
    }
    applyUpdate({
      ...state,
      skills: state.skills.map(x => x.id === sk.id ? { ...x, level: level - 1, traitCosts } : x),
      skillPointsSpent: newSpent,
    });
  }

  const enriched = state.skills.map(sk => {
    const tpl = sk.templateId ? lib.find(t => String(t._id) === String(sk.templateId)) : null;
    if (!tpl) return sk;
    return {
      ...sk,
      name: tpl.name,
      stats: tpl.stats,
      effect: tpl.effect,
      description: tpl.description,
      requirements: tpl.requirements,
      range: tpl.range,
      target: tpl.target,
      momentCost: tpl.momentCost,
      passive: tpl.passive,
      keywords: tpl.keywords,
      levelEffects: tpl.levelEffects,
    };
  });

  return (
    <div className="panel" style={{ flex: 1 }}>
      <div className="panel-title">
        Skills ({state.skills.length})
        {/* Available trait points summary */}
        <div style={{ display: 'flex', gap: 6, marginLeft: 'auto', alignItems: 'center' }}>
          {ALL_TRAITS.map(t => {
            const avail = availableFor(t);
            const spent = avail === 0;
            return (
              <span key={t} style={{
                fontSize: 11, fontWeight: 700, letterSpacing: 1, padding: '3px 8px',
                borderRadius: 4,
                border: `1px solid ${spent ? 'var(--border)' : 'var(--cyan)'}`,
                background: spent ? 'transparent' : 'rgba(0,212,255,0.12)',
                color: spent ? 'var(--muted)' : 'var(--cyan)',
                opacity: spent ? 0.6 : 1,
              }} title={spent ? `${TRAIT_LABELS[t]} skill points fully spent` : `${avail} ${TRAIT_LABELS[t]} skill point${avail === 1 ? '' : 's'} available`}>
                {TRAIT_LABELS[t].slice(0, 3)} {avail}
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
          const canLevelUp = !atMax && (stats.length === 0 || stats.every(t => availableFor(t) > 0));
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
                    const isNext = n === level + 1;
                    const isTop = n === level && level > 0;
                    const downLabel = stats.length > 0
                      ? `Level down (refunds: ${stats.map(t => `1 ${TRAIT_LABELS[t]}`).join(' + ')})`
                      : 'Level down (free)';
                    return (
                      <div
                        key={n}
                        className={`pip${isLit ? ' on' : ''}`}
                        style={{ cursor: (isNext && canLevelUp) || isTop ? 'pointer' : 'default' }}
                        title={isNext && canLevelUp
                          ? `Level up${stats.length > 0 ? ` (costs: ${stats.map(t => `1 ${TRAIT_LABELS[t]}`).join(' + ')})` : ' (free)'}`
                          : isNext && !canLevelUp && !atMax
                            ? `Need 1 point in each: ${stats.map(t => TRAIT_LABELS[t]).join(', ')}`
                            : isTop ? downLabel : undefined}
                        onClick={() => {
                          if (isNext && canLevelUp) levelUp(sk);
                          else if (isTop) levelDown(sk);
                        }}
                      />
                    );
                  })}
                </div>
                <span className="skill-level-label" title={level === 0 ? 'Revealed but untrained — the skill does nothing until level 1' : undefined}>
                  Lv {level}/{cap}{level === 0 ? ' · Untrained' : ''}
                </span>
              </div>

              {/* Upgrade hint */}
              {stats.length > 0 && !atMax && (
                <div style={{
                  fontSize: 9, marginBottom: 4, letterSpacing: 1,
                  color: canLevelUp ? 'var(--cyan)' : 'var(--muted)'
                }}>
                  {canLevelUp
                    ? `▲ Next level costs: ${stats.map(t => `1 ${TRAIT_LABELS[t]}`).join(' + ')}`
                    : `✕ Need 1 point in each: ${stats.map(t => TRAIT_LABELS[t]).join(', ')}`}
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
                {(sk.keywords || []).map(k => (
                  <span key={k} className="skill-badge" style={{ color: 'var(--purple)', borderColor: 'var(--purple)' }} title="Gemstone compatibility: skills sharing a narrow keyword can merge">◈ {k}</span>
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
