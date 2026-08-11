const mongoose = require('mongoose');

// Sealed loot boxes (item-drafting-passover ID-9). Contents live HERE, never in
// character.state — the state blob is player-readable, so sealed loot would be
// spoiler-visible there. Opened boxes are never deleted: the collection doubles
// as the permanent box log (who, what, why, and what was chosen).
const lootBoxSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name:        { type: String, required: true },
  boxTier:     { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Legendary', 'Mythic', 'Godly', ''], default: '' },
  mode:        { type: String, enum: ['all', 'pick-one'], default: 'all' },
  items:       { type: [mongoose.Schema.Types.Mixed], default: [] }, // give-style snapshots
  status:      { type: String, enum: ['sealed', 'opened'], default: 'sealed', index: true },
  chosenIndex: { type: Number, default: null },  // pick-one: which item was claimed
  source:      { type: String, default: '' },    // WHY it was given (boss, Goal, quest…)
  openedAt:    { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('LootBox', lootBoxSchema);
