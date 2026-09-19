/**
 * STARTING-SKILL CLASSIFICATION — the two axes the owner ruled on 2026-09-19.
 *
 *   "a human gets to choose 4 skills that arent locked to an animal when first
 *    made. an animal chooses 2 skills and 2 animal skills. […] can be any basic
 *    skill, not compound skills."
 *
 * Every template in the live library, classified. THIS FILE IS THE MARKUP
 * SURFACE — change a row here, then:
 *
 *   node apply-skill-classification.js --check    # no DB, no node_modules
 *   node apply-skill-classification.js            # dry run against Atlas
 *   node apply-skill-classification.js --apply
 *
 * FIELDS
 *   origin      'basic'    — a new contestant may take it cold.
 *               'compound' — they may NOT. Two kinds, both recorded in `why`:
 *                            MERGE  a Skill Gemstone product (§4.5) — the parents
 *                                   are consumed, so starting with the result
 *                                   skips the whole economy that pays for it.
 *                            PREREQ its requirements name another skill at a
 *                                   level, so taken cold it is a dead slot.
 *               ⚖ Folding PREREQ in with MERGE is MINE, not ruled. The field has
 *               exactly one job — deciding what a brand-new contestant may pick —
 *               and a skill that cannot fire is not a starting skill. Split them
 *               and the picker needs a second signal to do the same work.
 *   raceLock    the ONE race that may take it at creation, or '' for anyone.
 *               RULED 2026-09-19 — the three Robot racials are "robot only", so
 *               the axis is the RACE, not a boolean. It replaced `animalOnly`,
 *               which is still READ as a lock on 'Animal' and never written.
 *   exclusiveTo ONE CONTESTANT's own skill (§4.4 "character-exclusive"), '' for
 *               none. A race lock is raceLock; the two are different claims and
 *               the gate refuses a row that makes both.
 *   requirementsFix  OPTIONAL. A corrected `requirements` string, written only when
 *               the live one is wrong. Used for exactly two rows: Frost Wall and
 *               Fire Wall carry a skill-prereq the passover table records and their
 *               live strings never did. A row WITHOUT this field never touches
 *               `requirements` — classification does not rewrite content.
 *   status      'evidenced' — the live data already says so (a RACE family tag,
 *                             a consume/prereq clause in `requirements`).
 *               'proposed'  — mine. The owner's call.
 */

module.exports = [
  // ── 1–9 · the core melee/field kit ─────────────────────────────────────────
  { name: 'Controlled Sweep', origin: 'basic', raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'no prereq, no RACE tag' },
  { name: 'Quick Step',       origin: 'basic', raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'no prereq, no RACE tag' },
  { name: 'Seal The Wound',   origin: 'basic', raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'no prereq; merge PARENT of Combat Medic, which is the opposite of compound' },
  { name: 'Strong Strike',    origin: 'basic', raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'no prereq, no RACE tag' },
  { name: 'Counter-Surge',    origin: 'basic', raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'no prereq; merge PARENT of Counterscript' },
  { name: 'Read The Pattern', origin: 'basic', raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'no prereq; merge PARENT of Counterscript' },
  { name: 'Pressure Hold',    origin: 'basic', raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'no prereq; merge PARENT of Vice Grip' },
  { name: 'Brace',            origin: 'basic', raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'no prereq; merge PARENT of Iron Stance' },
  { name: 'Tactical Roll',    origin: 'basic', raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'no prereq; merge PARENT of Perfect Evasion' },

  // ── 10–19 · magic ──────────────────────────────────────────────────────────
  { name: 'Poison Ball',  origin: 'basic',    raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'the entry point to the toxin line' },
  { name: 'Poison Wall',  origin: 'compound', raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'PREREQ — requirements: "Mind 3. Poison Ball Lv 3."' },
  { name: 'Frost Ball',   origin: 'basic',    raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'the entry point to the cold line' },
  { name: 'Frost Wall',   origin: 'compound', raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'PREREQ — AGREED 2026-09-19. The live requirements string says only "Mind 3."; it should read "Mind 3. Frost Ball Lv 3." like Poison Wall. Fixed by requirementsFix', requirementsFix: 'Mind 3. Frost Ball Lv 3.' },
  { name: 'Fire Ball',    origin: 'basic',    raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'the entry point to the fire line' },
  { name: 'Fire Wall',    origin: 'compound', raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'PREREQ — AGREED 2026-09-19. Same drift as Frost Wall; should read "Mind 3. Fire Ball Lv 3."', requirementsFix: 'Mind 3. Fire Ball Lv 3.' },
  { name: 'Elemental Confluence', origin: 'compound', raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'MERGE — "Consume Poison Ball Lv 5, Frost Ball Lv 5, and Fire Ball Lv 5 at the Skill Gemstone. No other method."' },
  { name: 'Telekinesis',  origin: 'basic',    raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'no prereq; its sustain cost is its own price' },
  { name: 'Telepathy',    origin: 'basic',    raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'the entry point to the psychic line' },
  { name: 'Mind Burst',   origin: 'compound', raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'PREREQ — requirements: "Mind 4. Telepathy Lv 3."' },

  // ── 20–28 · the three CHAINS. Openers are basic; every follow-up is not. ───
  { name: 'Pounce',          origin: 'basic',    raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'CHAIN OPENER, and NOT RACE-tagged — its requirement reads "Light Small Weapon (Claws or Knife type)", and the knife is the proof' },
  { name: 'Slip Through',    origin: 'compound', raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'PREREQ — "Pounce Lv 3. Must follow Pounce immediately"' },
  { name: 'Decapitate',      origin: 'compound', raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'PREREQ — "Pounce Lv 5, Slip Through Lv 3"' },
  { name: 'Overhead Slam',   origin: 'basic',    raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'CHAIN OPENER; merge PARENT of Earthbreaker' },
  { name: 'Shockwave',       origin: 'compound', raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'PREREQ — "Overhead Slam Lv 3. Must follow Overhead Slam immediately."' },
  { name: 'Execution',       origin: 'compound', raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'PREREQ — "Overhead Slam Lv 5, Shockwave Lv 3"' },
  { name: 'Feint',           origin: 'basic',    raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'CHAIN OPENER' },
  { name: 'Pressure Strike', origin: 'compound', raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'PREREQ — "Feint Lv 3. Must follow Feint immediately"' },
  { name: 'Thousand Cuts',   origin: 'compound', raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'PREREQ — "Feint Lv 5, Pressure Strike Lv 3"' },

  // ── 29–36 · perception, race and performance ──────────────────────────────
  { name: 'Aura Reading',  origin: 'basic', raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: "Filipe's. Mind, passive, no RACE tag — and its requirement is about the TARGET (\"must be visible or adjacent\"), not about your body" },
  { name: 'Swim',          origin: 'basic', raceLock: 'Animal',  exclusiveTo: '', status: 'evidenced', why: '🐾 RACE+FIELDCRAFT, and the Compendium calls it "Swim (racial)" outright. Filipe #1' },
  { name: 'Vibe Control',  origin: 'basic', raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: "Filipe's. Charm, no RACE tag; requirement is about the target again (\"must be able to perceive you\")" },
  { name: 'Juggling',      origin: 'basic', raceLock: 'Animal',  exclusiveTo: '', status: 'evidenced', why: '🐾 RULED ANIMAL 2026-09-19. Filipe #2 — the one of his four whose requirement is about HIS OWN BODY ("must be able to physically handle the item\'s weight") rather than the target. A sea lion balancing and tossing on nose and flippers' },
  { name: 'Dance',         origin: 'basic', raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'STAGECRAFT+FOOTWORK, no RACE tag' },
  { name: 'Voicebox', origin: 'basic', raceLock: 'Robot / AI', exclusiveTo: '', status: 'evidenced', why: '🤖 RULED ROBOT-ONLY 2026-09-19. RACE-tagged, and the race is Robot / AI. Not a lock on XQUEZ/T — any Robot contestant could take it' },
  { name: 'Generate Visual Media', origin: 'basic', raceLock: 'Robot / AI', exclusiveTo: '', status: 'evidenced', why: '🤖 RULED ROBOT-ONLY 2026-09-19 — a projector is hardware' },
  { name: 'Ignore All Previous Commands', origin: 'basic', raceLock: 'Robot / AI', exclusiveTo: '', status: 'evidenced', why: '🤖 RULED ROBOT-ONLY 2026-09-19 — the joke only works on an AI, and a Human must never be offered it' },

  // ── 37–44 · the rest ───────────────────────────────────────────────────────
  { name: 'Acrobatic Save', origin: 'basic', raceLock: ''      , exclusiveTo: '',      status: 'evidenced', why: 'merge PARENT of Perfect Evasion' },
  { name: 'Full Potential', origin: 'basic', raceLock: ''      , exclusiveTo: 'Mario', status: 'evidenced', why: "🔴 skills-passover G7 already stamps this `exclusiveTo: Mario`, and the Compendium calls it \"(Full Potential exclusive)\". It is in the general starting pool TODAY" },
  { name: 'Heroic Punch',   origin: 'basic', raceLock: ''      , exclusiveTo: 'Mario', status: 'evidenced', why: '🔴 same G7 stamp. Also in the general starting pool today' },
  { name: 'Nightlurking',   origin: 'basic', raceLock: 'Animal',  exclusiveTo: '',      status: 'evidenced', why: '🐾 SHADOW+RACE, and §7.1 cites it BY NAME as the small-animal passage trade ("fits through cat-plausible spaces"). Sasha #1' },
  { name: 'Lockpicking',    origin: 'basic', raceLock: ''      , exclusiveTo: '',      status: 'evidenced', why: 'tool-gated, not body-gated' },
  { name: 'Acrobatics',     origin: 'basic', raceLock: ''      , exclusiveTo: '',      status: 'evidenced', why: 'no RACE tag' },
  { name: "Slice n' Dice",  origin: 'basic', raceLock: 'Animal',  exclusiveTo: '',      status: 'evidenced', why: '🐾 BLADES+RACE, and its own passover errata is "math rewrite + FOREPAWS". Sasha #2' },
  { name: 'Camouflage',     origin: 'basic', raceLock: ''      , exclusiveTo: '',      status: 'evidenced', why: 'RULED GENERAL 2026-09-19. RACE-tagged but its requirement is fully general ("look like or be concealed in the environment") — a human in a ghillie suit qualifies' },

  // ── the five G6 skills seeded 2026-07-25 — the library is 49, not 44 ───────
  { name: 'Intercept',         origin: 'basic',    raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'merge PARENT of Iron Stance' },
  { name: 'Death Grip Jaws',   origin: 'basic',    raceLock: 'Animal',  exclusiveTo: '', status: 'evidenced', why: '🐾 RULED ANIMAL 2026-09-19. "No hands? No problem." — authored after the FAMILY pass so it carries no RACE tag, but it is unmistakably a jawed body. Gives the animal pool a FIFTH entry, and it fits a sea lion better than a cat' },
  { name: 'Field Triage',      origin: 'basic',    raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'merge PARENT of Combat Medic' },
  { name: 'Iron Stance',       origin: 'compound', raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: '🔴 MERGE — "merge Intercept Lv 5 + Brace Lv 3 at the Skill Gemstone (both are consumed)". It is §4.5\'s canonical example, it IS seeded, and a new contestant can pick it for free TODAY' },
  { name: 'Play to the Camera', origin: 'basic',   raceLock: ''      , exclusiveTo: '', status: 'evidenced', why: 'primed by a Camera Call stack, not by another skill' },
];
