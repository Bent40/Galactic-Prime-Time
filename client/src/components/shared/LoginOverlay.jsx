import { useState } from 'react';
import { apiFetch } from '../../api.js';

export default function LoginOverlay({ onLogin, isAdmin = false }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const path = isAdmin
        ? '/api/auth/login'
        : isRegister
        ? '/api/auth/register'
        : '/api/auth/login';
      const data = await apiFetch(path, { method: 'POST', body: JSON.stringify({ username, password }) });
      if (data.error) { setErr(data.error); setLoading(false); return; }
      if (isAdmin && !data.isAdmin) { setErr('Admin access required.'); setLoading(false); return; }
      if (isAdmin) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUsername', data.username);
        onLogin({ token: data.token, username: data.username });
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('username', data.username);
        onLogin({ token: data.token, userId: data.userId, username: data.username });
      }
    } catch {
      setErr('Connection error. Is the server running?');
    }
    setLoading(false);
  }

  return (
    <div className="login-overlay">
      <div className={`login-box${isAdmin ? ' admin' : ''}`}>
        <div className={`login-title${isAdmin ? ' admin' : ''}`}>
          ⚡ {isAdmin ? 'Admin Access' : isRegister ? 'Register Contestant' : 'Contestant Login'}
        </div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="field-group">
            <label className="field-label">Username</label>
            <input className="fi" value={username} onChange={e => setUsername(e.target.value)} required autoFocus />
          </div>
          <div className="field-group">
            <label className="field-label">Password</label>
            <input className="fi" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button
            className={`btn ${isAdmin ? 'btn-purple' : 'btn-cyan'}`}
            type="submit"
            disabled={loading}
            style={{ marginTop: 6, padding: '9px' }}
          >
            {loading ? 'Connecting...' : isAdmin ? 'Enter Admin Panel' : isRegister ? 'Register' : 'Enter the Arena'}
          </button>
        </form>
        {err && <div className="login-err">{err}</div>}
        {!isAdmin && (
          <div className="login-toggle" onClick={() => setIsRegister(r => !r)}>
            {isRegister ? 'Have an account? Login' : 'New contestant? Register'}
          </div>
        )}
      </div>
    </div>
  );
}
