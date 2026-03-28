# I/O Contract: pe-cross-market-intelligence

## Skill-Level Contract

| | Details |
|---|---|
| **Required Inputs** | GitHub repo `zeyad-farrag/Product-Engine` accessible; at least 2 distinct markets or contexts with existing artifacts |
| **Optional Inputs** | User-specified [COMPARISON_SCOPE] (defaults to all active artifacts); `foundation/business-model-summary.md`; `foundation/domains/11-strategic-priorities.md`; existing cross-market reports in `intelligence/cross-market-intelligence/` |
| **Produces** | Cross-market intelligence report at `intelligence/cross-market-intelligence/[scope-kebab]-[date].md` |
| **Updates** | `intelligence/_index/intelligence-reports.md` |

---

## Step-Level Contracts

### Step 1: List All Artifact Directories

| Field | Details |
|---|---|
| **Inputs** | Six parallel GitHub API calls: `artifacts/personas/`, `artifacts/competitors/`, `artifacts/demand-signals/`, `artifacts/gap-analyses/`, `artifacts/health-checks/`, `artifacts/decision-records/`; `intelligence/_index/{category}.md` files (fast-path index read attempted first for each) |
| **Outputs** | Complete file listing across all 6 artifact types (name + path per file); total artifact inventory |
| **Feeds Into** | Step 2 (each listed file is read for frontmatter) |

> **Minimum threshold**: If fewer than 2 distinct markets or contexts have artifacts, warn user and stop.

---

### Step 2: Read Frontmatter From Every File

| Field | Details |
|---|---|
| **Inputs** | All file paths from Step 1; GitHub API content read per file; key frontmatter fields extracted: `type`, `market`, `tags`, `confidence`, `status`, `initiative`, `destinations` (for personas/competitors); `focus`, `period` (for demand signals); `product`, `target_audience`, `fit_rating` (for gap analyses); `health_rating`, `composite_score` (for health checks); `decision`, `initiative_type` (for decision records) |
| **Outputs** | Structured frontmatter map across all artifacts; raw cross-reference graph (artifacts grouped by shared `tags` and `market` values) |
| **Feeds Into** | Step 3 (frontmatter data compiled into Intelligence Manifest) |

---

### Step 3: Build and Present the Intelligence Manifest

| Field | Details |
|---|---|
| **Inputs** | Frontmatter data from Step 2 |
| **Outputs** | Intelligence Manifest table: artifact type counts, markets/contexts covered, date range; tag cross-reference map (artifacts sharing common tags); presented to user before proceeding |
| **Feeds Into** | Phase 2 (manifest is the raw material for all 5 analysis frameworks) |

---

### Step 4: Load Foundation Context

| Field | Details |
|---|---|
| **Inputs** | `foundation/business-model-summary.md`; `foundation/domains/11-strategic-priorities.md` |
| **Outputs** | Business model context; strategic priorities — used to rank and contextualize cross-market findings |
| **Feeds Into** | Phase 3 (strategic synthesis prioritizes insights relative to strategic priorities) |

---

### Step 5: Check for Existing Cross-Market Reports

| Field | Details |
|---|---|
| **Inputs** | `intelligence/cross-market-intelligence/` directory listing (GitHub API) |
| **Outputs** | List of prior cross-market reports; most recent report for same scope retrieved; delta noted (new artifacts added since last run) |
| **Feeds Into** | Phase 3 (prior report used for trend comparison in synthesis) |

---

### Phase 1: Clarify the Comparison Scope

| Field | Details |
|---|---|
| **Inputs** | User's trigger prompt; Intelligence Manifest from Step 3 |
| **Outputs** | Confirmed [COMPARISON_SCOPE] (e.g., "all evaluated source markets", "German vs. UK vs. French travelers", "Egypt products across all markets"); defaults to all active artifacts if unspecified |
| **Feeds Into** | Phase 2 (all 5 analyses scoped accordingly) |

---

### Phase 2: Run All Five Analysis Frameworks

| Field | Details |
|---|---|
| **Inputs** | All artifact content from Step 2 (frontmatter + body where needed); `references/analysis-frameworks.md` (table templates for all 5 frameworks); foundation context from Step 4 |
| **Outputs** | Analysis 1 — Persona Pattern Recognition: universal archetypes (2+ markets) vs. market-specific personas; keyed by `market`, `segment`, `tags`; Analysis 2 — Competitor Landscape Mapping: multi-market competitors (2+ markets), platform-level competitive gaps; keyed by `market`, `destinations`, `positioning`, `tags`; Analysis 3 — Demand Signal Convergence: patterns appearing in 2+ markets (signal), 3+ markets (strategic intelligence); keyed by `focus`, `period`, `tags`; Analysis 4 — Gap & Issue Patterns: systemic gaps appearing across multiple products; keyed by `product`, `fit_rating`, `tags`; Analysis 5 — Decision Pattern Analysis: recurring approval/rejection factors, decision bias check; keyed by `decision`, `initiative_type`, `tags` |
| **Feeds Into** | Phase 3 (all 5 analysis outputs synthesized) |

---

### Phase 3: Strategic Synthesis

| Field | Details |
|---|---|
| **Inputs** | All 5 analysis outputs from Phase 2; `references/strategic-synthesis-template.md`; prior cross-market report from Step 5 (trend comparison); foundation strategic priorities from Step 4 |
| **Outputs** | Top 5 cross-market insights ranked by strategic importance (STRONG = 3+ markets, MODERATE = 2 markets); portfolio-level implications; intelligence gaps (what analysis is missing to increase confidence); systemic vs. specific classification for each finding |
| **Feeds Into** | Phase 4 (synthesis is the core body of the stored report) |

---

### Phase 4: Store the Report

| Field | Details |
|---|---|
| **Inputs** | All analysis outputs from Phase 2; strategic synthesis from Phase 3; `intelligence/_index/intelligence-reports.md` (current index) |
| **Outputs** | `intelligence/cross-market-intelligence/[scope-kebab]-[date].md` with YAML frontmatter (type, scope, markets_compared, artifacts_analyzed, confidence, status, supersedes, depends_on, tags); updated `intelligence/_index/intelligence-reports.md`; Perplexity memory pointer (path + artifact count + top insight + systemic gap count) + tagged individual findings (patterns, archetypes, systemic gaps) |
| **Feeds Into** | Future cross-market runs (this report becomes the prior baseline); initiative planning (systemic gaps and multi-market patterns inform portfolio strategy) |

---

## Dependency Graph

```
Step 1: List All Artifact Directories ────────────────────────────┐
  [6 parallel API calls: personas/competitors/demand-signals/      │
   gap-analyses/health-checks/decision-records]                    │
    │                                                              │
    ▼                                                              │
Step 2: Read Frontmatter From Every File                          │
  [type, market, tags, confidence, status, initiative, ...]        │
    │                                                              │
    ▼                                                              │
Step 3: Build Intelligence Manifest                               │
  [counts + markets + date range + tag cross-reference map]        │
    │  (user sees manifest before proceeding)                      │
    │                                                              │
Step 4: Load Foundation Context ─────────────────────────────────┐│
  [business-model-summary.md + 11-strategic-priorities.md]        ││
    │                                                             ││
Step 5: Check for Existing Cross-Market Reports ─────────────────┼┤
  [prior report for delta/trend comparison]                       ││
    │                                                             ││
Phase 1: Clarify Comparison Scope                                 ││
  [confirmed [COMPARISON_SCOPE]]                                  ││
    │                                                             ││
    ▼                                                             ││
Phase 2: Run Five Analysis Frameworks ◄── analysis-frameworks.md ││
  Analysis 1: Persona Pattern Recognition                         ││
  Analysis 2: Competitor Landscape Mapping                        ││
  Analysis 3: Demand Signal Convergence                           ││
  Analysis 4: Gap & Issue Patterns                                ││
  Analysis 5: Decision Pattern Analysis                           ││
    │                                                             ││
    ▼                                                             ││
Phase 3: Strategic Synthesis ◄─────────────────────────────────────┘
  [top 5 insights + portfolio implications + intelligence gaps]
  ◄── strategic-synthesis-template.md + Step 5 prior report
    │
    ▼
Phase 4: Store the Report
  [intelligence/cross-market-intelligence/[scope-kebab]-[date].md]
  [+ index update + tagged memory entries]
```

---

## Artifact Registry

| Artifact | Path Pattern | Frontmatter Type | Depends On |
|---|---|---|---|
| Cross-market intelligence report | `intelligence/cross-market-intelligence/[scope-kebab]-[date].md` | `cross-market-intelligence` | All artifact types in scope: personas, competitors, demand-signals, gap-analyses, health-checks, decision-records; `11-strategic-priorities.md` |
| Cross-market index | `intelligence/_index/intelligence-reports.md` | _(index table)_ | All cross-market intelligence reports |
