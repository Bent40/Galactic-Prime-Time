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

/**
 * Sound cues (2026-09-23). A cue is a SEGMENT of a source: play from `start` to `end`
 * seconds, and either loop that segment or run to `end` and stop. "Play up to 0:36 and
 * loop it; on phase 2 move to 0:36–1:50; on the kill, stop" is three cues on one source.
 * Sources: a YouTube video id, or an audio URL (https, or a data: URL under the cap).
 */
const cueSchema = new mongoose.Schema({
  cueId:  { type: String, required: true },
  name:   { type: String, required: true, maxlength: 60 },
  source: { type: String, enum: ['youtube', 'audio'], default: 'youtube' },
  ref:    { type: String, default: '' },      // youtube video id, or the audio URL
  start:  { type: Number, default: 0, min: 0 },
  end:    { type: Number, default: 0, min: 0 }, // 0 = to the end of the source
  loop:   { type: Boolean, default: true },
  volume: { type: Number, default: 80, min: 0, max: 100 },
  trigger: { type: String, enum: ['manual', 'map-live'], default: 'manual' },
  mapId:  { type: String, default: '' },      // for trigger 'map-live': fire when this map goes live
}, { _id: false });

// What is playing NOW. Clients derive the expected position from `startedAt`
// (server time) so a late joiner lands mid-segment in the right place.
const soundStateSchema = new mongoose.Schema({
  cueId:     { type: String, default: '' },
  playing:   { type: Boolean, default: false },
  startedAt: { type: Date, default: null },
  seq:       { type: Number, default: 0 },     // bumps on every change; clients react to a new seq
}, { _id: false });

// A visual effect is transient: it lives in this queue ~20 s so every poller sees it
// once, then is pruned. `type` is one of the seven damage types.
const fxSchema = new mongoose.Schema({
  fxId: { type: String, required: true },
  type: { type: String, required: true },
  from: { type: { col: Number, row: Number }, default: null },
  to:   { type: { col: Number, row: Number }, required: true },
  label: { type: String, default: '' },
  at:   { type: Date, default: Date.now },
}, { _id: false });

const tableSchema = new mongoose.Schema({
  cues:  { type: [cueSchema], default: [] },
  sound: { type: soundStateSchema, default: () => ({}) },
  fx:    { type: [fxSchema], default: [] },
  name:        { type: String, required: true, trim: true, maxlength: 80 },
  description: { type: String, default: '', maxlength: 500 },
  status:      { type: String, enum: ['open', 'closed'], default: 'open' },
  seats:       { type: [seatSchema], default: [] },
  activeMapId: { type: mongoose.Schema.Types.ObjectId, ref: 'TableMap', default: null },
  createdBy:   { type: String, default: '' },
}, { timestamps: true });

tableSchema.index({ 'seats.userId': 1 });

module.exports = mongoose.model('Table', tableSchema);
