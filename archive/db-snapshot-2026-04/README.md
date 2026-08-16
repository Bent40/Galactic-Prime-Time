# ⚠️ STALE — Mongo export, April 2026

**Do not treat these files as current campaign data.** They were at the repository root
until 2026-08-11, where their authoritative-looking filenames caused both a human reviewer
and an automated audit to nearly analyse them as live content.

## What they actually are

| | |
|---|---|
| **Internal record dates** | max **2026-04-16** |
| **Last modified in git** | 2026-05-05 |
| **File mtimes** | 2026-08-04 — a checkout artifact, **not** a data date. This is what made them look current |
| **Skills** | **44** — missing the 5 additions applied 2026-07-25 |
| **Keywords** | **0 of 44** records carry the `keywords` field the project notes say was seeded 2026-07-25 |
| **Vocabulary** | pre-migration — `Psy`/`Toxic`/`Dissolution` appear 0 times |
| **Coverage** | **5 of 11** models only. Tag, Affix, Enemy, LootBox, NPC and MomentTracker were never exported |

**Consequence:** the frequently-quoted “100 tags, 27 affixes, 44 skills” figures **cannot be
verified from this repository.** The live campaign database lives with a different
checkout. Anything needing current content must come from Atlas or a fresh export.

## `galactic-prime-time.users.json` — DELETED 2026-08-11

Five accounts, each carrying a **bcrypt hash** (`$2a$`, 60 chars) alongside a username and
an admin flag. Bcrypt is doing its job — these are not plaintext — but:

- The file has **no design or review value whatsoever**; it is five rows of login records.
- **Moving or deleting it does not remove it from git history.** It has been in the
  repository since it was committed and remains recoverable from any clone.
- If any of those five people reused that password elsewhere, an offline attack on the
  hash is the realistic risk.

**Deleted on the owner's instruction.** It carried nothing of design or review value, so
removing it cost nothing and closed the forward-facing exposure.

**Git history still contains it.** Deletion removes the file from the working tree and from
every future clone's checkout, but the blob remains reachable in the repository's history.
The complete fix, whenever convenient, is for those five accounts to set new passwords —
after which the retained hashes protect nothing worth having.
