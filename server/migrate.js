/**
 * One-time migration: reshape existing character documents to the new schema.
 *
 * Changes made:
 *  1. Skills: replace full snapshot objects with reference instances
 *             { id, templateId, level, capacity, traitCosts }
 *             Skills with no matching template are kept as legacy inline records.
 *
 *  2. Traits: consolidate three flat objects (traits, traitBonus, traitLevelBonus)
 *             into one nested object { physique: { base, bonus, levelBonus }, ... }
 *
 * Run with:  node server/migrate.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Character = require('./models/Character');
const SkillTemplate = require('./models/SkillTemplate');

const TRAIT_KEYS = ['physique', 'reflexes', 'mind', 'charm'];

async function migrate() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/galactic-prime-time';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB:', uri);

  // Build a name → template map for skill matching
  const templates = await SkillTemplate.find().lean();
  const tplByName = {};
  templates.forEach(t => { tplByName[t.name.toLowerCase().trim()] = t; });
  console.log(`Loaded ${templates.length} skill templates`);

  const characters = await Character.find().lean();
  console.log(`Found ${characters.length} character document(s) to inspect`);

  let migratedCount = 0;

  for (const char of characters) {
    const state = char.state ? JSON.parse(JSON.stringify(char.state)) : {};
    let changed = false;

    // ─── 1. Skills ────────────────────────────────────────────────────────────
    if (Array.isArray(state.skills)) {
      state.skills = state.skills.map(sk => {
        // Already a reference instance — skip
        if (sk.templateId) return sk;

        const tpl = tplByName[(sk.name || '').toLowerCase().trim()];
        changed = true;

        if (tpl) {
          return {
            id: sk.id,
            templateId: String(tpl._id),
            level: sk.level || 0,
            capacity: sk.capacity ?? (tpl.capacity || 5),
            traitCosts: sk.traitCosts || [],
          };
        }

        // No matching template — keep as legacy inline skill
        console.log(`  [warn] No template found for skill "${sk.name}" (userId ${char.userId}) — kept as legacy`);
        return {
          id: sk.id,
          name: sk.name || '',
          momentCost: sk.momentCost || '',
          stats: sk.stats || [],
          passive: !!sk.passive,
          capacity: sk.capacity || 5,
          level: sk.level || 0,
          requirements: sk.requirements || '',
          range: sk.range || '',
          target: sk.target || '',
          effect: sk.effect || '',
          description: sk.description || '',
          levelEffects: sk.levelEffects || {},
          traitCosts: sk.traitCosts || [],
        };
      });
    }

    // ─── 2. Traits ────────────────────────────────────────────────────────────
    const firstTraitVal = state.traits ? Object.values(state.traits)[0] : undefined;
    const needsTraitMigration = firstTraitVal !== undefined &&
      (typeof firstTraitVal !== 'object' || Array.isArray(firstTraitVal));

    if (needsTraitMigration) {
      const oldTraits = state.traits || {};
      const oldBonus = state.traitBonus || {};
      const oldLevelBonus = state.traitLevelBonus || {};
      const newTraits = {};
      for (const t of TRAIT_KEYS) {
        newTraits[t] = {
          base: oldTraits[t] || 0,
          bonus: oldBonus[t] || 0,
          levelBonus: oldLevelBonus[t] || 0,
        };
      }
      state.traits = newTraits;
      delete state.traitBonus;
      delete state.traitLevelBonus;
      changed = true;
    } else if (state.traitBonus || state.traitLevelBonus) {
      // Traits already in new format but legacy fields still present — clean up
      delete state.traitBonus;
      delete state.traitLevelBonus;
      changed = true;
    }

    // ─── 3. levelPoints ──────────────────────────────────────────────────────
    const lp = state.levelPoints || {};
    if (lp.body !== undefined || lp.core !== undefined) {
      state.levelPoints = { pool: (lp.pool || 0) + (lp.body || 0) + (lp.core || 0) };
      changed = true;
    }

    if (changed) {
      await Character.findByIdAndUpdate(char._id, { state });
      migratedCount++;
      console.log(`  Migrated userId=${char.userId}`);
    }
  }

  console.log(`\nDone. Migrated ${migratedCount} / ${characters.length} character(s).`);

  // ─── Fix malformed SkillTemplate stats ────────────────────────────────────
  // Catches entries like ["physique, mind"] that should be ["physique", "mind"]
  console.log('\nChecking SkillTemplate stats for comma-in-string entries...');
  const allTemplates = await SkillTemplate.find().lean();
  let tplFixed = 0;
  for (const tpl of allTemplates) {
    const hasBadEntry = (tpl.stats || []).some(s => s.includes(','));
    if (!hasBadEntry) continue;
    const fixedStats = [];
    for (const s of tpl.stats) {
      if (s.includes(',')) {
        fixedStats.push(...s.split(',').map(x => x.trim().toLowerCase()).filter(Boolean));
      } else {
        fixedStats.push(s);
      }
    }
    await SkillTemplate.findByIdAndUpdate(tpl._id, { stats: fixedStats });
    console.log(`  Fixed "${tpl.name}": ${JSON.stringify(tpl.stats)} → ${JSON.stringify(fixedStats)}`);
    tplFixed++;
  }
  if (tplFixed === 0) console.log('  No malformed stats found.');
  else console.log(`  Fixed ${tplFixed} template(s).`);

  await mongoose.disconnect();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
