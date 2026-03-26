---
name: pe-cross-initiative-patterns
description: >
  Cross-initiative pattern mining for the Product Engine system. Use when the
  user mentions "what patterns are emerging", "institutional learning",
  "cross-initiative insights", "hypothesis testing", "systemic issues",
  "what do we know across all our work", or "strategic patterns". Layer 3
  Intelligence skill — reads the entire artifact repository and finds patterns
  invisible to individual initiatives: persona archetypes, competitive
  convergence, decision biases, systemic gaps, and demand patterns. Includes
  formal hypothesis testing. Produces institutional insights and recommended
  next initiatives. Most valuable after 3+ completed initiatives. Output
  persisted to intelligence/cross-initiative-patterns/[date].md.
metadata:
  layer: intelligence
  system: product-engine
  repo: zeyad-farrag/product-engine-live
---

> **Repository Path**: Read from `_config/repo.md`. Current: `zeyad-farrag/product-engine-live`

# Cross-Initiative Pattern Mining

**Role**: Institutional memory analyst. Find patterns that individual initiatives cannot see — recurring themes, validated hypotheses, and emerging truths visible only when looking across the full body of accumulated intelligence.

> "A single initiative produces insights about one market or one product. Pattern mining produces insights about the BUSINESS."

---

## When to Use This Skill

Trigger phrases:
- "What patterns are emerging across our work?"
- "Institutional learning / institutional insights"
- "Cross-initiative insights" / "what do we know across all our work?"
- "Test this hypothesis" / "hypothesis testing"
- "Systemic issues" / "what keeps recurring?"
- "Strategic patterns" / "quarterly review"
- "What do winners do differently?" / "competitive convergence"

Most valuable after 3+ completed initiatives. First run may produce preliminary findings; tenth run with 20+ initiatives produces strategic foresight.

---

## Setup

Before anything else, set today's date:
```bash
TODAY=$(date +%Y-%m-%d)
```

Clone repo locally (required for git operations at the end):
```bash
cd /tmp && git clone https://github.com/zeyad-farrag/product-engine-live.git 2>/dev/null || (cd /tmp/product-engine-live && git pull)
```

---

## Step 0 — Foundation Check

```bash
gh api repos/zeyad-farrag/product-engine-live/contents/foundation/business-model-summary.md \
  --jq '.content' | base64 -d 2>/dev/null || echo "NOT_FOUND"
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

If `NOT_FOUND`: display this nudge (do NOT hard-block):
> **Note**: Foundation Session hasn't been run yet. Pattern mining depends on business model context to distinguish company-level from market-level patterns. Results will be available but context may be limited.

---

## Step 1 — Complete Memory Retrieval (Run All in Parallel)

Run all listing commands simultaneously. Do not wait for one before starting another.

```bash
# Artifact directories
gh api repos/zeyad-farrag/product-engine-live/contents/artifacts/personas \
  --jq '[.[] | {name, path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/product-engine-live/contents/artifacts/competitors \
  --jq '[.[] | {name, path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/product-engine-live/contents/artifacts/demand-signals \
  --jq '[.[] | {name, path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/product-engine-live/contents/artifacts/health-checks \
  --jq '[.[] | {name, path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/product-engine-live/contents/artifacts/gap-analyses \
  --jq '[.[] | {name, path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/product-engine-live/contents/artifacts/decision-records \
  --jq '[.[] | {name, path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/product-engine-live/contents/artifacts/market-assessments \
  --jq '[.[] | {name, path}]' 2>/dev/null || echo "[]"

# Intelligence layer
gh api repos/zeyad-farrag/product-engine-live/contents/intelligence/portfolio-health \
  --jq '[.[] | {name, path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/product-engine-live/contents/intelligence/signal-detection \
  --jq '[.[] | {name, path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/product-engine-live/contents/intelligence/cross-initiative-patterns \
  --jq '[.[] | {name, path}]' 2>/dev/null || echo "[]"

# Initiatives
gh api repos/zeyad-farrag/product-engine-live/contents/initiatives/active \
  --jq '[.[] | {name, path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/product-engine-live/contents/initiatives/closed \
  --jq '[.[] | {name, path}]' 2>/dev/null || echo "[]"

# Foundation
gh api repos/zeyad-farrag/product-engine-live/contents/foundation \
  --jq '[.[] | {name, path}]' 2>/dev/null || echo "[]"
```

**Read each file** via:
```bash
gh api repos/zeyad-farrag/product-engine-live/contents/[path] --jq '.content' | base64 -d
```

Read all files in parallel where possible. Prioritize: initiatives → personas → competitors → decision-records → gap-analyses → demand-signals → health-checks → intelligence layer.

**Produce the Complete Manifest** — present this table to the user BEFORE analysis:

```
## Complete Repository Manifest

| Category | Files Found | Artifact Count |
|---|---|---|
| Active Initiatives | [list names] | [n] |
| Closed Initiatives | [list names] | [n] |
| Personas | [list names] | [n] |
| Competitors | [list names] | [n] |
| Demand Signals | [list names] | [n] |
| Health Checks | [list names] | [n] |
| Gap Analyses | [list names] | [n] |
| Decision Records | [list names] | [n] |
| Market Assessments | [list names] | [n] |
| Portfolio Health Reports | [list names] | [n] |
| Signal Detection Reports | [list names] | [n] |
| Prior Pattern Reports | [list names] | [n] |
| Foundation Docs | [list names] | [n] |
| **TOTAL** | | **[N]** |

**Initiatives analyzed**: [count]
**Total artifacts**: [count]
```

**Threshold check**: If fewer than 3 initiatives total (active + closed):
> Pattern mining is most valuable after 3+ completed initiatives. Current analysis will produce **preliminary findings** — treat as directional, not conclusive.

**Prior report check**: If prior pattern reports exist, note which insights to track for strengthening/weakening in the synthesis step.

---

## Step 2 — Six Analyses

Run analyses sequentially. Each builds on the content retrieved in Step 1.
See `references/analysis-templates.md` for all table formats and output templates.

### Analysis 1 — Persona Convergence

Goal: Find universal archetypes (appear in 3+ markets = market-agnostic product opportunity) and market-unique personas.

1. Extract all personas from every persona document
2. Group by archetype (similar job-to-be-done, pain point cluster, or behavioral pattern — not exact name matches)
3. Count market appearances for each archetype
4. Apply convergence labels (see `references/synthesis-framework.md`)
5. Output: Persona Convergence Matrix (see `references/analysis-templates.md` → Analysis 1)
6. Call out: which archetypes qualify as universal (3+ markets) → flag as "market-agnostic product opportunities"
7. Call out: market-unique personas that appear in only one market

### Analysis 2 — Competitive Intelligence Convergence

Goal: Find multi-market competitors, consistent patterns, and what winners do differently.

1. Extract all competitors from every competitor document
2. Identify competitors appearing in 2+ market studies (multi-market competitors)
3. For each multi-market competitor: aggregate strengths, weaknesses, and threat trajectory
4. Answer: "What do winners do differently?" — find common patterns among top-ranked competitors
5. Find competitive gap convergence: gaps that appear across multiple markets
6. Output: Competitive Convergence Table (see `references/analysis-templates.md` → Analysis 2)
7. Threat trajectory: is each multi-market competitor getting STRONGER / WEAKER / STABLE?

### Analysis 3 — Decision Pattern Analysis

Goal: Find systematic patterns in decisions, track quality, and check for bias.

1. Extract all decision records
2. Categorize by decision type: Market Entry / Repositioning / Optimization / New Product
3. For each: record outcome (Approve / Reject / Monitor) and rationale
4. Identify: common approval factors (what consistently led to approval?)
5. Identify: common rejection factors (what consistently led to rejection?)
6. Decision quality tracking: where projections exist, compare to actuals
7. **Bias check**: Are we systematically over-optimistic or over-cautious? Look for patterns:
   - Approval rate > 80%? → possible optimism bias
   - Rejection rate > 60%? → possible risk aversion
   - Projections consistently above actuals? → overestimation bias
   - Certain markets always approved? → familiarity bias
8. Output: Decision Pattern Table + Bias Assessment (see `references/analysis-templates.md` → Analysis 3)

### Analysis 4 — Gap & Issue Patterns

Goal: Find recurring gaps and elevate systemic issues to company-level attention.

1. Extract all gap analyses and health check issues
2. List every gap/issue with source document and context
3. Count occurrences of each gap type across different products/contexts
4. **Elevation rule**: gap appearing 3+ times across different contexts → ELEVATE from product problem to **company-level systemic issue**
5. Systemic issues need strategic attention, not product-by-product fixes
6. Output: Gap Pattern Matrix with systemic flags (see `references/analysis-templates.md` → Analysis 4)

### Analysis 5 — Demand Pattern Synthesis

Goal: Identify growth trends, decline trends, and hidden unacted-upon signals.

1. Extract demand signals and signal detection reports
2. Classify each signal: Growth / Decline / Neutral / Ambiguous
3. For growth patterns: note convergence level (how many independent sources confirm?)
4. For decline patterns: classify as STRUCTURAL (fundamental shift) or CYCLICAL (temporary)
5. Hidden demand patterns: signals that appeared in the data but were never acted upon — flag these explicitly
6. Output: Demand Pattern Synthesis Table (see `references/analysis-templates.md` → Analysis 5)

### Analysis 6 — Hypothesis Testing

**If user provided a hypothesis**: Test it directly.
**If no hypothesis provided**: Generate 3–5 data-suggested hypotheses from patterns found in Analyses 1–5, then test each.

For each hypothesis:
1. State hypothesis clearly
2. Gather all supporting evidence (with source file and strength: STRONG/MODERATE/WEAK)
3. Gather all contradicting evidence (with source file and strength)
4. Weigh evidence
5. Render verdict: SUPPORTED / PARTIALLY SUPPORTED / NOT SUPPORTED / INSUFFICIENT DATA

Output: Hypothesis Testing Report (see `references/analysis-templates.md` → Analysis 6)

---

## Step 3 — Strategic Synthesis

Produce exactly **5 Institutional Insights**. Use the scoring rubric in `references/synthesis-framework.md`.

Format for each insight:
```
**Insight #[N]**: [One crisp sentence — the actual insight]
**Evidence base**: [Which analyses + specific files support this]
**Confidence**: HIGH / MEDIUM / LOW (see rubric in synthesis-framework.md)
**Strategic implication**: [What decision or action this enables]
```

Then produce:

### Intelligence System Health

Calculate from the manifest data:

| Metric | Value | Status |
|---|---|---|
| % of portfolio with health data | [x/y products = z%] | 🟢 / 🟡 / 🔴 |
| % of active markets with studies | [x/y markets = z%] | 🟢 / 🟡 / 🔴 |
| Average age of intelligence | [days] | 🟢 / 🟡 / 🔴 |
| % of decisions with outcome data | [x/y = z%] | 🟢 / 🟡 / 🔴 |
| Cross-reference density | [avg connections per artifact] | 🟢 / 🟡 / 🔴 |

See `references/synthesis-framework.md` for threshold definitions.

### Recommended Next Initiatives

List 3–5 initiatives with rationale drawn directly from patterns found:

| Priority | Initiative | Rationale from Patterns | Type |
|---|---|---|---|
| 1 | [Name] | [Which pattern/gap/archetype drives this] | Research / Validation / Launch |
| ... | | | |

### Prior Report Comparison (if applicable)

If prior pattern reports existed: Which insights **strengthened**, **weakened**, or are **new** since the last report?

---

## Step 4 — Store Output

### Build the Report

Compose the full report as a single markdown file. Structure:

```markdown
---
type: cross-initiative-patterns
initiatives_analyzed: [count]
artifacts_analyzed: [total count]
persona_archetypes_found: [count]
multi_market_competitors: [count]
systemic_issues: [count]
top_insight: [one-line summary of #1 institutional insight]
created: YYYY-MM-DD
status: active
tags: [cross-initiative, patterns, institutional-learning, [markets covered], [key themes]]
---

# Cross-Initiative Patterns — [YYYY-MM-DD]

## Repository Manifest
[Complete manifest table from Step 1]

## Analysis 1 — Persona Convergence
[Full output]

## Analysis 2 — Competitive Intelligence Convergence
[Full output]

## Analysis 3 — Decision Pattern Analysis
[Full output]

## Analysis 4 — Gap & Issue Patterns
[Full output]

## Analysis 5 — Demand Pattern Synthesis
[Full output]

## Analysis 6 — Hypothesis Testing
[Full output]

## Strategic Synthesis

### Five Institutional Insights
[All 5 insights]

### Intelligence System Health
[Health table]

### Recommended Next Initiatives
[Priority table]

### Prior Report Comparison
[If applicable]
```

### Mark Prior Reports Superseded

For each file in `intelligence/cross-initiative-patterns/` (except today's):
```bash
# Read, update status: active → superseded, write back
gh api repos/zeyad-farrag/product-engine-live/contents/intelligence/cross-initiative-patterns/[prior-file].md \
  --jq '.content' | base64 -d | sed 's/^status: active/status: superseded/' > /tmp/prior_updated.md

# Get SHA for update
SHA=$(gh api repos/zeyad-farrag/product-engine-live/contents/intelligence/cross-initiative-patterns/[prior-file].md --jq '.sha')

# Push update
CONTENT=$(base64 -w 0 /tmp/prior_updated.md)
gh api repos/zeyad-farrag/product-engine-live/contents/intelligence/cross-initiative-patterns/[prior-file].md \
  -X PUT \
  -f message="Product Engine: supersede prior cross-initiative-patterns report" \
  -f content="$CONTENT" \
  -f sha="$SHA"
```

### Commit New Report

```bash
cd /tmp/product-engine-live
git pull

# Write new report file
cat > intelligence/cross-initiative-patterns/${TODAY}.md << 'EOF'
[full report content]
EOF

git add intelligence/cross-initiative-patterns/${TODAY}.md
git commit -m "Product Engine: cross-initiative-patterns — ${TODAY} ([initiatives_analyzed] initiatives, [artifacts_analyzed] artifacts)"
git push
```

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

### Memory Pointer

Output this lightweight summary at the end for copy-paste into memory:

```
Cross-Initiative Patterns — [date]: [initiatives_analyzed] initiatives, [artifacts_analyzed] artifacts analyzed. [persona_archetypes_found] persona archetypes, [multi_market_competitors] multi-market competitors, [systemic_issues] systemic issues. Top insight: [top_insight]. Stored at intelligence/cross-initiative-patterns/[date].md.
```

---

## Quality Checklist

Before finalizing, verify:
- [ ] Every pattern has 2+ independent sources (single-source findings labeled as "signal, not pattern")
- [ ] Convergence levels labeled on all patterns (STRONG / MODERATE / WEAK)
- [ ] Systemic issues (3+ occurrences) clearly elevated and flagged
- [ ] Bias check completed for decision patterns
- [ ] Exactly 5 institutional insights in synthesis
- [ ] Each insight has confidence level and strategic implication
- [ ] Hidden demand patterns called out explicitly
- [ ] Hypothesis testing has explicit verdicts
- [ ] Intelligence System Health metrics calculated from actual manifest data
- [ ] Recommended next initiatives linked to specific patterns
- [ ] Prior report comparison included if prior reports existed
- [ ] Memory pointer generated

---

## Reference Files

- `references/analysis-templates.md` — Detailed table formats for all 6 analyses
- `references/synthesis-framework.md` — Scoring rubric, health metric thresholds, convergence definitions, prioritization framework
