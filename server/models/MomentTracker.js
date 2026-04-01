const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  entryId:  { type: String, required: true },
  name:     { type: String, required: true },
  type:     { type: String, enum: ['player', 'mob'], default: 'mob' },
  moment:   { type: Number, default: 0, min: 0, max: 10 },
  color:    { type: String, default: '#ff2255' },
  userId:   { type: String, default: '' },
}, { _id: false });

const momentTrackerSchema = new mongoose.Schema({
  currentMoment: { type: Number, default: 0, min: 0, max: 10 },
  clock:         { type: Number, default: 0 },
  entries:       { type: [entrySchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('MomentTracker', momentTrackerSchema);
