// One-time seed for the tags collection.
// Idempotent: each tag is upserted by name. Existing tags are left untouched.
// Usage:  node server/seedTags.js
require('dotenv').config();
const mongoose = require('mongoose');
const Tag = require('./models/Tag');

const TAG_NAMES = [
  'Documentary', 'Playa', 'Absolute Cinema', 'Edgy', 'Anime', 'LEEROY JENKINS',
  'Scrub', 'Stinker', 'Pinky Promise', 'Unkillable', 'Oops', 'Vengeful',
  'Menace', 'Animal Planet', 'Fan Favorite', 'Corporate Asset', 'Tragic',
  'Bolivian Army Ending', 'Chunky Salsa Rule', 'Coconut Superpowers',
  'Protagonist', 'Antagonist', 'Anti-Hero', 'Incorrigible', 'No Cure For Evil',
  'Munchkin', 'Little Dead Rising Hood', 'Mascot', 'Butcher', 'Survivor',
  'Spy', 'Liability', 'Method Actor', 'Understudy', 'Typecast', 'Prima Donna',
  'Scene Stealer', 'The Monologue', 'Fourth Wall', 'Box Office Bomb',
  "Director's Cut", 'Certified Fresh', 'SAG Dispute', 'Direct to DVD',
  'Callback', 'Nepotism Hire', 'One Star Review', 'Student Film',
  'Craft Services', 'Resting Loser Face', 'Applause Machine', 'Unlikely Menace',
  'Adorable Threat', 'Waddled Into Frame', 'The Bit', 'Bark Bark Bark',
  'Sea World Reject', 'Flipper Mode', "Crowd's Baby", 'Nine Lives',
  'Knock It Off The Table', 'Feral Consultant', 'Witnessed', 'Murder Mittens',
  'Dead Drop', 'Vet Visit', 'Territory Marked', '3am Energy', 'Indoor Cat',
  'Birdwatcher', 'Main Vocalist', 'Visual', 'Maknae', 'Rap Line', 'Formation',
  'Comeback Stage', 'Internal Dispute', 'Solo Debut', 'Parasocial', 'All-Kill',
  'Disbandment Arc', 'Fan Service', 'Blue Screen', 'Legacy Code',
  'Corrupted File', 'Unpatched', '404', 'Out of Memory', 'Safe Mode',
  'Null Pointer', 'Overclock', 'Peer Review', 'Technical Difficulties',
  'Off Script', 'Crossover Event', 'Genre Shift', 'Background Character',
  'The Recast', 'Blooper Reel', 'Post-Credits Scene',
];

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/galactic-prime-time';
  await mongoose.connect(uri);

  let inserted = 0;
  let skipped = 0;
  for (const name of TAG_NAMES) {
    const res = await Tag.updateOne(
      { name },
      { $setOnInsert: { name, description: '', effect: '', conditions: '' } },
      { upsert: true },
    );
    if (res.upsertedCount && res.upsertedCount > 0) inserted++;
    else skipped++;
  }

  console.log(`Tag seed complete — inserted ${inserted}, skipped ${skipped} (already present).`);
  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
