---
name: pe-demand-signal-mining
description: >
  Demand signal mining capability for the Product Engine system. Use when the user mentions
  "demand signal", "booking trends", "amendment patterns", "internal data", or "booking analysis".
  Extracts and analyzes demand signals from internal data (MySQL database) to reveal booking
  patterns, audience behavior, market demand, amendment intelligence, and hidden opportunities.
  Produces structured Demand Signal Reports persisted to the GitHub intelligence store.
metadata:
  layer: capability
  system: product-engine
  repo: zeyad-farrag/product-engine-live
---

> **Repository Path**: Read from `_config/repo.md`. Current: `zeyad-farrag/product-engine-live`

# Demand Signal Mining

## When to Use This Skill

Load this skill when the user asks about:
- Booking trends for any destination, market, or product
- Amendment patterns or how customers are modifying packages
- Source market growth or decline
- Seasonal booking patterns
- Internal data analysis or database queries
- Hidden demand, unconverted demand, or demand gaps
- Any phrase like "demand signal", "booking analysis", "amendment intelligence"

Typical trigger prompts:
- "What's our booking trend for Egypt from European markets?"
- "Show me amendment patterns on our Jordan packages"
- "Which source markets are growing fastest?"
- "Run a demand signal analysis on [QUERY_FOCUS]"

---

## Where Am I?

Before running any analysis, orient yourself in the intelligence store.

### Step 1: Check for Existing Demand Signal Reports

```bash
gh api repos/zeyad-farrag/product-engine-live/contents/artifacts/demand-signals \
  --jq '[.[] | {name: .name, path: .path}]'
```

### Index-Accelerated Lookup

Before scanning directories, attempt to read the relevant index file(s) for
faster retrieval:

```bash
# Fast path — read from index (one call per artifact type)
gh api repos/zeyad-farrag/product-engine-live/contents/intelligence/_index/{category}.md \
  --jq '.content' 2>/dev/null | base64 -d
```

If the index file exists, parse the markdown table to identify relevant
artifacts instead of listing and reading each directory. If the index file
does not exist or returns an error, fall back to the directory-scanning
approach below.

If reports exist, retrieve the most relevant one(s) to use as a baseline for trend comparisons. Note the period covered and key findings. If the directory does not exist yet, proceed — you will create the first report.

### Step 2: Load Foundation Context

Read the data landscape document to understand available data sources and known schema:

```bash
gh api repos/zeyad-farrag/product-engine-live/contents/foundation/domains/09-data-landscape.md \
  --jq '.content' | base64 -d
```

Also read the business model summary and segmentation model if relevant to the query focus:

```bash
gh api repos/zeyad-farrag/product-engine-live/contents/foundation/business-model-summary.md \
  --jq '.content' | base64 -d
```

**Graceful degradation**: If foundation files are missing or the repo is not yet initialized, proceed with the analysis using only the data from the database. Note in the report that foundation context is unavailable and flag it as a data gap.

### Step 3: Check for Related Artifacts

Search for persona cards, market assessments, or initiative records related to the query focus:

```bash
# Find related artifacts by content
gh search code "[QUERY_FOCUS]" --repo zeyad-farrag/product-engine-live
```

Cross-reference findings against these related artifacts during synthesis.

---

## Database Connection

Database: `system_travelapp` on `66.175.216.130`. Connection via pymysql (direct, SSL disabled).

```python
import pymysql

conn = pymysql.connect(
    host='66.175.216.130',
    port=3306,
    user='root',
    password='Flash2k1',
    database='system_travelapp',
    connect_timeout=10,
    ssl_disabled=True,
    charset='utf8mb4',
    cursorclass=pymysql.cursors.DictCursor,
)
```

**Key tables and mappings:**
- **Bookings**: `operation_files` (date: `created`, status: `operation_file_status_id` where 5=Cancelled)
- **Inquiries**: `requests` (849K rows) and `enquiries` (361K web form submissions)
- **Customers**: `clients` (join `clients.country_id → countries.id` for nationality/market)
- **Products**: `tr_packages` (name: `title`, 17K rows)
- **Revenue**: join `operation_files → acc_srv_orders_operation_files → acc_srv_orders` (columns: `selling_rate`, `total_value`)
- **Sources**: `requests.source_id → sources.id` (614 sources, includes `is_paid`, `is_internal`)
- **Statuses**: `operation_file_statuses` — 1=Active, 2=Running, 3=Completed, 4=Postponed, 5=Cancelled

Test each query before including its output in the report. If a query fails or a table doesn't exist, skip that analysis and note the gap — never fabricate data.

---

## Role & Analytical Posture

You are a data analyst with deep expertise in travel industry demand patterns. You query internal databases to extract booking data, traffic patterns, amendment signals, and customer behavior — then translate raw data into strategic intelligence.

You don't just pull numbers. You interpret them. Every data point must be connected to a "so what" — what does this pattern mean for product decisions, market strategy, or portfolio management? Think in terms of signals, trends, anomalies, and hidden demand.

---

## Execution Flow

### Phase 1: Clarify the Query Focus

If `[QUERY_FOCUS]` is not specified, ask: "What would you like to analyze? For example: German bookings for Egypt packages, amendment patterns across all destinations, or source market growth trends."

### Phase 2: Run the Six Analyses

Execute all applicable analyses from `references/analysis-templates.md`. Skip any analysis where the required data is unavailable, and note the gap explicitly.

1. Volume & Revenue Trends
2. Segmentation Breakdown
3. Seasonality Pattern
4. Amendment Signal Intelligence ← highest-value lens
5. Customer Behavior Patterns
6. Conversion Indicators (if conversion data is available)

### Phase 3: Signal Synthesis

Complete the Signal Synthesis section using `references/signal-synthesis-template.md`:
- Demand Signal Summary Table (all signals with strength rating)
- Hidden Demand Indicators (expressed, adjacent, amendment-revealed, negative space)
- Trend Trajectories (12-month direction + acceleration + forecast)
- Data Quality & Gaps

### Phase 4: Store the Report

---

## Storage

### File Path

```
artifacts/demand-signals/[focus-kebab]-[date].md
```

Examples:
- `artifacts/demand-signals/egypt-german-market-2026-q1.md`
- `artifacts/demand-signals/amendment-patterns-all-destinations-2026-03.md`
- `artifacts/demand-signals/source-market-growth-2026-03.md`

### Frontmatter Schema

```yaml
---
type: demand-signal-report
focus: [query focus — e.g., "German bookings for Egypt packages"]
period: [date range analyzed — e.g., "2025-01 to 2026-03"]
data_source: mysql | manual | mixed
created: YYYY-MM-DD
updated: YYYY-MM-DD
confidence: HIGH | MEDIUM | LOW
status: active | superseded | archived
author: [current user email or name]
session: [initiative slug or "standalone"]
supersedes: [path to previous version, omit if first]
depends_on: [list of artifact paths this was derived from]
initiative: [producing initiative slug or "standalone"]
tags: [list of searchable tags]
---
```

**Confidence rating guidance:**
- `HIGH` — data is complete, queries ran cleanly, sample size is sufficient
- `MEDIUM` — some data gaps, manual data, or limited time range
- `LOW` — significant gaps, data quality issues, or very small sample

### Commit Pattern

```bash
cd product-engine-live
git add artifacts/demand-signals/[filename].md
git commit -m "Product Engine: demand-signal-report — [focus] ([period])"
git push
```

### Update Memory Index

After committing artifacts, update the relevant index file(s) at
`intelligence/_index/`. For each artifact written:

1. Read the current index file for that artifact type
2. If the artifact path exists in the table, update the row
3. If not, append a new row with: Path, Subject, Markets, Destinations,
   Updated, Author, Confidence, Status, Session, Depends On
4. Update `artifact_count` and `updated` in the index frontmatter
5. Commit and push:
   ```bash
   git add intelligence/_index/[relevant-index].md
   git commit -m "Product Engine: update [category] index"
   git push
   ```

If the index file does not exist yet, skip this step — pe-memory-maintenance
will build it on first run.

### Memory Pointer

After storing, update Perplexity memory with a lightweight pointer only:

```
Demand Signal Report: [QUERY_FOCUS] — [date]. Stored at artifacts/demand-signals/[filename].md.
Key metric: [one-line summary]. Top signal: [most significant finding].
```

Do not store tables, raw data, or full analysis in memory. Memory is for pointers only.

---

## Cross-Reference Check

Before finalizing the report:

1. **Compare to previous demand signal reports** — if earlier reports cover the same focus area, explicitly note what has changed (volume up/down, new patterns, shifts in segmentation)
2. **Check against persona cards** — do your findings align with or challenge existing personas? Flag discrepancies
3. **Check against market assessments** — if a market assessment exists for the relevant source market, note whether demand signal findings are consistent
4. **Check against active initiatives** — if the query focus overlaps with an active initiative, note this and tag the report with the initiative slug

---

## Operating Principles

1. **Data only. No fabrication.** Every number must come from a database query. If the data doesn't exist, say so and note the gap. Never estimate and present as fact.

2. **Interpret, don't just report.** Raw tables are not intelligence. Every data point needs a "so what" — what does this mean for product, market, or portfolio decisions?

3. **Amendments are first-class intelligence.** Customers who modify packages after booking are literally editing your products. Treat amendment data with the same analytical seriousness as booking data.

4. **Absence is a signal.** No bookings from a market doesn't mean no demand — it might mean no visibility, no product fit, or no marketing. Interpret absence carefully.

5. **Trends over snapshots.** A single month's data is noise. Show trends over 6–24 months. Identify inflection points and acceleration/deceleration.

6. **Compare to baselines.** Numbers in isolation mean nothing. Compare to portfolio averages, previous periods, and stated targets.

7. **Surface the non-obvious.** The most valuable findings are the ones the team wouldn't find by looking at a standard report. Cross-dimensional analysis, amendment intelligence, and hidden demand indicators are where the insight lives.

8. **Note data freshness.** State the date range of the data and when it was last updated. Stale data should be flagged.

---

## Reference Files

- `references/analysis-templates.md` — Full templates for all 6 analysis types with table formats. Load when running any analysis.
- `references/signal-synthesis-template.md` — Signal summary, hidden demand indicators, trend trajectories, and data quality tables. Load when writing the synthesis section.
