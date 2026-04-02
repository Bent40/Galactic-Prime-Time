import { useState } from 'react';
import { uid } from '../../constants.js';

export default function AchievementsTab({ state, update }) {
  const [form, setForm] = useState({ title: '', desc: '', reward: '' });

  function addAch() {
    if (!form.title) return;
    update(s => ({ ...s, achievements: [...s.achievements, { id: uid(), ...form }] }));
    setForm({ title: '', desc: '', reward: '' });
  }
  function rmAch(id) { update(s => ({ ...s, achievements: s.achievements.filter(a => a.id !== id) })); }

  return (
    <div className="panel">
      <div className="panel-title">Achievements ({state.achievements.length})</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {state.achievements.map(a => (
          <div key={a.id} className="ach-card">
            <div className="ach-icon">🏆</div>
            <div className="ach-body">
              <div className="ach-title">{a.title}</div>
              {a.desc && <div className="ach-desc">{a.desc}</div>}
              {a.reward && <div className="ach-reward">{a.reward}</div>}
            </div>
            <button className="btn btn-danger btn-xs" onClick={() => rmAch(a.id)}>✕</button>
          </div>
        ))}
        {state.achievements.length === 0 && <span style={{ color: 'var(--muted)', fontSize: 11 }}>No achievements yet.</span>}
      </div>
      <div className="add-form">
        <div className="field-group" style={{ flex: 2 }}>
          <label className="field-label">Title</label>
          <input className="fi" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        </div>
        <div className="field-group" style={{ flex: 3 }}>
          <label className="field-label">Description</label>
          <input className="fi" value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} />
        </div>
        <div className="field-group" style={{ flex: 2 }}>
          <label className="field-label">Reward</label>
          <input className="fi" value={form.reward} onChange={e => setForm(f => ({ ...f, reward: e.target.value }))} />
        </div>
        <button className="btn btn-gold btn-sm" onClick={addAch} style={{ alignSelf: 'flex-end' }}>+ Add</button>
      </div>
    </div>
  );
}
