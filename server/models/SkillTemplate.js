const mongoose = require('mongoose');

const skillTemplateSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  momentCost:   { type: String, default: '' },
  stats:        { type: [String], default: [] },
  passive:      { type: Boolean, default: false },
  capacity:     { type: Number, default: 5 },
  requirements: { type: String, default: '' },
  range:        { type: String, default: '' },
  target:       { type: String, default: '' },
  effect:       { type: String, default: '' },
  description:       { type: String, default: '' },
  achievementUnlock: { type: String, default: '' },
  levelEffects:      { type: Object, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('SkillTemplate', skillTemplateSchema);
