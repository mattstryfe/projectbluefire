# /triage — Ticket Investigation & Root Cause Analysis

Investigate a Taiga ticket by tracing the relevant code, mapping broken workflows, and producing a hypothesis + blast radius report before any changes are made.

## Usage
/triage <ticket-ref>   (e.g. /triage 66)

## Instructions

**Step 1 — Fetch the ticket**

Use the Write tool to create `taiga_auth.json` with credentials from `.env.local`:

```json
{"type":"normal","username":"<TIAGA_USERNAME>","password":"<TIAGA_PASSWORD>"}
```

Authenticate and fetch in one chained command:

```bash
BASE_URL=$(grep '^TIAGA_BASE_URL=' .env.local | cut -d'=' -f2 | tr -d '\r')
AUTH_TOKEN=$(curl -s -X POST -H "Content-Type: application/json" "$BASE_URL/auth" -d @taiga_auth.json | grep -o '"auth_token": *"[^"]*"' | sed 's/.*": *"//;s/"//') && curl -s -H "Authorization: Bearer $AUTH_TOKEN" "$BASE_URL/userstories/by_ref?ref=$REF&project=1602405"
```

Display clearly:
- `ref` and `subject`
- `status_extra_info.name`
- `description` and acceptance criteria

Clean up: `rm -f taiga_auth.json`

**Step 2 — Grep for breadcrumb tags**

Search the codebase for any prior `TODO: TG-xx` tags matching this ticket ref:

```bash
grep -rn "TODO: TG-<ref>" src/
```

If tags are found, list the file, line number, and note. If none, report clean slate and move on.

**Step 3 — Identify expected workflows**

Based on the ticket subject, description, and AC, list every UX interaction or system event that the ticket touches — what *should* happen in each case. Present this list to the user and confirm before proceeding. The answer to this step shapes everything that follows.

**Step 4 — Trace the code**

For each workflow identified in Step 3:
- Start with stores and JS files, then trace down to components
- Map each workflow to its actual code path
- Flag blocks that are missing behavior, wired incorrectly, or symptomatic of the bug

Drop `// TODO: TG-xx: <note>` tags on any problem lines found. These serve as breadcrumbs — they survive even if the fix gets deferred.

**Step 5 — Hypothesis**

Present a concise root cause summary and proposed fix approach. Be specific:
- What is broken and where exactly
- What the fix is and which files it touches
- Any assumptions that need confirming

Do not make code changes. Wait for user confirmation before proceeding.

**Step 6 — Blast radius**

Before signing off, zoom out and consider:
- Will these changes break any existing code or callers?
- Does this pattern appear elsewhere in the codebase — should those be updated too?
- Is there a refactor opportunity in adjacent code?
- Could this fix affect mobile, other pages, or future tickets?

Present findings as a short list. Flag anything that warrants a separate ticket.
