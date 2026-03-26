# I/O Contract: pe-repositioning

## Skill-Level Contract

| | Details |
|---|---|
| **Required Inputs** | Product name/ID; proposed new audience (market, segment, or geography); initiating rationale |
| **Optional Inputs** | `foundation/business-model-summary.md` (brand fit, tier mapping, portfolio context); existing `artifacts/health-checks/` < 90 days for this product (reuse in 2A-1, skip inline assessment); existing `artifacts/personas/` < 90 days relevant to new audience (reuse in 2B-2); existing `artifacts/competitors/` < 90 days (reuse in 2B-1); existing `artifacts/gap-analyses/` (prior repositioning context); `intelligence/_index/*.md` (fast path lookup) |
| **Produces** | Repositioning Assessment Document; Audience Persona Cards (2–4); Competitor Benchmark (audience-specific); Gap Analysis Matrix (standalone); Implementation Brief; Decision Record; Initiative State File |
| **Updates** | `intelligence/_index/gap-analyses.md`; `intelligence/_index/personas.md`; `intelligence/_index/competitors.md`; `intelligence/_index/decision-records.md` |

---

## Phase-Level Contracts

### Phase 0: State Detection

| Step | Inputs | Outputs | Feeds Into |
|---|---|---|---|
| 0.1 Repo scan | GitHub repo: `foundation/`, `initiatives/active/`, `initiatives/closed/`, `artifacts/personas/`, `artifacts/competitors/`, `artifacts/health-checks/`, `artifacts/gap-analyses/` via parallel `gh api` | List of existing artifacts with paths and ages; overlap flags for prior repositioning initiatives; reuse eligibility flags | Phase 1 Confidence Map |
| 0.2 Index lookup | `intelligence/_index/{category}.md` (fast path) | Parsed artifact table or directory fallback | Phase 1 Confidence Map |
| 0.3 Foundation read | `foundation/business-model-summary.md` | Business context level; Foundation Nudge if absent | Phase 1 FRAME |

---

### Phase 1: FRAME

| Step | Inputs | Outputs | Feeds Into |
|---|---|---|---|
| 1.1 Present Understanding | User intent; State Detection results | Stated back: product name/type/current audience/known performance; proposed new audience; initiating rationale | 1.2 Confidence Map |
| 1.2 Confidence Map | State Detection artifact list and ages | 7-domain confidence table (Business context / Current product performance / Current audience profile / New audience profile / Competitive landscape (new) / Product adaptability signals / Prior repositioning attempts) each HIGH/MEDIUM/LOW/NONE | 1.3 Scope Clarification |
| 1.3 Scope Clarification | User input | Confirmed anticipated change depth: Messaging only / Content adaptation / Product structure; all ambiguities resolved | IP0 / Phase 2 |
| 1.4 Initiative State File | Confirmed scope | `initiatives/active/repositioning-[product]-[audience].md` created with YAML frontmatter (type, initiative_type, subject, phase, status, started, updated, artifacts_produced: []) | Ongoing phase tracking |

---

### Phase 2: DISCOVER — Dual-Track Structure

#### Track A — Understand the Product

| Step | Inputs | Outputs | Feeds Into |
|---|---|---|---|
| 2A-1 Product Current State Assessment | Existing `artifacts/health-checks/` < 90 days (reuse if present); otherwise MySQL: booking volume 12–24 month trend (pymysql direct connection to `system_travelapp`); MySQL: source market breakdown (pymysql direct connection to `system_travelapp`); MySQL: customer segment breakdown (pymysql direct connection to `system_travelapp`); MySQL: conversion metrics and funnel (pymysql direct connection to `system_travelapp`); MySQL: amendment and cancellation patterns (pymysql direct connection to `system_travelapp`); MySQL: seasonal patterns (pymysql direct connection to `system_travelapp`) | Product current state report: booking trend, source market mix, segment mix, conversion funnel, amendment patterns, seasonality; reuse flag if health-check leveraged | 2A-2 Structural Analysis; IP1 Confidence |
| 2A-2 Product Structural Analysis | 2A-1 findings; `references/gap-analysis-framework.md` adaptability ratings | Product Structural Analysis table (9 components × Current State / Adaptability HIGH/MED/LOW / Change Effort MINOR/MOD/MAJOR / Notes): Destination/Itinerary, Accommodation, Activities, Transport, Duration, Price Point, Messaging/Positioning, Content/Language, Booking Flow | 2C Gap Analysis |

#### Track B — Understand the New Audience

| Step | Inputs | Outputs | Feeds Into |
|---|---|---|---|
| 2B-1 Audience Intelligence | Web search: outbound travel market size for new audience source market; Web search: travel behaviour patterns (booking lead time, trip duration, spend patterns); Web search: distribution channels (OTA, direct, agent, social); Web search: cultural and economic travel factors; Web search + competitor profiling: top 3–5 competitors already serving this audience for this product type | Audience intelligence report with citations; competitor list for new audience with 9-dimension profiles | 2B-2 Persona; 2C Gap Analysis; IP1 |
| 2B-2 Buyer Persona Discovery | 2B-1 audience intelligence; existing `artifacts/personas/` < 90 days relevant to new audience (reuse if fresh); persona template from `references/repositioning-templates.md` | 2–4 buyer persona profiles for new audience (stored at `artifacts/personas/[name].md`) | 2C Gap Analysis; Phase 4 Persona Cards |
| 2B-3 Internal Demand Signals | MySQL: existing bookings from new audience geography/segment for this product (pymysql direct connection to `system_travelapp`); MySQL: traffic and inquiry patterns from new audience (pymysql direct connection to `system_travelapp`); MySQL: similar products with crossover to new audience (pymysql direct connection to `system_travelapp`) | Internal demand signal summary: existing bookings, traffic/inquiry patterns, crossover product data | 2C Gap Analysis; IP1 Evidence |

#### Convergence

| Step | Inputs | Outputs | Feeds Into |
|---|---|---|---|
| 2C Repositioning Gap Analysis | Track A: 2A-1 current state + 2A-2 structural analysis; Track B: 2B-1 audience intelligence + 2B-2 personas + 2B-3 demand signals; `references/gap-analysis-framework.md` (Gap Type definitions: MISSING/DEFICIENT/MISALIGNED/EXCESS/NONE; Severity: CRITICAL/MODERATE/MINOR/NONE; classification thresholds) | 10-Dimension Gap Analysis Matrix (Price positioning, Product duration, Destination fit, Activity mix, Accommodation standard, Cultural resonance, Language/content, Distribution channels, Messaging/brand tone, Booking flow/UX); Strategic Classification: REPOSITIONING / PARTIAL REDESIGN / FULL REDESIGN | IP1 |
| 2D Cross-Initiative Intelligence | GitHub repo scan: `artifacts/personas/`, `artifacts/competitors/`, `initiatives/closed/`, `artifacts/decision-records/` | Personas from other markets sharing traits with new audience; shared competitors across initiatives; similar gap patterns from prior repositioning; relevant decision records | IP1 context |

### Inflection Point 1: Is Repositioning Viable?

| Field | Details |
|---|---|
| **Inputs** | Track A outputs (product current state, structural analysis); Track B outputs (audience intelligence, personas, internal demand signals); 2C Gap Analysis Matrix (counts of CRITICAL/MODERATE/MINOR gaps); 2D cross-initiative context |
| **Outputs** | Key Findings (3–5 bullet summary of dual-track discovery); Confidence Assessment table (5 domains: Product current state / New audience profile / Gap analysis / Competitive landscape / Internal demand signals); Gap Summary (N CRITICAL / N MODERATE / N MINOR + Strategic Classification); Options table; AI Recommendation referencing gap analysis |
| **Decision Options** | REPOSITION / PARTIAL REDESIGN / FULL REDESIGN / REJECT |
| **If REPOSITION** | → Phase 3 DECIDE (messaging + content changes) |
| **If PARTIAL REDESIGN** | → Phase 3 DECIDE (structural changes included) |
| **If FULL REDESIGN** | → Phase 4 CONFIRM (decision record); hand off to `pe-new-product-development` |
| **If REJECT** | → Phase 4 CONFIRM (decision record + all artifacts); close initiative |

---

### Phase 3: DECIDE (REPOSITION or PARTIAL REDESIGN only)

| Step | Inputs | Outputs | Feeds Into |
|---|---|---|---|
| 3.1 Repositioning Strategy | 2C gap analysis; 2B-1 audience intelligence; 2B-2 personas; 2B-1 competitor profiles | Positioning statement for new audience; value proposition (vs. current); key differentiation from audience-specific competitors; brand tone and messaging shifts required | IP2 |
| 3.2 Messaging Framework | 3.1 strategy; `references/repositioning-templates.md` | Core message (what we are to this audience); 3–5 proof points; objection handling; call to action language | IP2; Phase 4 Implementation Brief |
| 3.3 Product Adjustments | 2C gap matrix (each gap row); 2A-2 structural analysis | Per-gap change spec table: dimension, current state, desired state for new audience, change type (Messaging/Content/Structural), effort (LOW/MEDIUM/HIGH), owner (Product/Marketing/Tech/Operations) | IP2; Phase 4 Implementation Brief |
| 3.4 Implementation Roadmap | 3.3 product adjustments prioritized by effort | Three-phase roadmap: Quick Wins (Weeks 1–4, messaging + content); Core Changes (Months 2–4, structural adaptations); Refinement (Months 5–6+, data-driven tuning) | IP2; Phase 4 Implementation Brief |
| 3.5 Channel Strategy | 2B-1 distribution channel findings; 2B-2 persona channel preferences | Distribution and marketing channel plan specific to new audience | IP2; Phase 4 |
| 3.6 Impact Projections | 2B-3 internal demand signals; 2B-1 market sizing; 3.1–3.4 strategy | Projected outcomes with confidence levels; assumptions disclosed | IP2 |
| 3.7 Risk Assessment | 2A-1 current product booking baseline; 3.3 structural changes; existing audience profile | Risk table including "Protect the existing audience" assessment: messaging dilution risk for current buyers, structural change degradation risk, % of current bookings at risk, mitigation options per risk | IP2 |

### Inflection Point 2: Is This Repositioning Strategy Ready?

| Field | Details |
|---|---|
| **Inputs** | 3.1 positioning statement + top 3 changes; 3.3 product adjustments; 3.4 implementation roadmap; 3.6 impact projections; 3.7 risk assessment (including existing audience impact) |
| **Outputs** | Strategy Summary; Confidence Assessment (4 domains: Audience fit / Implementation feasibility / Impact projections / Existing audience risk); Options table; AI Recommendation |
| **Decision Options** | APPROVE / APPROVE WITH MODIFICATIONS / DEFER / REJECT |
| **If APPROVE or APPROVE WITH MODIFICATIONS** | → Phase 4 CONFIRM (full deliverable production) |
| **If DEFER** | → Phase 4 CONFIRM (partial: decision record + monitoring trigger) |
| **If REJECT** | → Phase 4 CONFIRM (decision record); close initiative |

---

### Phase 4: CONFIRM

| Step | Inputs | Outputs | Feeds Into |
|---|---|---|---|
| 4.1 Repositioning Assessment Document | All Phase 2 and Phase 3 outputs | 10-section executive document covering full dual-track discovery + strategy | GitHub storage |
| 4.2 Audience Persona Cards | 2B-2 persona profiles (2–4) | One .md file per persona at `artifacts/personas/[name].md` | GitHub storage |
| 4.3 Competitor Benchmark | 2B-1 competitor profiles (3–5) | Audience-specific competitor benchmark at `artifacts/competitors/[name]-[audience-market].md` | GitHub storage |
| 4.4 Gap Analysis Matrix | 2C 10-dimension matrix | Standalone reusable gap tracking document at `artifacts/gap-analyses/[product]-vs-[audience]-[date].md` | GitHub storage |
| 4.5 Implementation Brief | 3.3 adjustments; 3.4 roadmap | Per-change record: current state → desired state, rationale, effort, success metric; phased by Quick Wins → Core → Refinement | GitHub storage |
| 4.6 Decision Record | IP1 and IP2 decisions; all evidence | YAML frontmatter + narrative; includes "Impact on existing audience" field at `artifacts/decision-records/repositioning-[product]-[audience]-[date].md` | GitHub storage |
| 4.7 Close Initiative State | IP outcome (APPROVE/REJECT/DEFER) | Move `initiatives/active/repositioning-[product]-[audience].md` → `initiatives/closed/`; add `closed: YYYY-MM-DD`, `decision: [outcome]` | Index update |
| 4.8 Memory Pointer | GitHub storage confirmation | Perplexity memory entry: `Repositioning — [Product] → [Audience]: [Decision]. [N] artifacts. Stored at initiatives/closed/repositioning-[product]-[audience].md` | — |
| 4.9 Update Index | Committed artifact paths | Updated rows in `intelligence/_index/gap-analyses.md`, `personas.md`, `competitors.md`, `decision-records.md` | — |

---

## Dependency Graph

```
Step 0: State Detection
  ├── Repo scan (foundation, initiatives, personas, competitors, health-checks, gap-analyses)
  └── Index-accelerated lookup (_index/*.md)
         │
         ▼
Phase 1: FRAME
  ├── 1.1 Present Understanding (product + new audience + rationale)
  ├── 1.2 Confidence Map (7 domains)
  ├── 1.3 Scope Clarification (change depth: Messaging/Content/Structural)
  └── 1.4 Create Initiative State File
         │
         ▼
Phase 2: DISCOVER — Dual-Track
  ┌──────────────────────┬──────────────────────────────┐
  │   Track A (Product)  │      Track B (New Audience)  │
  │                      │                              │
  │ 2A-1 Current State   │ 2B-1 Audience Intelligence   │
  │  (health-check reuse │  (Web search + competitors)  │
  │   or MySQL queries)  │                              │
  │                      │ 2B-2 Buyer Persona Discovery │
  │ 2A-2 Structural      │  (repo reuse or new)         │
  │  Analysis (9 comps)  │                              │
  │                      │ 2B-3 Internal Demand Signals │
  │                      │  (MySQL (pymysql direct connection to `system_travelapp`))       │
  └──────────┬───────────┴─────────────┬────────────────┘
             │                         │
             └──────────┬──────────────┘
                        ▼
             2C Repositioning Gap Analysis
              (10-dimension matrix → REPOSITIONING /
               PARTIAL REDESIGN / FULL REDESIGN)
                        │
             2D Cross-Initiative Intelligence
              (repo scan for reusable context)
                        │
                        ▼
[INFLECTION POINT 1: Is repositioning viable?]
  ├── REPOSITION ──────────────────────────────────────┐
  ├── PARTIAL REDESIGN ──────────────────────────────→ │
  ├── FULL REDESIGN → Phase 4 (DR) + handoff pe-NPD    │
  └── REJECT ────→ Phase 4 (all artifacts) + close     │
                                                        ▼
                                               Phase 3: DECIDE
                                         ├── 3.1 Repositioning Strategy
                                         ├── 3.2 Messaging Framework
                                         ├── 3.3 Product Adjustments (per gap)
                                         ├── 3.4 Implementation Roadmap (3 phases)
                                         ├── 3.5 Channel Strategy
                                         ├── 3.6 Impact Projections
                                         └── 3.7 Risk Assessment (incl. existing audience)
                                                        │
                                                        ▼
                                         [INFLECTION POINT 2: Strategy ready?]
                                           ├── APPROVE / APPROVE WITH MODS ──────┐
                                           ├── DEFER → Phase 4 (partial)          │
                                           └── REJECT → Phase 4 (DR) + close      │
                                                                                   ▼
                                                                         Phase 4: CONFIRM
                                                                   ├── 4.1 Assessment Doc (10 sections)
                                                                   ├── 4.2 Persona Cards (2–4)
                                                                   ├── 4.3 Competitor Benchmark
                                                                   ├── 4.4 Gap Analysis Matrix (standalone)
                                                                   ├── 4.5 Implementation Brief
                                                                   ├── 4.6 Decision Record (+ existing audience field)
                                                                   ├── 4.7 Close initiative state
                                                                   ├── 4.8 Memory pointer
                                                                   └── 4.9 Update _index files
```

---

## Artifact Registry

| Artifact | Path Pattern | Frontmatter Type | Depends On |
|---|---|---|---|
| Repositioning Assessment Document | Embedded in initiative or standalone section | (part of initiative record) | All Phase 2 + Phase 3 outputs |
| Audience Persona Card | `artifacts/personas/[name].md` | `persona` | Stream 2B-2; 2B-1 audience intelligence |
| Competitor Benchmark | `artifacts/competitors/[name]-[audience-market].md` | `competitor` | Stream 2B-1 competitor profiles |
| Gap Analysis Matrix | `artifacts/gap-analyses/[product]-vs-[audience]-[date].md` | `gap-analysis` | Stream 2C; Track A + Track B convergence |
| Implementation Brief | Embedded in assessment doc or standalone | (part of initiative record) | Phase 3.3, 3.4 outputs |
| Decision Record | `artifacts/decision-records/repositioning-[product]-[audience]-[date].md` | `decision-record` | IP1 and IP2 decisions; all stream evidence |
| Initiative State File | `initiatives/active/repositioning-[product]-[audience].md` → `initiatives/closed/` | `initiative` | Phase transitions; all artifact paths |
| Memory Index Entry | `intelligence/_index/[category].md` | — (markdown table row) | All committed artifacts |
