import { uid } from '../../constants.js';

const SECTIONS = ['main', 'directives', 'goals'];
const LABELS = { main: 'Main Objectives', directives: 'Directives', goals: 'Goals' };
const STATUSES = ['active', 'complete', 'failed'];

export default function ObjectivesTab({ state, update }) {
  function addObj(section) {
    update(s => ({ ...s, objectives: { ...s.objectives, [section]: [...(s.objectives?.[section] || []),
      { id: uid(), title: '', description: '', status: 'active', reward: '', subtasks: [] },
    ] } }));
  }
  function rmObj(section, id) {
    update(s => ({ ...s, objectives: { ...s.objectives, [section]: (s.objectives?.[section] || []).filter(o => o.id !== id) } }));
  }
  function patchObj(section, id, k, v) {
    update(s => ({ ...s, objectives: { ...s.objectives, [section]: (s.objectives?.[section] || []).map(o => o.id === id ? { ...o, [k]: v } : o) } }));
  }
  function cycleStatus(section, id) {
    update(s => ({ ...s, objectives: { ...s.objectives, [section]: (s.objectives?.[section] || []).map(o => {
      if (o.id !== id) return o;
      const i = STATUSES.indexOf(o.status || 'active');
      return { ...o, status: STATUSES[(i + 1) % STATUSES.length] };
    }) } }));
  }
  function addSubtask(section, objId) {
    update(s => ({ ...s, objectives: { ...s.objectives, [section]: (s.objectives?.[section] || []).map(o =>
      o.id === objId ? { ...o, subtasks: [...(o.subtasks || []), { id: uid(), text: '', done: false }] } : o
    ) } }));
  }
  function patchSubtask(section, objId, stId, k, v) {
    update(s => ({ ...s, objectives: { ...s.objectives, [section]: (s.objectives?.[section] || []).map(o =>
      o.id === objId ? { ...o, subtasks: (o.subtasks || []).map(st => st.id === stId ? { ...st, [k]: v } : st) } : o
    ) } }));
  }
  function rmSubtask(section, objId, stId) {
    update(s => ({ ...s, objectives: { ...s.objectives, [section]: (s.objectives?.[section] || []).map(o =>
      o.id === objId ? { ...o, subtasks: (o.subtasks || []).filter(st => st.id !== stId) } : o
    ) } }));
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
                  <input className="obj-title-in" value={obj.title} onChange={e => patchObj(sec, obj.id, 'title', e.target.value)} placeholder="Objective title..." />
                  <button className="btn btn-danger btn-xs" onClick={() => rmObj(sec, obj.id)}>✕</button>
                </div>
                <textarea className="obj-desc-ta" placeholder="Description..." value={obj.description || ''} onChange={e => patchObj(sec, obj.id, 'description', e.target.value)} />
                <ul className="subtask-list">
                  {(obj.subtasks || []).map(st => (
                    <li key={st.id} className="subtask-item">
                      <input type="checkbox" className="subtask-cb" checked={!!st.done} onChange={e => patchSubtask(sec, obj.id, st.id, 'done', e.target.checked)} />
                      <input className="subtask-text-in" value={st.text} onChange={e => patchSubtask(sec, obj.id, st.id, 'text', e.target.value)} placeholder="Subtask..." />
                      <button className="btn btn-danger btn-xs" onClick={() => rmSubtask(sec, obj.id, st.id)}>✕</button>
                    </li>
                  ))}
                </ul>
                <div className="row gap-sm" style={{ marginTop: 4 }}>
                  <button className="btn btn-muted btn-xs" onClick={() => addSubtask(sec, obj.id)}>+ Subtask</button>
                </div>
                <div className="reward-row">
                  <span className="reward-lbl">Reward:</span>
                  <input className="reward-in" placeholder="—" value={obj.reward || ''} onChange={e => patchObj(sec, obj.id, 'reward', e.target.value)} />
                </div>
              </div>
            );
          })}
          <button className="btn btn-gold btn-xs" onClick={() => addObj(sec)} style={{ width: '100%', marginTop: 4 }}>+ Objective</button>
        </div>
      ))}
    </div>
  );
}
