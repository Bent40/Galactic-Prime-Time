# Next Actions

<!-- wf memory: required sections below; keep the headings. -->

## Next actions

**Two live threads. The owner picks.**

0. **THE F1 ENEMY PASS — DRAFTED 2026-08-18, awaiting owner rulings.**
   `rulebook/f1-enemy-pass.md` (18 entries) + `server/seeds/enemies-f1.js` +
   `server/seed-enemies.js`. **Blocked on the owner, not on Claude.** What is
   needed, in order:
   a. ~~E-0.1–E-0.4~~ · ~~Foreman Bex~~ · ~~the Girl~~ · ~~Infected T3~~ ·
      ~~Nullrot~~ — **all ruled 2026-08-18.**
   b. **THE LEVEL BUDGET is now the blocker** — `rulebook/level-budget.md`,
      questions L-a..L-f. It is upstream of every statline: until the curve is
      ruled, no enemy number can be checked against anything real.
   c. Then run the E-5 runbook on the campaign DB: `node backup-db.js` →
      `node seed-enemies.js` → `--apply`.
   Then the follow-on content in E-4: encounter tables and room counts, §21.4
   terrain blocks for the four F1 environments, Exposure values and §19.1/§17.6
   payouts per rank.

0b. **v2 CONTENT AUTHORING (v2, designed not built).** No structural design
   questions remain in any floor set. What is unwritten, in rough priority:
   - **F9's pillar count + contribution scoring**, and the divine beast's name
     and pre-beast contestant identity.
   - **F1–3 production**: encounters, stat blocks, the three route walkthroughs,
     Vermilia's court, the F2 decoy-grave puzzle.
   - **F4–6**: the five kingdoms and their gods (from the corpus), the kingdom
     tree's numbers.
   - **The next v2 chapter.** section 17 is written; the rest of the v2 book is not, and
     D-06 wants one source rendering two books — that pipeline does not exist.
   - **Loose ends named in `v2/floors/floors-7-9-proposal.md` section 10.**

**Owner-only, not blocked on Claude:** rotate the Atlas credential (deferred,
no urgency); have the five app accounts set new passwords (their bcrypt hashes
were removed from the working tree but remain in git history).

1. **F1 ENEMY PASS — original briefing (2026-08-10), kept for reference.**
   Delivered as item 0 above. The briefing as it stood:
   - Goal: stat the Floor 1 (green forest) roster to the horde doctrine —
     mobs ~5 HP one-shot hordes (survival only via GATE effects like the
     Incineradile's surface immunity, never fat bars), elites ~60 HP with
     one discoverable weak system each, route bosses ~125, supers ~300.
     Canon: rulebook v1.1 section 21.2 + the materials catalog curve.
   - Route beats to key encounters to: game repo (add_repo
     bent40/galactic-prime-time-game, read) `docs/GPT_Master_Compendium.md`
     section 4.2-4.4 — Easy (staircase dungeon, the mask, possession),
     Medium (haunted house, NPC party, the demon girl), Hard (moving city,
     the Loong, crystallized citizens). Incineradile (section 3.1) is the
     boss-design pattern to follow.
   - Vehicle: Enemy model exists (`server/models/Enemy.js`: name, tier
     'mob'/elite/boss, color, description, notes, bodyParts[{name,maxHp}],
     phases[{name,description,hpThreshold}]); admin 'enemies' section
     renders it. Build `seed-enemies.js` + `seeds/enemies-f1.js` mirroring
     the seed-items/seed-affixes pattern (dry-run default, name-matched,
     --force). No UI work needed — proposal doc first (house style),
     `rulebook/f1-enemy-pass.md` or similar.
   - Carve hooks: each enemy should name its carve material (F1 band,
     materials catalog M-1; boss carve precedent: Mycelium-Threaded Hide).
2. Owner, campaign DB: `node seed-affixes.js` runbook (Higher tier, 15
   affixes — blessed, not yet applied last we knew).
3. Owner, game repo: update `story-canon.md` "paused at 6, maybe 20" to
   the ruled 10-floor frame (3 sets of 3 + F10 FFA).
4. Materials-on-items APP DESIGN (doc before build): how parts/materials
   live on item instances, reforge data shape, crafting UI contract.
   Forge L1 is 5 UT — players craft soon after Lounge unlock.
5. Hygiene pair (quick): registration-code gate (open /register on a
   public URL) + state version field (autosave-vs-admin clobber race).
6. Later, in order of play: F2/F3 material band fills · "Fireball?" chain
   SkillTemplates (before the first Mythic box) · Legendary affixes (after
   the first polished Exceptional) · Batch E+ expansion pools · Set 2/3
   floor design (game repo).
7. PARKED (owner position, don't re-litigate): v2 relational migration —
   schema design doc first, timed to a campaign break.
