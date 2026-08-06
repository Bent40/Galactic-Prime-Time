/**
 * Batch D — the two ruled affix-catalog edits (passover residuals R4/R5,
 * approved 2026-08-04):
 *   R4: Draining gets its once-per-Clock-per-target cap written into the
 *       effects text (the condition-fishing abuse case is documented).
 *   R5: Balanced and Sharpened II are ruled incompatible — noted on both.
 *
 * DRY RUN by default: prints what it would write.
 *   node repair-affixes.js            → dry run
 *   node repair-affixes.js --apply    → write
 *
 * Matches by name; skips affixes already carrying the text (idempotent).
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const Affix = require('./models/Affix');

const EDITS = [
  { name: 'Draining', field: 'effects',
    append: ' (once per Clock per target)' },
  { name: 'Balanced', field: 'description',
    append: ' Incompatible with Sharpened II.' },
  { name: 'Sharpened II', field: 'description',
    append: ' Incompatible with Balanced.' },
];

async function run() {
  const apply = process.argv.includes('--apply');
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/galactic-prime-time';
  await mongoose.connect(uri);
  console.log(`${apply ? '=== APPLY MODE ===' : '=== DRY RUN (pass --apply to write) ==='}  ${uri}\n`);

  let updated = 0, skipped = 0, missing = 0;
  for (const e of EDITS) {
    const affix = await Affix.findOne({ name: new RegExp(`^${e.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') });
    if (!affix) { missing++; console.warn(`⚠ affix "${e.name}" not found in the catalog`); continue; }
    const current = affix[e.field] || '';
    if (current.includes(e.append.trim())) { skipped++; console.log(`= "${e.name}" already carries the edit`); continue; }
    updated++;
    console.log(`~ "${e.name}".${e.field}  +=  "${e.append.trim()}"`);
    if (apply) { affix[e.field] = current + e.append; await affix.save(); }
  }
  console.log(`\n${updated} ${apply ? 'written' : 'to write'} · ${skipped} already done · ${missing} missing`);
  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
