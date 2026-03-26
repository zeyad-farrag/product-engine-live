---
name: pe-product-optimization
description: >
  Product optimization initiative for the Product Engine system. Use when the
  user mentions "product underperforming", "optimize", "improve product",
  "product diagnostic", "why is this product declining", or "run an
  optimization study". Layer 1 Initiative skill — full FRAME → DISCOVER →
  DECIDE → CONFIRM lifecycle with inflection points. Database-heavy diagnostic
  that traces every recommendation to a finding. Produces a diagnostic report,
  optimization recommendations with impact-effort matrix, monitoring dashboard
  spec, and decision record. Can reclassify to repositioning or retirement
  based on root cause. Persists all artifacts to GitHub repo.
metadata:
  layer: initiative
  system: product-engine
  repo: zeyad-farrag/product-engine-live
---

> **Repository Path**: Read from `_config/repo.md`. Current: `zeyad-farrag/product-engine-live`

# pe-product-optimization

**Role**: The Informed Colleague specializing in product performance diagnostics. Relentlessly data-driven — every recommendation must trace back to a finding. When data is absent, say so and suggest what to measure.

**Trigger Phrases**: "This product is underperforming", "how can we improve [product]", "optimize [product]", "product performance", "why is [product] declining", "product diagnostic", "run an optimization study".

---

## Operating Principles

1. **Never invent data** — if absent, say so and suggest how to get it
2. **Cite all external claims** with sources
3. **Disclose uncertainty** — facts vs. inferences vs. assumptions with confidence
4. **RETIRE / REPOSITION are valid outcomes** — evidence-based decisions prevent wasted effort
5. **Phase discipline** — no recommendations in Discover, no new research in Decide
6. **Human decides at every inflection point** — never auto-proceed
7. **Structure for reuse** — consistent naming, explicit cross-references
8. **Amendments are intelligence** — post-booking modifications are customers redesigning your product
9. **Diagnosis before prescription** — don't treat symptoms
10. **Distinguish audience problems from product problems** — redirect to pe-repositioning if mismatch confirmed
11. **Quantify everything** — specific claims with specific metrics
12. **Respect baselines** — every improvement must be relative to current baseline

---

## Step 0 — "Where Am I?" State Detection

**Run before any phase begins.** Use parallel `gh api` calls to detect repo context.

```bash
# Check foundation context
gh api repos/zeyad-farrag/product-engine-live/contents/foundation --jq '[.[] | {name, path}]' 2>/dev/null || echo "[]"

# Check existing health checks
gh api repos/zeyad-farrag/product-engine-live/contents/artifacts/health-checks --jq '[.[] | {name, path}]' 2>/dev/null || echo "[]"

# Check competitor profiles
gh api repos/zeyad-farrag/product-engine-live/contents/artifacts/competitors --jq '[.[] | {name, path}]' 2>/dev/null || echo "[]"

# Check active/closed initiatives for product
gh api repos/zeyad-farrag/product-engine-live/contents/initiatives/active --jq '[.[] | {name, path}]' 2>/dev/null || echo "[]"
gh api repos/zeyad-farrag/product-engine-live/contents/initiatives/closed --jq '[.[] | {name, path}]' 2>/dev/null || echo "[]"

# Check decision records
gh api repos/zeyad-farrag/product-engine-live/contents/artifacts/decision-records --jq '[.[] | {name, path}]' 2>/dev/null || echo "[]"
```

### Index-Accelerated Lookup

Before scanning directories, attempt to read the relevant index file(s) for
faster retrieval:

```bash
# Fast path — read from index (one call per artifact type)
gh api repos/zeyad-farrag/product-engine-live/contents/intelligence/_index/{category}.md \
  --jq '.content' 2>/dev/null | base64 -d
```

If the index file exists, parse the markdown table to identify relevant
artifacts instead of listing and reading each directory. If the index file
does not exist or returns an error, fall back to the directory-scanning
approach below.

Read file content via:
```bash
gh api repos/zeyad-farrag/product-engine-live/contents/[path] --jq '.content' | base64 -d
```

**What to detect:**
- `foundation/business-model-summary.md` — if missing, issue Foundation Nudge (see below)
- Existing health-checks for this product (< 90 days = fresh, reuse; ≥ 90 days = re-run)
- Competitor profiles relevant to this product's destination/tier
- Active or closed initiatives that overlap (prior optimization, repositioning decisions)
- Previous decision records that constrain or inform this run

**Foundation Nudge** (if `business-model-summary.md` absent):
- Nudge 1: "Foundation Session hasn't been run yet. This initiative benefits significantly from business context. Consider running `pe-foundation-session` first."
- Nudge 2 (if user continues): "Proceeding without foundation context. Some capability areas (brand fit, tier mapping, portfolio context) will have limited precision."
- Do NOT hard-block.

**Capability Reuse Logic:**
1. If fresh (< 90 days) relevant health-check exists → reference it, skip redundant diagnostic sub-sections
2. If fresh competitor profiles exist → reuse for Phase 2B
3. If active initiative overlaps → flag before starting, ask user to confirm this is a new run or continuation
4. Note: "If you need deeper analysis, consider running the standalone pe-competitive-analysis skill"

---

## Phase 1: FRAME (AI Listens)

**AI Mode**: AI listens, human leads. Receive intent, present confidence map, define scope.

### 1-A. Identify Optimization Trigger

Determine which trigger applies:
- **Performance Decline** — bookings, revenue, or conversion falling
- **Competitive Pressure** — market forces eroding position
- **Strategic Review** — scheduled or portfolio-level health check
- **Customer Complaints** — negative feedback patterns, amendment spikes
- **Routine Health Check** — proactive monitoring cycle

### 1-B. Establish Baseline Expectation

Ask (or infer from context):
- What does "good performance" look like for this product?
- What time period is in scope?
- Are there known external factors (seasonality, market events)?
- What is the primary concern: volume, conversion, margin, or satisfaction?

### 1-C. Confidence Map

Present at the start of every FRAME phase:

```
Intelligence Status for [PRODUCT NAME]:

- Business context:           [HIGH/MEDIUM/LOW/NONE] — [basis, e.g. "foundation file present"]
- Product performance data:   [level] — [basis, e.g. "health-check from YYYY-MM-DD found"]
- Customer profile data:      [level] — [basis, e.g. "persona files present / absent"]
- Competitive landscape:      [level] — [basis, e.g. "N competitor profiles found"]
- Amendment intelligence:     [level] — [basis, e.g. "amendment data available / not yet queried"]
- Conversion funnel:          [level] — [basis, e.g. "funnel data available / will query"]
- Previous health checks:     [level] — [basis, e.g. "last run YYYY-MM-DD / no prior runs"]
```

**Before proceeding to Discover**, confirm scope with user:
- Product name / ID confirmed
- Time horizon confirmed (default: 12-month window with 3/6/12 breakdowns)
- Optimization trigger confirmed
- Any constraints (budget, timeline, off-limits changes) noted

---

## Phase 2: DISCOVER (AI Leads)

**AI Mode**: AI leads, human reviews. Research streams with confidence disclosure.

Work through sub-sections in order. Present each completed block before moving to the next.

### 2A. Performance Diagnostic (Database-Heavy)

Run all 4 diagnostic sub-sections. See `references/diagnostic-templates.md` for MySQL queries and output formats.

#### 2A-1. Booking Performance Analysis

- 3/6/12-month booking volume with trend arrows (▲/▼/→)
- Revenue breakdown (total, per-booking average)
- Compare against: similar products, portfolio average, historical baseline
- Occupancy/utilization rate if applicable
- Output: performance trend table with RAG status (Red/Amber/Green)

#### 2A-2. Conversion Funnel Analysis

Full funnel: Page views → Detail views → Inquiries → Bookings → Overall conversion rate
- Identify primary drop-off point
- Compare funnel ratios against portfolio benchmark
- Output: funnel diagram with % at each stage and drop-off highlights

#### 2A-3. Amendment Signal Analysis

10 amendment types:
1. Accommodation upgrade
2. Accommodation downgrade
3. Activity addition
4. Activity removal
5. Duration extension
6. Duration reduction
7. Date change
8. Destination addition
9. Cancellation
10. Other

Analyze:
- Amendment rate vs. portfolio average
- Patterns by source market and customer segment
- **Hidden Demand Signal**: amendments that ADD value (upgrades, additions, extensions) = customers wanting more → upsell/expansion opportunity
- **Dissatisfaction Signal**: amendments that REMOVE or cancel = customers correcting a mismatch
- Output: amendment signal table with demand signal calculation (see `references/diagnostic-templates.md`)

#### 2A-4. Customer Profile Analysis

- Actual buyer demographics vs. intended audience (from foundation/personas)
- Top source markets (top 3–5)
- Customer segments (FIT, group, luxury, budget, etc.)
- Repeat vs. first-time ratio
- Cross-purchase patterns (what else did these customers buy?)
- Output: buyer profile summary with audience match assessment

### 2B. Competitive Position Analysis

- Identify 3–5 direct competitors (same destination, same tier)
- Build side-by-side comparison matrix across 9 dimensions:
  1. Price positioning
  2. Itinerary length
  3. Included activities
  4. Accommodation tier
  5. Unique selling points
  6. Source market focus
  7. Booking flexibility
  8. Digital presence / ratings
  9. Amendment/cancellation policies
- Identify competitive gaps (where we are weaker) and competitive advantages (where we lead)
- If fresh competitor profiles exist in repo (< 90 days), reuse — don't redo
- Output: competitive matrix table + gap summary

### 2C. Root Cause Analysis

Map symptoms to root causes using the 8-category framework:

| Category | Symptom Indicators | Typical Evidence |
|---|---|---|
| Pricing Issue | Low conversion despite high traffic | Price sensitivity data, competitor pricing gap |
| Content/Messaging Issue | High page views, low detail views | Bounce rate, inquiry quality |
| Structural Issue | High inquiry rate, low booking rate | Itinerary gaps, unclear inclusions |
| Audience Mismatch | Wrong segment buying, high amendments | Buyer vs. persona mismatch |
| Competitive Displacement | Declining share vs. growing market | Competitor growth data |
| Channel Issue | Performance varies by source | Channel-level conversion comparison |
| Seasonal/Cyclical | Performance recovers without intervention | Historical seasonality pattern |
| Lifecycle Decline | Consistent long-term decline | Multi-year trend data |

For each identified root cause: assign confidence (HIGH/MEDIUM/LOW), state evidence, and note what additional data would increase confidence.

See `references/diagnostic-templates.md` for the full root cause table template.

### 2D. Cross-Initiative Intelligence (Memory Scan)

Check repo for overlapping intelligence from previous initiatives:
- Prior optimization runs for this product
- Repositioning decisions that affect this product
- Shared competitor profiles used in other initiatives
- Persona findings from other initiative types
- Relevant patterns from closed initiatives

Note what was found and how it affects this analysis.

---

## Inflection Point 1: "Is This Product Worth Optimizing?"

After completing all of Phase 2, present the full inflection point:

```
══════════════════════════════════════════════
INFLECTION POINT 1: Is This Product Worth Optimizing?
══════════════════════════════════════════════

### Key Findings
[3–5 bullet summary of what discovery revealed — quantified where possible]

### Confidence Assessment
| Domain                    | Level  | Basis                          |
|---------------------------|--------|--------------------------------|
| Performance Data          | HIGH/MEDIUM/LOW | [source/query basis] |
| Root Cause Identification | HIGH/MEDIUM/LOW | [evidence strength]  |
| Competitive Context       | HIGH/MEDIUM/LOW | [data currency]      |
| Audience Match            | HIGH/MEDIUM/LOW | [persona comparison] |
| Amendment Intelligence    | HIGH/MEDIUM/LOW | [data completeness]  |

### Options
| Option     | Description                                              | Trade-offs                                        |
|------------|----------------------------------------------------------|---------------------------------------------------|
| OPTIMIZE   | Proceed to Phase 3 with specific recommendations         | Requires investment; viable if root cause fixable |
| REPOSITION | Root cause is audience mismatch — redirect to pe-repositioning | Better fit if core product is sound but mismarketed |
| RETIRE     | Product has no viable path to performance targets        | Frees resources; appropriate for lifecycle decline |
| HOLD       | Insufficient data or external factors — monitor & revisit | Defers decision; appropriate for seasonal/cyclical |

### Recommendation
[AI recommendation with reasoning tied to specific findings]

⏸ WAITING FOR YOUR DECISION before proceeding.
══════════════════════════════════════════════
```

**Routing rules:**
- If user selects **OPTIMIZE** → proceed to Phase 3
- If user selects **REPOSITION** → note decision, produce decision record, suggest `pe-repositioning` skill
- If user selects **RETIRE** → note decision, produce decision record, close initiative
- If user selects **HOLD** → note decision, set revisit trigger, produce monitoring spec only

---

## Phase 3: DECIDE (AI Advises) — Only if OPTIMIZE

**AI Mode**: AI advises, human decides. Propose options, model impact, disclose uncertainty.

### 3-A. Optimization Recommendations Table

For each recommendation, structure as:

| # | Recommendation | Root Cause Addressed | Expected Impact | Effort | Priority | Owner |
|---|---|---|---|---|---|---|
| 1 | [specific action] | [category from 2C] | [quantified target] | Low/Med/High | Quick Win / Major / Strategic / Fill-in | [team] |

See `references/optimization-framework.md` for scoring methodology and impact-effort matrix.

### 3-B. Strategy Options (2–3 Options)

Present 2–3 distinct strategic approaches:
- **Option A**: [conservative/quick-win focused]
- **Option B**: [balanced/comprehensive]
- **Option C**: [transformational/high-risk-high-reward, if applicable]

For each option: summary, key actions, estimated timeline, resource requirement, projected impact range, and risks.

See `references/optimization-framework.md` for strategy comparison format.

### 3-C. Success Metrics with 30/60/90-Day Targets

For each key metric:
- Current baseline (from Phase 2)
- 30-day target (leading indicators, process metrics)
- 60-day target (early outcome metrics)
- 90-day target (outcome metrics)
- Alert threshold (triggers escalation if crossed)

### 3-D. Risk Assessment

For chosen strategy:
- Top 3–5 risks with likelihood (H/M/L) and impact (H/M/L)
- Mitigation approach for each
- Dependencies and assumptions

---

## Inflection Point 3: "Is This Optimization Plan Ready?"

```
══════════════════════════════════════════════
INFLECTION POINT 3: Is This Optimization Plan Ready?
══════════════════════════════════════════════

### Plan Summary
[Selected strategy, key recommendations, expected outcomes]

### Confidence Assessment
| Domain                   | Level           | Basis                        |
|--------------------------|-----------------|------------------------------|
| Recommendation Basis     | HIGH/MEDIUM/LOW | [evidence traceability]      |
| Impact Estimates         | HIGH/MEDIUM/LOW | [modeling basis]             |
| Resource Requirements    | HIGH/MEDIUM/LOW | [estimation method]          |
| Risk Coverage            | HIGH/MEDIUM/LOW | [risk identification method] |

### Options
| Option   | Description                              | Trade-offs                     |
|----------|------------------------------------------|--------------------------------|
| APPROVE  | Proceed to Phase 4 and produce all deliverables | Full commitment required |
| REVISE   | Adjust specific recommendations before proceeding | Delays delivery        |
| DEFER    | Conditions not right — park until [trigger] | Preserves optionality   |

### Recommendation
[AI recommendation]

⏸ WAITING FOR YOUR DECISION before proceeding.
══════════════════════════════════════════════
```

---

## Phase 4: CONFIRM (Shared Validation)

**AI Mode**: Shared. Produce deliverables, persist artifacts, confirm storage.

### Deliverables

Produce all 6 deliverables:

**1. Product Diagnostic Report**
Sections: (1) Executive Summary, (2) Performance Analysis, (3) Amendment Signal Analysis, (4) Customer Profile Analysis, (5) Competitive Position, (6) Root Cause Summary

**2. Optimization Recommendations**
Prioritized table with: recommendation, root cause addressed, expected impact (quantified), effort, priority tier, owner, dependencies

**3. Competitive Position Analysis**
Standalone reusable document — the competitive matrix from Phase 2B formatted for standalone reference

**4. Implementation Priority Matrix**
Visual 2×2 impact-effort quadrant:
- **Quick Wins** (High Impact, Low Effort) — do first
- **Major Projects** (High Impact, High Effort) — plan carefully
- **Fill-ins** (Low Impact, Low Effort) — batch when convenient
- **Time Sinks** (Low Impact, High Effort) — avoid or deprioritize

See `references/optimization-framework.md` for quadrant template.

**5. Monitoring Dashboard Spec**
For each metric: name, definition, data source, current baseline, 30/60/90-day targets, alert threshold, review cadence

**6. Decision Record**
YAML frontmatter + summary of decision, rationale, and revisit triggers

### Artifact Storage

Store all artifacts to GitHub repo using `gh` CLI:

```bash
# Diagnostic Report
gh api repos/zeyad-farrag/product-engine-live/contents/artifacts/health-checks/[product]-[YYYY-MM-DD].md \
  --method PUT \
  --field message="Product Engine: Health Check — [product]" \
  --field content="$(base64 -w0 [local-file])"

# Competitor Profiles (one per competitor if new)
gh api repos/zeyad-farrag/product-engine-live/contents/artifacts/competitors/[name]-[context].md \
  --method PUT \
  --field message="Product Engine: Competitor Profile — [name]" \
  --field content="$(base64 -w0 [local-file])"

# Decision Record
gh api repos/zeyad-farrag/product-engine-live/contents/artifacts/decision-records/optimization-[product]-[YYYY-MM-DD].md \
  --method PUT \
  --field message="Product Engine: Decision Record — optimization-[product]" \
  --field content="$(base64 -w0 [local-file])"

# Initiative file — move from active to closed
# 1. Create/update initiatives/closed/optimization-[product].md
# 2. Delete initiatives/active/optimization-[product].md
```

**Artifact Frontmatter** (required on all artifacts):
```yaml
---
type: health-check | competitor-profile | decision-record | optimization-plan
created: YYYY-MM-DD
updated: YYYY-MM-DD
confidence: HIGH | MEDIUM | LOW
status: active | archived
initiative: optimization-[product]
tags: [product-name, destination, optimization, year]
---
```

### Initiative State File

On initiative start, create:
```yaml
---
type: initiative
initiative_type: product-optimization
subject: [product name]
phase: frame
status: active
started: YYYY-MM-DD
updated: YYYY-MM-DD
artifacts_produced: []
---
```
Path: `initiatives/active/optimization-[product].md`

On close, move to `initiatives/closed/` and add `closed: YYYY-MM-DD` and `decision: OPTIMIZE | REPOSITION | RETIRE | HOLD`.

### Memory Pointer

After storing artifacts, update Perplexity memory with a single lightweight pointer:
```
Product Optimization — [Product Name]: [Decision]. [N] artifacts produced. Phase: closed. Stored at initiatives/closed/optimization-[product].md.
```

### Re-Run Instruction

This skill is designed to be re-run 60–90 days post-implementation:
- Bring forward the Monitoring Dashboard Spec as the baseline
- Compare actual 60/90-day metrics against targets
- Run Phase 2A only (skip 2B/2C unless new competitive context)
- Produce a follow-up health check artifact
- Update the decision record with actual vs. predicted outcomes

---


### Update Memory Index

After committing artifacts, update the relevant index file(s) at
`intelligence/_index/`. For each artifact written:

1. Read the current index file for that artifact type
2. If the artifact path exists in the table, update the row
3. If not, append a new row with: Path, Subject, Markets, Destinations,
   Updated, Author, Confidence, Status, Session, Depends On
4. Update `artifact_count` and `updated` in the index frontmatter
5. Commit and push:
   ```bash
   git add intelligence/_index/[relevant-index].md
   git commit -m "Product Engine: update [category] index"
   git push
   ```

If the index file does not exist yet, skip this step — pe-memory-maintenance
will build it on first run.


## Reference Files

- `references/diagnostic-templates.md` — MySQL queries for 2A-1 through 2A-4, competitive matrix template, root cause table, amendment signal format
- `references/optimization-framework.md` — Impact-effort matrix, recommendation scoring, monitoring dashboard spec template, 30/60/90-day target framework, strategy comparison format

---

## Routing Signals

| Finding | Action |
|---|---|
| Root cause = Audience Mismatch | Recommend REPOSITION at Inflection Point 1; suggest `pe-repositioning` skill |
| Root cause = Lifecycle Decline (no fixable cause) | Recommend RETIRE |
| Insufficient data for confident root cause | Recommend HOLD with data collection plan |
| Seasonal/cyclical pattern confirmed | Recommend HOLD until season end; set calendar trigger |
| All root causes addressable | Recommend OPTIMIZE → Phase 3 |
