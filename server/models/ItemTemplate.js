const mongoose = require('mongoose');

const itemTemplateSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  icon:           { type: String, default: '' },
  category:       { type: String, enum: ['Equipment', 'Weapons', 'Tools', 'Consumables', 'Misc', 'System Items', 'Key Items'], default: 'Misc' },
  tier:           { type: String, enum: ['Crude', 'Basic', 'Quality', 'Superior', 'Exceptional', ''], default: '' },
  attackTypes:    [{ type: String }],
  range:          { type: String, default: '' },
  rpm:            { type: Number, default: null },
  damage:         { type: String, default: '' },
  damageType:     [{ type: String }],
  specialEffects: { type: String, default: '' },
  resistance:     { type: String, default: '' },
  requirements:   { type: String, default: '' },
  description:    { type: String, default: '' },
  qty:            { type: Number, default: 1 },
  uses:           {
    max:     { type: Number, default: null },
    current: { type: Number, default: null },
  },
  // legacy fields kept for compatibility
  type:           { type: String, default: '' },
  effect:         { type: String, default: '' },
  notes:          { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('ItemTemplate', itemTemplateSchema);
