---
name: pe-gap-analysis
description: >
  Gap analysis capability for the Product Engine system. Use when the user mentions
  "gap analysis", "product gaps", "what's missing", "fit analysis", or "product-market fit".
  Systematically identifies gaps between a product's current state and what a target audience
  or market expects. Produces a prioritized gap matrix with severity ratings (CRITICAL/MAJOR/MODERATE/MINOR/NONE),
  gap types (MISSING/DEFICIENT/MISALIGNED/EXCESS/NONE), and a strategic classification
  (STRONG_FIT/FIXABLE_FIT/REPOSITIONING_NEEDED/REDESIGN_NEEDED/FUNDAMENTAL_MISMATCH).
  Persisted to the GitHub intelligence store at artifacts/gap-analyses/.
metadata:
  author: Product Engine
  version: '1.0'
  layer: capability
  system: product-engine
  repo: zeyad-farrag/Product-Engine
---

> **Repository Path**: Read from `_config/repo.md`. Current: `zeyad-farrag/Product-Engine`

# Gap Analysis

## When to Use This Skill

Load this skill when the user asks about:
- What gaps exist between a product and audience expectations
- How a product compares against a competitor's offering
- Whether a product fits a specific market or segment
- What's missing before entering a new market
- Fit analysis — STRONG_FIT through FUNDAMENTAL_MISMATCH

Typical trigger prompts:
- "What gaps exist between our Egypt packages and what German travelers expect?"
- "Run a gap analysis on [PRODUCT] vs. [BENCHMARK]"
- "What's missing from our Jordan tour for the luxury segment?"
- "How does our product compare to competitor X?"
- "Is our product a fit for the Australian market?"

---

## Where Am I?

Before running analysis, orient yourself in the intelligence store.

### Step 1: Check for Existing Gap Analyses

```bash
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/gap-analyses \
  --jq '[.[] | {name: .name, path: .path}]'
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

If gap analyses exist for the same product or benchmark, retrieve the most recent one:

```bash
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/gap-analyses/[filename].md \
  --jq '.content' | base64 -d
```

If the directory does not exist yet, proceed — you will create the first gap analysis.

### Step 2: Check for Prerequisite Artifacts

A gap analysis is only as good as the intelligence behind it. Check for the following:

```bash
# Check for persona cards (required if benchmark is an audience)
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/personas \
  --jq '[.[] | {name: .name}]'

# Check for competitor profiles (required if benchmark is a competitor)
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/competitors \
  --jq '[.[] | {name: .name}]'

# Check for health checks on this product
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/health-checks \
  --jq '[.[] | {name: .name}]'
```

**If prerequisites are missing:**

| Missing Artifact | Impact | Recommendation |
|---|---|---|
| Persona card for target audience | Benchmark standard is ungrounded | Run `pe-persona-definition` first |
| Competitor profile | Competitive floor is unknown | Run `pe-competitor-benchmarking` first |
| Product health check | Current product state is unassessed | Run `pe-product-health-check` first |

> Do not proceed with a gap analysis if the benchmark has no supporting persona card or competitor profile and the user has no data to substitute. Recommend the prerequisite capability explicitly.

### Step 3: Load Foundation Context

```bash
gh api repos/zeyad-farrag/Product-Engine/contents/foundation/business-model-summary.md \
  --jq '.content' | base64 -d

gh api repos/zeyad-farrag/Product-Engine/contents/foundation/domains/06-product-structure.md \
  --jq '.content' | base64 -d
```

### Step 4: Cross-Reference Related Artifacts

```bash
# Search for any artifacts related to the product or benchmark
gh search code "[PRODUCT]" --repo zeyad-farrag/Product-Engine
gh search code "[BENCHMARK]" --repo zeyad-farrag/Product-Engine
```

Look specifically for:
- Previous gap analyses for the same product (different benchmark) — pattern the format
- Previous gap analyses for the same benchmark (different product) — note systemic gaps
- Demand signal reports — they carry evidence for benchmark expectations
- Market assessments — they inform benchmark competitive standards

---

## Role & Analytical Posture

You are a product strategist specializing in fit analysis — the systematic identification of gaps between what exists and what should exist. You think in terms of customer expectations, competitive standards, and market norms. Every gap you identify must be specific, evidenced, and actionable.

You are not looking for problems to complain about. You are looking for opportunities to close — gaps that, when addressed, measurably improve product-market fit, competitive position, or customer satisfaction.

---

## Execution Flow

### Phase 1: Clarify Parameters

If `[PRODUCT]` or `[BENCHMARK]` are not specified, ask:
- "Which product, product line, or category are you assessing? (e.g., 'Egypt Classic Tour', 'all Jordan packages')"
- "What are you comparing against — an audience (e.g., 'German traveler expectations'), a competitor (e.g., 'TravelCo's offering'), or a market norm (e.g., 'luxury tour industry standard')?"

### Phase 2: Run the 6-Step Framework

Execute all steps from `references/gap-framework.md`. Each step must be completed in order — do not skip to recommendations without completing gap identification.

**Summary of the 6 steps:**

1. **Define the Benchmark Standard** — articulate what "good" looks like from the benchmark's perspective
2. **Assess Current Product State** — document current state across all relevant dimensions with evidence
3. **Gap Identification** — for each dimension, compare current vs. benchmark; assign gap type and severity
4. **Gap Prioritization** — organize gaps into Priority 1–4 matrix plus excess analysis
5. **Strategic Classification** — classify overall fit (STRONG_FIT through FUNDAMENTAL_MISMATCH)
6. **Action Recommendations** — immediate, short-term, medium-term actions plus decisions requiring human judgment

### Phase 3: Cross-Reference Check

Before finalizing, check whether similar gaps appear in other analyses:

```bash
# Search for CRITICAL or MAJOR severity tags across gap analyses
gh search code "CRITICAL" --repo zeyad-farrag/Product-Engine \
  -- artifacts/gap-analyses/
gh search code "MAJOR" --repo zeyad-farrag/Product-Engine \
  -- artifacts/gap-analyses/
```

Answer these questions:
- Have similar gaps been identified in other products for the same benchmark?
- Are any gaps systemic — appearing across multiple products?
- Do gap findings validate or contradict previous initiative conclusions?

### Phase 4: Store the Report

---

## Storage

### File Path

```
artifacts/gap-analyses/[product-kebab]-vs-[benchmark-kebab]-[date].md
```

Examples:
- `artifacts/gap-analyses/egypt-classic-tour-vs-german-traveler-expectations-2026-03.md`
- `artifacts/gap-analyses/jordan-premium-vs-travelco-2026-03.md`
- `artifacts/gap-analyses/nile-cruise-vs-luxury-industry-standard-2026-03.md`

### Frontmatter Schema

```yaml
---
type: gap-analysis
product: [product name]
target_audience: [benchmark description]
fit_rating: STRONG_FIT | FIXABLE_FIT | REPOSITIONING_NEEDED | REDESIGN_NEEDED | FUNDAMENTAL_MISMATCH
created: YYYY-MM-DD
updated: YYYY-MM-DD
confidence: HIGH | MEDIUM | LOW
status: active | superseded | archived
author: [current user email or name]
session: [initiative slug or "standalone"]
supersedes: [path to previous version, omit if first]
depends_on: [list of artifact paths this was derived from]
initiative: [producing initiative slug or "standalone"]
tags: [list of searchable tags]
---
```

**Confidence rating guidance:**
- `HIGH` — persona cards and competitor profiles exist; health check data available; multiple evidence sources
- `MEDIUM` — some prerequisites missing; benchmark grounded in partial data
- `LOW` — significant intelligence gaps; benchmark based on assumptions or minimal data

**When a previous gap analysis exists for the same product/benchmark pair**, mark the old file as superseded:
```bash
# Update old file frontmatter: status: superseded
# Commit alongside the new file
```

### Commit Pattern

```bash
# Write artifact via GitHub Contents API (no local clone needed)
# 1. Check if file already exists (to get SHA for update)
EXISTING_SHA=$(gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/gap-analyses/[filename].md \
  --jq '.sha' 2>/dev/null || echo "")

# 2. Write/update the file
echo '[report content]' | base64 -w0 | gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/gap-analyses/[filename].md \
  --method PUT \
  --field message="Product Engine: gap-analysis — [PRODUCT] vs. [BENCHMARK] ([date])" \
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

### Memory Pointer

After storing, update Perplexity memory with a lightweight pointer only:

```
Gap Analysis: [PRODUCT] vs. [BENCHMARK] — [date]. Fit rating: [classification]. [N] critical, [N] major, [N] moderate gaps. Top gap: [most critical finding]. Stored at artifacts/gap-analyses/[filename].md.
```

Do not store tables, raw gap data, or full analysis in memory. Memory is for pointers only.

---

## Operating Principles

1. **Gaps must be specific.** "Content needs improvement" is not a gap. "Product description lacks day-by-day itinerary detail, which 4/5 competitors and all persona cards indicate is a primary decision factor" is a gap.

2. **Evidence both sides.** Every gap requires evidence for the current state AND evidence for the benchmark expectation. Without both, it's an opinion, not a gap.

3. **Severity is relative to impact.** A gap that exists but doesn't affect purchase decisions is MINOR regardless of how "wrong" it feels.

4. **Excess is also a finding.** Over-delivering against benchmark expectations isn't always good — it may mean misallocated resources or misaligned positioning.

5. **Classification drives next steps.** The strategic classification determines whether this feeds an optimization, repositioning, new product, or rejection decision. Get it right.

6. **Cite everything.** Every benchmark expectation should cite its source (persona card, competitor profile, market research, customer review data).

7. **Don't prescribe the fix in the gap identification.** Identify gaps first, then recommend fixes. Mixing identification and prescription leads to confirmation bias.

---

## Reference Files

- `references/gap-framework.md` — Complete 6-step framework with all table templates, gap type definitions, severity definitions, and prioritization matrix structure. Load when executing any gap analysis.
- `references/classification-guide.md` — Strategic classification criteria with decision criteria for each outcome, and action recommendation templates organized by classification level and priority tier.
