const mongoose = require('mongoose');

const skillTemplateSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  momentCost:   { type: String, default: '' },
  stats:        { type: [String], default: [] },
  passive:      { type: Boolean, default: false },
  capacity:     { type: Number, default: 5 },
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
  //   animalOnly  the skill belongs to a body a human does not have.
  //   exclusiveTo §4.4 "some skills are character-exclusive — tied to one
  //               contestant's nature and not obtainable by others". A named
  //               contestant here removes the skill from BOTH creation pools.
  //               (Proposed in skills-passover G7; built 2026-09-19 because the
  //               starting-skill picker was offering Mario's two exclusives and
  //               XQUEZ/T's three Robot racials to every new contestant.)
  // None of the three gates anything after creation — the GM grants what they like.
  origin:      { type: String, enum: ['basic', 'compound'], default: 'basic' },
  animalOnly:  { type: Boolean, default: false },
  exclusiveTo: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('SkillTemplate', skillTemplateSchema);
