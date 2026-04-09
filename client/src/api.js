const API_BASE = import.meta.env.VITE_API_BASE || '';

export function apiFetch(path, opts = {}, token) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...opts.headers,
  };
  return fetch(`${API_BASE}${path}`, { ...opts, headers }).then(r => r.json());
}
