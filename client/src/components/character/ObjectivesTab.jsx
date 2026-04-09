const SECTIONS = ['main', 'directives', 'goals'];
const LABELS = { main: 'Main Objectives', directives: 'Directives', goals: 'Goals' };
const STATUSES = ['active', 'complete', 'failed'];

export default function ObjectivesTab({ state, update }) {
  function cycleStatus(section, id) {
    update(s => ({ ...s, objectives: { ...s.objectives, [section]: (s.objectives?.[section] || []).map(o => {
      if (o.id !== id) return o;
      const i = STATUSES.indexOf(o.status || 'active');
      return { ...o, status: STATUSES[(i + 1) % STATUSES.length] };
    }) } }));
  }

  return (
    <div className="obj-cols">
      {SECTIONS.map(sec => (
        <div key={sec}>
          <div className="obj-section-hdr">{LABELS[sec]}</div>
          {(state.objectives?.[sec] || []).map(obj => {
            const stClass = obj.status === 'complete' ? 'complete' : obj.status === 'failed' ? 'failed' : '';
            return (
              <div key={obj.id} className={`obj-card${stClass ? ' ' + stClass : ''}`}>
                <div className="obj-header">
                  <button className={`status-badge st-${obj.status || 'active'}`} onClick={() => cycleStatus(sec, obj.id)}>
                    {(obj.status || 'active').toUpperCase()}
                  </button>
                  <span className="obj-title-ro">{obj.title}</span>
                </div>
                {obj.description && <div className="obj-desc-ro">{obj.description}</div>}
                {(obj.subtasks || []).length > 0 && (
                  <ul className="subtask-list">
                    {obj.subtasks.map(st => (
                      <li key={st.id} className="subtask-item">
                        <input type="checkbox" className="subtask-cb" checked={!!st.done} readOnly />
                        <span className="subtask-text-ro">{st.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {obj.reward && (
                  <div className="reward-row">
                    <span className="reward-lbl">Reward:</span>
                    <span className="reward-ro">{obj.reward}</span>
                  </div>
                )}
              </div>
            );
          })}
          {(state.objectives?.[sec] || []).length === 0 && (
            <div style={{ color: 'var(--muted)', fontSize: 10, padding: '8px 0' }}>No objectives.</div>
          )}
        </div>
      ))}
    </div>
  );
}
