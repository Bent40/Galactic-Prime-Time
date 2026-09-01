const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, default: '' },
  effect:      { type: String, default: '' },
  conditions:  { type: String, default: '' },
  // Rulebook 18.4 — a Mark is a tag that records a DEED, not a performance.
  // It never fades and cannot be shed; it lies dormant until a scene makes it
  // relevant. `activeNear` is that presence trigger, in prose.
  kind:        { type: String, enum: ['tag', 'mark'], default: 'tag' },
  activeNear:  { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Tag', tagSchema);
