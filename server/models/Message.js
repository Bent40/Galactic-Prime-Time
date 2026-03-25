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
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
