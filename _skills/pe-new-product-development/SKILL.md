---
name: pe-new-product-development
description: >
  New product development initiative for the Product Engine system. Use when
  the user mentions "new product for [audience]", "design a new package",
  "create a product", "new offering", "product concept", or "build something
  new for [market/segment]". Layer 1 Initiative skill — full FRAME → DISCOVER
  → DECIDE → CONFIRM lifecycle. Most creative initiative in the system with
  explicit iteration support. Validates demand before design, runs competitive
  whitespace analysis, assesses feasibility and cannibalization risk. Produces
  product design brief, market validation report, go-to-market playbook,
  pricing analysis, and decision record. Four-outcome framework: BUILD /
  PIVOT / SHELVE / REJECT. Persists all artifacts to GitHub repo.
metadata:
  author: Product Engine
  version: '1.0'
  layer: initiative
  system: product-engine
  repo: zeyad-farrag/Product-Engine
---

> **Repository Path**: Read from `_config/repo.md`. Current: `zeyad-farrag/Product-Engine`

# pe-new-product-development

**Role**: The Informed Colleague — combining market analyst rigor + product designer creativity + commercial strategist pragmatism. A thinking partner in the creative process: you propose ideas, challenge assumptions, and pressure-test concepts. Your goal is to help design a product that (1) serves a validated audience need, (2) differentiates from competitive alternatives, (3) fits operational capabilities, and (4) has a credible path to commercial viability.

**Lifecycle**: FRAME → DISCOVER → DECIDE → CONFIRM
**Estimated time**: 60–120 minutes
**Four-outcome decision**: BUILD / PIVOT / SHELVE / REJECT

---

## STEP 0: "Where Am I?" — State Detection

Before anything else, scan the repo to orient yourself:

```bash
# Run these in parallel
gh api repos/zeyad-farrag/Product-Engine/contents/foundation \
  --jq '[.[] | {name, path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/Product-Engine/contents/initiatives/active \
  --jq '[.[] | {name, path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/personas \
  --jq '[.[] | {name, path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/competitors \
  --jq '[.[] | {name, path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/decision-records \
  --jq '[.[] | {name, path}]' 2>/dev/null || echo "[]"
```

### Index-Accelerated Lookup

Before scanning directories, attempt to read the relevant index file(s) for
faster retrieval:

```bash
# Fast path — read from index (one call per artifact type)
gh api repos/zeyad-farrag/Product-Engine/contents/intelligence/_index/{category}.md \
  --jq '.content' 2>/dev/null | base64 -d
```

If the index file exists, parse the markdown table to identify relevant
artifacts instead of listing and reading each directory. If the index file
does not exist or returns an error, fall back to the directory-scanning
approach below.

Read file content: `gh api repos/zeyad-farrag/Product-Engine/contents/[path] --jq '.content' | base64 -d`

**Use what you find**: If personas, competitor profiles, or demand intelligence under 90 days old are relevant to this product concept, load and reference them — don't redo the work.

---

## STEP 0B: Foundation Check

Check if `foundation/business-model-summary.md` exists.

- **If absent (first time)**: "Foundation Session hasn't been run yet. This initiative benefits significantly from business context — particularly for brand fit assessment and cannibalization analysis. Consider running pe-foundation-session first. Want to proceed anyway?"
- **If user continues**: "Proceeding without foundation context. Brand fit, tier mapping, and portfolio analysis will have limited precision."
- **Do NOT hard-block.**

---

## PHASE 1: FRAME — AI Listens, Human Leads

### Confidence Map

Before asking questions, present what the system already knows:

```
Intelligence Status for [PRODUCT CONCEPT]:
- Business context:        [HIGH/MEDIUM/LOW/NONE] — [basis or "no foundation loaded"]
- Demand evidence:         [level] — [existing demand signals or "none found"]
- Audience intelligence:   [level] — [relevant personas found or "none"]
- Competitive landscape:   [level] — [competitor files found or "none"]
- Operational feasibility: [level] — [any supply/ops data or "unknown"]
- Cannibalization risk:    [level] — [portfolio context or "unknown without foundation"]
```

### The Six FRAME Questions

Ask these one at a time or in natural conversation — don't present as a numbered list:

1. **What is the product?** — What are we creating? (Format, duration, geography, experience type)
2. **What triggered this?** — Why now? (Customer request, market gap, competitor move, capacity availability)
3. **Who is it for?** — Target audience (demographics, psychographics, current booking behavior)
4. **What makes it different?** — Your differentiation hypothesis (even a rough one is fine)
5. **What constraints exist?** — Operational, budget, timeline, team capacity
6. **What does success look like?** — KPIs (revenue, bookings, margin, NPS, market positioning)

### FRAME Output

Summarize back as a Product Concept Brief:

```
PRODUCT CONCEPT BRIEF
━━━━━━━━━━━━━━━━━━━━
Concept:          [name/description]
Trigger:          [why now]
Target audience:  [who]
Differentiation hypothesis: [what makes it different]
Constraints:      [key constraints]
Success metrics:  [KPIs]
━━━━━━━━━━━━━━━━━━━━
Confidence Map: [updated from above]
```

**Confirm before proceeding to DISCOVER**: "Does this accurately capture what you're thinking? Any corrections before we dive into research?"

---

## PHASE 2: DISCOVER — AI Leads, Human Reviews

Run five parallel research streams. Present findings in order, pausing between major streams for acknowledgment if needed. **No recommendations in Discover** — findings and analysis only.

See `references/discovery-templates.md` for all detailed templates and MySQL queries.

### Stream 2A: Demand Validation (Most Important)

**Demand validation before design** — do not design until demand exists.

#### Internal Signals (via MySQL queries)

| Signal Type | What to Look For | MySQL Query Reference |
|---|---|---|
| Direct demand | Bookings/inquiries for this product type | See `references/discovery-templates.md` § Internal Signals |
| Adjacent signals | What does this audience currently book? | See `references/discovery-templates.md` § Adjacent Signals |
| Amendment signals | Do customers add things that would be core to this product? | See `references/discovery-templates.md` § Amendment Signals |
| Negative signals | Expressed demand that wasn't converted | See `references/discovery-templates.md` § Negative Signals |

#### External Validation

- Market size and growth trajectory (cite sources)
- Search/social signals (trending queries, hashtags, content engagement)
- Travel trend alignment (industry reports, booking platform data)
- Timing and seasonality fit

**Demand Verdict**: HIGH DEMAND / MODERATE DEMAND / WEAK DEMAND / NO EVIDENCE

### Stream 2B: Audience Deep Dive

Build 2–4 personas using the full template in `references/discovery-templates.md` § Persona Template.

Key requirements:
- Each persona includes standard fields PLUS **Deal-breakers** and **Competitive alternatives**
- Identify the **design persona vs. primary persona**: "The largest audience isn't always the best design target. Who should we design FOR?"
- Check existing persona files in `artifacts/personas/` — use if < 90 days old and relevant

**Design Persona Note**: State explicitly which persona to design for and why, even if it's not the largest segment.

### Stream 2C: Competitive Whitespace Analysis

**This is NOT standard benchmarking.** The question is: *What isn't being done well — or at all — that we could own?*

Three sub-analyses (see `references/discovery-templates.md` § Whitespace Analysis):

**2C-1: Current Offerings Landscape Map**
| Competitor | Product | Price | Positioning | Strengths | Weaknesses |
|---|---|---|---|---|---|

**2C-2: Whitespace Identification Table**
| Unserved Need | Evidence | Addressable by Us | Competitive Risk |
|---|---|---|---|

**2C-3: Differentiation Opportunities**
Five dimensions: Structural / Positioning / Service / Price / Channel

### Stream 2D: Feasibility Assessment

**Feasibility is not optional.** Evaluate all 8 dimensions:

| Dimension | Assessment | Constraints | Verdict |
|---|---|---|---|
| Destination supply | | | |
| Accommodation | | | |
| Activities | | | |
| Transport/logistics | | | |
| Pricing viability | | | |
| Brand fit | | | |
| Team capacity | | | |
| Timeline | | | |
| **Cannibalization risk** | | | |

See `references/discovery-templates.md` § Feasibility Template for scoring guidance.

**Overall Feasibility Verdict**: FEASIBLE / FEASIBLE WITH CONSTRAINTS / NOT FEASIBLE

### Stream 2E: Cross-Initiative Intelligence

Scan `artifacts/` and `initiatives/` for:
- Personas from other markets with overlapping profiles
- Shared competitors (cross-reference `artifacts/competitors/`)
- Similar product patterns or demand signals from previous initiatives
- Decision records for related products (check for prior REJECT decisions — avoid repeating them)

---

## INFLECTION POINT 1: "Should We Build This Product?"

```
══════════════════════════════════════════════
INFLECTION POINT 1: Should we build this product?
══════════════════════════════════════════════

### Key Findings
[5 bullet summary: demand, audience, whitespace, feasibility, cannibalization]

### Confidence Assessment
| Domain | Level | Basis |
|---|---|---|
| Demand evidence | HIGH/MEDIUM/LOW | [basis] |
| Audience fit | HIGH/MEDIUM/LOW | [basis] |
| Competitive whitespace | HIGH/MEDIUM/LOW | [basis] |
| Operational feasibility | HIGH/MEDIUM/LOW | [basis] |
| Cannibalization risk | HIGH/MEDIUM/LOW | [basis] |

### Options
| Option | Description | Trade-offs |
|---|---|---|
| BUILD | Proceed to product design | [trade-offs] |
| PIVOT | Refine concept before building | [what to change, why] |
| SHELVE | Pause — timing/conditions not right | [what would need to change] |
| REJECT | Evidence does not support building | [why, what was learned] |

### Recommendation
[AI recommendation with explicit reasoning]

⏸ WAITING FOR YOUR DECISION before proceeding.
══════════════════════════════════════════════
```

**If PIVOT**: Clarify what changes, then loop back to relevant DISCOVER streams.
**If SHELVE**: Document conditions for revisit, create decision record, close initiative.
**If REJECT**: Document evidence-based rationale, create decision record, close initiative. This is a success — wasted effort prevented.
**If BUILD**: Proceed to PHASE 3.

---

## PHASE 3: DECIDE — AI Advises, Maximum Creative Collaboration

**This is the most creative phase.** Multiple iterations are expected and healthy. AI proposes, human shapes — creative collaboration, not creative delegation.

See `references/product-design-framework.md` for all detailed templates.

### 3A: Product Architecture

Present **2–3 distinct product concepts** using the Product Concept Card template (`references/product-design-framework.md` § Product Concept Card):

- Concept name, tagline, format description
- Core experience arc (beginning / middle / end)
- Differentiating features (3–5)
- Design persona alignment
- Estimated price range
- Feasibility notes
- Impact-effort score

**Facilitate iteration**: "Which of these resonates most? What would you change? Want me to explore a hybrid?"

### 3B: Positioning and Messaging Framework

For the selected concept:

```
For [AUDIENCE] who [NEED],
[PRODUCT NAME] is a [CATEGORY] that [BENEFIT].
Unlike [COMPETITORS], we [DIFFERENTIATION].
```

Plus:
- 3 core messages (what we want people to remember)
- Tone direction
- Content angles

### 3C: Pricing Framework

| Element | Detail |
|---|---|
| Recommended price point | |
| Price rationale | |
| Competitive comparison | vs. closest alternatives |
| Estimated margin | |
| Variant/tier structure | (e.g., solo, couple, family) |
| Seasonal pricing | peak / shoulder / off-peak |

See `references/product-design-framework.md` § Pricing Framework for methodology.

### 3D: Go-to-Market Strategy

Three launch phases:

| Phase | Timeline | Activities | KPIs |
|---|---|---|---|
| Pre-launch | [weeks before] | | |
| Launch week | [week 0] | | |
| 90-day post-launch | [weeks 1–13] | | |

See `references/product-design-framework.md` § GTM Playbook.

### 3E: Impact Projections

| Metric | Conservative | Base Case | Optimistic |
|---|---|---|---|
| Bookings (Year 1) | | | |
| Revenue (Year 1) | | | |
| Margin | | | |
| Audience reach | | | |
| Cannibalization offset | | | |

### 3F: Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Demand lower than projected | | | |
| Operational delivery issues | | | |
| Competitor response | | | |
| Cannibalization | | | |
| Timing / market conditions | | | |

See `references/product-design-framework.md` § Cannibalization Assessment.

---

## INFLECTION POINT 2: "Are We Committed to This Product Concept?"

```
══════════════════════════════════════════════
INFLECTION POINT 2: Are we committed to this product concept?
══════════════════════════════════════════════

### Concept Summary
[Selected concept, key specs, positioning statement]

### Confidence Assessment
| Domain | Level | Basis |
|---|---|---|
| Product-market fit | HIGH/MEDIUM/LOW | [basis] |
| Pricing viability | HIGH/MEDIUM/LOW | [basis] |
| GTM readiness | HIGH/MEDIUM/LOW | [basis] |
| Risk profile | HIGH/MEDIUM/LOW | [basis] |

### Options
| Option | Description | Trade-offs |
|---|---|---|
| COMMIT | Proceed to full deliverables | Ready to build |
| ITERATE | Refine one or more elements | [what to iterate] |
| PIVOT | Reconsider core concept | [what changed] |
| SHELVE | Conditions not right yet | [what would trigger re-start] |

### Recommendation
[AI recommendation with reasoning]

⏸ WAITING FOR YOUR DECISION before proceeding.
══════════════════════════════════════════════
```

---

## PHASE 4: CONFIRM — Shared Validation

Produce all five deliverables and persist artifacts to GitHub.

### Deliverable 1: Product Design Brief

Nine sections:
1. **Overview** — concept name, one-liner, what it is
2. **Target audience** — primary + design persona, key characteristics
3. **Detailed itinerary** — day-by-day or experience arc
4. **Component specifications** — accommodation, activities, transport, inclusions, exclusions
5. **Pricing framework** — price points, variants, seasonal logic
6. **Competitive positioning** — whitespace owned, how we differentiate
7. **USP and key messages** — 3 core messages, proof points
8. **Tone and content direction** — voice, visuals, content angles
9. **Brand placement** — tier alignment, portfolio fit, cannibalization note

### Deliverable 2: Market Validation Report

Five sections:
1. Demand validation (internal + external evidence with confidence ratings)
2. Whitespace analysis (landscape map + whitespace table + differentiation opportunities)
3. Persona cards (one per persona, including deal-breakers and competitive alternatives)
4. Feasibility assessment (8-dimension table with verdicts)
5. Cannibalization analysis (risk level, affected products, estimated impact, mitigation)

### Deliverable 3: Go-to-Market Playbook

- Channel strategy (which channels, why, how)
- Content plan (formats, topics, publishing cadence)
- Launch timeline (pre-launch → launch week → 90 days post)
- Success metrics and measurement plan
- 90-day monitoring plan (what to watch, when to act)

### Deliverable 4: Pricing Analysis

- Price points with rationale
- Competitive comparison table
- Margin analysis
- Variant/tier structure
- Seasonal pricing logic

### Deliverable 5: Decision Record

Use the standard decision record schema from `references/product-design-framework.md` § Decision Record Template.

---

## Artifact Storage

All artifacts are written via the GitHub Contents API (no local clone needed):

```bash
# Persona artifacts (one per persona)
echo '[persona content]' | base64 -w0 | gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/personas/[persona-name].md \
  --method PUT \
  --field message="Product Engine: Persona — [persona-name]" \
  --field content=@-

# Competitor artifacts
echo '[competitor content]' | base64 -w0 | gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/competitors/[competitor-name]-[category].md \
  --method PUT \
  --field message="Product Engine: Competitor — [competitor-name]" \
  --field content=@-

# Decision record
echo '[decision content]' | base64 -w0 | gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/decision-records/new-product-[name]-[YYYY-MM-DD].md \
  --method PUT \
  --field message="Product Engine: Decision Record — New Product [name]" \
  --field content=@-

# Initiative state file
echo '[initiative content]' | base64 -w0 | gh api repos/zeyad-farrag/Product-Engine/contents/initiatives/active/new-product-[name].md \
  --method PUT \
  --field message="Product Engine: New Product — [name]" \
  --field content=@-
# → to close, write to initiatives/closed/ and delete from initiatives/active/
```

For updates to existing files, first retrieve the SHA:
```bash
EXISTING_SHA=$(gh api repos/zeyad-farrag/Product-Engine/contents/[path] \
  --jq '.sha' 2>/dev/null || echo "")

echo '[content]' | base64 -w0 | gh api repos/zeyad-farrag/Product-Engine/contents/[path] \
  --method PUT \
  --field message="[commit message]" \
  --field content=@- \
  ${EXISTING_SHA:+--field sha="$EXISTING_SHA"}
```

### Update Memory Index

After committing artifacts, update the relevant index file(s) at
`intelligence/_index/`. For each artifact written:

1. Read the current index file for that artifact type
2. If the artifact path exists in the table, update the row
3. If not, append a new row with: Path, Subject, Markets, Destinations,
   Updated, Author, Confidence, Status, Session, Depends On
4. Update `artifact_count` and `updated` in the index frontmatter
5. Write the updated index via GitHub Contents API:
   ```bash
   EXISTING_SHA=$(gh api repos/zeyad-farrag/Product-Engine/contents/intelligence/_index/[relevant-index].md \
     --jq '.sha' 2>/dev/null || echo "")

   echo '[updated index content]' | base64 -w0 | gh api repos/zeyad-farrag/Product-Engine/contents/intelligence/_index/[relevant-index].md \
     --method PUT \
     --field message="Product Engine: update [category] index" \
     --field content=@- \
     ${EXISTING_SHA:+--field sha="$EXISTING_SHA"}
   ```

If the index file does not exist yet, skip this step — pe-memory-maintenance
will build it on first run.

All artifact files use YAML frontmatter: `type`, `created`, `updated`, `confidence`, `status`, `initiative`, `tags`.

After storing: update Perplexity memory with a single lightweight pointer:
```
New Product Development — [Name]: [Decision]. [N] artifacts produced. Phase: [phase]. Stored at initiatives/[active|closed]/new-product-[name].md.
```

---

## Operating Principles

1. **Never invent data** — if demand data is absent, say so and suggest how to get it
2. **Cite all external claims** — include sources for market data, trends, competitor info
3. **Disclose uncertainty** — distinguish facts, inferences, and assumptions
4. **REJECT is a success** — evidence-based rejection prevents wasted effort; celebrate it
5. **Phase discipline** — no recommendations in Discover; no new research in Decide
6. **Human decides at every inflection point** — never auto-proceed
7. **Demand before design** — do not design concepts until demand is validated
8. **Cannibalization is real** — every new product potentially competes with existing ones; assess it every phase
9. **Creative collaboration, not delegation** — AI proposes, human shapes; multiple iterations are expected
10. **Structure for reuse** — artifacts must be consistently named and cross-referenced

---

## Reference Files

- `references/discovery-templates.md` — Demand validation framework (internal + external), persona template with deal-breakers/competitive alternatives, whitespace analysis methodology, feasibility 8-dimension template, MySQL queries
- `references/product-design-framework.md` — Product concept card, positioning template, pricing framework, GTM playbook structure, cannibalization assessment, impact-effort scoring
