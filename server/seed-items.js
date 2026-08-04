/**
 * Seeds item templates from a batch module into the itemtemplates collection.
 *
 * DRY RUN by default: prints every create/diff it would make.
 *   node seed-items.js                     → dry run (Batch A)
 *   node seed-items.js --apply             → create missing templates
 *   node seed-items.js --apply --force     → also overwrite existing templates
 *                                            whose seed-managed fields differ
 *   node seed-items.js --file ./seeds/items-batch-b.js   → another batch
 *
 * Matching is by name, case-insensitive. Existing templates are NEVER touched
 * without --force (the library may carry owner edits — those win by default).
 * Only the fields a seed entry defines are compared/written; anything else on
 * the doc is left alone. This script never reads or writes the characters
 * collection — player-held items are snapshots and stay as they are.
 * Runbook: node backup-db.js → dry run → --apply  (rulebook/item-drafting-passover.md ID-5)
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const ItemTemplate = require('./models/ItemTemplate');

const apply = process.argv.includes('--apply');
const force = process.argv.includes('--force');
const fileIdx = process.argv.indexOf('--file');
const seedFile = fileIdx !== -1 ? process.argv[fileIdx + 1] : './seeds/items-batch-a.js';

function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

// Normalize a value for comparison so seed shorthand matches stored shape.
function norm(v) {
  if (Array.isArray(v)) return JSON.stringify(v.map(x => String(x).trim()).filter(Boolean));
  if (v && typeof v === 'object') return JSON.stringify(v);
  if (v == null) return '';
  return String(v);
}

async function run() {
  const seeds = require(seedFile.startsWith('.') ? path.join(__dirname, seedFile) : seedFile);
  if (!Array.isArray(seeds) || seeds.length === 0) throw new Error(`${seedFile} exported no items — refusing to run`);
  const dupes = seeds.map(s => s.name.toLowerCase()).filter((n, i, a) => a.indexOf(n) !== i);
  if (dupes.length) throw new Error(`Duplicate names inside the seed file: ${[...new Set(dupes)].join(', ')}`);

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/galactic-prime-time';
  await mongoose.connect(uri);
  console.log(`${apply ? '=== APPLY MODE ===' : '=== DRY RUN (pass --apply to write) ==='}  ${uri}`);
  console.log(`Seed file: ${seedFile} — ${seeds.length} template(s)\n`);

  let created = 0, inSync = 0, diffed = 0, forced = 0;
  for (const seed of seeds) {
    const existing = await ItemTemplate.findOne({ name: new RegExp(`^${esc(seed.name)}$`, 'i') });

    if (!existing) {
      created++;
      console.log(`+ CREATE  ${seed.icon || ''} ${seed.name}  [${seed.tier || '—'} ${seed.subtype || seed.category}]`);
      if (apply) await ItemTemplate.create(seed);
      continue;
    }

    const diffs = Object.keys(seed)
      .filter(k => k !== 'name')
      .filter(k => norm(existing[k]) !== norm(seed[k]));

    if (diffs.length === 0) { inSync++; continue; }

    if (force) {
      forced++;
      console.log(`~ FORCE   ${seed.name}  (overwriting: ${diffs.join(', ')})`);
      if (apply) { diffs.forEach(k => { existing[k] = seed[k]; }); await existing.save(); }
    } else {
      diffed++;
      console.log(`! EXISTS  ${seed.name} — differs on ${diffs.join(', ')} (kept as-is; --force to overwrite)`);
      diffs.forEach(k => console.log(`     db:   ${k} = ${norm(existing[k]) || '(empty)'}\n     seed: ${k} = ${norm(seed[k])}`));
    }
  }

  console.log(`\n${created} ${apply ? 'created' : 'to create'} · ${inSync} already in sync · ${forced} force-updated · ${diffed} existing left untouched`);
  if (!apply) console.log('Dry run — nothing was written. Run backup-db.js first, then rerun with --apply.');
  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
