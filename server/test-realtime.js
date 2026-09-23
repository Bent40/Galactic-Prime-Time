/**
 * test-realtime.js — Socket.IO as a notifier (2026-09-23).
 *
 * A socket must carry a valid JWT to connect; it may join a table's room only when
 * seated (or admin); notify() reaches that room and no other; notifyTracker /
 * notifyChat reach every socket; and with nothing attached every notify is a no-op.
 * Real socket.io server on port 0, real socket.io-client. Run:  node test-realtime.js
 */
process.env.LOG_TO_FILE = 'false';
process.env.JWT_SECRET = 'test-secret';
const http = require('http');
const jwt = require('jsonwebtoken');
const { io: connect } = require('socket.io-client');
const realtime = require('./realtime');

let pass = 0, fail = 0;
const check = (label, cond, detail) => { if (cond) pass++; else { fail++; console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`); } };
const eq = (label, got, want) => check(label, JSON.stringify(got) === JSON.stringify(want), `got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const sign = (userId, isAdmin = false) => jwt.sign({ userId, isAdmin }, 'test-secret');

(async () => {
  // no-op before attach
  realtime.notify('t1', 'x'); realtime.notifyTracker(); realtime.notifyChat();
  check('notify is a no-op before attach', realtime.io === null);

  const server = http.createServer((req, res) => res.end('ok'));
  const SEATS = { t1: ['sasha'] };
  realtime.attach(server, { logger: { info() {} }, checkSeat: async (tableId, userId) => (SEATS[tableId] || []).includes(userId) });
  await new Promise(r => server.listen(0, r));
  const url = `http://127.0.0.1:${server.address().port}`;
  const open = (token) => new Promise((resolve) => {
    const s = connect(url, { auth: { token }, transports: ['websocket'], reconnection: false });
    s.on('connect', () => resolve({ s, ok: true }));
    s.on('connect_error', (e) => resolve({ s, ok: false, err: e.message }));
  });
  const join = (s, t) => new Promise(r => s.emit('join', t, r));

  // ── handshake ──────────────────────────────────────────────────────────────
  let r = await open(undefined); eq('no token → refused', r.ok, false); r.s.close();
  r = await open('garbage'); eq('bad token → refused', r.ok, false); eq('…with the reason', r.err, 'bad token'); r.s.close();
  r = await open(jwt.sign({ userId: 'x' }, 'wrong-secret')); eq('wrong secret → refused', r.ok, false); r.s.close();

  const sasha = (await open(sign('sasha'))); eq('valid token connects', sasha.ok, true);
  const filipe = (await open(sign('filipe'))); eq('second player connects', filipe.ok, true);
  const gm = (await open(sign('gm', true))); eq('admin connects', gm.ok, true);

  // ── rooms: the seat is the permission ──────────────────────────────────────
  eq('seated player joins the table', await join(sasha.s, 't1'), { ok: true });
  eq('unseated player is refused', await join(filipe.s, 't1'), { error: 'not seated' });
  eq('admin joins any table', await join(gm.s, 't1'), { ok: true });
  eq('admin joins a table that does not exist yet', await join(gm.s, 't2'), { ok: true });   // moved to t2 now

  const got = { sasha: [], filipe: [], gm: [] };
  sasha.s.on('table:changed', e => got.sasha.push(e.event));
  filipe.s.on('table:changed', e => got.filipe.push(e.event));
  gm.s.on('table:changed', e => got.gm.push(e.event));
  realtime.notify('t1', 'token:moved', { tokenId: 'a' });
  await sleep(150);
  eq('notify reaches the seated player', got.sasha, ['token:moved']);
  eq('…not the unseated one', got.filipe, []);
  eq('…and not the admin who moved to another table', got.gm, []);
  realtime.notify('t2', 'sound'); await sleep(150);
  eq('a second table notifies its own room only', [got.sasha.length, got.gm], [1, ['sound']]);

  // a socket holds ONE table room: joining another leaves the first
  eq('admin rejoins t1', await join(gm.s, 't1'), { ok: true });
  realtime.notify('t2', 'fx'); await sleep(150);
  eq('after moving rooms the old room is silent', got.gm, ['sound']);

  // ── global rooms ───────────────────────────────────────────────────────────
  const tr = { sasha: 0, filipe: 0, gm: 0 }, ch = { sasha: 0, filipe: 0, gm: 0 };
  for (const [k, c] of Object.entries({ sasha, filipe, gm })) { c.s.on('tracker:changed', () => tr[k]++); c.s.on('chat:changed', () => ch[k]++); }
  realtime.notifyTracker({ currentMoment: 7 }); realtime.notifyChat({ kind: 'roll' }); await sleep(150);
  eq('tracker reaches every socket', tr, { sasha: 1, filipe: 1, gm: 1 });
  eq('chat reaches every socket', ch, { sasha: 1, filipe: 1, gm: 1 });

  // payload shape
  let last = null; sasha.s.on('table:changed', e => { last = e; });
  realtime.notify('t1', 'map:patched', { mapId: 'm1' }); await sleep(150);
  check('event carries tableId, event, hint and a timestamp', last && last.tableId === 't1' && last.event === 'map:patched' && last.mapId === 'm1' && typeof last.at === 'number');

  for (const c of [sasha, filipe, gm]) c.s.close();
  realtime.close(); server.close();
  realtime.notify('t1', 'x');
  check('after close notify is a no-op again', realtime.io === null);
  console.log(`\ntest-realtime: ${pass} pass · ${fail} fail`);
  process.exit(fail ? 1 : 0);
})();
