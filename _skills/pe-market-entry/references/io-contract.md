# I/O Contract: pe-market-entry

## Skill-Level Contract

| | Details |
|---|---|
| **Required Inputs** | Target market name; user confirmation to begin discovery |
| **Optional Inputs** | `foundation/business-model-summary.md` (accelerates brand fit, tier mapping, portfolio context); existing `artifacts/market-assessments/` < 90 days (reuse); existing `artifacts/personas/` < 90 days (skip Stream 2D); existing `artifacts/competitors/` < 90 days (skip Stream 2C); `intelligence/_index/*.md` (fast path lookup) |
| **Produces** | Market Assessment Report; Persona Cards (2–5); Competitor Benchmark files; Entry Recommendation; Decision Record; Initiative State File |
| **Updates** | `intelligence/_index/market-assessments.md`; `intelligence/_index/personas.md`; `intelligence/_index/competitors.md`; `intelligence/_index/decision-records.md` |

---

## Step-Level Contracts

### Phase 0: State Detection

| Step | Inputs | Outputs | Feeds Into |
|---|---|---|---|
| 0.1 Repo scan | GitHub repo contents (foundation, active/closed initiatives, artifacts/market-assessments, artifacts/personas, artifacts/competitors, artifacts/decision-records) via `gh api` | List of existing artifacts with paths and ages; reuse eligibility flags | Phase 1 Confidence Map |
| 0.2 Index lookup | `intelligence/_index/{category}.md` (fast path) | Parsed artifact table (or directory fallback) | Phase 1 Confidence Map |
| 0.3 Foundation read | `foundation/business-model-summary.md` | Business context level; Foundation Nudge if absent | Phase 1 FRAME brief |

---

### Phase 1: FRAME

| Step | Inputs | Outputs | Feeds Into |
|---|---|---|---|
| 1.1 Initiative Brief | State Detection results; user-stated target market | Confirmed target market; surfaced prior intelligence | 1.2 Confidence Map |
| 1.2 Confidence Map | State Detection artifact list; artifact ages | 5-domain confidence table (Business context / Competitors / Personas / Internal demand / Product-market fit) each HIGH/MEDIUM/LOW/NONE | Inflection Point 0 |
| 1.3 Scope Definition | User input | Confirmed: target market name, geography, data date range (default 24 months), known constraints | Inflection Point 0 |

### Inflection Point 0: Confirm Scope — Proceed to Discovery?

| Field | Details |
|---|---|
| **Inputs** | Confidence Map (5 domains); Scope Definition (market, date range, constraints); list of what Discovery will cover (Streams 2A–2E) |
| **Outputs** | User go/no-go decision; confirmed scope record |
| **Decision Options** | PROCEED / ABORT |
| **If PROCEED** | → Phase 2 DISCOVER |
| **If ABORT** | → EXIT with no artifacts |

---

### Phase 2: DISCOVER

| Step | Inputs | Outputs | Feeds Into |
|---|---|---|---|
| 2A Internal Demand Signal Mining | MySQL: 24-month booking trend by source market (pymysql direct connection to `system_travelapp` via env vars); MySQL: destination breakdown (pymysql direct connection to `system_travelapp` via env vars); MySQL: product type mix, avg booking value, lead time, group size, seasonality, traffic, amendment rates (pymysql direct connection to `system_travelapp` via env vars) | Internal demand signal report: booking volumes, trends, seasonality patterns, traffic metrics; confidence label (FACT/INFERENCE/ASSUMPTION) per finding | Inflection Point 1 Evidence Summary |
| 2B External Market Intelligence | Web search: outbound travel market size + growth for target market; Web search: travel behaviour patterns (booking lead time, trip duration, spend); Web search: structural factors (visa regimes, flight connectivity, currency, language, culture); Web search: digital landscape (platforms, search volume); Web search: regulatory/risk factors | External market intelligence report with citations and publication dates; FACT/INFERENCE/ASSUMPTION labels | Inflection Point 1 Evidence Summary |
| 2C Competitor Landscape Analysis | Web search: direct, indirect, and local competitors serving target market; 9-dimension profiling matrix (price, itinerary length, activities, accommodation tier, USPs, source market focus, booking flexibility, digital presence/ratings, amendment/cancellation policies) | Competitor profile per competitor; competitive gap analysis (what competitors do well, poorly, and gap nobody covers) | Inflection Point 1 Evidence Summary; Phase 4 Competitor Benchmark artifacts |
| 2D Buyer Persona Discovery | Web search + industry data: 12-dimension persona template per segment; existing `artifacts/personas/` < 90 days (reuse if fresh); Stream 2A internal demand cross-validation | 2–5 persona profiles; audience match assessment; reuse flag if existing personas leveraged | Inflection Point 1 Evidence Summary; Phase 4 Persona Card artifacts |
| 2E Cross-Initiative Intelligence | GitHub repo scan: `artifacts/competitors/`, `artifacts/personas/`, `artifacts/decision-records/`, `initiatives/closed/` | List of overlapping competitors from prior initiatives; persona archetypes matching target market; market similarities; product gaps flagged in prior decision records; explicit reuse notes | Inflection Point 1 Evidence Summary |

### Inflection Point 1: Is This Market Worth Entering?

| Field | Details |
|---|---|
| **Inputs** | Stream 2A–2E outputs: demand signals, external intelligence, competitor landscape, persona profiles, cross-initiative findings |
| **Outputs** | Evidence Summary table (Signal / Finding / Confidence / Source); Preliminary Scores table (5 dimensions × 1–10 + Composite); Data Confidence table (Internal demand / External market / Competitor data); Options table; AI Recommendation |
| **Decision Options** | ENTER / MONITOR / REJECT |
| **If ENTER** | → Phase 3 DECIDE |
| **If MONITOR** | → Phase 4 CONFIRM (produce all artifacts, document monitoring triggers, set initiative status = monitoring) |
| **If REJECT** | → Phase 4 CONFIRM (produce all artifacts, move initiative to `closed/`) |

---

### Phase 3: DECIDE (Only if ENTER)

| Step | Inputs | Outputs | Feeds Into |
|---|---|---|---|
| 3.1 Entry Strategies | Inflection Point 1 composite scores; Stream 2A–2E findings; `references/decision-framework.md` | 2–3 entry strategies each with: description, rationale, impact projections (bookings/revenue/timeline), resource requirements, trade-offs table | Inflection Point 3 Strategy Comparison |
| 3.2 Risk Matrix | Each entry strategy from 3.1 | Risk matrix per strategy: likelihood (H/M/L) × impact (H/M/L) per risk dimension | Inflection Point 3 |
| 3.3 Resource Requirements | Entry strategies from 3.1 | Summary of people, budget, tech, partnerships per strategy | Inflection Point 3 |

### Inflection Point 3: Commit to Entry Strategy?

| Field | Details |
|---|---|
| **Inputs** | 2–3 entry strategies (description, impact projections, resources, risk matrix); AI recommended strategy with reasoning |
| **Outputs** | Strategy Comparison table; selected strategy; concrete first steps |
| **Decision Options** | COMMIT [Strategy N] / REVISE / MONITOR / REJECT |
| **If COMMIT** | → Phase 4 CONFIRM with selected strategy |
| **If REVISE** | → Loop back to Phase 3 with adjusted parameters |
| **If MONITOR** | → Phase 4 CONFIRM (produce artifacts, set monitoring status) |
| **If REJECT** | → Phase 4 CONFIRM (evidence changed, close initiative) |

---

### Phase 4: CONFIRM

| Step | Inputs | Outputs | Feeds Into |
|---|---|---|---|
| 4.1 Produce Deliverables | All Phase 2 stream findings; Inflection Point 1 scores and evidence; selected strategy (or MONITOR/REJECT decision) | (1) Market Assessment Report; (2) Persona Cards (2–5 .md files); (3) Competitor Benchmark Summary (one .md per competitor); (4) Entry Recommendation with scores; (5) Decision Record (YAML + narrative) | 4.2 GitHub storage |
| 4.2 Store Artifacts | All 5 deliverables | GitHub commits to: `artifacts/market-assessments/[market]-[YYYY-MM-DD].md`; `artifacts/personas/[persona-name].md`; `artifacts/competitors/[competitor]-[market].md`; `artifacts/decision-records/market-entry-[market]-[YYYY-MM-DD].md`; `initiatives/[active\|closed]/market-entry-[market].md`; SHA hashes returned | 4.3 Initiative State; 4.4 Memory Pointer |
| 4.3 Initiative State File | Phase/status from decision | `initiatives/active/market-entry-[market].md` created on start; updated throughout; moved to `initiatives/closed/` on close | Index update |
| 4.4 Memory Pointer | GitHub storage confirmation | Perplexity memory entry: `Market Entry — [market]: [ENTER/MONITOR/REJECT]. [N] artifacts. Stored at initiatives/[active\|closed]/market-entry-[market].md` | — |
| 4.5 Update Index | Committed artifact paths | Updated rows in `intelligence/_index/market-assessments.md`, `personas.md`, `competitors.md`, `decision-records.md` | — |

---

## Dependency Graph

```
Step 0: State Detection
  ├── GitHub repo scan (foundation, initiatives, artifacts/*)
  └── Index-accelerated lookup (_index/*.md)
         │
         ▼
Phase 1: FRAME
  ├── 1.1 Initiative Brief (prior intelligence surfaced)
  ├── 1.2 Confidence Map (5 domains)
  └── 1.3 Scope Definition
         │
         ▼
[INFLECTION POINT 0: Proceed?] ─── ABORT ──→ EXIT
         │ PROCEED
         ▼
Phase 2: DISCOVER (5 parallel streams)
  ├── 2A Internal Demand (MySQL (pymysql))
  ├── 2B External Market Intelligence (Web search)
  ├── 2C Competitor Landscape (Web search)
  ├── 2D Buyer Persona Discovery (Web search + repo reuse)
  └── 2E Cross-Initiative Intelligence (repo scan)
         │ (all streams feed into)
         ▼
[INFLECTION POINT 1: Worth entering?]
  ├── ENTER ──────────────────────────────────────────┐
  ├── MONITOR ──→ Phase 4 (partial) + close/monitor   │
  └── REJECT ──→ Phase 4 (all artifacts) + close      │
                                                       ▼
                                              Phase 3: DECIDE
                                        ├── 3.1 Entry Strategies (2–3)
                                        ├── 3.2 Risk Matrix
                                        └── 3.3 Resource Requirements
                                                       │
                                                       ▼
                                        [INFLECTION POINT 3: Commit?]
                                          ├── COMMIT ─────────────────┐
                                          ├── REVISE → loop Phase 3   │
                                          ├── MONITOR → Phase 4       │
                                          └── REJECT → Phase 4        │
                                                                       ▼
                                                             Phase 4: CONFIRM
                                                       ├── 4.1 Produce 5 deliverables
                                                       ├── 4.2 GitHub storage
                                                       ├── 4.3 Initiative state file
                                                       ├── 4.4 Memory pointer
                                                       └── 4.5 Update _index files
```

---

## Artifact Registry

| Artifact | Path Pattern | Frontmatter Type | Depends On |
|---|---|---|---|
| Market Assessment Report | `artifacts/market-assessments/[market]-[YYYY-MM-DD].md` | `market-assessment` | Streams 2A, 2B, 2C, 2D, 2E; IP1 scores |
| Persona Card | `artifacts/personas/[persona-name].md` | `persona` | Stream 2D; Stream 2A cross-validation |
| Competitor Profile | `artifacts/competitors/[competitor]-[market].md` | `competitor` | Stream 2C; Stream 2E reuse check |
| Entry Recommendation | Embedded in Market Assessment or separate section | `market-assessment` (recommendation field) | IP1 scores; IP3 decision |
| Decision Record | `artifacts/decision-records/market-entry-[market]-[YYYY-MM-DD].md` | `decision-record` | All streams; IP1 and IP3 decisions |
| Initiative State File | `initiatives/active/market-entry-[market].md` → `initiatives/closed/market-entry-[market].md` | `initiative` | Phase transitions; all artifact paths |
| Memory Index Entry | `intelligence/_index/[category].md` | — (markdown table row) | All committed artifacts |
