# Weapon Research — the graded item corpus

**Started 2026-08-25 · Status: 🟡 TRANCHE 1 of N — resumable, incomplete**
Purpose: build a corpus of weapons/artifacts from myth + the anime/manhwa/manhua/game
canon, extracted into a schema that grades each one onto **GPT's own axes** so it can be
placed: which floor band, which route or idea it serves, and how a party gets it.

> **Why breadth, not a sample (owner, 2026-08-25):** the output has to fill a **9 floors ×
> 3 routes × 3 acquisition classes** grid. A dozen archetypes cannot populate that. The
> essence taxonomy is a *field* on each entry, not the deliverable.

---

## W-0 — ⚠️ Method note, and the blocker

**Direct page fetching is blocked by this container's network egress policy** — fan wikis
*and* Wikipedia alike (`EGRESS_BLOCKED` on every domain tried; `curl` gets 000). **Search
still works.** So tranche 1 was harvested from search-result summaries, not page reads.

| | |
|---|---|
| **Fidelity** | Lower than a page read. Summaries give abilities and acquisition but rarely full stat blocks or the fine print |
| **Throughput** | ~2 weapons per search → a 60–80 entry corpus is 30–40 searches |
| **Provenance** | ⚠️ **Every entry names its source.** Fan wikis are user-authored and inconsistent; do not silently blend them with myth sources |
| **Unblocked route** | Either an environment with open egress, or the owner pastes pages in. Neither is needed to keep going — search-only just costs fidelity |

**Nothing in this file is written from memory.** An entry with no source line is a bug.

---

## W-1 — ⭐ The find: cultivation fiction already solved floor-grading

The single most useful structural result so far, and it was not the thing I went looking for.

**Cultivation fiction has a standardised weapon ladder**, near-universal across the genre:
**Common → Spiritual → Earth → Heaven → Divine.** *Apotheosis* runs a longer eight-rung
version: **Huang (Yellow) → Xuan (Black) → Di/Ling (Earth/Spirit) → Tian/Xian
(Heaven/Immortal) → Sheng (Holy/Saint) → Shen (Divine) → Zhi Zhun Shen (Supreme Divine) →
Hun Dun Zhi (Primordial)**. *Global Martial Arts* grades the divine band alone into five:
Divine → Half-Step Divine → Holy Divine → Imperial Divine → True Divine.

🔴 **That is GPT's problem, already solved, by an entire genre, for a paying audience.**
Eight rungs against our nine floors plus the F10 free-for-all. Two things follow:

1. **The M-1…M-5 material bands could adopt a proven ladder** instead of an invented one —
   and readers of the genre will find it *legible on sight*, which is free comprehension.
2. **The genre grades the DIVINE band internally.** We treat "apex" as one step (M-5).
   They spend five rungs there, because that is where their audience lives longest. If F7–F9
   is meant to feel like ascending rather than plateauing, that is the lesson.

⚠️ **Do not import the vocabulary raw** — "Heaven/Divine" is exactly the register S-0's
firewall keeps out of v1. The *ladder shape* crosses; the theology does not.

---

## W-2 — The extraction schema

Every entry carries these. Fields the source does not support are left blank, never guessed.

| Field | What it holds |
|---|---|
| `name` / `source_work` | The weapon, and what it is from |
| `origin` | **mythological** (a real-world myth predates it) · **derived** (a myth weapon renamed) · **invented** |
| `form` | What it physically is — class matters, GPT weapons are 2–4 damage by class |
| `essence` | The power-concept. See W-3 |
| `quantitative_or_categorical` | 🔴 **The load-bearing field.** Does it hit *harder*, or does it do a *thing numbers cannot*? L-14 ruled stats are the key and not the gun, so **only categorical powers can ride an apex item** |
| `cost` | What it takes from the wielder. Myth weapons almost always have one; invented ones often do not |
| `requirement_shape` | What the wielder must *be* to use it — the §12.1 requirement, post-L-14 |
| `acquisition` | 🎯 **loot** (it drops) · **crafted** (you make it from a carve) · **story** (it only exists after a problem is solved) |
| `band_read` | Which GPT floor its power level suggests, and why |
| `route_fit` | Which route/idea it serves — Easy (the plague/Nullrot), Medium (demon politics/Bex), Hard (the Loong/the hunt), or shared |
| `source` | 🔗 The URL. Mandatory |

---

## W-3 — The essence list (provisional, grows with the corpus)

Working set. **Not blessed** — it is an emergent classification and tranche 1 is too small
to trust it. Current buckets: **severance** (cuts the uncuttable) · **inevitability** (does
not miss / returns) · **dominion** (commands a domain rather than damaging) · **oath/geas**
(binds, and charges the wielder) · **multiplicity** (one becomes many) · **restoration** ·
**world-scale** (ends a place, not a person) · **transformation** (the weapon changes shape
to the need) · **redirection** (takes an attack and sends it elsewhere).

**GPT already sits on this grid without having named it:** *Mistletoe* is **severance** and
is myth-accurate (the one thing unsworn); the *Seal-Anchors* in Cursed Gold are **dominion**;
*Forest Resin* is **redirection** at consumable scale.

---

## W-4 — Tranche 1

### Solo Leveling (manhwa) — the acquisition axis, cleanly demonstrated

| | Kamish's Wrath | Baruka's Dagger |
|---|---|---|
| **origin** | invented | invented |
| **form** | paired daggers | dagger |
| **essence** | severance (dragon-derived) | — (a straight stat item) |
| **quant/cat** | **quantitative** (+1500 attack) | **quantitative** (+110 atk, +10 agility) |
| **acquisition** | 🎯 **crafted, then story** — forged by Thomas Andre from the dragon Kamish's fang, then *held unused for eight years* and given to Jinwoo for sparing his guild | 🎯 **loot** — a drop from killing Baruka |
| **band_read** | apex. The gap (+1500 vs +110) is ~14×, roughly GPT's F1→F5 band spread | early-mid |
| **route_fit** | Hard — it is literally *a dragon's fang made into a weapon*, which is the Loong's whole anxiety |

⭐ **The lesson is the pairing, not either item.** The same series gives a boss-drop dagger
and a dragon-fang apex, and the apex is gated **twice** — you must forge it *and* be given
it. **Two gates on one object is how a genre signals "endgame"**, and GPT currently gates
apex items once (a carve). Worth stealing.
🔗 [Baruka's Dagger](https://solo-leveling.fandom.com/wiki/Baruka's_Dagger) ·
[Category:Weapons](https://solo-leveling.fandom.com/wiki/Category:Weapons) ·
[ranked list](https://www.sportskeeda.com/anime/solo-leveling-all-9-sung-jinwoo-s-weapons-ranked-weakest-strongest)

### Nanatsu no Taizai (anime/manga) — categorical powers, and a shared gating rule

| Weapon | Essence | Quant/cat | Note |
|---|---|---|---|
| **Chastiefol** | **transformation** | **categorical** | Ten distinct forms (a pillow; "Form Five: Increase" → thousands of kunai). Each form has a *true form* that costs **immense physical strain** — a cost that scales with the power drawn |
| **Lostvayne** | **multiplicity** | **categorical** | Creates four clones of the wielder |
| **Gideon** | **redirection** | **categorical** | Absorbs magical attacks and channels them into the earth |

⭐ **All three are categorical, and all three share one acquisition rule:** a Sacred Treasure
is issued to *a specific person* and "allows the user to draw out their powers to their full
potential" — **the weapon amplifies who you already are.** That is L-14's ruling stated as
fiction: *stats are the key, not the gun.* Independent convergence on our own rule.
⚙️ **Chastiefol's true-form strain is the mechanic GPT is missing** — an item whose *higher
mode* costs the body. §12.5 has uses/charges; it has no "you may push this, and it will hurt".
🔗 [Sacred Treasure](https://nanatsu-no-taizai.fandom.com/wiki/Sacred_Treasure) ·
[Chastiefol](https://nanatsu-no-taizai.fandom.com/wiki/Chastiefol) ·
[Category:Weapons](https://nanatsu-no-taizai.fandom.com/wiki/Category:Weapons)

### Cross-series aggregators found (not yet mined)

- **Anime Weapons Wiki** — cross-series, the best single entry point found so far.
  🔗 [Category:Sacred Treasure](https://anime-weapons.fandom.com/wiki/Category:Sacred_Treasure)
- **Cultivation levels of light novels Wiki** — the genre-wide ladder.
  🔗 [Weapon tiers](https://cultivation-levels-of-light-novels.fandom.com/wiki/Weapon_tiers)
- **Apotheosis Wiki** — the eight-rung ladder in W-1.
  🔗 [Weapon Tiers](https://apotheosis-manga.fandom.com/wiki/Weapon_Tiers)
- **Arifureta Wiki** — artifact/crafting系 series, good for the *crafted* acquisition class.
  🔗 [Artifact](https://arifureta.fandom.com/wiki/Artifact)

---

## W-5 — The sweep queue

Ordered so each pass adds a *distinct* grading signal rather than more of the same.

| # | Target | What it is for |
|---|---|---|
| 1 | Classical myth — Norse · Greek · Celtic · Japanese · Chinese · Hindu · Islamic | The **essence averages**. Myth weapons reliably carry a cost; this is where the "what is an apex item ABOUT" answer lives |
| 2 | Cultivation manhua ladders — Apotheosis · Global Martial Arts · Eternal Supreme | **Band grading.** W-1's ladder, verified across series |
| 3 | Progression manhwa — Solo Leveling · Tower of God · Omniscient Reader | **Acquisition classes.** These genres are explicit about drop vs craft vs story |
| 4 | Sacred-set anime — Nanatsu no Taizai · Fate (Noble Phantasms) · Akame ga Kill (Teigu) | **Categorical powers**, and per-wielder gating |
| 5 | Crafting-heavy — Arifureta · Dungeon Meshi · Frieren | **The crafted class**, and material-driven power (our M-band model) |
| 6 | Games with real loot tables — Elden Ring · Monster Hunter · Diablo | **Distribution shape** — how many commons per unique, which is what fills the grid |

**Resume by:** appending to W-4 under a new tranche heading, keeping the schema, and never
dropping the source line.
