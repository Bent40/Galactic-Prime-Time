import { dmgClass } from '../../constants.js';
import TrackerBar from '../shared/TrackerBar.jsx';

export default function CombatModeTab({ state, update, tracker }) {
  function setHpDirect(bpId, delta) {
    update(s => ({ ...s, bodyParts: s.bodyParts.map(b => {
      if (b.id !== bpId) return b;
      return { ...b, currentHp: Math.max(0, Math.min(b.maxHp, b.currentHp + delta)) };
    }) }));
  }

  return (
    <>
      <TrackerBar tracker={tracker} />
      <div className="panel">
        <div className="panel-title">Quick Combat — Body Status</div>
        <div className="combat-grid">
          {state.bodyParts.map(bp => {
            const cls = dmgClass(bp.currentHp, bp.maxHp);
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
                  <div className="combat-hp-max">{bp.maxHp}</div>
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
