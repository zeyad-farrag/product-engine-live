---
name: pe-memory-maintenance
description: >
  Memory management and index maintenance for the Product Engine system. Use
  when the user mentions "rebuild index", "memory maintenance", "check memory
  health", "what's stale", "coverage report", "memory hygiene", or "validate
  index". Manages the shared intelligence index files, detects time-based and
  dependency-based staleness, finds orphaned artifacts, reports coverage gaps
  across markets and products, and suggests artifact consolidation. Writes
  only to intelligence/_index/ — never modifies artifact content. Recommended
  monthly cadence.
metadata:
  author: Product Engine
  version: '1.0'
  layer: memory
  system: product-engine
  repo: zeyad-farrag/Product-Engine
---

> **Repository Path**: Read from `_config/repo.md`. Current: `zeyad-farrag/Product-Engine`

# pe-memory-maintenance

System administrator skill for the Product Engine intelligence store. Manages
the 10 index files in `intelligence/_index/`, detects staleness and orphans,
reports coverage gaps, and suggests consolidation — without ever touching
artifact content.

## When to Use This Skill

Trigger phrases:
- "Run memory maintenance"
- "Rebuild the index"
- "Check memory health"
- "What's stale?"
- "Coverage report"
- "Memory hygiene"
- "Validate the index"
- "How healthy is our intelligence?"

Recommended cadence: monthly, or after a batch of initiative completions.

## Repo & Tooling

- **Repo**: `zeyad-farrag/Product-Engine`
- **CLI**: `gh` with `api_credentials=["github"]`
- **Index location**: `intelligence/_index/` (10 files)
- **Write scope**: `intelligence/_index/` ONLY — never modify artifact content

## Six Modes of Operation

### Mode 6: Index Validation (Quick Check) — always run first

Compare counts in each index's `artifact_count` frontmatter field against
actual file counts in the corresponding directories.

```bash
# Count files in each artifact directory
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/personas \
  --jq 'length' 2>/dev/null || echo 0
# Repeat for each directory (see full list in maintenance-procedures.md)
```

Read each index file and extract `artifact_count` from its YAML frontmatter:

```bash
gh api repos/zeyad-farrag/Product-Engine/contents/intelligence/_index/personas.md \
  --jq '.content' 2>/dev/null | base64 -d
```

Report any mismatch as **drift**. If drift > 0, offer to run Mode 1 (Full
Index Rebuild).

---

### Mode 1: Full Index Rebuild

Scan every artifact directory, read each artifact's frontmatter, rebuild all
10 index files from scratch. See `references/maintenance-procedures.md` §1 for
the full algorithm.

**Step 1 — Scan all artifact directories (run in parallel where possible):**

```bash
# Artifact directories
for dir in personas competitors demand-signals health-checks gap-analyses \
    market-assessments decision-records; do
  gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/${dir} \
    --jq '[.[] | select(.type=="file") | {name, path}]' \
    2>/dev/null || echo "[]"
done

# Intelligence reports
for dir in portfolio-health signal-detection cross-initiative-patterns cross-market-intelligence; do
  gh api repos/zeyad-farrag/Product-Engine/contents/intelligence/${dir} \
    --jq '[.[] | select(.type=="file") | {name, path}]' \
    2>/dev/null || echo "[]"
done

# Initiatives
for dir in active closed; do
  gh api repos/zeyad-farrag/Product-Engine/contents/initiatives/${dir} \
    --jq '[.[] | select(.type=="file") | {name, path}]' \
    2>/dev/null || echo "[]"
done

# Foundation
gh api repos/zeyad-farrag/Product-Engine/contents/foundation \
  --jq '[.[] | select(.type=="file") | {name, path}]' 2>/dev/null || echo "[]"
gh api repos/zeyad-farrag/Product-Engine/contents/foundation/domains \
  --jq '[.[] | select(.type=="file") | {name, path}]' 2>/dev/null || echo "[]"
```

**Step 2 — Read each artifact's frontmatter:**

```bash
gh api repos/zeyad-farrag/Product-Engine/contents/<path> \
  --jq '.content' | base64 -d | head -30
```

Extract: subject/title, markets, destinations, updated, author, confidence,
status, session, depends_on. Apply defaults for missing fields:
- `author` → `"unknown"`
- `session` → `"standalone"`
- `depends_on` → `"—"`

**Step 3 — Build all 10 index files** using the format in
`references/index-schema.md`. See schema for column layout per index type.

**Step 4 — Write index files via GitHub Contents API (no local clone needed):**

For each of the 10 index files, write via `gh api` PUT:

```bash
# Get current SHA if file exists (needed for update)
CURRENT_SHA=$(gh api repos/zeyad-farrag/Product-Engine/contents/intelligence/_index/[index-name].md \
  --jq '.sha' 2>/dev/null || echo "")

# Write/update index file
echo '[index content]' | base64 -w0 | gh api repos/zeyad-farrag/Product-Engine/contents/intelligence/_index/[index-name].md \
  --method PUT \
  --field message="Product Engine: memory maintenance — [date] (rebuild [index-name] index)" \
  --field content=@- \
  ${CURRENT_SHA:+--field sha="$CURRENT_SHA"}
```

Repeat for each index file: `personas.md`, `competitors.md`, `demand-signals.md`,
`health-checks.md`, `gap-analyses.md`, `market-assessments.md`, `decision-records.md`,
`initiatives.md`, `intelligence-reports.md`, `foundation.md`.

---

### Mode 2: Dependency Staleness Detection

For each artifact with a non-empty `depends_on` list, check whether any
dependency's `updated` date is AFTER this artifact's `updated` date.

Algorithm:
1. Collect all `depends_on` entries across all artifacts (from the index or
   from frontmatter directly)
2. Build a lookup: `path → updated_date`
3. For each artifact with dependencies, compare dates

**Flag as "dependency-stale"** if `dependency.updated > artifact.updated`.

Also flag as **"time-stale"** if `artifact.updated` is > 90 days before today.

Present findings as a table:

```
| Artifact | Updated | Stale Dependency | Dependency Updated | Action |
|---|---|---|---|---|
| artifacts/gap-analyses/egypt-vs-german.md | 2026-01-15 | artifacts/personas/german-leisure.md | 2026-03-10 | Re-run pe-gap-analysis |
```

Map artifact types to suggested actions:
- gap-analyses → `pe-gap-analysis`
- health-checks → `pe-product-health-check`
- market-assessments → `pe-market-entry`
- decision-records → manually created (no generating skill)
- intelligence reports → `pe-cross-initiative-patterns` / `pe-signal-detection`

See `references/maintenance-procedures.md` §2 for full staleness logic.

---

### Mode 3: Orphan Detection

Find artifacts that are disconnected from the active intelligence graph.

**Orphan types** (details in `references/maintenance-procedures.md` §3):
1. Artifacts not referenced by any initiative state file
2. Artifacts with `status: superseded` and no successor linked via `supersedes`
3. Index entries whose file path no longer exists in the repo
4. Files in artifact directories not present in any index

Present a table with orphan type, path, last updated, and recommended action
(archive, delete, or add to initiative).

---

### Mode 4: Coverage Report

Build two coverage matrices and compute depth scores.

**Matrix 1 — Markets × Artifact Types:**

| Market | Personas | Competitors | Demand Signals | Health Checks | Gap Analyses | Market Assessments |
|---|---|---|---|---|---|---|
| Germany | 3 | 5 | 1 | 2 | 1 | 1 |
| Australia | 0 | 0 | 0 | 0 | 0 | 0 |

**Matrix 2 — Products/Destinations × Artifact Types** (same structure).

**Depth scoring** per market/product:
- **DEEP**: 4+ artifact types covered, all updated within 90 days, at least
  one HIGH confidence artifact
- **MODERATE**: 2–3 artifact types covered, some gaps or stale entries
- **THIN**: Only 1 artifact type with any coverage
- **BLIND**: 0 artifacts for this market/product

Derive markets and destinations from index table columns (Markets, Destinations).
See `references/maintenance-procedures.md` §4 for full scoring rubric.

---

### Mode 5: Consolidation Suggestions

Detect redundancy patterns and suggest consolidation tasks.

**Detection rules:**
1. Same competitor name (case-insensitive) in 3+ competitor files → suggest
   canonical profile merge (tag: `pe-competitor-benchmarking`)
2. Same persona archetype across 3+ markets → suggest archetype elevation
   (tag: `pe-cross-initiative-patterns`)
3. Multiple demand signal reports with same `subject` + overlapping date
   period → suggest trend synthesis (tag: `pe-signal-detection`)
4. Decision records where `markets` and `subject` overlap but conclusions
   contradict → flag for human review

Present each suggestion with: pattern type, affected files, suggested action,
and which pe-skill to run.

See `references/maintenance-procedures.md` §5 for full detection patterns.

---

### Full Maintenance Run

When trigger is "run memory maintenance", "check memory health", or
"memory hygiene", execute ALL modes in sequence:

1. Mode 6 — Index Validation
2. Mode 1 — Full Index Rebuild (only if drift detected)
3. Mode 2 — Dependency Staleness Detection
4. Mode 3 — Orphan Detection
5. Mode 4 — Coverage Report
6. Mode 5 — Consolidation Suggestions

Then present the **Memory Health Dashboard**:

```
═══════════════════════════════════════
MEMORY HEALTH DASHBOARD — [YYYY-MM-DD]
═══════════════════════════════════════

Total artifacts: [N]
Index status: [VALID / REBUILT / N drift(s) corrected]
Time-stale (>90 days): [N] artifacts
Dependency-stale: [N] artifacts
Orphaned: [N] artifacts
Coverage depth: [N] DEEP / [N] MODERATE / [N] THIN / [N] BLIND markets

Top issues:
1. [Most important finding]
2. [Second most important]
3. [Third most important]

Recommended actions:
1. [Specific action] → run [pe-skill]
2. [Specific action] → run [pe-skill]
═══════════════════════════════════════
```

## Index File Map

| Index File | Artifact Source Directories |
|---|---|
| `personas.md` | `artifacts/personas/` |
| `competitors.md` | `artifacts/competitors/` |
| `demand-signals.md` | `artifacts/demand-signals/` |
| `health-checks.md` | `artifacts/health-checks/` |
| `gap-analyses.md` | `artifacts/gap-analyses/` |
| `market-assessments.md` | `artifacts/market-assessments/` |
| `decision-records.md` | `artifacts/decision-records/` |
| `initiatives.md` | `initiatives/active/`, `initiatives/closed/` |
| `intelligence-reports.md` | `intelligence/portfolio-health/`, `intelligence/signal-detection/`, `intelligence/cross-initiative-patterns/`, `intelligence/cross-market-intelligence/` |
| `foundation.md` | `foundation/`, `foundation/domains/` |

## Reference Files

- `references/index-schema.md` — Complete schema for all 10 index files,
  column definitions, frontmatter format, and example rows per artifact type.
  Read when building or validating index files.

- `references/maintenance-procedures.md` — Detailed procedures for all 6
  modes: rebuild algorithm, staleness detection logic, orphan detection rules,
  coverage scoring rubric, consolidation detection patterns, and validation
  comparison algorithm. Read when executing any maintenance mode.

## Constraints

- **Never modify artifact content** — read-only access to all directories
  except `intelligence/_index/`
- Write scope is strictly `intelligence/_index/` (10 files only)
- Always show what you're about to write before committing
- If an index directory doesn't exist yet, create it via the GitHub API PUT
  (writing the first file creates the directory implicitly)
