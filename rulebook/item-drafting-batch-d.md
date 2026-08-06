# Item Drafting — Batch D: the repair pass + catalog edits

**Date:** 2026-08-04 · **Status:** 🟢 BUILT — runbook below; owner applies on
the campaign DB. Closes ID-4's Batch D and residuals R4/R5.

## D-1 — Legacy template repairs (26 of 28)

`server/seeds/items-batch-d-repairs.js` — classification metadata ONLY:
subtype stamps for all, tiers for the untiered (ID-0.5). **Owner-authored
stats, names, and text untouched.** Highlights: Tome Of Submission → subtype
Tome (Quality) · the three coupons → Kit · Wood scraps / Fabric Scraps →
**Material** (baseline band) · Kunai → Thrown · the wardrobe (hats, capes,
boots, outfits) → Armor, costume pieces tiered Crude · Beachy → Trinket
(Crude, obviously).

Not touched: **Bandage** (Batch A carries the Basic counter-spec — resolve at
the A apply with `--force` if you want the spec) · **Middle Brother's Doll**
(Key Item — exempt).

## D-2 — Affix catalog edits (R4/R5, ruled)

`server/repair-affixes.js` (dry-run default): **Draining** gains the
once-per-Clock-per-target cap in its effects text · **Balanced** and
**Sharpened II** each note the incompatibility with the other. Idempotent;
skips already-edited affixes.

## Runbook (from `server/`, after the A/B/C/materials seeds)

```
node backup-db.js
node seed-items.js --file ./seeds/items-batch-d-repairs.js            # dry run
node seed-items.js --file ./seeds/items-batch-d-repairs.js --apply --force
node repair-affixes.js                                                # dry run
node repair-affixes.js --apply
```

`--force` is required and safe here by design: every entry targets an existing
template and lists only the fields it repairs.
