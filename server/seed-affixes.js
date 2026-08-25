/**
 * Seeds affixes from a batch module into the affixes collection (the catalog —
 * source of truth per item-drafting-passover ID-0.14).
 *
 * DRY RUN by default: prints every create/diff it would make.
 *   node seed-affixes.js                    → dry run (Higher tier)
 *   node seed-affixes.js --apply            → create missing affixes
 *   node seed-affixes.js --apply --force    → also overwrite existing ones
 *                                             whose seed-managed fields differ
 *   node seed-affixes.js --file ./seeds/affixes-legendary.js   → another batch
 *
 * Matching is by name, case-insensitive. Existing affixes are NEVER touched
 * without --force (owner edits win). Runbook: backup-db.js → dry run → --apply.
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const Affix = require('./models/Affix');

const apply = process.argv.includes('--apply');
const force = process.argv.includes('--force');
const fileIdx = process.argv.indexOf('--file');
const seedFile = fileIdx !== -1 ? process.argv[fileIdx + 1] : './seeds/affixes-higher.js';

function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }


/**
 * The connection string with the password blanked out, for logging.
 * A seed run gets pasted into chat, issues and commit messages routinely — the
 * banner must never be the thing that leaks a live Atlas credential.
 * (Learned the hard way 2026-08-25: a pasted runbook exposed the campaign
 * password and it had to be rotated.)
 */
function redactUri(uri) {
  return String(uri).replace(/(mongodb(?:\+srv)?:\/\/[^:@/]+:)[^@]*@/i, '$1****@');
}

async function run() {
  const seeds = require(seedFile.startsWith('.') ? path.join(__dirname, seedFile) : seedFile);
  if (!Array.isArray(seeds) || seeds.length === 0) throw new Error(`${seedFile} exported no affixes — refusing to run`);
  const dupes = seeds.map(s => s.name.toLowerCase()).filter((n, i, a) => a.indexOf(n) !== i);
  if (dupes.length) throw new Error(`Duplicate names inside the seed file: ${[...new Set(dupes)].join(', ')}`);

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/galactic-prime-time';
  await mongoose.connect(uri);
  console.log(`${apply ? '=== APPLY MODE ===' : '=== DRY RUN (pass --apply to write) ==='}  ${redactUri(uri)}`);
  console.log(`Seed file: ${seedFile} — ${seeds.length} affix(es)\n`);

  let created = 0, inSync = 0, diffed = 0, forced = 0;
  for (const seed of seeds) {
    const existing = await Affix.findOne({ name: new RegExp(`^${esc(seed.name)}$`, 'i') });
    if (!existing) {
      created++;
      console.log(`+ CREATE  [${seed.tier} ${seed.type}]  ${seed.name} — ${seed.effects}`);
      if (apply) await Affix.create(seed);
      continue;
    }
    const diffs = ['type', 'tier', 'effects', 'description'].filter(k => String(existing[k] || '') !== String(seed[k] || ''));
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
