const mongoose = require('mongoose');

/**
 * Table — one GM-run game. The thing Roll20 calls a "game" or "campaign".
 *
 * A Table owns the seats: which players (Users) sit at it, and which of its maps
 * is LIVE (the one a seated player sees). The maps themselves are separate
 * documents (`TableMap`) because a map carries its background image, and a
 * table with a dozen Inkarnate exports must not approach Mongo's 16 MB doc cap.
 *
 * Scope rule: a player only ever sees the table(s) they are seated at. Nothing
 * on a table is readable by an unseated player — the seat is the permission.
 */
const seatSchema = new mongoose.Schema({
  userId:   { type: String, required: true },   // String(User._id) — same key the tracker uses
  seatedAt: { type: Date,   default: Date.now },
}, { _id: false });

const tableSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true, maxlength: 80 },
  description: { type: String, default: '', maxlength: 500 },
  status:      { type: String, enum: ['open', 'closed'], default: 'open' },
  seats:       { type: [seatSchema], default: [] },
  activeMapId: { type: mongoose.Schema.Types.ObjectId, ref: 'TableMap', default: null },
  createdBy:   { type: String, default: '' },
}, { timestamps: true });

tableSchema.index({ 'seats.userId': 1 });

module.exports = mongoose.model('Table', tableSchema);
