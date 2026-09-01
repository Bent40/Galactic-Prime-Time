/**
 * Seeds Marks into the tag catalog. A Mark is a tag with kind: 'mark'
 * (rulebook §18.4) — it records a deed, never fades, and cannot be shed.
 *
 * DRY RUN by default: prints every create/diff it would make.
 *   node seed-marks.js                    → dry run
 *   node seed-marks.js --apply            → create missing marks
 *   node seed-marks.js --apply --force    → also overwrite existing ones
 *                                           whose seed-managed fields differ
 *   node seed-marks.js --file ./seeds/marks-set2.js   → another batch
 *
 * Matching is by name, case-insensitive. Existing entries are NEVER touched
 * without --force (owner edits win). Runbook: backup-db.js → dry run → --apply.
 *
 * SEED AGAINST ATLAS, NOT LOCALHOST — MONGODB_URI must be set, or this quietly
 * writes to a local dev DB and reports success. See docs/deploy-render-atlas.md.
 */
const path = require('path');
// dotenv/mongoose are required lazily, inside run(), so that --check works on a
// bare checkout with no node_modules: the §18.4 gate is pure content math.

const apply = process.argv.includes('--apply');
const force = process.argv.includes('--force');
const fileIdx = process.argv.indexOf('--file');
const seedFile = fileIdx !== -1 ? process.argv[fileIdx + 1] : './seeds/marks.js';

const FIELDS = ['kind', 'description', 'conditions', 'activeNear', 'effect'];

function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

/** The connection string with the password blanked out, for logging. */
function redactUri(uri) {
  return String(uri).replace(/(mongodb(?:\+srv)?:\/\/[^:@/]+:)[^@]*@/i, '$1****@');
}

/**
 * §18.4 gate — refuse to seed data that is not actually a Mark. A Mark that
 * seeds as an ordinary tag would silently acquire a lifecycle and become
 * sheddable, which is the one thing the mechanic exists to prevent.
 */
function check(seeds) {
  const errs = [];
  seeds.forEach((s, i) => {
    const at = `[${i}] ${s.name || '(unnamed)'}`;
    if (!s.name) errs.push(`${at}: no name`);
    if (s.kind !== 'mark') errs.push(`${at}: kind is "${s.kind}", must be "mark"`);
    if (!s.activeNear) errs.push(`${at}: no activeNear — a Mark needs a presence trigger (§18.4)`);
    if (!s.conditions) errs.push(`${at}: no conditions — the deed that grants it must be written down`);
  });
  return errs;
}

async function run() {
  const seeds = require(seedFile.startsWith('.') ? path.join(__dirname, seedFile) : seedFile);
  if (!Array.isArray(seeds) || seeds.length === 0) throw new Error(`${seedFile} exported no marks — refusing to run`);
  const dupes = seeds.map(s => String(s.name).toLowerCase()).filter((n, i, a) => a.indexOf(n) !== i);
  if (dupes.length) throw new Error(`Duplicate names inside the seed file: ${[...new Set(dupes)].join(', ')}`);

  const errs = check(seeds);
  if (errs.length) {
    console.error(`§18.4 gate FAILED — ${errs.length} problem(s):`);
    errs.forEach(e => console.error(`  ✗ ${e}`));
    process.exit(1);
  }
  if (process.argv.includes('--check')) {
    console.log(`§18.4 gate passed — ${seeds.length} mark(s) OK. (No DB touched.)`);
    return;
  }

  require('dotenv').config({ path: path.join(__dirname, '.env') });
  const mongoose = require('mongoose');
  const Tag = require('./models/Tag');

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/galactic-prime-time';
  await mongoose.connect(uri);
  console.log(`${apply ? '=== APPLY MODE ===' : '=== DRY RUN (pass --apply to write) ==='}  ${redactUri(uri)}`);
  console.log(`Seed file: ${seedFile} — ${seeds.length} mark(s)\n`);

  let created = 0, inSync = 0, diffed = 0, forced = 0;
  for (const seed of seeds) {
    const existing = await Tag.findOne({ name: new RegExp(`^${esc(seed.name)}$`, 'i') });
    if (!existing) {
      created++;
      console.log(`+ CREATE  ${seed.name} — stirs near: ${seed.activeNear}`);
      if (apply) await Tag.create(seed);
      continue;
    }
    const diffs = FIELDS.filter(k => String(existing[k] || '') !== String(seed[k] || ''));
    if (diffs.length === 0) { inSync++; continue; }
    if (force) {
      forced++;
      console.log(`~ FORCE   ${seed.name}  (overwriting: ${diffs.join(', ')})`);
      if (apply) { diffs.forEach(k => { existing[k] = seed[k]; }); await existing.save(); }
    } else {
      diffed++;
      console.log(`! EXISTS  ${seed.name} — differs on ${diffs.join(', ')} (kept as-is; --force to overwrite)`);
    }
  }
  console.log(`\n${created} ${apply ? 'created' : 'to create'} · ${inSync} in sync · ${forced} force-updated · ${diffed} left untouched`);
  if (!apply) console.log('Dry run — nothing was written. Run backup-db.js first, then rerun with --apply.');
  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
