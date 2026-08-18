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

const EnemySchema = new mongoose.Schema({
  name:        { type: String, required: true },
  tier:        { type: String, default: 'mob' },
  size:        { type: String, enum: SIZES, default: 'Medium' },
  color:       { type: String, default: '#ff2255' },
  description: { type: String, default: '' },
  notes:       { type: String, default: '' },
  bodyParts:   { type: [BodyPartSchema], default: [] },
  phases:      { type: [PhaseSchema],    default: [] }, // boss/legendary only
}, { timestamps: true });

module.exports = mongoose.model('Enemy', EnemySchema);
module.exports.SIZES = SIZES;
