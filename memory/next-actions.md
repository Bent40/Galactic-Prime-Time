# Next Actions

<!-- wf memory: required sections below; keep the headings. -->

## Next actions

1. Owner: run the seed runbook on the campaign DB (backup-db.js ->
   seed-items.js dry run -> --apply; watch the Bandage collision).
2. ~~Box Namer~~ BUILT (admin/BoxNamer.jsx, top of Items section) —
   wordlist tweaks on request.
3. Batch B BLESSED (2026-08-04) — owner runs
   `node seed-items.js --file ./seeds/items-batch-b.js` (backup first).
4. Batch C BLESSED + MATERIALS catalog BLESSED, ladder APPROVED
   (2026-08-04). Seed queue for the campaign DB (backup first):
   batch-a, batch-b, batch-c, items-materials-f1 (F1 band + Incineradile
   carve as grantable Material items).
5. Mob doctrine RULED: mobs = hordes, one-shot by on-band hits (gates not
   HP bars); elite ~x12 / boss ~x25 / super ~x60 of mob. Feeds section 21
   at the book pass.
6. Materials-on-items app design (parts model, material field shape) -
   design before build; crafting UI later wave.
7. Batch D BUILT (seeds/items-batch-d-repairs.js --force + server/
   repair-affixes.js) - owner applies after A/B/C/materials.
8. Book pass ID-6 EXECUTED - rulebook at v1.1 (filename unchanged).
