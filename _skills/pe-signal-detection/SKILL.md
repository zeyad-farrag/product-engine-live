---
name: pe-signal-detection
description: >
  Signal detection intelligence for the Product Engine system. Use when the
  user mentions "signal scan", "what's changed", "anomalies", "early warning",
  "what should I be watching", or "run a signal detection". Layer 3
  Intelligence skill — scans three sources (internal database, accumulated
  intelligence in GitHub repo, quick external web scan) for actionable signals.
  Classifies signals by category and severity, produces WHAT/SO WHAT/WHAT NOW
  cards for critical findings, and generates an intelligence freshness report.
  Designed for weekly/biweekly cadence. Output persisted to
  intelligence/signal-detection/[date].md.
metadata:
  author: Product Engine
  version: '1.0'
  layer: intelligence
  system: product-engine
  repo: zeyad-farrag/Product-Engine
---

> **Repository Path**: Read from `_config/repo.md`. Current: `zeyad-farrag/Product-Engine`

# pe-signal-detection

**Role**: Market intelligence analyst running a systematic scan for signals. Think like a radar operator — methodically scanning every data source for anomalies, trends, and patterns that rise above the noise. Primary skill: separating signal from noise.

**Signal threshold**: Findings must be statistically meaningful, actionable, and time-sensitive. The 15% deviation is the default threshold for all booking/revenue metrics.

---

## Step 0 — "Where Am I?" State Detection

Before scanning, read the current state of the repository in parallel:

```bash
# Run all in parallel — understand what intelligence already exists
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/health-checks \
  --jq '[.[] | {name, path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/demand-signals \
  --jq '[.[] | {name, path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/decision-records \
  --jq '[.[] | {name, path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/Product-Engine/contents/intelligence/signal-detection \
  --jq '[.[] | {name, path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/Product-Engine/contents/intelligence/portfolio-health \
  --jq '[.[] | {name, path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/Product-Engine/contents/initiatives/active \
  --jq '[.[] | {name, path}]' 2>/dev/null || echo "[]"
```

### Index-Accelerated Lookup

Before scanning directories, attempt to read the relevant index file(s) for
faster retrieval:

```bash
# Fast path — read from index (one call per artifact type)
gh api repos/zeyad-farrag/Product-Engine/contents/intelligence/_index/{category}.md \
  --jq '.content' 2>/dev/null | base64 -d
```

If the index file exists, parse the markdown table to identify relevant
artifacts instead of listing and reading each directory. If the index file
does not exist or returns an error, fall back to the directory-scanning
approach below.

Read file contents with:
```bash
gh api repos/zeyad-farrag/Product-Engine/contents/[path] \
  --jq '.content' | base64 -d
```

Also load:
- `foundation/business-model-summary.md` (if exists)
- `foundation/domains/11-strategic-priorities.md` (if exists)

**Present an Intelligence Manifest** before scanning:

```
INTELLIGENCE MANIFEST — [date]
─────────────────────────────────────────────────
Health Checks:       [N files | newest: date | oldest: date]
Demand Signals:      [N files | newest: date | oldest: date]
Decision Records:    [N files | newest: date | oldest: date]
Prior Signal Reports:[N files | newest: date | oldest: date]
Active Initiatives:  [N items]
Portfolio Health:    [N files | newest: date | oldest: date]
─────────────────────────────────────────────────
Foundation Context:  [LOADED / NOT FOUND]
Prior Signal Report: [date of most recent, or "none"]
```

---

## Step 0b — Foundation Check (Graceful Degradation)

If `foundation/business-model-summary.md` does NOT exist:

> **Nudge**: "Foundation Session hasn't been run yet. Signal detection is most effective with business context. Consider running `pe-foundation-session` first."

If user continues without it:

> **Note**: "Proceeding without foundation context. Signals will lack business model framing. Industry context will substitute where possible."

Do NOT hard-block. Continue to scanning.

---

## Step 1 — Source 1: Internal Database Scan (MySQL)

Database: `system_travelapp` (host configured via `MYSQL_HOST` env var). Connection via pymysql. See `references/scan-templates.md` for full query templates using the real schema.

Run five sub-scans. For each, execute the query and report what was found.

### 1.1 Booking Velocity Scan
**Intent**: Compare current 30-day booking volume against three baselines. Flag any metric with >15% deviation.

Baselines:
- Prior 30 days
- Same 30-day period last year (YoY)
- 90-day rolling average

Flag signals: GROWTH (>+15%), DECLINE (>-15%), or ANOMALY (unexpected pattern).

### 1.2 Revenue Anomaly Scan
**Intent**: Detect shifts in revenue concentration and average booking value.

Check:
- Average booking value: current 30d vs. prior 30d, vs. same period LY
- Revenue concentration: top-10 products as % of total revenue (shift >5pp = flag)
- Booking value distribution: check for bimodal shifts or outlier clusters

### 1.3 Amendment Signal Scan
**Intent**: Detect operational stress or customer uncertainty through booking changes.

Check:
- Amendment rate: (amendments / total bookings) current 30d vs. prior 30d
- New amendment patterns: which products/routes have new or rising amendment clusters
- Cancellation rate: current 30d vs. prior 30d, vs. same period LY
- Flag: amendment rate >15% change, cancellation rate >10% change

### 1.4 Conversion Signal Scan
**Intent**: Detect pipeline health through conversion rate movements.

Check:
- Inquiry-to-booking conversion rate by product, market, and channel
- Traffic/inquiry volume changes (total and by segment)
- Lead-to-inquiry funnel if available

Flag: conversion rate change >15% in any segment.

### 1.5 Customer Behavior Scan
**Intent**: Detect early shifts in customer preferences and market composition.

Check:
- Booking lead time: average days from inquiry to booking, current vs. prior
- Group size distribution: average and spread, current vs. prior
- Product preference shifts: top 10 products ranked by volume, compare to prior period
- New market activity: bookings from new geographies or segments (>5 new in 30d = flag)

---

## Step 2 — Source 2: Memory Intelligence Scan

Read all files identified in Step 0. For each artifact type, apply these checks:

### 2.1 Freshness Check
Any artifact with `created` date >90 days ago is **stale**. Flag as INFO or WARNING depending on artifact type:
- Decision records >90 days: WARNING (decisions may be outdated)
- Health checks >90 days: WARNING (health picture may be stale)
- Demand signals >90 days: INFO

### 2.2 Unactioned Findings Check
Scan `decision-records/` and prior signal reports for findings marked with recommended actions. Cross-reference against `initiatives/active/`. Flag any high-priority recommendation that has no corresponding active initiative after >30 days.

### 2.3 Prediction Tracking
Look for any prior signal report that made directional predictions (e.g., "if trend continues, X will happen in Y weeks"). Compare to current data:
- **Confirmed**: prediction matched actual outcome
- **Refuted**: prediction did not match — mark as false positive (see `references/signal-history.md`)
- **Still Pending**: prediction window not yet reached

### 2.4 Pattern Completion Check
Look across health checks and demand signals for multi-report patterns:
- Is a previously flagged signal resolving, escalating, or stable?
- Are there signals that have appeared in 3+ consecutive reports without action? Escalate severity.

---

## Step 3 — Source 3: External Signal Scan (Quick Web Search)

This is a **quick scan** — not deep research. Run 4–6 targeted searches in parallel. Total time budget: ~2 minutes.

Search topics (adapt to the business context loaded in Step 0):
1. Competitor pricing changes or new product launches (search: "[main competitors] travel package pricing 2025")
2. Travel industry news — recent 30 days (search: "travel industry bookings trend [current month year]")
3. Regulatory or visa changes affecting key markets
4. Economic/currency movements in top source markets
5. Major events, holidays, or disruptions in key destination markets
6. Any topic specifically flagged in prior signal reports as "watch"

Classify each web finding using the signal taxonomy. Only report findings that are:
- Recent (within 30 days)
- Directly relevant to the portfolio
- Actionable (something can be done in response)

---

## Step 4 — Signal Report

Compile all signals from Sources 1–3 into a classified table.

**Signal Taxonomy** (full taxonomy in `references/scan-templates.md`):
- Categories: `GROWTH` | `DECLINE` | `ANOMALY` | `COMPETITIVE` | `MARKET` | `OPERATIONAL`
- Severities: `CRITICAL` | `WARNING` | `OPPORTUNITY` | `INFO`

**Signal Table Format**:

```
| # | Signal Title | Category | Severity | Source | Key Metric | vs. Baseline |
|---|--------------|----------|----------|--------|------------|--------------|
| 1 | [short title]| DECLINE  | CRITICAL | DB-1.1 | -22% bookings | vs. prior 30d |
| 2 | ...          | ...      | ...      | ...    | ...        | ...          |
```

Signal History notation (when prior reports exist):
- `[NEW]` — first time this signal appears
- `[↑ ESCALATED]` — severity increased vs. prior report
- `[↓ RESOLVED]` — signal no longer present (note it briefly)
- `[→ RECURRING x3]` — appeared in 3+ consecutive reports without action

---

## Step 5 — Priority Signal Detail Cards

For every signal classified as CRITICAL or WARNING, produce a full detail card. Use the format from `references/scan-templates.md`:

```
SIGNAL: [short title]
Category: [category]  |  Severity: [severity]  |  Timeframe: [urgency]

WHAT: [specific numbers and comparison — no directional adjectives, exact figures]
SO WHAT: [impact if trend continues unaddressed]
WHAT NOW: [recommended action]
  → Initiative/Capability to run: [specific pe-skill name]
  → Data needed: [what additional info would help]
  → Decision needed from: [who needs to decide]

CONFIDENCE: [H/M/L]  |  Signal History: [NEW / RECURRING x N / ESCALATED]
```

Skill references to use in "Initiative/Capability to run":
- `pe-product-health-check` — product-level deep dive
- `pe-demand-signal-mining` — demand and conversion analysis
- `pe-gap-analysis` — portfolio gaps and whitespace
- `pe-portfolio-health` — full portfolio assessment
- `pe-foundation-session` — establish or refresh business context
- Decision records are created manually (no generating skill)

---

## Step 6 — Opportunity Signals

Separate table for all signals classified as OPPORTUNITY:

```
| # | Opportunity Title | Category | Source | Why Now | Recommended Next Step |
|---|-------------------|----------|--------|---------|----------------------|
| 1 | [title]           | GROWTH   | Web    | [reason]| [action + skill]     |
```

---

## Step 7 — Signal Summary Dashboard

Count matrix:

```
SIGNAL SUMMARY DASHBOARD — [date]
═══════════════════════════════════════════════════
Category       CRITICAL  WARNING  OPPORTUNITY  INFO  TOTAL
───────────────────────────────────────────────────
GROWTH            [n]      [n]       [n]       [n]    [n]
DECLINE           [n]      [n]       [n]       [n]    [n]
ANOMALY           [n]      [n]       [n]       [n]    [n]
COMPETITIVE       [n]      [n]       [n]       [n]    [n]
MARKET            [n]      [n]       [n]       [n]    [n]
OPERATIONAL       [n]      [n]       [n]       [n]    [n]
───────────────────────────────────────────────────
TOTAL             [n]      [n]       [n]       [n]    [N]
═══════════════════════════════════════════════════

Top Signal: [one-line summary]
Scan Coverage: DB [connected/disconnected] | Repo [N files read] | Web [N searches]
```

---

## Step 8 — Recommended Actions

Prioritized action list, sorted by urgency. Format:

```
RECOMMENDED ACTIONS
═══════════════════════════════════════════════════════════

THIS WEEK (Critical / time-sensitive):
  1. [Action description] → run pe-[skill] | owner: [role]
  2. [Action description] → run pe-[skill] | owner: [role]

THIS MONTH (Warning / moderate urgency):
  3. [Action description] → run pe-[skill] | owner: [role]

THIS QUARTER (Opportunity / strategic):
  4. [Action description] → run pe-[skill] | owner: [role]
```

---

## Step 9 — Intelligence Freshness Report

Standing output every run. Shows the health of the intelligence base:

```
INTELLIGENCE FRESHNESS REPORT — [date]
═══════════════════════════════════════════════════════════════
Type                 Count  Newest        Oldest        Stale
───────────────────────────────────────────────────────────────
Health Checks          [n]  [YYYY-MM-DD]  [YYYY-MM-DD]   [n]
Demand Signals         [n]  [YYYY-MM-DD]  [YYYY-MM-DD]   [n]
Decision Records       [n]  [YYYY-MM-DD]  [YYYY-MM-DD]   [n]
Signal Reports         [n]  [YYYY-MM-DD]  [YYYY-MM-DD]   [n]
Portfolio Health       [n]  [YYYY-MM-DD]  [YYYY-MM-DD]   [n]
Active Initiatives     [n]  [YYYY-MM-DD]  [YYYY-MM-DD]   [n]
───────────────────────────────────────────────────────────────
Overall Health: [GREEN: all fresh | YELLOW: some stale | RED: majority stale]
Recommended: [what to refresh first]
```

Stale threshold: >90 days since `created` date.

---

## Step 10 — Storage

### Frontmatter
```yaml
---
type: intelligence-report
report_type: signal-detection
signals_found: [total count]
critical: [count]
warning: [count]
opportunity: [count]
info: [count]
top_signal: [one-line summary of most important signal]
created: YYYY-MM-DD
status: active
tags: [signal-detection, intelligence, weekly-scan]
---
```

### Mark Prior Report Superseded
If a prior signal report exists, update its frontmatter via GitHub Contents API:
```bash
# Read prior file content and SHA
PRIOR_SHA=$(gh api repos/zeyad-farrag/Product-Engine/contents/intelligence/signal-detection/[prior-date].md \
  --jq '.sha' 2>/dev/null || echo "")
PRIOR_CONTENT=$(gh api repos/zeyad-farrag/Product-Engine/contents/intelligence/signal-detection/[prior-date].md \
  --jq '.content' 2>/dev/null | base64 -d)

# Update status: active → status: superseded in the content, then write back
echo "$PRIOR_CONTENT" | sed 's/^status: active/status: superseded/' | base64 -w0 | \
  gh api repos/zeyad-farrag/Product-Engine/contents/intelligence/signal-detection/[prior-date].md \
  --method PUT \
  --field message="Product Engine: supersede prior signal-detection report" \
  --field content=@- \
  --field sha="$PRIOR_SHA"
```

### Commit Pattern
```bash
# Write artifact via GitHub Contents API (no local clone needed)
# 1. Check if file already exists (to get SHA for update)
EXISTING_SHA=$(gh api repos/zeyad-farrag/Product-Engine/contents/intelligence/signal-detection/[YYYY-MM-DD].md \
  --jq '.sha' 2>/dev/null || echo "")

# 2. Write/update the file
echo '[report content]' | base64 -w0 | gh api repos/zeyad-farrag/Product-Engine/contents/intelligence/signal-detection/[YYYY-MM-DD].md \
  --method PUT \
  --field message="Product Engine: signal-detection — [date] ([critical] critical, [warning] warning)" \
  --field content=@- \
  ${EXISTING_SHA:+--field sha="$EXISTING_SHA"}
```

### Update Memory Index

After committing artifacts, update the relevant index file(s) at
`intelligence/_index/`. For each artifact written:

1. Read the current index file for that artifact type
2. If the artifact path exists in the table, update the row
3. If not, append a new row with: Path, Subject, Markets, Destinations,
   Updated, Author, Confidence, Status, Session, Depends On
4. Update `artifact_count` and `updated` in the index frontmatter
5. Write the updated index via GitHub Contents API:
   ```bash
   EXISTING_SHA=$(gh api repos/zeyad-farrag/Product-Engine/contents/intelligence/_index/[relevant-index].md \
     --jq '.sha' 2>/dev/null || echo "")

   echo '[updated index content]' | base64 -w0 | gh api repos/zeyad-farrag/Product-Engine/contents/intelligence/_index/[relevant-index].md \
     --method PUT \
     --field message="Product Engine: update [category] index" \
     --field content=@- \
     ${EXISTING_SHA:+--field sha="$EXISTING_SHA"}
   ```

If the index file does not exist yet, skip this step — pe-memory-maintenance
will build it on first run.

### Memory Pointer (lightweight)
```
Signal Detection — [date]: [signals_found] signals ([critical] CRITICAL, [warning] WARNING, [opportunity] OPPORTUNITY). Top signal: [top_signal]. Stored at intelligence/signal-detection/[date].md.
```

---

## Quality Criteria

Apply these checks before finalising the report:

| Criterion | Check |
|-----------|-------|
| Signal, not noise | Every flagged item passes the 15% threshold or has clear qualitative justification |
| Quantify everything | All WHAT sections contain exact numbers, not adjectives like "increased" or "declining" |
| Compare to baselines | Every metric is compared to at least one defined baseline |
| Speed matters | Web scan stays within ~2 minutes; full run should complete in one session |
| Connect to actions | Every CRITICAL/WARNING signal has a specific pe-skill in WHAT NOW |
| Track signal history | Recurring (3+) unaddressed signals are escalated one severity level |
| False positive acknowledgment | Refuted predictions are noted with [FALSE POSITIVE] in signal history |

---

## Reference Files

- `references/scan-templates.md` — Full MySQL queries for all 5 DB sub-scans, complete signal taxonomy table, signal detail card template
- `references/signal-history.md` — Signal tracking methodology: false positive handling, recurring escalation logic, prediction tracking protocol
