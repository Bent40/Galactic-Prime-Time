# Open Risks

<!-- wf memory: required sections below; keep the headings. -->

## Open risks

- **Public URL, open registration:** `/api/auth/register` has no gate on the
  live Render deployment — anyone with the URL can create accounts. The
  registration-code gate is queued (next-actions #5).
- **Atlas password was pasted in chat (2026-08-08):** rotation advised and
  still unconfirmed. Also verify JWT_SECRET/ADMIN_SECRET on Render are not
  dev defaults.
- Campaign DB is BEHIND the code: Higher affixes (15) blessed + seeder merged
  but `node seed-affixes.js --apply` not yet run there (next-actions #2).
- PlayerPanel `PUT /state` and the 1500ms sheet autosave can clobber each
  other; state version field queued (next-actions #5). Lootbox open avoids
  this by design (client merges via update()).
- Render free tier cold-starts after idle (~1 min spin-up); first load at
  the table will lag — warm it before session start.
- Item instances are snapshots (no templateId): seeding must never rewrite
  player inventories; template edits don't propagate to held items.
- F4+ floors undesigned — material bands F2/F3 are sketches, F4-9 empty;
  don't author against guesses.
