const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  effect:     { type: String, default: '' },
  conditions: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Tag', tagSchema);
