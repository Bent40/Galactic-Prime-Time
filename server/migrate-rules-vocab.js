/**
 * B-2 vocabulary migration — rulebook v0.92 taxonomy (2026-07-23).
 *
 * DRY RUN by default: prints every change it would make and writes nothing.
 * Run for real with:   node migrate-rules-vocab.js --apply
 * BACK UP FIRST:       mongodump --db galactic-prime-time
 *
 * What it does:
 *  1. Damage types (item templates + every item copy in character inventories):
 *       Toxic → Poison · Psy → Dissolution · Shock → Burn
 *     (Bleed/Crush/Burn/Chill/Poison/Infection/Dissolution are already canon.)
 *  2. Races (identity.race → book canon + species):
 *       Sea Lion → Animal (species "Sea Lion") · AI → Robot / AI (species "AI")
 *       plus defensive mappings for the old sci-fi list; an existing species
 *       value is never overwritten. Unknown races are warned, never guessed.
 */
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const ItemTemplate = require('./models/ItemTemplate');
const Character = require('./models/Character');

const DMG_MAP = { Toxic: 'Poison', Psy: 'Dissolution', Shock: 'Burn' };
const CANON_DMG = ['Bleed', 'Crush', 'Burn', 'Chill', 'Poison', 'Infection', 'Dissolution'];

const VALID_RACES = ['Human', 'Animal', 'Robot / AI'];
const RACE_MAP = {
  'Sea Lion':  { race: 'Animal',     species: 'Sea Lion' },
  'AI':        { race: 'Robot / AI', species: 'AI' },
  'Cyborg':    { race: 'Robot / AI', species: 'Cyborg' },
  'Android':   { race: 'Robot / AI', species: 'Android' },
  'Synthetic': { race: 'Robot / AI', species: 'Synthetic' },
  'Clone':     { race: 'Human',      species: 'Clone' },
  'Mutant':    { race: 'Human',      species: 'Mutant' },
};

function mapDamage(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return { changed: false, next: arr };
  const next = [];
  let changed = false;
  for (const v of arr) {
    const mapped = DMG_MAP[v] || v;
    if (mapped !== v) changed = true;
    if (!CANON_DMG.includes(mapped)) {
      console.warn(`  ⚠ non-canonical damage type "${v}" left as-is`);
      next.push(v);
      continue;
    }
    if (!next.includes(mapped)) next.push(mapped);
  }
  return { changed, next };
}

async function run() {
  const apply = process.argv.includes('--apply');
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/galactic-prime-time';
  await mongoose.connect(uri);
  console.log(`${apply ? '=== APPLY MODE ===' : '=== DRY RUN (pass --apply to write) ==='}  ${uri}\n`);
  let changes = 0;
  const seen = {};
  const tally = arr => { for (const v of arr || []) seen[v] = (seen[v] || 0) + 1; };
  let tplCount = 0, invCount = 0, charCount = 0;

  for (const tpl of await ItemTemplate.find()) {
    tplCount++;
    tally(tpl.damageType);
    const { changed, next } = mapDamage(tpl.damageType || []);
    if (changed) {
      changes++;
      console.log(`template "${tpl.name}": [${(tpl.damageType || []).join(', ')}] → [${next.join(', ')}]`);
      if (apply) { tpl.damageType = next; await tpl.save(); }
    }
  }

  for (const ch of await Character.find()) {
    charCount++;
    const st = ch.state || {};
    const who = st.identity?.name || ch.userId;
    let dirty = false;

    for (const cat of st.inventory?.categories || []) {
      for (const it of cat.items || []) {
        invCount++;
        tally(it.damageType);
        const { changed, next } = mapDamage(it.damageType || []);
        if (changed) {
          changes++; dirty = true;
          console.log(`${who}: item "${it.name}": [${(it.damageType || []).join(', ')}] → [${next.join(', ')}]`);
          it.damageType = next;
        }
      }
    }

    const race = st.identity?.race;
    if (race && !VALID_RACES.includes(race)) {
      const m = RACE_MAP[race];
      if (m) {
        changes++; dirty = true;
        const species = st.identity.species || m.species;
        console.log(`${who}: race "${race}" → "${m.race}" (species "${species}")`);
        st.identity.race = m.race;
        if (!st.identity.species) st.identity.species = m.species;
      } else {
        console.warn(`${who}: ⚠ unknown race "${race}" — left untouched, set it by hand`);
      }
    }

    if (dirty && apply) {
      ch.state = st;
      ch.markModified('state');
      await ch.save();
    }
  }

  console.log(`\nScanned ${tplCount} template(s), ${charCount} character(s), ${invCount} inventory item(s).`);
  console.log(`Damage-type values in this database: ${Object.keys(seen).length ? JSON.stringify(seen) : '(none)'}`);
  console.log(`${changes} change(s) ${apply ? 'APPLIED' : 'found — dry run, nothing written'}`);
  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
