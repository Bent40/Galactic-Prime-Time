/**
 * test-admin-levels.js — the level ledger, end to end through the real routes.
 *
 * §3.1: one level is one point. Two routes move it:
 *   POST  /players/:id/levelup      grants or revokes a LEVEL (level + pool together)
 *   PATCH /players/:id/level-spend  spends or refunds a POINT (pool + trait together)
 *
 * The invariant both must preserve:  level - 1  ===  pool + Σ levelBonus
 *
 * Runs against the real express router with the Mongoose model and the admin-auth
 * middleware stubbed out of the require cache — so it needs a database no more than
 * the seeders' --check mode does. Run:  node test-admin-levels.js
 */
process.env.LOG_TO_FILE = 'false';

const path = require('path');
const express = require('express');

// ── stub the two things that would reach outside the process ─────────────────
const CHAR_PATH = require.resolve('./models/Character');
const AUTH_PATH = require.resolve('./middleware/adminAuth');

let DOC = null; // the single fake character document
const clone = (o) => JSON.parse(JSON.stringify(o));

const FakeCharacter = {
  findOne: async () => (DOC ? { state: clone(DOC.state) } : null),
  findOneAndUpdate: async (_q, update) => { DOC.state = clone(update.state); return DOC; },
};
require.cache[CHAR_PATH] = { id: CHAR_PATH, filename: CHAR_PATH, loaded: true, exports: FakeCharacter };
require.cache[AUTH_PATH] = { id: AUTH_PATH, filename: AUTH_PATH, loaded: true, exports: (req, res, next) => next() };

const adminRouter = require('./routes/admin');

// ── harness ──────────────────────────────────────────────────────────────────
let pass = 0, fail = 0;
function check(label, cond, detail) {
  if (cond) { pass++; }
  else { fail++; console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`); }
}
function eq(label, got, want) { check(label, got === want, `got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`); }

const TRAITS = ['physique', 'reflexes', 'mind', 'charm'];
const fresh = () => ({
  identity: { name: 'Test', level: 1 },
  levelPoints: { pool: 0 },
  traits: Object.fromEntries(TRAITS.map(t => [t, { base: 1, bonus: 0, levelBonus: 0 }])),
});
const spent = () => TRAITS.reduce((n, t) => n + (DOC.state.traits?.[t]?.levelBonus || 0), 0);
const ledgerHolds = () => (DOC.state.levelPoints.pool + spent()) === (DOC.state.identity.level - 1);

(async () => {
  const app = express();
  app.use(express.json());
  app.use('/api/admin', adminRouter);
  const server = app.listen(0);
  await new Promise(r => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}/api/admin/players/u1`;

  const levelup = (body) => fetch(`${base}/levelup`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  }).then(async r => ({ status: r.status, body: await r.json() }));

  const spend = (trait, delta) => fetch(`${base}/level-spend`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trait, delta }),
  }).then(async r => ({ status: r.status, body: await r.json() }));

  // ── 1. granting moves level AND pool, together ─────────────────────────────
  DOC = { userId: 'u1', state: fresh() };
  let r = await levelup({ delta: 1 });
  eq('grant +1 → ok', r.body.ok, true);
  eq('grant +1 → level 2', DOC.state.identity.level, 2);
  eq('grant +1 → pool 1', DOC.state.levelPoints.pool, 1);
  check('grant +1 → ledger holds', ledgerHolds());

  // the bodyless call still means "grant one" (nothing that used it changes meaning)
  r = await levelup(undefined);
  eq('bodyless call defaults to +1', DOC.state.identity.level, 3);
  eq('bodyless call moved the pool too', DOC.state.levelPoints.pool, 2);

  // ── 2. a multi-level grant ─────────────────────────────────────────────────
  r = await levelup({ delta: 4 });
  eq('grant +4 → level 7', DOC.state.identity.level, 7);
  eq('grant +4 → pool 6', DOC.state.levelPoints.pool, 6);
  check('grant +4 → ledger holds', ledgerHolds());

  // ── 3. the player distributes; the pool drains, the ledger holds ───────────
  await spend('physique', 1);
  await spend('physique', 1);
  await spend('mind', 1);
  eq('three spends → physique +2Lv', DOC.state.traits.physique.levelBonus, 2);
  eq('three spends → mind +1Lv', DOC.state.traits.mind.levelBonus, 1);
  eq('three spends → pool 3', DOC.state.levelPoints.pool, 3);
  eq('three spends → level untouched', DOC.state.identity.level, 7);
  check('three spends → ledger holds', ledgerHolds());

  // a refund is the same move backwards
  await spend('mind', -1);
  eq('refund → mind back to 0', DOC.state.traits.mind.levelBonus, 0);
  eq('refund → pool 4', DOC.state.levelPoints.pool, 4);
  check('refund → ledger holds', ledgerHolds());

  // ── 4. revoking a level with points still unspent just takes one off ───────
  r = await levelup({ delta: -1 });
  eq('revoke with pool spare → level 6', DOC.state.identity.level, 6);
  eq('revoke with pool spare → pool 3', DOC.state.levelPoints.pool, 3);
  check('revoke with pool spare → ledger holds', ledgerHolds());

  // ── 5. THE CASE WORTH READING TWICE — revoke with the pool empty ───────────
  // Drain the pool into traits, then take a level back. The point is already inside
  // a trait, so the pool goes NEGATIVE: a debt the PLAYER clears by choosing which
  // trait gives one up. Picking that trait for them is what this whole design avoids.
  while (DOC.state.levelPoints.pool > 0) await spend('reflexes', 1);
  eq('drained → pool 0', DOC.state.levelPoints.pool, 0);
  r = await levelup({ delta: -1 });
  eq('revoke with empty pool → level drops', DOC.state.identity.level, 5);
  eq('revoke with empty pool → pool is a DEBT', DOC.state.levelPoints.pool, -1);
  check('revoke with empty pool → ledger STILL holds', ledgerHolds());

  // and the debt clears by refunding, from whichever trait the player picks
  await spend('reflexes', -1);
  eq('debt cleared → pool 0', DOC.state.levelPoints.pool, 0);
  check('debt cleared → ledger holds', ledgerHolds());

  // a debt must not be spendable — you cannot invest points you owe
  r = await levelup({ delta: -1 });
  eq('second revoke → pool -1 again', DOC.state.levelPoints.pool, -1);
  r = await spend('charm', 1);
  eq('spending while in debt is refused', r.status, 400);
  eq('spending while in debt leaves the pool alone', DOC.state.levelPoints.pool, -1);
  await spend('reflexes', -1); // settle up

  // ── 6. level 1 is the floor, and `applied` reports what really happened ────
  DOC = { userId: 'u1', state: fresh() };
  r = await levelup({ delta: -1 });
  eq('revoke at Lv 1 → still ok', r.body.ok, true);
  eq('revoke at Lv 1 → applied 0', r.body.applied, 0);
  eq('revoke at Lv 1 → level stays 1', DOC.state.identity.level, 1);
  eq('revoke at Lv 1 → pool untouched', DOC.state.levelPoints.pool, 0);

  r = await levelup({ delta: -5 });
  eq('revoke -5 at Lv 1 → applied 0', r.body.applied, 0);
  eq('revoke -5 at Lv 1 → pool NOT dragged down', DOC.state.levelPoints.pool, 0);

  // clamping must not desync the two halves: Lv 3, ask for -9
  await levelup({ delta: 2 });
  r = await levelup({ delta: -9 });
  eq('over-revoke → clamped to level 1', DOC.state.identity.level, 1);
  eq('over-revoke → applied is the clamped amount', r.body.applied, -2);
  eq('over-revoke → pool moved by applied, not delta', DOC.state.levelPoints.pool, 0);
  check('over-revoke → ledger holds', ledgerHolds());

  // ── 7. bad input is refused rather than silently doing something ───────────
  eq('delta 0 refused', (await levelup({ delta: 0 })).status, 400);
  eq('delta "abc" refused', (await levelup({ delta: 'abc' })).status, 400);
  eq('delta 1.5 refused', (await levelup({ delta: 1.5 })).status, 400);
  eq('unknown trait refused', (await spend('luck', 1)).status, 400);
  eq('delta 2 on a spend refused', (await spend('mind', 2)).status, 400);
  eq('delta 1.5 on a spend refused', (await spend('mind', 1.5)).status, 400);
  eq('refunding an empty trait refused', (await spend('charm', -1)).status, 400);
  eq('bad input left the level alone', DOC.state.identity.level, 1);

  // "delta: 0" must not be readable as "grant one" via the default
  eq('delta 0 did not fall through to +1', DOC.state.identity.level, 1);

  // ── 8. a missing character 404s rather than inventing one ──────────────────
  DOC = null;
  eq('no character → levelup 404', (await levelup({ delta: 1 })).status, 404);
  eq('no character → spend 404', (await spend('mind', 1)).status, 404);

  // ── 9. a sheet that predates levelPoints gets one, not a crash ─────────────
  DOC = { userId: 'u1', state: { identity: { name: 'Legacy' } } };
  await levelup({ delta: 1 });
  eq('legacy sheet → pool created', DOC.state.levelPoints.pool, 1);
  eq('legacy sheet → level created at 2', DOC.state.identity.level, 2);
  DOC = { userId: 'u1', state: {} };
  await levelup({ delta: 1 });
  eq('stateless sheet → identity created', DOC.state.identity.level, 2);

  server.close();
  console.log(`\n${fail === 0 ? '✅' : '❌'} admin level ledger: ${pass} passed, ${fail} failed`);
  process.exit(fail === 0 ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
