export default function AchievementsTab({ state }) {
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
          </div>
        ))}
        {state.achievements.length === 0 && <span style={{ color: 'var(--muted)', fontSize: 11 }}>No achievements yet.</span>}
      </div>
    </div>
  );
}
