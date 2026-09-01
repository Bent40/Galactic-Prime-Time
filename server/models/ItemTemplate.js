const mongoose = require('mongoose');

const itemTemplateSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  icon:           { type: String, default: '' },
  category:       { type: String, enum: ['Equipment', 'Weapons', 'Tools', 'Consumables', 'Misc', 'System Items', 'Key Items'], default: 'Misc' },
  tier:           { type: String, enum: ['Crude', 'Basic', 'Quality', 'Superior', 'Exceptional', ''], default: '' },
  attackTypes:    [{ type: String }],
  range:          { type: String, default: '' },
  rpm:            { type: Number, default: null },
  magazine:       { type: Number, default: null },
  damage:         { type: String, default: '' },
  damageType:     [{ type: String }],
  specialEffects: { type: String, default: '' },
  resistance:     { type: String, default: '' },
  requirements:   { type: String, default: '' },
  description:    { type: String, default: '' },
  qty:            { type: Number, default: 1 },
  uses:           {
    max:     { type: Number, default: null },
    current: { type: Number, default: null },
  },
  // §12.7 — the bill of materials. Parts are material capacity; the STRIKING part
  // sets the damage band. Written down on every item so that DISASSEMBLY can hand
  // the materials back and the party can build something else out of them. An item
  // with no `materials` is baseline stock (Scrap/Wood/Leather/Iron, no band).
  materials:      [{
    part:     { type: String, default: '' },   // 'Blade', 'Haft', 'Lining', …
    material: { type: String, default: '' },   // 'Obsidian', 'Sky-Iron', …
    striking: { type: Boolean, default: false } // the part that sets the band
  }],
  // pool/authoring metadata (Item Drafting pass, 2026-08-04) — template-side
  // bookkeeping only; instances snapshot `subtype` but not the pool fields
  subtype:        { type: String, default: '' },
  boxTiers:       [{ type: String }],
  themes:         [{ type: String }],
  source:         { type: String, default: '' },
  // legacy fields kept for compatibility
  type:           { type: String, default: '' },
  effect:         { type: String, default: '' },
  notes:          { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('ItemTemplate', itemTemplateSchema);
