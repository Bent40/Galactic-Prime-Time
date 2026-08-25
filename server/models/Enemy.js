const mongoose = require('mongoose');

const BodyPartSchema = new mongoose.Schema({
  name:  { type: String, default: '' },
  maxHp: { type: Number, default: 3 },
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
// Anything else off-band is a bug, and --check says so.
const DamageSchema = new mongoose.Schema({
  floor:     { type: Number, default: 0 },   // 0 = unset, gate skips it
  damage:    { type: Number, default: 0 },
  type:      { type: String, default: '' },  // Crush / Bleed / Burn / Infected / ...
  exception: { type: String, default: '' },  // '' | 'windup' | 'tick'
  note:      { type: String, default: '' },
}, { _id: false });

const EnemySchema = new mongoose.Schema({
  name:        { type: String, required: true },
  tier:        { type: String, default: 'mob' },
  signature:   { type: DamageSchema, default: () => ({}) },
  size:        { type: String, enum: SIZES, default: 'Medium' },
  color:       { type: String, default: '#ff2255' },
  description: { type: String, default: '' },
  notes:       { type: String, default: '' },
  bodyParts:   { type: [BodyPartSchema], default: [] },
  phases:      { type: [PhaseSchema],    default: [] }, // boss/legendary only
}, { timestamps: true });

module.exports = mongoose.model('Enemy', EnemySchema);
module.exports.SIZES = SIZES;
module.exports.DAMAGE_EXCEPTIONS = ['', 'windup', 'tick'];
