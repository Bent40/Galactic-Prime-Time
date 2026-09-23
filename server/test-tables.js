/**
 * test-tables.js — the Table / TableMap routes, end to end through the real router.
 *
 * The seat is the permission: a player sees only the tables they are seated at,
 * only the LIVE map on each, never a hidden token or a GM note, and may move only
 * their own token. The GM verbs whitelist and coerce every field they accept.
 *
 * Runs against the real express router with both Mongoose models and both auth
 * middlewares stubbed out of the require cache — no database, no node_modules
 * beyond express. Run:  node test-tables.js
 */
process.env.LOG_TO_FILE = 'false';
const express = require('express');

// ── an in-memory stand-in for the two models ─────────────────────────────────
const clone = o => JSON.parse(JSON.stringify(o));
let seq = 1;
function makeModel(defaults) {
  const rows = new Map();
  const wrap = (raw) => {
    const doc = clone(raw);
    Object.defineProperty(doc, 'save', { value: async function () { this.updatedAt = new Date().toISOString(); rows.set(String(this._id), clone(this)); return this; } });
    Object.defineProperty(doc, 'deleteOne', { value: async function () { rows.delete(String(this._id)); } });
    Object.defineProperty(doc, 'toObject', { value: function () { return clone(this); } });
    Object.defineProperty(doc, 'markModified', { value: () => {} });
    // subdocument-ish helpers the routes call
    if (doc.grid) Object.defineProperty(doc.grid, 'toObject', { value: function () { return clone(this); } });
    if (Array.isArray(doc.tokens)) doc.tokens.forEach(t => Object.defineProperty(t, 'toObject', { value: function () { return clone(this); } }));
    return doc;
  };
  const matches = (row, q) => Object.entries(q).every(([k, v]) => {
    if (k === '_id') return String(row._id) === String(v);
    if (k === 'seats.userId') return (row.seats || []).some(s => s.userId === v);
    return String(row[k]) === String(v);
  });
  const chain = (arr) => ({ sort: () => chain(arr), select: (f) => chain(f === '-image' ? arr.map(r => { const c = clone(r); delete c.image; return c; }) : arr), lean: async () => clone(arr) });
  const M = {
    _rows: rows,
    create: async (data) => { const row = { _id: 'id' + (seq++), ...defaults(), ...clone(data), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }; rows.set(row._id, row); return wrap(row); },
    findById: (id) => { const r = rows.get(String(id)); const p = Promise.resolve(r ? wrap(r) : null); p.lean = async () => (r ? clone(r) : null); return p; },
    findOne: async (q) => { const r = [...rows.values()].find(x => matches(x, q)); return r ? wrap(r) : null; },
    find: (q = {}) => chain([...rows.values()].filter(x => matches(x, q))),
    deleteMany: async (q) => { for (const [k, v] of rows) if (matches(v, q)) rows.delete(k); },
    aggregate: async () => { const n = {}; for (const v of rows.values()) n[v.tableId] = (n[v.tableId] || 0) + 1; return Object.entries(n).map(([k, c]) => ({ _id: k, n: c })); },
  };
  return M;
}
const FakeTable = makeModel(() => ({ description: '', status: 'open', seats: [], activeMapId: null, createdBy: '' }));
const FakeMap = makeModel(() => ({ image: '', width: 0, height: 0, grid: { type: 'hex', size: 40, offsetX: 0, offsetY: 0, cols: 30, rows: 20 }, visible: false, revealed: [], fogEnabled: false, tokens: [], notes: '' }));

let CURRENT = { userId: 'gm', isAdmin: true };
for (const [mod, exp] of [
  ['./models/Table', FakeTable], ['./models/TableMap', FakeMap],
  ['./middleware/auth', (req, res, next) => { req.userId = CURRENT.userId; next(); }],
  ['./middleware/adminAuth', (req, res, next) => { if (!CURRENT.isAdmin) return res.status(403).json({ error: 'Admin access required' }); req.userId = CURRENT.userId; next(); }],
]) { const p = require.resolve(mod); require.cache[p] = { id: p, filename: p, loaded: true, exports: exp }; }

const router = require('./routes/tables');

let pass = 0, fail = 0;
const check = (label, cond, detail) => { if (cond) pass++; else { fail++; console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`); } };
const eq = (label, got, want) => check(label, JSON.stringify(got) === JSON.stringify(want), `got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);

(async () => {
  const app = express(); app.use(express.json({ limit: '10mb' })); app.use('/api/tables', router);
  const server = app.listen(0); await new Promise(r => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}/api/tables`;
  const call = (method, path, body) => fetch(base + path, { method, headers: { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) }).then(async r => ({ status: r.status, body: await r.json() }));
  const asGM = () => { CURRENT = { userId: 'gm', isAdmin: true }; };
  const asPlayer = (id) => { CURRENT = { userId: id, isAdmin: false }; };

  // ── 1. create a table ──────────────────────────────────────────────────────
  asGM();
  let r = await call('POST', '', { name: '  The Forest ', description: 'Floor 1' });
  eq('create → 201', r.status, 201); eq('create trims the name', r.body.name, 'The Forest'); eq('create records the GM', r.body.createdBy, 'gm');
  const T = r.body._id;
  r = await call('POST', '', { name: '   ' }); eq('blank name → 400', r.status, 400);
  r = await call('GET', ''); eq('list → 200', r.status, 200); eq('list carries mapCount 0', r.body[0].mapCount, 0);

  // ── 2. seats ───────────────────────────────────────────────────────────────
  r = await call('POST', `/${T}/seats`, { userId: 'sasha' }); eq('seat sasha', r.body.seats.map(s => s.userId), ['sasha']);
  r = await call('POST', `/${T}/seats`, { userId: 'sasha' }); eq('seating twice is idempotent', r.body.seats.length, 1);
  r = await call('POST', `/${T}/seats`, { userId: 'filipe' }); eq('seat filipe', r.body.seats.length, 2);
  r = await call('POST', `/${T}/seats`, {}); eq('seat without userId → 400', r.status, 400);
  r = await call('DELETE', `/${T}/seats/filipe`); eq('unseat filipe', r.body.seats.map(s => s.userId), ['sasha']);

  // ── 3. maps and the image cap ──────────────────────────────────────────────
  r = await call('POST', `/${T}/maps`, { name: 'Bramble Edge', image: 'data:image/png;base64,AAAA', width: 1200, height: 760, grid: { size: 32, cols: 27, rows: 20 } });
  eq('map create → 201', r.status, 201); check('map create response omits the image', r.body.image === undefined); eq('grid merges over defaults', r.body.grid.size, 32);
  const M1 = r.body._id;
  r = await call('POST', `/${T}/maps`, { name: 'Bad', image: 'javascript:alert(1)' }); eq('non-image URL → 400', r.status, 400);
  r = await call('POST', `/${T}/maps`, { name: 'Huge', image: 'data:image/png;base64,' + 'A'.repeat(router.MAX_IMAGE_CHARS + 1) }); eq('oversized image → 400', r.status, 400);
  r = await call('POST', `/${T}/maps`, { name: 'Mural Stair', notes: 'Chainbearer waits here' }); eq('second map (no image) → 201', r.status, 201);
  const M2 = r.body._id;
  r = await call('GET', `/${T}`); eq('table GET lists both maps', r.body.maps.length, 2); check('table GET maps carry no image', r.body.maps.every(m => m.image === undefined));
  r = await call('GET', `/${T}/maps/${M1}`); eq('map GET carries the image', r.body.image, 'data:image/png;base64,AAAA');

  // ── 4. tokens: whitelist + coercion ────────────────────────────────────────
  r = await call('POST', `/${T}/maps/${M1}/tokens`, { name: 'Sasha', kind: 'player', refId: 'sasha', color: '#00d4ff', col: '6.4', row: 8, label: 'SASHA', parts: [{ name: 'Torso', maxHp: 3, lethal: true }] });
  eq('token create → 201', r.status, 201); eq('col is rounded', r.body.col, 6); eq('label is clipped to 3', r.body.label, 'SAS'); eq('currentHp defaults to maxHp', r.body.parts[0].currentHp, 3);
  const TOK_S = r.body.tokenId;
  r = await call('POST', `/${T}/maps/${M1}/tokens`, { name: 'The Kindler', kind: 'enemy', refId: 'e1', color: 'red', tier: 'elite', col: 18, row: 5, hidden: true });
  eq('bad colour falls back', r.body.color, '#94a6c6'); const TOK_K = r.body.tokenId;
  r = await call('POST', `/${T}/maps/${M1}/tokens`, { kind: 'marker' }); eq('token without name → 400', r.status, 400);
  r = await call('POST', `/${T}/maps/${M1}/tokens`, { name: 'x', kind: 'dragon' }); eq('unknown kind → marker', r.body.kind, 'marker');
  r = await call('PATCH', `/${T}/maps/${M1}/tokens/${TOK_K}`, { hidden: false, parts: [{ name: 'Torso', maxHp: 20, currentHp: 12 }] });
  eq('token PATCH keeps unnamed fields', r.body.name, 'The Kindler'); eq('token PATCH reveals', r.body.hidden, false); eq('token PATCH sets parts', r.body.parts[0].currentHp, 12);
  await call('PATCH', `/${T}/maps/${M1}/tokens/${TOK_K}`, { hidden: true });
  r = await call('PATCH', `/${T}/maps/${M1}/tokens/nope`, { col: 1 }); eq('unknown token → 404', r.status, 404);

  // ── 5. the live map ────────────────────────────────────────────────────────
  r = await call('PATCH', `/${T}`, { activeMapId: 'id999' }); eq('activeMapId must be on this table', r.status, 400);
  r = await call('PATCH', `/${T}`, { activeMapId: M1 }); eq('set live map', String(r.body.activeMapId), M1);
  r = await call('PATCH', `/${T}`, { status: 'paused' }); eq('bad status → 400', r.status, 400);

  // ── 6. the player side: the seat is the permission ─────────────────────────
  asPlayer('sasha');
  r = await call('GET', '/mine'); eq('seated player sees the table', r.body.length, 1); eq('…with the live map', r.body[0].live.name, 'Bramble Edge');
  eq('hidden token is stripped', r.body[0].live.tokens.map(t => t.name), ['Sasha', 'x']);
  check('GM notes never reach a player', r.body[0].live.notes === undefined);
  eq('fog off → revealed is empty', r.body[0].live.revealed, []);
  asPlayer('filipe');
  r = await call('GET', '/mine'); eq('unseated player sees nothing', r.body.length, 0);
  r = await call('GET', ''); eq('player cannot list tables', r.status, 403);
  r = await call('POST', `/${T}/maps`, { name: 'Sneak' }); eq('player cannot add maps', r.status, 403);

  // ── 7. the one player write: moving your own token ─────────────────────────
  asPlayer('sasha');
  r = await call('PATCH', `/${T}/tokens/${TOK_S}/move`, { col: 7, row: 9 }); eq('own token moves', r.status, 200); eq('…to the new hex', [r.body.token.col, r.body.token.row], [7, 9]);
  r = await call('PATCH', `/${T}/tokens/${TOK_K}/move`, { col: 1, row: 1 }); eq('someone else\'s token → 403', r.status, 403);
  r = await call('PATCH', `/${T}/tokens/${TOK_S}/move`, {}); eq('move without col/row → 400', r.status, 400);
  asPlayer('filipe');
  r = await call('PATCH', `/${T}/tokens/${TOK_S}/move`, { col: 0, row: 0 }); eq('unseated player → 403', r.status, 403);

  // ── 8. fog reaches the player only when it is on ───────────────────────────
  asGM();
  await call('PATCH', `/${T}/maps/${M1}`, { fogEnabled: true, revealed: ['1,1', '2,1'] });
  asPlayer('sasha');
  r = await call('GET', '/mine'); eq('fog on → revealed keys reach the player', r.body[0].live.revealed, ['1,1', '2,1']);

  // ── 9. deleting the live map clears activeMapId; deleting the table cascades ─
  asGM();
  r = await call('DELETE', `/${T}/maps/${M1}`); eq('delete live map → activeMapId null', r.body.activeMapId, null);
  asPlayer('sasha');
  r = await call('GET', '/mine'); eq('no live map → live is null', r.body[0].live, null);
  asGM();
  r = await call('DELETE', `/${T}`); eq('delete table → ok', r.body.ok, true);
  eq('…and its maps are gone', FakeMap._rows.size, 0);
  r = await call('GET', `/${T}`); eq('deleted table → 404', r.status, 404);

  // ── 10. pure helpers ───────────────────────────────────────────────────────
  eq('imageProblem: empty is fine', router.imageProblem(''), null);
  eq('imageProblem: https ok', router.imageProblem('https://x/y.png'), null);
  check('imageProblem: http rejected', router.imageProblem('http://x/y.png') !== null);
  eq('playerView(null) → null', router.playerView(null), null);

  server.close();
  console.log(`\ntest-tables: ${pass} pass · ${fail} fail`);
  process.exit(fail ? 1 : 0);
})();
