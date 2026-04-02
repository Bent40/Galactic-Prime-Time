import { useState, useEffect } from 'react';
import { apiFetch } from '../../api.js';

export default function AllAchievementsSection({ token }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    apiFetch('/api/admin/achievements', {}, token).then(d => { if (Array.isArray(d)) setRows(d); });
  }, []);

  return (
    <div className="panel">
      <div className="panel-title admin">All Achievements ({rows.length})</div>
      <table className="ach-table">
        <thead>
          <tr><th>Player</th><th>Achievement</th><th>Reward</th></tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>
                <div className="ach-player">{r.username}</div>
                <div className="ach-charname">{r.charName}</div>
              </td>
              <td>
                <div className="ach-title-cell">{r.title}</div>
                {r.desc && <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{r.desc}</div>}
              </td>
              <td>{r.reward && <div className="ach-reward-cell">{r.reward}</div>}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={3} style={{ color: 'var(--muted)', fontSize: 11, textAlign: 'center', padding: 16 }}>No achievements yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
