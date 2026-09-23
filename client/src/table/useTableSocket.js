import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { getApiBase } from '../api.js';

/**
 * useTableSocket — the notifier half of docs/vtt-research.md V-4 (approved 2026-09-23).
 * Connects with the JWT, joins the table's room, and calls the handlers when the server
 * says something changed. The handlers RE-FETCH; nothing here is state. While the socket
 * is connected the poll can slow right down; the moment it drops the poll takes over.
 */
export default function useTableSocket(tableId, token, { onTable, onTracker, onChat } = {}) {
  const [connected, setConnected] = useState(false);
  const handlers = useRef({ onTable, onTracker, onChat });
  handlers.current = { onTable, onTracker, onChat };

  useEffect(() => {
    if (!token) return;
    let socket;
    try {
      socket = io(getApiBase() || undefined, { auth: { token }, path: '/socket.io', transports: ['websocket', 'polling'], reconnectionDelayMax: 10000 });
    } catch { return; }
    const join = () => { if (tableId) socket.emit('join', String(tableId), () => {}); };
    socket.on('connect', () => { setConnected(true); join(); });
    socket.on('disconnect', () => setConnected(false));
    socket.on('connect_error', () => setConnected(false));
    socket.on('table:changed', (e) => { if (!tableId || String(e.tableId) === String(tableId)) handlers.current.onTable?.(e); });
    socket.on('tracker:changed', (e) => handlers.current.onTracker?.(e));
    socket.on('chat:changed', (e) => handlers.current.onChat?.(e));
    if (socket.connected) join();
    return () => { socket.removeAllListeners(); socket.disconnect(); };
  }, [tableId, token]);

  return connected;
}
