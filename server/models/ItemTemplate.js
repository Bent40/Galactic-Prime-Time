const mongoose = require('mongoose');

const itemTemplateSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  category: { type: String, enum: ['Equipment', 'Weapons', 'Tools', 'Consumables', 'Misc'], default: 'Misc' },
  qty:      { type: Number, default: 1 },
  type:     { type: String, default: '' },
  damage:   { type: String, default: '' },
  range:    { type: String, default: '' },
  effect:   { type: String, default: '' },
  notes:    { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('ItemTemplate', itemTemplateSchema);
