# "Sup, nerds!" — the tutorial store (§19.3)

**Status: BUILT and LIVE (2026-09-19).** Generator: `server/shop-shelf.js`.
Player-facing page: **https://claude.ai/artifact/6Q7KmrMRPHYCWRSjP7zHqC**

> Written up 2026-09-22. The shop had been built, priced, gated and published, and
> it existed nowhere in `rulebook/` — only in `CLAUDE.md` and in the script. This
> file is the missing half.

---

## SH-0 — ⭐⭐ Nobody priced it, and nobody should

§19.3 already gives the whole price list in **three lines**:

> **consumables 1–2 UT · Crude 1 · Basic 3**

and every item in the library already carries a `tier` and a `category`. So the store
is not an authored list — **it is a DERIVATION**:

```js
if (item.tier === 'Crude')          return 1;
if (item.category === 'Consumables') return 2;
return 3;
```

🔒 **There is no `price` field on `ItemTemplate` and there must not be one.** A price
field is a second source of truth that would drift from §19.3 the first time anyone
edited it. The repo's standing pattern holds here: **a calculator regenerates the
table instead of a hand-written list going stale** (the same reason `floor-bands.js`,
`encounter-bands.js` and `prep-bands.js` exist).

**Stock = everything in the library at Crude or Basic tier.** The store sells nothing
better, and the Lounge takes over the moment it unlocks.

---

## SH-1 — The shelf, as it stands

**68 lines.** Regenerate with `node server/shop-shelf.js` (no `node_modules`, no DB).

| Shelf | Lines |
|---|---|
| Consumables | 21 |
| Weapons | 14 |
| Equipment | 11 |
| Tools | 6 |
| **Odds & Ends** (Misc) | **16** |

Flags: `--shelf <category>` for one shelf · `--json` for the data the page is built from.

Source batches: `items-batch-a.js` · `-b.js` · `-c.js` · `items-safety.js` ·
`items-curios.js`.

---

## SH-2 — 🔒 THE CAMOUFLAGE RULE, and why the shelf needed twelve pieces of junk

The four **Growth items** sold here (`Mycelium Core` · `Friendship Bracelet` ·
`Stray's Whistle` · `Prop Crown`) are the owner's *"super good without my players
knowing they're good"* category. Their **price** was already careful — every one is
Crude, so **1 UT**, under the Basic 3 that would have marked them out.

🔴 **But the SHELF gave them away.** Odds & Ends held four items and **all four were
Growth items** — one small shelf of unexplained trinkets beside four shelves of
obvious kit. *"What's the weird shelf?"* is exactly the question the price had been
designed not to provoke.

✅ **Fixed by `items-curios.js`** — twelve worthless things, `subtype: 'Trinket'`,
Crude, Misc, **no `specialEffects`, no damage, no uses, nothing coming later.**
Structurally identical to a Growth item on the card. Misc is now **16 lines, 4 of
them Growth (25%)**.

⛔ **NEVER give a curio a secret.** The moment one pays off, the players learn the
shelf is worth searching and the camouflage is spent forever.

⭐ **Two curios are deliberately MORE intriguing than anything on the growth shelf** —
`Unlabelled Key` and `Ticket Stub`. A party that decides to investigate the weird
trinket should have a decent chance of investigating the wrong one.

⚙️ **The script enforces it.** `shop-shelf.js` carries a camouflage gate and **exits 1**
if Growth is ever the majority of its own shelf again.

### 🔒 And the subtype is never shown (ruled 2026-09-19)

Owner: *"Dont show growth tag on any item, it needs to be a revealed thing."*
The marker **stays in the data** — it is the GM's filter and the seeder's category —
and **hiding it is a DISPLAY rule**: `HIDDEN_SUBTYPES` + `publicSubtype()` in
`client/src/constants.js` render a hidden subtype as its plain **category**, so a
growth item in Misc reads *"Misc"*, indistinguishable from the junk beside it.
⚠️ You cannot reveal something you deleted, which is why renaming the subtype was
withdrawn. A test walks `components/character/` and fails on any raw `it.subtype` in
markup, so a new render site cannot leak it again.

---

## SH-3 — Not stocked

| Item | Why |
|---|---|
| **Signal Kit** | Owner, 2026-09-19. Stays in the library, stays grantable, simply not sold here. |

Recorded as `NOT_STOCKED` in `shop-shelf.js`.
🟡 **The in-fiction reason is not written down**, and a one-line note would stop it
looking like an oversight. *(Mine, unresolved.)*

---

## SH-4 — The coupon, and the closing bell

§19.3 gives each contestant a coupon that takes the **dearest line off the bill** —
the shop page implements it as a button on the running till.

🔴 **The store CLOSES when the Lounge unlocks**, which the book already declares, and
the Incinedile **is** the Lounge unlock. So this is a **one-time offer**, and anything
unspent is gone:

- the §19.3 coupon
- 🔴 the **fantasy item coupons** (Compendium §3.2 — one self-designed Basic weapon
  plus one Lesser modifier, per player) — **still undistributed.**

---

## SH-5 — Runbook

```
# from server/, with MONGODB_URI set to Atlas — NEVER localhost
node shop-shelf.js                 # print the shelf (no DB needed)
node shop-shelf.js --shelf Misc    # one shelf
node shop-shelf.js --json          # the page's data

node seed-items.js --file ./seeds/items-curios.js           # dry run
node seed-items.js --file ./seeds/items-curios.js --apply
```

⚠️ Every `server/` script falls back to `mongodb://localhost:27017/galactic-prime-time`
when `MONGODB_URI` is unset — it will silently seed a local dev DB and report success.
