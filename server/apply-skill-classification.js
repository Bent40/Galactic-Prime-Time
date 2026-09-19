/**
 * Applies the starting-skill classification (owner ruling 2026-09-19) to the
 * SkillTemplate library: `origin` (basic | compound), `animalOnly`, and — once
 * the field exists on the model — `exclusiveTo`.
 *
 *   node apply-skill-classification.js --check    → validate + print the table.
 *                                                   NO DB, NO node_modules.
 *   node apply-skill-classification.js            → dry run against the DB
 *   node apply-skill-classification.js --apply    → write
 *   node apply-skill-classification.js --file ./seeds/other.js
 *
 * Matching is by name, case-insensitive. Unlike the seeders this NEVER creates a
 * template — it only classifies ones that already exist, and reports both sides
 * of any mismatch, because a skill the file does not know about silently keeps
 * whatever defaults the model gave it (basic + general), which is the permissive
 * answer and therefore the one that must be seen.
 *
 * SEED AGAINST ATLAS, NOT LOCALHOST — MONGODB_URI must be set, or this quietly
 * writes to a local dev DB and reports success. See docs/deploy-render-atlas.md.
 */
const path = require('path');

const apply   = process.argv.includes('--apply');
const fileIdx = process.argv.indexOf('--file');
const seedFile = fileIdx !== -1 ? process.argv[fileIdx + 1] : './seeds/skills-classification.js';

const ORIGINS = ['basic', 'compound'];
// §2.2 + the 2026-09-19 ruling. A Human takes 4 general; an Animal 2 general +
// 2 animal. The pools must be able to FILL those quotas or creation dead-ends.
const QUOTAS = { Human: { general: 4, animal: 0 }, Animal: { general: 2, animal: 2 } };

function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function redactUri(uri) {
  return String(uri).replace(/(mongodb(?:\+srv)?:\/\/[^:@/]+:)[^@]*@/i, '$1****@');
}

/** Content gate — pure, so --check runs on a bare checkout. */
function check(rows) {
  const errs = [];
  const seen = new Map();
  rows.forEach((r, i) => {
    const at = `[${i}] ${r.name || '(unnamed)'}`;
    if (!r.name) errs.push(`${at}: no name`);
    const key = String(r.name || '').toLowerCase();
    if (seen.has(key)) errs.push(`${at}: duplicate of row ${seen.get(key)} — two rows cannot claim one template`);
    else seen.set(key, i);
    if (!ORIGINS.includes(r.origin)) errs.push(`${at}: origin "${r.origin}" is not ${ORIGINS.join(' | ')}`);
    if (typeof r.animalOnly !== 'boolean') errs.push(`${at}: animalOnly must be a boolean`);
    if (r.exclusiveTo === undefined) errs.push(`${at}: exclusiveTo must be present ('' for none)`);
    if (!r.why) errs.push(`${at}: every row states WHY — an unexplained lock is not reviewable`);
    if (!['evidenced', 'proposed'].includes(r.status)) errs.push(`${at}: status must be evidenced | proposed`);
    if ('requirementsFix' in r && !String(r.requirementsFix || '').trim())
      errs.push(`${at}: requirementsFix is present but empty — omit the field instead`);
    // A compound skill nobody can reach is fine; an animal-only compound is not
    // — an Animal's two racial slots cannot be spent on something unpickable.
    if (r.origin === 'compound' && r.animalOnly) errs.push(`${at}: animalOnly + compound — an Animal's racial slot could never be filled with it`);
  });

  // The quota gate: can each race actually fill its picks?
  const general = rows.filter(r => r.origin === 'basic' && !r.animalOnly && !r.exclusiveTo);
  const animal  = rows.filter(r => r.origin === 'basic' &&  r.animalOnly && !r.exclusiveTo);
  for (const [race, q] of Object.entries(QUOTAS)) {
    if (general.length < q.general) errs.push(`${race}: needs ${q.general} general skills, the pool has ${general.length}`);
    if (animal.length  < q.animal)  errs.push(`${race}: needs ${q.animal} animal skills, the pool has ${animal.length}`);
  }
  return { errs, general, animal };
}

function printTable(rows, general, animal) {
  const compound  = rows.filter(r => r.origin === 'compound');
  const exclusive = rows.filter(r => r.exclusiveTo);
  const show = (title, list, note) => {
    console.log(`\n── ${title} (${list.length})${note ? '  ' + note : ''}`);
    for (const r of list) {
      const flag = r.status === 'proposed' ? ' ⚖' : '  ';
      const lock = r.exclusiveTo ? `  →${r.exclusiveTo}` : '';
      console.log(`  ${flag} ${r.name}${lock}`);
    }
  };
  show('GENERAL — a Human picks 4 of these, an Animal 2', general);
  show('ANIMAL-ONLY — an Animal picks 2 of these', animal);
  show('COMPOUND — nobody picks these at creation', compound, '(MERGE or PREREQ; see why)');
  show('CHARACTER-EXCLUSIVE — offered to nobody at creation', exclusive);
  const proposed = rows.filter(r => r.status === 'proposed');
  if (proposed.length) {
    console.log(`\n── ⚖ PROPOSED — MINE, NOT RULED (${proposed.length}). Each needs your call:`);
    for (const r of proposed) console.log(`   • ${r.name}: ${r.why}`);
  }
}

async function run() {
  const rows = require(path.isAbsolute(seedFile) ? seedFile : path.join(__dirname, seedFile));
  const { errs, general, animal } = check(rows);
  if (errs.length) {
    console.error(`Classification gate FAILED — ${errs.length} problem(s):`);
    errs.forEach(e => console.error('  ✗ ' + e));
    process.exit(1);
  }

  if (process.argv.includes('--check')) {
    console.log(`Classification gate passed — ${rows.length} template(s). (No DB touched.)`);
    printTable(rows, general, animal);
    return;
  }

  require('dotenv').config({ path: path.join(__dirname, '.env') });
  const mongoose = require('mongoose');
  const SkillTemplate = require('./models/SkillTemplate');
  const hasExclusive = !!SkillTemplate.schema.path('exclusiveTo');

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/galactic-prime-time';
  await mongoose.connect(uri);
  console.log(`${apply ? '=== APPLY MODE ===' : '=== DRY RUN (pass --apply to write) ==='}  ${redactUri(uri)}`);
  console.log(`Seed file: ${seedFile} — ${rows.length} template(s)`);
  if (!hasExclusive) console.log('⚠️  SkillTemplate has no `exclusiveTo` field yet — those values are REPORTED, never written.\n');

  const fields = ['origin', 'animalOnly', ...(hasExclusive ? ['exclusiveTo'] : [])];
  // A content repair, not a classification — kept separate so it is obvious in the
  // diff that this call is rewriting a template's prose, and only where a row says to.
  const fixes = rows.filter(r => r.requirementsFix);
  if (fixes.length) console.log(`⚠️  ${fixes.length} row(s) also CORRECT the \`requirements\` string: ${fixes.map(r => r.name).join(', ')}\n`);
  let changed = 0, inSync = 0, missing = 0;
  const matched = new Set();
  for (const r of rows) {
    const t = await SkillTemplate.findOne({ name: new RegExp(`^${esc(r.name)}$`, 'i') });
    if (!t) { missing++; console.log(`? NO SUCH TEMPLATE  ${r.name} — in the file, not in the library`); continue; }
    matched.add(String(t.name).toLowerCase());
    const diffs = fields.filter(k => String(t[k] ?? '') !== String(r[k] ?? ''));
    const fixReq = r.requirementsFix && String(t.requirements || '') !== r.requirementsFix;
    if (!diffs.length && !fixReq) { inSync++; continue; }
    changed++;
    const parts = diffs.map(k => `${k}: ${JSON.stringify(t[k] ?? '')} → ${JSON.stringify(r[k])}`);
    if (fixReq) parts.push(`requirements: ${JSON.stringify(t.requirements || '')} → ${JSON.stringify(r.requirementsFix)}`);
    console.log(`~ ${r.name}  ${parts.join(' · ')}`);
    if (apply) {
      diffs.forEach(k => { t[k] = r[k]; });
      if (fixReq) t.requirements = r.requirementsFix;
      await t.save();
    }
  }

  // The permissive default is the dangerous one, so name every template the file
  // does not cover: it stays basic + general and lands in the starting pool.
  const all = await SkillTemplate.find({}, 'name').lean();
  const uncovered = all.filter(t => !matched.has(String(t.name).toLowerCase()));
  if (uncovered.length) {
    console.log(`\n⚠️  ${uncovered.length} template(s) in the library are NOT in the file, so they keep the permissive default (basic + general) and WILL be offered at creation:`);
    uncovered.forEach(t => console.log(`   • ${t.name}`));
  }

  console.log(`\n${changed} ${apply ? 'updated' : 'to update'} · ${inSync} already right · ${missing} not found · ${uncovered.length} uncovered`);
  if (!apply) console.log('Dry run — nothing was written. Run backup-db.js first, then rerun with --apply.');
  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
