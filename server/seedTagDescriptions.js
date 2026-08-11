/**
 * Backfills Tag.description from the rulebook's Appendix C (Tag Compendium).
 *
 * DRY RUN by default: prints what it would write.
 *   node seedTagDescriptions.js            → dry run
 *   node seedTagDescriptions.js --apply    → write empty descriptions only
 *   node seedTagDescriptions.js --apply --force → overwrite non-empty ones too
 *
 * Source of truth: ../rulebook/gpt-system-v1.0.md, the "Tag Compendium" section
 * (entries of the form "- **Name** — Description"). Matches DB tags by name,
 * case-insensitive.
 */
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const Tag = require('./models/Tag');

function parseCompendium() {
  const book = fs.readFileSync(path.join(__dirname, '..', 'rulebook', 'gpt-system-v1.0.md'), 'utf8');
  const idx = book.indexOf('The Tag Compendium');
  if (idx === -1) throw new Error('Tag Compendium section not found in the rulebook');
  // bound the scan to the compendium section (stop at the next chapter heading)
  const end = book.indexOf('\n## ', idx);
  const section = end === -1 ? book.slice(idx) : book.slice(idx, end);
  const entries = new Map();
  // split tolerates CRLF checkouts (Windows autocrlf) — a trailing \r broke the match
  for (const line of section.split(/\r?\n/)) {
    const m = line.match(/^- \*\*(.+?)\*\* — (.+)$/);
    if (m) entries.set(m[1].trim().toLowerCase(), { name: m[1].trim(), description: m[2].trim() });
  }
  return entries;
}

async function run() {
  const apply = process.argv.includes('--apply');
  const force = process.argv.includes('--force');
  const entries = parseCompendium();
  console.log(`Parsed ${entries.size} tag descriptions from the rulebook`);
  if (entries.size === 0) throw new Error('Parsed 0 entries — refusing to run. Is rulebook/gpt-system-v0.92.md intact?');

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/galactic-prime-time';
  await mongoose.connect(uri);
  console.log(`${apply ? '=== APPLY MODE ===' : '=== DRY RUN (pass --apply to write) ==='}  ${uri}\n`);

  const tags = await Tag.find();
  console.log(`Found ${tags.length} tag row(s) in the database`);
  if (tags.length === 0) {
    console.log('→ The tags collection is EMPTY. Run `node seedTags.js` first to create the 100 tag rows, then rerun this.');
  }
  const matchedNames = new Set();
  let updated = 0, skipped = 0, unmatched = 0;

  for (const tag of tags) {
    const entry = entries.get(tag.name.trim().toLowerCase());
    if (!entry) {
      unmatched++;
      console.warn(`⚠ DB tag "${tag.name}" has no rulebook entry`);
      continue;
    }
    matchedNames.add(tag.name.trim().toLowerCase());
    if (tag.description && !force) {
      skipped++;
      continue;
    }
    updated++;
    console.log(`"${tag.name}" ← ${entry.description.slice(0, 70)}${entry.description.length > 70 ? '…' : ''}`);
    if (apply) { tag.description = entry.description; await tag.save(); }
  }

  const missing = [...entries.values()].filter(e => !matchedNames.has(e.name.toLowerCase()));
  if (missing.length) {
    console.log(`\n${missing.length} rulebook tag(s) with no DB row (create them in the admin panel if wanted):`);
    console.log('  ' + missing.map(e => e.name).join(' · '));
  }

  console.log(`\n${updated} description(s) ${apply ? 'written' : 'would be written'} · ${skipped} already set (use --force to overwrite) · ${unmatched} DB tags unmatched`);
  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
