import { dmgClass, effectiveMaxHp, capBonus } from '../../constants.js';
import TrackerBar from '../shared/TrackerBar.jsx';

export default function CombatModeTab({ state, update, tracker }) {
  const hpBonus = capBonus(state, 'physique');

  function setHpDirect(bpId, delta) {
    update(s => ({ ...s, bodyParts: s.bodyParts.map(b => {
      if (b.id !== bpId) return b;
      return { ...b, currentHp: Math.max(0, Math.min(effectiveMaxHp(b, s), b.currentHp + delta)) };
    }) }));
  }

  return (
    <>
      <TrackerBar tracker={tracker} />
      <div className="panel">
        <div className="panel-title">Quick Combat — Body Status</div>
        <div className="combat-grid">
          {state.bodyParts.map(bp => {
            const effMax = effectiveMaxHp(bp, state);
            const cls = dmgClass(bp.currentHp, effMax);
            return (
              <div key={bp.id} className={`combat-bp${cls ? ' ' + cls : ''}`}>
                <div className="combat-bp-name">{bp.name}{bp.lethal ? ' ☠' : ''}</div>
                <div className="combat-hp-row">
                  <div className="combat-adj-btns">
                    <button className="btn btn-danger btn-icon btn-sm" onClick={() => setHpDirect(bp.id, -1)}>−</button>
                    <button className="btn btn-success btn-icon btn-sm" onClick={() => setHpDirect(bp.id, 1)}>+</button>
                  </div>
                  <div className="combat-hp-big">{bp.currentHp}</div>
                  <div className="combat-hp-sep">/</div>
                  <div className="combat-hp-max" title={hpBonus > 0 ? `Base ${bp.baseHp ?? bp.maxHp} + ${hpBonus} Physique` : undefined}>{effMax}</div>
                </div>
                {(bp.conditions || []).length > 0 && (
                  <div className="cond-list">
                    {bp.conditions.map(c => (
                      <span key={c.id} className={`cond-badge cond-t${c.tier}`}>{c.text}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
