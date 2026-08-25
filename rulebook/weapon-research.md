# Weapon Research — the graded item corpus

**Started 2026-08-25 · Status: ✅ RESEARCH COMPLETE + ✅ ALL THREE QUESTIONS RULED**
Myth **W-4b** → averages **W-6** · games **W-4c** → distribution **W-7** ·
cultivation/manhwa/sacred-sets **W-4d** → **convergence W-8** → 🔒 **rulings W-9**.
🔒 **R-1** author ~27 concepts, the band owns the floor axis · **R-2** items may reject a
contestant on a *written* BE/NOT-BE predicate, never arbitrarily · **R-3** weapons **birth**
myths (forward accrual), they do not borrow them. **Start at W-9.**
⚠️ **W-1 is partly retracted — see the banner on it.**
Purpose: build a corpus of weapons/artifacts from myth + the anime/manhwa/manhua/game
canon, extracted into a schema that grades each one onto **GPT's own axes** so it can be
placed: which floor band, which route or idea it serves, and how a party gets it.

> **Why breadth, not a sample (owner, 2026-08-25):** the output has to fill a **9 floors ×
> 3 routes × 3 acquisition classes** grid. A dozen archetypes cannot populate that. The
> essence taxonomy is a *field* on each entry, not the deliverable.
>
> 🔒 **SUPERSEDED by W-9 R-1 (owner, same day):** *"the band already solves the floor axis —
> go with ~27 concepts."* The floor axis collapses into the **set** axis, so the target is
> **3 sets × 3 routes × 3 acquisition = 27 concepts** plus a small apex set. The breadth
> argument stands; the number is 27, not 81.

---

## W-0 — Method note, and the egress record

**Egress is OPEN as of 2026-08-25.** The owner's allowlist edit took effect in a fresh
session, exactly as the previous session's diagnosis predicted. Tranche 2 was harvested from
**real page reads**, not search summaries.

| | |
|---|---|
| **Fidelity** | 🟢 **High.** Full page reads — stat details, costs and the fine print all survive |
| **Throughput** | ~1 weapon per fetch, parallelisable ~6 at a time |
| **Provenance** | ⚠️ **Every entry names its source.** Fan wikis are user-authored and inconsistent; do not silently blend them with myth sources |
| **Fandom** | 🔓 **SOLVED 2026-08-25** — `/wiki/` page views are Cloudflare-blocked, but **`api.php` returns 200.** All of W-4d came through it |

### The egress finding, resolved (2026-08-25)

The previous session diagnosed the proxy as an allowlist bound at session start, and
concluded a **fresh session** would pick up the owner's added domains. **That was correct.**

- ✅ `en.wikipedia.org` → **HTTP 200**, full content. The whole of queue #1 ran on it.
- 🔴 `*.fandom.com` → **HTTP 403**, body `<title>Just a moment...</title>` — that is a
  **Cloudflare bot challenge**, not `EGRESS_BLOCKED`. The request *leaves the network and
  reaches Fandom*, which then refuses it as datacenter traffic.

> ⚠️ **The wildcard question is moot.** The allowlist edit worked; `*.fandom.com` is now
> permitted *by policy* and blocked one layer further out, by Fandom's own edge. **No
> allowlist change can fix this** — it is not our proxy refusing, it is their CDN.

**Consequence for the queue — mirrors probed 2026-08-25, results below.** #1 (myth) ran
entirely on Wikipedia; #6 ran entirely on Fextralife. #2/#3/#4 lean on `*.fandom.com` and need
a substitute route. Verified host status, so the next session does not re-probe:

| Host | Status | Use |
|---|---|---|
| `en.wikipedia.org` | ✅ **200** | queue #1 — done |
| `*.wiki.fextralife.com` | ✅ **200** | queue #6 — done. The working substitute for game wikis |
| `*.fandom.com/wiki/…` | 🔴 **403** Cloudflare | page views blocked at their CDN — unfixable by allowlist |
| 🔓 **`*.fandom.com/api.php`** | ✅ **200** | **the bypass.** Raw wikitext, *higher* fidelity than HTML (infoboxes arrive structured). Queues #2/#3/#4 ran on it |
| `*.wiki.gg` | ⚠️ **404 / 401** | probed — the target communities **do not exist there.** Do not re-probe |
| `*.miraheze.org` | 🔴 **403** | not usable |
| `diablo4.wiki.fextralife.com` | ⚠️ **301** | redirect not followed — retry the redirect target |
| `minecraft.wiki` | 🔴 **egress** — `CONNECT tunnel failed, 403` | genuinely not on the allowlist, unlike Fandom |

For #2/#3/#4, try `*.wiki.gg` and `*.miraheze.org` first, then fall back to search-result
summaries with the fidelity caveat tranche 1 carried. Do not route around the CDN block.

**Nothing in this file is written from memory.** An entry with no source line is a bug.

---

## W-1 — ⚠️ PARTLY RETRACTED: cultivation fiction and floor-grading

> 🔴 **Correction, 2026-08-25 (W-4d).** This section was written from **search summaries**.
> Page reads of three independent series **do not support its headline claim** of a
> standardised genre-wide ladder, and its two citations turned out to be **one table
> duplicated across two wikis** — it read as n=2 and was n=1. **What survives:** the
> *grammar* (ordered bands × ~3 sub-grades) is universal, and point **2 below is confirmed
> and stronger than stated.** What does not: the specific rung sequence. Read **W-4d**
> before using anything in this section.

The single most useful structural result of tranche 1, and it was not the thing I went
looking for.

⚠️ ~~**Cultivation fiction has a standardised weapon ladder**, near-universal across the
genre: **Common → Spiritual → Earth → Heaven → Divine.**~~ **NOT SUPPORTED** — three
independent ladders disagree on vocabulary *and* order (W-4d). *Apotheosis* runs a longer eight-rung
version: **Huang (Yellow) → Xuan (Black) → Di/Ling (Earth/Spirit) → Tian/Xian
(Heaven/Immortal) → Sheng (Holy/Saint) → Shen (Divine) → Zhi Zhun Shen (Supreme Divine) →
Hun Dun Zhi (Primordial)**. *Global Martial Arts* grades the divine band alone into five:
Divine → Half-Step Divine → Holy Divine → Imperial Divine → True Divine.

🔴 **That is GPT's problem, already solved, by an entire genre, for a paying audience.**
Eight rungs against our nine floors plus the F10 free-for-all. Two things follow:

1. **The M-1…M-5 material bands could adopt a proven ladder** instead of an invented one —
   and readers of the genre will find it *legible on sight*, which is free comprehension.
2. **The genre grades the DIVINE band internally.** We treat "apex" as one step (M-5).
   They spend five rungs there, because that is where their audience lives longest. If F7–F9
   is meant to feel like ascending rather than plateauing, that is the lesson.

⚠️ **Do not import the vocabulary raw** — "Heaven/Divine" is exactly the register S-0's
firewall keeps out of v1. The *ladder shape* crosses; the theology does not.

---

## W-2 — The extraction schema

Every entry carries these. Fields the source does not support are left blank, never guessed.

| Field | What it holds |
|---|---|
| `name` / `source_work` | The weapon, and what it is from |
| `origin` | **mythological** (a real-world myth predates it) · **derived** (a myth weapon renamed) · **invented** |
| `form` | What it physically is — class matters, GPT weapons are 2–4 damage by class |
| `essence` | The power-concept. See W-3 |
| `quantitative_or_categorical` | 🔴 **The load-bearing field.** Does it hit *harder*, or does it do a *thing numbers cannot*? L-14 ruled stats are the key and not the gun, so **only categorical powers can ride an apex item** |
| `cost` | What it takes from the wielder. ⚠️ **Measured 2026-08-25: only 40% of myth weapons carry one** (W-6 §1) — the earlier "almost always" note was wrong. The reliable myth gate is `requirement_shape`, at 64% |
| `requirement_shape` | What the wielder must *be* to use it — the §12.1 requirement, post-L-14. ⭐ **Five shapes are in evidence** (W-8 §1): a **stat** · a **rite or gear** · a **withheld technique** · an **identity** · and 🔒 **the item's own consent — RULED IN (W-9 R-2)**, as a written `REQUIRES <tag>` / `REFUSES <tag>` predicate. Never arbitrary |
| `acquisition` | 🎯 **loot** (it drops) · **crafted** (you make it from a carve) · **story** (it only exists after a problem is solved) |
| `band_read` | Which GPT floor its power level suggests, and why |
| `route_fit` | Which route/idea it serves — Easy (the plague/Nullrot), Medium (demon politics/Bex), Hard (the Loong/the hunt), or shared |
| `source` | 🔗 The URL. Mandatory |

---

## W-3 — The essence list (grown by tranche 2; blessed for myth)

Working set. **Blessed for the myth corpus** (n=25, W-6) — **still provisional** for the
game/anime passes. Current buckets: **severance** (cuts the uncuttable) · **bypass** 🆕
(ignores the armour/resistance/immunity layer) · **inevitability** (does not miss / returns) ·
**dominion** (commands a domain rather than damaging) · **oath/geas** (binds, and charges the
wielder) · **multiplicity** (one becomes many) · **restoration** · **world-scale** (ends a
place, not a person) · **transformation** (the weapon changes shape to the need) ·
**redirection** (takes an attack and sends it elsewhere) · **investiture** 🆕 (possession *is*
the claim — legitimacy, not damage) · **reciprocity** 🆕 (the weapon reads the target's stance
and answers it).

**Tranche 2 changed this list in three ways** (evidence in W-6 §3, §4):
- 🆕 **`investiture`** — Mjölnir sanctifies brides and blesses funeral ships; Kusanagi is
  Imperial Regalia; Zulfiqar *is* Ali. Their most durable power is not a combat power.
- 🆕 **`reciprocity`** — Narayanastra's intensity "rises in proportion to the resistance of
  the target," and total submission stops it. Neither dominion nor redirection.
- 🔴 **`bypass` split out of `inevitability`** — because GPT has **no to-hit rolls**, "never
  misses" is mechanically void here while "no armour blocks it" is the strongest categorical
  power in our combat math. Do not let one bucket hide both.
- ⚠️ **`redirection` has zero myth instances** — it is an anime/game essence (Gideon, our own
  Forest Resin), so it will not carry mythic weight.

**GPT already sits on this grid without having named it:** *Mistletoe* is **severance** and
is myth-accurate (the one thing unsworn); the *Seal-Anchors* in Cursed Gold are **dominion**;
*Forest Resin* is **redirection** at consumable scale.

---

## W-4 — Tranche 1

### Solo Leveling (manhwa) — the acquisition axis, cleanly demonstrated

| | Kamish's Wrath | Baruka's Dagger |
|---|---|---|
| **origin** | invented | invented |
| **form** | paired daggers | dagger |
| **essence** | severance (dragon-derived) | — (a straight stat item) |
| **quant/cat** | **quantitative** (+1500 attack) | **quantitative** (+110 atk, +10 agility) |
| **acquisition** | 🎯 **crafted, then story** — forged by Thomas Andre from the dragon Kamish's fang, then *held unused for eight years* and given to Jinwoo for sparing his guild | 🎯 **loot** — a drop from killing Baruka |
| **band_read** | apex. The gap (+1500 vs +110) is ~14×, roughly GPT's F1→F5 band spread | early-mid |
| **route_fit** | Hard — it is literally *a dragon's fang made into a weapon*, which is the Loong's whole anxiety |

⭐ **The lesson is the pairing, not either item.** The same series gives a boss-drop dagger
and a dragon-fang apex, and the apex is gated **twice** — you must forge it *and* be given
it. **Two gates on one object is how a genre signals "endgame"**, and GPT currently gates
apex items once (a carve). Worth stealing.
🔗 [Baruka's Dagger](https://solo-leveling.fandom.com/wiki/Baruka's_Dagger) ·
[Category:Weapons](https://solo-leveling.fandom.com/wiki/Category:Weapons) ·
[ranked list](https://www.sportskeeda.com/anime/solo-leveling-all-9-sung-jinwoo-s-weapons-ranked-weakest-strongest)

### Nanatsu no Taizai (anime/manga) — categorical powers, and a shared gating rule

| Weapon | Essence | Quant/cat | Note |
|---|---|---|---|
| **Chastiefol** | **transformation** | **categorical** | Ten distinct forms (a pillow; "Form Five: Increase" → thousands of kunai). Each form has a *true form* that costs **immense physical strain** — a cost that scales with the power drawn |
| **Lostvayne** | **multiplicity** | **categorical** | Creates four clones of the wielder |
| **Gideon** | **redirection** | **categorical** | Absorbs magical attacks and channels them into the earth |

⭐ **All three are categorical, and all three share one acquisition rule:** a Sacred Treasure
is issued to *a specific person* and "allows the user to draw out their powers to their full
potential" — **the weapon amplifies who you already are.** That is L-14's ruling stated as
fiction: *stats are the key, not the gun.* Independent convergence on our own rule.
⚙️ **Chastiefol's true-form strain is the mechanic GPT is missing** — an item whose *higher
mode* costs the body. §12.5 has uses/charges; it has no "you may push this, and it will hurt".
🔗 [Sacred Treasure](https://nanatsu-no-taizai.fandom.com/wiki/Sacred_Treasure) ·
[Chastiefol](https://nanatsu-no-taizai.fandom.com/wiki/Chastiefol) ·
[Category:Weapons](https://nanatsu-no-taizai.fandom.com/wiki/Category:Weapons)

### Cross-series aggregators found (not yet mined)

- **Anime Weapons Wiki** — cross-series, the best single entry point found so far.
  🔗 [Category:Sacred Treasure](https://anime-weapons.fandom.com/wiki/Category:Sacred_Treasure)
- **Cultivation levels of light novels Wiki** — the genre-wide ladder.
  🔗 [Weapon tiers](https://cultivation-levels-of-light-novels.fandom.com/wiki/Weapon_tiers)
- **Apotheosis Wiki** — the eight-rung ladder in W-1.
  🔗 [Weapon Tiers](https://apotheosis-manga.fandom.com/wiki/Weapon_Tiers)
- **Arifureta Wiki** — artifact/crafting系 series, good for the *crafted* acquisition class.
  🔗 [Artifact](https://arifureta.fandom.com/wiki/Artifact)

---

## W-4b — Tranche 2: classical myth (queue #1, COMPLETE)

**25 weapons** across seven traditions, every one from a page read (not a search summary).
A 26th page — [Astra (weapon)](https://en.wikipedia.org/wiki/Astra_(weapon)) — was read as a
**system** source, not a weapon entry, and is excluded from every count in **W-6**.

### Norse — the dwarf-forge cluster

| Weapon | origin | form | essence | quant/cat | cost | requirement_shape | acquisition |
|---|---|---|---|---|---|---|---|
| **Mjölnir** | mythological | short-handled hammer | **investiture** + restoration | **categorical** | none to wielder | 🔴 **iron gloves (Járngreipr) + belt (Megingjörð)** — "Thor must wear his gloves with his hammer" | **crafted** — Eitri & Brokkr, then judged best and presented |
| **Gungnir** | mythological | spear | inevitability | **categorical** | not stated | 🔴 **none — it removes the requirement**: hits "regardless of the attacker's skill" | **crafted** — Sons of Ivaldi under Dvalinn; extracted by Loki as reparation for cutting Sif's hair |
| **Tyrfing** | mythological | golden-hilted sword, "a light shone from it like a ray of the sun" | severance + inevitability | **categorical** | 🔴 **"it would kill a man every time it was drawn"** + "the cause of three great evils" | 🔴 **"had always to be sheathed with blood still warm upon it"** | **crafted under coercion** — Svafrlami trapped the dwarfs and forced it |
| **Gram** | mythological | gold-decked sword | severance | mixed | not stated | drawn from Barnstokkr by Sigmund alone — worthiness implied | **crafted (reforged)** — Regin reforges the two halves Sigurd brings |
| **Freyr's sword** | mythological | sword that "fights of itself" | dominion (autonomous) | **categorical** | 🔴 **deferred and total** — he gives it away for Gerðr and "since he does not have his sword he will be defeated" at Ragnarök | "if wise be he who wields it" | **story** — given away as payment to Skírnir |
| **Mistletoe** | mythological | sprig → spear/arrow | **severance** | **categorical** | Höðr is killed for it by Váli | 🔴 **none — that is the whole point** | **story** — exists as a weapon only once Loki finds the gap in the oath |

⭐ **The dwarf pattern is the find here.** Mjölnir, Gungnir, Tyrfing, Gram, Skíðblaðnir and
Gullinbursti are all dwarf-work, and the *manner of commissioning changes the product*:
Loki's wager gets Mjölnir with a **short handle** (a fly bit Brokkr mid-forge); Svafrlami
*traps* the dwarfs and they **curse the blade in revenge**. Willing craft comes out clean;
coerced craft comes out **flawed or cursed**.
⚙️ **GPT's crafted class has no crafter-agency at all** — a carve is a material, not a
negotiation. "Who made it, and did they want to" is a free acquisition axis we are not using.
🔗 [Mjölnir](https://en.wikipedia.org/wiki/Mj%C3%B6lnir) · [Gungnir](https://en.wikipedia.org/wiki/Gungnir) ·
[Tyrfing](https://en.wikipedia.org/wiki/Tyrfing) · [Gram](https://en.wikipedia.org/wiki/Gram_(mythology)) ·
[Freyr](https://en.wikipedia.org/wiki/Freyr) · [Baldr](https://en.wikipedia.org/wiki/Baldr)

### Greek — the loaned-regalia cluster

| Weapon | origin | form | essence | quant/cat | cost | requirement_shape | acquisition |
|---|---|---|---|---|---|---|---|
| **Aegis** | mythological | goatskin / shield, Gorgon-faced | **dominion** (terror) | **categorical** | not stated | borne by Zeus, lent to Athena and Apollo | **story** — lent, never won |
| **Harpe** | mythological | sickle-sword, **adamant** ("unconquerable") | **severance** | **categorical** | not stated | not stated | **story** — given to Perseus by Hephaestus (or Hermes) |
| **Trident** | mythological | three-pronged spear | **world-scale** | **categorical** | not stated | divine attribute | **crafted** — forged by the Cyclopes |
| **Cap of Invisibility** | mythological | dog-skin cap | dominion (unseen) | **categorical** | not stated | not stated | **crafted** — Cyclopes, for Hades after he freed them; then **lent** to Athena, Hermes, Perseus |
| **Bow of Heracles** | mythological | bow + arrows | inevitability (prophecy-bound) | **categorical** | 🔴 **a festering wound and ten years marooned on Lemnos** | named by prophecy: Helenus reveals Troy cannot fall without it | **story** — payment for lighting Heracles' pyre |

⭐ **Greek apex gear is overwhelmingly LENT, not owned.** The Cap passes to Athena, Hermes
and Perseus; the Aegis passes from Zeus to Athena and Apollo; the Harpe is handed to Perseus
for one job. **The item is a loan against a task, and it goes back.**
⚙️ **That is an acquisition class GPT does not have.** Our three are loot / crafted / story —
all *permanent*. A **loaned** apex item (yours for one floor, then it returns) gives the F7–F9
band a way to show players apex power without permanently inflating them. Directly addresses
W-1's "F7–F9 must feel like ascending, not plateauing".
🔗 [Aegis](https://en.wikipedia.org/wiki/Aegis) · [Harpe](https://en.wikipedia.org/wiki/Harpe) ·
[Trident of Poseidon](https://en.wikipedia.org/wiki/Trident_of_Poseidon) ·
[Cap of invisibility](https://en.wikipedia.org/wiki/Cap_of_invisibility) ·
[Philoctetes](https://en.wikipedia.org/wiki/Philoctetes)

### Celtic — the maintenance-cost cluster

| Weapon | origin | form | essence | quant/cat | cost | requirement_shape | acquisition |
|---|---|---|---|---|---|---|---|
| **Gáe Bulg** | mythological | spear of **Curruid sea-monster bone**, seven heads × seven barbs | **severance** | **categorical** | 🔴 "used as a last resort"; **the body must be cut apart to retrieve it** | 🔴 **a withheld technique** — "made ready for use on a stream and cast from the fork of the toes"; Scáthach taught it to Cú Chulainn alone, not even to Ferdiad | **crafted from a carve** + **story** (the teaching) |
| **Lúin of Celtchar** | mythological | fiery lance, fifty rivets, shaft "a load for a team of oxen" | dominion (fire) | **quantitative** — "each thrust will kill a man, even if it does not reach him; if cast, it will kill nine" | 🔴 **it turns on its bearer** — unquenched it "blazed up over its shaft" and "will pierce him or the lord of the royal house"; Celtchar died by a drop of blood running down it | 🔴 **"a cauldron full of venom is required to quench it"** + four men to hold the cauldron | found at the Battle of Mag Tuired |
| **Fragarach** | mythological | sword, "The Answerer" | **bypass** | **categorical** | not stated | not stated | **story** — an Otherworld gift to Lugh on becoming provisional king |
| **Caladbolg** | mythological | sword, "hard lightning"; "as big as a rainbow in the air" when swung | **world-scale** | **categorical** | not stated | 🔴 **a forbidden target** — barred from use against Conchobar | **story** — Cú Chulainn gives it to Fergus |

⭐ **Gáe Bulg is the best single entry in the whole corpus for GPT.** Its gate is not a stat,
not a cost and not a rarity — it is **a technique one teacher taught to one student and
deliberately withheld from another.** The spear is bone anyone could carve; what makes it
apex is *knowing how to throw it*.
⚙️ **This is L-14 made literal, and it is the second gate tranche 1 asked for.** Solo Leveling
gated an apex item twice (forge it *and* be given it). Gáe Bulg gates it twice too: **carve the
material, then be taught the throw.** GPT can gate an apex item on a *skill* the party must be
taught in-fiction — which is a story beat, not a drop table.
⚠️ **Lúin is the counter-example worth keeping:** it is the one flatly **quantitative** myth
weapon in the tranche (it kills by the numbers, one and nine), and it is *also* the one that
most reliably kills its own wielder. Myth prices raw numbers with danger.
🔗 [Gáe Bulg](https://en.wikipedia.org/wiki/G%C3%A1e_Bulg) ·
[Lúin of Celtchar](https://en.wikipedia.org/wiki/L%C3%BAin_of_Celtchar) ·
[Fragarach](https://en.wikipedia.org/wiki/Fragarach) · [Caladbolg](https://en.wikipedia.org/wiki/Caladbolg)

### Japanese — the legitimacy cluster

| Weapon | origin | form | essence | quant/cat | cost | requirement_shape | acquisition |
|---|---|---|---|---|---|---|---|
| **Kusanagi-no-Tsurugi** | mythological | sword, ~82cm, "resembled a calamus leaf" | **investiture** + dominion (wind) | **categorical** | none stated; Yamato Takeru dies after leaving it behind | 🔴 **regalia** — possession is the claim to rule; too divine to display | 🎯 **loot from a carve** — Susanoo finds it **inside the body of Yamata no Orochi** |
| **Ame-no-Nuhoko** | mythological | jewelled lance / naginata | **world-scale** (creation) | **categorical** | not stated | divine status — only Izanagi and Izanami | **story** — received from the older heavenly gods |
| **Muramasa** | mythological (legend over a real smith) | katana / spears | **oath/geas** | **categorical** | 🔴 **"once drawn, a Muramasa blade has to draw blood before it can be returned to its scabbard, even to the point of forcing its wielder to wound himself or commit suicide"** | the same clause is the requirement | **crafted** — Sengo Muramasa's school |

⭐ **Kusanagi is a boss carve that became a crown.** Susanoo kills the eight-headed serpent and
finds a sword *in the corpse* — mechanically identical to a GPT carve — and that object then
becomes one of the three Imperial Regalia. **The same item is loot at the moment of the kill and
political legitimacy a thousand years later.**
⚙️ **GPT has no way for an item's MEANING to appreciate.** Our items have tiers and bands; they
do not gain significance from what was done with them. A carve that later becomes a claim is a
free progression axis for a show about being *watched*.
⚠️ **Muramasa's curse is documented as legend, not history** — the article is explicit that the
Tokugawa deaths reflect "most Mikawa samurai used these superior weapons — misfortune followed
statistically, not supernaturally." Recorded here as a *design* source, not a factual one.
🔗 [Kusanagi-no-Tsurugi](https://en.wikipedia.org/wiki/Kusanagi-no-Tsurugi) ·
[Amenonuhoko](https://en.wikipedia.org/wiki/Amenonuhoko) · [Muramasa](https://en.wikipedia.org/wiki/Muramasa)

### Chinese — the cost-at-forge cluster

| Weapon | origin | form | essence | quant/cat | cost | requirement_shape | acquisition |
|---|---|---|---|---|---|---|---|
| **Ruyi Jingu Bang** | mythological | iron staff, gold-ringed; **13,500 catties (~7,960 kg)** | **transformation** + multiplicity | **categorical** | not stated | 🔴 **the weight itself is the gate** — an immovable "useless iron pillar" to everyone else | 🎯 **loot, socially negotiated** — surrendered by Ao Guang once the dragon queen says Wukong is "fated to own it" |
| **Gan Jiang & Mo Ye** | mythological | paired male/female swords | — (no supernatural power stated) | **quantitative** | 🔴 **cost is entirely at the forge**: "the couple cut their hair and nails and cast them into the furnace"; in the other account "Mo Ye sacrificed herself… by throwing herself into the furnace". Gan Jiang is then executed for keeping the male sword | three months demanded, three years taken | **crafted under coercion** — commissioned by King Helü of Wu |

⭐ **Ruyi Jingu Bang inverts the requirement.** Every other myth weapon's gate is knowledge,
worth or ritual. This one's gate is **a stat, nakedly** — it weighs eight tonnes and you either
can lift it or you cannot. It is the closest thing in myth to a §12.1 Physique requirement, and
it is *also* the most transformation-heavy item in the corpus (needle-to-pillar, self-copying).
⚙️ **Power and requirement are on the same axis and that is why it reads clean:** the thing that
makes it hard to hold is the same thing that makes it hit.
⭐ **Gan Jiang & Mo Ye is the purest cost-at-forge case in the corpus** — and note the swords
themselves have **no stated powers at all.** The entire mythic weight sits in *what the making
cost*, not in what the object does. An item can be legendary purely by provenance.
🔗 [Ruyi Jingu Bang](https://en.wikipedia.org/wiki/Ruyi_Jingu_Bang) ·
[Gan Jiang and Mo Ye](https://en.wikipedia.org/wiki/Gan_Jiang_and_Mo_Ye)

### Hindu — the licensed-armament cluster (the most system-like tradition found)

| Weapon | origin | form | essence | quant/cat | cost | requirement_shape | acquisition |
|---|---|---|---|---|---|---|---|
| **Brahmastra** | mythological | invoked fireball | **world-scale** | **categorical** | 🔴 **area denial for an age** — the Brahmashirsha variant prevents "even a single blade of grass from ever growing in that area again. Rivers completely dry up, ensuring famines" | 🔴 **you must know how to invoke it AND how to recall it** — Ashvatthama had "the entire teaching… " missing the recall | **story** — knowledge, not object |
| **Sudarshana Chakra** | mythological | spinning disc | severance / "wheel of time" | **categorical** | not stated | not stated | 🎯 **loot** — Vishnu "slays a danava named Hayagriva… seizing the disc from him" |
| **Vajra** | mythological | ribbed metal scepter | **bypass** | **categorical** | 🔴 **a life, at the forge** — Dadhichi "gave up his life by the art of yoga after which the devas fashioned the vajrayudha from his spine" | mastery implied (Vajrabhrit / Vajrahasta) | **crafted from a carve — of a willing person** |
| **Narayanastra** | mythological | volley of missiles | **reciprocity** | **categorical** | rebounds on the user and his own troops if invoked twice | 🔴 **once only** | **story** — mantra-bound |

⭐ **The astra SYSTEM is the single most transferable structure in this tranche.** Not any one
weapon — the licensing model around all of them:
- **Transmission is gated on character, not level** — knowledge passes "from a Guru to a Shishya
  by word of mouth, and only after the student's character had been established."
- **Some cannot be taught at all** — "certain astras had to be handed down from the deity
  directly; knowledge of the incantation was insufficient."
- **Use is conditional and the conditions bite** — "specific conditions existed involving the
  usage of astras, violating them could be fatal."
- **Charges are real** — Narayanastra "could be used only once", and "any attempt to invoke it a
  second time rebounds on the user and his troops."

⚙️ **This is §12.5 uses/charges with teeth, and it is the missing "you may push this, and it
will hurt" that tranche 1 flagged via Chastiefol.** Myth's version is sharper than Chastiefol's:
the second use does not cost *you* — it hits **your own party**. That is a cost a table will
actually feel, and it is trivially implementable.
⭐ **Vajra is Gáe Bulg's mirror and the corpus's best acquisition story.** Both are *weapons
carved from a body*. Gáe Bulg's body was a monster that died fighting another monster; Vajra's
was **a sage who volunteered his own spine.** Same mechanic, opposite moral weight — and GPT
currently has only the monster version.
⭐ **Narayanastra is a genuinely new essence.** It is not dominion and not redirection: **its
intensity "rises in proportion to the resistance of the target," and "total submission before
the missiles hit… would cause them to stop and spare the target."** The weapon reads the
target's *stance* and answers it. Nothing in W-3 covered this — see **reciprocity** in W-3.
🔗 [Brahmastra](https://en.wikipedia.org/wiki/Brahmastra) · [Astra (weapon)](https://en.wikipedia.org/wiki/Astra_(weapon)) ·
[Sudarshana Chakra](https://en.wikipedia.org/wiki/Sudarshana_Chakra) · [Vajra](https://en.wikipedia.org/wiki/Vajra) ·
[Narayanastra](https://en.wikipedia.org/wiki/Narayanastra)

### Islamic

| Weapon | origin | form | essence | quant/cat | cost | requirement_shape | acquisition |
|---|---|---|---|---|---|---|---|
| **Zulfiqar** | mythological | **bifurcated blade** — splits into two points at the tip | **investiture** | **categorical** | not stated | 🔴 **be the person** — "There is no sword but the Zulfiqar, and there is no Hero but Ali" | **story** — granted; Muhammad replaced Ali's broken sword with it, acquired "on the day of Badr" |

⭐ **Zulfiqar is the requirement_shape taken to its limit**: the weapon's gate is not a stat, a
technique or a rite — it is **an identity**. The couplet is the requirement, stated as verse.
⚙️ Pairs exactly with Nanatsu no Taizai's Sacred Treasure rule from tranche 1 (issued to a
specific person, draws out the powers they already have). **Myth and the anime canon agree, and
they agree with L-14.** Three independent sources, one rule.
🔗 [Zulfiqar](https://en.wikipedia.org/wiki/Zulfiqar)

---

## W-4c — Tranche 3: games with real loot tables (queue #6, promoted)

Run out of order. **W-6 §5 promoted this pass**: myth is only 16% loot and structurally
cannot fill the grid's loot column, so this is where the distribution shape actually lives.
Sourced from `*.wiki.fextralife.com`, which is reachable (200) where `*.fandom.com` is not.

### Elden Ring — the ratio, and a choose-one mechanic GPT already owns

| | |
|---|---|
| **Weapon categories** | **40** (32 base + 8 in *Shadow of the Erdtree*) |
| **Total weapons** | **~308 base**, plus "100 new and exciting Weapons" in the DLC |
| **Apex tier** | **9 Legendary Armaments** |
| **Apex ratio** | 🔴 **9 / 308 ≈ 2.9%** — about **one apex per 34 weapons** |
| **Second tier** | **25 Remembrances** (15 base + 10 DLC) — "Boss Souls… which grant the Power of their namesake Bosses" |

**Acquisition of the 9 Legendary Armaments** (the only apex set the page enumerates cleanly):

| Class | n | Which |
|---|---|---|
| 🎯 **boss drop** | **5** | Ruins Greatsword · Grafted Blade Greatsword · Marais Executioner's Sword · Devourer's Scepter · Golden Order Greatsword |
| **world find** | **3** | Eclipse Shotel · Sword of Night and Flame · Bolt of Gransax |
| **story/quest** | **1** | Dark Moon Greatsword — the Ranni questline |
| **crafted** | **0** | — |

🔴 **This is the near-exact inverse of myth** (W-6 §5: 44% story · 40% crafted · 16% loot).
Games put **56% of their apex items behind a boss corpse and none behind a forge**; myth puts
almost half behind a solved problem and none behind a drop rate. **Neither medium fills GPT's
grid on its own — which is why the corpus needed both passes.**

⭐ **The Remembrance mechanic is the single most directly usable thing in this tranche.**
Each Remembrance is exchanged with Enia for **one of two rewards**, and *"only one reward may
be selected per playthrough."* Duplication exists but is deliberately incomplete — **7
Wandering Mausoleums + 3 Duplication Coffins, once per mausoleum per remembrance, and the
top-tier Shardbearer remembrances cannot be duplicated at all.**

⚙️ 🎯 **GPT ALREADY SHIPPED THIS AND HAS NOT POINTED IT AT BOSSES.** The Lootbox system
(2026-08-10) is exactly a choose-one: sealed server-side contents, a reveal, `pick-one via
/claim`, and a permanent Box Log recording `chosenIndex` with *"chosen ✓ / unchosen struck
through."* **A boss-drop box holding two apex options, one claim, permanently logged, is a
zero-new-code feature** — Box Builder already composes contents, recipients and earned-by.
The unchosen strike-through *is* the Remembrance's "what you gave up," already rendered.
🔗 [Weapons](https://eldenring.wiki.fextralife.com/Weapons) ·
[Legendary Armaments](https://eldenring.wiki.fextralife.com/Legendary+Armaments) ·
[Remembrance](https://eldenring.wiki.fextralife.com/Remembrance)

### Monster Hunter Wilds — the pure crafted class, and zero drops

| | |
|---|---|
| **Weapon types** | **14** — Great Sword · Sword & Shield · Dual Blades · Long Sword · Hammer · Hunting Horn · Lance · Gunlance · Switch Axe · Charge Blade · Insect Glaive · Bow · Light Bowgun · Heavy Bowgun |
| **Acquisition** | 🔴 **crafting and upgrade trees, essentially exclusively.** The page describes no straight monster drops at all |
| **Materials** | Weapons are grouped by their source material — "Great Sword **Bone** Weapons", "Great Sword **Expedition** Weapons", "Great Sword **Independent** Weapons" |
| **Rarity** | ⚠️ **not fully stated** — the page names a "Rarity 8 Artian Weapon" but gives no tier count. Recorded as a gap, not guessed |

⭐ **14 weapon types × deep upgrade trees is the opposite strategy to Elden Ring's 40 × 308.**
Monster Hunter gets its breadth from **one axis (the monster you carved) crossed with a small
fixed set of classes**, not from a large flat catalog.

⚙️ 🔴 **That is GPT's model exactly, and it means the grid may be over-specified.** GPT already
has **weapon class (2–4 damage) × material band (×2 per floor, F1 ×2 → F9 ×512)**. The band
*already* makes one greatsword serve all nine floors — so **the 9-floor axis of the 9 × 3 × 3
grid is largely solved by a rule we already shipped, not by 9× the items.**
🟡 **Proposal, unblessed:** the corpus's real target may be closer to **~27 concepts (3 routes
× 3 acquisition classes), each carried across floors by the band**, plus a small apex set —
rather than 81 distinct authored weapons. This is a **scope finding for the owner**, not a
ruling; the 9 × 3 × 3 framing came from the owner and stands until they say otherwise.
🔗 [Weapons](https://monsterhunterwilds.wiki.fextralife.com/Weapons)

### Dark Souls 3 — thin, recorded honestly

| | |
|---|---|
| **Categories** | **23** |
| **Total weapons** | ⚠️ **the page does not state one.** Not guessed |
| **Apex tier** | **Boss Souls Weapons** exist as a named category; ⚠️ **count not given on this page** |
| **Acquisition** | **Soul Transposition** — boss souls are converted into weapons rather than dropping as weapons |

⚠️ **This entry is deliberately incomplete.** It was fetched as a second data point for the
apex ratio and did not carry the numbers. Left in the corpus as a **negative result with a
live source**, so a later pass knows to try the `/Boss_Soul_Weapons` sub-page instead.
⭐ Even so, one structural point lands: **Soul Transposition is the same shape as Elden Ring's
Remembrance** — the boss does not drop a weapon, it drops a **token you convert into a choice.**
Two of the biggest loot games in the genre both refuse to let their apex items be simple drops.
🔗 [Weapons](https://darksouls3.wiki.fextralife.com/Weapons)

---

## W-4d — Tranche 4: passes #2, #3, #4 and #5 (unblocked via the Fandom API)

🔓 **The Fandom block is bypassed.** `*.fandom.com/wiki/…` page views return the Cloudflare
403, but **`*.fandom.com/api.php` returns 200** — the MediaWiki API is not behind the
challenge. Every entry below is raw wikitext pulled from `api.php`, which is *higher* fidelity
than an HTML read because infobox stat blocks arrive as structured fields. Helper:
`action=query&prop=revisions&rvprop=content&rvslots=main&titles=<Title>`.
⚠️ **wiki.gg is a dead end for this corpus** — probed and the target communities do not exist
there (`solo-leveling`, `nanatsu-no-taizai` → 404; `towerofgod`, `fate` → 401). Do not re-probe.

### Pass #2 — cultivation ladders. 🔴 W-1's headline does not survive a page read

Three **independent** series, read directly:

| Series | Ladder | Rungs |
|---|---|---|
| **Apotheosis** | Huang/Yellow → Xuan/Black → Di·Ling/Earth → Tian·Xian/Heaven → Sheng/Saint → Shen/Divine → Zhi Zhun Shen/Supreme → Hun Dun Zhi/Primordial | **8** |
| **Martial Peak** | Ordinary → Earth → Heaven → Mysterious → Spirit → Saint → Saint King → Origin → Origin King → Dao Source → Emperor → Open Heaven | **12** |
| **Coiling Dragon** | Artifact → Divine (Demigod → God → Highgod) → Sovereign → Overgod | **4** (Divine split 3) |

🔴 **Two corrections to W-1, both material:**

1. **The "near-universal standardised ladder" is not supported.** W-1 reported *"Common →
   Spiritual → Earth → Heaven → Divine, near-universal across the genre."* The three ladders
   above **do not agree on vocabulary or on order.** The sharpest disproof: **`Xuan` /
   "Mysterious" is rung 2 of 8 in Apotheosis — *below* Earth and Heaven — and rung 4 of 12 in
   Martial Peak, *above* both.** The same word sits on opposite sides of the same two rungs.
2. ⚠️ **W-1's two citations were one source.** The *Apotheosis Wiki* "Light Novel Tiers" table
   and the *Cultivation levels of light novels Wiki* "Weapon tiers" page are **character-for-
   character identical** — a copy, not corroboration. W-1 read as n=2 and was n=1. This is
   exactly the failure W-0's provenance rule exists to catch, and it got through because
   tranche 1 was harvested from **search summaries rather than page reads.**

✅ **What survives, and it is the more useful half:**
- **The GRAMMAR is universal even though the vocabulary is not.** All three run *ordered bands
  × ~3 sub-grades* (Low/Middle/Top; Demigod/God/Highgod). ⚙️ **GPT already has exactly this
  two-level structure** — §12.7's *tier = craftsmanship, material = power scale.* Independent
  convergence, and it means our split is genre-legible without importing any of the words.
- ✅ **W-1's point #2 is CONFIRMED and stronger than stated.** The top band gets *more*
  resolution, not less: Apotheosis's **Shen/Divine alone has six sub-grades** (Semi Third →
  First); Martial Peak bolts a fourth level (**Great Emperor**) onto its top band only.
- 🔴 **Martial Peak independently invented GPT's band-per-floor rule.** *"Every world usually
  has a limit on the grade of products it can produce,"* and grades *"correspond to their
  usefulness in both dealing with and being used by cultivators of their equivalent rank."*
  That is §12.7's one-band-per-floor, arrived at separately for the same reason.
- 🔴 **NEW — past a certain height the genre stops grading by POWER and grades by PROVENANCE.**
  Apotheosis's top classes are not stronger rungs, they are **origin classes**: *Bloodline
  Integration · Innate Faith Accumulation · Parmita Faith Item Projection · **Formed Before
  Chaotic Source** · From Immortal Realm's Bloodline Ability · Power of a higher level of
  Energy.* Coiling Dragon does the same — Sovereign's Might is *"made from a tiny fraction of
  Sovereign's spiritual energy."* See **W-8 §2**.
- ⭐ **The leaderboard rung.** Apotheosis grades its Divine and Supreme bands by *public
  ranking*: **"First Grade (Top 10000 in Universe Myriad Spirit Monument)"**, then Top 3000,
  Top 1000, **"Upper Grade (Top 50)"**. 🎯 **An item whose tier is a position on a public board
  that moves as others rise and fall is a mechanic a broadcast competition writes for free.**
🔗 [Apotheosis Weapon Tiers](https://apotheosis-manga.fandom.com/wiki/Weapon_Tiers) ·
[Cultivation levels — Weapon tiers](https://cultivation-levels-of-light-novels.fandom.com/wiki/Weapon_tiers) ·
[Martial Peak Grading System](https://martial-peak.fandom.com/wiki/Grading_System) ·
[Coiling Dragon — List of Weapons and Artifacts](https://coiling-dragon.fandom.com/wiki/List_of_Weapons_and_Artifacts)

### Pass #3 — progression manhwa: the acquisition gate is a CHOICE, not a stat

| Source | Acquisition mechanism |
|---|---|
| **Solo Leveling — the System** | 🔴 Jinwoo was chosen as Player *"when he voluntarily decided to stay behind and sacrifice himself so that the rest of his raid party could leave alive."* The System then supplies everything — **Power Bestowal · System Quests · System Store · System Rewards · Instant Dungeons · Unlimited Inventory** |
| **Solo Leveling — Baruka's Dagger** | 🎯 **loot**, stated as flat numerics: *"Attack +110", "Agility +10"*, `item_class = A-Rank`, `source = Baruka` — *"Jinwoo recovered it as one of his drop items"* |
| **Tower of God — 13 Month Series** | **12 sentient Ignition Weapons + 1 Arms Inventory**, one craftsmaster (Ashul Edwaru), materials supplied by King Zahard, **bestowed to a Princess** |

⭐ **Solo Leveling's real apex gate is a moral choice under pressure, not a level.** The entire
power fantasy is downstream of one decision to die for the party. ⚙️ Converges exactly with
the **astra system** (W-4b): transmission *"only after the student's character had been
established."* Two genres, same gate — **the story class is gated on conduct.**
⚠️ Note the split *inside one series*: Solo Leveling's ordinary items are bare numerics
(+110 attack) while its apex is a story beat. **The quantitative item is the floor of the
genre, never its ceiling** — consistent with W-6 §2.
🔗 [System](https://solo-leveling.fandom.com/wiki/System) ·
[Baruka's Dagger](https://solo-leveling.fandom.com/wiki/Baruka%27s_Dagger) ·
[13 Month Series](https://towerofgod.fandom.com/wiki/13_Month_Series)

### Pass #4 — sacred sets: finite economies, and the weapon that says no

**Akame ga Kill — Teigu.** The most mechanically complete apex system in the corpus.

| | |
|---|---|
| **Set size** | 🔴 **48, fixed and non-replenishing.** *"36 have been shown so far, out of which **15 have been destroyed**, while two are currently missing"* |
| **Made from** | 🎯 **carves** — *"created from the remains of Danger Beasts that had unique powers"* — plus **Orichalcum**. 🔴 *"the raw materials selected can determine the Teigu's strength and its capabilities"* |
| **Requirement** | 🔴 **compatibility, and the item may refuse** — *"Even if a user is strong enough to use a Teigu, it can still reject them, and a user's first impression of it affects their compatibility"* |
| **Hard limit** | **One per person.** *"if one were to use two Teigu at the same time, they would be destroyed by it."* Wave managed two and *"suffered severe damage… an unspecified organ was damaged beyond repair"* |
| **Cost of overuse** | 🔴 **you become the carve** — *"Certain Teigu begin to fuse with the user if it is overused, slowly transforming the user into the original Danger Beasts"* |
| **Growth** | ⭐ **hidden abilities** — *"not all Teigu have those, however, certain users can develop such abilities themselves"* |
| **Meta-rule** | *"If two Teigu users engage in a battle, both with killing intent, one of them is certain to die"* |

**Nanatsu no Taizai — Sacred Treasure** (page-read, upgrading tranche 1's summary): created by
**Dubs**, and *"King Bartra Liones **entrusted** these weapons to the Seven Deadly Sins when the
king formed the group"* — issued, not won. A Sacred Treasure *"allows the user to draw out
their powers to their full potential."* ⚠️ **They are also losable and tradeable** — Lostvayne
was **sold to fund a bar**, Courechouse was **stolen**, Gideon simply **lost**, and Merlin later
**bought Lostvayne back in Camelot.** An apex item with a resale market is a different economy
from a myth relic.

**Fate — Noble Phantasm.** The purest statement of **investiture** anywhere in the sweep:
*"crystallized Mysteries", "powerful armaments made using human imagination as their core"*,
which *"embody the ultimate Mysteries of a hero as symbols of their existence through
historical fact and anecdotes."* They may be physical **or abstract** — *"unique (even
conceptual) means of attack, curses, and changes to the very environment."* 🔴 **The origin
story is the mechanic:** all descend from nameless prototypes in Gilgamesh's treasury, *"their
forms before they were granted such through myth"* — *"It is impossible for myths and legends
to start from nothing."* **The object does not become apex until a story is told about it.**
🔗 [Teigu](https://akamegakill.fandom.com/wiki/Teigu) ·
[Sacred Treasure](https://nanatsu-no-taizai.fandom.com/wiki/Sacred_Treasure) ·
[Noble Phantasm](https://typemoon.fandom.com/wiki/Noble_Phantasm)

### Pass #5 — crafting-heavy: two crafted models, and the fake that worked

**Arifureta — the crafter-gated model.** *"Only two people in the previous and current era have
been known to be able to create an artifact"* — Oscar Orcus and Hajime Nagumo, in all of
recorded history. Creation requires **creation magic**, *"one of the ancient magics belonging
to the age of gods"*, and the **Synergist** job class *"has the highest affinity with creation
magic, thus have the best ability at creating an artifact."* Any artifact at all is
*"practically considered a national treasure."*

🔴 **This is a second crafted model and GPT only has the first:**

| Model | Gate | Examples |
|---|---|---|
| **material-gated** | what you carved | Monster Hunter · Teigu · **GPT §12.7** |
| 🆕 **crafter-gated** | **who can make it at all** | Arifureta (2 people ever) · the Norse dwarves (W-4b) · 13 Month Series (one craftsmaster) · Sacred Treasures (all by Dubs, bar one) |

⚙️ **Every crafter-gated source in the corpus names ONE smith.** Ashul Edwaru made all 13; Dubs
made six of seven Sacred Treasures; Eitri & Brokkr and the Sons of Ivaldi made most of the
Norse apex set. **GPT's carve has no maker at all** — materials go in, an item comes out. Naming
a smith turns every apex item into a relationship, and it makes the tranche-2 dwarf finding
(coerced craft comes out flawed) actually implementable.

**Frieren — 🔴 the best single item in the whole corpus, and it is a fake.**

The Sword of the Hero, *"supposedly placed by the Goddess of Creation herself and embedded
within a rock"*, `purpose = To be drawn by the Hero`. *"It can only be drawn by the Hero, who
shall drive away the great calamity."*

> **"Himmel the Hero attempted to pull it out, but he failed."**
> **"Himmel wielded a replica"** — commissioned by a merchant, forged by the dwarven blacksmith
> **Kiesel** — and *"rumors spread that he defeated the Demon King with the legendary sword and
> only a small circle of people know the truth."*

⭐ **The real apex weapon rejected the real hero, the rejection was WRONG, and a replica did the
job because the legend attached to the wielder instead of the object.** This lands on three
separate threads at once:
- **W-8 §1 (the item's consent):** the consent gate can be *mistaken*. Every other source treats
  the item's refusal as authoritative; Frieren treats it as a **fact about the sword, not about
  the man.**
- **W-8 §2 (provenance over power):** Fate says an object becomes apex once a legend forms
  around it. Frieren says **the legend can form around the wrong object and work anyway.**
- **L-14:** the sharpest possible statement of *stats are the key, not the gun* — the gun was
  literally a prop.

🎯 **This is the most GPT-shaped finding in the sweep.** In a show where the audience decides
what is true, **an apex item that works because everyone believes it does** is not a cheat — it
is the setting's own logic. The Corporation™ handing a party a replica, and the replica working
exactly as long as the broadcast sells it, is a complete story beat that needs **no new
mechanic** — only the willingness to let an item's power live in its reputation.
⚠️ **Dungeon Meshi was not mined** — the wiki has no single equipment/magic-item page that
carries the crafted-class signal; searches returned character pages. Recorded as a gap, not
guessed.
🔗 [Arifureta — Artifact](https://arifureta.fandom.com/wiki/Artifact) ·
[Frieren — Sword of the Hero](https://frieren.fandom.com/wiki/Sword_of_the_Hero)

---

## W-5 — The sweep queue

Ordered so each pass adds a *distinct* grading signal rather than more of the same.

| # | Target | What it is for |
|---|---|---|
| ~~1~~ | ~~Classical myth~~ ✅ **DONE 2026-08-25** — 25 weapons, W-4b | The **essence averages**, delivered in **W-6**. ⚠️ Finding: myth weapons *do not* reliably carry a cost (40%) — they carry a **requirement** (64%) |
| ~~2~~ | ✅ **DONE 2026-08-25** (W-4d, via the Fandom API) — Cultivation manhua ladders — Apotheosis · Global Martial Arts · Eternal Supreme | **Band grading.** W-1's ladder, verified across series |
| ~~3~~ | ✅ **DONE 2026-08-25** (W-4d, via the Fandom API) — Progression manhwa — Solo Leveling · Tower of God · Omniscient Reader | **Acquisition classes.** These genres are explicit about drop vs craft vs story |
| ~~4~~ | ✅ **DONE 2026-08-25** (W-4d, via the Fandom API) — Sacred-set anime — Nanatsu no Taizai · Fate (Noble Phantasms) · Akame ga Kill (Teigu) | **Categorical powers**, and per-wielder gating |
| ~~5~~ | ✅ **DONE 2026-08-25** (W-4d) — Crafting-heavy — Arifureta · Frieren (⚠️ Dungeon Meshi not mined — no equipment page) | **The crafted class.** Found a **second** crafted model GPT lacks (crafter-gated vs material-gated), and the corpus's sharpest item: **Frieren's Sword of the Hero is a fake that worked** |
| ~~6~~ | ~~Games with real loot tables~~ ✅ **DONE 2026-08-25** — W-4c, run out of order after W-6 §5 promoted it. Elden Ring · Monster Hunter Wilds · Dark Souls 3 (Diablo unreachable — fandom) | **Distribution shape**, delivered in **W-7**. Apex ratio ≈ **2.9%**; games are **56% boss-drop / 0% crafted** against myth's 16% / 40%. 🔴 Raised one owner question: the band may already solve the grid's floor axis (W-7 §3) |

**Resume by:** appending to W-4 under a new tranche heading, keeping the schema, and never
dropping the source line.

---

## W-6 — ⭐ The essence averages (computed from tranche 2, n=25)

This is what queue #1 existed to produce: **what an apex item is ABOUT**, measured rather
than assumed. Counts are over the **25 classical-myth weapons** in W-4b only — the Astra
*system* page is excluded (it describes no single weapon), and tranche 1's anime/manhwa
entries are excluded too so the myth baseline stays clean.

### 1. 🔴 Myth gates on REQUIREMENT, not on COST — and tranche 1 got this backwards

| Gate | Count | Share |
|---|---|---|
| Carries a **requirement** on the wielder | 16 / 25 | **64%** |
| Carries a **cost** of any kind | 10 / 25 | **40%** |
| Carries **neither** | 8 / 25 | 32% |

⚠️ **Correction to W-2.** The tranche-1 schema note reads *"Myth weapons almost always have
[a cost]."* **They do not.** Only two in five do. Gungnir, Harpe, the Trident, the Cap
of Invisibility, Fragarach, Sudarshana and Zulfiqar are all free to use. What myth reliably
attaches is **a condition on who you must be or what you must know** — gloves and a belt,
a withheld throwing technique, a cauldron of venom, the recall-mantra, being Ali.

⚙️ **GPT already picked the right lever.** §12.1 gates weapons on a stat requirement, and
L-14 ruled stats are the key and not the gun. **The myth average agrees with L-14 by a
24-point margin.** The item that needs a *cost* is the exception, not the rule — so stop
treating "what does it take from you" as the mandatory apex-item question. The mandatory
question is **"what must you be to hold it."**

### 2. 🔴 Myth has no quantitative weapons — and the genre canon is the opposite

| | Count | Share |
|---|---|---|
| **Categorical** | 22 / 25 | **88%** |
| Quantitative or no power stated | 3 / 25 | 12% |
| **Flat stat-bonus items ("+X damage")** | **0 / 25** | **0%** |

Not one myth weapon in the corpus is a numeric upgrade. The three non-categorical entries
are Lúin of Celtchar (kills one per thrust, nine if cast), Gram (cuts well), and Gan Jiang &
Mo Ye (**no stated power at all** — it is legendary purely by what the forging cost).

⭐ **Set that against tranche 1**: Solo Leveling's two entries are *both* quantitative
(+1500 attack; +110 attack / +10 agility). **The split is not myth-vs-fiction, it is
myth-vs-GAME.** Numeric apex items are a loot-table artifact; myth never needed them because
myth has no character sheet to inflate.
⚙️ **L-14's "only categorical powers can ride an apex item" is myth-accurate at 88%.** This
is the strongest empirical backing any GPT rule has picked up in this sweep.

### 3. 🔴 "Never misses" is worth NOTHING in GPT — split the essence

Verified against the live rules, not assumed: `rulebook/gpt-system-v1.0.md` §29 —
**"No to-hit rolls. Actions auto-succeed when their requirements are met"** — and §307:
**"'Miss' is not a general mechanic. It exists only as an explicit effect… or as a Dodge
Threshold."**

So **inevitability** (Gungnir "hits regardless of the attacker's skill"; Tyrfing "never
misses a stroke") buys a GPT player **almost exactly zero**, biting only against the narrow
set of enemies carrying a Dodge Threshold.

But the neighbouring myth power is *devastating* in GPT:

| Myth text | Reads in GPT as | Value |
|---|---|---|
| Gungnir: hits "regardless of skill" | accuracy — a stat GPT does not have | ❌ **void** |
| Fragarach: **"no mail or armour could block it"** | **ignores resistances** | ✅ **enormous** |
| Vajra: harms Vritra, who was **immune to all known weapons** | **ignores immunity** | ✅ **enormous** |

⚙️ **Action: W-3 splits `inevitability` into `inevitability` (void in GPT — do not spend an
apex slot on it) and `bypass` (ignores the resistance/immunity layer — the single most
valuable categorical power available in our combat math).** GPT's defence is body-part HP
and seven resistances; a weapon that answers the *defence layer* is the one that matters.

### 4. Essence frequencies — severance is myth's default apex concept

| Essence | n | Notes |
|---|---|---|
| **severance** | 6 | Tyrfing · Gram · Harpe · Mistletoe · Gáe Bulg · Sudarshana |
| **dominion** | 4 | Aegis · Cap of Invisibility · Freyr's sword · Lúin |
| **world-scale** | 4 | Trident · Caladbolg · Ame-no-Nuhoko · Brahmastra |
| **investiture** 🆕 | 3 | Mjölnir · Kusanagi · Zulfiqar |
| **bypass** 🆕 | 2 | Fragarach · Vajra |
| **inevitability** | 2 | Gungnir · Bow of Heracles |
| transformation · oath/geas · **reciprocity** 🆕 | 1 each | Ruyi Jingu Bang · Muramasa · Narayanastra |
| **redirection** | **0** | ⚠️ **no myth instances at all** |

Two results worth keeping:
- **severance at 24% (6/25) is the mythic default.** "Cuts the thing that cannot be cut" is what an
  apex weapon is *for*, more often than anything else. GPT's Mistletoe is already exactly this.
- 🔴 **`redirection` has zero myth support.** It entered W-3 from tranche 1 (Gideon) and from
  our own Forest Resin. It is an **anime/game** essence, not a mythic one — so it will not
  inherit mythic weight, and it should not be used where the intent is "this feels ancient."

### 5. Acquisition: myth will not populate the loot column

| Class | n | Share |
|---|---|---|
| **story** (exists only after a problem is solved) | 11 | 44% |
| **crafted** | 10 | 40% |
| 🎯 **loot** (it drops) | **4** | **16%** |

Only four myth weapons are drops — Kusanagi (found inside Orochi's corpse), Sudarshana
(seized off Hayagriva), Ruyi Jingu Bang (surrendered by Ao Guang), Lúin (found at Mag Tuired).

⚙️ **This validates the queue order.** The 9 × 3 × 3 grid needs its loot column filled and
**myth structurally cannot fill it** — myth does not think in drop rates. That is precisely
what queue **#6 (Elden Ring · Monster Hunter · Diablo)** is for, and it is now the
highest-value remaining pass, not the last one. Consider promoting it.

⭐ **Three of the four myth "drops" are carves** — the weapon is made *from the body of the
thing you killed* (Orochi's corpse, the Curruid's bone, Dadhichi's spine). GPT's crafted
class is myth-accurate as designed; it is our *loot* class that has no mythic analogue.

### 6. 🎯 Four mechanics worth stealing, ranked by cheapness

1. **The second use hits your own party.** Narayanastra: "any attempt to invoke it a second
   time rebounds on the user **and his troops**." Sharper than tranche 1's Chastiefol strain
   (which costs only the wielder) and trivially implementable on top of §12.5 charges.
2. **The loan.** Greek apex gear is *lent against a task* and goes back (Cap → Athena, Hermes,
   Perseus; Aegis → Athena, Apollo; Harpe → Perseus for one job). A **fourth acquisition
   class** that lets F7–F9 show apex power without permanently inflating the party — the
   direct answer to W-1's "ascending, not plateauing."
3. **Coerced craft comes out flawed.** Loki's wager → Mjölnir's short handle; Svafrlami
   *traps* the dwarfs → Tyrfing is cursed. **The crafter is a character with a grudge.** GPT's
   carve is a material with no opinion; giving the smith agency is free narrative leverage.
4. **The withheld technique as second gate.** Gáe Bulg is ordinary bone; what makes it apex is
   a throw Scáthach taught to one student and refused to Ferdiad. Tranche 1 asked for a
   **second gate** on apex items (Solo Leveling forges *and* gifts) — **myth's second gate is
   knowledge, and knowledge is a story beat rather than a drop table.**

### 7. What this pass says about the essence list itself

W-3 was provisional on a 5-entry sample. On 26 myth entries it holds up structurally but
needed **three additions and one split**: `investiture` and `reciprocity` added, `bypass`
split out of `inevitability`, and `redirection` flagged as non-mythic. The buckets that
survived unchanged — severance, dominion, world-scale, transformation, oath/geas — are now
evidence-backed rather than guessed. **Treat W-3 as blessed for myth, still provisional for
the game/anime passes.**

---

## W-7 — The distribution shape (from tranche 3)

What queue #6 existed to answer: **how many ordinary items per unique**, and therefore what
actually fills a 9 × 3 × 3 grid.

### 1. The apex ratio is ~3%, and myth cannot supply it

| Source | Apex items | Pool | Ratio |
|---|---|---|---|
| Elden Ring | 9 Legendary Armaments | ~308 base weapons | **2.9%** |
| Elden Ring (incl. boss tier) | 9 + 25 Remembrances = 34 | ~308 | **11%** |

⚙️ **Read against GPT:** the grid has **81 cells** (9 floors × 3 routes × 3 acquisition
classes). At Elden Ring's 2.9% apex ratio, 81 *apex* items would imply a pool near 2,800 —
which is not a tabletop game, it is a database. **So the 81 cells cannot all be apex.** Either
the grid is mostly ordinary items with a handful of apexes scattered through it, or (see §3)
the floor axis is not an item axis at all.

### 2. Games and myth are near-inverses on acquisition — use both, for different columns

| Class | Myth (n=25, W-6 §5) | Elden Ring apex (n=9) |
|---|---|---|
| 🎯 **loot / boss drop** | **16%** | 🔴 **56%** (+33% world find) |
| **crafted** | **40%** | 🔴 **0%** |
| **story** | **44%** | **11%** |

⭐ **This is the most useful single table in the corpus.** Myth is a **story-and-forge**
tradition; loot games are a **corpse-and-map** tradition; and Monster Hunter is a pure
**forge** tradition with *zero* drops. **Grade against myth for the crafted and story columns,
and against loot games for the loot column** — the essence averages in W-6 are the right
yardstick for *what a weapon is about*, and W-7 is the right yardstick for *how many and from
where*. Do not use one where the other belongs.

### 3. ✅ RULED (W-9 R-1) — the floor axis IS already solved

Monster Hunter reaches full breadth on **14 weapon types**, because breadth comes from
*material × class*, not from catalog size. **GPT is built the same way** — §12.1 gives weapon
class (2–4 damage) and §12.7 gives the material band (×2 per floor, F1 ×2 → F9 ×512), and the
materials catalog already states *"the sheet plays identically on every floor; only the numbers
inflate."*

⚙️ **If the band already carries a greatsword from F1 to F9, then the grid's 9-floor axis is
not asking for 9× the weapons** — it is asking for 9 bands of the same weapons, which is a rule
we shipped, not content we owe.

🔒 **RULED 2026-08-25 — see W-9 R-1.** The owner adopted it: *"the band already solves the
floor axis — go with ~27 concepts."* The target is **~27 authored concepts plus a small apex
set at roughly Elden Ring's ratio**, not 81 weapons.

⚠️ **and the ruling corrected an arithmetic slip in this section.** The proposal read *"~27
concepts (3 routes × 3 acquisition classes)"* — but **3 × 3 = 9, not 27.** The parenthetical
was wrong and the 27 is right: it comes from **3 SETS × 3 routes × 3 acquisition classes**.
The floor axis collapses into the **set** axis (F1–F3 · F4–F6 · F7–F9), not to nothing —
because a campaign runs one set, and the M-bands already partition exactly that way (M-1/M-2/
M-3 inside Set 1, M-4 for Set 2, M-5 apex). Full working in **W-9 R-1**.

### 4. Two mechanics to add to W-6 §6's steal list

5. **The boss drops a TOKEN, not a weapon.** Elden Ring converts a Remembrance to **one of two
   rewards, "only one reward may be selected per playthrough"**; Dark Souls 3 does the same via
   Soul Transposition. Two of the genre's biggest loot games both refuse to let an apex item be
   a simple drop. 🎯 **GPT can ship this with no new code** — the Lootbox system already does
   sealed contents → reveal → `pick-one via /claim` → permanent Box Log with the unchosen
   options struck through. Point a two-item box at a boss and the mechanic is live.
6. **Incomplete duplication as a scarcity dial.** Remembrances can be duplicated — but only at
   **7 Wandering Mausoleums + 3 Coffins, once each per remembrance**, and **the top-tier
   Shardbearer remembrances not at all.** A partial second chance is a finer scarcity control
   than a binary one, and it is exactly the knob a campaign wants when a party made a choice
   they regret on Floor 3 and will live with it until Floor 9.

---

## W-8 — ⭐ Convergence: what all six passes agree on

The sweep is **complete — all six queue passes are done.** Corpus: **25 myth weapons + 14
fiction/game systems** across myth, cultivation manhua, progression manhwa, sacred-set anime
and three loot-driven games. These are the findings that showed up **independently in sources
that could not have copied each other** — which is the only kind of finding worth acting on.

### 1. ✅ RULED (W-9 R-2) — the item's CONSENT is a fifth requirement shape

Five independent sources gate an apex weapon on something the player **cannot farm**:

| Source | The gate |
|---|---|
| **Teigu** (Akame ga Kill) | *"Even if a user is strong enough… it can still reject them, and a user's **first impression** of it affects their compatibility"* |
| **13 Month Series** (Tower of God) | *"Each weapon has its own personality… it may **refuse to obey its owner regardless of their skill**"* |
| **Sacred Treasure** (Nanatsu no Taizai) | Entrusted to a named person; draws out *their* power |
| **Zulfiqar** (Islamic myth) | *"There is no sword but the Zulfiqar, and there is no Hero but Ali"* |
| **Gram** (Norse myth) | Only Sigmund could draw it from Barnstokkr |

🔴 **Tower of God disproves the stat-gate on the page.** The official rule is that *"only a
formal Princess is supposed to be able to ignite a 13 Month Series"* — and the wiki immediately
records that **Regulars have "proven this to be untrue,"** and that **Baam ignited Black March
while its owner, an actual formal Princess, could not.** The stated requirement was the wrong
model of the requirement.

⚙️ **GPT's §12.1 requirement is a number you meet** (Physique 5, Mistletoe's Charm 8). That is
one requirement shape out of five in evidence. **An item that refuses a specific contestant —
and can be won over — is a requirement the party plays rather than buys**, and it is the one
shape that a level budget cannot trivialise. Given L-14 already ruled stats are the key and not
the gun, this is the natural next question: *whose* key.

### 2. 🔴 At the top, grading switches from POWER to PROVENANCE — five bodies of evidence

| Source | The apex is defined by |
|---|---|
| **Apotheosis** | **Origin classes, not rungs** — *Bloodline Integration · Innate Faith Accumulation · Formed Before Chaotic Source · From Immortal Realm's Bloodline Ability* |
| **Coiling Dragon** | Sovereign's Might — *"made from a tiny fraction of Sovereign's spiritual energy"* |
| **Fate** | *"It is impossible for myths and legends to start from nothing"* — prototypes become Noble Phantasms only once a legend forms around them |
| **Gan Jiang & Mo Ye** (Chinese myth) | 🔴 **No stated powers at all.** Legendary purely because of what the forging cost |
| **Elden Ring / Dark Souls 3** | The boss drops a **token of whom you beat**, converted into a choice — never the weapon itself |

⭐ **This is the sweep's strongest result.** Myth, cultivation fiction, Japanese urban fantasy
and Western loot games — four traditions with no common ancestor — all stop asking *"how hard
does it hit"* at the top of the ladder and start asking *"where did it come from."*

⚙️ **W-6 §3 flagged that GPT has no way for an item's MEANING to appreciate.** This is that gap
confirmed from four more directions. GPT grades on tier × material band — both **power** axes.
Nothing in the system records *what an item was used for*, and every tradition surveyed says
that is the axis the apex tier actually runs on. ⚠️ Note this is **not** an argument for a new
stat; provenance is bookkeeping, and 🎯 **the Box Log already keeps exactly this kind of record**
(who/what/chosenIndex/source, permanent, never deleted).

### 3. ⭐ Overuse turns you into the thing you carved

**Teigu:** *"Certain Teigu begin to fuse with the user if it is overused, slowly transforming
the user into the original Danger Beasts."*

This is the **fourth and best answer** to the push-mechanic gap tranche 1 opened with
Chastiefol's true-form strain, and it beats the other three:

| Source | What pushing costs |
|---|---|
| Chastiefol (tranche 1) | immense physical strain — costs *you*, recoverable |
| Narayanastra (W-6 §6) | second use rebounds on **your own troops** |
| Muramasa (W-4b) | must draw blood before sheathing, *"even to the point of forcing its wielder to wound himself"* |
| 🔴 **Teigu** | **you gradually become the monster the weapon was carved from** — permanent, thematic, and it reads on the character sheet |

⚙️ 🎯 **GPT is built for this and is not using it.** Every elite and boss already names a carve
material; §12.7 already says the striking part sets the band. **A weapon carved from a Danger
Beast that slowly makes you into one** is a body-horror mechanic in a body-horror game where
damage already lives in **individual body parts** — the transformation has somewhere to be
recorded. It also gives the Corporation™ exactly what it wants: a contestant visibly becoming
something the audience will tune in for.

### 4. Finite apex economies — scarcity by destruction, not by drop rate

- **Teigu: 48 total, and 15 are destroyed.** Permanently. The world has fewer apex items than it
  started with and cannot make more.
- **13 Month Series: 13, one craftsman, one patron.**
- **Elden Ring: 9 Legendary Armaments** (W-7), and the top-tier Remembrances **cannot be
  duplicated at all.**

⚙️ Against this, **Nanatsu no Taizai is the outlier and worth noting as such**: its Sacred
Treasures are **sold, stolen, lost and re-bought** — Lostvayne was *sold to fund a bar* and
later *bought back in Camelot*. **An apex item with a resale market is a fundamentally
different economy** from a finite set, and GPT should pick one deliberately rather than drift.
🔴 GPT's Lootbox items are permanent player property with no sink at all — which is neither.

### 5. ✅ RULED (W-9 R-3) — reputation is load-bearing, but weapons BIRTH myths

Sections 1 and 2 both assume the item is the authority: it refuses you, or its origin certifies
it. **Frieren breaks both** (W-4d, pass #5). The Sword of the Hero *"can only be drawn by the
Hero"* — **Himmel the Hero could not draw it**, won with a dwarven **replica**, and the world
recorded it as the real sword.

| Source | Who is the authority on an item's power |
|---|---|
| Teigu · 13 Month Series | **the item** — it accepts or refuses, and it is right |
| Fate · Apotheosis · Gan Jiang & Mo Ye | **the origin** — where it came from certifies it |
| 🔴 **Frieren** | **the audience** — the legend attached to the wrong object and worked anyway |

⚙️ 🎯 **GPT is the third case and did not know it.** The Corporation™ broadcasts, the audience
watches, Camera Call and Exposure are already stats. **An item whose power lives in its
reputation — and fails the moment the broadcast stops selling it — is native to this setting
and needs no new mechanic**, only the decision that reputation is allowed to be load-bearing.
That is a *design* question for the owner, not a research one.

### 6. Two crafted models, and GPT has one

Pass #5 split the crafted class in half (W-4d): **material-gated** (what you carved — Monster
Hunter, Teigu, **GPT §12.7**) versus **crafter-gated** (who can make it at all — Arifureta's
*two people in recorded history*, Ashul Edwaru's 13, Dubs's six, the Norse dwarves).

🔴 **Every crafter-gated source names ONE smith. GPT's carve names none** — materials in, item
out. Naming a maker is what makes tranche 2's dwarf finding usable: **coerced craft comes out
flawed** (Mjölnir's short handle, Tyrfing's curse) only means something if there is somebody to
coerce.

### 7. What the sweep did NOT support — recorded so it is not re-derived

- ❌ **A standardised cross-genre weapon ladder.** W-1's headline claim. Three independent
  cultivation ladders disagree on both vocabulary and order (W-4d), and W-1's apparent
  corroboration was **one table duplicated across two wikis**. The *grammar* (bands × ~3
  sub-grades, more resolution at the top) is real; the *vocabulary* is per-series.
- ❌ **`redirection` as a mythic essence** — zero instances in 25 myth weapons (W-6 §4).
- ❌ **`inevitability` as a useful GPT essence** — void against §29/§307's no-to-hit rules (W-6 §3).
- ⚠️ **Myth weapons "almost always" carrying a cost** — 40%, not "almost always" (W-6 §1).

**Three of those four came from tranche 1, and all three came from search summaries rather
than page reads.** ⚙️ **The method note in W-0 was load-bearing and should stay:** summary-
sourced findings in this corpus have a poor track record and every one of them needed
correcting once the page was actually read.

---

## W-9 — ✅ THE RULINGS (owner, 2026-08-25)

All three open questions from W-7/W-8 are **ruled**. This section is the record; the sections
they answer now point here. **None of the three needs a new mechanic** — each lands on
machinery the book already shipped.

---

### R-1 ✅ The band solves the floor axis — author ~27 concepts, not 81 weapons

> **Owner:** *"the band already solves the floor axis — go with ~27 concepts."*

The 9-floor axis of the grid is **a rule we already shipped**, not content we owe: §12.7's
material band carries one weapon from F1 to F9 (×2 per floor, F1 ×2 → F9 ×512), and the
materials catalog already states *"the sheet plays identically on every floor; only the
numbers inflate."*

⚠️ **Arithmetic correction to W-7 §3.** That section proposed *"~27 concepts (3 routes × 3
acquisition classes)"* — but 3 × 3 = **9**, not 27. The parenthetical was wrong; the **27 is
right**, and this is where it comes from:

| Axis | Count | Why it survives |
|---|---|---|
| **Set** | **3** | F1–F3 · F4–F6 · F7–F9. A campaign runs **one set**, so each set needs its own spread — and the M-bands already partition this way (M-1/M-2/M-3 inside Set 1, M-4 for Set 2, M-5 apex) |
| **Route** | **3** | Easy (plague/Nullrot) · Medium (demon politics/Bex) · Hard (the Loong/the hunt) |
| **Acquisition** | **3** | 🎯 loot · crafted · story |
| | **= 27** | **The floor axis collapses INTO the set axis, not to nothing** — within a set, the band still moves per floor, so one authored concept yields its F1/F2/F3 readings for free |

⚙️ **What this means for the corpus:** the authoring target is **27 concepts + a small apex
set** (W-7 §1 puts the genre's apex ratio near 3%, so roughly a handful, not 27 more). The
grid framing at the top of this file is **superseded by this ruling.**

---

### R-2 ✅ An item CAN reject a contestant — but the reason must be WRITTEN, and never arbitrary

> **Owner:** *"An item CAN reject a contestant, but we gotta write specifically why. A weapon
> can require someone to BE something, or to NOT BE something. It cant require arbitrariness.
> You're either Loyal or Not a coward. You cant ask for someone to be an undefinable quality."*

🔴 **This ADOPTS the shape from W-8 §1 and REJECTS how every source implemented it.** That
matters — the evidence supports the gate's *existence*, not its *arbitrariness*:

| Source | Its gate | Verdict |
|---|---|---|
| Teigu | *"a user's **first impression** of it affects their compatibility"* | ❌ **undefinable — rejected** |
| 13 Month Series | *"depending on its **temperament**, it may refuse to obey"* | ❌ **undefinable — rejected** |
| Zulfiqar | *"no Hero but Ali"* — be a named person | ✅ decidable |
| Gram | only Sigmund could draw it | ✅ decidable |

**The rule.** A consent gate is a **predicate on the contestant, decidable by looking at the
sheet.** Two legal shapes, and no third:

| Shape | Form | Reads as |
|---|---|---|
| ✅ **BE** | `REQUIRES <tag>` | you must be the thing |
| ✅ **NOT BE** | `REFUSES <tag>` | you must not be the thing |
| ❌ | "the sword judges your worth" | undecidable — **not writable** |
| ❌ | "the sword prefers the brave" | *brave* is an adjective, not a tag — **not writable** |

🎯 **The mechanism already exists, in three separate places:**

1. **§18.1 pattern 6 — Tag gates.** *"Items, skills, Directives, and unlocks may REQUIRE a tag
   — authored per content piece."* **Item tag-gates are already a rule.** R-2 adds only the
   negative form (`REFUSES`) and the instruction to use it for consent.
2. 🔴 **§18 already solved definability.** *"Player-proposed tags must appear on TVTropes.org."*
   That **is** the anti-arbitrariness rule, already shipped — the tag vocabulary is externally
   anchored, so "undefinable quality" cannot enter through it. R-2 inherits that guarantee
   wholesale rather than inventing a test.
3. **§12.1 already has the failure path.** *"Requirements must be met or the Forced Action
   applies (§6)."* A refused weapon behaves exactly like an unmet Physique requirement. **No
   new consequence needed.**

⭐ **Lifecycle is what makes the rejection feel earned rather than capricious.** §18.1 pattern
4: Active → **Reinforced** (*"can only be lost by dramatically betraying it"*) → Faded → Lost.
So:
- A weapon requiring a **Reinforced** tag is asking for a *proven* identity, not a claimed one.
- 🔴 **A weapon is lost when the tag fades** — the item does not reject you on a whim, it
  rejects you **when you stop being the thing.** That is Freyr's sword (W-4b) as a live
  mechanic: it costs nothing today and everything later.

⭐ **The owner has already applied this ruling once, and used this exact word.** Mistletoe's
seed carries `Charm 8` with the note *"Oathbreaker is a **CLAIM**, not an edge. It cuts what is
warded because you are owed the cut, and **a contestant nobody would side with is holding a
sprig**"*, and `set1-story-canon.md` records that *"The Mask's Oathbreaker gate **stops being
arbitrary**."* **Charm 8 is a predicate wearing a stat's clothes** — "nobody would side with
you" is a BE/NOT-BE condition expressed through the only lever §12.1 had. R-2 lets that be
written directly, and Mistletoe is the natural first candidate to restate.

---

### R-3 ✅ Reputation is load-bearing — weapons BIRTH myths, they do not borrow them

> **Owner:** *"An item's reputation CAN be load bearing, not in a 'replaces the original' way
> necessarily. Weapons can birth myths."*

🔴 **This picks the Kusanagi/Fate model and declines the Frieren one.** The direction is
**forward accrual**, not substitution:

| Model | Source | Ruling |
|---|---|---|
| A **replica** carries the legend and the original is beside the point | Frieren (W-4d pass #5) | ❌ **not adopted** — "not in a 'replaces the original' way" |
| An object **becomes** legendary through what is done with it | Kusanagi: a carve from Orochi's corpse that became Imperial Regalia (W-4b) · Fate: *"impossible for myths and legends to start from nothing"* (W-4d) | ✅ **adopted** |

⚙️ **This closes the gap W-6 §3 opened** — *"GPT has no way for an item's MEANING to
appreciate."* R-3 says meaning appreciates **from deeds**, and the show is the engine: this is
a broadcast where **Camera Call and Exposure already measure what the audience saw.**

⭐ **The loop closes on itself, and that is the elegant part.** §18 says tags are gained via
*"hidden condition fulfillment"* and *"corporate narrative shaping."* So:

> **A weapon's deeds birth a tag → the tag then gates the weapon (R-2).**
> *The weapon that made your myth is the weapon that requires you to keep living it.*

An ordinary sword that did something the crowd will not forget earns the party a tag; that tag
is then the `REQUIRES` predicate on the weapon's next mode. **Nothing about that needs a new
subsystem** — it is §18's existing acquisition routes pointed at an object instead of a person.

⚠️ **Scope guard.** R-3 makes reputation *load-bearing*, not *free*. A myth has to be earned on
camera; it is not a label the GM assigns. And R-3 does **not** license the Frieren case — a
counterfeit does not inherit an original's power just because the audience believes it. The
owner left that door only *"necessarily"* ajar; treat it as closed until ruled otherwise.

---

### What the three rulings cost to implement

| Ruling | New rules needed | Rides on |
|---|---|---|
| **R-1** | **none** | §12.7 material band; the existing Set/M-band partition |
| **R-2** | **one** — the `REFUSES` (NOT BE) form | §18.1.6 tag gates · §18's TVTropes definability rule · §12.1 → §6 Forced Action |
| **R-3** | **none** | §18 tag acquisition · Camera Call / Exposure |

🎯 **One new authored form in total.** Everything else is existing machinery pointed somewhere
new — which is what W-8 predicted when it noted the Box Log already keeps provenance records.
