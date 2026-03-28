# I/O Contract: pe-memory-query

## Skill-Level Contract

| | Details |
|---|---|
| **Required Inputs** | User's natural language query; GitHub repo access (`zeyad-farrag/Product-Engine`) |
| **Optional Inputs** | All 10 index files at `intelligence/_index/` (accelerates retrieval; skill falls back to directory scanning if absent) |
| **Produces** | Structured synthesis response (conversational output only — **not persisted**) |
| **Updates** | Nothing — this skill is strictly read-only |

> **Read-only guarantee**: pe-memory-query never writes, updates, creates, or deletes any file. It has no write side-effects.

---

## Step-Level Contracts

### Step 1: Read All Index Files in Parallel

| Field | Details |
|---|---|
| **Inputs** | All 10 index files: `intelligence/_index/{personas,competitors,demand-signals,health-checks,gap-analyses,market-assessments,decision-records,initiatives,intelligence-reports,foundation}.md` |
| **Outputs** | Raw index content (all 10 files captured in one bash call) |
| **Feeds Into** | Step 2, Step 3 |

**Fallback**: if index files return 404/error, fall back to directory scanning (per `references/index-fallback.md`) and inform the user to run pe-memory-maintenance.

### Step 2: Parse the Query

| Field | Details |
|---|---|
| **Inputs** | User's natural language query string |
| **Outputs** | Filter dimensions: Market, Destination, Product, Competitor, Artifact type, Date range, Confidence level, Initiative slug |
| **Feeds Into** | Step 3 |

### Step 3: Filter Index Rows + Retrieve Artifacts

| Field | Details |
|---|---|
| **Inputs** | Parsed index content (Step 1); filter dimensions (Step 2) |
| **Outputs** | Matched artifact metadata rows; full artifact content (if < 20 matches) or index-only summary (if ≥ 20 matches) |
| **Feeds Into** | Step 4 |

Scale decision:
- **< 20 matches (Step 3a)**: fetch full content of each matching artifact via `gh api`
- **≥ 20 matches (Step 3b)**: summarize from index metadata only; offer to deep-dive specific types

### Step 4: Synthesize the Answer

| Field | Details |
|---|---|
| **Inputs** | Matched artifact content or index metadata (Step 3); filter dimensions (Step 2) |
| **Outputs** | Structured synthesis response with: Intelligence Summary, By-Artifact-Type breakdown, Confidence Assessment table, Stale Intelligence list (>90 days or dependency-stale), Coverage Gaps with skill recommendations, Dependency Map |
| **Feeds Into** | Step 5 |

### Step 5: Follow-up Options

| Field | Details |
|---|---|
| **Inputs** | Synthesis output (Step 4); identified coverage gaps |
| **Outputs** | Offered follow-up actions: deep-dive a specific artifact, run a gap-filling pe-* skill, compare against another market/product, show dependency chain |
| **Feeds Into** | (terminal — awaits user choice) |

---

## Dependency Graph

```
User query
     │
     ▼
Step 1: Read All 10 Index Files ─────────────────────────┐
     │                                                    │ (fallback: directory scan)
     ▼                                                    │
Step 2: Parse Query                                       │
     │                                                    │
     ▼                                                    │
Step 3: Filter Index Rows ◄──────────────────────────────┘
     │
     ├─ <20 matches ──► Step 3a: Fetch full artifact content
     │
     └─ ≥20 matches ──► Step 3b: Index-only metadata summary
              │
              ▼
         Step 4: Synthesize Answer
              │
              ▼
         Step 5: Follow-up Options
              │
              └──► (no writes — terminal)
```

---

## Artifact Registry

| Artifact | Path Pattern | Frontmatter Type | Depends On |
|---|---|---|---|
| Personas index | `intelligence/_index/personas.md` | index | `artifacts/personas/` |
| Competitors index | `intelligence/_index/competitors.md` | index | `artifacts/competitors/` |
| Demand Signals index | `intelligence/_index/demand-signals.md` | index | `artifacts/demand-signals/` |
| Health Checks index | `intelligence/_index/health-checks.md` | index | `artifacts/health-checks/` |
| Gap Analyses index | `intelligence/_index/gap-analyses.md` | index | `artifacts/gap-analyses/` |
| Market Assessments index | `intelligence/_index/market-assessments.md` | index | `artifacts/market-assessments/` |
| Decision Records index | `intelligence/_index/decision-records.md` | index | `artifacts/decision-records/` |
| Initiatives index | `intelligence/_index/initiatives.md` | index | `initiatives/active/`, `initiatives/closed/` |
| Intelligence Reports index | `intelligence/_index/intelligence-reports.md` | index | `intelligence/portfolio-health/`, etc. |
| Foundation index | `intelligence/_index/foundation.md` | index | `foundation/`, `foundation/domains/` |

> All artifacts above are **read inputs only**. This skill produces no registered artifacts.

---

## Skill-Specific Notes

- **Strictly read-only**: no commits, no file writes, no index modifications.
- **Prerequisite**: pe-foundation-session must have run before this skill has useful data to query.
- **Index dependency**: the skill is fastest with all 10 index files present; it degrades gracefully to directory scanning otherwise.
- **Staleness detection**: flags artifacts updated >90 days ago (time-stale) or whose dependencies were updated after them (dependency-stale) — but does not fix them. Use pe-memory-maintenance to address staleness.
- **Gap-to-skill mapping**: no-persona gaps → `pe-persona-definition`; no competitors → `pe-competitor-benchmarking`; no demand signals → `pe-demand-signal-mining`; no health checks → `pe-product-health-check`; no gap analyses → `pe-gap-analysis`; no market assessments → `pe-market-entry`.
