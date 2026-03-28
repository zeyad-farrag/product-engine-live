# I/O Contract: pe-demand-signal-mining

## Skill-Level Contract

| | Details |
|---|---|
| **Required Inputs** | User-specified query focus (destination, market, product, or pattern); GitHub repo `zeyad-farrag/Product-Engine` accessible |
| **Optional Inputs** | `foundation/domains/09-data-landscape.md` (schema reference); `foundation/business-model-summary.md`; existing demand signal reports in `artifacts/demand-signals/`; related persona cards and market assessments (found via `gh search code`) |
| **Produces** | Demand signal report at `artifacts/demand-signals/[focus-kebab]-[date].md` |
| **Updates** | `intelligence/_index/demand-signals.md` |

---

## Step-Level Contracts

### Step 1: Check for Existing Demand Signal Reports

| Field | Details |
|---|---|
| **Inputs** | `artifacts/demand-signals/` directory listing (GitHub API); `intelligence/_index/{category}.md` (fast-path index read attempted first) |
| **Outputs** | List of existing reports; most relevant prior report(s) retrieved as baseline for trend comparison; period covered and key findings noted |
| **Feeds Into** | Phase 3 (cross-reference check against prior reports during synthesis) |

---

### Step 2: Load Foundation Context

| Field | Details |
|---|---|
| **Inputs** | `foundation/domains/09-data-landscape.md` (available data sources and schema); `foundation/business-model-summary.md` (if relevant to query focus) |
| **Outputs** | Known table/column names for MySQL queries; data availability constraints; business context for interpreting findings; note if foundation files are missing (graceful degradation) |
| **Feeds Into** | Phase 2 (determines which MySQL tables and columns to use; shapes all 6 analyses) |

---

### Step 3: Check for Related Artifacts

| Field | Details |
|---|---|
| **Inputs** | `gh search code "[QUERY_FOCUS]" --repo zeyad-farrag/Product-Engine` — searches across personas, market assessments, and initiative records |
| **Outputs** | List of related artifacts (persona cards, market assessments, initiative records) relevant to [QUERY_FOCUS] |
| **Feeds Into** | Phase 3 (cross-reference synthesis checks findings against these artifacts) |

---

### Phase 1: Clarify the Query Focus

| Field | Details |
|---|---|
| **Inputs** | User's trigger prompt |
| **Outputs** | Confirmed [QUERY_FOCUS] (e.g., "German bookings for Egypt packages", "amendment patterns across all destinations") |
| **Feeds Into** | Phase 2 (all 6 analyses scoped to this focus) |

---

### Phase 2: Run the Six Analyses

| Field | Details |
|---|---|
| **Inputs** | MySQL (pymysql direct connection via env vars): `operation_files`, `requests`, `clients`, `countries`, `acc_srv_orders`, `acc_srv_orders_operation_files`, `destinations`, `sources` tables filtered to [QUERY_FOCUS]; `references/analysis-templates.md` (table formats for all 6 analyses); foundation schema from Step 2 |
| **Outputs** | Up to 6 analysis outputs: (1) Volume & Revenue Trends, (2) Segmentation Breakdown, (3) Seasonality Pattern, (4) Amendment Signal Intelligence, (5) Customer Behavior Patterns, (6) Conversion Indicators — each as a structured table; explicit gap notes for any skipped analysis |
| **Feeds Into** | Phase 3 (all 6 analysis outputs are synthesized) |

---

### Phase 3: Signal Synthesis

| Field | Details |
|---|---|
| **Inputs** | All analysis outputs from Phase 2; `references/signal-synthesis-template.md`; prior demand signal reports from Step 1 (trend comparison); related persona cards from Step 3 (alignment/contradiction check); market assessments from Step 3 (consistency check); active initiative records from Step 3 |
| **Outputs** | Demand Signal Summary Table (all signals with strength rating); Hidden Demand Indicators (expressed, adjacent, amendment-revealed, negative space); Trend Trajectories (12-month direction + acceleration + forecast); Data Quality & Gaps section; cross-reference notes against prior reports, personas, and initiatives |
| **Feeds Into** | Phase 4 (synthesis is the main body of the stored report) |

---

### Phase 4: Store the Report

| Field | Details |
|---|---|
| **Inputs** | Synthesis from Phase 3; all analysis tables from Phase 2; `intelligence/_index/demand-signals.md` (current index content) |
| **Outputs** | `artifacts/demand-signals/[focus-kebab]-[date].md` with YAML frontmatter (type, focus, period, data_source, confidence, status, supersedes, depends_on, initiative, tags); updated `intelligence/_index/demand-signals.md`; Perplexity memory pointer (path + one-line summary + top signal) |
| **Feeds Into** | Future demand signal analyses (this report becomes baseline for trend comparison) |

---

## Dependency Graph

```
Step 1: Check for Existing Reports ──────────────────────────────┐
  [prior reports as trend baseline]                               │
    │                                                             │
Step 2: Load Foundation Context                                   │
  [09-data-landscape.md → schema for MySQL queries]               │
    │                                                             │
Step 3: Check for Related Artifacts                               │
  [personas + market assessments + initiatives]                   │
    │                                                             │
Phase 1: Clarify Query Focus                                      │
  [confirmed [QUERY_FOCUS]]                                       │
    │                                                             │
    ▼                                                             │
Phase 2: Run Six Analyses ◄── MySQL (pymysql) + analysis-templates.md
  [1 Volume/Revenue  2 Segmentation  3 Seasonality]               │
  [4 Amendments  5 Customer Behavior  6 Conversion]               │
    │                                                             │
    ▼                                                             │
Phase 3: Signal Synthesis ◄──────────────────────────────────────┘
  [signal summary + hidden demand + trend trajectories]
  ◄── signal-synthesis-template.md
    │
    ▼
Phase 4: Store the Report
  [artifacts/demand-signals/[focus-kebab]-[date].md + index update]
```

---

## Artifact Registry

| Artifact | Path Pattern | Frontmatter Type | Depends On |
|---|---|---|---|
| Demand signal report | `artifacts/demand-signals/[focus-kebab]-[date].md` | `demand-signal` | MySQL booking/amendment data, `09-data-landscape.md`, related personas and market assessments |
| Demand signals index | `intelligence/_index/demand-signals.md` | _(index table)_ | All demand signal reports |
