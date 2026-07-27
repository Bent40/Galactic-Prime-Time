/**
 * Seeds each tag's `effect` line from the 2026-07-25 tags passover
 * (GT1–GT5 + all five batches approved; assignments mirror
 * rulebook/tags-passover.md, riders mirror book §18.2).
 *
 *   node seedTagEffects.js            → dry run
 *   node seedTagEffects.js --apply    → write EMPTY effect fields only
 *   node seedTagEffects.js --apply --force → overwrite non-empty ones too
 *
 * Effect line format: "Domains: x, y." plus the rider sentence when the tag
 * has one. Matches DB tags by name, case-insensitive.
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const Tag = require('./models/Tag');

const DOMAINS = {
  'Documentary': ['showmanship', 'meta'],
  'Playa': ['daring'],
  'Absolute Cinema': ['showmanship', 'daring'],
  'Edgy': ['menace', 'carnage'],
  'Anime': ['showmanship', 'chaos'],
  'LEEROY JENKINS': ['daring', 'chaos'],
  'Scrub': ['comedy'],
  'Stinker': ['comedy', 'chaos'],
  'Pinky Promise': ['heart', 'meta'],
  'Unkillable': ['grit'],
  'Oops': ['comedy', 'chaos'],
  'Vengeful': ['menace', 'grit'],
  'Menace': ['menace'],
  'Animal Planet': ['heart'],
  'Fan Favorite': ['showmanship', 'heart'],
  'Corporate Asset': ['meta'],
  'Tragic': ['heart', 'grit'],
  'Bolivian Army Ending': ['grit', 'daring'],
  'Chunky Salsa Rule': ['carnage'],
  'Coconut Superpowers': ['grit', 'comedy'],
  'Protagonist': ['showmanship', 'daring'],
  'Antagonist': ['menace', 'meta'],
  'Anti-Hero': ['menace', 'heart'],
  'Incorrigible': ['comedy', 'daring'],
  'No Cure For Evil': ['chaos', 'menace'],
  'Munchkin': ['cunning', 'craft', 'meta'],
  'Little Dead Rising Hood': ['carnage', 'comedy'],
  'Mascot': ['heart', 'showmanship'],
  'Butcher': ['carnage'],
  'Survivor': ['grit'],
  'Spy': ['cunning'],
  'Liability': ['chaos', 'comedy'],
  'Method Actor': ['showmanship', 'grit'],
  'Understudy': ['craft', 'cunning'],
  'Typecast': ['craft', 'meta'],
  'Prima Donna': ['showmanship', 'comedy'],
  'Scene Stealer': ['showmanship', 'cunning'],
  'The Monologue': ['showmanship', 'menace'],
  'Fourth Wall': ['meta', 'showmanship'],
  'Box Office Bomb': ['comedy', 'daring'],
  "Director's Cut": ['grit', 'showmanship'],
  'Certified Fresh': ['daring', 'meta'],
  'SAG Dispute': ['meta', 'grit'],
  'Direct to DVD': ['heart', 'meta'],
  'Callback': ['grit', 'showmanship'],
  'Nepotism Hire': ['comedy', 'meta'],
  'One Star Review': ['grit', 'showmanship'],
  'Student Film': ['daring', 'craft'],
  'Craft Services': ['comedy', 'heart'],
  'Resting Loser Face': ['comedy', 'grit'],
  'Applause Machine': ['comedy', 'showmanship'],
  'Unlikely Menace': ['grit', 'cunning'],
  'Adorable Threat': ['heart', 'carnage'],
  'Waddled Into Frame': ['comedy', 'chaos'],
  'The Bit': ['showmanship', 'comedy'],
  'Bark Bark Bark': ['teamwork', 'comedy'],
  'Sea World Reject': ['showmanship', 'craft'],
  'Flipper Mode': ['craft', 'grit'],
  "Crowd's Baby": ['heart', 'meta'],
  'Nine Lives': ['daring', 'grit'],
  'Knock It Off The Table': ['chaos', 'comedy'],
  'Feral Consultant': ['chaos', 'cunning'],
  'Witnessed': ['meta', 'cunning'],
  'Murder Mittens': ['carnage', 'daring'],
  'Dead Drop': ['cunning', 'meta'],
  'Vet Visit': ['comedy', 'heart'],
  'Territory Marked': ['cunning', 'menace'],
  '3am Energy': ['chaos', 'daring'],
  'Indoor Cat': ['cunning', 'craft'],
  'Birdwatcher': ['cunning', 'grit'],
  'Main Vocalist': ['showmanship', 'meta'],
  'Visual': ['showmanship'],
  'Maknae': ['comedy', 'daring'],
  'Rap Line': ['showmanship', 'craft'],
  'Formation': ['teamwork', 'showmanship'],
  'Comeback Stage': ['grit', 'showmanship'],
  'Internal Dispute': ['chaos', 'showmanship'],
  'Solo Debut': ['daring', 'showmanship'],
  'Parasocial': ['heart', 'meta'],
  'All-Kill': ['showmanship', 'carnage', 'daring'],
  'Disbandment Arc': ['chaos', 'heart'],
  'Fan Service': ['showmanship', 'meta'],
  'Blue Screen': ['comedy', 'meta'],
  'Legacy Code': ['comedy', 'grit'],
  'Corrupted File': ['chaos', 'comedy'],
  'Unpatched': ['grit', 'meta'],
  '404': ['comedy', 'meta'],
  'Out of Memory': ['comedy', 'chaos'],
  'Safe Mode': ['grit', 'craft'],
  'Null Pointer': ['comedy', 'meta'],
  'Overclock': ['daring', 'grit'],
  'Peer Review': ['comedy', 'cunning'],
  'Technical Difficulties': ['comedy', 'chaos', 'teamwork'],
  'Off Script': ['chaos', 'showmanship'],
  'Crossover Event': ['teamwork', 'chaos'],
  'Genre Shift': ['showmanship', 'meta'],
  'Background Character': ['cunning', 'meta'],
  'The Recast': ['craft', 'teamwork'],
  'Blooper Reel': ['comedy', 'grit'],
  'Post-Credits Scene': ['meta', 'daring'],
};

const RIDERS = {
  'The Monologue': 'RIDER — Once per session, a delivered monologue makes your next action\'s crowd payout triple.',
  'Comeback Stage': 'RIDER — Returning from bleed-out or Helpless, your next action can\'t be interrupted and pays double hype.',
  'Fan Favorite': 'RIDER — Once per session, ask the crowd for a Goal of your choice (the GM prices its reward honestly).',
  'Scene Stealer': 'RIDER — Once per session, redirect an ally\'s Camera Call spotlight onto yourself mid-scene.',
  'The Bit': 'RIDER — The third performance of your bit in a session is an automatic Viewer spike.',
  'Nine Lives': 'RIDER — Once per session, reroll one Forced Action die where the escape was movement-based.',
  'Unkillable': 'RIDER — Once per campaign arc, refuse a death: you land in bleed-out instead, regardless of cause.',
  'Method Actor': 'RIDER — Staying in character through a Forced Action consequence converts it into crowd favor.',
  'Munchkin': 'RIDER — Once per campaign, an exploit you found is grandfathered for you even after the GM patches it.',
  'LEEROY JENKINS': 'RIDER — Acting first in an ambush YOU triggered, your opening action costs 1 less Moment.',
};

function effectLine(name) {
  const domains = DOMAINS[name];
  if (!domains) return null;
  const rider = RIDERS[name];
  return `Domains: ${domains.join(', ')}.${rider ? ' ' + rider : ''}`;
}

async function run() {
  const apply = process.argv.includes('--apply');
  const force = process.argv.includes('--force');
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/galactic-prime-time';
  await mongoose.connect(uri);
  console.log(`${apply ? '=== APPLY MODE ===' : '=== DRY RUN (pass --apply to write) ==='}  ${uri}\n`);

  const tags = await Tag.find();
  console.log(`Found ${tags.length} tag row(s) in the database`);
  const byName = new Map(Object.keys(DOMAINS).map(n => [n.toLowerCase(), n]));
  let updated = 0, skipped = 0, unmatched = 0;

  for (const tag of tags) {
    const canonical = byName.get(tag.name.trim().toLowerCase());
    if (!canonical) {
      unmatched++;
      console.warn(`⚠ DB tag "${tag.name}" has no passover assignment`);
      continue;
    }
    const line = effectLine(canonical);
    if (tag.effect && !force) { skipped++; continue; }
    updated++;
    console.log(`"${tag.name}" ← ${line}`);
    if (apply) { tag.effect = line; await tag.save(); }
  }

  console.log(`\n${updated} effect(s) ${apply ? 'written' : 'would be written'} · ${skipped} already set (use --force) · ${unmatched} unmatched`);
  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
