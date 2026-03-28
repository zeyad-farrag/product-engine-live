---
name: pe-memory-query
description: >
  Natural language retrieval and synthesis across all Product Engine
  intelligence. Use when the user asks "what do we know about [X]?", "search
  memory", "query memory", "brief me on [X]", "what intelligence do we have
  on [market/product/competitor]?", or "summarize everything about [X]".
  Reads all artifact index files, filters by query dimensions (market,
  destination, product, competitor, type, date, confidence), retrieves
  matching artifacts, and synthesizes a coherent answer with confidence
  assessment, staleness flags, and coverage gap identification. Read-only —
  does not write artifacts. Points to specific pe-* skills for filling gaps.
metadata:
  author: Product Engine
  version: '1.0'
  layer: memory
  system: product-engine
  repo: zeyad-farrag/Product-Engine
---

> **Repository Path**: Read from `_config/repo.md`. Current: `zeyad-farrag/Product-Engine`

# pe-memory-query

Natural language intelligence retrieval across all Product Engine artifacts. This skill answers "what do we know about X?" questions.

**This skill is strictly read-only with respect to the intelligence store. It never writes, updates, or creates artifacts in `foundation/`, `intelligence/`, `initiatives/`, or `artifacts/`.** Output delivery (e.g., formatting query results for the user) is not considered a "write" in this context.

## Trigger Phrases

- "What do we know about [X]?"
- "Memory query" / "search memory" / "query memory"
- "What intelligence do we have on [market/product/competitor]?"
- "Summarize everything about [X]"
- "What's our knowledge state for [X]?"
- "Brief me on [X]"
- "What did we learn about [X]?"

## Workflow

### Step 1 — Read All Index Files in Parallel

Read all 10 index files simultaneously using `gh` CLI with `api_credentials=["github"]`:

```bash
for idx in personas competitors demand-signals health-checks gap-analyses \
           market-assessments decision-records initiatives intelligence-reports foundation; do
  echo "=== $idx ===" && \
  gh api repos/zeyad-farrag/Product-Engine/contents/intelligence/_index/${idx}.md \
    --jq '.content' 2>/dev/null | base64 -d
done
```

Run this as a single shell script (all 10 reads happen in sequence inside the loop, but invoke it as one `bash` call so it's one tool use). Capture all output for parsing in the next step.

**If index files return 404 or error:** Fall back to directory scanning — see `references/index-fallback.md`. Inform the user:

> "Index files not found — scanning directories directly. Run pe-memory-maintenance to build the index for faster queries."

### Step 2 — Parse the Query

Identify filter dimensions from the user's natural language. See `references/query-patterns.md` for detailed pattern matching logic and examples.

| Dimension | Examples |
|---|---|
| Market (source) | "Germany", "Australia", "UK", "German" |
| Destination | "Egypt", "Jordan", "Egypt products" |
| Product | specific product name |
| Competitor | specific competitor name |
| Artifact type | "personas", "competitors", "health checks", "gap analyses" |
| Date range | "last 3 months", "since January", "recent" |
| Confidence | "high confidence only", "confident findings" |
| Initiative | "from the Germany market entry", session slug |

Multiple dimensions can combine: "What do we know about Egypt products for the German market?" → Market=Germany, Destination=Egypt.

### Step 3 — Filter Index Rows

For each index file parsed in Step 1, filter rows where any column matches the identified dimensions. Matching logic:

- **Market**: check the `Markets` column for the market name (case-insensitive substring match)
- **Destination**: check the `Destinations` column
- **Artifact type**: only include rows from the matching index file(s)
- **Date range**: compare `Updated` column against the range
- **Confidence**: filter rows where `Confidence` matches requested level
- **Initiative**: match `Session` column against the initiative slug
- **Competitor/Product**: match against `Subject` column

Collect all matching rows with their full metadata (path, subject, markets, destinations, updated, confidence, status, session, depends_on).

**Scale decision:**
- **< 20 matches**: Read each artifact in full (Step 3a)
- **≥ 20 matches**: Summarize from index metadata only, then offer to deep-dive specific types (Step 3b)

#### Step 3a — Full Artifact Retrieval (< 20 matches)

For each matching path, fetch the full artifact:

```bash
gh api repos/zeyad-farrag/Product-Engine/contents/[path] \
  --jq '.content' | base64 -d
```

Run fetches in a loop or as parallel bash calls.

#### Step 3b — Index-Only Summary (≥ 20 matches)

Work from index metadata alone. Present a count-level summary by type and offer:

> "Found 23 matching artifacts across 6 types. Showing index-level summary. Which type would you like me to deep-dive into?"

### Step 4 — Synthesize the Answer

Produce the structured answer below. Follow the synthesis rules from `references/query-patterns.md`.

```markdown
## What We Know About [Subject]

### Intelligence Summary
[2–3 sentence overview of the system's knowledge on this subject — total artifact count, types covered, date range, overall confidence.]

### By Artifact Type

#### Personas ([count])
[Narrative summary — key archetypes, segments, markets covered, what they tell us.]
- [Persona Name] — [market] — [confidence] — updated [date] — `[path]`

#### Competitors ([count])
[Narrative summary — key players, positioning, gaps identified.]
- [Competitor Name] — [market] — [confidence] — updated [date] — `[path]`

#### Demand Signals ([count])
[Narrative summary — trends, growth/decline patterns.]
- [Subject] — [market] — [confidence] — updated [date] — `[path]`

#### Health Checks ([count])
[Narrative summary — product health states, scores.]
- [Subject] — [destination] — [confidence] — updated [date] — `[path]`

#### Gap Analyses ([count])
[Narrative summary — key gaps, fit ratings.]
- [Subject] — [market→destination] — [confidence] — updated [date] — `[path]`

#### Market Assessments ([count])
[Narrative summary — recommendations, scores.]
- [Subject] — [market] — [confidence] — updated [date] — `[path]`

#### Decision Records ([count])
[Narrative summary — decisions made, outcomes, what changed.]
- [Subject] — [session] — [confidence] — updated [date] — `[path]`

#### Intelligence Reports ([count])
[Narrative summary — report type, key findings.]
- [Subject] — [type] — [confidence] — updated [date] — `[path]`

#### Initiatives ([count])
[Narrative summary — active/completed initiatives, objectives.]
- [Subject] — [status] — updated [date] — `[path]`

#### Foundation ([count])
[Narrative summary — foundation context files relevant to query.]
- [Subject] — updated [date] — `[path]`

### Confidence Assessment
| Domain | Level | Basis |
|---|---|---|
| [domain/topic] | HIGH/MEDIUM/LOW | [artifact count, recency, corroboration] |

### Stale Intelligence
[List artifacts matching the query that are either:
- Updated > 90 days ago (time-stale)
- Have a dependency updated AFTER this artifact (dependency-stale)]

If none: "No stale intelligence found for this query."

### Coverage Gaps
[Artifact types with NO matches for this query — the "what we don't know" section.]

- No [type] found for [query subject] — consider running `[pe-skill]`

Gap-to-skill mapping:
- No personas → run `pe-persona-definition`
- No competitor profiles → run `pe-competitor-benchmarking`
- No demand signals → run `pe-demand-signal-mining`
- No health checks → run `pe-product-health-check`
- No gap analyses → run `pe-gap-analysis`
- No market assessments → run `pe-market-entry`
- No decision records → [decisions haven't been logged yet]

### Dependency Map
[Show which artifacts depend on which, within the result set. Flag if a depended-upon artifact is stale.]

Example:
- `artifacts/gap-analyses/germany-nile-cruise.md` depends on:
  - `artifacts/personas/german-leisure-traveler.md` ✓ current
  - `artifacts/health-checks/nile-cruise-2026-03.md` ⚠ stale (dependency updated after this artifact)
```

### Step 5 — Follow-up Options

After presenting the synthesis, always offer:

```
Want me to:
1. Deep-dive into any specific artifact?
2. Run [specific pe-* skill] to fill the gaps identified?
3. Compare this against [another market/product]?
4. Show the full dependency chain for a specific artifact?
```

## Synthesis Quality Rules

- **Cite every finding** with its artifact path using backtick formatting: `artifacts/personas/german-leisure-traveler.md`
- **Synthesize, don't list**: when multiple artifacts cover the same topic, find the coherent story across them
- **Surface contradictions**: if two artifacts disagree (e.g., two health checks give conflicting scores), call it out explicitly rather than picking one
- **Confidence calibration**: HIGH = multiple corroborating artifacts; MEDIUM = single artifact with good methodology; LOW = single artifact, old data, or incomplete sourcing
- **Gaps are valuable**: missing coverage is intelligence too — always surface what we don't know
- **Superseded artifacts**: if `Status=superseded`, note it and prefer the successor; include the older one only for historical context
- **Active vs. archived**: weight `Status=active` artifacts more heavily in synthesis; flag `Status=archived` clearly

## Reference Files

- `references/query-patterns.md` — Query pattern matching, synthesis templates for market/product/competitor/initiative-focused queries, contradiction handling, dependency mapping logic
- `references/index-fallback.md` — Directory scanning fallback when index files don't exist, all `gh api` calls needed per artifact type
