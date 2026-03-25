const mongoose = require('mongoose');

const npcSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, default: '#c8a84b' },
}, { timestamps: true });

module.exports = mongoose.model('NPC', npcSchema);
