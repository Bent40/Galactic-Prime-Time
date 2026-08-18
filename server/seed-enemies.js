/**
 * Seeds enemies from a batch module into the enemies collection.
 *
 * DRY RUN by default: prints every create/diff it would make.
 *   node seed-enemies.js                    → dry run (Floor 1 roster)
 *   node seed-enemies.js --apply            → create missing enemies
 *   node seed-enemies.js --apply --force    → also overwrite existing ones
 *                                             whose seed-managed fields differ
 *   node seed-enemies.js --file ./seeds/enemies-f2.js          → another batch
 *   node seed-enemies.js --check            → doctrine check only, no DB
 *
 * Matching is by name, case-insensitive. Existing enemies are NEVER touched
 * without --force (owner edits win). Runbook: backup-db.js → dry run → --apply.
 *
 * Before touching the DB this refuses to run unless every entry matches the
 * §21.2 part-budget doctrine for its rank (rulebook/f1-enemy-pass.md E-0.1/E-0.2):
 * a wrong number is a content bug, and it should never reach the campaign DB.
 */
const path = require('path');
// dotenv/mongoose are required lazily, inside run(), so that --check works on a
// bare checkout with no node_modules: the doctrine gate is pure content math.

const apply     = process.argv.includes('--apply');
const force     = process.argv.includes('--force');
const checkOnly = process.argv.includes('--check');
const fileIdx   = process.argv.indexOf('--file');
const seedFile  = fileIdx !== -1 ? process.argv[fileIdx + 1] : './seeds/enemies-f1.js';

// §21.2 part budgets, in BAND UNITS (§12.7 errata 2026-08-18: the material band is
// floor-relative and cancels inside a floor, so these numbers are the same on EVERY
// floor — an F2 roster checks against the same 5/60/125/300 an F1 roster does).
// --floor is only for reading a roster written in ABSOLUTE terms; leave it alone for
// anything authored in band units, which is everything.
const FLOOR_MOB_HP = { 1: 5, 2: 10, 3: 20, 4: 40, 5: 80, 6: 160, 7: 320, 8: 640, 9: 1280 };
const RANK_RATIO   = { mob: 1, elite: 12, boss: 25, legendary: 60 };

// ONLY MOBS ARE EXACT. Owner ruling 2026-08-18: "the only one we can decisively say
// always dies in one meaningful shot is mobs" — elites and above should DIFFER from
// one another, so §21.2's ratios are a centre with a tolerance band, not a law.
// The gate exists to catch gross errors, not to flatten the roster.
const TOLERANCE = { elite: [0.5, 2.0], boss: [0.5, 2.0], legendary: [0.5, 2.0] };
// §7.1 — every combatant has a size, and §13 reads it for grapple legality.
const SIZES = ['Small', 'Medium', 'Large', 'Huge'];
const floorIdx = process.argv.indexOf('--floor');
const floor    = floorIdx !== -1 ? Number(process.argv[floorIdx + 1]) : 1;

const partsSum  = (e) => (e.bodyParts || []).reduce((a, p) => a + (p.maxHp || 0), 0);
const normParts = (a) => JSON.stringify((a || []).map(p => ({ name: p.name, maxHp: p.maxHp })));
const normPhase = (a) => JSON.stringify((a || []).map(p => ({ name: p.name, description: p.description, hpThreshold: p.hpThreshold })));

/**
 * Seed-managed fields that differ between an existing doc and its seed.
 * Arrays are compared on their meaningful shape only, so Mongoose subdocument
 * bookkeeping never reads as a difference. Exported for testing without a DB.
 */
function diffFields(existing, seed) {
  const diffs = ['tier', 'size', 'color', 'description', 'notes']
    .filter(k => String(existing[k] || '') !== String(seed[k] || ''));
  if (normParts(existing.bodyParts) !== normParts(seed.bodyParts)) diffs.push('bodyParts');
  if (normPhase(existing.phases)    !== normPhase(seed.phases))    diffs.push('phases');
  return diffs;
}

function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

/** Doctrine gate — runs before any connection. Returns the report lines. */
function doctrineCheck(seeds, atFloor = floor) {
  const mobHp = FLOOR_MOB_HP[atFloor];
  if (!mobHp) throw new Error(`--floor ${atFloor} has no mob-HP entry (F1–F9 only)`);
  const problems = [];
  for (const e of seeds) {
    const ratio = RANK_RATIO[e.tier];
    if (!ratio) { problems.push(`${e.name}: unknown tier "${e.tier}" (mob|elite|boss|legendary)`); continue; }
    const want = mobHp * ratio, got = partsSum(e);
    const tol = TOLERANCE[e.tier];
    if (!tol) {
      // Mobs are exact: one meaningful hit, every time, on every floor.
      if (got !== want) problems.push(`${e.name}: mob part budget ${got}, doctrine wants exactly ${want} (F${atFloor})`);
    } else {
      const [lo, hi] = [Math.round(want * tol[0]), Math.round(want * tol[1])];
      if (got < lo || got > hi) {
        problems.push(`${e.name}: ${e.tier} part budget ${got} is outside ${lo}–${hi} ` +
                      `(§21.2 centre ${want} ±tolerance, F${atFloor})`);
      }
    }
    if (e.tier === 'mob' && (e.bodyParts || []).length !== 1) {
      problems.push(`${e.name}: mobs are ONE part (E-0.2), found ${(e.bodyParts || []).length}`);
    }
    if (e.tier !== 'mob' && (e.bodyParts || []).length < 2) {
      problems.push(`${e.name}: elite and above are MULTI-part (E-0.2), found ${(e.bodyParts || []).length}`);
    }
    if (e.tier !== 'mob' && !(e.notes || '').trim()) {
      problems.push(`${e.name}: ${e.tier} with no notes — every non-mob names its weak system (E-0.3)`);
    }
    if (!SIZES.includes(e.size)) {
      problems.push(`${e.name}: size "${e.size}" is not one of ${SIZES.join('|')} (§7.1)`);
    }
  }
  return problems;
}

async function run() {
  const seeds = require(seedFile.startsWith('.') ? path.join(__dirname, seedFile) : seedFile);
  if (!Array.isArray(seeds) || seeds.length === 0) throw new Error(`${seedFile} exported no enemies — refusing to run`);
  const dupes = seeds.map(s => s.name.toLowerCase()).filter((n, i, a) => a.indexOf(n) !== i);
  if (dupes.length) throw new Error(`Duplicate names inside the seed file: ${[...new Set(dupes)].join(', ')}`);

  const problems = doctrineCheck(seeds);
  if (problems.length) {
    console.error(`\n§21.2 doctrine check FAILED — ${problems.length} problem(s):`);
    problems.forEach(p => console.error(`  ✗ ${p}`));
    console.error('\nRefusing to run. Fix the seed file or pass the right --floor.');
    process.exit(1);
  }
  const m = FLOOR_MOB_HP[floor];
  const scale = floor === 1
    ? 'BAND UNITS (floor-invariant — §12.7 errata)'
    : `ABSOLUTE terms at floor ${floor}`;
  console.log(`§21.2 doctrine check PASSED — ${seeds.length} entries, ${scale}: ` +
              `mob ${m} exact · elite ~${m * 12} · boss ~${m * 25} · super ~${m * 60}, ±tolerance.`);
  const spread = seeds.filter(e => e.tier !== 'mob').map(e => `${e.name} ${partsSum(e)}`).join(' · ');
  if (spread) console.log(`Non-mob spread: ${spread}`);
  if (checkOnly) { console.log('--check: doctrine only, no DB touched.'); return; }

  require('dotenv').config({ path: path.join(__dirname, '.env') });
  const mongoose = require('mongoose');
  const Enemy = require('./models/Enemy');

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/galactic-prime-time';
  await mongoose.connect(uri);
  console.log(`${apply ? '=== APPLY MODE ===' : '=== DRY RUN (pass --apply to write) ==='}  ${uri}`);
  console.log(`Seed file: ${seedFile} — ${seeds.length} enem(y/ies)\n`);

  let created = 0, inSync = 0, diffed = 0, forced = 0;
  for (const seed of seeds) {
    const existing = await Enemy.findOne({ name: new RegExp(`^${esc(seed.name)}$`, 'i') });
    if (!existing) {
      created++;
      console.log(`+ CREATE  [${seed.tier}/${seed.size}]  ${seed.name} — ${partsSum(seed)} HP across ${seed.bodyParts.length} part(s)` +
                  `${seed.phases.length ? `, ${seed.phases.length} phase(s)` : ''}`);
      if (apply) await Enemy.create(seed);
      continue;
    }
    const diffs = diffFields(existing, seed);
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

module.exports = { doctrineCheck, diffFields, partsSum, FLOOR_MOB_HP, RANK_RATIO, SIZES, TOLERANCE };

if (require.main === module) run().catch(e => { console.error(e); process.exit(1); });
