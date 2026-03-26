# I/O Contract: pe-new-product-development

## Skill-Level Contract

| | Details |
|---|---|
| **Required Inputs** | Product concept description (format, duration, geography, experience type); target audience; trigger for development (customer request, market gap, competitor move, capacity availability); user confirmation to proceed to DISCOVER |
| **Optional Inputs** | `foundation/business-model-summary.md` (brand fit, cannibalization analysis, tier mapping); existing `artifacts/personas/` < 90 days relevant to target audience (reuse in 2B); existing `artifacts/competitors/` < 90 days (reuse in 2C); prior demand signals or decision records for similar products (check 2E); `intelligence/_index/*.md` (fast path lookup) |
| **Produces** | Product Design Brief (9 sections); Market Validation Report (5 sections); Go-to-Market Playbook; Pricing Analysis; Decision Record; Initiative State File |
| **Updates** | `intelligence/_index/personas.md`; `intelligence/_index/competitors.md`; `intelligence/_index/decision-records.md` |

---

## Phase-Level Contracts

### Phase 0: State Detection

| Step | Inputs | Outputs | Feeds Into |
|---|---|---|---|
| 0.1 Repo scan | GitHub repo: `foundation/`, `initiatives/active/`, `artifacts/personas/`, `artifacts/competitors/`, `artifacts/decision-records/` via parallel `gh api` | List of existing artifacts with paths and ages; prior REJECT decision records for similar products (avoid repeating); reuse eligibility flags for personas and competitor profiles | Phase 1 Confidence Map |
| 0.2 Index lookup | `intelligence/_index/{category}.md` (fast path) | Parsed artifact table or directory fallback | Phase 1 Confidence Map |
| 0.3 Foundation check | `foundation/business-model-summary.md` | Business context level; cannibalization assessment baseline; Foundation Nudge if absent | Phase 1 Confidence Map; Stream 2D (Feasibility) |

---

### Phase 1: FRAME

| Step | Inputs | Outputs | Feeds Into |
|---|---|---|---|
| 1.1 Confidence Map | State Detection results | 6-domain confidence table (Business context / Demand evidence / Audience intelligence / Competitive landscape / Operational feasibility / Cannibalization risk) each HIGH/MEDIUM/LOW/NONE | Six FRAME Questions |
| 1.2 Six FRAME Questions | User responses (asked conversationally, not as numbered list) | Answers to: (1) What is the product? (2) What triggered this? (3) Who is it for? (4) What makes it different? (5) What constraints exist? (6) What does success look like? | Product Concept Brief |
| 1.3 Product Concept Brief | All 1.2 answers | Structured brief: Concept name/description; Trigger; Target audience; Differentiation hypothesis; Constraints; Success metrics (KPIs); Updated Confidence Map | User confirmation; Phase 2 |

---

### Phase 2: DISCOVER

All five streams run in parallel. No recommendations — findings only.

| Step | Inputs | Outputs | Feeds Into |
|---|---|---|---|
| 2A Demand Validation (Most Important) | **Internal signals**: MySQL: direct demand (bookings/inquiries for this product type) (pymysql direct connection to `system_travelapp`); MySQL: adjacent signals (what does this audience currently book?) (pymysql direct connection to `system_travelapp`); MySQL: amendment signals (do customers add things that would be core to this product?) (pymysql direct connection to `system_travelapp`); MySQL: negative signals (expressed demand not converted) (pymysql direct connection to `system_travelapp`) — **External validation**: Web search: market size and growth trajectory; Web search: search and social signals (trending queries, hashtags, content engagement); Web search: travel trend alignment (industry reports, booking platform data); Web search: timing and seasonality fit | Demand Validation Report: internal signal summary (direct, adjacent, amendment, negative); external signal summary with citations; **Demand Verdict** (HIGH DEMAND / MODERATE DEMAND / WEAK DEMAND / NO EVIDENCE) | IP1 Key Findings; Phase 3 product design |
| 2B Audience Deep Dive | 1.3 target audience definition; existing `artifacts/personas/` < 90 days relevant to target (reuse if fresh); persona template from `references/discovery-templates.md` (includes Deal-breakers and Competitive alternatives fields) | 2–4 buyer personas; design persona identification (explicit statement of which persona to design FOR and why — not necessarily the largest segment); reuse flag if existing personas leveraged | IP1; Phase 3 positioning; Phase 4 Persona Cards |
| 2C Competitive Whitespace Analysis | Web search: current offerings landscape; competitor profiling (Competitor / Product / Price / Positioning / Strengths / Weaknesses); `references/discovery-templates.md` whitespace methodology — Three sub-analyses: **2C-1** Current Offerings Landscape Map; **2C-2** Whitespace Identification Table (Unserved Need / Evidence / Addressable by Us / Competitive Risk); **2C-3** Differentiation Opportunities (5 dimensions: Structural / Positioning / Service / Price / Channel) | Landscape Map; Whitespace Identification Table; Differentiation Opportunities by 5 dimensions — focus: *What isn't being done well or at all that we could own?* | IP1; Phase 3 positioning and differentiation; Phase 4 Market Validation Report |
| 2D Feasibility Assessment | `foundation/business-model-summary.md` (brand fit, portfolio context); user-stated constraints (1.2 Q5); operational knowledge | 8-dimension Feasibility Table (Destination supply / Accommodation / Activities / Transport/logistics / Pricing viability / Brand fit / Team capacity / Timeline / Cannibalization risk) each with Assessment, Constraints, Verdict; **Overall Feasibility Verdict**: FEASIBLE / FEASIBLE WITH CONSTRAINTS / NOT FEASIBLE; Cannibalization risk rating | IP1; Phase 3 impact projections; Phase 4 Market Validation Report |
| 2E Cross-Initiative Intelligence | GitHub repo scan: `artifacts/personas/`, `artifacts/competitors/`, `artifacts/decision-records/`, `initiatives/` | Personas from other markets with overlapping profiles; shared competitors (cross-reference existing profiles); similar product patterns or demand signals from previous initiatives; prior REJECT decisions for related products (flag to avoid repeating) | IP1 context; Phase 3 design |

### Inflection Point 1: Should We Build This Product?

| Field | Details |
|---|---|
| **Inputs** | Stream 2A demand verdict + evidence; Stream 2B persona set + design persona; Stream 2C whitespace opportunities + differentiation dimensions; Stream 2D feasibility verdict + cannibalization risk; Stream 2E cross-initiative patterns and prior REJECT flags |
| **Outputs** | Key Findings (5 bullets: demand, audience, whitespace, feasibility, cannibalization); Confidence Assessment table (5 domains: Demand evidence / Audience fit / Competitive whitespace / Operational feasibility / Cannibalization risk); Options table; AI Recommendation with explicit reasoning |
| **Decision Options** | BUILD / PIVOT / SHELVE / REJECT |
| **If BUILD** | → Phase 3 DECIDE |
| **If PIVOT** | → Clarify changes; loop back to relevant DISCOVER streams; re-surface IP1 |
| **If SHELVE** | → Phase 4 CONFIRM (decision record with revisit conditions); close initiative |
| **If REJECT** | → Phase 4 CONFIRM (decision record + evidence-based rationale); close initiative |

---

### Phase 3: DECIDE (Only if BUILD)

Most creative phase — multiple iterations expected. AI proposes, human shapes.

| Step | Inputs | Outputs | Feeds Into |
|---|---|---|---|
| 3A Product Architecture | Stream 2A demand findings; Stream 2B design persona; Stream 2C whitespace opportunities; Stream 2D feasibility constraints; `references/product-design-framework.md` Product Concept Card template | 2–3 distinct product concepts each with: concept name, tagline, format description, core experience arc (beginning/middle/end), 3–5 differentiating features, design persona alignment, estimated price range, feasibility notes, impact-effort score; iteration facilitation ("Which resonates? What to change? Explore hybrid?") | IP2; 3B Positioning |
| 3B Positioning and Messaging Framework | Selected/refined concept from 3A; 2B personas; 2C competitive differentiation | Positioning statement (For [AUDIENCE] who [NEED], [PRODUCT] is [CATEGORY] that [BENEFIT]. Unlike [COMPETITORS], we [DIFFERENTIATION]); 3 core messages; tone direction; content angles | IP2; Phase 4 Product Design Brief |
| 3C Pricing Framework | 2C competitor pricing; 2D pricing viability assessment; selected concept structure | Price point recommendation; price rationale; competitive comparison; estimated margin; variant/tier structure (solo/couple/family etc.); seasonal pricing (peak/shoulder/off-peak) | IP2; Phase 4 Pricing Analysis |
| 3D Go-to-Market Strategy | 2B personas (channel preferences); 2C differentiation; 1.3 success metrics; `references/product-design-framework.md` GTM Playbook template | Three-phase GTM plan: Pre-launch (weeks before) / Launch week (week 0) / 90-day post-launch (weeks 1–13) each with Activities and KPIs | IP2; Phase 4 GTM Playbook |
| 3E Impact Projections | 2A demand verdict; 2D feasibility verdict; 3C pricing; 3D GTM | Projections table: Bookings Year 1 / Revenue Year 1 / Margin / Audience reach / Cannibalization offset — each in Conservative / Base Case / Optimistic scenarios | IP2 |
| 3F Risk Assessment | 2D cannibalization risk; 3A concept structure; 3D GTM; `references/product-design-framework.md` Cannibalization Assessment | Risk table: Demand lower than projected / Operational delivery issues / Competitor response / Cannibalization / Timing/market conditions — each with Likelihood, Impact, Mitigation | IP2 |

### Inflection Point 2: Are We Committed to This Product Concept?

| Field | Details |
|---|---|
| **Inputs** | Selected concept from 3A (name, specs); 3B positioning statement; 3C pricing framework; 3D GTM phases; 3E impact projections; 3F risk table |
| **Outputs** | Concept Summary (selected concept, key specs, positioning statement); Confidence Assessment (4 domains: Product-market fit / Pricing viability / GTM readiness / Risk profile); Options table; AI Recommendation |
| **Decision Options** | COMMIT / ITERATE / PIVOT / SHELVE |
| **If COMMIT** | → Phase 4 CONFIRM (full deliverable production) |
| **If ITERATE** | → Refine one or more Phase 3 elements; re-surface IP2 |
| **If PIVOT** | → Reconsider core concept; loop back to Phase 3 (or Phase 2 if concept fundamentally changed) |
| **If SHELVE** | → Phase 4 CONFIRM (decision record with trigger conditions for restart) |

---

### Phase 4: CONFIRM

| Step | Inputs | Outputs | Feeds Into |
|---|---|---|---|
| 4.1 Product Design Brief | All Phase 3 outputs; 2B design persona; 2C whitespace positioning; foundation tier context | 9-section document: (1) Overview; (2) Target Audience; (3) Detailed Itinerary; (4) Component Specifications; (5) Pricing Framework; (6) Competitive Positioning; (7) USP and Key Messages; (8) Tone and Content Direction; (9) Brand Placement + cannibalization note | GitHub storage |
| 4.2 Market Validation Report | Stream 2A demand evidence; Stream 2C whitespace analysis; Stream 2B persona cards; Stream 2D feasibility; cannibalization assessment | 5-section report: (1) Demand Validation with confidence ratings; (2) Whitespace Analysis (landscape map + whitespace table + differentiation opportunities); (3) Persona Cards (one per persona, including deal-breakers and competitive alternatives); (4) Feasibility Assessment (8-dimension table with verdicts); (5) Cannibalization Analysis (risk level, affected products, estimated impact, mitigation) | GitHub storage |
| 4.3 Go-to-Market Playbook | 3D GTM strategy; 2B persona channel preferences; 1.3 success metrics | Channel strategy; content plan (formats, topics, publishing cadence); launch timeline (pre-launch → launch week → 90 days post); success metrics and measurement plan; 90-day monitoring plan | GitHub storage |
| 4.4 Pricing Analysis | 3C pricing framework | Price points with rationale; competitive comparison table; margin analysis; variant/tier structure; seasonal pricing logic | GitHub storage |
| 4.5 Decision Record | IP1 and IP2 decisions; all stream evidence | Standard decision record schema: YAML frontmatter (type, created, updated, confidence, status, initiative, tags) + narrative | `artifacts/decision-records/new-product-[name]-[YYYY-MM-DD].md` |
| 4.6 Store Artifacts | All 5 deliverables + persona and competitor files | GitHub commits to: `artifacts/personas/[persona-name].md`; `artifacts/competitors/[competitor-name]-[category].md`; `artifacts/decision-records/new-product-[name]-[YYYY-MM-DD].md`; `initiatives/active/new-product-[name].md` → `initiatives/closed/new-product-[name].md` | Index update; Memory pointer |
| 4.7 Memory Pointer | GitHub storage confirmation | Perplexity memory entry: `New Product Development — [Name]: [Decision]. [N] artifacts. Phase: [phase]. Stored at initiatives/[active\|closed]/new-product-[name].md` | — |
| 4.8 Update Index | Committed artifact paths | Updated rows in `intelligence/_index/personas.md`, `competitors.md`, `decision-records.md` | — |

---

## Dependency Graph

```
Step 0: State Detection
  ├── Repo scan (foundation, initiatives, personas, competitors, decision-records)
  ├── Index-accelerated lookup (_index/*.md)
  └── Prior REJECT decision scan (avoid repeating failed concepts)
         │
         ▼
Phase 1: FRAME
  ├── 1.1 Confidence Map (6 domains)
  ├── 1.2 Six FRAME Questions (conversational, one at a time)
  └── 1.3 Product Concept Brief (+ updated Confidence Map)
         │ User confirmation
         ▼
Phase 2: DISCOVER (5 parallel streams)
  ├── 2A Demand Validation ← MOST IMPORTANT (demand before design)
  │   ├── Internal: MySQL (direct, adjacent, amendment, negative signals (pymysql direct connection to `system_travelapp`))
  │   └── External: Web search (market size, social signals, travel trends, seasonality)
  │
  ├── 2B Audience Deep Dive
  │   ├── 2–4 Personas (with deal-breakers + competitive alternatives)
  │   └── Design persona identification (who we design FOR)
  │   (repo reuse if < 90 days)
  │
  ├── 2C Competitive Whitespace Analysis
  │   ├── 2C-1 Current Offerings Landscape Map (Web search)
  │   ├── 2C-2 Whitespace Identification Table
  │   └── 2C-3 Differentiation Opportunities (5 dimensions)
  │
  ├── 2D Feasibility Assessment
  │   ├── 8 dimensions (incl. Brand fit + Cannibalization risk)
  │   └── Overall Feasibility Verdict
  │   (foundation file required for brand fit and cannibalization)
  │
  └── 2E Cross-Initiative Intelligence (repo scan)
      └── Prior REJECT flags for related products
         │ (all streams feed into)
         ▼
[INFLECTION POINT 1: Should we build this?]
  ├── BUILD ──────────────────────────────────────────────────────┐
  ├── PIVOT → Clarify changes → loop relevant DISCOVER streams     │
  ├── SHELVE → Phase 4 (decision record) + close                  │
  └── REJECT → Phase 4 (decision record + rationale) + close      │
                                                                   ▼
                                                         Phase 3: DECIDE
                                                   (Most creative — iterations expected)
                                             ├── 3A Product Architecture (2–3 concepts)
                                             │   └── Iteration loop until concept selected
                                             ├── 3B Positioning + Messaging Framework
                                             ├── 3C Pricing Framework
                                             ├── 3D Go-to-Market Strategy (3 phases)
                                             ├── 3E Impact Projections (3 scenarios)
                                             └── 3F Risk Assessment (incl. cannibalization)
                                                                   │
                                                                   ▼
                                                   [INFLECTION POINT 2: Committed?]
                                                     ├── COMMIT ──────────────────┐
                                                     ├── ITERATE → refine, re-IP2  │
                                                     ├── PIVOT → back to Phase 3   │
                                                     └── SHELVE → Phase 4 (partial)│
                                                                                    ▼
                                                                          Phase 4: CONFIRM
                                                                    ├── 4.1 Product Design Brief (9 sections)
                                                                    ├── 4.2 Market Validation Report (5 sections)
                                                                    ├── 4.3 Go-to-Market Playbook
                                                                    ├── 4.4 Pricing Analysis
                                                                    ├── 4.5 Decision Record
                                                                    ├── 4.6 GitHub storage
                                                                    ├── 4.7 Memory pointer
                                                                    └── 4.8 Update _index files
```

---

## Artifact Registry

| Artifact | Path Pattern | Frontmatter Type | Depends On |
|---|---|---|---|
| Product Design Brief | Embedded in initiative record or standalone doc | `type: initiative` (primary output) | Phase 3A–3F; 2B design persona; 2C whitespace |
| Market Validation Report | Embedded in initiative record or standalone doc | `type: initiative` (primary output) | Streams 2A, 2B, 2C, 2D; cannibalization assessment |
| Go-to-Market Playbook | Embedded in initiative record or standalone doc | `type: initiative` (primary output) | Phase 3D; 2B persona channel preferences |
| Pricing Analysis | Embedded in initiative record or standalone doc | `type: initiative` (primary output) | Phase 3C; 2C competitor pricing |
| Persona Card | `artifacts/personas/[persona-name].md` | `persona` | Stream 2B; 2A adjacent signals cross-validation |
| Competitor Profile | `artifacts/competitors/[competitor-name]-[category].md` | `competitor` | Stream 2C; 2E cross-initiative reuse check |
| Decision Record | `artifacts/decision-records/new-product-[name]-[YYYY-MM-DD].md` | `decision-record` | IP1 and IP2 decisions; all stream evidence |
| Initiative State File | `initiatives/active/new-product-[name].md` → `initiatives/closed/new-product-[name].md` | `initiative` | Phase transitions; all artifact paths |
| Memory Index Entry | `intelligence/_index/[category].md` | — (markdown table row) | All committed artifacts |
