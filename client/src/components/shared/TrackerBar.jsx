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
    const slot = e.moment ?? e.slot;
    if (slot == null) return;
    if (!slots[slot]) slots[slot] = [];
    slots[slot].push(e);
  });
  const slotNums = Array.from({ length: tracker.totalSlots || 10 }, (_, i) => i + 1);
  const cur = tracker.currentMoment ?? tracker.moment;

  return (
    <div className="tracker-bar">
      <div className="trk-pill moment">
        <span className="trk-pill-label">Moment</span>
        <span className="trk-pill-val">{cur ?? '—'}</span>
      </div>
      <div className="trk-divider" />
      <div className="trk-rail">
        {slotNums.map(n => {
          const isCur = n === cur;
          return (
            <div key={n} className={`trk-slot${isCur ? ' cur' : ''}`}>
              <span className="trk-slot-num">{n}</span>
              {(slots[n] || []).map(e => (
                <div
                  key={e.entryId || e.id}
                  className="trk-chip"
                  style={{ borderColor: e.color || '#3a4560', color: e.color || '#3a4560', background: `${e.color || '#3a4560'}18` }}
                >
                  {e.name || e.label}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
