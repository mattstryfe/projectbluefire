# /build — Merc Ticket Implementation

Take a single Merc ticket from Linear and implement it end to end: fetch, reconcile against
the Merc guide and ADRs, branch, build, verify acceptance criteria, and hand off a
reviewable branch. Greenfield Merc work.

## Usage
/build <ticket-ref>   (e.g. /build 6  or  /build MER-6)

## Instructions

**Step 1 — Fetch the ticket (Linear)**

Merc tickets live in **Linear** (team key `MER`), not Taiga — use the Linear connector, not
the curl / `.env.local` flow from `/prune` and `/triage`.

Accept either `6` or `MER-6`; the Linear identifier is `MER-<n>`, the branch will be
`mer-<n>`. Fetch the issue (include relations) and display:
- ref and title
- status, estimate, labels
- description (tasks + acceptance criteria)
- blocks / blocked-by relations

**Step 2 — Check dependencies**

Inspect blocked-by. If any blocker isn't Done, stop and report it — do not build out of
dependency order.

**Step 3 — Reconcile against the canonical docs**

Read `MERC.md` and, where the ticket touches them, the Charter and ADR docs (links in
`MERC.md`). If the ticket conflicts with an ADR, or a decision the work needs isn't covered
anywhere, **STOP and flag it.** Do not invent a schema, a convention, or an answer. This is
the most important step in this command.

**Step 4 — Plan and confirm**

Per repo convention, present a clear plan before any code change: files to add/edit, the
branch, and how each acceptance criterion will be met. Raise clarifying questions one at a
time. Wait for explicit confirmation before writing code.

**Step 5 — Cut the branch**

```bash
git show-ref --verify --quiet refs/heads/merc || git branch merc main   # create integration branch once
git switch merc && git switch -c mer-<n>                                 # <n> = ticket number, e.g. mer-6
```

Keep it local — do not push unless explicitly told.

**Step 6 — Implement**

- Fixed stack: Vue 3.5 `<script setup>`, Pinia, Vuetify 4, **no TypeScript**, Zod for validation.
- Non-negotiables: Merc's own named Firebase app, `brokerageId` on every core doc,
  append-only ledger, `onSnapshot` scoped queries.
- Match surrounding BlueFire patterns; Vuetify layouts over custom divs (no div-itis).
- Tag deferred / problem lines `// TODO: MER-<n>: <note>` (Merc uses MER-, not TG-).

**Step 7 — Verify acceptance criteria**

Walk each criterion explicitly. Criteria that need a **live** Merc Firebase project (Google
OAuth sign-in, Firestore read/write) are marked **code-complete, pending live verification**
until the project and config exist — do not report them as passing.

**Step 8 — Hand off**

- Summarize: what was built, which criteria pass, which are pending-live, and anything
  flagged in Step 3.
- Leave the branch for review; do not merge into `merc` without sign-off.
- Update the local memory file with anything learned this session.

## Hard stops (never do these)
- Never create the Firebase project, enable paid services (Blaze / Cloud Functions), or
  generate or guess credentials — those are human console actions.
- Never substitute the stack (no TypeScript, no TanStack Query, no alternate map or
  validation libraries).
- Never mutate or delete ledger entries — the financial log is append-only.
- Never guess past a gap in the spec — flag it instead.
