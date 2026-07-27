# Economy Passover — currency, the store, loot boxes (the FINAL sitting)

**Date:** 2026-07-25 · **Status:** GC0 RULED · GC1–GC6 AWAITING OWNER ANSWERS

## GC0 — RULED (owner, 2026-07-25): Boss Tokens RETIRED

"Boss tokens were what upgrade tokens currently are — they serve no other purpose."
Bosses now drop **Upgrade Tokens scaled by rank** (Neighbourhood 5 · District 10 ·
City 25 · Precinct 50 · Country 100 · Stage 250 ⚖ — the old tiers survive as the
payout ladder). Module unlocks re-denominated in UT; the D-2 tier-aware exchange is
**amended** to a flat **25 UT → 1 Patron Token** ⚖; the app's Boss Token tracker is
removed and `server/migrate-boss-tokens.js` converts legacy held tokens (unused →
UT at the scale; spent → dropped). Book §19 rewritten.
**Scope:** the last unruled territory in the book — Q49 (currency & the store), Q50
(loot-box generation per tier), Q53's sliver (pre-affixed drops), Q54 (uses/charges
refills), plus the undistributed Fantasy Item Coupons from the compendium.
**All numbers ⚖ PLACEHOLDER.** When this is ruled, Appendix B is EMPTY — the whole
system is ruled territory.

---

## GC1 — Currency: no new money (recommended)

**Upgrade Tokens ARE the cash.** The show is post-money for contestants; four token
types already exist and a fifth currency would dilute them. The store prices in UT,
bartering is UT-denominated, and crowd donations are literally the audience tipping
you spending money — the loop closes: **earn on camera, spend in the cage.**
(Alternative if you want it: a separate "Sponsor Credits" cash layer — say so and I'll
draft the split.)

## GC2 — The store ("Sup, nerds!")

- **Rotating stock, refreshed per floor.** Sells: consumables (bandages, antitoxins,
  torches, rope, ammo variants), **Crude–Quality gear only** — Superior+ is never
  sold; that's loot and forge territory (item variance rule stands: store gear may
  undercut class baselines).
- **Price bands ⚖:** consumables 1–2 UT · Crude 1 · Basic 3 · Quality 8 · oddities
  GM-priced. **Buyback/barter at half value.**
- **The gacha counter:** the store sells **Bronze loot boxes at 5 UT** ⚖ as "daily
  deals" — of course the Corporation runs a gacha. Higher-tier boxes are never sold,
  only earned.

## GC3 — Loot-box generation (answers Q50)

**Curated first, rolled as fallback:** the GM stocks each floor's boxes using the
shape below; roll tables exist for when you'd rather spin the wheel. Boxes are always
themed to the floor that dropped them. Opening stays a Lounge event (all boxes at
once — canon).

| Tier | Contents shape ⚖ |
|---|---|
| Bronze | 2d3 bulk-utility consumables; 1-in-5 boxes also hold a Crude–Basic item |
| Silver | 1 Basic–Quality weapon/tool/armor piece + 1d3 consumables; 1-in-10 a limited-magic item |
| Gold | 1 game-changer — Quality–Superior item, skill tome, or magic unlock + a full Silver roll |
| Legendary | 1 campaign-carrying NAMED item (from the GM's authored list) + a full Gold roll |
| Mythic | 1 authored meta-breaking artifact — revealed as a **pick one of three** |
| Godly | **Never random.** One-of-a-kind, authored, fate-defying. The box knows who opened it |

## GC4 — Pre-affixed drops (closes the Q53 sliver)

**Yes** — dropped/looted gear can arrive pre-affixed (that's half the fun of loot):
**Quality and above drops arrive pre-affixed about 1-in-3** ⚖, always within the
tier's modifier-access rules. The Enchantment Altar is for *moving* modifiers, not
the only source of them.

## GC5 — Uses & charges (answers Q54)

- **Consumables** (bandages, antitoxins, one-shots): gone at 0 uses. Buy more.
- **Charged gear** (magazines, gadget batteries, printed devices): refills at the
  Lounge — ammo free at the Fabricator (ruled), other charges **1 UT per full
  recharge** ⚖ at the relevant module.
- **In the field:** nothing refills except via explicit items (a spare magazine is
  an item; the exo-suite's fabricator dock is the ruled exception).

## GC6 — Fantasy Item Coupons (compendium leftover — reminder)

Still undistributed: each player designs one **Basic-tier weapon** + one **Lesser
modifier**, free, as character-fantasy service. Recommend: hand them out at the next
Lounge visit as a Corporation "loyalty program" beat (and the store NEVER sells
coupons — the Forge L3 signature commission is the paid version of this fantasy).

---

*After your answers: rulings land in book §19 (currency) + §17.6/§20 (store & boxes),
Appendix B empties, and — worth a thought — with zero open items left, the book could
graduate from v0.92 to **v1.0**.*
