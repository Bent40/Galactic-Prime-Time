# Tags Passover — the sitting worksheet

**Date:** 2026-07-25 · **Status:** GT1–GT5 APPROVED + batch 1 approved (owner,
2026-07-25). Batches 2–5 authored below — awaiting owner overrules.
**Applied by:** `server/seedTagEffects.js` (dry-run default; writes each tag's
`effect` line: domains + rider).
**Scope:** mechanical effects for all 100 tags (TABLE canon). Descriptions (the earn
guides) are already seeded; this sitting decides what tags DO.
**Precedent honored:** the six-pattern effect model you approved for the game on
2026-07-17 (game repo, campaign-residuals-audit §1.2), re-phrased for a GM'd table and
de-mythologized (pattern 3's "patron gods" become your audience Patrons — big donors).

**After your answers:** effects land in each tag's `effect` field via a dry-run-first
seeding script (players see them in the picker and on their chips), riders go into the
book as a short table, and the lifecycle rule joins book §18.

---

## Part 1 — Global calls

### GT1 — The six patterns, table edition (approve the menu?)

1. **On-brand spotlight.** Each tag carries 1–3 **domains**. Doing your tag's thing on
   camera is what the crowd pays for: on-brand plays are the reliable way to move
   Viewers (and, when Reinforced, Followers). The GM reads domains, not 100 bespoke
   rules.
2. **The Show writes for you.** Goals and Directives are drawn toward your tags —
   Menace pulls cruelty dares, Fan Favorite pulls crowd-pleasers, Safe Mode pulls "No
   Safety Play" bait. Your identity shapes your quest feed.
3. **Patron draw.** Patrons — the one-time big donors — adopt contestants whose tags
   match their taste. Tag domains steer WHO takes interest in you and what paid Goals
   they set. (The audience-economy version of the game's god-lens; no gods here.)
4. **Lifecycle is the dial.** Active = normal effect · **Reinforced = doubled pull and
   the tag can only be lost by dramatically betraying it** · Faded = no effect until
   played back into. One rule scales every tag.
5. **Flagship riders (scarce).** At most ~10 hand-picked tags get one bespoke
   mechanical trigger each. Everything else stays declarative — keeps 100 tags honest.
6. **Tag gates.** Items, skills, Directives, and unlocks may REQUIRE a tag ("Sponsors
   only lend the chainsaw-guitar to a certified Menace"). Authored per content piece,
   not per tag.

### GT2 — The domain vocabulary (12 words; approve/edit?)

| Domain | The crowd is paying for… |
|---|---|
| carnage | kills, gore, overkill |
| daring | risk, stunts, recklessness |
| showmanship | performance, speeches, style |
| comedy | failure-comedy, slapstick, timing |
| heart | empathy, protection, mercy |
| menace | fear, intimidation, villainy |
| cunning | stealth, deception, schemes |
| grit | survival, endurance, comebacks |
| teamwork | combos, formations, assists |
| chaos | collateral, mayhem, unpredictability |
| craft | improvisation, repairs, clever solutions |
| meta | fourth-wall play, production awareness |

### GT3 — Storage & visibility (approve?)

Each tag's DB `effect` field gets one line: `Domains: X, Y.` plus the rider sentence if
it has one. Players see it in the tag picker and on owned chips (already wired). The
book's §18 gains the pattern rules + the rider table; per-tag text stays in the DB/wiki.

### GT4 — Rider candidates (~10 — pick, cut, amend)

| Tag | Proposed rider |
|---|---|
| The Monologue | Once per session, a delivered monologue makes your next action's crowd payout triple. |
| Comeback Stage | Returning from bleed-out or Helpless, your next action can't be interrupted and pays double hype. |
| Fan Favorite | Once per session, ask the crowd for a Goal of your choice (GM picks its reward honestly). |
| Scene Stealer | Once per session, redirect an ally's Camera Call spotlight onto yourself mid-scene. |
| The Bit | The third performance of your bit in a session is an automatic Viewer spike. |
| Nine Lives | Once per session, reroll one Forced Action die where the escape was movement-based. |
| Unkillable | Once per campaign arc, refuse a death: you land in bleed-out instead, regardless of cause. |
| Method Actor | Staying in character through a Forced Action consequence converts it into crowd favor. |
| Munchkin | Once per campaign, an exploit you found is grandfathered for you even after the GM patches it. |
| LEEROY JENKINS | Acting first in an ambush YOU triggered, your opening action costs 1 less Moment. |

### GT5 — Batch flow

100 tags in five themed batches of ~20 (catalog order, roughly: film/TV core ×2, crowd
& animal, K-pop/idol, software & production). You approve/amend each batch; I seed after
each approval or all at the end — your call.

---

## Part 2 — Batch 1 (tags 1–20): domains + rider flags

| # | Tag | Domains | Rider? |
|---|---|---|---|
| 1 | Documentary | showmanship, meta | — |
| 2 | Playa | daring | — |
| 3 | Absolute Cinema | showmanship, daring | — |
| 4 | Edgy | menace, carnage | — |
| 5 | Anime | showmanship, chaos | — |
| 6 | LEEROY JENKINS | daring, chaos | GT4 rider |
| 7 | Scrub | comedy | — |
| 8 | Stinker | comedy, chaos | — |
| 9 | Pinky Promise | heart, meta | — |
| 10 | Unkillable | grit | GT4 rider |
| 11 | Oops | comedy, chaos | — |
| 12 | Vengeful | menace, grit | — |
| 13 | Menace | menace | — |
| 14 | Animal Planet | heart | — |
| 15 | Fan Favorite | showmanship, heart | GT4 rider |
| 16 | Corporate Asset | meta | — |
| 17 | Tragic | heart, grit | — |
| 18 | Bolivian Army Ending | grit, daring | — |
| 19 | Chunky Salsa Rule | carnage | — |
| 20 | Coconut Superpowers | grit, comedy | — |

## Part 3 — Batch 2 (tags 21–40): the drama core

| # | Tag | Domains | Rider? |
|---|---|---|---|
| 21 | Protagonist | showmanship, daring | — |
| 22 | Antagonist | menace, meta | — |
| 23 | Anti-Hero | menace, heart | — |
| 24 | Incorrigible | comedy, daring | — |
| 25 | No Cure For Evil | chaos, menace | — |
| 26 | Munchkin | cunning, craft, meta | GT4 rider |
| 27 | Little Dead Rising Hood | carnage, comedy | — |
| 28 | Mascot | heart, showmanship | — |
| 29 | Butcher | carnage | — |
| 30 | Survivor | grit | — |
| 31 | Spy | cunning | — |
| 32 | Liability | chaos, comedy | — |
| 33 | Method Actor | showmanship, grit | GT4 rider |
| 34 | Understudy | craft, cunning | — |
| 35 | Typecast | craft, meta | — |
| 36 | Prima Donna | showmanship, comedy | — |
| 37 | Scene Stealer | showmanship, cunning | GT4 rider |
| 38 | The Monologue | showmanship, menace | GT4 rider |
| 39 | Fourth Wall | meta, showmanship | — |
| 40 | Box Office Bomb | comedy, daring | — |

## Part 4 — Batch 3 (tags 41–60): production & the animal block

| # | Tag | Domains | Rider? |
|---|---|---|---|
| 41 | Director's Cut | grit, showmanship | — |
| 42 | Certified Fresh | daring, meta | — |
| 43 | SAG Dispute | meta, grit | — |
| 44 | Direct to DVD | heart, meta | — |
| 45 | Callback | grit, showmanship | — |
| 46 | Nepotism Hire | comedy, meta | — |
| 47 | One Star Review | grit, showmanship | — |
| 48 | Student Film | daring, craft | — |
| 49 | Craft Services | comedy, heart | — |
| 50 | Resting Loser Face | comedy, grit | — |
| 51 | Applause Machine | comedy, showmanship | — |
| 52 | Unlikely Menace | grit, cunning | — |
| 53 | Adorable Threat | heart, carnage | — |
| 54 | Waddled Into Frame | comedy, chaos | — |
| 55 | The Bit | showmanship, comedy | GT4 rider |
| 56 | Bark Bark Bark | teamwork, comedy | — |
| 57 | Sea World Reject | showmanship, craft | — |
| 58 | Flipper Mode | craft, grit | — |
| 59 | Crowd's Baby | heart, meta | — |
| 60 | Nine Lives | daring, grit | GT4 rider |

## Part 5 — Batch 4 (tags 61–80): cats, birds & the idol block

| # | Tag | Domains | Rider? |
|---|---|---|---|
| 61 | Knock It Off The Table | chaos, comedy | — |
| 62 | Feral Consultant | chaos, cunning | — |
| 63 | Witnessed | meta, cunning | — |
| 64 | Murder Mittens | carnage, daring | — |
| 65 | Dead Drop | cunning, meta | — |
| 66 | Vet Visit | comedy, heart | — |
| 67 | Territory Marked | cunning, menace | — |
| 68 | 3am Energy | chaos, daring | — |
| 69 | Indoor Cat | cunning, craft | — |
| 70 | Birdwatcher | cunning, grit | — |
| 71 | Main Vocalist | showmanship, meta | — |
| 72 | Visual | showmanship | — |
| 73 | Maknae | comedy, daring | — |
| 74 | Rap Line | showmanship, craft | — |
| 75 | Formation | teamwork, showmanship | — |
| 76 | Comeback Stage | grit, showmanship | GT4 rider |
| 77 | Internal Dispute | chaos, showmanship | — |
| 78 | Solo Debut | daring, showmanship | — |
| 79 | Parasocial | heart, meta | — |
| 80 | All-Kill | showmanship, carnage, daring | — |

## Part 6 — Batch 5 (tags 81–100): the software block & finale

| # | Tag | Domains | Rider? |
|---|---|---|---|
| 81 | Disbandment Arc | chaos, heart | — |
| 82 | Fan Service | showmanship, meta | — |
| 83 | Blue Screen | comedy, meta | — |
| 84 | Legacy Code | comedy, grit | — |
| 85 | Corrupted File | chaos, comedy | — |
| 86 | Unpatched | grit, meta | — |
| 87 | 404 | comedy, meta | — |
| 88 | Out of Memory | comedy, chaos | — |
| 89 | Safe Mode | grit, craft | — |
| 90 | Null Pointer | comedy, meta | — |
| 91 | Overclock | daring, grit | — |
| 92 | Peer Review | comedy, cunning | — |
| 93 | Technical Difficulties | comedy, chaos, teamwork | — |
| 94 | Off Script | chaos, showmanship | — |
| 95 | Crossover Event | teamwork, chaos | — |
| 96 | Genre Shift | showmanship, meta | — |
| 97 | Background Character | cunning, meta | — |
| 98 | The Recast | craft, teamwork | — |
| 99 | Blooper Reel | comedy, grit | — |
| 100 | Post-Credits Scene | meta, daring | — |
