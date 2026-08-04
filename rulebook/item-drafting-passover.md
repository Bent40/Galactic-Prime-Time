# Item Drafting Passover — stocking the box tiers (the content pass)

**Date:** 2026-08-04 · **Status:** 🟢 ROUND 2 — R1–R5 all RULED as proposed and
**Batch A BLESSED** (owner, 2026-08-04). The delivery layer is BUILT: `ItemTemplate`
metadata fields, admin-form inputs, `BOX_TIERS`/`ITEM_SUBTYPES` constants, and
`server/seed-items.js` + `server/seeds/items-batch-a.js` (41 templates). Runbook in
ID-5 — awaiting an owner run against the campaign DB. ⚖ still marks numbers the
owner may tune at the table.

**Source canon:** book §12 / §17.6 / §19–20 · economy-passover GC0–GC6 · the live
affix catalog (27 affixes, Lesser + Normal) · floor canon in the game repo
`GPT_Master_Compendium.md` §3–4 (F1 forest / F2 desert / F3 capital, three routes;
F4–6 pending design).

---

## ID-0 — Session rulings (owner, 2026-08-04) — RULED

1. **Affixes: Lesser AND Normal are both designed** — the live app catalog is the
   source of truth (12 Lesser, 15 Normal). Book §12.3's "only Lesser is designed so
   far" is stale → fix in the book pass (ID-6).
2. **Mythic artifacts are plural.** More than one meta-breaking artifact exists in
   the world; a Mythic box yields exactly one (the pick-one-of-three is the
   *reveal*, not a scarcity rule).
3. **Armor = resistance.** Armor pieces grant flat resistance; higher-tier gear can
   also grant nullification (tier-immunity in §10 vocabulary).
4. **Weapon-table "Cost" = Moments to use.** (Other cost axes possible later.)
5. **ALL items have tiers.** The Crude→Exceptional ladder applies to every
   category, and affixes can be authored for non-weapons (the catalog already has
   armor/shield/tool affixes: Barbed, Steady, Reactive).
6. **Exceptional is a polish tier, not a drop tier.** You *reach* it — via Polish
   Kits (ID-3) and growth-type items.
7. **Limited-magic item = one specific magic.** An orb that casts fireball; the
   item is the spell's only source.
8. **Boxes are generic OR specific.** Specific = boss-specific, quest-specific, or
   floor-themed. Floor canon: F1 green forest, F2 great desert (+70y), F3 grand
   capital (+100y); routes Easy/Medium/Hard. F4–6 out of scope for this pass.

**Sitting round 1 (owner, 2026-08-04):**

9. **Armor covers the part it occupies; resists stack across worn pieces.**
10. **Nullification bands as proposed:** Superior may carry T1 nullification of its
    theme type; Exceptional T2 / full-type on the covered part (numbers stay ⚖ per
    item).
11. **Polish Kits are tiered with d6 odds** — table in ID-3; double success never
    exceeds Exceptional.
12. **Pools are LARGE, and they don't need pre-assembly** — **Creation Kits**
    (owner-introduced) contain a base item of choice + modifier(s) of choice by
    tier, so players assemble the exact gear they want (ladder in ID-4).
13. **App metadata approved** (ID-5 fields land with the delivery phase).
14. **The affix catalog is truth — and extendable.** Book-only entries (Hollow
    Point, Explosive Tip) become candidate *additions*, not deletions.

**Sitting round 2 (owner, 2026-08-04):**

15. **R1–R5 all approved as proposed:** shields' loose rule · Polish-Kit grade
    gating + the Forge as venue · fail = kit consumed, item untouched · Draining's
    once-per-Clock cap goes into the catalog effect text · Balanced + Sharpened II
    are incompatible. (The two catalog edits ride Batch D's reconciliation.)
16. **Batch A BLESSED** — delivered to the seed layer as authored.
17. **Pools keep growing.** Items play a major role in everything; expansion
    batches beyond B/C/D are planned — treat every pool as a floor, not a ceiling.
18. **Skill books & tomes are first-class item content** (the library's "Tome Of
    Submission" is the precedent): items that grant a skill unlock — magic or
    literal skills alike. Mechanic sketch ⚖: consuming the tome makes the named
    skill acquirable/revealed at L0 per §4.4 (the tome IS the external source);
    designed in Batch B.
19. **Growth items are story instruments, not just stat ladders** (owner
    doctrine): design them with an innocent surface and a hidden trigger the GM
    tracks — an item that quietly grows on betrayal, discovered only after you
    kill an NPC friend by mistake. Growth events may advance arcs and tilt
    players morally; the trigger reveal is a designed beat.

---

## ID-1 — The authoring frame: subtypes and what each tier MEANS

**Subtype vocabulary (canonized from the affix "Applicable to:" convention):**

> **Weapon:** Bladed · Crush · Martial (unarmed-class) · Ranged · Thrown
> **Wearable:** Armor (slot-anchored) · Shield · Trinket (ring-class)
> **Carried:** Tool · Consumable · Charged gear · Limited-magic · Kit (ID-3/ID-4) ·
> Growth (ID-3)
> **System:** Key Items · System Items (exempt from tiers/affixes)

**Per-tier meaning by category (⚖ numbers per item):**

| Tier | Weapons (§12.1/12.3 stand) | Armor/Shield | Tools | Consumables |
|---|---|---|---|---|
| Crude | class baseline or worse; 0/0 slots | 1 flat resist, one type, fragile (GM may break on a 1) | does the job with a Moment penalty or narrow scope | 1 use, weak effect |
| Basic | class baseline; 1/0, Lesser | 1 flat resist, one type | does the job | 1–2 uses, standard counter |
| Quality | baseline+ or a quirk; 1/1, ≤Normal | 2 flat resist OR 1 resist two types | scope widens; may remove a Forced-Action class | more uses or a rider |
| Superior | authored identity; 2/1, ≤Higher | 3 flat resist; may carry **T1 nullification** of its theme type | grants a capability (not just relief) | strong effect + rider |
| Exceptional | polished (ID-3); 2/2, ≤Legendary | 4 flat resist; **nullification** T2 / a full type ⚖ | near-skill-grade capability | (n/a — consumables cap at Superior ⚖) |

## ID-2 — Armor rules sliver — RULED (round 1)

- **A. Coverage — RULED:** armor protects the part(s) it occupies.
- **B. Stacking — RULED:** resists stack across worn pieces (the struck part's
  armor counts; global-resist trinkets stay possible as authored specials ⚖).
- **C. Nullification — RULED:** per the ID-1 bands.
- **D. Shields — residual R1:** proposed loose rule stands until ruled — a shield
  grants its resist to whatever part the wielder defends, GM-adjudicated ⚖.

## ID-3 — The Exceptional path — RULED (kit odds), gating PROPOSED

**Polish Kits (odds RULED, owner 2026-08-04).** Consumable upgrade item; applied
during downtime at the Forge ⚖ (venue = residual R2). One kit = one d6 roll:

| Kit grade | Fail | Success (+1 tier) | Double success (+2 tiers) |
|---|---|---|---|
| Crude | 1–3 | 4–6 | — |
| Normal | 1–2 | 3–6 | — |
| Superior | 1 | 2–5 | 6 |

- **Double success never exceeds Exceptional** (RULED).
- Expected tier-steps per kit: 0.5 / 0.67 / 1.0 — a clean monotone curve, and the
  Superior kit's 1-in-6 jackpot is a camera moment.
- **Fail = kit consumed, item untouched** (PROPOSED default — nothing in the
  ladder ever destroys the item; kinder than the slab, fits the show economy).
- **Grade gating (PROPOSED ⚖ — residual R2):** Crude kits polish rungs up to
  →Quality · Normal up to →Superior · **Superior kits are the only path to
  Exceptional and are never sold** (Legendary+ boxes, deep finds). Without gating,
  cheap Crude kits farm Exceptional at 50% a roll and ID-0.6 stops being true.
- (Naming note ⚖: the trio blends ladders — Crude/Superior from items, Normal from
  affixes. Fine as-is; rename if it bugs you.)

**Growth items** — authored specials that level with their wielder via
kill-count / milestone / story triggers, re-checking §12.3 modifier access at each
tier. First one approved in Batch A: the **Incineradile mycelium core**.
Per ID-0.19, each growth item is authored with TWO layers: the public read (what
players think feeds it) and the true trigger (what actually does — possibly moral,
possibly ugly). The discovery of the true trigger is a story beat, authored
alongside the item.

## ID-4 — The pools — counts RULED LARGE, Creation Kits inserted

**Creation Kits (concept RULED; ladder PROPOSED ⚖):** pools don't pre-assemble
every combination — the kit hands assembly to the player:

| Kit | Player assembles |
|---|---|
| Crude Weapon Kit | any Crude base weapon of choice |
| Basic Weapon Kit | any Basic base + **1 Lesser modifier of choice** |
| Quality Weapon Kit | any Quality base + 1 prefix + 1 suffix (≤Normal) |
| Superior Weapon Kit | any Superior base + 2 prefix / 1 suffix (≤Higher; until Higher affixes exist, picks ≤Normal and leaves slots open ⚖) |

- **No Exceptional kit** — Exceptional stays polish-only (ID-0.6 consistency).
- Armor / Tool Creation Kits: same shape, later wave ⚖.
- **GC6 unification:** the Fantasy Item Coupons ARE a Basic Weapon Creation Kit
  split into two vouchers — one redemption flow, one bookkeeping.

**Batches (counts scaled up per round 1 — "large pools"):**

- **Batch A — Lounge-unlock playables (F1-ready) — AUTHORED, see
  `rulebook/item-drafting-batch-a.md`:** Bronze consumable pool (~20) · Bronze
  pity-gear (~12) · coupon/creation-kit beat · the Incineradile box (with the
  mycelium core) · F1 found-box placements.
- **Batch B — the standing catalog ⚖:** Silver base-weapon pool (~18 across
  Basic–Quality, every §12.1 class), armor per slot family (~12), tools (~8),
  limited-magic items (~6), Gold game-changers (~8); **skill books & tomes as a
  designed set (~6 ⚖ — magic AND literal skills, per ID-0.18; "Tome Of
  Submission" is the live precedent)** + magic unlocks; Creation and Polish Kits
  threaded through Silver/Gold pools.
- **Batch C — the top shelf ⚖:** Legendary named list (~6, route-hooked — the
  Easy-route mask is begging), Mythic artifacts (~4; the first Mythic box needs
  three on the table), Godly authoring guidance, Superior Polish Kits, remaining
  growth items.
- **Batch D — repair pass:** tier + subtype the existing 28 templates (12
  untiered), align to §12.1 baselines; apply the ruled catalog edits (Draining's
  once-per-Clock cap · Balanced + Sharpened II incompatibility note).
- **Batches E+ — expansion waves (ID-0.17):** pools keep growing as floors and
  arcs land; F2/F3 themed pools once play approaches them, F4–6 after floor
  design exists.

**Affix reconciliation — RULED direction (catalog is truth, extendable):**
Hollow Point & Explosive Tip → candidate ADDs (tier ⚖) · catalog Spiked/Barbed
effects stand over the book text · residual R4: write Draining's once-per-Clock cap
into its catalog effect text (PROPOSED yes — the abuse case is documented) ·
residual R5: Balanced + Sharpened II incompatibility (PROPOSED yes ⚖).

## ID-5 — App-side delivery — BUILT (2026-08-04)

- **Shipped:** `ItemTemplate` gained `subtype`, `boxTiers`, `themes`, `source`
  (routes accept them; the give-snapshot now carries `subtype`); the admin item
  form has plain inputs for all four; `BOX_TIERS` + `ITEM_SUBTYPES` live in
  `constants.js`; `server/seed-items.js` + `server/seeds/items-batch-a.js`
  (41 templates — no "Basic Weapon Creation Kit" seeded: the live "Basic Weapon
  Coupon" + "Silver Modifier Coupon" ARE that kit as two vouchers).
- **Owner runbook (from `server/`):** `node backup-db.js` → `node seed-items.js`
  (dry run — prints every create and every name collision) → `node seed-items.js
  --apply`. Existing templates are never overwritten without `--force` — expect
  one flagged collision: **Bandage** (library has a Crude one; the seed's Basic
  counter-spec differs — owner picks at apply time).
- Verified here: syntax + seed-data validation + client build. **Not yet run
  against a DB** — the campaign DB lives with the owner's checkout.

## ID-6 — Book pass (after content lands)

Fix §12.3 stale affix line · write ID-0 rulings into §12 (Cost = Moments;
all-items-tiered; armor per ID-2) · add the Exceptional path (Polish Kits + growth)
to §12.3 · Creation Kits + generic-vs-specific boxes into §17.6/§19.3 · pool tables:
app-library-is-truth, book gets pointers (per ID-5 ruling).

## ID-7 — Box Namer (GM tool) — PROPOSED, mockup shipped

Owner request (2026-08-04): after players roll for loot, the GM inputs what
dropped + how it was earned, and gets box names by tier — "Bronze Massacre Box",
"Silver Incineradile Box" — instead of inventing names mid-session.

**Proposed UX** (interactive mockup: `docs/mockups/box-namer-mockup.html` — the
generation logic in it is real, not lorem):
- **Inputs (v2, owner feedback 2026-08-04):** the loot is **picked from the item
  library** (searchable checklist — the Items section already loads it) ·
  earned-by is **picked from a grouped list**: §17.4 Goals + the live Enemies
  section (custom freetext still allowed) · box tier chips, with **Auto**
  inferring from the selected items' actual tier fields (Growth/tome bumps a
  step) — override wins.
- **Output:** ~6 suggestions across three lanes — **earned** (deed lexicon:
  Overkill→Massacre/Carnage…; unmatched freetext passes through title-cased, so
  boss names like "Incineradile" just work) · **contents** (dominant loot
  category: Arsenal/Care-Package/Arcana…) · **showbiz** (Corporation marketing:
  Primetime, Sweeps-Week, Season-Finale…). Click a name to copy; 🎲 rerolls.
- **Build shape:** client-only widget, no server or model changes; wordlists live
  in the component. Placement ⚖: top of the admin Items section (recommended) or
  its own section.

Status: **BUILT (owner approved v2, 2026-08-04)** —
`client/src/components/admin/BoxNamer.jsx`, rendered as a collapsible panel at
the top of the admin Items section. Loot picker uses the live library (already
loaded by the section); enemies fetch lazily from `/api/enemies` on first
expand; suggestions copy to clipboard with a toast. Client build verified.

---

## Residuals — ALL RULED (owner, 2026-08-04 round 2)

R1 shields' loose rule · R2 kit gating + Forge venue · R3 fail = kit consumed,
item untouched · R4 Draining cap → catalog text · R5 Balanced + Sharpened II
incompatible — **all approved as proposed.** R4/R5 are catalog edits queued in
Batch D. No open rules items remain for Batches A–B.

*Next stop: owner runs the ID-5 runbook to seed Batch A, then Batch B authoring
(standing catalog + the skill-tome set).*
