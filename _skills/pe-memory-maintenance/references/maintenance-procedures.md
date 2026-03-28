# Maintenance Procedures Reference

Detailed procedures for each of the 6 maintenance modes.

---

## §1 — Full Index Rebuild Algorithm

### When to Run
- Triggered by: "rebuild the index", first-time setup
- Auto-triggered by full maintenance run when Mode 6 finds drift > 0

### Algorithm

```
REBUILD_ALL_INDEXES():

  1. SCAN all artifact directories (see directory map below)
     - For each directory: gh api GET contents/<dir>
     - Collect list of {name, path} for all files with .md extension

  2. READ each artifact's frontmatter
     - gh api GET contents/<path> --jq '.content' | base64 -d
     - Parse YAML frontmatter block (between --- delimiters)
     - Extract: title/subject, markets, destinations, updated, author,
       confidence, status, session, supersedes, depends_on
     - Apply defaults for missing fields (see index-schema.md §Extended)

  3. GROUP artifacts by index file
     - artifacts/personas/* → personas.md
     - artifacts/competitors/* → competitors.md
     - artifacts/demand-signals/* → demand-signals.md
     - artifacts/health-checks/* → health-checks.md
     - artifacts/gap-analyses/* → gap-analyses.md
     - artifacts/market-assessments/* → market-assessments.md
     - artifacts/decision-records/* → decision-records.md
     - initiatives/active/* + initiatives/closed/* → initiatives.md
     - intelligence/portfolio-health/* +
       intelligence/signal-detection/* +
       intelligence/cross-initiative-patterns/* +
       intelligence/cross-market-intelligence/* → intelligence-reports.md
     - foundation/* + foundation/domains/* → foundation.md

  4. BUILD each index file
     - Frontmatter: type, category, artifact_count, updated (today)
     - Header row + separator row
     - One row per artifact, sorted by Updated DESC
     - Use schema from references/index-schema.md for column order

  5. WRITE to intelligence/_index/
     - For each index file: GET sha if exists, then PUT with content
     - Show preview of each file before writing
     - Report count of rows written per index

  6. COMMIT
     - git add intelligence/_index/
     - Commit message: "Product Engine: memory maintenance — YYYY-MM-DD
       (N artifacts indexed)"
     - git push
     (If operating via API only, each PUT call is its own commit)
```

### Directory Scan Map

| Index File | Directories to Scan |
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
| `foundation.md` | `foundation/` (files only), `foundation/domains/` |

### API Rate Limit Management

Each artifact requires 1 API call to read frontmatter. With 50+ artifacts,
batch the reads: process one directory at a time, parse results, then move
to the next. Do not fire all calls in one burst.

### Discrepancy Reporting

After rebuild, report:
- N artifacts indexed across 10 index files
- Any artifact whose frontmatter was missing required fields (list them)
- Any files found in directories that had no frontmatter (just raw content)
- Differences from previous artifact_count values per index

---

## §2 — Staleness Detection Logic

### Time-Based Staleness

**Rule**: Any artifact where `updated` is more than 90 days before today.

```python
from datetime import date, timedelta

STALE_THRESHOLD_DAYS = 90
today = date.today()
stale_cutoff = today - timedelta(days=STALE_THRESHOLD_DAYS)

for artifact in all_artifacts:
    if artifact.updated < stale_cutoff:
        flag(artifact, "time-stale",
             f"{(today - artifact.updated).days} days old")
```

### Dependency-Based Staleness

**Rule**: An artifact is "dependency-stale" if ANY of its `depends_on`
entries has an `updated` date that is AFTER this artifact's own `updated`
date.

```
DETECT_DEPENDENCY_STALENESS(all_artifacts):

  1. Build lookup: path → updated_date
     {
       "artifacts/personas/german-leisure-traveler.md": date(2026, 3, 10),
       "artifacts/health-checks/egypt-classic-2026-03.md": date(2026, 3, 15),
       ...
     }

  2. For each artifact with non-empty depends_on:
     for dep_path in artifact.depends_on:
       dep_updated = lookup.get(dep_path)
       if dep_updated is None:
         flag(artifact, "missing-dependency", dep_path)
       elif dep_updated > artifact.updated:
         flag(artifact, "dependency-stale",
              dep_path, dep_updated, artifact.updated)

  3. Return list of {artifact, flag_type, stale_dep, dep_updated, artifact_updated}
```

### Staleness Output Table

```
| Artifact | Updated | Stale Dependency | Dependency Updated | Days Behind | Suggested Action |
|---|---|---|---|---|---|
| artifacts/gap-analyses/egypt-vs-german.md | 2026-01-15 | artifacts/personas/german-leisure.md | 2026-03-10 | 54 | Re-run pe-gap-analysis |
```

### Artifact Type → Suggested Action Mapping

| Artifact Directory | Skill to Suggest |
|---|---|
| `artifacts/gap-analyses/` | `pe-gap-analysis` |
| `artifacts/health-checks/` | `pe-product-health-check` |
| `artifacts/market-assessments/` | `pe-market-entry` |
| `artifacts/decision-records/` | manually created (no generating skill) |
| `artifacts/competitors/` | `pe-competitor-benchmarking` |
| `artifacts/demand-signals/` | `pe-signal-detection` |
| `intelligence/cross-initiative-patterns/` | `pe-cross-initiative-patterns` |
| `intelligence/portfolio-health/` | `pe-cross-initiative-patterns` |
| `intelligence/signal-detection/` | `pe-signal-detection` |

### Priority Ordering

Sort staleness report by priority:
1. Dependency-stale artifacts that are also time-stale (worst)
2. Dependency-stale artifacts (inputs changed, output outdated)
3. Time-stale artifacts (just old)

Within each group, sort by staleness severity (most days behind first).

---

## §3 — Orphan Detection Rules

### Orphan Type 1: Unreferenced by Any Initiative

An artifact is considered unreferenced if:
- Its path does not appear in any `depends_on` list of any other artifact
- Its `session` field is `"standalone"` AND it is not listed as a produced
  artifact in any initiative state file

Detection algorithm:
```
1. Collect all paths mentioned in depends_on across all artifacts
   referenced_paths = set(all dep_path for all artifacts)

2. Read all initiative state files (initiatives/active/* + initiatives/closed/*)
   Extract any artifact paths listed under "produced artifacts" or "key artifacts"

3. For each artifact:
   if artifact.path not in referenced_paths
   and artifact.path not in initiative_artifact_lists:
     flag(artifact, "unreferenced")
```

**Recommendation**: Archive unreferenced artifacts older than 180 days.
Keep unreferenced artifacts newer than 90 days (may still be in use).

### Orphan Type 2: Superseded with No Successor

An artifact with `status: superseded` should have at least one other artifact
that references it via `supersedes: <this-path>`. If no such reference exists,
the superseded artifact is a dead end.

Detection:
```
1. Collect all paths in supersedes fields across all artifacts
   has_successor = set(all supersedes_path for all artifacts)

2. For each artifact with status == "superseded":
   if artifact.path not in has_successor:
     flag(artifact, "superseded-no-successor")
```

**Recommendation**: Verify if the superseding artifact exists elsewhere
(perhaps with a different path), or archive this artifact.

### Orphan Type 3: Dead Index References

Index entries pointing to files that no longer exist in the repo.

Detection:
```
1. actual_files = set of all .md file paths found during directory scan

2. For each row in each index:
   if row.path not in actual_files:
     flag(row, "dead-reference", index_file=which_index)
```

**Recommendation**: Remove dead rows from the index (done automatically
during Full Index Rebuild).

### Orphan Type 4: Unindexed Files

Files present in artifact directories but absent from the corresponding
index file.

Detection:
```
1. For each directory:
   actual = set of paths from directory scan
   indexed = set of paths from corresponding index table

2. unindexed = actual - indexed
   For each path in unindexed:
     flag(path, "unindexed-file", directory=dir)
```

**Recommendation**: Run Full Index Rebuild to include these files.

### Orphan Detection Output Table

```
| Type | Path | Updated | Recommendation |
|---|---|---|---|
| Unreferenced | artifacts/personas/old-persona.md | 2025-06-01 | Archive (>180 days, unreferenced) |
| Superseded No Successor | artifacts/health-checks/egypt-v1.md | 2025-09-01 | Verify or archive |
| Dead Reference | artifacts/demand-signals/uk-winter.md | — | Remove from index (file deleted) |
| Unindexed File | artifacts/competitors/new-entrant.md | 2026-03-22 | Add to index (run rebuild) |
```

---

## §4 — Coverage Scoring Rubric

### Data Collection

For each market and destination that appears in any index:
1. Collect the distinct artifact types present (from which index file the
   row belongs to)
2. Collect the max `updated` date for that market/destination per type
3. Collect the max confidence level per type

### Depth Score Calculation

```
SCORE(market_or_destination):

  types_covered = count of distinct artifact types with at least 1 row
    for this market or destination

  all_fresh = True if ALL artifacts for this entity are updated within
    90 days of today

  has_high_confidence = True if any artifact for this entity has
    confidence == "HIGH"

  score =
    DEEP     if types_covered >= 4 AND all_fresh AND has_high_confidence
    MODERATE if types_covered in [2, 3] OR (types_covered >= 4 AND NOT all_fresh)
    THIN     if types_covered == 1
    BLIND    if types_covered == 0
```

### Artifact Types for Coverage Counting

The 6 primary analytical types counted for coverage:

1. Personas
2. Competitors
3. Demand Signals
4. Health Checks
5. Gap Analyses
6. Market Assessments

Decision records and intelligence reports are tracked separately and noted
as "bonus coverage" (not counted in depth score calculation).

### Coverage Matrix Build

```
MARKETS_COVERAGE_MATRIX():

  1. Extract unique market values from all 6 primary index tables
     Normalize: strip whitespace, title-case

  2. For each market:
     For each artifact type (columns):
       count = number of active rows where Markets contains this market

  3. Compute depth score per market (see algorithm above)

  4. Return matrix + depth column
```

### Coverage Report Output

```
MARKETS × ARTIFACT TYPES:

| Market   | Personas | Competitors | Demand Signals | Health Checks | Gap Analyses | Market Assessments | Depth |
|----------|----------|-------------|----------------|---------------|--------------|-------------------|-------|
| Germany  |    3     |      5      |       1        |       2       |      1       |         1         | DEEP  |
| UK       |    1     |      2      |       0        |       1       |      0       |         0         | THIN  |
| Australia|    0     |      0      |       0        |       0       |      0       |         0         | BLIND |


DESTINATIONS × ARTIFACT TYPES:

| Destination | Personas | Competitors | Demand Signals | Health Checks | Gap Analyses | Market Assessments | Depth |
|-------------|----------|-------------|----------------|---------------|--------------|-------------------|-------|
| Egypt       |    4     |      6      |       2        |       3       |      2       |         2         | DEEP  |
| Jordan      |    1     |      1      |       0        |       0       |      1       |         0         | THIN  |

Summary:
  DEEP: 1 market, 1 destination
  MODERATE: 0 markets, 0 destinations
  THIN: 1 market, 1 destination
  BLIND: 1 market, 0 destinations
```

---

## §5 — Consolidation Detection Patterns

### Pattern 1: Duplicate Competitor Profiles

**Detection:**
```
1. From competitors index, extract competitor brand name from Subject
   Parse: "Brand Name (Market)" → brand_name = "Brand Name"
   Or use direct subject matching (case-insensitive)

2. Group competitor rows by normalized brand_name

3. If group size >= 3:
   flag("competitor-consolidation", brand_name, list_of_paths)
```

**Suggestion output:**
```
COMPETITOR CONSOLIDATION: Intrepid Travel
  Profiles: artifacts/competitors/intrepid-australia.md,
            artifacts/competitors/intrepid-egypt.md,
            artifacts/competitors/intrepid-jordan.md
  → Run pe-competitor-benchmarking with "create canonical profile" mode
```

### Pattern 2: Persona Archetype Elevation

**Detection:**
```
1. From personas index, extract archetype name from Subject
   Look for common words that suggest shared archetype:
   "German Leisure Traveler", "UK Leisure Traveler", "French Leisure Traveler"
   → archetype = "Leisure Traveler"

2. Group personas by archetype keyword (normalize, remove market prefix/suffix)

3. If group size >= 3:
   flag("archetype-elevation", archetype, list_of_markets, list_of_paths)
```

**Suggestion output:**
```
ARCHETYPE ELEVATION: "Luxury Heritage Traveler"
  Instances: Germany, UK, France (3 markets)
  Paths: [list]
  → Run pe-cross-initiative-patterns to create cross-market archetype
```

### Pattern 3: Duplicate Demand Signal Reports

**Detection:**
```
1. From demand-signals index, parse Subject for focus topic and period
   e.g., "Germany→Egypt Winter Demand 2026" → {source: Germany,
   dest: Egypt, topic: Winter Demand, year: 2026}

2. Group by (source_market, destination, normalized_topic)

3. If group size >= 2 for same period (within same calendar quarter):
   flag("signal-consolidation", topic, list_of_paths)
```

**Suggestion output:**
```
SIGNAL CONSOLIDATION: Germany→Egypt Demand (Q1 2026)
  Overlapping reports:
    artifacts/demand-signals/germany-egypt-jan-2026.md (2026-01-15)
    artifacts/demand-signals/germany-egypt-feb-2026.md (2026-02-20)
  → Run pe-signal-detection to synthesize into quarterly trend report
```

### Pattern 4: Contradictory Decision Records

**Detection:**
```
1. From decision-records index, group rows by overlapping Markets + Subject keywords

2. For pairs with same markets and similar subject:
   Read both decision record files
   Look for explicit contradiction signals:
     - "do not enter" vs "enter now"
     - conflicting timeline recommendations (Q1 vs Q3)
     - contradictory investment amounts

3. Flag pairs/groups for human review
```

**Note**: Full contradiction detection requires reading artifact content.
This is a read-only operation within pe-memory-maintenance's scope.

**Suggestion output:**
```
CONTRADICTORY DECISIONS: Germany Market Entry Timing
  artifacts/decision-records/germany-timing-jan.md → "Enter Q2 2026"
  artifacts/decision-records/germany-timing-mar.md → "Delay to Q4 2026"
  → Human review required. Escalate to team before acting on either.
```

### Consolidation Output Format

Present all consolidation suggestions in one table after pattern detection:

```
| Pattern | Subject | Count | Paths | Suggested Action |
|---|---|---|---|---|
| Competitor Consolidation | Intrepid Travel | 3 | [list] | pe-competitor-benchmarking (canonical) |
| Archetype Elevation | Leisure Traveler | 4 markets | [list] | pe-cross-initiative-patterns |
| Signal Consolidation | Germany→Egypt Q1 2026 | 2 | [list] | pe-signal-detection (quarterly) |
| Contradictory Decisions | Germany Timing | 2 | [list] | Human review |
```

---

## §6 — Index Validation Comparison Algorithm

### Overview

Fast check: compare `artifact_count` field in each index's frontmatter
against the actual count of `.md` files in the corresponding directories.

### Algorithm

```
VALIDATE_INDEXES():

  mismatches = []

  for each (index_file, directories_to_scan) in INDEX_MAP:

    1. GET index file frontmatter
       expected_count = parse artifact_count from YAML

    2. For each directory in directories_to_scan:
       actual_count += len(gh api GET contents/<dir> | filter .md files)

    3. drift = actual_count - expected_count

    4. if drift != 0:
       mismatches.append({
         index: index_file,
         expected: expected_count,
         actual: actual_count,
         drift: drift,
         direction: "over-counted" if drift < 0 else "under-counted"
       })

  return mismatches
```

### Validation Output

If all indexes match:
```
✓ Index validation passed — all 10 indexes match directory counts.
  Total artifacts: N
```

If mismatches found:
```
⚠ Index drift detected:

| Index | Expected Count | Actual Count | Drift |
|---|---|---|---|
| personas.md | 4 | 5 | +1 (under-counted) |
| competitors.md | 8 | 6 | -2 (over-counted — dead refs) |

Total drift: 3 entries. Recommend running Full Index Rebuild.
```

### When Index Doesn't Exist

If `gh api GET intelligence/_index/<file>` returns 404:
- Report: "Index not found — first-time setup required"
- Recommend: Full Index Rebuild
- Do not treat as drift (it's expected for first run)

### Edge Cases

- **Empty directory**: `artifact_count: 0` is valid. Both expected and actual
  should be 0. No drift.
- **Non-.md files**: Ignore files without `.md` extension in artifact dirs
  (e.g., `.gitkeep`, `README.md` at directory level — use judgment).
- **Subdirectories returned by API**: Filter to `type == "file"` only.

---

## Commit Strategy

All writes go through the GitHub Contents API (no local clone required).

### Single Index Update (after incremental changes)
```bash
# Get current SHA
SHA=$(gh api repos/zeyad-farrag/Product-Engine/contents/intelligence/_index/<file>.md \
  --jq '.sha' 2>/dev/null)

# Encode content
ENCODED=$(echo "$CONTENT" | base64 -w0)

# Update or create
if [ -n "$SHA" ]; then
  gh api repos/zeyad-farrag/Product-Engine/contents/intelligence/_index/<file>.md \
    -X PUT \
    -f message="Product Engine: update <category> index" \
    -f content="$ENCODED" \
    -f sha="$SHA"
else
  gh api repos/zeyad-farrag/Product-Engine/contents/intelligence/_index/<file>.md \
    -X PUT \
    -f message="Product Engine: create <category> index" \
    -f content="$ENCODED"
fi
```

### Full Rebuild Commit Message Format
```
Product Engine: memory maintenance — YYYY-MM-DD (N artifacts indexed)
```

### Incremental Index Update Commit Message Format
```
Product Engine: update [category] index
```
