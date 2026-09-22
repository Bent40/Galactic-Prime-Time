const mongoose = require('mongoose');

const skillTemplateSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  momentCost:   { type: String, default: '' },
  stats:        { type: [String], default: [] },
  passive:      { type: Boolean, default: false },
  // `capacity` is the STARTING cap a contestant unlocks the skill at (§4.2: levels
  // 1-5 need no unlocking). `maxCapacity` is the skill's OWN CEILING — how far
  // Patron Tokens may ever raise that cap. Owner ruling 2026-09-22 (rulebook v1.13):
  // "some skills cap at 5, some at 10, with special ones we can designate up to 15".
  // The flat ceiling of 10 is withdrawn; a basic skill that stops at 5 sets both to 5.
  capacity:     { type: Number, default: 5 },
  maxCapacity:  { type: Number, default: 10 },
  requirements: { type: String, default: '' },
  range:        { type: String, default: '' },
  target:       { type: String, default: '' },
  effect:       { type: String, default: '' },
  description:       { type: String, default: '' },
  achievementUnlock: { type: String, default: '' },
  // Gemstone compatibility keywords (owner ruling 2026-07-23, G3-A): skills
  // sharing a NARROW keyword are merge-compatible; sharing only a BROAD one
  // needs GM approval. Taxonomy: rulebook/skills-passover.md.
  keywords:          { type: [String], default: [] },
  levelEffects:      { type: Object, default: {} },
  // Starting-skill eligibility (owner ruling 2026-09-19). A new contestant picks
  // from this library: a Human takes 4 skills not locked to an animal; an Animal
  // takes 2 of those plus 2 animal skills.
  //   origin      'basic'    — pickable at creation
  //               'compound' — a Gemstone MERGE product (§4.5, e.g. Intercept +
  //                            Brace = Iron Stance). Never pickable at creation:
  //                            you cannot start with something you fuse INTO.
  //   raceLock    the ONE race that may take this at creation, or '' for anyone.
  //               Replaced the `animalOnly` boolean 2026-09-19, when the owner
  //               ruled the three Robot racials "robot only" — the axis was the
  //               race all along, not "animal or not". `animalOnly` is still read
  //               as raceLock: 'Animal' so nothing written before today is lost.
  //   exclusiveTo §4.4 "some skills are character-exclusive — tied to one
  //               contestant's nature and not obtainable by others". A named
  //               contestant here removes the skill from BOTH creation pools.
  //               (Proposed in skills-passover G7; built 2026-09-19 because the
  //               starting-skill picker was offering Mario's two exclusives and
  //               XQUEZ/T's three Robot racials to every new contestant.)
  // None of the three gates anything after creation — the GM grants what they like.
  origin:      { type: String, enum: ['basic', 'compound'], default: 'basic' },
  raceLock:    { type: String, default: '' },
  animalOnly:  { type: Boolean, default: false },   // legacy — read, never written
  exclusiveTo: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('SkillTemplate', skillTemplateSchema);
