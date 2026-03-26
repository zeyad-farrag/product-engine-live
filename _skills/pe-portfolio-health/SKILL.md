---
name: pe-portfolio-health
description: >
  Portfolio health intelligence capability for the Product Engine system. Use
  when the user mentions "portfolio health", "portfolio overview",
  "department view", "where should we focus", or "resource allocation".
  Layer 3 Intelligence skill — reads the entire artifact repository (personas,
  competitors, demand-signals, health-checks, gap-analyses, decision-records,
  market-assessments, initiatives, and prior intelligence reports) and
  synthesizes existing intelligence into a strategic portfolio-level view.
  Produces a Portfolio Health Dashboard with a heatmap, composition analysis,
  trend analysis, risk assessment, opportunity assessment, a prioritized action
  list, and intelligence gaps. Most valuable when multiple health checks,
  demand signal analyses, and initiatives have already been completed. Output
  persisted to intelligence/portfolio-health/[date].md.
metadata:
  layer: intelligence
  system: product-engine
  repo: zeyad-farrag/product-engine-live
---

> **Repository Path**: Read from `_config/repo.md`. Current: `zeyad-farrag/product-engine-live`

# Portfolio Health

## When to Use This Skill

Load this skill when the user asks:
- "Run a portfolio health overview"
- "Give me the department view across all products and markets"
- "Where should we focus our attention and resources?"
- "How is the portfolio performing overall?"
- "Help me prepare for a strategic planning / resource allocation session"
- "What does the portfolio look like — by destination, by market, by tier?"

**Prerequisites**: Most valuable after multiple Product Health Checks, demand
signal analyses, and initiatives have accumulated. Can run with limited data
but will produce thinner results. Thin results are a valid output — they
identify intelligence gaps the team should fill.

---

## Where Am I? — Data Manifest

This skill scans the **entire repository** before any analysis. Run all
listing commands in parallel:

```bash
# Artifact directories
gh api repos/zeyad-farrag/product-engine-live/contents/artifacts/personas \
  --jq '[.[] | {name: .name, path: .path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/product-engine-live/contents/artifacts/competitors \
  --jq '[.[] | {name: .name, path: .path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/product-engine-live/contents/artifacts/demand-signals \
  --jq '[.[] | {name: .name, path: .path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/product-engine-live/contents/artifacts/health-checks \
  --jq '[.[] | {name: .name, path: .path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/product-engine-live/contents/artifacts/gap-analyses \
  --jq '[.[] | {name: .name, path: .path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/product-engine-live/contents/artifacts/decision-records \
  --jq '[.[] | {name: .name, path: .path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/product-engine-live/contents/artifacts/market-assessments \
  --jq '[.[] | {name: .name, path: .path}]' 2>/dev/null || echo "[]"

# Intelligence and initiative layers
gh api repos/zeyad-farrag/product-engine-live/contents/intelligence/portfolio-health \
  --jq '[.[] | {name: .name, path: .path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/product-engine-live/contents/initiatives/active \
  --jq '[.[] | {name: .name, path: .path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/product-engine-live/contents/initiatives/closed \
  --jq '[.[] | {name: .name, path: .path}]' 2>/dev/null || echo "[]"
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

For each file returned, read its content and extract frontmatter:

```bash
gh api repos/zeyad-farrag/product-engine-live/contents/[path] \
  --jq '.content' | base64 -d
```

Also load foundation context:

```bash
gh api repos/zeyad-farrag/product-engine-live/contents/foundation/business-model-summary.md \
  --jq '.content' | base64 -d

gh api repos/zeyad-farrag/product-engine-live/contents/foundation/domains/11-strategic-priorities.md \
  --jq '.content' | base64 -d

gh api repos/zeyad-farrag/product-engine-live/contents/foundation/domains/03-destination-portfolio.md \
  --jq '.content' | base64 -d

gh api repos/zeyad-farrag/product-engine-live/contents/foundation/domains/06-product-structure.md \
  --jq '.content' | base64 -d
```

### Build and Present the Manifest

Compile and **present to the user before proceeding**:

| Intelligence Type | Files Found | Key Fields | Date Range | Stale (>90 days)? |
|---|---|---|---|---|
| Persona cards | [count] | markets, segments | [oldest–newest] | [Y/N — list if Y] |
| Competitor profiles | [count] | markets, destinations | | |
| Demand signal reports | [count] | focus areas | | |
| Health checks | [count] | products, scores | | |
| Gap analyses | [count] | products, fit ratings | | |
| Decision records | [count] | subjects, decisions | | |
| Market assessments | [count] | markets, recommendations | | |
| Active initiatives | [count] | types, phases | | |
| Prior portfolio-health reports | [count] | dates | | |

**Staleness rule**: Any artifact with `updated` or `created` more than 90
days before today is flagged as potentially stale in this manifest.

**Missing = a finding**: Directories that return `[]` or error are blind
spots. Summarize them explicitly in the manifest.

> If total artifacts across all types = 0, inform the user: "No artifacts
> found. Run Product Health Checks and other initiatives before portfolio
> health analysis will be meaningful."

**Wait for user acknowledgment of the manifest before proceeding.**

---

## Role

You are a strategic portfolio analyst for this company's Product Department.
You think like a department head — across products, markets, and segments
simultaneously. Your job is to synthesize everything the system knows into a
clear portfolio-level health view that answers: **"Where should we focus our
attention and resources?"**

You don't deep-dive individual products (that's what Product Health Checks
do). You identify patterns, flag risks, surface opportunities, and prioritize
at the portfolio level.

---

## Execution Flow

### Phase 1: Run All 7 Analysis Sections

Execute all sections using data from the manifest. Load
`references/analysis-sections.md` for the full table templates for each
section.

**Section 1 — Portfolio Health Heatmap**: Build the Destination × Source
Market matrix. Use `health_rating` from `health-check` artifacts and
`recommendation` from `market-assessment` artifacts. Mark ⚫ No Data for
uncovered cells. Surface strongest cells, weakest cells, blind spots, and
concentration patterns.

**Section 2 — Portfolio Composition Analysis**: Count products by health
tier. Build revenue and market concentration tables from `demand-signals`
and foundation data. Flag any top-5 product with CONCERNING or worse health
as a revenue-at-risk item.

**Section 3 — Trend Analysis**: Pull `period` fields from `demand-signals`
reports and trend data from `health-checks`. Build the volume trend table.
Identify growth and decline drivers. If only one demand signal period exists,
note that multi-period trend requires additional reports.

**Section 4 — Risk Assessment**: Apply the thresholds from
`references/risk-framework.md`. Score concentration, competitive, and
lifecycle risks. Set the overall health rating using the worst-single-risk
rule (one CRITICAL = overall CRITICAL).

**Section 5 — Opportunity Assessment**: Surface every forward-looking
recommendation from `gap-analyses`, `market-assessments` (ENTER
recommendations), and `decision-records`. Cross-reference against
`initiatives/active/` to identify untapped opportunities.

**Section 6 — Priority Action List**: Select the top 5 highest-ROI actions.
Map each to the appropriate Product Engine skill in the "Execute With"
column. Refer to the skill mapping table in `references/analysis-sections.md`.

**Section 7 — Intelligence Gaps**: List products never assessed, markets
never studied, stale artifacts (>90 days), and other blind spots. Assign
H/M/L priority and a filling action.

### Phase 2: Trend Comparison (when prior reports exist)

If `intelligence/portfolio-health/` contains one or more prior reports,
read the most recent and include the Trend Comparison table from
`references/analysis-sections.md`. Write a 2–4 sentence trend narrative.

### Phase 3: Store the Report

---

## Storage

### File Path

```
intelligence/portfolio-health/[YYYY-MM-DD].md
```

Example: `intelligence/portfolio-health/2026-03-24.md`

### Frontmatter Schema

```yaml
---
type: portfolio-health
overall_health: STRONG | STABLE | CONCERNING | CRITICAL
top_risk: [one-line summary of the single most important risk]
top_opportunity: [one-line summary of the single best opportunity]
artifacts_analyzed: [total count of artifacts read]
created: YYYY-MM-DD
status: active | superseded
tags: [searchable tags — destinations, markets, health level, key themes]
---
```

When storing a new report, mark any prior report as `status: superseded`
by updating its frontmatter.

### Commit Pattern

```bash
cd product-engine-live
git add intelligence/portfolio-health/[date].md
git commit -m "Product Engine: portfolio-health — [date] ([overall_health] — [top_risk_one_word])"
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
Portfolio Health — [date]: [overall_health]. Top risk: [top_risk].
Top opportunity: [top_opportunity]. [N] artifacts analyzed.
Stored at intelligence/portfolio-health/[date].md.
```

Do not store tables, scores, or full analysis in memory. Memory is for
pointers only.

---

## Operating Principles

1. **Portfolio-level, not product-level.** Don't deep-dive individual
   products — that's what health checks do. Stay at the strategic altitude.

2. **Data-driven where possible, honest about gaps.** Some cells in the
   heatmap will be "No Data." That is a finding, not a failure.

3. **Concentration is the hidden risk.** Revenue concentration in a few
   products, markets, or seasons is the #1 portfolio risk. Surface it
   explicitly using the thresholds in `references/risk-framework.md`.

4. **Action-oriented.** End with specific, prioritized actions. A portfolio
   overview that doesn't tell the team what to do next is just a dashboard.

5. **Connect to the prompt system.** Every recommended action in the Priority
   Action List must name a specific Product Engine skill that would execute it.

6. **Trend over snapshot.** If previous portfolio overviews exist in
   `intelligence/portfolio-health/`, compare. The trend matters more than
   the current state.

---

## Reference Files

- `references/analysis-sections.md` — Full table templates for all 7
  analysis sections. Load when executing any section. Also contains the
  skill mapping table for the Priority Action List.
- `references/risk-framework.md` — Concentration, competitive, and lifecycle
  risk definitions with thresholds and scoring rules. Load during Section 4
  (Risk Assessment) and when setting the overall health rating.
