# Current State

<!-- wf memory: required sections below; keep the headings. -->

## Done

- 2026-08-04: Item Drafting scoped as the CONTENT pass (owner-confirmed) — stock
  the box tiers, per economy-passover's queued "big ITEM DRAFTING pass".
- Item-rules recap delivered and corrected by owner; rulings captured in
  `rulebook/item-drafting-passover.md` §ID-0.
- Floor canon located: game repo `docs/GPT_Master_Compendium.md` §4.
- Passover/plan doc drafted and committed (`rulebook/item-drafting-passover.md`).

- Sitting rounds 1+2 RULED (2026-08-04): armor sliver, tiered Polish Kits
  (grade-gated, Forge venue, fail=kit consumed), large pools + Creation Kits,
  app metadata, catalog-is-truth, R1-R5 all approved.
- Batch A BLESSED and delivered: model metadata fields, admin form inputs,
  BOX_TIERS/ITEM_SUBTYPES, seed-items.js + seeds/items-batch-a.js (41
  templates). Verified: syntax, seed-data validation, client build. NOT yet
  run against a DB (campaign DB is owner-side).

## In progress

- Awaiting owner's seed run (backup-db.js -> seed-items.js -> --apply).

## Next

- Batch B authoring (standing catalog + skill-tome set per ID-0.18), then C
  (top shelf + growth items per ID-0.19 doctrine), D (repair pass + catalog
  edits R4/R5), book pass ID-6. Batches E+ expansion waves planned.

## Blockers

- Seed apply needs the owner's DB; expect the Bandage name collision at dry
  run (kept as-is unless --force).
