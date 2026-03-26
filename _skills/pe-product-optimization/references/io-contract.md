# I/O Contract: pe-product-optimization

## Skill-Level Contract

| | Details |
|---|---|
| **Required Inputs** | Product name or ID; optimization trigger (Performance Decline, Competitive Pressure, Strategic Review, Customer Complaints, or Routine Health Check) |
| **Optional Inputs** | `foundation/business-model-summary.md` (brand fit, tier mapping, portfolio context); existing `artifacts/health-checks/` < 90 days for this product (reuse, skip redundant sub-sections); existing `artifacts/competitors/` < 90 days relevant to product's destination/tier (reuse for 2B); prior decision records for overlapping initiatives; `intelligence/_index/*.md` (fast path lookup) |
| **Produces** | Product Diagnostic Report; Optimization Recommendations table; Competitive Position Analysis; Implementation Priority Matrix (2×2); Monitoring Dashboard Spec; Decision Record; Initiative State File |
| **Updates** | `intelligence/_index/health-checks.md`; `intelligence/_index/competitors.md`; `intelligence/_index/decision-records.md` |

---

## Phase-Level Contracts

### Phase 0: State Detection

| Step | Inputs | Outputs | Feeds Into |
|---|---|---|---|
| 0.1 Repo scan | GitHub repo: `foundation/`, `artifacts/health-checks/`, `artifacts/competitors/`, `initiatives/active/`, `initiatives/closed/`, `artifacts/decision-records/` via `gh api` | List of existing artifacts with paths and ages; prior optimization/repositioning initiative flags; prior decision record constraints | Phase 1 Confidence Map |
| 0.2 Index lookup | `intelligence/_index/{category}.md` (fast path) | Parsed artifact table or directory fallback | Phase 1 Confidence Map |
| 0.3 Foundation read | `foundation/business-model-summary.md` | Business context level; Foundation Nudge if absent | Phase 1 FRAME |
| 0.4 Capability Reuse | Health-check age check (< 90 days = fresh); competitor profile age check; active initiative overlap check | Reuse flags per artifact type; user confirmation prompt if active initiative overlaps | Phase 2 stream routing |

---

### Phase 1: FRAME

| Step | Inputs | Outputs | Feeds Into |
|---|---|---|---|
| 1-A Optimization Trigger | User context; one of 5 trigger categories (Performance Decline / Competitive Pressure / Strategic Review / Customer Complaints / Routine Health Check) | Confirmed trigger type | 1-B Baseline |
| 1-B Baseline Expectation | User input or inferred context: definition of "good performance", time period in scope, known external factors, primary concern (volume/conversion/margin/satisfaction) | Baseline expectation document: performance definition, time horizon, primary concern | 1-C Confidence Map |
| 1-C Confidence Map | State Detection results; user context | 7-domain confidence table (Business context / Product performance data / Customer profile data / Competitive landscape / Amendment intelligence / Conversion funnel / Previous health checks) each HIGH/MEDIUM/LOW/NONE | Scope confirmation before DISCOVER |
| 1-D Scope Confirmation | 1-A through 1-C outputs | Confirmed: product name/ID, time horizon (default 12 months with 3/6/12 breakdowns), trigger, constraints | Phase 2 |

---

### Phase 2: DISCOVER

| Step | Inputs | Outputs | Feeds Into |
|---|---|---|---|
| 2A-1 Booking Performance Analysis | MySQL: 3/6/12-month booking volume by product (pymysql direct connection to `system_travelapp`); MySQL: revenue breakdown (total, per-booking avg) (pymysql direct connection to `system_travelapp`); MySQL: comparison vs. similar products and portfolio average (pymysql direct connection to `system_travelapp`); MySQL: occupancy/utilization rate (pymysql direct connection to `system_travelapp`) | Performance trend table with RAG status (Red/Amber/Green); trend arrows (▲/▼/→); period-over-period comparison | 2A-4; Inflection Point 1 |
| 2A-2 Conversion Funnel Analysis | MySQL: page views → detail views → inquiries → bookings (pymysql direct connection to `system_travelapp`); MySQL: portfolio benchmark conversion ratios (pymysql direct connection to `system_travelapp`) | Funnel diagram with % at each stage; primary drop-off point identified; gap vs. portfolio benchmark | Inflection Point 1; 2C Root Cause |
| 2A-3 Amendment Signal Analysis | MySQL: amendment volume by 10 type categories (pymysql direct connection to `system_travelapp`); MySQL: amendment rate vs. portfolio average (pymysql direct connection to `system_travelapp`); MySQL: amendment patterns by source market and segment (pymysql direct connection to `system_travelapp`) | Amendment signal table: Hidden Demand Signals (upgrades/additions/extensions = upsell opportunity); Dissatisfaction Signals (removals/cancellations = mismatch); demand signal calculation | Inflection Point 1; 2C Root Cause |
| 2A-4 Customer Profile Analysis | MySQL: buyer demographics by product (pymysql direct connection to `system_travelapp`); MySQL: top 3–5 source markets (pymysql direct connection to `system_travelapp`); MySQL: customer segments (FIT/group/luxury/budget) (pymysql direct connection to `system_travelapp`); MySQL: repeat vs. first-time ratio (pymysql direct connection to `system_travelapp`); MySQL: cross-purchase patterns (pymysql direct connection to `system_travelapp`); `foundation/` personas for intended audience comparison | Buyer profile summary; audience match assessment (actual buyer vs. intended persona) | Inflection Point 1; 2C Root Cause |
| 2B Competitive Position Analysis | Web search: 3–5 direct competitors (same destination, same tier); 9-dimension comparison matrix (price positioning, itinerary length, included activities, accommodation tier, USPs, source market focus, booking flexibility, digital presence/ratings, amendment/cancellation policies); existing `artifacts/competitors/` < 90 days (reuse if fresh) | Competitive matrix table; gap summary (where we are weaker); competitive advantages (where we lead) | Inflection Point 1; Phase 4 Competitive Position Analysis artifact |
| 2C Root Cause Analysis | 2A-1 through 2A-4 outputs; 2B competitive matrix; 8-category root cause framework (Pricing Issue / Content/Messaging Issue / Structural Issue / Audience Mismatch / Competitive Displacement / Channel Issue / Seasonal/Cyclical / Lifecycle Decline) | Root cause table: category, symptom indicators, evidence, confidence (HIGH/MEDIUM/LOW), additional data needed | Inflection Point 1 Recommendation; Phase 3 recommendation basis |
| 2D Cross-Initiative Intelligence | GitHub repo scan: `artifacts/health-checks/`, `initiatives/closed/`, `artifacts/competitors/`, `artifacts/personas/`, `artifacts/decision-records/` | Prior optimization runs for this product; repositioning decisions; shared competitor profiles; persona findings; relevant patterns from closed initiatives | Inflection Point 1 context |

### Inflection Point 1: Is This Product Worth Optimizing?

| Field | Details |
|---|---|
| **Inputs** | Streams 2A-1 through 2D: performance data, funnel analysis, amendment signals, customer profile, competitive matrix, root cause analysis, cross-initiative context |
| **Outputs** | Key Findings (3–5 quantified bullets); Confidence Assessment table (5 domains); Options table; AI Recommendation tied to specific findings |
| **Decision Options** | OPTIMIZE / REPOSITION / RETIRE / HOLD |
| **If OPTIMIZE** | → Phase 3 DECIDE |
| **If REPOSITION** | → Phase 4 CONFIRM (decision record only); suggest `pe-repositioning` skill |
| **If RETIRE** | → Phase 4 CONFIRM (decision record); close initiative |
| **If HOLD** | → Phase 4 CONFIRM (monitoring spec only); set revisit trigger |

---

### Phase 3: DECIDE (Only if OPTIMIZE)

| Step | Inputs | Outputs | Feeds Into |
|---|---|---|---|
| 3-A Optimization Recommendations | 2C root cause table; 2A performance baselines; `references/optimization-framework.md` scoring methodology | Prioritized recommendations table: recommendation, root cause addressed, expected impact (quantified), effort (Low/Med/High), priority tier (Quick Win/Major/Strategic/Fill-in), owner | Inflection Point 3 |
| 3-B Strategy Options | 3-A recommendations; root cause analysis | 2–3 distinct strategic options: Option A (conservative/quick-win), Option B (balanced/comprehensive), Option C (transformational, if applicable); each with summary, key actions, timeline, resource requirement, projected impact range, risks | Inflection Point 3 |
| 3-C Success Metrics | 2A performance baselines; selected strategy option | Per metric: current baseline, 30-day target, 60-day target, 90-day target, alert threshold | Inflection Point 3; Phase 4 Monitoring Dashboard Spec |
| 3-D Risk Assessment | Chosen strategy from 3-B | Top 3–5 risks each with likelihood (H/M/L) × impact (H/M/L); mitigation approach; dependencies and assumptions | Inflection Point 3 |

### Inflection Point 3: Is This Optimization Plan Ready?

| Field | Details |
|---|---|
| **Inputs** | Selected strategy (3-B); recommendations table (3-A); 30/60/90-day targets (3-C); risk assessment (3-D) |
| **Outputs** | Plan Summary; Confidence Assessment (4 domains: Recommendation Basis / Impact Estimates / Resource Requirements / Risk Coverage); Options table; AI Recommendation |
| **Decision Options** | APPROVE / REVISE / DEFER |
| **If APPROVE** | → Phase 4 CONFIRM (full deliverable production) |
| **If REVISE** | → Loop back to Phase 3 with specific adjustments |
| **If DEFER** | → Phase 4 CONFIRM (decision record with revisit trigger only) |

---

### Phase 4: CONFIRM

| Step | Inputs | Outputs | Feeds Into |
|---|---|---|---|
| 4.1 Product Diagnostic Report | All Phase 2 stream outputs | 6-section report: Executive Summary; Performance Analysis; Amendment Signal Analysis; Customer Profile Analysis; Competitive Position; Root Cause Summary | GitHub storage |
| 4.2 Optimization Recommendations | 3-A table (if OPTIMIZE) | Prioritized table: recommendation, root cause, expected impact, effort, priority tier, owner, dependencies | GitHub storage |
| 4.3 Competitive Position Analysis | 2B competitive matrix | Standalone reusable competitor matrix document | GitHub storage |
| 4.4 Implementation Priority Matrix | 3-A recommendations | 2×2 impact-effort quadrant: Quick Wins (High Impact/Low Effort); Major Projects (High/High); Fill-ins (Low/Low); Time Sinks (Low/High) | GitHub storage |
| 4.5 Monitoring Dashboard Spec | 3-C success metrics | Per metric: name, definition, data source, baseline, 30/60/90-day targets, alert threshold, review cadence | GitHub storage; Re-run baseline |
| 4.6 Decision Record | IP1 and IP3 decisions; all supporting evidence | YAML frontmatter + decision summary, rationale, revisit triggers | GitHub storage |
| 4.7 Store Artifacts | All deliverables | GitHub commits to: `artifacts/health-checks/[product]-[YYYY-MM-DD].md`; `artifacts/competitors/[name]-[context].md` (if new); `artifacts/decision-records/optimization-[product]-[YYYY-MM-DD].md`; `initiatives/active/` → `initiatives/closed/optimization-[product].md` | Index update; Memory pointer |
| 4.8 Memory Pointer | GitHub storage confirmation | Perplexity memory entry: `Product Optimization — [Product]: [Decision]. [N] artifacts. Stored at initiatives/closed/optimization-[product].md` | — |
| 4.9 Update Index | Committed artifact paths | Updated rows in `intelligence/_index/health-checks.md`, `competitors.md`, `decision-records.md` | — |

---

## Dependency Graph

```
Step 0: State Detection
  ├── Repo scan (foundation, health-checks, competitors, initiatives, decision-records)
  ├── Index-accelerated lookup (_index/*.md)
  └── Capability reuse check (< 90 days = fresh)
         │
         ▼
Phase 1: FRAME
  ├── 1-A Optimization Trigger (one of 5 types)
  ├── 1-B Baseline Expectation
  ├── 1-C Confidence Map (7 domains)
  └── 1-D Scope Confirmation
         │
         ▼
Phase 2: DISCOVER
  ├── 2A Performance Diagnostic (database-heavy)
  │   ├── 2A-1 Booking Performance (MySQL (pymysql))
  │   ├── 2A-2 Conversion Funnel (MySQL (pymysql))
  │   ├── 2A-3 Amendment Signals (MySQL (pymysql))
  │   └── 2A-4 Customer Profile (MySQL (pymysql))
  ├── 2B Competitive Position (Web search; repo reuse if < 90 days)
  ├── 2C Root Cause Analysis (8-category framework, feeds from 2A + 2B)
  └── 2D Cross-Initiative Intelligence (repo scan)
         │ (all feed into)
         ▼
[INFLECTION POINT 1: Worth optimizing?]
  ├── OPTIMIZE ──────────────────────────────────────────────┐
  ├── REPOSITION → Phase 4 (decision record) + suggest pe-repositioning
  ├── RETIRE ──→ Phase 4 (decision record, close)            │
  └── HOLD ────→ Phase 4 (monitoring spec, revisit trigger)  │
                                                              ▼
                                                    Phase 3: DECIDE
                                              ├── 3-A Recommendations table
                                              ├── 3-B Strategy Options (2–3)
                                              ├── 3-C Success Metrics (30/60/90-day)
                                              └── 3-D Risk Assessment
                                                              │
                                                              ▼
                                              [INFLECTION POINT 3: Plan ready?]
                                                ├── APPROVE ─────────────────┐
                                                ├── REVISE → loop Phase 3    │
                                                └── DEFER → Phase 4 (partial)│
                                                                              ▼
                                                                    Phase 4: CONFIRM
                                                              ├── 4.1 Diagnostic Report
                                                              ├── 4.2 Optimization Recs
                                                              ├── 4.3 Competitive Analysis
                                                              ├── 4.4 Priority Matrix
                                                              ├── 4.5 Monitoring Dashboard
                                                              ├── 4.6 Decision Record
                                                              ├── 4.7 GitHub storage
                                                              ├── 4.8 Memory pointer
                                                              └── 4.9 Update _index files
```

---

## Artifact Registry

| Artifact | Path Pattern | Frontmatter Type | Depends On |
|---|---|---|---|
| Product Diagnostic Report | `artifacts/health-checks/[product]-[YYYY-MM-DD].md` | `health-check` | Streams 2A-1 through 2A-4; 2B; 2C root cause |
| Competitor Profile (if new) | `artifacts/competitors/[name]-[context].md` | `competitor-profile` | Stream 2B; existing competitor reuse check |
| Decision Record | `artifacts/decision-records/optimization-[product]-[YYYY-MM-DD].md` | `decision-record` | IP1 and IP3 decisions; all stream findings |
| Initiative State File | `initiatives/active/optimization-[product].md` → `initiatives/closed/optimization-[product].md` | `initiative` | Phase transitions; all artifact paths |
| Monitoring Dashboard Spec | Embedded in health-check or separate section | `optimization-plan` | 3-C success metrics; 2A baselines |
| Memory Index Entry | `intelligence/_index/[category].md` | — (markdown table row) | All committed artifacts |
