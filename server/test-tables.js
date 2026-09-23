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
    findOne: (q, fields) => {
      const r = [...rows.values()].find(x => matches(x, q));
      const p = Promise.resolve(r ? wrap(r) : null);
      p.select = (f) => ({ lean: async () => { if (!r) return null; const c = clone(r); if (f.startsWith('-')) { delete c[f.slice(1)]; return c; } const keep = f.split(' '); return Object.fromEntries(Object.entries(c).filter(([k]) => keep.includes(k) || k === '_id')); } });
      p.lean = async () => (r ? clone(r) : null);
      return p;
    },
    find: (q = {}) => chain([...rows.values()].filter(x => matches(x, q))),
    deleteMany: async (q) => { for (const [k, v] of rows) if (matches(v, q)) rows.delete(k); },
    aggregate: async () => { const n = {}; for (const v of rows.values()) n[v.tableId] = (n[v.tableId] || 0) + 1; return Object.entries(n).map(([k, c]) => ({ _id: k, n: c })); },
  };
  return M;
}
const FakeTable = makeModel(() => ({ description: '', status: 'open', seats: [], activeMapId: null, createdBy: '', cues: [], sound: { cueId: '', playing: false, startedAt: null, seq: 0 }, fx: [] }));
const FakeMap = makeModel(() => ({ image: '', width: 0, height: 0, grid: { type: 'hex', size: 40, offsetX: 0, offsetY: 0, cols: 30, rows: 20 }, visible: false, revealed: [], fogEnabled: false, tokens: [], notes: '' }));

const MESSAGES = [];
const FakeMessage = { create: async (m) => { const row = { _id: 'm' + (seq++), ...clone(m), createdAt: new Date().toISOString() }; MESSAGES.push(row); return row; } };
const FakeUser = { findById: () => ({ lean: async () => ({ username: 'sasha_user' }) }) };
const SASHA_STATE = { identity: { name: 'Sasha' }, skills: [{ id: 's1', templateId: 't1', level: 2 }, { id: 's2', templateId: 't2', level: 1 }] };
const FakeCharacter = { findOne: () => { const p = Promise.resolve({ state: SASHA_STATE }); p.lean = async () => ({ state: SASHA_STATE }); return p; } };
// enrichSkills is what joins the template; stub it with two shapes — one authored, one text-only
const FakeSkillUtils = { enrichSkills: async (skills) => skills.map(sk => sk.templateId === 't1'
  ? { ...sk, name: 'Fire Ball', effect: 'Hurl a ball of flame.', damageTypes: [] }
  : { ...sk, name: 'Chilling Cut', effect: 'x', damageTypes: ['Chill', 'Bleed'] }) };
let CURRENT = { userId: 'gm', isAdmin: true };
for (const [mod, exp] of [
  ['./models/Table', FakeTable], ['./models/TableMap', FakeMap],
  ['./models/Message', FakeMessage], ['./models/User', FakeUser], ['./models/Character', FakeCharacter], ['./utils/skillUtils', FakeSkillUtils],
  ['./middleware/auth', (req, res, next) => { req.userId = CURRENT.userId; req.isAdmin = CURRENT.isAdmin; next(); }],
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

  // ── 8b. the poll: /live projects per role and never carries the image ──────
  asPlayer('sasha');
  r = await call('GET', `/${T}/live`); eq('player /live → 200', r.status, 200);
  check('player /live map has no image', r.body.map && r.body.map.image === undefined);
  eq('player /live strips hidden tokens', r.body.map.tokens.map(t => t.name), ['Sasha', 'x']);
  check('player /live has no cue list', r.body.cues === undefined);
  check('player /live carries serverNow', typeof r.body.serverNow === 'number');
  asPlayer('filipe');
  r = await call('GET', `/${T}/live`); eq('unseated /live → 403', r.status, 403);
  asGM();
  r = await call('GET', `/${T}/live`); eq('GM /live sees hidden tokens', r.body.map.tokens.length, 3); check('GM /live has the cue list', Array.isArray(r.body.cues));
  check('GM /live map has no image either', r.body.map.image === undefined);

  // ── 8c. the image: once per map, live-only for players ─────────────────────
  asPlayer('sasha');
  r = await call('GET', `/${T}/maps/${M1}/image`); eq('player fetches the live map image', r.body.image, 'data:image/png;base64,AAAA');
  r = await call('GET', `/${T}/maps/${M2}/image`); eq('player cannot fetch a map that is not live', r.status, 403);
  asGM();
  r = await call('GET', `/${T}/maps/${M2}/image`); eq('GM fetches any map', r.status, 200);

  // ── 8d. the server rolls ───────────────────────────────────────────────────
  asPlayer('sasha');
  r = await call('POST', `/${T}/roll`, { kind: 'body' }); eq('player roll → 201', r.status, 201);
  eq('roll is a Message of kind roll', r.body.kind, 'roll'); eq('roll names the character', r.body.senderName, 'Sasha');
  check('d6 result in range', r.body.roll.total >= 1 && r.body.roll.total <= 6); check('Forced Action carries its table row', /—/.test(r.body.roll.effect));
  r = await call('POST', `/${T}/roll`, { kind: 'body', gmOnly: true }); eq('a player cannot make a roll GM-only', r.body.gmOnly, false);
  r = await call('POST', `/${T}/roll`, { kind: 'd20' }); eq('no d20 in this game → 400', r.status, 400);
  r = await call('POST', `/${T}/roll`, { kind: 'fall', height: 2 }); eq('a 2 m fall rolls nothing', r.body.roll.total, 0);
  r = await call('POST', `/${T}/roll`, { kind: 'fall', height: 10 }); eq('a 10 m fall is 3d6', r.body.roll.die, '3d6');
  asGM();
  r = await call('POST', `/${T}/roll`, { kind: 'tool', gmOnly: true, actorName: 'The Rack' }); eq('GM roll can be GM-only', r.body.gmOnly, true); eq('GM roll can name an actor', r.body.senderName, 'The Rack');
  asPlayer('filipe');
  r = await call('POST', `/${T}/roll`, { kind: 'd4' }); eq('unseated roll → 403', r.status, 403);

  // ── 8e. sound cues ─────────────────────────────────────────────────────────
  asGM();
  r = await call('POST', `/${T}/cues`, { name: 'Boss phase 1', source: 'youtube', ref: 'dQw4w9WgXcQ', start: 0, end: 36, loop: true });
  eq('cue create → 201', r.status, 201); eq('cue keeps its segment', [r.body.start, r.body.end, r.body.loop], [0, 36, true]); const C1 = r.body.cueId;
  r = await call('POST', `/${T}/cues`, { name: 'Phase 2', source: 'youtube', ref: 'dQw4w9WgXcQ', start: 36, end: 110, loop: true }); const C2 = r.body.cueId;
  r = await call('POST', `/${T}/cues`, { name: 'Bad', source: 'youtube', ref: 'https://youtube.com/watch?v=x' }); eq('a URL is not a video id → 400', r.status, 400);
  r = await call('POST', `/${T}/cues`, { name: 'Bad', source: 'audio', ref: 'http://x/y.mp3' }); eq('plain-http audio → 400', r.status, 400);
  r = await call('POST', `/${T}/cues`, { name: 'Backwards', source: 'youtube', ref: 'dQw4w9WgXcQ', start: 50, end: 20 }); eq('end before start → runs to the end (0)', r.body.end, 0);
  r = await call('POST', `/${T}/sound`, { cueId: C1 }); eq('play cue 1', r.body.sound.cueId, C1); eq('…playing', r.body.sound.playing, true); check('…startedAt set', !!r.body.sound.startedAt); const seq1 = r.body.sound.seq;
  r = await call('POST', `/${T}/sound`, { cueId: C2 }); eq('switch to cue 2 bumps seq', r.body.sound.seq, seq1 + 1); eq('…cue projected', r.body.cue.name, 'Phase 2');
  asPlayer('sasha');
  r = await call('GET', `/${T}/live`); eq('player /live carries only the playing cue', r.body.cue.cueId, C2);
  asGM();
  r = await call('POST', `/${T}/sound`, { stop: true }); eq('stop', r.body.sound.playing, false); eq('stop clears the cue', r.body.cue, null);
  r = await call('POST', `/${T}/sound`, { cueId: 'nope' }); eq('unknown cue → 404', r.status, 404);
  r = await call('PATCH', `/${T}/cues/${C1}`, { trigger: 'map-live', mapId: M2 }); eq('cue bound to a map', r.body.mapId, M2);
  r = await call('PATCH', `/${T}`, { activeMapId: M2 }); eq('map going live fires its cue', r.body.sound.cueId, C1);
  await call('PATCH', `/${T}`, { activeMapId: M1 });
  r = await call('DELETE', `/${T}/cues/${C1}`); eq('delete the playing cue', r.body.ok, true);
  r = await call('GET', `/${T}/live`); eq('…which stops it', r.body.sound.playing, false);

  // ── 8f. visual effects ─────────────────────────────────────────────────────
  r = await call('POST', `/${T}/fx`, { type: 'Burn', from: { col: 6, row: 8 }, to: { col: 10, row: 7 }, label: 'Torch' }); eq('fx → 201', r.status, 201); eq('fx keeps its type', r.body.type, 'Burn');
  r = await call('POST', `/${T}/fx`, { type: 'Lightning', to: { col: 1, row: 1 } }); eq('unknown damage type → 400', r.status, 400);
  r = await call('POST', `/${T}/fx`, { type: 'Crush' }); eq('fx without a target → 400', r.status, 400);
  asPlayer('sasha');
  r = await call('GET', `/${T}/live`); eq('player /live carries the effect', r.body.fx.map(f => f.type), ['Burn']);
  eq('liveFx drops effects older than the window', router.liveFx([{ at: new Date(Date.now() - 30000), type: 'Burn' }]).length, 0);
  asGM();

  // ── 8g. a skill fires its damage-type effect (owner ask) ───────────────────
  asPlayer('sasha');
  r = await call('POST', `/${T}/use-skill`, { skillId: 's1', targetTokenId: TOK_K }); eq('player uses a skill → 201', r.status, 201);
  eq('Fire Ball with no authored type infers Burn from its text', r.body.types, ['Burn']);
  eq('the effect travels from the player token to the target', [r.body.fx[0].from, r.body.fx[0].to], [{ col: 7, row: 9 }, { col: 18, row: 5 }]);
  eq('the effect is labelled with the skill', r.body.fx[0].label, 'Fire Ball');
  eq('and it is announced in chat', r.body.message.kind, 'skill'); check('the announcement names actor, skill and target', /Sasha uses Fire Ball → The Kindler/.test(r.body.message.text));
  r = await call('POST', `/${T}/use-skill`, { skillId: 's2', to: { col: 3, row: 3 } }); eq('authored types win: two effects', r.body.types, ['Chill', 'Bleed']); eq('…two fx queued', r.body.fx.length, 2); eq('only the first carries the label', r.body.fx[1].label, '');
  r = await call('POST', `/${T}/use-skill`, { skillId: 'nope', to: { col: 1, row: 1 } }); eq('a skill not on the sheet → 404', r.status, 404);
  r = await call('GET', `/${T}/live`); eq('the effects reach the poll', r.body.fx.length >= 3, true);
  asPlayer('filipe');
  r = await call('POST', `/${T}/use-skill`, { skillId: 's1', to: { col: 1, row: 1 } }); eq('unseated → 403', r.status, 403);
  asGM();
  r = await call('POST', `/${T}/use-skill`, { name: 'Charged Shot', actorTokenId: TOK_K, targetTokenId: TOK_S, type: 'Crush' }); eq('GM ability with an explicit type', r.body.types, ['Crush']); check('GM ability announces the actor token', /The Kindler uses Charged Shot → Sasha/.test(r.body.message.text));
  r = await call('POST', `/${T}/use-skill`, { name: 'Ember Breath', actorTokenId: TOK_K, to: { col: 2, row: 2 } }); eq('GM ability with no type infers from the name', r.body.types, ['Burn']);
  r = await call('POST', `/${T}/use-skill`, { name: 'Glare', actorTokenId: TOK_K, to: { col: 2, row: 2 } }); eq('an ability with no damage word fires the neutral burst', r.body.types, ['Skill']);
  r = await call('POST', `/${T}/use-skill`, { actorTokenId: TOK_K, to: { col: 2, row: 2 } }); eq('GM ability without a name → 400', r.status, 400);

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
