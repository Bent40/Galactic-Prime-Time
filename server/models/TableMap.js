const mongoose = require('mongoose');

/**
 * TableMap — one scene on a Table: a background image (an Inkarnate export),
 * a hex grid laid over it, and the tokens standing on it.
 *
 * Units are the book's: 1 space = 1 hex (§5.5). `grid.size` is the hex's
 * circumradius in image pixels, `grid.offsetX/Y` shifts the lattice so it can be
 * lined up with a map drawn on a different grid. Pointy-top hexes, odd rows
 * shoved right — the same lattice the mockup draws.
 *
 * A token REFERENCES a character or an enemy; it never copies stats. Player
 * tokens read HP live from the character sheet; enemy tokens carry their own
 * `parts[]` because an Enemy document is a template (maxHp only) and an
 * instance needs current HP.
 *
 * Image storage: a data URL inside the document, capped (see routes/tables.js
 * MAX_IMAGE_CHARS) — the same convention `identity.portrait` already uses.
 * Render's disk is ephemeral, so the database is the only durable store we have
 * without adding a service. Swap `image` for a CDN URL later without a model
 * change: the field is a string either way.
 */
const partSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  currentHp: { type: Number, default: 0 },
  maxHp:     { type: Number, default: 0 },
  lethal:    { type: Boolean, default: false },
}, { _id: false });

const tokenSchema = new mongoose.Schema({
  tokenId: { type: String, required: true },
  kind:    { type: String, enum: ['player', 'enemy', 'npc', 'marker'], default: 'marker' },
  refId:   { type: String, default: '' },     // userId for players, Enemy._id for enemies, NPC._id for npcs
  name:    { type: String, required: true },
  label:   { type: String, default: '' },     // one or two glyphs drawn on the disc
  color:   { type: String, default: '#94a6c6' },
  tier:    { type: String, default: '' },     // mob | elite | boss | legendary | player
  size:    { type: String, default: 'Medium' },
  col:     { type: Number, default: 0 },
  row:     { type: Number, default: 0 },
  hidden:  { type: Boolean, default: false }, // GM-only until revealed
  parts:   { type: [partSchema], default: [] },
  conditions: { type: [String], default: [] },
}, { _id: false });

const gridSchema = new mongoose.Schema({
  type:    { type: String, enum: ['hex'], default: 'hex' },
  size:    { type: Number, default: 40, min: 8, max: 400 },
  offsetX: { type: Number, default: 0 },
  offsetY: { type: Number, default: 0 },
  cols:    { type: Number, default: 30, min: 1, max: 400 },
  rows:    { type: Number, default: 20, min: 1, max: 400 },
}, { _id: false });

const tableMapSchema = new mongoose.Schema({
  tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true, index: true },
  name:    { type: String, required: true, trim: true, maxlength: 80 },
  image:   { type: String, default: '' },     // data URL or https URL; '' = plain grid
  width:   { type: Number, default: 0 },      // image pixel size, for the viewBox
  height:  { type: Number, default: 0 },
  grid:    { type: gridSchema, default: () => ({}) },
  visible: { type: Boolean, default: false }, // false = GM prep; only the table's activeMapId is ever LIVE
  revealed: { type: [String], default: [] },  // fog: "col,row" keys players may see; empty = no fog on this map
  fogEnabled: { type: Boolean, default: false },
  tokens:  { type: [tokenSchema], default: [] },
  notes:   { type: String, default: '' },     // GM-only
}, { timestamps: true });

module.exports = mongoose.model('TableMap', tableMapSchema);
