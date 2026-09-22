# `story/` — prose fiction set in the Galactic Prime Time universe

> ## ⛔ STANDING RULE — THE AUTHOR WRITES THE PROSE (2026-09-22)
>
> **Do not draft, ghostwrite, continue, or "show an example of" any prose for
> these works. Not a paragraph, not a line, not a demonstration.** The author's
> reason is explicit and it governs: *"The prose and writing in general has to
> come from me, otherwise i won't get better at it."*
>
> **Do not offer, either.** A repeated offer is pressure.
>
> **What assistance looks like here instead:**
> | Useful | Not this |
> |---|---|
> | Reviewing prose the author wrote | Writing prose for them |
> | Canon and continuity checks | Filling a gap with invented text |
> | Structure, beats, pacing, open calls | Drafting the scene to "show" a structure |
> | Genre, market, serial-cadence data | Sample chapters or comp pastiche |
> | Recording rulings; asking the unblocking question | Rewriting a line to demonstrate a fix |
> | **Teaching a technique** (`lit-teach`) so the author executes it | Executing it for them |
>
> Quoting the author's own words back to them — in a review, a beat sheet or a
> ruling — is not drafting. Inventing new ones is.

Drafts live here, versioned. **This is manuscript, not game content**: nothing
in this folder is consumed by the app, the seeders, the rulebook or the Godot
sim, and nothing here should ever be imported by them.

## Why it is in this repo

The placement rule is *content lives where it is consumed* — and the novel is
consumed here, beside the tabletop material it shares a setting with. The v2
canon inventory calls this world *"the **A Day of Ruin** universe"* and treats
the novel as **plot-protected: context only**. The game deliberately took the
world rules and not the novel's story (DIRECTION.md D3–D5).

⚠️ **Canon flows one way: `v2/canon/` → here.** If a draft and the canon
snapshot disagree, the canon is right until the author rules otherwise — and
`v2/canon/` is itself generated from the game repo, so never hand-edit it to
match a chapter. Record story rulings in `<work>/outline.md` instead.

## Layout

```
story/
  <work-slug>/
    voice-contract.md      the declared prose rules — READ BEFORE ANY LINE EDIT
    outline.md             beats, serial map, rulings, open calls
    chapters/
      chNN-<slug>.vX.Y.md  one file per revision; never overwrite a version
```

## Convention

- **A version is never overwritten.** A new draft is a new `vX.Y` file, so the
  revision chain stays readable and a change can always be diffed.
- `v0.1` is the first draft; bump the minor for a revision pass, the major when
  the chapter is restructured rather than edited.
- Chapter files are the prose **only** — no notes, no markers, nothing that
  would have to be stripped before posting.
- Everything the author has ruled about the work goes in `outline.md` with the
  repo's markers: 🔒 ruled · ⚖ proposed, unblessed · 🔴 open.

## Works

| Work | State |
|---|---|
| [`a-day-of-ruin/`](a-day-of-ruin/) | Ch. 1 drafted. Registration scene beat-sheeted; the odds economy ruled. Serial-first; target Royal Road. |

## Review log

| Date | Work | Pass | Result |
|---|---|---|---|
| 2026-09-22 | *A Day of Ruin* Ch. 1 | `lit-genre-atlas` — serial length + LitRPG contract check | Sized as 5 installments, not 1 chapter. Contract query raised: no system on page one |
| 2026-09-22 | *A Day of Ruin* Ch. 1 | `bmad-editorial-review-prose` against the voice contract | 20 items; the tense system confirmed deliberate and left intact |

⚠️ **The 2026-09-22 genre pass initially reported the tense mixing as drift.**
It is the book's central device. `voice-contract.md` exists so that does not
recur — elicit it, or read it, before any prose pass.
