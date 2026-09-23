const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  recipientNPC: { type: mongoose.Schema.Types.ObjectId, ref: 'NPC', default: null },
  recipientName: { type: String, default: null },
  text: { type: String, required: true, maxlength: 500 },
  style: {
    color:  { type: String, default: null },
    font:   { type: String, default: 'default' },
    effect: { type: String, default: 'none' },
  },
  // A dice roll is a Message (2026-09-23): `kind: 'roll'` with the result in `roll`.
  // The SERVER rolls, so a result cannot be typed. `gmOnly` hides a roll from every
  // player feed (the GM rolling an enemy's Forced Action); `tableId` scopes it.
  kind:    { type: String, enum: ['say', 'roll'], default: 'say' },
  roll:    { type: mongoose.Schema.Types.Mixed, default: null },
  gmOnly:  { type: Boolean, default: false },
  tableId: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
