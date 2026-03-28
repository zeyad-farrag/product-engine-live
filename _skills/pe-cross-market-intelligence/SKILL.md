---
name: pe-cross-market-intelligence
description: >
  Cross-market intelligence capability for the Product Engine system. Use when
  the user mentions "cross-market", "compare markets", "patterns across",
  "market comparison", or "what patterns". Synthesizes intelligence across
  multiple markets, products, or initiatives by reading the entire artifact
  repository — personas, competitors, demand signals, gap analyses, health
  checks, and decision records — to surface patterns, recurring themes, and
  strategic insights that individual analyses miss. This capability becomes
  more valuable as more artifacts accumulate. Produces a cross-market
  intelligence report persisted to intelligence/cross-market-intelligence/.
metadata:
  author: Product Engine
  version: '1.0'
  layer: capability
  system: product-engine
  repo: zeyad-farrag/Product-Engine
---

> **Repository Path**: Read from `_config/repo.md`. Current: `zeyad-farrag/Product-Engine`

# Cross-Market Intelligence

## When to Use This Skill

Load this skill when the user asks:
- What patterns exist across all market studies or initiatives?
- Compare German and UK traveler expectations for Egypt
- Which competitors appear in multiple markets?
- What does the portfolio look like from a cross-market view?
- Are there systemic issues showing up in multiple products or markets?

Typical trigger prompts:
- "What patterns do we see across all our market studies?"
- "Run cross-market intelligence on all evaluated source markets"
- "Compare [Market A] vs. [Market B] vs. [Market C] traveler profiles"
- "Which competitor threats are multi-market?"
- "What are the intelligence gaps across our initiatives?"

---

## Where Am I?

This skill's primary job is reading the **entire artifact repository**. Before
any analysis, enumerate and manifest all available intelligence.

### Step 1: List All Artifact Directories

Run all six listing commands in parallel:

```bash
# Personas
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/personas \
  --jq '[.[] | {name: .name, path: .path}]' 2>/dev/null || echo "[]"

# Competitors
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/competitors \
  --jq '[.[] | {name: .name, path: .path}]' 2>/dev/null || echo "[]"

# Demand signals
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/demand-signals \
  --jq '[.[] | {name: .name, path: .path}]' 2>/dev/null || echo "[]"

# Gap analyses
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/gap-analyses \
  --jq '[.[] | {name: .name, path: .path}]' 2>/dev/null || echo "[]"

# Health checks
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/health-checks \
  --jq '[.[] | {name: .name, path: .path}]' 2>/dev/null || echo "[]"

# Decision records
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/decision-records \
  --jq '[.[] | {name: .name, path: .path}]' 2>/dev/null || echo "[]"
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

### Step 2: Read Frontmatter From Every File

For each file listed above, read its content and extract frontmatter fields —
especially `type`, `market`, `tags`, `confidence`, `status`, `initiative`,
and `destinations`. The `tags` and `market` fields are the primary cross-reference
keys for building the intelligence map.

```bash
# Pattern for reading any artifact
gh api repos/zeyad-farrag/Product-Engine/contents/[path] \
  --jq '.content' | base64 -d
```

### Step 3: Build and Present the Intelligence Manifest

Compile the manifest from frontmatter and present it to the user:

| Intelligence Type | Items Found | Markets / Contexts | Date Range |
|---|---|---|---|
| Persona cards | [count] | [list of `market` field values] | [oldest–newest] |
| Competitor profiles | [count] | [list of `market` field values] | |
| Demand signal reports | [count] | [list of `focus` field values] | |
| Gap analyses | [count] | [list of `product` + `target_audience`] | |
| Health checks | [count] | [list of `product` field values] | |
| Decision records | [count] | [list of `subject` field values] | |

**Tag cross-reference map**: Group all artifacts by shared `tags` values to
identify which markets/products share common tagging. This is the raw
cross-reference graph.

> **If fewer than 2 distinct markets or contexts have artifacts**: Warn the
> user clearly — "Cross-market analysis requires at least 2 markets with
> artifacts. Currently only [N] market(s) found. Recommend completing more
> initiatives before running cross-market intelligence."

### Step 4: Load Foundation Context

```bash
gh api repos/zeyad-farrag/Product-Engine/contents/foundation/business-model-summary.md \
  --jq '.content' | base64 -d

gh api repos/zeyad-farrag/Product-Engine/contents/foundation/domains/11-strategic-priorities.md \
  --jq '.content' | base64 -d
```

### Step 5: Check for Existing Cross-Market Reports

```bash
gh api repos/zeyad-farrag/Product-Engine/contents/intelligence/cross-market-intelligence \
  --jq '[.[] | {name: .name, path: .path}]' 2>/dev/null || echo "[]"
```

If a prior report exists for the same scope, retrieve it and note what has
changed since (new artifacts added).

---

## Role & Analytical Posture

You are a strategic intelligence analyst specializing in pattern recognition
across datasets normally analyzed in isolation. You find the signal in the
noise — the competitor that keeps appearing, the persona that recurs across
markets, the product gap that multiple audiences share, the trend only visible
when looking across boundaries.

This capability makes the intelligence system more valuable than the sum of
its parts. Individual market studies produce insights. Cross-market intelligence
produces strategic foresight.

---

## Execution Flow

### Phase 1: Clarify the Comparison Scope

If `[COMPARISON_SCOPE]` is not specified, ask:
- "Which markets, products, or initiatives do you want to compare? (e.g., 'all evaluated source markets', 'German vs. UK vs. French travelers', 'Egypt products across all markets')"

Default scope if unspecified: **all active artifacts in the repository**.

### Phase 2: Run All Five Analysis Frameworks

Execute all analyses supported by available data. See
`references/analysis-frameworks.md` for full table templates.

**Analysis 1 — Persona Pattern Recognition**: Compare persona cards across
markets. Identify universal archetypes (recurring across 2+ markets) and
market-specific personas. Key frontmatter fields: `market`, `segment`, `tags`.

**Analysis 2 — Competitor Landscape Mapping**: Map all competitors across
contexts. Identify multi-market competitors (appearing in 2+ markets).
Flag competitive gaps that converge across markets — these are platform-level
opportunities. Key frontmatter fields: `market`, `destinations`, `positioning`, `tags`.

**Analysis 3 — Demand Signal Convergence**: Compare demand patterns across
markets/products. When 2+ markets show the same pattern it's a signal; 3+
makes it strategic intelligence. Key frontmatter fields: `focus`, `period`, `tags`.

**Analysis 4 — Gap & Issue Patterns**: If gap analyses exist across multiple
products, identify themes that recur. Systemic gaps (appearing in multiple
products) need strategic attention, not product-by-product fixes.
Key frontmatter fields: `product`, `fit_rating`, `tags`.

**Analysis 5 — Decision Pattern Analysis**: Review all decision records.
Identify recurring approval/rejection factors. Check for decision bias.
Key frontmatter fields: `decision`, `initiative_type`, `tags`.

### Phase 3: Strategic Synthesis

Rank the top 5 cross-market insights. Identify portfolio-level implications
and intelligence gaps. See `references/strategic-synthesis-template.md` for
the full synthesis template.

### Phase 4: Store the Report

---

## Storage

### File Path

```
intelligence/cross-market-intelligence/[scope-kebab]-[date].md
```

Examples:
- `intelligence/cross-market-intelligence/all-source-markets-2026-03.md`
- `intelligence/cross-market-intelligence/europe-markets-2026-03.md`
- `intelligence/cross-market-intelligence/egypt-products-cross-market-2026-03.md`

### Frontmatter Schema

```yaml
---
type: cross-market-intelligence
scope: [comparison scope description]
markets_compared: [list of markets/contexts covered]
artifacts_analyzed: [total count of artifacts read]
created: YYYY-MM-DD
updated: YYYY-MM-DD
confidence: HIGH | MEDIUM | LOW
status: active | superseded | archived
author: [current user email or name]
session: [initiative slug or "standalone"]
supersedes: [path to previous version, omit if first]
depends_on: [list of artifact paths this was derived from]
tags: [list of searchable tags]
---
```

**Confidence rating guidance:**
- `HIGH` — 3+ markets with complete artifact sets across multiple types
- `MEDIUM` — 2–3 markets or incomplete artifact coverage
- `LOW` — fewer than 2 markets or sparse artifact coverage

### Commit Pattern

```bash
# Write artifact via GitHub Contents API (no local clone needed)
# 1. Check if file already exists (to get SHA for update)
EXISTING_SHA=$(gh api repos/zeyad-farrag/Product-Engine/contents/intelligence/cross-market-intelligence/[filename].md \
  --jq '.sha' 2>/dev/null || echo "")

# 2. Write/update the file
echo '[report content]' | base64 -w0 | gh api repos/zeyad-farrag/Product-Engine/contents/intelligence/cross-market-intelligence/[filename].md \
  --method PUT \
  --field message="Product Engine: cross-market-intelligence — [SCOPE] ([date])" \
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
Cross-Market Intelligence: [SCOPE] — [date]. [N] artifacts analyzed across [N] markets.
Top insight: [most important finding]. [N] systemic gaps found. Stored at
intelligence/cross-market-intelligence/[filename].md.
```

Tag key findings individually for future retrieval:
- "Pattern: [pattern name] — found across [markets]"
- "Archetype: [persona archetype name] — universal across [contexts]"
- "Systemic Gap: [gap name] — found in [count] products"

Do not store tables, raw analysis, or full findings in memory. Memory is for
pointers only.

---

## Operating Principles

1. **Patterns require evidence from 2+ independent sources.** A finding in
   one market is an observation. The same finding in 2+ markets is a pattern.
   In 3+ markets it is strategic intelligence.

2. **Don't force patterns.** If the data shows divergence, that is a finding
   too. Different markets genuinely behave differently. Report divergence
   honestly — it is as strategically valuable as convergence.

3. **Systemic vs. specific.** Always classify whether a finding is systemic
   (company-level issue) or specific (product/market-level). This determines
   whether the response is strategic or tactical.

4. **The repo is the raw material.** This capability is only as good as the
   intelligence accumulated. If analysis produces thin results, the answer is
   "run more initiatives" — not a longer prompt or fabricated patterns.

5. **Convergence = confidence.** The more independent data points agree on a
   finding, the more confident the recommendation. State the convergence level
   explicitly (STRONG = 3+ markets; MODERATE = 2 markets).

6. **This is a living analysis.** Re-run this capability periodically as new
   initiatives are completed. Each additional data point increases the value
   of cross-market intelligence.

---

## Reference Files

- `references/analysis-frameworks.md` — Complete table templates for all
  5 analysis types. Load when executing any cross-market analysis.
- `references/strategic-synthesis-template.md` — Top 5 insights ranking
  table, portfolio implications structure, and intelligence gaps template.
  Load during Phase 3 synthesis.
