# v2 — Galactic Prime Time, the mythology edition

**What this is.** A second edition of the same TTRPG under a different premise.

- **v1 (this repo's `rulebook/`)** — the live campaign. Abducted humans compete in dungeon
  runs broadcast by an alien **Corporation™**. **FROZEN**: it does not change.
- **v2 (this directory)** — the show is a table in the **Cosmic Casino**. Gods wager on
  contestants; the winner is promoted into the audience and decides how the next 250 years
  of history and myth are remembered.

> ### ⚠️ State of play — read before reviewing anything here
> **v2 is fully DECIDED and almost entirely UNBUILT.** These are design documents.
> **The v2 rulebook does not exist yet.** Nor does a v2 mode in the character-sheet app.
> Judge this as a *design*, not a product. §5 below is the honest gap list.

> ### Reviewing the idea? **This repository is enough.**
> Everything needed to assess the design — the fork, the rulings, the story, the setting,
> the cast, and the prior four-part review including the TTRPG defect catalogue — is here
> or snapshotted into [`canon/`](canon/). The companion repo
> (`Galactic-Prime-Time-Game`) holds the **Godot video game**: the simulation, its tests
> and its seed data. **You do not need it to review the idea**, and nothing in it changes
> the tabletop design.
>
> **Suggested reading order for an idea review:**
> 1. this file · 2. [`design/v1-v2-fork-spec.md`](design/v1-v2-fork-spec.md) — what v2
> changes and why · 3. [`floors/floors-1-3-arc.md`](floors/floors-1-3-arc.md) — the design
> working at full depth on one arc · 4. [`design/v2-decisions.md`](design/v2-decisions.md)
> — every ruling with its reasoning · 5. [`canon/cosmic-casino-canon.md`](canon/cosmic-casino-canon.md)
> — the world · 6. [`canon/prior-review/review-1-ttrpg.md`](canon/prior-review/review-1-ttrpg.md)
> — what a previous reviewer already found wrong with the **v1** system, so you don't
> re-report it.
>
> The v1 rules master is [`../rulebook/gpt-system-v1.0.md`](../rulebook/gpt-system-v1.0.md) —
> read it as the baseline the fork is measured against.

---

## 1. Why v2 lives here and not in the game repo

The Godot project (`Galactic-Prime-Time-Game`) is the *video game*. It owns the sim, the
seed data and the machine-readable corpus, because its tooling consumes them.

But **D-06 ruled v2 is "a new edition of the game book so I can run the game to a group"** —
a tabletop edition. So v2's tabletop material belongs beside the tabletop rulebook.

**The rule, going forward: content lives where it is consumed.**

| Consumer | Needs | Where |
|---|---|---|
| A GM running v2 at a table | rulebook, floor arcs, cast sheets | **here** |
| The Godot sim | mythology corpus, seed data, architecture | game repo |
| Both | setting canon, the design record | game repo, snapshotted into [`canon/`](canon/) |

---

## 2. What's here

| Path | What |
|---|---|
| [`design/v1-v2-fork-spec.md`](design/v1-v2-fork-spec.md) | **Start here.** What v2 changes from v1, chapter by chapter — ~211 graded findings, 461 content records classified, every entry cited |
| [`design/v2-decisions.md`](design/v2-decisions.md) | The decision record — 10 rounds of owner rulings with the reasoning preserved |
| [`design/divinity-accounting.md`](design/divinity-accounting.md) | **What you actually spend** — standing (the people) vs divinity (the prayer income they produce). Read after the fork spec; it is the economy's load-bearing detail |
| [`design/three-way-consistency.md`](design/three-way-consistency.md) | The drift guard: book ↔ app ↔ digital addendum. *Any difference not listed there is a bug* |
| [`floors/floors-1-3-arc.md`](floors/floors-1-3-arc.md) | **The Buried God** — floors 1–3, design complete |
| [`floors/floors-4-6-proposal.md`](floors/floors-4-6-proposal.md) | **The Crowned** — floors 4–6. **Core ruled** (F-01…F-14); the kingdom tree and presiding god drafted |
| [`research/`](research/) | The seven source research passes the fork spec summarises (A–G) |
| [`canon/`](canon/) | **Generated snapshot** of the shared setting canon + cast (§3) |
| [`sync-canon.sh`](sync-canon.sh) | Refreshes `canon/` from the game repo |

**Decision identifiers.** 95 distinct `Q-nn` / `D-nn` items exist across the decision record
and the floors-1–3 arc; the large majority are ruled, and the open ones are listed at the
end of each document. *(An earlier summary of mine said "66 rulings" — that was the highest
question number, not a count.)*

---

## 3. `canon/` is generated — do not edit it

Some v2 material is **canonical in the game repo** because tooling there consumes it:
`scripts/validate_seeds.py` validates the mythology corpus, and
`scripts/generate_patron_roster.py` generates the 24-god roster *from* it. Moving those
files would break both scripts.

So `canon/` is a **provenance-stamped snapshot**, every file carrying its source path and
the game-repo commit it came from. **If `canon/` and the game repo disagree, the game repo
is right — re-run `./v2/sync-canon.sh`.**

It holds the world (`cosmic-casino-canon.md`), the frame decision
(`setting-rebrand-options.md`), the spine (`story-canon.md`), the patron system
(`patron-gods.md`), the digital rulings (`rules-addendum.md`), and three generated cast
references: **the 72 goetic demon gods**, the **24-god patron roster**, and the **223
remaining mythology entities**.

---

## 4. The spine of v2, in one page

**The divinity economy is the whole design.** Almost everything else falls out of it.
**Divinity is not a headcount** — followers are the principal, and the prayer they give each
cycle is the yield you spend. See [`design/divinity-accounting.md`](design/divinity-accounting.md).

```
   SPECTACLE ──▶ Viewers          mass, anonymous, decays when boring
   STORY EVENTS ──▶ Followers     NAMED living beings · 1 divinity = 1 reverent being
      (goals, mercy,   │           villages, people, gods, spared enemies
       rescue)         │           ═ YOUR DIVINITY
                       ├──▶ a cut flows up to your PATRON, negotiated —
                       │    literally whose name the crowd says. Earned, never gifted.
                       ▼
             at thresholds a GOD NOTICES ──▶ Patron
                       │
   SPEND ◀─────────────┴─────────────▶ HOLD
 advancement                    leverage — you may only break a patron's
                                contract by out-holding them; and at the end,
                                your standing in the pantheon you join or found
```

**Consequences that are ruled, not decorative:**

- **Command is not reverence.** A legion bound by force is not a congregation — which is
  why the 72 goetic spirits are powerful and *poor*.
- **A patron taxes the very thing you need to leave them.** The longer you stay, the harder
  leaving gets. The Golden Cage, as a per-session decision.
- **Mercy is the greedy play.** A spared enemy who reveres you is a permanent ledger row; a
  dead one is a one-off spectacle spike. The show pays you to stay whole — and you still
  have to choose.
- **Conquest is not territory, it's congregation** — the proposed spine of floors 4–6.
- **One winner.** Everything resets; only they remember; they author the next 250 years and
  decide what happens to everyone who lost, bounded only by leaving room for humanity to
  survive. Floor 10 is fought on the remains of Earth.

---

## 5. What does NOT exist — the honest gap list

Verified 2026-08-11 against `Galactic-Prime-Time` `36c10ca` / `Galactic-Prime-Time-Game` `c19c6b6`.

| Gap | Detail |
|---|---|
| **No v2 rulebook** | D-06 ruled "one source, two rendered books". Neither the book nor the pipeline exists. `grep -rln "gpt-system-v2\|two renders"` → 0 hits |
| **No v2 mode in the app** | No `version` field on `Character.js`; 0 hits for `divinity`/`epithet`/`champion` in models or constants |
| **The mythology corpus is wired to nothing** | 0 GDScript references to `entities.jsonl`. The engine's god data is `patron_gods.json` — **5 rows** (`controller/dal.gd:18`) — not the 295-entity corpus. This applies to all of it, not just the new Goetia |
| **§17 (The Audience) is unwritten** | The one chapter needing genuine redesign — Exposure forks from a fluid to a graph. Designed, not written |
| **Floors 7–9 do not exist** | Floors 4–6 has its spine, question, scale and carry-overs ruled; its encounters and numbers are unwritten |
| **The Godot sim implements v1 combat, not v2's setting** | 11,416 sim LOC · 17,609 test LOC · 570 tests — genuinely built, and orthogonal to the v2 fork |
| **The v1 app has zero automated tests** | — |

---

## 6. ⚠️ Data integrity — a reviewer must know these

| Finding | Why it matters |
|---|---|
| **The Mongo exports at the repo root are a ~4-month-old April snapshot** | Internal `$date` fields max at **2026-04-16**; last commit 2026-05-05. They hold **44 skills** and are missing the 5 passover additions; **0 of 44** carry the `keywords` field CLAUDE.md says was seeded 2026-07-25. **Anyone analysing them as current will draw wrong conclusions.** The live campaign DB lives with a different checkout |
| **6 of 11 models have no export at all** | Tag, Affix, Enemy, LootBox, NPC, MomentTracker. So the "100 tags / 27 affixes" figures are **not verifiable from these repos** |
| **`data/tags.json:163,472` still say "the Corporation"** | v1 vocabulary surviving in v2 seed data |
| **The consistency guard is 4 rulings stale** | Says the addendum runs R0–R25; it now runs R0–R29. It was correct when written — this is exactly the drift it exists to catch |
| **`validate_seeds.py` passes (exit 0, 264 rows) but validates no mythology rows** | A green run says nothing about the corpus |
| **32 `PROVISIONAL` markers** across the design set | They await the owner, not a reviewer |

---

## 7. What a reviewer needs that is not in this repo

| For | Required |
|---|---|
| **v1 rules review** | Nothing — ready now |
| **v2 design review** | Nothing — ready now. Review it as a *design* |
| **Godot code / sim review** | A **Godot 4.7 binary**. `run_sim_tests.sh` exits **3 = SKIP** without one — **570 tests discovered, 0 executed.** A SKIP is not a pass |
| **App code review** | `npm ci` in `client/` and `server/` (no `node_modules` committed) |
| **Running the app** | `MONGODB_URI`, `JWT_SECRET`, `ADMIN_SECRET` |
| **Content review** | The **live Atlas campaign DB**, or fresh exports — the committed ones are stale (§6) |
| **Historical origins** | A PDF reader for `Galactic-Prime-Time-Game/docs/archive/` |
| **Resolving PROVISIONAL items** | The owner |

**Suggested order:** v1 rules → v2 design coherence → drift/integrity → *then* code once the
Godot binary is available → content once the DB is → playtest last.

**Before handing this off, tag a commit in each repo.** Both tips moved twice inside half an
hour during this session's work; a reviewer needs a fixed point.
