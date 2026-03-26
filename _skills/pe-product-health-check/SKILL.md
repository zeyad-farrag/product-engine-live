---
name: pe-product-health-check
description: >
  Product health check capability for the Product Engine system. Use when the user mentions
  "product health", "health check", "product performance", "how is [product] doing", or
  "product assessment". Produces a comprehensive health scorecard combining revenue vitals,
  conversion efficiency, customer satisfaction, competitive position, amendment intelligence,
  and lifecycle assessment into a composite health score (0-100) with a STRONG/STABLE/CONCERNING/CRITICAL/TERMINAL
  classification. Persisted to the GitHub intelligence store at artifacts/health-checks/.
metadata:
  layer: capability
  system: product-engine
  repo: zeyad-farrag/product-engine-live
---

> **Repository Path**: Read from `_config/repo.md`. Current: `zeyad-farrag/product-engine-live`

# Product Health Check

## When to Use This Skill

Load this skill when the user asks about:
- The health or performance of a specific product or product line
- Whether a product needs attention or intervention
- Portfolio-wide health overview (by product)
- Trend comparison — has a product improved or declined since last check?

Typical trigger prompts:
- "How are our Egypt packages doing?"
- "Give me a health check on the Jordan Premium tour"
- "Which products need attention?"
- "Run a product assessment on [PRODUCT]"
- "How is [product] performing?"

---

## Where Am I?

Before running the assessment, orient yourself in the intelligence store.

### Step 1: Check for Existing Health Checks

```bash
gh api repos/zeyad-farrag/product-engine-live/contents/artifacts/health-checks \
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

If health checks exist for the same product, retrieve the most recent one:

```bash
gh api repos/zeyad-farrag/product-engine-live/contents/artifacts/health-checks/[filename].md \
  --jq '.content' | base64 -d
```

**If a previous health check exists for this product**, this run becomes a **comparison/trend analysis**. Note the previous composite score and dimension scores — you will populate Section 7 (Comparison to Previous) with deltas.

If the directory does not exist yet, proceed — you will create the first health check.

### Step 2: Load Foundation Context

```bash
gh api repos/zeyad-farrag/product-engine-live/contents/foundation/business-model-summary.md \
  --jq '.content' | base64 -d

gh api repos/zeyad-farrag/product-engine-live/contents/foundation/domains/06-product-structure.md \
  --jq '.content' | base64 -d
```

Also read pricing policies and competitive landscape if relevant:

```bash
gh api repos/zeyad-farrag/product-engine-live/contents/foundation/domains/10-pricing-policies.md \
  --jq '.content' | base64 -d

gh api repos/zeyad-farrag/product-engine-live/contents/foundation/domains/07-competitive-landscape.md \
  --jq '.content' | base64 -d
```

**Graceful degradation**: If foundation files are missing, proceed without them and note the gap.

### Step 3: Check for Related Artifacts

```bash
# Find demand signal reports and competitor profiles related to this product
gh search code "[PRODUCT]" --repo zeyad-farrag/product-engine-live
```

Retrieve any relevant demand signal reports or competitor profiles and cross-reference findings during synthesis.

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

Test each query before including output in the health check. If a query fails or a table doesn't exist, skip that metric and note the gap — never fabricate data.

---

## Role & Analytical Posture

You are a product performance analyst — think of yourself as a doctor running a check-up. You don't just report lab results; you interpret them, identify concerns, and recommend whether the patient needs attention, monitoring, or immediate intervention.

Every score must be backed by data. If data is unavailable for a dimension, note it explicitly and weight the remaining dimensions proportionally.

---

## Execution Flow

### Phase 1: Clarify the Product

If `[PRODUCT]` is not specified, ask: "Which product, product line, or category would you like to assess? For example: 'Egypt Classic Tour', 'all Jordan packages', or 'luxury Nile cruises'."

### Phase 2: Run All 8 Assessment Sections

Execute all sections from `references/health-assessment-template.md`. Skip any section where required data is unavailable — note the gap explicitly in the Attention Flags section.

1. Performance Vitals (Revenue, Conversion, Customer, Seasonal health)
2. Amendment Intelligence Snapshot
3. Competitive Position Check
4. Lifecycle Position
5. Composite Health Score (weighted scoring)
6. Attention Flags
7. Comparison to Previous Health Check (if previous exists)
8. Recommendations

### Phase 3: Compute the Composite Score

Use `references/scoring-guide.md` for the exact weighting methodology and classification thresholds. The composite score is a weighted average on a 0–10 scale, converted to 0–100:

| Dimension | Weight |
|---|---|
| Revenue performance | 25% |
| Conversion efficiency | 20% |
| Customer satisfaction | 20% |
| Competitive position | 15% |
| Amendment health | 10% |
| Strategic fit | 10% |

Convert to 0–100: multiply the 0–10 weighted average by 10. Classify using the thresholds in `references/scoring-guide.md`.

### Phase 4: Store the Report

---

## Storage

### File Path

```
artifacts/health-checks/[product-kebab]-[date].md
```

Examples:
- `artifacts/health-checks/egypt-classic-tour-2026-03.md`
- `artifacts/health-checks/jordan-premium-2026-03.md`
- `artifacts/health-checks/luxury-nile-cruises-2026-03.md`

### Frontmatter Schema

```yaml
---
type: health-check
product: [product name]
health_rating: STRONG | STABLE | CONCERNING | CRITICAL | TERMINAL
composite_score: [0-100]
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
- `HIGH` — data is complete, sufficient sample size, database queries ran cleanly
- `MEDIUM` — some data gaps, manual data, or limited time range
- `LOW` — significant gaps, data quality issues, or very small sample

**When a previous health check exists**, mark the old file as superseded:
```bash
# Update the old file's frontmatter: status: superseded
# Then commit the new file alongside the update
```

### Commit Pattern

```bash
cd product-engine-live
git add artifacts/health-checks/[filename].md
git commit -m "Product Engine: health-check — [PRODUCT] ([date])"
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
Product Health Check: [PRODUCT] — [date]. Composite score: [score]/100. Classification: [STRONG/STABLE/CONCERNING/CRITICAL/TERMINAL]. Top flag: [most critical finding]. Stored at artifacts/health-checks/[filename].md.
```

Do not store tables, raw data, or full analysis in memory. Memory is for pointers only.

---

## Trend Tracking

When a previous health check exists for the same product:

1. Load the previous file and extract all dimension scores and composite score
2. For each dimension, calculate the delta (current − previous)
3. Populate Section 7 (Comparison to Previous) with the delta table
4. Provide a trajectory assessment: is this product getting healthier or sicker over time?
5. Note whether the health classification has changed (e.g., STABLE → CONCERNING is a significant signal)

The value of health checks compounds — the first is a snapshot, the third is a trend, the tenth is a lifecycle view.

---

## Operating Principles

1. **Data-driven scoring.** Every score must be backed by data. If data is unavailable for a dimension, note it and weight accordingly. Never estimate and present as fact.

2. **Relative, not absolute.** "100 bookings" means nothing without context. Compare to portfolio averages, previous periods, and expectations.

3. **Amendments are a vital sign.** High amendment rates are as important a health indicator as booking volume. A product with good bookings but high amendments is masking a problem.

4. **Lifecycle matters.** A declining product in end-of-life isn't necessarily "unhealthy" — it may be naturally sunsetting. Context matters.

5. **Quick and actionable.** A health check should take 5-10 minutes to review and immediately tell the reader: is this product healthy, and if not, what's the priority concern?

6. **Track over time.** The value of health checks compounds. The first one is a snapshot. The third one is a trend. The tenth one is a lifecycle view.

7. **Don't over-diagnose.** A health check identifies whether something needs attention. It doesn't prescribe the solution — that's what Optimization and Repositioning initiatives do.

---

## Reference Files

- `references/health-assessment-template.md` — Full templates for all 8 assessment sections with table formats. Load when running any assessment.
- `references/scoring-guide.md` — Composite scoring methodology, classification thresholds, status emoji key, and actionable next steps per classification level.
