# Published pages (Artifacts)

Pages generated from this repo's data and published for use at the table. **Their links
lived only in chat history until 2026-09-22** — which meant a new session could not find
them and would rebuild rather than update. Recorded here so they can be updated in place.

| Page | Link | Built from | Notes |
|---|---|---|---|
| **"Sup, Nerds!"** — the tutorial store | https://claude.ai/artifact/6Q7KmrMRPHYCWRSjP7zHqC | `server/shop-shelf.js --json` | Player-facing. Shelves, search, running till, §19.3 coupon button. Growth subtype hidden. See `rulebook/the-shop.md` |
| **Little Brother Roach** — fight screen | https://claude.ai/artifact/EA96MaFWWsARi4ctQ2JAn9 | `rulebook/tutorial-enemy-pass.md` T-6 | GM-facing. A copy exists at `.../NJ4eknjgee8h6RMn79aDig` |
| **Broadcast Bestiary** | https://claude.ai/artifact/5dtfYX9qj9cSgTYmTRfJx9 | `server/build-bestiary.js` | F1–F3 rendered from the seed data, so it cannot drift. Rebuild with `node server/build-bestiary.js`. An older build sits at `.../5rKrTkqpmV7LhaeNBkZqG9` |
| **The Set 1 Spine** | https://claude.ai/artifact/AN6og6iiQuzDfQvinoE9R5 | `server/seeds/items-set1-spine.js` | The 26 spine templates |
| **Design Review Brief** | https://claude.ai/artifact/UtsWKA1AxhNWcoGc2FFwWq | — | 2026-08-11, historical |

⚠️ **To change a page, UPDATE it at its own link.** Publishing without the URL creates a
second artifact and the old link keeps serving stale content — which is how the two
Bestiary entries and the duplicate fight screen above happened.

🔴 **Not yet published, and the obvious next candidates:** the Incinedile fight screen
(`tutorial-enemy-pass.md` T-9) and the five parasites (`growth-items-and-parasites.md`
G-3, GM-side).
