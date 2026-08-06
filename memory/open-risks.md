# Open Risks

<!-- wf memory: required sections below; keep the headings. -->

## Open risks

- Item instances are snapshots (no templateId): seeding must never rewrite
  player inventories; template edits don't propagate to held items.
- PlayerPanel `PUT /state` and the 1500ms sheet autosave can clobber each other;
  any future draft/grant flow should avoid writing `state` while a player edits.
- F4-6 floors undesigned — their themed pools are out of scope; don't author
  against guesses.
