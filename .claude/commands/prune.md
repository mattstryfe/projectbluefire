# /prune — Taiga Ticket Audit & Cleanup

Audit a Taiga ticket for quality and completeness, then update it with well-structured acceptance criteria.

## Usage
/prune <ticket-ref>   (e.g. /prune 64)

## Instructions

**Step 1 — Load credentials**

Read from `.env.local`:

```bash
BASE_URL=$(grep '^TIAGA_BASE_URL=' .env.local | cut -d'=' -f2 | tr -d '\r')
USERNAME=$(grep '^TIAGA_USERNAME=' .env.local | cut -d'=' -f2 | tr -d '\r')
PASSWORD=$(grep '^TIAGA_PASSWORD=' .env.local | cut -d'=' -f2 | tr -d '\r')
PROJECT_ID=1602405
REF=$ARGUMENTS
```

**Step 2 — Authenticate and fetch the ticket**

Use the Write tool to create `taiga_auth.json` with the exact values from Step 1 (avoids shell escaping issues with special characters in passwords):

```json
{"type":"normal","username":"<USERNAME>","password":"<PASSWORD>"}
```

Then authenticate and fetch in one chained command (AUTH_TOKEN does not persist across separate Bash calls):

```bash
AUTH_TOKEN=$(curl -s -X POST -H "Content-Type: application/json" "$BASE_URL/auth" -d @taiga_auth.json | grep -o '"auth_token": *"[^"]*"' | sed 's/.*": *"//;s/"//') && curl -s -H "Authorization: Bearer $AUTH_TOKEN" "$BASE_URL/userstories/by_ref?ref=$REF&project=$PROJECT_ID"
```

Extract and display:
- `ref` and `subject` (title)
- `status_extra_info.name` (current status)
- `description` (current description — may be empty)
- `id` and `version` (needed for the update step)

**Step 3 — Audit the ticket**

| Check | Pass condition |
|---|---|
| Title clarity | Subject is specific and actionable, not vague |
| Has description | Description field is not empty |
| Has acceptance criteria | Description contains measurable, testable criteria |
| AC is complete | Each criterion is specific enough to know when it's done |

**Step 4 — Handle the result**

**If the ticket passes all checks:** Report it as clean. Show the current description. No changes needed unless the user asks.

**If the ticket fails one or more checks:**
1. Show the user exactly what's missing
2. Infer what the ticket is trying to accomplish from the subject and any existing description
3. Ask targeted questions to fill gaps — don't ask for info that can be reasonably inferred
4. Present a proposed updated description:

```
## Context
[1-2 sentences on why this ticket exists and what problem it solves]

## Acceptance Criteria
- [ ] [specific, testable criterion]
- [ ] [add as many as needed]

## Notes
[Optional: implementation hints, constraints, or related tickets]
```

Wait for explicit user confirmation before proceeding to Step 5.

**Step 5 — Update the ticket**

Use the Write tool to create `taiga_patch.json` with the confirmed description (same reason as auth — avoids escaping issues). Use `\n` for newlines in the description string.

```json
{"description": "<description>", "version": <version>}
```

Authenticate and PATCH in one chained command:

```bash
AUTH_TOKEN=$(curl -s -X POST -H "Content-Type: application/json" "$BASE_URL/auth" -d @taiga_auth.json | grep -o '"auth_token": *"[^"]*"' | sed 's/.*": *"//;s/"//') && curl -s -o /dev/null -w "%{http_code}" -X PATCH -H "Authorization: Bearer $AUTH_TOKEN" -H "Content-Type: application/json" "$BASE_URL/userstories/<id>" -d @taiga_patch.json
```

On success (200), report the ticket ref and what changed, then clean up:

```bash
rm -f taiga_auth.json taiga_patch.json
```
