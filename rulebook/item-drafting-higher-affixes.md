# Item Drafting — the HIGHER affix tier (PROPOSAL)

**Date:** 2026-08-10 · **Status:** 🟢 BLESSED (owner, 2026-08-10) — all 15 as
authored, and **band scaling RULED**: affix damage numerics multiply by the
item's material band, exactly like base damage; condition/utility affixes don't
scale (band-proof by nature). Apply: `node backup-db.js` →
`node seed-affixes.js` → `--apply` from `server/`. Catalog is truth (ID-0.14) —
these are ADDITIONS.

**Where Higher sits (§12.3, unchanged):** Superior = 2 prefix / 1 suffix, access
up to Higher · Exceptional = 2/2, up to Legendary. Extraction of a Higher
modifier drops the weapon one tier (canon). The 1-in-3 pre-affix rule can now
roll Higher on Superior+ drops.

**The escalation grammar (from your Lesser→Normal patterns):** numerics go
+1 → +2 → **+3** · conditions go T1 → typed T1 → **T2 on hit** · utility goes
convenience → once-per-Clock power → **stance-changing**. Higher is where an
affix starts defining how the item is *played*, not just how hard it hits.

## The key sitting question — affixes × material bands ⚖

Flat "+3 Bleed" on an F3 Jade blade (24 base) is seasoning; on an F7 blade it's
a rounding error. **Proposal: affix damage numerics multiply by the item's
material band, exactly like base damage** — one multiplication rule for the
whole item (Serrated III on a Jade blade = +24 Bleed). Condition and utility
affixes need no scaling — a T2 Poison or a Moment saved is band-proof by
nature, which is also why this list leans conditions/utility. **Bless or
reshape before these hit play.**

## H-1 — Prefixes (8) ⚖

| Affix | Effects | Applicable to |
|---|---|---|
| Serrated III | +3 Bleed Damage | Bladed Weapons |
| Weighted III | +3 Crush Damage | Any |
| Chilling II | Tier 2 Chilled on hit | Any |
| Venomous II | Tier 2 Poison (Neurotoxin) on hit | Any |
| Searing | Tier 2 Burn on hit | Any |
| Rending | Hits reduce the struck part's flat resistance by 1 until the Clock resets (stacks to 3) | Weapons |
| Concussive | Once per Clock: a Crush hit makes the target's next action cost +1 Moment | Crush Weapons |
| Thornguard | Attackers striking the covered part take 2 Bleed | Armors, Shields |

## H-2 — Suffixes (7) ⚖

| Affix | Effects | Applicable to |
|---|---|---|
| Spanning | +3 Range | Weapons |
| Featherlight | Requires half the Physique to use | Any |
| Swift II | Twice per Clock, an action resolves as if done 1 Moment sooner (the user still waits until the Moment's end) | Any |
| Penetrating II | Ignores 3 Physical Resist | Any |
| Anchored | The wielder cannot be involuntarily moved and always counts as on steady ground | Weapons, Armors |
| Warded | The first condition (T2 or lower) applied to the wearer each Clock is ignored | Armors, Shields |
| Fluid | Once per Clock, one action costs 1 less Moment (minimum 1) | Any |

## Design notes

- **Rending lands exactly when armor matters** — Superior-era enemies (and
  players) stack flat resists; the anti-armor knife arrives with them.
- **Anchored quietly rewrites ranged play** — "steady ground anywhere" frees
  heavy-ranged builds from terrain; it's the build-around suffix of the tier.
- **Warded is the armor answer to the T2-on-hit prefixes** — the tier's offense
  and defense are in conversation.
- **Stacking flags ⚖ (extend the Balanced/Sharpened II precedent):** Fluid is
  proposed **incompatible with Sharpened II and Balanced** (Moment-economy
  affixes don't stack); Swift II replaces Swift, never alongside it.
- Escalation naming keeps the catalog's habit: numerals for straight upgrades
  (Serrated III), fresh names when the effect changes character (Burning →
  Searing, Reaching → Spanning).

## Runbook (after bless, from `server/`)

```
node backup-db.js
node seed-affixes.js            # dry run
node seed-affixes.js --apply
```

*Legendary-tier affixes stay undesigned on purpose — they gate Exceptional
gear, which is polish-only and not yet in circulation. That sitting can wait
for the first polished blade.*
