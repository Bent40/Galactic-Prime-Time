/**
 * Boss Token retirement (owner ruling 2026-07-25): Boss Tokens merge into
 * Upgrade Tokens — bosses now drop UT scaled by rank. This converts every
 * character's held boss tokens into Upgrade Tokens and removes the field.
 *
 *   node migrate-boss-tokens.js            → dry run
 *   node migrate-boss-tokens.js --apply    → write
 *
 * Conversion scale ⚖ (unused tokens only; spent/used tokens are dropped —
 * their value was already realized):
 *   bronze 5 · silver 10 · gold 25 · legendary 50 · mythic 100 · godly 250
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const Character = require('./models/Character');

const SCALE = { bronze: 5, silver: 10, gold: 25, legendary: 50, mythic: 100, godly: 250 };

async function run() {
  const apply = process.argv.includes('--apply');
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/galactic-prime-time';
  await mongoose.connect(uri);
  console.log(`${apply ? '=== APPLY MODE ===' : '=== DRY RUN (pass --apply to write) ==='}  ${uri}\n`);

  let changed = 0;
  for (const ch of await Character.find()) {
    const st = ch.state || {};
    const who = st.identity?.name || ch.userId;
    const tokens = st.tokens || {};
    const held = Array.isArray(tokens.bossTokens) ? tokens.bossTokens : null;
    if (held === null) continue;

    const unused = held.filter(t => !t.used);
    const spent = held.length - unused.length;
    const value = unused.reduce((sum, t) => sum + (SCALE[t.tier] || 0), 0);
    const unknown = unused.filter(t => !(t.tier in SCALE));
    for (const t of unknown) console.warn(`${who}: ⚠ unknown tier "${t.tier}" — worth 0, review by hand`);

    changed++;
    console.log(`${who}: ${unused.length} unused token(s) → +${value} Upgrade Tokens (UT ${tokens.upgrade || 0} → ${(tokens.upgrade || 0) + value}); ${spent} spent token(s) dropped`);
    if (apply) {
      tokens.upgrade = (tokens.upgrade || 0) + value;
      delete tokens.bossTokens;
      st.tokens = tokens;
      ch.state = st;
      ch.markModified('state');
      await ch.save();
    }
  }

  console.log(`\n${changed} character(s) ${apply ? 'migrated' : 'would be migrated'}`);
  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
