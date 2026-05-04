const mongoose = require('mongoose');

const affixSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  type:        { type: String, enum: ['prefix', 'suffix'], required: true },
  tier:        { type: String, enum: ['Lesser', 'Normal', 'Higher', 'Legendary', 'Mythic', 'Godly'], default: 'Normal' },
  effects:     { type: String, default: '' },   // game effect e.g. "+2 Burn damage"
  description: { type: String, default: '' },   // flavour text
}, { timestamps: true });

module.exports = mongoose.model('Affix', affixSchema);
