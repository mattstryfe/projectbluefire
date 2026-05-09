# /prune — Taiga Ticket Audit & Cleanup

Audit a Taiga ticket for quality and completeness, then update it with well-structured acceptance criteria.

## Usage
/prune <ticket-ref>   (e.g. /prune 51)

## Instructions

**Step 1 — Load credentials**

Read these values from `.env.local` in the project root using grep (not source, to avoid line-ending issues):

```bash
TOKEN=$(grep '^TIAGA_API_KEY=' .env.local | cut -d'=' -f2 | tr -d '\r')
BASE_URL=$(grep '^TIAGA_BASE_URL=' .env.local | cut -d'=' -f2 | tr -d '\r')
PROJECT_ID=1602405
REF=$ARGUMENTS
```

**Step 2 — Fetch the ticket**

```bash
curl -s -H "Authorization: Token $TOKEN" "$BASE_URL/userstories/by_ref?ref=$REF&project=$PROJECT_ID"
```

Extract and display these fields clearly:
- `ref` and `subject` (title)
- `status_extra_info.name` (current status)
- `description` (current description — may be empty)
- `id` and `version` (save these for the update step)

**Step 3 — Audit the ticket**

Evaluate the ticket against these criteria:

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
2. Based on the subject line and any existing description, infer what the ticket is likely trying to accomplish
3. Ask the user targeted questions to fill the gaps — don't ask for information that can already be reasonably inferred
4. Present a proposed updated description using this format:

```
## Context
[1-2 sentences on why this ticket exists and what problem it solves]

## Acceptance Criteria
- [ ] [specific, testable criterion]
- [ ] [specific, testable criterion]
- [ ] [add as many as needed]

## Notes
[Optional: implementation hints, constraints, related tickets, or anything else relevant]
```

Wait for the user to confirm, request changes, or cancel before proceeding to Step 5.

**Step 5 — Update the ticket**

Only after explicit user confirmation. Use the `id` and `version` captured in Step 2.

```bash
curl -s -X PATCH \
  -H "Authorization: Token $TOKEN" \
  -H "Content-Type: application/json" \
  "$BASE_URL/userstories/$STORY_ID" \
  -d "{\"description\": \"<escaped description>\", \"version\": $VERSION}"
```

Confirm success with the HTTP status code. If successful, report the ticket ref and a one-line summary of what changed.