# Item Drafting — Batch A: Lounge-unlock playables (PROPOSAL)

**Date:** 2026-08-04 · **Status:** 🟢 BLESSED (owner, 2026-08-04) — delivered to
the seed layer as `server/seeds/items-batch-a.js` (41 templates; the coupon beat
rides the library's existing "Basic Weapon Coupon" + "Silver Modifier Coupon"
vouchers instead of a new template). Seed via the ID-5 runbook. Companion to
`item-drafting-passover.md` (ID-4). Standard counter behavior: **one use of a
condition counter reduces its condition by one tier**.

---

## A-1 — Bronze bulk-utility consumable pool (~20) ⚖

The 2d3-per-box pool and the Bronze-shop shelf. Corporation-branded necessities.

| Item | Tier | Subtype | Effect (⚖) |
|---|---|---|---|
| Bandage | Basic | Consumable (2 uses) | −1 Bleeding tier per use |
| Antitoxin | Basic | Consumable (2 uses) | −1 Poison tier per use |
| Burn Gel | Basic | Consumable (2 uses) | −1 Burn tier per use |
| Thermal Pack | Basic | Consumable (2 uses) | −1 Chill tier per use |
| Antiseptic Wash | Basic | Consumable (2 uses) | −1 Infection tier per use |
| Smelling Salts | Basic | Consumable (2 uses) | −1 Shock tier per use (works on T1–T2 only) |
| Antivenom Injector | Quality | Consumable (1 use) | Removes Poison entirely, any tier |
| Stimpack | Quality | Consumable (1 use) | +1 HP to one damaged part (not past max) |
| Adrenaline Shot | Quality | Consumable (1 use) | Exhausted does not advance this Clock |
| Ration Pack | Crude | Consumable (3 uses) | Food. No Meal benefits — the Kitchen guards its turf |
| Water Flask | Crude | Consumable (3 uses) | Water; refillable at the Lounge for free |
| Glow Stick | Crude | Consumable (3 uses) | Light, ~1 Clock per stick |
| Torch | Crude | Consumable (2 uses) | Light; can ignite (1 Burn on touch) |
| Chalk | Crude | Consumable (5 uses) | Marking — the dungeon-crawler's autosave |
| Flare | Basic | Consumable (1 use) | Signal + bright light; 1-in-6 nearby enemies become Alerted |
| Smoke Vial | Basic | Consumable (1 use) | 2-space smoke, breaks line of sight for 1 Clock |
| Spare Magazine | Basic | Charged gear | One reload for a light ranged weapon |
| Heavy Cell | Basic | Charged gear | One reload for a heavy ranged weapon |
| Patch Kit | Basic | Consumable (2 uses) | Field-repairs a damaged (not destroyed) item |
| Rope (20 m) | Basic | Tool | It's rope. It always matters |

## A-2 — Bronze pity-gear list (~12, Crude–Basic) ⚖

The every-5th-box guarantee pool. Sponsor-branded, proudly adequate.

| Item | Tier | Subtype | Stats (⚖) |
|---|---|---|---|
| Camp Knife | Crude | Bladed (Light Small) | 2 Bleed · Cost 1 · Req 1 Phy |
| Rebar Club | Crude | Crush (Heavy Small) | 2 Crush · Cost 1 · Req 2 Phy |
| Scrap Spear | Crude | Bladed (Light Large) | 2 Bleed · 2-line · Req 3 Phy |
| Sling | Crude | Ranged (Light) | 1 Bleed/round · RPM 1 · mag 1 (stones everywhere: reload 1 Moment) |
| Duct-Tape Machete | Basic | Bladed (Light Small) | 2 Bleed · 1 Lesser slot |
| Riot Baton | Basic | Crush (Heavy Small) | 2 Crush · 1 Lesser slot |
| Show-Brand Buckler | Basic | Shield | 1 flat resist (Bleed) · occupies a hand |
| Padded Vest | Basic | Armor (torso) | 1 Crush resist |
| Hard Hat | Basic | Armor (head) | 1 Crush resist |
| Work Gloves | Basic | Armor (hands) | 1 Bleed resist |
| Multitool | Basic | Tool | Removes the improvised-tool Moment penalty on mechanical work |
| Crowbar | Basic | Tool / Crush | 2 Crush as a weapon · prying tool · 1 Lesser slot |

**Also seeded into Bronze shops ⚖:** Crude Polish Kit (ID-3 odds 1–3/4–6) and Crude
Weapon Creation Kit appear as rare pity-tier alternates — every 5th box may roll a
kit instead of gear (1-in-3 when the pity fires ⚖).

## A-3 — The coupon beat (GC6 closes here)

At the Lounge-unlock episode, the Corporation runs its **"loyalty program"** beat:
each contestant redeems a **Basic Weapon Creation Kit** presented as two vouchers —
one Basic-tier weapon of their own design + one Lesser modifier of choice (per
ID-4's unification these are the Fantasy Item Coupons, same redemption flow).
Templates enter the library after the table beat; the four designs are the players'.
Compendium §5 `[OPEN]` closes when this fires.

## A-4 — The Incineradile Box (first specific box; Silver-grade ⚖)

Boss-specific achievement box for downing the tutorial boss. Themed: fire, fungus,
and televised triumph. Boss UT payout (Neighbourhood 5) is separate.

| Content | Tier | Subtype | Effect (⚖) |
|---|---|---|---|
| **Mycelium Core** | Crude (growth) | Growth / Trinket | **Public read (all the template shows):** "Inert, warm, faintly pulsing." **GM-ONLY growth track ⚖ (moved GM-side by owner order, 2026-08-04 — never seed this):** survives a floor with you → +1 tier. Quality: 1 Burn resist (global) · Superior: T1 Burn nullification · Exceptional: once per Clock, a disabled part of the carrier acts for 1 Moment (the network remembers). If Batch A was already seeded, re-run with `--force` to scrub the track from the live template |
| Flamehide Wrap | Basic | Armor (torso) | 1 Burn resist |
| Fire Axe "Retired Hero" | Quality | Bladed (Heavy Small) | 3 Bleed · Cost 1 · Req 2 Phy · arrives **pre-affixed: Chilling** (the 1-in-3 rule, showcased — irony intended) |
| + 1d3 Bronze consumables | — | — | Rolled from A-1, Burn Gel weighted ⚖ |

## A-5 — F1 found-box placements (green forest) ⚖

Per GC2: one-time purchasable finds, sealed until the Lounge. Route-keyed Gold.

| Placement | Price | Contents (⚖) |
|---|---|---|
| **Verdant Cache** (Silver, generic F1) | 15 UT | 1 pick from the Silver pool with forest skins + 1d3 A-1 consumables; the 1-in-10 limited-magic slot is the **Sprig Wand** — Limited-magic, Quality: casts Entangle (target Slowed, 2-space vines, 1 Clock; 3 uses) |
| **Reliquary of the Stairs** (Gold, Easy route) | 40 UT | **Chained Mirror-Shard** — Quality Trinket: once per Clock, see through the eyes of whoever last touched it (mask-lore hook) + full Silver roll |
| **Hearth-Ash Coffer** (Gold, Medium route) | 40 UT | **Ashen Lantern** — Quality Tool: its light renders emotion visibly (fear reads as smoke, love as embers — brand-dulled characters cast almost nothing; demon-arc hook) + full Silver roll |
| **Crystal Custodian's Cache** (Gold, Hard route) | 40 UT | **Citizen's Signet** — Quality Trinket: the crystallized citizens react to its bearer (doors open, the Loong hesitates; city-lore hook) + full Silver roll |
| Legendary placement | 100 UT | Deferred to Batch C's named list — slot reserved, only if the route earns it ⚖ |

---

*Everything above is a proposal shelf — strike rows, re-stat freely. On your bless:
these enter the library via the ID-5 seed script (with the new metadata fields),
and Batch B authoring starts.*
