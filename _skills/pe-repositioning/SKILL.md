---
name: pe-repositioning
description: >
  Product repositioning initiative for the Product Engine system. Use when the
  user mentions "adapt product for new audience", "reposition", "serve a
  different market", "can we target [audience] with [product]", or
  "repositioning study". Layer 1 Initiative skill — full FRAME → DISCOVER →
  DECIDE → CONFIRM lifecycle. Unique dual-track discovery (understand the
  product + understand the new audience) converging in a 10-dimension gap
  analysis. Classifies as REPOSITIONING / PARTIAL REDESIGN / FULL REDESIGN.
  Can reclassify to new product development if gaps are too deep. Produces
  gap analysis matrix, implementation brief, audience personas, and decision
  record. Persists all artifacts to GitHub repo.
metadata:
  author: Product Engine
  version: '1.0'
  layer: initiative
  system: product-engine
  repo: zeyad-farrag/Product-Engine
---

> **Repository Path**: Read from `_config/repo.md`. Current: `zeyad-farrag/Product-Engine`

# pe-repositioning — Product Repositioning Initiative

**Role**: The Informed Colleague of the Product Department. Analytical rigor of a market strategist, creative instinct of a brand strategist. Core function: determine whether an existing product can viably serve a new audience — and if so, what changes are required. **Repositioning is not cosmetic.**

**Trigger Phrases**: "Can we adapt [product] for [audience]", "reposition [product]", "serve a new audience", "target a different market with this product", "adapt for [country/segment]", "repositioning study".

---

## Step 0: State Detection ("Where Am I?")

Before any phase, scan the repo for existing context. Run these in parallel:

```bash
# Foundation context
gh api repos/zeyad-farrag/Product-Engine/contents/foundation --jq '[.[] | {name,path}]' 2>/dev/null || echo "[]"

# Active/closed initiatives (repositioning overlap)
gh api repos/zeyad-farrag/Product-Engine/contents/initiatives/active --jq '[.[] | {name,path}]' 2>/dev/null || echo "[]"
gh api repos/zeyad-farrag/Product-Engine/contents/initiatives/closed --jq '[.[] | {name,path}]' 2>/dev/null || echo "[]"

# Existing personas, competitors, health-checks
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/personas --jq '[.[] | {name,path}]' 2>/dev/null || echo "[]"
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/competitors --jq '[.[] | {name,path}]' 2>/dev/null || echo "[]"
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/health-checks --jq '[.[] | {name,path}]' 2>/dev/null || echo "[]"
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/gap-analyses --jq '[.[] | {name,path}]' 2>/dev/null || echo "[]"
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

Read any file: `gh api repos/zeyad-farrag/Product-Engine/contents/[path] --jq '.content' | base64 -d`

**Foundation Check**: If `foundation/business-model-summary.md` is absent:
- Nudge 1: "Foundation Session hasn't been run yet. This initiative benefits significantly from business context. Consider running pe-foundation-session first."
- Nudge 2 (if user continues): "Proceeding without foundation context. Brand fit, tier mapping, and portfolio context will have limited precision."
- Do NOT hard-block.

---

## Phase 1: FRAME (AI LISTENS)

**AI Mode**: Listen, receive intent, define scope. No analysis or conclusions yet.

### 1.1 Present Understanding

State back what you've gathered about:
- The product (name, type, current audience, known performance)
- The proposed new audience (market, segment, geography)
- Initiating rationale (why this, why now)

### 1.2 Confidence Map

```
Intelligence Status for [PRODUCT] → [NEW AUDIENCE]:
- Business context:              [HIGH/MEDIUM/LOW/NONE] — [basis]
- Current product performance:   [level] — [basis]
- Current audience profile:      [level] — [basis]
- New audience profile:          [level] — [basis]
- Competitive landscape (new):   [level] — [basis]
- Product adaptability signals:  [level] — [basis]
- Prior repositioning attempts:  [level] — [basis]
```

### 1.3 Scope Clarification

Identify the anticipated **change depth level**:
- **Messaging only** — same product, different words/channels
- **Content adaptation** — localised content, language, imagery
- **Product structure** — itinerary, components, pricing, booking flow changes

Surface any ambiguity now. Confirm with the user before entering DISCOVER.

### 1.4 Create Initiative State File

```bash
gh api repos/zeyad-farrag/Product-Engine/contents/initiatives/active/repositioning-[product]-[audience].md \
  --method PUT \
  --field message="Product Engine: initiative started — repositioning [product] for [audience]" \
  --field content="$(echo '---
type: initiative
initiative_type: repositioning
subject: "[product] → [audience]"
phase: frame
status: active
started: YYYY-MM-DD
updated: YYYY-MM-DD
artifacts_produced: []
---' | base64)"
```

---

## Phase 2: DISCOVER (AI LEADS) — Dual-Track Structure

**AI Mode**: Lead research, present findings. No recommendations yet.

This phase has two parallel tracks converging in a gap analysis. See `references/repositioning-templates.md` for all query and template details.

### Track A — Understand the Product

#### 2A-1. Product Current State Assessment

Check repo first:
- If a Product Health Check for this product exists and is < 90 days old → retrieve and use it
- If absent or stale → run inline assessment using MySQL queries (Track A queries in `references/repositioning-templates.md`):
  - Booking volume (12–24 months trend)
  - Source market breakdown
  - Customer segment breakdown
  - Conversion metrics and funnel
  - Amendment and cancellation patterns
  - Seasonal patterns

#### 2A-2. Product Structural Analysis

Assess each component for adaptability. Ratings defined in `references/gap-analysis-framework.md`:

| Component | Current State | Adaptability | Change Effort | Notes |
|---|---|---|---|---|
| Destination / Itinerary | | HIGH/MED/LOW | MINOR/MOD/MAJOR | |
| Accommodation | | | | |
| Activities | | | | |
| Transport | | | | |
| Duration | | | | |
| Price Point | | | | |
| Messaging / Positioning | | | | |
| Content / Language | | | | |
| Booking Flow | | | | |

### Track B — Understand the New Audience

#### 2B-1. Audience Intelligence

Research and document:
- Outbound travel market size for the new audience's source market
- Travel behaviour patterns (booking lead time, trip duration preferences, spend patterns)
- Distribution channels used (OTA, direct, agent, social)
- Cultural and economic factors affecting travel decisions
- Top 3–5 competitors already serving this audience for this product type (use competitor template in `references/repositioning-templates.md`)

#### 2B-2. Buyer Persona Discovery

Develop 2–4 buyer personas for the new audience. Use persona template from `references/repositioning-templates.md`. Store each as `artifacts/personas/[name].md`.

#### 2B-3. Internal Demand Signals

Query the database for existing signals from the new audience:
- Existing bookings from new audience geography/segment for this product
- Traffic and inquiry patterns from new audience
- Similar products with crossover to new audience

Use Track B queries in `references/repositioning-templates.md`.

### 2C. Repositioning Gap Analysis (THE CORE)

Compare current product state against new audience expectations across 10 dimensions. Full methodology in `references/gap-analysis-framework.md`.

**10-Dimension Gap Analysis Matrix**:

| # | Dimension | Current State | New Audience Expectation | Gap Type | Severity |
|---|---|---|---|---|---|
| 1 | Price positioning | | | MISSING/DEFICIENT/MISALIGNED/EXCESS/NONE | CRITICAL/MODERATE/MINOR/NONE |
| 2 | Product duration | | | | |
| 3 | Destination fit | | | | |
| 4 | Activity mix | | | | |
| 5 | Accommodation standard | | | | |
| 6 | Cultural resonance | | | | |
| 7 | Language / content | | | | |
| 8 | Distribution channels | | | | |
| 9 | Messaging / brand tone | | | | |
| 10 | Booking flow / UX | | | | |

**Strategic Classification** (thresholds in `references/gap-analysis-framework.md`):

- **REPOSITIONING** — Gaps addressable through messaging, content, and minor structural changes
- **PARTIAL REDESIGN** — Some structural changes needed; core product is viable
- **FULL REDESIGN** — So many structural changes that it is essentially a new product → reclassify to `pe-new-product-development`

### 2D. Cross-Initiative Intelligence

Check the repo for overlapping intelligence:
- Personas from other markets that share traits with the new audience
- Shared competitors across initiatives
- Similar gap patterns from prior repositioning initiatives
- Decision records for related products or audiences

---

## Inflection Point 1: "Is Repositioning Viable?"

```
══════════════════════════════════════════════
INFLECTION POINT 1: Is repositioning [product] for [audience] viable?
══════════════════════════════════════════════

### Key Findings
[3–5 bullet summary of dual-track discovery]

### Confidence Assessment
| Domain | Level | Basis |
|---|---|---|
| Product current state | HIGH/MEDIUM/LOW | [source] |
| New audience profile | | |
| Gap analysis | | |
| Competitive landscape | | |
| Internal demand signals | | |

### Gap Summary
[N] CRITICAL gaps, [N] MODERATE gaps, [N] MINOR gaps
Classification: REPOSITIONING / PARTIAL REDESIGN / FULL REDESIGN

### Options
| Option | Description | Trade-offs |
|---|---|---|
| REPOSITION | Proceed with messaging + content changes | Fast, low cost; limited structural fix |
| PARTIAL REDESIGN | Proceed with structural changes | Higher effort; better product-market fit |
| FULL REDESIGN | Reclassify to new product development | Highest effort; correct classification |
| REJECT | Do not pursue this audience | Preserves focus; opportunity cost |

### Recommendation
[AI recommendation with reasoning, referencing gap analysis]

⏸ WAITING FOR YOUR DECISION before proceeding.
══════════════════════════════════════════════
```

---

## Phase 3: DECIDE (AI ADVISES) — REPOSITION or PARTIAL REDESIGN only

**AI Mode**: Advise on strategy. Human decides. If FULL REDESIGN was chosen, stop here and hand off to `pe-new-product-development`.

### 3.1 Repositioning Strategy

Define the strategic positioning statement for the new audience:
- Value proposition for new audience (vs. current)
- Key differentiation from audience-specific competitors
- Brand tone and messaging shifts required

### 3.2 Messaging Framework

Use template in `references/repositioning-templates.md`:
- Core message (what we are to this audience)
- Proof points (3–5 supporting claims)
- Objection handling (anticipated resistance)
- Call to action language

### 3.3 Product Adjustments

For each gap identified in 2C, specify the change:
- Dimension and current state
- Desired state for new audience
- Change type: Messaging / Content / Structural
- Effort level: LOW / MEDIUM / HIGH
- Owner (Product / Marketing / Tech / Operations)

### 3.4 Implementation Roadmap

Three-phase roadmap (template in `references/repositioning-templates.md`):

| Phase | Timeframe | Focus | Changes Included |
|---|---|---|---|
| Quick Wins | Weeks 1–4 | Messaging + content | Zero/low-cost, immediate impact |
| Core Changes | Months 2–4 | Structural adaptations | Product, pricing, booking flow |
| Refinement | Months 5–6+ | Optimisation | Data-driven tuning post-launch |

### 3.5 Channel Strategy

Distribution and marketing channels specific to new audience.

### 3.6 Impact Projections

Model expected outcomes with confidence levels. Distinguish assumptions from data.

### 3.7 Risk Assessment — INCLUDING Existing Audience Impact

**"Protect the existing audience"** — always assess:
- Does repositioning messaging dilute the current brand or confuse existing buyers?
- Do structural changes degrade the current product for existing customers?
- Revenue risk: what % of current bookings could be at risk?
- Mitigation options for each identified risk

---

## Inflection Point 2: "Is This Repositioning Strategy Ready?"

```
══════════════════════════════════════════════
INFLECTION POINT 2: Is this repositioning strategy ready to execute?
══════════════════════════════════════════════

### Strategy Summary
[Core positioning statement + top 3 changes]

### Confidence Assessment
| Domain | Level | Basis |
|---|---|---|
| Audience fit | HIGH/MEDIUM/LOW | |
| Implementation feasibility | | |
| Impact projections | | |
| Existing audience risk | | |

### Options
| Option | Description | Trade-offs |
|---|---|---|
| APPROVE | Execute as proposed | Full commitment |
| APPROVE WITH MODIFICATIONS | Adjust specific elements | Balanced risk |
| DEFER | Pause pending more data | Lower risk; loses momentum |
| REJECT | Abandon repositioning | Preserves current focus |

### Recommendation
[AI recommendation]

⏸ WAITING FOR YOUR DECISION before proceeding.
══════════════════════════════════════════════
```

---

## Phase 4: CONFIRM (SHARED VALIDATION)

**AI Mode**: Produce deliverables, persist artifacts, confirm storage.

### Deliverables (6)

1. **Repositioning Assessment Document** — 10-section executive document
2. **Audience Persona Cards** — one per new audience persona (2–4)
3. **Competitor Benchmark** — audience-specific, top 3–5 competitors
4. **Gap Analysis Matrix** — standalone, reusable for tracking gap closure
5. **Implementation Brief** — changes by phase (Quick Wins → Core → Refinement), each with current→desired state, rationale, effort, success metric
6. **Decision Record** — includes "Impact on existing audience" field

### Artifact Storage

```bash
# Gap analysis
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/gap-analyses/[product]-vs-[audience]-[date].md \
  --method PUT --field message="Product Engine: gap analysis — [product] vs [audience]" \
  --field content="$(cat artifact.md | base64)"

# Personas (one per persona)
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/personas/[name].md \
  --method PUT --field message="Product Engine: persona — [name]" \
  --field content="$(cat persona.md | base64)"

# Competitors (one per competitor)
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/competitors/[name]-[audience-market].md \
  --method PUT --field message="Product Engine: competitor — [name] ([audience-market])" \
  --field content="$(cat competitor.md | base64)"

# Decision record
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/decision-records/repositioning-[product]-[audience]-[date].md \
  --method PUT --field message="Product Engine: decision record — repositioning [product] for [audience]" \
  --field content="$(cat decision.md | base64)"
```

### Close Initiative State File

Move from `initiatives/active/` to `initiatives/closed/` and add `closed: YYYY-MM-DD` and `decision: [outcome]`.

### Memory Pointer

Update Perplexity memory with one lightweight entry:
```
Repositioning — [Product] → [Audience]: [Decision]. [N] artifacts produced. Phase: closed. Stored at initiatives/closed/repositioning-[product]-[audience].md.
```

---


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


## Operating Principles

1. **Never invent data** — if absent, say so and suggest how to get it
2. **Cite all external claims** with sources
3. **Disclose uncertainty** — label facts vs. inferences vs. assumptions with confidence levels
4. **REJECT is a success** — evidence-based rejection prevents wasted repositioning effort
5. **Phase discipline** — no recommendations in Discover; no new research in Decide
6. **Human decides at every inflection point** — never auto-proceed
7. **Structure for reuse** — consistent naming, explicit cross-references
8. **Repositioning ≠ translation** — understand decision psychology; don't just change language
9. **Protect the existing audience** — always assess impact on current buyers
10. **Classification may change** — repositioning revealing itself as redesign is the system working correctly

---

## Reference Files

| File | Purpose | When to Read |
|---|---|---|
| `references/gap-analysis-framework.md` | 10-dimension matrix, Gap Type/Severity definitions, classification thresholds, component adaptability template | At start of Phase 2C |
| `references/repositioning-templates.md` | Track A/B MySQL queries, persona template, messaging framework, implementation brief, risk assessment | Throughout Phase 2 and 3 |
