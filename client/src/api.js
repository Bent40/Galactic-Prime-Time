import { useState, useEffect, useCallback } from 'react';

// Primary target — set VITE_API_BASE in client/.env, e.g.:
// Fallback is always localhost. If both addresses are the same, no discovery
// is needed and the first request goes straight through.
const PRIMARY  = import.meta.env.VITE_API_BASE ?? 'http://localhost:3001';
const FALLBACK = 'http://localhost:3001';

// ── Base discovery ────────────────────────────────────────────────────────────
// Discovery happens on the very first apiFetch call rather than via a separate
// probe. The first request is attempted against PRIMARY with a 2 s timeout; if
// it gets a network error (host unreachable, connection refused, timeout), the
// same request is retried against FALLBACK and FALLBACK is remembered for every
// subsequent call. Once a base is confirmed it is never re-tested.
//
// Why not a separate /api/health probe?
//   • Browser caches can return stale health responses even when the server is
//     actually down, causing the probe to lie.
//   • TCP connection attempts to unreachable LAN IPs can block for longer than
//     an AbortSignal timeout on some OS/network combinations.
//   • Doing discovery on a real request means zero extra round-trips.

const DISCOVERY_TIMEOUT_MS = 2000;

let _base = null;           // null = undiscovered
let _baseResolve = null;    // resolve handle for _basePromise
const _basePromise = new Promise((res) => { _baseResolve = res; });

// Resolve the base promise so useApi() can react when discovery completes.
function _confirmBase(url) {
  if (_base !== null) return; // already set
  _base = url;
  _baseResolve(url);
}

// Core dispatcher — drives discovery on the first call, then fast-paths.
async function dispatch(path, opts, headers) {
  // Fast path: base already confirmed.
  if (_base !== null) {
    return fetch(`${_base}${path}`, { ...opts, headers });
  }

  // Same address → nothing to discover.
  if (PRIMARY === FALLBACK) {
    _confirmBase(PRIMARY);
    return fetch(`${PRIMARY}${path}`, { ...opts, headers });
  }

  // Discovery: try PRIMARY with a hard timeout.
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), DISCOVERY_TIMEOUT_MS);

  try {
    const r = await fetch(`${PRIMARY}${path}`, {
      ...opts,
      headers,
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    _confirmBase(PRIMARY);
    console.log(`[api] ✓ connected to primary  ${PRIMARY}`);
    return r;
  } catch {
    clearTimeout(timer);
    // PRIMARY is unreachable (network error, refused, or our timeout).
    // Fall through to FALLBACK and retry the same path.
    console.warn(`[api] ✗ primary ${PRIMARY} unreachable — retrying on fallback ${FALLBACK}`);
    const r = await fetch(`${FALLBACK}${path}`, { ...opts, headers });
    _confirmBase(FALLBACK);
    console.warn(`[api] ✓ using fallback  ${FALLBACK}`);
    return r;
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function apiFetch(path, opts = {}, token) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...opts.headers,
  };
  const r = await dispatch(path, opts, headers);
  return r.json();
}

// useApi — for components that need to show connection status / resolved URL.
// status: 'checking' | 'connected' | 'fallback'
export function useApi() {
  const [apiBase, setApiBase] = useState(_base ?? PRIMARY);
  const [status,  setStatus]  = useState(
    PRIMARY === FALLBACK ? 'connected' : 'checking',
  );

  useEffect(() => {
    if (_base !== null) {
      setApiBase(_base);
      setStatus(_base === PRIMARY ? 'connected' : 'fallback');
      return;
    }
    // Wait for the first apiFetch call to confirm the base.
    _basePromise.then((base) => {
      setApiBase(base);
      setStatus(base === PRIMARY ? 'connected' : 'fallback');
    });
  }, []);

  const call = useCallback(
    (path, opts, token) => apiFetch(path, opts, token),
    [],
  );

  return {
    apiFetch: call,
    apiBase,
    status,
    primary:  PRIMARY,
    fallback: FALLBACK,
  };
}
