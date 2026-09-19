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
 *   animalOnly  the skill belongs to a body a human does not have.
 *   exclusiveTo one contestant's own skill (§4.4 "character-exclusive"), or a
 *               race that is no longer offered at creation. '' for none.
 *               ⚖ The FIELD is proposed in skills-passover G7 and does not exist
 *               on the model yet; these values are the argument for building it.
 *   status      'evidenced' — the live data already says so (a RACE family tag,
 *                             a consume/prereq clause in `requirements`).
 *               'proposed'  — mine. The owner's call.
 */

module.exports = [
  // ── 1–9 · the core melee/field kit ─────────────────────────────────────────
  { name: 'Controlled Sweep', origin: 'basic', animalOnly: false, exclusiveTo: '', status: 'evidenced', why: 'no prereq, no RACE tag' },
  { name: 'Quick Step',       origin: 'basic', animalOnly: false, exclusiveTo: '', status: 'evidenced', why: 'no prereq, no RACE tag' },
  { name: 'Seal The Wound',   origin: 'basic', animalOnly: false, exclusiveTo: '', status: 'evidenced', why: 'no prereq; merge PARENT of Combat Medic, which is the opposite of compound' },
  { name: 'Strong Strike',    origin: 'basic', animalOnly: false, exclusiveTo: '', status: 'evidenced', why: 'no prereq, no RACE tag' },
  { name: 'Counter-Surge',    origin: 'basic', animalOnly: false, exclusiveTo: '', status: 'evidenced', why: 'no prereq; merge PARENT of Counterscript' },
  { name: 'Read The Pattern', origin: 'basic', animalOnly: false, exclusiveTo: '', status: 'evidenced', why: 'no prereq; merge PARENT of Counterscript' },
  { name: 'Pressure Hold',    origin: 'basic', animalOnly: false, exclusiveTo: '', status: 'evidenced', why: 'no prereq; merge PARENT of Vice Grip' },
  { name: 'Brace',            origin: 'basic', animalOnly: false, exclusiveTo: '', status: 'evidenced', why: 'no prereq; merge PARENT of Iron Stance' },
  { name: 'Tactical Roll',    origin: 'basic', animalOnly: false, exclusiveTo: '', status: 'evidenced', why: 'no prereq; merge PARENT of Perfect Evasion' },

  // ── 10–19 · magic ──────────────────────────────────────────────────────────
  { name: 'Poison Ball',  origin: 'basic',    animalOnly: false, exclusiveTo: '', status: 'evidenced', why: 'the entry point to the toxin line' },
  { name: 'Poison Wall',  origin: 'compound', animalOnly: false, exclusiveTo: '', status: 'evidenced', why: 'PREREQ — requirements: "Mind 3. Poison Ball Lv 3."' },
  { name: 'Frost Ball',   origin: 'basic',    animalOnly: false, exclusiveTo: '', status: 'evidenced', why: 'the entry point to the cold line' },
  { name: 'Frost Wall',   origin: 'compound', animalOnly: false, exclusiveTo: '', status: 'proposed',  why: 'PREREQ by symmetry — skills-passover lists a skill-prereq but the live requirements string says only "Mind 3." See the DRIFT note below' },
  { name: 'Fire Ball',    origin: 'basic',    animalOnly: false, exclusiveTo: '', status: 'evidenced', why: 'the entry point to the fire line' },
  { name: 'Fire Wall',    origin: 'compound', animalOnly: false, exclusiveTo: '', status: 'proposed',  why: 'PREREQ by symmetry — same drift as Frost Wall' },
  { name: 'Elemental Confluence', origin: 'compound', animalOnly: false, exclusiveTo: '', status: 'evidenced', why: 'MERGE — "Consume Poison Ball Lv 5, Frost Ball Lv 5, and Fire Ball Lv 5 at the Skill Gemstone. No other method."' },
  { name: 'Telekinesis',  origin: 'basic',    animalOnly: false, exclusiveTo: '', status: 'evidenced', why: 'no prereq; its sustain cost is its own price' },
  { name: 'Telepathy',    origin: 'basic',    animalOnly: false, exclusiveTo: '', status: 'evidenced', why: 'the entry point to the psychic line' },
  { name: 'Mind Burst',   origin: 'compound', animalOnly: false, exclusiveTo: '', status: 'evidenced', why: 'PREREQ — requirements: "Mind 4. Telepathy Lv 3."' },

  // ── 20–28 · the three CHAINS. Openers are basic; every follow-up is not. ───
  { name: 'Pounce',          origin: 'basic',    animalOnly: false, exclusiveTo: '', status: 'evidenced', why: 'CHAIN OPENER, and NOT RACE-tagged — its requirement reads "Light Small Weapon (Claws or Knife type)", and the knife is the proof' },
  { name: 'Slip Through',    origin: 'compound', animalOnly: false, exclusiveTo: '', status: 'evidenced', why: 'PREREQ — "Pounce Lv 3. Must follow Pounce immediately"' },
  { name: 'Decapitate',      origin: 'compound', animalOnly: false, exclusiveTo: '', status: 'evidenced', why: 'PREREQ — "Pounce Lv 5, Slip Through Lv 3"' },
  { name: 'Overhead Slam',   origin: 'basic',    animalOnly: false, exclusiveTo: '', status: 'evidenced', why: 'CHAIN OPENER; merge PARENT of Earthbreaker' },
  { name: 'Shockwave',       origin: 'compound', animalOnly: false, exclusiveTo: '', status: 'evidenced', why: 'PREREQ — "Overhead Slam Lv 3. Must follow Overhead Slam immediately."' },
  { name: 'Execution',       origin: 'compound', animalOnly: false, exclusiveTo: '', status: 'evidenced', why: 'PREREQ — "Overhead Slam Lv 5, Shockwave Lv 3"' },
  { name: 'Feint',           origin: 'basic',    animalOnly: false, exclusiveTo: '', status: 'evidenced', why: 'CHAIN OPENER' },
  { name: 'Pressure Strike', origin: 'compound', animalOnly: false, exclusiveTo: '', status: 'evidenced', why: 'PREREQ — "Feint Lv 3. Must follow Feint immediately"' },
  { name: 'Thousand Cuts',   origin: 'compound', animalOnly: false, exclusiveTo: '', status: 'evidenced', why: 'PREREQ — "Feint Lv 5, Pressure Strike Lv 3"' },

  // ── 29–36 · perception, race and performance ──────────────────────────────
  { name: 'Aura Reading',  origin: 'basic', animalOnly: false, exclusiveTo: '', status: 'evidenced', why: "Filipe's. Mind, passive, no RACE tag — and its requirement is about the TARGET (\"must be visible or adjacent\"), not about your body" },
  { name: 'Swim',          origin: 'basic', animalOnly: true,  exclusiveTo: '', status: 'evidenced', why: '🐾 RACE+FIELDCRAFT, and the Compendium calls it "Swim (racial)" outright. Filipe #1' },
  { name: 'Vibe Control',  origin: 'basic', animalOnly: false, exclusiveTo: '', status: 'evidenced', why: "Filipe's. Charm, no RACE tag; requirement is about the target again (\"must be able to perceive you\")" },
  { name: 'Juggling',      origin: 'basic', animalOnly: true,  exclusiveTo: '', status: 'proposed',  why: '🐾 MY PICK for Filipe #2. Not RACE-tagged — but it is the only one of his four whose requirement is about HIS OWN BODY ("must be able to physically handle the item\'s weight"), and its own errata is "range reconcile + disarm gate". A sea lion balancing and tossing on nose and flippers is the species image. OWNER CALL' },
  { name: 'Dance',         origin: 'basic', animalOnly: false, exclusiveTo: '', status: 'evidenced', why: 'STAGECRAFT+FOOTWORK, no RACE tag' },
  { name: 'Voicebox',                   origin: 'basic', animalOnly: false, exclusiveTo: 'XQUEZ/T', status: 'proposed', why: '⚠️ RACE-tagged but ROBOT, not animal. With Robot/AI hidden from creation it belongs to no pool — lock it to the contestant rather than mislabel it animal' },
  { name: 'Generate Visual Media',      origin: 'basic', animalOnly: false, exclusiveTo: 'XQUEZ/T', status: 'proposed', why: '⚠️ same — a projector is hardware' },
  { name: 'Ignore All Previous Commands', origin: 'basic', animalOnly: false, exclusiveTo: 'XQUEZ/T', status: 'proposed', why: '⚠️ same — the joke only works on an AI. A human must never be offered this' },

  // ── 37–44 · the rest ───────────────────────────────────────────────────────
  { name: 'Acrobatic Save', origin: 'basic', animalOnly: false, exclusiveTo: '',      status: 'evidenced', why: 'merge PARENT of Perfect Evasion' },
  { name: 'Full Potential', origin: 'basic', animalOnly: false, exclusiveTo: 'Mario', status: 'evidenced', why: "🔴 skills-passover G7 already stamps this `exclusiveTo: Mario`, and the Compendium calls it \"(Full Potential exclusive)\". It is in the general starting pool TODAY" },
  { name: 'Heroic Punch',   origin: 'basic', animalOnly: false, exclusiveTo: 'Mario', status: 'evidenced', why: '🔴 same G7 stamp. Also in the general starting pool today' },
  { name: 'Nightlurking',   origin: 'basic', animalOnly: true,  exclusiveTo: '',      status: 'evidenced', why: '🐾 SHADOW+RACE, and §7.1 cites it BY NAME as the small-animal passage trade ("fits through cat-plausible spaces"). Sasha #1' },
  { name: 'Lockpicking',    origin: 'basic', animalOnly: false, exclusiveTo: '',      status: 'evidenced', why: 'tool-gated, not body-gated' },
  { name: 'Acrobatics',     origin: 'basic', animalOnly: false, exclusiveTo: '',      status: 'evidenced', why: 'no RACE tag' },
  { name: "Slice n' Dice",  origin: 'basic', animalOnly: true,  exclusiveTo: '',      status: 'evidenced', why: '🐾 BLADES+RACE, and its own passover errata is "math rewrite + FOREPAWS". Sasha #2' },
  { name: 'Camouflage',     origin: 'basic', animalOnly: false, exclusiveTo: '',      status: 'proposed',  why: '⚖ RACE-tagged with NO owner in the party, and its requirement is fully general ("look like or be concealed in the environment"). A human in a ghillie suit qualifies, so I read the tag as aspirational. OWNER CALL' },

  // ── the five G6 skills seeded 2026-07-25 — the library is 49, not 44 ───────
  { name: 'Intercept',         origin: 'basic',    animalOnly: false, exclusiveTo: '', status: 'evidenced', why: 'merge PARENT of Iron Stance' },
  { name: 'Death Grip Jaws',   origin: 'basic',    animalOnly: true,  exclusiveTo: '', status: 'proposed',  why: '🐾 "No hands? No problem." — authored after the FAMILY pass so it carries no RACE tag, but it is unmistakably a jawed body. It would give the animal pool a FOURTH option, and it fits a sea lion better than it fits a cat. OWNER CALL' },
  { name: 'Field Triage',      origin: 'basic',    animalOnly: false, exclusiveTo: '', status: 'evidenced', why: 'merge PARENT of Combat Medic' },
  { name: 'Iron Stance',       origin: 'compound', animalOnly: false, exclusiveTo: '', status: 'evidenced', why: '🔴 MERGE — "merge Intercept Lv 5 + Brace Lv 3 at the Skill Gemstone (both are consumed)". It is §4.5\'s canonical example, it IS seeded, and a new contestant can pick it for free TODAY' },
  { name: 'Play to the Camera', origin: 'basic',   animalOnly: false, exclusiveTo: '', status: 'evidenced', why: 'primed by a Camera Call stack, not by another skill' },
];
