# Lounge Passover — the sitting worksheet

**Date:** 2026-07-25 · **Status:** AWAITING OWNER ANSWERS (GL1–GL5 + module table)
**Scope:** what every module actually DOES · Upgrade-Token sinks (they currently buy
nothing — review finding B14) · downtime structure (Q67) · threshold-die pricing (the
D-5 parking spot) · respec pricing (Q6 said "Lounge, at a cost" — this prices it).
**Already canon, untouched here:** unlock costs in Boss Tokens; loot boxes open inside,
all at once; full HP restore + resolvable conditions resolve; no entry mid-combat;
overstay = ejection + 24h lock; fully monitored; Gemstone merges compatible skills.
**All numbers ⚖ PLACEHOLDER** — shapes are what's being ruled.

---

## Part 1 — Global calls

### GL1 — Downtime structure (answers Q67)

Between deployments each contestant gets **2 downtime actions**. One action = one
module engagement (craft something, run a treatment, a Gemstone merge, a surgery, a
training session). Sleeping/eating/healing is free — the full-restore rule is automatic,
not an action. The GM may grant a third action for long story gaps; overstaying to farm
actions triggers the canonical ejection. Simple, show-diegetic ("you have until the next
episode"), and it makes module choice a real decision.

### GL2 — Upgrade Tokens are the module-improvement currency (closes B14)

Every purchasable module has **three levels**: L1 = what the Boss-Token unlock buys ·
**L2 = 5 Upgrade Tokens · L3 = 15 Upgrade Tokens** ⚖. Levels improve outcomes, odds,
and options (table below). Upgrade Tokens also buy: an **extra downtime action**
(3 UT, once per downtime) and the **premium services** (GL3/GL4). This gives the
"primary currency" its missing sinks without touching the Boss-Token unlock ladder.

### GL3 — Threshold dice (closes D-5)

Sold at the **Tattoo Artist** (a permanent inking of the reflex pathways — fits
"permanent buff tattoos"): **d4→d6 = 5 Upgrade Tokens · d6→d8 = 15 Upgrade Tokens +
1 Gold Boss Token** ⚖, per stat, one step per downtime. Requires the module at the
level shown in the table.

### GL4 — Respec pricing (implements the Q6 ruling)

At the **Skill Gemstone**: unlearn a skill as a downtime action. Refund its recorded
spend history **minus one point per skill level** (the cost — the Gemstone keeps a
tithe), plus **2 Upgrade Tokens** service fee ⚖. Level points invested in traits are
never refundable (that's growth, not build).

### GL5 — The Kitchen consistency rule

Food NEVER restores HP (the no-HP-items ruling stands). Kitchen output works on
**Exhausted and morale**: meals delay/resolve Exhausted and buy small pre-deployment
boons. Keeps the healing economy honest.

### GL6 — Healing is a PRICED, ESCALATING service (owner direction, 2026-07-25)

**This amends the current "Lounge restores HP fully, free" rule.** The Corporation
always provides medical — and invoices you. Premiums rise with every claim and with
how deep you are:

- **The Med Bay** (Living Facilities, auto-present like the Dormitories — the
  Corporation would never let its assets die uninvoiced) sells the **full medical
  restore**: all parts to max, all resolvable conditions resolved, reattachment triage
  included.
- **Price ⚖: `Floor × 2^(heals already taken this floor)` Upgrade Tokens**, per
  contestant. Floor 1: 1 → 2 → 4 → 8… Floor 3: 3 → 6 → 12 → 24… Exponential in
  usage, scaled by depth ("hazard pricing").
- **The claim counter is per contestant and resets on descending to a new floor**
  (each floor's ledger starts fresh — but the base price is now higher).
- **Natural rest** (free, the Dormitories): resolvable conditions still resolve over a
  downtime — time heals sickness — but HP recovery slows to **+1 HP per part per
  downtime** ⚖. A mauled party without tokens limps for real story time; a funded
  party pays the bill and re-deploys shiny.
- Open sub-calls for the owner:
  - **(a)** Free-rest rate: +1 HP/part/downtime (recommended — prevents an unwinnable
    broke-and-broken lockout) · or NO free HP at all (hard mode) · or rest-to-half?
  - **(b)** Currency confirm: Upgrade Tokens (recommended — healing becomes THE big UT
    sink, with GM income as the difficulty lever) or something else?
  - **(c)** Does a bleed-out stabilization count as a "heal" claim? (Recommend: no —
    the claim is the restore, not the save.)
  - **(d)** Formula shape confirm: `Floor × 2^claims`, or a different base/curve?

---

## Part 2 — Module effects (L1 = at unlock · L2/L3 per GL2) ⚖ all numbers placeholder

| Module (unlock) | L1 | L2 | L3 |
|---|---|---|---|
| **Dormitories** (auto) | Free rest: resolvable conditions resolve over downtime; HP trickles back slowly (GL6). Doesn't level. | — | — |
| **Med Bay** (auto) | The full medical restore, invoiced per GL6: `Floor × 2^claims` UT ⚖. The bill is itemized. On camera. | Bulk rate: heal the whole party at once for the sum minus the cheapest member's bill ⚖ | Premium plan: one claim per floor at half price ⚖ |
| **Restrooms** (auto) | Monitored. The Corporation thanks you for your compliance. | — | — |
| **Kitchen** (1 Bronze) | Each contestant carries **1 Meal** per deployment: eating (1 Moment + interaction economy) removes Exhausted T1 or delays any Exhausted one advancement | 2 Meals; meals also delay Infected once | Pre-deployment feast: the party is immune to Exhausted until the first Clock reset of the run |
| **Farm** (1 Silver) | Ingredient supply (enables Kitchen L2+ recipes) + small animals: one **companion** per party (GM-statted, permanently losable) | **Mounts**: overworld travel + carry capacity (GM-adjudicated) | Exotic livestock: ingredients for crafting antitoxins/bandage stock at the Forge |
| **Forging Station** (1 Bronze) | Craft/repair **Crude–Basic** weapons and tools from materials (1 downtime action each) | Craft **Quality** | Craft **Superior** (Exceptional is never craftable — loot only) |
| **Goldsmith** (2 Bronze) | Craft **trinkets** — ring-class items (the 20 slots!) each holding **one Lesser modifier** | Trinkets can hold up to Normal modifiers | Barter bench: convert surplus trinkets/valuables into Upgrade Tokens |
| **Melding Station** (1 Silver) | Merge 2 same-type equipment → 1: keep the better base + ONE modifier from the sacrifice (tier slot/access rules respected) | Keep two modifiers from the sacrifice | Small chance ⚖ the meld bumps the result one item tier |
| **Advanced Fabricator** (1 Silver) | Ammo (magazines refill free here) + basic explosives (thrown, 1-space blast, 2 Burn ⚖) | Gadgets: grapnel, flash, smoke (GM menu) | Prototype ranged weapons up to Quality |
| **Enchantment Altar** (2 Bronze) | Extract/apply per the extraction ladder; Lesser extraction destroys the modifier on a d6 roll of 1–2 ⚖ | Destruction only on a 1; Normal extraction possible at 1–2 | Lesser extraction never destroys; Higher extraction possible (weapon still drops a tier — R12 stands) |
| **Wizard's Tower** (3 Bronze) | The magic source: reveals magic skills (level 0) to qualifying contestants; craft **Lesser** modifiers | Craft **Normal** modifiers | Commission **relics** — GM-authored unique magic items |
| **Skill Gemstone** (1 Bronze) | Merge/upgrade/mutate compatible skills (keyword rules); **respec service (GL4)** | Mutation preview: the GM reveals the merge outcome before you commit | Once per campaign, a merge leaves the consumed skill at level 0 instead of destroying it |
| **Tattoo Artist** (1 Gold) | One tattoo per contestant, choose: +1 flat resistance (Bleed/Crush/Burn) · +1 space of free movement · +1 Camera Call stack per session ⚖ | Second tattoo slot; **threshold dice d4→d6 (GL3)** | **Threshold dice d6→d8**; one tattoo may be swapped per downtime |
| **Surgeon's Table** (2 Silver) | Reattach severed parts · fit prosthetics · **race-change service** (the canonical one) | Animal-part grafts (GM-statted part from the beast you brought back) | Exotic grafts — parts from bosses, with their quirks |
| **Augmentation Hub** (2 Silver) | Mechanical prosthetics (recovery path) + utility implants (built-in thin tool, storage compartment) | Weaponized prosthetics (count as a Light Small weapon, never disarmable) | Integrated auto-loader: one ranged weapon gains auto-reload |
| **Bike Shop** (3 Silver) | Bikes: fast overworld travel for 1–2 riders (GM-adjudicated) | Sidecar + saddlebags (carry) | Trick bikes (arena-legal entrances — hype) |
| **Car Shop** (3 Silver) | Cars: party overworld travel + real carry capacity | Off-road builds | The camera car (crew rides = bonus broadcast coverage — hype) |
| **Armory** (3 Gold) | One armored vehicle: mobile cover in big arenas (GM-statted HP, ~10 ⚖) | Mounted plating (+HP) | Weapon mount (heavy ranged, uses vehicle as steady ground) |
| **Universal Travel** (fixed) | The door of descent. It doesn't level. It knows where you're going. | — | — |

---

*After your answers: rulings land in book §20 (module table + the four services), the
worksheet is marked ruled, and — since this is table-procedure content, not per-player
data — no DB seeding is needed. Numbers stay ⚖ until played.*
