const mongoose = require('mongoose');

const DMG_TYPES = ['Bleed', 'Crush', 'Burn', 'Chill', 'Poison', 'Infection', 'Dissolution'];

const ResistSchema = new mongoose.Schema({
  type:  { type: String, default: '' },   // one of DMG_TYPES
  value: { type: Number, default: 0 },    // Force subtracted from that type alone
  // §21.3 — REQUIRED. What in this creature's story makes it resist this? A
  // resistance must trace to what it IS or has DONE. If the reason cannot be
  // written, the resistance exists to force a tactic and belongs cut. This field
  // is the gate against that; the seeder refuses an entry that leaves it blank.
  why:   { type: String, default: '' },
}, { _id: false });

// Weaknesses carry their reason for the same rule.
const WeaknessSchema = new mongoose.Schema({
  type: { type: String, default: '' },
  why:  { type: String, default: '' },
}, { _id: false });

const UniversalSchema = new mongoose.Schema({
  value:   { type: Number, default: 0 },  // 0 = none; the gate skips it
  cause:   { type: String, default: '' },  // REQUIRED when value > 0
  removal: { type: String, default: '' },  // REQUIRED when value > 0
}, { _id: false });

const BodyPartSchema = new mongoose.Schema({
  name:  { type: String, default: '' },
  maxHp: { type: Number, default: 3 },
  // §7.3 resolves damage PER PART, and §12.6 already gives the contestant per-part
  // resistance (armor covers parts). These close the same asymmetry on the enemy
  // side: a part may be warded while the rest of the creature is not — which is
  // exactly THE MASKED, whose Mask is sealed and whose body is just a body.
  // Part resistance ADDS to the enemy-wide resistance; it does not replace it.
  resistances: { type: [ResistSchema],  default: [] },
  universal:   { type: UniversalSchema, default: () => ({}) },
}, { _id: false });

const PhaseSchema = new mongoose.Schema({
  name:        { type: String, default: 'Phase' },
  description: { type: String, default: '' },
  hpThreshold: { type: String, default: '' }, // e.g. "50% HP", "1 body part left"
}, { _id: false });

// Rulebook §7.1: "Every combatant has a size: Small / Medium / Large / Huge.
// Humans are Medium. Effects referencing size read this field." §13 reads it for
// grapple legality (no more than one size larger) and grapple-Suffocation immunity
// (2+ sizes larger).
const SIZES = ['Small', 'Medium', 'Large', 'Huge'];

// enemy-scaling S-1: the signature hit, in BAND UNITS for the enemy's own floor.
// Structured (not free-text notes) so seed-enemies.js can gate it the way it gates
// HP. `floor` is what band the number is written in; `damage` is the signature hit;
// `exception` names one of the two legitimate off-band shapes, or '' for on-band:
//   'windup'  — a telegraphed 1-Clock windup may read ABOVE band (the party is paid
//               in a punish window). e.g. the Step-Warden's 10 against an F1 elite 6.
//   'tick'    — a per-Moment tick sits BELOW band, because the tier ladder is what
//               kills, not the number. e.g. the Husk-Moth's 2 against an F1 mob 4.
//   'aura'    — the strike is not where the threat is, so it reads BELOW band (>=0.5x).
//               e.g. THE MASKED's 6 against an F1 boss 8 — the countdown is the aura.
//   'presence'— no attack at all. damage must be 0 and note must say what the threat
//               is instead. e.g. Vermilia, whose threat is noble-class presence.
// Anything else off-band is a bug, and --check says so.
const DamageSchema = new mongoose.Schema({
  floor:     { type: Number, default: 0 },   // 0 = unset, gate skips it
  damage:    { type: Number, default: 0 },
  type:      { type: String, default: '' },  // Crush / Bleed / Burn / Infected / ...
  exception: { type: String, default: '' },  // '' | 'windup' | 'tick' | 'aura' | 'presence'
  note:      { type: String, default: '' },
}, { _id: false });

// §10 / §10.1 — resistances, in FORCE.
//
// TYPED resistance subtracts from its OWN type only, and never more than that
// type actually dealt: Fire 5 against 1 Force of fire eats the 1 and wastes 4.
// Resolved BEFORE universal.
//
// UNIVERSAL resistance reduces every type at once and is the same object as a
// damage threshold — universal 6 means "needs 7 Force to do anything." It applies
// to the TOTAL, once, never per type.
//
// 🔒 A universal resistance is ALWAYS CAUSED BY SOMETHING — a structure, a stance,
// a hold, an active effect — and is NEVER a creature's standing state. So an entry
// carrying one must name `cause` AND `removal`; one without the other is refused by
// seed-enemies.js. A number nobody can answer is not difficulty, it is a wall.
//
// ⚠️ NO TIER RESTRICTION, deliberately: a MOB may carry any resistance, typed or
// universal. That is E-0's rule working as intended — "a mob that survives a hit
// gets a gate, never a fatter number," and a resistance IS that gate. Do not add a
// tier check here.
const EnemySchema = new mongoose.Schema({
  name:        { type: String, required: true },
  tier:        { type: String, default: 'mob' },
  signature:   { type: DamageSchema, default: () => ({}) },
  size:        { type: String, enum: SIZES, default: 'Medium' },
  color:       { type: String, default: '#ff2255' },
  description: { type: String, default: '' },
  notes:       { type: String, default: '' },
  resistances: { type: [ResistSchema],   default: [] },
  universal:   { type: UniversalSchema,  default: () => ({}) },
  // §7.3 — "a weakness DOUBLES that type's contribution." A torch adds 1 Force to
  // anything and 2 to something that burns. This is the field that rule needed and
  // never had; without it the doubling could only live in prose.
  weaknesses:  { type: [WeaknessSchema], default: [] },
  bodyParts:   { type: [BodyPartSchema], default: [] },
  phases:      { type: [PhaseSchema],    default: [] }, // boss/legendary only
}, { timestamps: true });

module.exports = mongoose.model('Enemy', EnemySchema);
module.exports.SIZES = SIZES;
module.exports.DAMAGE_EXCEPTIONS = ['', 'windup', 'tick', 'aura', 'presence'];
module.exports.DMG_TYPES = DMG_TYPES;
