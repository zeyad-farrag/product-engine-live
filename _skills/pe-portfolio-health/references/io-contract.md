# I/O Contract: pe-portfolio-health

## Skill-Level Contract

| | Details |
|---|---|
| **Required Inputs** | At least one artifact type present in the repo (health-checks, demand-signals, market-assessments, gap-analyses, competitors, personas, decision-records, or initiatives) |
| **Optional Inputs** | `foundation/business-model-summary.md`, `foundation/domains/11-strategic-priorities.md`, `foundation/domains/03-destination-portfolio.md`, `foundation/domains/06-product-structure.md`; `intelligence/_index/{category}.md` index files (accelerate lookup); prior `intelligence/portfolio-health/` reports (enable trend comparison) |
| **Produces** | `intelligence/portfolio-health/YYYY-MM-DD.md` (Portfolio Health Dashboard with heatmap, composition, trend, risk, opportunity, action list, intelligence gaps) |
| **Updates** | `intelligence/_index/` — relevant index file for `portfolio-health` artifact type; prior portfolio-health report frontmatter set to `status: superseded` |

---

## Step-Level Contracts

### Step 0: Data Manifest (Where Am I?)

| Field | Details |
|---|---|
| **Inputs** | `artifacts/personas/`, `artifacts/competitors/`, `artifacts/demand-signals/`, `artifacts/health-checks/`, `artifacts/gap-analyses/`, `artifacts/decision-records/`, `artifacts/market-assessments/`; `initiatives/active/`, `initiatives/closed/`; `intelligence/portfolio-health/`; `intelligence/_index/{category}.md` (fast-path); `foundation/business-model-summary.md`, `foundation/domains/11-strategic-priorities.md`, `foundation/domains/03-destination-portfolio.md`, `foundation/domains/06-product-structure.md` |
| **Outputs** | Repository manifest table (counts, key fields, date ranges, staleness flags per artifact type); list of blind spots where directories returned empty |
| **Feeds Into** | All 7 analysis sections (Steps 1–7); Step 8 (Trend Comparison, if prior reports found) |

---

### Step 1: Section 1 — Portfolio Health Heatmap

| Field | Details |
|---|---|
| **Inputs** | `artifacts/health-checks/` — `health_rating` frontmatter field; `artifacts/market-assessments/` — `recommendation` frontmatter field; foundation destination/product structure docs |
| **Outputs** | Destination × Source Market matrix; strongest/weakest cells; blind spots; concentration patterns |
| **Feeds Into** | Step 4 (Risk Assessment — concentration risk); Step 6 (Priority Action List) |

---

### Step 2: Section 2 — Portfolio Composition Analysis

| Field | Details |
|---|---|
| **Inputs** | `artifacts/health-checks/` — health tier values; `artifacts/demand-signals/` — revenue/volume data; foundation data (product list, market list) |
| **Outputs** | Product count by health tier; revenue and market concentration tables; revenue-at-risk items (top-5 products with CONCERNING or worse health) |
| **Feeds Into** | Step 4 (Risk Assessment — revenue concentration); Step 6 (Priority Action List) |

---

### Step 3: Section 3 — Trend Analysis

| Field | Details |
|---|---|
| **Inputs** | `artifacts/demand-signals/` — `period` fields; `artifacts/health-checks/` — trend data across multiple reports |
| **Outputs** | Volume trend table; growth and decline drivers identified; note if only one demand-signal period exists (multi-period trend unavailable) |
| **Feeds Into** | Step 8 (Trend Comparison — combined with prior report delta) |

---

### Step 4: Section 4 — Risk Assessment

| Field | Details |
|---|---|
| **Inputs** | Step 1 heatmap output (concentration patterns); Step 2 composition output (revenue concentration); `references/risk-framework.md` (thresholds for concentration, competitive, lifecycle risk scoring); competitor profiles from `artifacts/competitors/` |
| **Outputs** | Risk scores across three axes (concentration, competitive, lifecycle); overall health rating (`STRONG \| STABLE \| CONCERNING \| CRITICAL`) using worst-single-risk rule |
| **Feeds Into** | Step 6 (Priority Action List); Step 9 (Storage — `overall_health` frontmatter field) |

---

### Step 5: Section 5 — Opportunity Assessment

| Field | Details |
|---|---|
| **Inputs** | `artifacts/gap-analyses/` — forward-looking recommendations; `artifacts/market-assessments/` — ENTER recommendations; `artifacts/decision-records/` — forward-looking items; `initiatives/active/` — cross-referenced to identify untapped opportunities |
| **Outputs** | Opportunity table with all forward-looking recommendations not yet covered by active initiatives |
| **Feeds Into** | Step 6 (Priority Action List) |

---

### Step 6: Section 6 — Priority Action List

| Field | Details |
|---|---|
| **Inputs** | Outputs from Steps 1–5 (heatmap, composition, trends, risks, opportunities); `references/analysis-sections.md` — skill mapping table |
| **Outputs** | Top 5 highest-ROI actions with "Execute With" column naming the specific Product Engine skill |
| **Feeds Into** | Step 9 (Storage — surfaced in report body) |

---

### Step 7: Section 7 — Intelligence Gaps

| Field | Details |
|---|---|
| **Inputs** | Manifest from Step 0 (empty directories, stale artifacts >90 days); Steps 1–5 (uncovered heatmap cells, products never assessed, markets never studied) |
| **Outputs** | Gap table with H/M/L priority and a filling action per gap |
| **Feeds Into** | Step 9 (Storage — surfaced in report body) |

---

### Step 8: Trend Comparison (conditional)

| Field | Details |
|---|---|
| **Inputs** | Most recent prior report from `intelligence/portfolio-health/` (if one or more exist); current report sections from Steps 1–7 |
| **Outputs** | Trend comparison table (delta per metric vs. prior report); 2–4 sentence trend narrative |
| **Feeds Into** | Step 9 (Storage — appended to report body) |

---

### Step 9: Store Report

| Field | Details |
|---|---|
| **Inputs** | All analysis sections (Steps 1–8); `overall_health` from Step 4; `top_risk` and `top_opportunity` from Steps 4–5; total artifact count from Step 0 |
| **Outputs** | `intelligence/portfolio-health/YYYY-MM-DD.md` (committed to GitHub); prior report updated to `status: superseded`; `intelligence/_index/` index row added/updated; Perplexity memory pointer |
| **Feeds Into** | Future portfolio-health runs (Step 8 — prior report); pe-signal-detection Step 0 (manifest); pe-cross-initiative-patterns Step 1 (manifest) |

---

## Dependency Graph

```
foundation docs
    │
    ▼
Step 0: Data Manifest ─────────────────────────────────────────────┐
    │                                                                │
    ├──► Step 1: Heatmap ──────────────────────────────┐            │
    │        (health-checks, market-assessments)        │            │
    │                                                   │            │
    ├──► Step 2: Composition ──────────────────────────►│            │
    │        (health-checks, demand-signals)            │            │
    │                                                   ▼            │
    ├──► Step 3: Trends ──────────────────────► Step 4: Risk ────────►Step 6: Actions
    │        (demand-signals, health-checks)     (risk-framework)     │
    │                                                   │            │
    └──► Step 5: Opportunities ─────────────────────────►            │
             (gap-analyses, market-assessments,                       │
              decision-records, initiatives/active)                   │
                                                                      │
Step 7: Intelligence Gaps ◄───────────────────────────────────────────┘
    (manifest blind spots + stale artifacts)

Step 3 ──► Step 8: Trend Comparison (prior portfolio-health report)
                │
                ▼
           Step 9: Storage → intelligence/portfolio-health/YYYY-MM-DD.md
                           → intelligence/_index/ (updated)
                           → prior report (status: superseded)
```

---

## Artifact Registry

| Artifact | Path Pattern | Frontmatter Type | Depends On |
|---|---|---|---|
| Portfolio Health Dashboard | `intelligence/portfolio-health/YYYY-MM-DD.md` | `portfolio-health` | health-checks, demand-signals, market-assessments, gap-analyses, decision-records, competitors, personas, initiatives |
| Intelligence Index (portfolio-health) | `intelligence/_index/intelligence-reports.md` | index | Portfolio Health Dashboard |
