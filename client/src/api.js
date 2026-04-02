export function apiFetch(path, opts = {}, token) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...opts.headers,
  };
  return fetch(path, { ...opts, headers }).then(r => r.json());
}
