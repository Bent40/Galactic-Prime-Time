const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  entryId:      { type: String,  required: true },
  name:         { type: String,  required: true },
  type:         { type: String,  enum: ['player', 'mob'], default: 'mob' },
  tier:         { type: String,  default: 'mob' },   // mob | elite | boss | legendary | player
  moment:       { type: Number,  default: 0, min: 0, max: 10 },
  color:        { type: String,  default: '#ff2255' },
  userId:       { type: String,  default: '' },
  phases:       { type: Array,   default: [] },       // copied from Enemy.phases at add-time
  currentPhase: { type: Number,  default: 0 },        // index into phases[]
}, { _id: false });

const momentTrackerSchema = new mongoose.Schema({
  currentMoment: { type: Number, default: 0, min: 0, max: 10 },
  clock:         { type: Number, default: 0 },
  entries:       { type: [entrySchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('MomentTracker', momentTrackerSchema);
