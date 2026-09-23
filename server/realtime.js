/**
 * realtime.js — Socket.IO as a NOTIFIER, never the source of truth (2026-09-23,
 * owner-approved). Every table write still goes through a normal route; the route
 * then calls notify(tableId, event, payload) and every socket in that table's room
 * hears it and re-fetches. A client that misses an event (Render restart, a phone
 * asleep) is still correct on its next poll — the poll just slows down while the
 * socket is connected.
 *
 * Handshake: the JWT in `auth.token`, verified with the same secret as the routes.
 * Rooms: `table:<id>` — joined on a `join` event only after the seat (or admin) check;
 *        `tracker` and `chat` — global, any authenticated socket.
 * Fails OPEN: if socket.io never attaches (tests, a missing module) notify() is a no-op.
 */
const jwt = require('jsonwebtoken');

let io = null;
let checkSeat = null;   // async (tableId, userId, isAdmin) → boolean, injected by attach()

function attach(httpServer, opts = {}) {
  const { Server } = require('socket.io');
  checkSeat = opts.checkSeat || (async () => false);
  const logger = opts.logger || console;
  io = new Server(httpServer, { cors: { origin: true, credentials: true }, path: '/socket.io' });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('no token'));
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
      socket.data.userId = String(payload.userId);
      socket.data.isAdmin = !!payload.isAdmin;
      next();
    } catch { next(new Error('bad token')); }
  });

  io.on('connection', (socket) => {
    socket.join('tracker'); socket.join('chat');
    socket.on('join', async (tableId, ack) => {
      try {
        const ok = socket.data.isAdmin || await checkSeat(String(tableId), socket.data.userId, socket.data.isAdmin);
        if (!ok) return typeof ack === 'function' && ack({ error: 'not seated' });
        for (const room of socket.rooms) if (room.startsWith('table:')) socket.leave(room);
        socket.join(`table:${tableId}`);
        typeof ack === 'function' && ack({ ok: true });
      } catch (err) { typeof ack === 'function' && ack({ error: 'join failed' }); }
    });
    socket.on('leave', (tableId) => socket.leave(`table:${tableId}`));
  });

  logger.info && logger.info('Socket.IO attached');
  return io;
}

/** Tell a table's room something changed. `event` names what; `payload` is a hint, not state. */
function notify(tableId, event, payload = {}) {
  if (!io || !tableId) return;
  io.to(`table:${tableId}`).emit('table:changed', { tableId: String(tableId), event, ...payload, at: Date.now() });
}
/** Global rooms. */
function notifyTracker(payload = {}) { if (io) io.to('tracker').emit('tracker:changed', { ...payload, at: Date.now() }); }
function notifyChat(payload = {}) { if (io) io.to('chat').emit('chat:changed', { ...payload, at: Date.now() }); }

function close() { if (io) { io.close(); io = null; } }

module.exports = { attach, notify, notifyTracker, notifyChat, close, get io() { return io; } };
