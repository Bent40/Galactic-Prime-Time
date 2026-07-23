/**
 * Skill passover — applies the 2026-07-23 sitting rulings to the skill templates.
 *
 *   node apply-skill-passover.js            → DRY RUN (prints every field change)
 *   node apply-skill-passover.js --apply    → writes
 *
 * Scope (per owner rulings G1/G2/G4/G5/G8 in rulebook/skills-passover.md):
 *  - G1: Tactical Roll reworked to the declared-hex dodge (movement is the price,
 *        misdeclare = get hit); Acrobatic Save loses its cooldown for the same
 *        movement-forfeit cost. No cooldown text remains anywhere.
 *  - G2: growth ladders authored for the zero-growth skills; inline "Level 6+"
 *        prose folded into levelEffects (single source of truth).
 *  - G4: NO stat changes — every skill's stats stay exactly as played this campaign.
 *  - G5: XQUEZ/T's skills get concrete effect definitions.
 *  - G8: the mechanical repair batch (grapple alignment, math rewrites, typos,
 *        scale fixes, contradiction reconciliations).
 * Backup first: node backup-db.js
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const SkillTemplate = require('./models/SkillTemplate');

// Each patch: match by trimmed name; `set` overwrites top-level fields;
// `levels` merges into levelEffects (null deletes a level).
const PATCHES = [
  {
    name: 'Tactical Roll',
    set: {
      requirements: 'Must not be Prone, Helpless, or have both legs disabled. Costs your movement: you cannot have moved this Moment, and you forfeit all movement for the rest of it.',
      effect: 'When an attack targets you, declare a hex within 1 space and immediately roll to it. The attack still resolves: if your new hex is inside its range or area, it hits you as normal — declare badly and you dodge into the hit. If your hex escapes it, the attack misses.',
    },
    levels: {
      2: '+1 Space',
      3: '+2 Space',
      4: '+2 Space. You may roll through occupied hexes.',
      5: '+3 Space. Rolling clear of an area attack escapes it fully — no partial effects.',
      6: '+3 Space. Once per Clock, the roll does not cost your movement.',
    },
  },
  {
    name: 'Acrobatic Save',
    set: {
      requirements: 'Must not be Helpless or Prone. Costs your movement: you forfeit all movement for the current Moment.',
    },
  },
  {
    name: 'Pressure Hold',
    set: {
      momentCost: '1',
      requirements: 'Adjacent target no more than one size larger. A free hand (both hands for grapple-suffocation), or a weapon that allows grappling.',
      effect: 'Grapple the target: automatic if your Physique ≥ theirs, otherwise it is a Forced Action — Body. While held: neither of you can reposition, and both of you are Exposed. Escape costs the target 2 Moments (1 if their Physique ≥ yours).',
    },
    levels: {
      2: 'May drag the hold 1 space per Moment (overrides the grapple movement lock)',
      3: 'May drag the hold 2 spaces per Moment',
      4: 'May drag the hold 3 spaces per Moment',
      5: 'May drag the hold 4 spaces per Moment',
      6: 'May begin grapple-suffocation (requires both hands + a coverable airway; bosses and anything 2+ sizes larger are immune).',
    },
  },
  {
    name: 'Strong Strike',
    levels: {
      2: '+2 damage of weapon type',
      3: '+3 damage of weapon type',
      4: '+4 damage of weapon type',
      5: '+4 damage. The windup cannot be interrupted by Shock Tier 1.',
      6: '+4 damage. Damage exceeding the struck part\'s HP carries into the part behind it.',
    },
  },
  {
    name: 'Slip Through',
    set: {
      requirements: 'Reflexes 3. Pounce Lv 3. Must follow Pounce immediately on the same target. Target must be at least one size larger than you.',
    },
    levels: {
      2: '+1 Bleed to each leg',
      3: '+1 Bleed to each leg. Reposition anywhere adjacent to the target.',
      4: '+2 Bleed to each leg. Reposition anywhere adjacent.',
      5: '+2 Bleed to each leg. Also usable immediately after dodging this target\'s attack.',
      6: '+2 Bleed to each leg. Target stays Exposed until the end of their NEXT Moment.',
    },
  },
  {
    name: 'Thousand Cuts',
    set: { range: '1' },
    levels: {
      2: '+1 Bleed to one chosen part',
      3: 'Choose 4 parts instead of 3',
      4: 'Choose 4 parts, +1 Bleed to two chosen parts',
      5: 'Choose 4 parts, +1 Bleed to two chosen parts, movement after the final strike +2 spaces',
      6: 'Any struck part that already had an active Bleed advances +1 tier (no longer requires ALL hits to land on bleeding parts).',
    },
  },
  {
    name: 'Telepathy',
    set: {
      effect: 'Establish a silent mental link. While linked: communicate wordlessly regardless of language. Read surface thoughts — reveals current emotional state and immediate focus. Targets with Mind 4+ notice the intrusion. Walls do not block it.',
    },
    levels: {
      2: 'Link a second target',
      3: 'Read immediate intent — the target\'s next planned action, not just their focus',
      4: 'All linked minds may speak to each other (party mesh)',
      5: 'The link reaches through any barrier; distance is limited only by familiarity with the target',
      6: 'Implant a single thought or image per Clock. The target believes it originated from themselves unless they have Mind 4+.',
    },
  },
  {
    name: 'Telekinesis',
    set: {
      effect: 'Mentally grip one target. Sustained each additional Moment: move the target up to 2 spaces per Moment in any direction including vertical. Held creatures cannot take movement actions but may still use arms. You are Exposed while sustaining. You cannot move while sustaining. Throwing a held creature into another deals 2 Crush to both and ends the grip.',
    },
    levels: {
      6: '+12 Range. You are no longer Exposed while sustaining.',
      7: '+12 Range. You may move 1 space per Moment while sustaining.',
    },
  },
  {
    name: 'Heroic Punch',
    set: {
      effect: 'A committed unarmed strike. Deals 2 Crush. If targeting the Head while the target is Exposed, add Shock Tier 1. The hit generates a cosmetic crowd effect — a visible POW graphic or equivalent. Gain 1 Viewer spike on a Head hit.',
    },
    levels: {
      6: '+4 Crush, and the hit also deals 3 Bleed.',
    },
  },
  {
    name: "Slice n' Dice",
    set: {
      requirements: 'Physique 2, Reflexes 3. Natural claws or light blades in both hands (forepaws count for quadrupeds).',
      effect: 'Swing both arms (or forepaws) in a rapid crossing arc. Single target: 2 Bleed to each of two limbs, OR 3 Bleed to the Torso. Two adjacent targets: 2 Bleed to one limb on each, OR 1 Bleed to each Torso.',
    },
    levels: {
      6: '+2 Bleed on Torso, +1 Bleed on Limbs, 2 Bleed on Head hit. Hits on already-Bleeding parts advance that Bleed +1 tier instead.',
    },
  },
  {
    name: 'Nightlurking',
    set: {
      effect: 'Passively: always aware of the nearest exit, gap, vent, or navigable opening in any room entered. Can fit through spaces too small for a human without rolling a Forced Action, provided the gap is physically plausible for a Small or smaller creature.',
    },
    levels: {
      6: 'Reveals the full layout of the current district. You can squeeze into spaces as small as a rat\'s hole.',
    },
  },
  {
    name: 'Acrobatics',
    set: {
      effect: 'Passively: rough terrain does not reduce movement speed. Jumping and climbing Movement +1. Balancing on narrow surfaces never requires a Forced Action unless actively attacked while doing so.',
    },
    levels: {
      6: '+1 Jump per turn. You can change directions mid-jump. Vertical movement costs the same as horizontal.',
    },
  },
  {
    name: 'Juggling',
    set: {
      range: '5',
      requirements: 'Item must be within 5 spaces. Must be able to physically handle the item\'s weight.',
      effect: 'Pass or catch any item within range in 0 Moments — absorbed into an existing action. Disarm: you may take dropped items or items an enemy is not currently wielding; snatching a wielded item is beyond even great jugglers (see Level 7).',
    },
    levels: {
      7: 'Can pick 2 targets. Once per combat, you may disarm a wielded item.',
    },
  },
  {
    name: 'Fire Ball',
    set: {
      effect: 'Hurl a blazing projectile that detonates on impact. All targets in a 3-space radius take 1 Burn damage and Burn Tier 1 to one exposed body part (the torso if none is exposed). Flammable objects in range ignite.',
    },
  },
  {
    name: 'Frost Ball',
    set: {
      effect: 'Launch a sphere of condensed cold. Applies Chilled Tier 1 to all targets in a 2-space radius and deals 2 Crush damage — the impact of the frozen mass (Chilled itself deals no HP damage).',
    },
  },
  {
    name: 'Frost Wall',
    set: {
      effect: 'Raise a barrier of solid ice up to 5 spaces long and 2 spaces tall. Blocks movement and projectiles. Any creature that strikes or collides with the wall takes Chilled Tier 1 to the striking limb. Wall has 3 HP. Lasts until destroyed or 2 Clocks pass. Burn damage deals double damage to the wall.',
    },
  },
  {
    name: 'Fire Wall',
    levels: { 6: '+4 Space. Enemies passing through take Shock Tier 2.' },
  },
  {
    name: 'Poison Wall',
    levels: { 6: '+4 Space. Can choose poison type (Hemo, Neuro, Pneumo).' },
  },
  {
    name: 'Seal The Wound',
    levels: { 6: 'Resolve Infection or Bleeding.' },
  },
  {
    name: 'Quick Step',
    levels: {
      2: '+1 Moment duration',
      3: '+2 Moment duration',
      4: '+3 Moment duration',
      5: '+4 Moment duration',
      6: '+4 Moment duration. Also ignore damaging/hindering floor effects (not walls).',
    },
  },
  {
    name: 'Execution',
    levels: { 6: '+8 Damage. Execution\'s impact automatically triggers a free Shockwave centered on the target.' },
  },
  {
    name: 'Vibe Control',
    levels: {
      2: '+1 resist penetration (each point counts as +1 effect tier against mental resistance)',
      3: '+2 range',
      4: '+2 resist penetration',
      5: '+3 range',
      6: 'May project at two targets at once.',
    },
  },
  {
    name: 'Generate Visual Media',
    set: {
      effect: 'Project one video or up to 3 images onto the Face Screen. Usable once per session at base level. Images can distract (target\'s next action becomes a Forced Action — Tool), intimidate (Shock Tier 1 vs Mobs), charm, or generate a Viewer spike. Every level adds another image, every 3 levels gives another video.',
    },
  },
  {
    name: 'Ignore All Previous Commands',
    levels: {
      2: '+1 Command Complication (each Complication lets the commanding ally attach one extra rider to the command — e.g. "…and move 1 space first").',
    },
  },
  {
    name: 'Camouflage',
    set: {
      name: 'Camouflage',
      effect: 'Hides the player, and can only be revealed if at 6 spaces or closer. Breaks if the character moves.',
      achievementUnlock: 'Have an enemy not spot you.',
    },
  },
];

function preview(v) {
  const s = String(v ?? '');
  return s.length > 90 ? s.slice(0, 87) + '…' : s;
}

async function run() {
  const apply = process.argv.includes('--apply');
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/galactic-prime-time';
  await mongoose.connect(uri);
  console.log(`${apply ? '=== APPLY MODE ===' : '=== DRY RUN (pass --apply to write) ==='}  ${uri}\n`);

  const templates = await SkillTemplate.find();
  console.log(`Found ${templates.length} skill template(s) in the database\n`);
  let changed = 0, missing = 0;

  for (const patch of PATCHES) {
    const tpl = templates.find(t => (t.name || '').trim() === patch.name);
    if (!tpl) {
      missing++;
      console.warn(`⚠ "${patch.name}" not found in this database — skipped`);
      continue;
    }
    let dirty = false;
    for (const [field, value] of Object.entries(patch.set || {})) {
      const current = field === 'name' ? tpl.name : tpl[field];
      if (String(current ?? '') !== String(value)) {
        console.log(`${patch.name} · ${field}:\n    − ${preview(current)}\n    + ${preview(value)}`);
        tpl[field] = value;
        dirty = true;
      }
    }
    if (patch.levels) {
      const le = { ...(tpl.levelEffects || {}) };
      for (const [lvl, value] of Object.entries(patch.levels)) {
        if (String(le[lvl] ?? '') !== String(value)) {
          console.log(`${patch.name} · L${lvl}:\n    − ${preview(le[lvl])}\n    + ${preview(value)}`);
          le[lvl] = value;
          dirty = true;
        }
      }
      if (dirty) {
        tpl.levelEffects = le;
        tpl.markModified('levelEffects');
      }
    }
    if (dirty) {
      changed++;
      if (apply) await tpl.save();
    }
  }

  console.log(`\n${changed} template(s) ${apply ? 'UPDATED' : 'would be updated'} · ${missing} not found in this DB`);
  if (missing > 0) console.log('→ "not found" is expected if this DB\'s skill library is the small local one; run against the campaign DB.');
  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
