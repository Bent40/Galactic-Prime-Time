export default function TrackerBar({ tracker }) {
  if (!tracker) {
    return (
      <div className="tracker-bar">
        <span className="trk-empty">MOMENT TRACKER — NO DATA</span>
      </div>
    );
  }

  const slots = {};
  (tracker.entries || []).forEach(e => {
    if (!slots[e.slot]) slots[e.slot] = [];
    slots[e.slot].push(e);
  });
  const slotNums = Array.from({ length: tracker.totalSlots || 10 }, (_, i) => i + 1);

  return (
    <div className="tracker-bar">
      <div className="trk-pill clock">
        <span className="trk-pill-label">Clock</span>
        <span className="trk-pill-val">{tracker.clock || '00:00'}</span>
      </div>
      <div className="trk-pill moment">
        <span className="trk-pill-label">Moment</span>
        <span className="trk-pill-val">{tracker.moment ?? '—'}</span>
      </div>
      <div className="trk-divider" />
      <div className="trk-rail">
        {slotNums.map(n => {
          const isCur = n === tracker.moment;
          return (
            <div key={n} className={`trk-slot${isCur ? ' cur' : ''}`}>
              <span className="trk-slot-num">{n}</span>
              {(slots[n] || []).map(e => (
                <div
                  key={e.id}
                  className="trk-chip"
                  style={{ borderColor: e.color || '#3a4560', color: e.color || '#3a4560', background: `${e.color || '#3a4560'}18` }}
                >
                  {e.label}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
