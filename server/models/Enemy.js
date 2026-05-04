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

const EnemySchema = new mongoose.Schema({
  name:        { type: String, required: true },
  tier:        { type: String, default: 'mob' },
  color:       { type: String, default: '#ff2255' },
  description: { type: String, default: '' },
  notes:       { type: String, default: '' },
  bodyParts:   { type: [BodyPartSchema], default: [] },
  phases:      { type: [PhaseSchema],    default: [] }, // boss/legendary only
}, { timestamps: true });

module.exports = mongoose.model('Enemy', EnemySchema);
