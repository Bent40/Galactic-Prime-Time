/**
 * test-skill-library.js — the starting-skill fields survive the round trip.
 *
 * `origin` and `animalOnly` (owner ruling 2026-09-19) have to be whitelisted in
 * THREE places: create, update, and bulk import. A missing whitelist entry is a
 * silent data loss — the admin UI saves, the server drops the field, and the
 * creation picker shows the wrong pool forever. That exact bug shipped once
 * before (weaknesses landed in the model and never in the route), so it is
 * pinned here.
 *
 * Run: node test-skill-library.js   — no DB; the model and admin-auth are
 * stubbed out of the require cache, the same way test-admin-levels.js does it.
 */
process.env.LOG_TO_FILE = 'false';
const express = require('express');

const TPL_PATH = require.resolve('./models/SkillTemplate');
const AUTH_PATH = require.resolve('./middleware/adminAuth');

let SAVED = [];
const clone = (o) => JSON.parse(JSON.stringify(o));
// Stands in for the mongoose model and applies the schema's own defaults, so the
// test sees what the database would actually hold.
const withDefaults = (doc) => ({
  origin: 'basic', animalOnly: false, capacity: 5, keywords: [], levelEffects: {},
  ...clone(doc), _id: 'id' + (SAVED.length + 1),
});
const FakeTemplate = {
  create: async (doc) => { const d = withDefaults(doc); SAVED.push(d); return d; },
  find: () => ({ sort: () => ({ lean: async () => clone(SAVED) }) }),
  findByIdAndUpdate: async (_id, doc) => { const d = withDefaults(doc); SAVED.push(d); return d; },
  findByIdAndDelete: async () => ({}),
};
require.cache[TPL_PATH] = { id: TPL_PATH, filename: TPL_PATH, loaded: true, exports: FakeTemplate };
require.cache[AUTH_PATH] = { id: AUTH_PATH, filename: AUTH_PATH, loaded: true, exports: (req, res, next) => next() };

const adminRouter = require('./routes/admin');

let pass = 0, fail = 0;
const eq = (label, got, want) => {
  if (JSON.stringify(got) === JSON.stringify(want)) pass++;
  else { fail++; console.log('  x ' + label + ' - got ' + JSON.stringify(got) + ', want ' + JSON.stringify(want)); }
};

(async () => {
  const app = express();
  app.use(express.json());
  app.use('/api/admin', adminRouter);
  const server = app.listen(0);
  await new Promise(r => server.once('listening', r));
  const base = 'http://127.0.0.1:' + server.address().port + '/api/admin/skill-library';
  const send = (url, body, method) => fetch(url, {
    method: method || 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  }).then(async r => ({ status: r.status, body: await r.json() }));
  const last = () => SAVED[SAVED.length - 1];

  // -- create ---------------------------------------------------------------
  SAVED = [];
  await send(base, { name: 'Swim', animalOnly: true, origin: 'basic' });
  eq('create keeps animalOnly', last().animalOnly, true);
  eq('create keeps origin basic', last().origin, 'basic');

  await send(base, { name: 'Iron Stance', origin: 'compound' });
  eq('create keeps origin compound', last().origin, 'compound');
  eq('a compound is not animal by accident', last().animalOnly, false);

  await send(base, { name: 'Brace' });
  eq('an unstated origin defaults to basic', last().origin, 'basic');
  eq('an unstated animalOnly defaults to false', last().animalOnly, false);

  // A junk origin must never reach the enum - it would throw on a real save.
  await send(base, { name: 'Junk', origin: 'legendary' });
  eq('an unknown origin is coerced to basic, never passed through', last().origin, 'basic');
  await send(base, { name: 'Truthy', animalOnly: 'yes' });
  eq('a truthy animalOnly is coerced to a real boolean', last().animalOnly, true);

  // -- update ---------------------------------------------------------------
  await send(base + '/id1', { name: 'Swim', animalOnly: true, origin: 'basic' }, 'PUT');
  eq('update keeps animalOnly', last().animalOnly, true);
  await send(base + '/id1', { name: 'Swim', animalOnly: false, origin: 'compound' }, 'PUT');
  eq('update can turn animalOnly OFF again', last().animalOnly, false);
  eq('update can promote to compound', last().origin, 'compound');
  await send(base + '/id1', { name: 'Swim' }, 'PUT');
  eq('an update that omits them resets to the defaults', [last().origin, last().animalOnly], ['basic', false]);

  // -- bulk import ----------------------------------------------------------
  SAVED = [];
  const r = await send(base + '/bulk', { skills: [
    { name: 'Pounce', animalOnly: true },
    { name: 'Feint' },
    { name: 'Death Grip Jaws', animalOnly: true, origin: 'compound' },
  ] });
  eq('bulk imports all three', r.body.added, 3);
  eq('bulk keeps animalOnly', SAVED.map(s => s.animalOnly), [true, false, true]);
  eq('bulk keeps origin', SAVED.map(s => s.origin), ['basic', 'basic', 'compound']);

  // -- the projection the creation picker reads ------------------------------
  const charSrc = require('fs').readFileSync(require.resolve('./routes/character.js'), 'utf8');
  const proj = (charSrc.match(/'name momentCost[^']*'/) || [''])[0];
  eq('GET /api/character/skills projects origin', proj.includes('origin'), true);
  eq('GET /api/character/skills projects animalOnly', proj.includes('animalOnly'), true);

  server.close();
  console.log('\n' + (fail === 0 ? 'OK' : 'FAILED') + ' skill library fields: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail === 0 ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
