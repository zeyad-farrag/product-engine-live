# Product Engine — Intelligence Store Architecture

## Overview

Product Engine uses a GitHub repository as its structured intelligence store. Every artifact the system produces — persona cards, competitor profiles, market assessments, decision records — is stored as a markdown file with YAML frontmatter metadata.

Perplexity Computer's persistent memory is used only for lightweight session context and pointers. All structured, retrievable intelligence lives in this repo.

## Repository Structure

```
Product-Engine/
├── _prompts/                    ← Original prompt archive (reference only)
├── _skills/                     ← Skill files
├── foundation/                  ← Foundation Session outputs
│   ├── business-model-summary.md
│   ├── intelligence-readiness.md
│   ├── confidence-map.md
│   └── domains/
│       ├── 01-company-identity.md
│       ├── 02-brand-architecture.md
│       ├── 03-destination-portfolio.md
│       ├── 04-source-markets.md
│       ├── 05-customer-segmentation.md
│       ├── 06-product-structure.md
│       ├── 07-competitive-landscape.md
│       ├── 08-distribution-channels.md
│       ├── 09-data-landscape.md
│       ├── 10-pricing-policies.md
│       ├── 11-strategic-priorities.md
│       └── 12-product-department.md
├── artifacts/                   ← All capability outputs
│   ├── personas/                ← Persona cards
│   ├── competitors/             ← Competitor profiles
│   ├── market-assessments/      ← Market assessment reports
│   ├── demand-signals/          ← Demand signal reports
│   ├── health-checks/           ← Product health assessments
│   ├── gap-analyses/            ← Gap analysis reports
│   └── decision-records/        ← Initiative decision records
├── initiatives/                 ← Initiative tracking
│   ├── active/                  ← In-progress initiatives
│   └── closed/                  ← Completed/rejected initiatives
└── intelligence/                ← Intelligence layer outputs
    ├── _index/                  ← Shared memory index (managed by pe-memory-maintenance)
    │   ├── personas.md
    │   ├── competitors.md
    │   ├── demand-signals.md
    │   ├── health-checks.md
    │   ├── gap-analyses.md
    │   ├── market-assessments.md
    │   ├── decision-records.md
    │   ├── initiatives.md
    │   ├── intelligence-reports.md
    │   └── foundation.md
    ├── portfolio-health/        ← Portfolio health overviews
    ├── signal-detection/        ← Signal detection reports
    ├── cross-initiative-patterns/ ← Pattern mining reports
    └── cross-market-intelligence/ ← Cross-market intelligence reports
```

## Artifact Frontmatter Schema

Every artifact file uses YAML frontmatter for structured metadata. This enables exact retrieval, enumeration, and attribute-based queries.

### Required Fields (all artifact types)

```yaml
---
type: [artifact type]          # See artifact types below
created: YYYY-MM-DD            # Date created
updated: YYYY-MM-DD            # Date last updated
confidence: HIGH | MEDIUM | LOW  # Overall confidence rating
status: active | superseded | archived
author: [email username or display name]
session: [initiative slug or "standalone"]
supersedes: [path to previous version, if first version omit]
depends_on: [list of artifact paths this was derived from]
---
```

#### Extended Fields (added by Memory Management Layer)

- **author**: Who created or last updated this artifact. Defaults to "unknown" for legacy artifacts.
- **session**: The initiative slug that produced this artifact, or "standalone" for ad-hoc work.
- **supersedes**: If this artifact replaces an older version, the relative path to the superseded file. Enables version tracking.
- **depends_on**: List of artifact paths this artifact was derived from. Enables dependency-based staleness detection — if a dependency is updated, downstream artifacts are flagged as potentially stale.

### Artifact Type Schemas

#### Persona Card
```yaml
---
type: persona-card
name: [persona name]           # e.g., "German Leisure Traveler"
market: [source market]        # e.g., "Germany"
segment: [customer segment]    # e.g., "leisure", "luxury", "budget"
destinations: [list]           # e.g., [egypt, jordan]
created: YYYY-MM-DD
updated: YYYY-MM-DD
confidence: HIGH | MEDIUM | LOW
status: active | superseded | archived
initiative: [producing initiative slug or "standalone"]
tags: [list of searchable tags]
---
```

#### Competitor Profile
```yaml
---
type: competitor-profile
name: [competitor name]        # e.g., "TravelCo"
market: [source market]        # Market context for this profile
destinations: [list]           # Destinations they serve
positioning: [brief]           # One-line positioning summary
created: YYYY-MM-DD
updated: YYYY-MM-DD
confidence: HIGH | MEDIUM | LOW
status: active | superseded | archived
initiative: [producing initiative slug or "standalone"]
tags: [list of searchable tags]
---
```

#### Market Assessment
```yaml
---
type: market-assessment
market: [source market]
destinations: [list]           # Destinations assessed for this market
recommendation: ENTER | MONITOR | REJECT
created: YYYY-MM-DD
updated: YYYY-MM-DD
confidence: HIGH | MEDIUM | LOW
status: active | superseded | archived
initiative: [producing initiative slug]
tags: [list of searchable tags]
---
```

#### Demand Signal Report
```yaml
---
type: demand-signal-report
focus: [market, product, or segment]
period: [date range analyzed]
data_source: mysql | manual | mixed
created: YYYY-MM-DD
updated: YYYY-MM-DD
confidence: HIGH | MEDIUM | LOW
status: active | superseded | archived
initiative: [producing initiative slug or "standalone"]
tags: [list of searchable tags]
---
```

#### Product Health Check
```yaml
---
type: health-check
product: [product name or ID]
health_rating: STRONG | STABLE | CONCERNING | CRITICAL | TERMINAL
composite_score: [0-100]
created: YYYY-MM-DD
updated: YYYY-MM-DD
confidence: HIGH | MEDIUM | LOW
status: active | superseded | archived
initiative: [producing initiative slug or "standalone"]
tags: [list of searchable tags]
---
```

#### Gap Analysis
```yaml
---
type: gap-analysis
product: [product name]
target_audience: [audience description]
fit_rating: STRONG_FIT | FIXABLE_FIT | REPOSITIONING_NEEDED | REDESIGN_NEEDED | FUNDAMENTAL_MISMATCH
created: YYYY-MM-DD
updated: YYYY-MM-DD
confidence: HIGH | MEDIUM | LOW
status: active | superseded | archived
initiative: [producing initiative slug or "standalone"]
tags: [list of searchable tags]
---
```

#### Decision Record
```yaml
---
type: decision-record
initiative_type: market-entry | repositioning | product-optimization | new-product-development
subject: [what was decided about]
decision: [outcome — e.g., ENTER, REJECT, OPTIMIZE, REPOSITION, BUILD, SHELVE]
created: YYYY-MM-DD
confidence: HIGH | MEDIUM | LOW
status: active | revisit-triggered | superseded
revisit_triggers: [list of conditions that would warrant re-evaluation]
tags: [list of searchable tags]
---
```

### Initiative State Files

Active and closed initiatives use this frontmatter:

```yaml
---
type: initiative
initiative_type: market-entry | repositioning | product-optimization | new-product-development
subject: [brief description]
phase: frame | discover | decide | confirm | closed
status: active | completed | rejected | monitoring | paused
started: YYYY-MM-DD
updated: YYYY-MM-DD
closed: YYYY-MM-DD            # Only for closed initiatives
decision: [final decision if closed]
artifacts_produced: [list of artifact file paths]
---
```

## File Naming Convention

All artifact filenames use lowercase kebab-case:
- `personas/german-leisure-traveler.md`
- `competitors/travelco-egypt-german-market.md`
- `market-assessments/australia-2026-03.md`
- `demand-signals/egypt-premium-2026-q1.md`
- `health-checks/egypt-classic-tour-2026-03.md`
- `decision-records/market-entry-australia-2026-03.md`

Pattern: `[subject]-[context]-[date-if-versioned].md`

## How Skills Interact With the Repo

### Reading artifacts
```bash
# Read a specific artifact
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/personas/german-leisure-traveler.md

# List all persona cards
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/personas

# Search across artifacts by content
gh search code "market: Germany" --repo zeyad-farrag/Product-Engine
```

### Writing artifacts
Skills write artifacts locally to the cloned repo, then commit and push:
```bash
cd Product-Engine
git add [file]
git commit -m "Product Engine: [artifact type] — [subject]"
git push
```

### Querying frontmatter
To find all artifacts for a specific market:
```bash
grep -rl "market: Germany" artifacts/
```

## Memory Management Layer

The shared memory system has two components: **index files** for fast retrieval and **two management skills** for querying and maintenance.

### Index Files (`intelligence/_index/`)

Ten index files, one per artifact category. Each is a lightweight registry of all artifacts of that type — a markdown table with one row per artifact, extracting key frontmatter fields for fast filtering.

```yaml
---
type: memory-index
category: [e.g., "persona-card"]
artifact_count: [number]
updated: YYYY-MM-DD
---

# [Category] Index

| Path | Subject | Markets | Destinations | Updated | Author | Confidence | Status | Session | Depends On |
|---|---|---|---|---|---|---|---|---|---|
| artifacts/personas/german-leisure-traveler.md | German Leisure Traveler | Germany | Egypt, Jordan | 2026-03-15 | zeyad | HIGH | active | market-entry-germany | — |
```

**How skills use the index:**
- **On startup**: Read the relevant index file(s) instead of scanning directories. Falls back to directory scanning if index doesn't exist yet.
- **On write**: After committing an artifact, update the relevant index file — add/update the row, increment `artifact_count`, update `updated` date, commit and push.

**Index benefits:**
- Single `gh api` call per artifact type instead of listing directory + reading each file
- Cross-artifact queries ("everything about Germany") filter one table per type
- Staleness, coverage, and dependency tracking built into the index structure

### pe-memory-query (Read-Only Retrieval + Synthesis)

Natural language query interface: "What do we know about Germany?"
- Reads all 10 index files
- Filters by query dimensions (market, destination, product, competitor, type, date, confidence)
- Reads matching artifacts in full
- Synthesizes a coherent answer with confidence assessment, staleness flags, and coverage gap identification
- Points to specific pe-* skills for filling identified gaps

### pe-memory-maintenance (Index Management + Hygiene)

Infrastructure layer with 6 modes:
1. **Full Index Rebuild** — scan all directories, rebuild all 10 index files from scratch
2. **Dependency Staleness Detection** — if artifact A depends on artifact B, and B was updated after A, flag A as stale
3. **Orphan Detection** — artifacts not referenced by any initiative, dead index entries
4. **Coverage Report** — markets × artifact types matrix showing DEEP / MODERATE / THIN / BLIND coverage
5. **Consolidation Suggestions** — same competitor in 3+ files, same persona across markets, etc.
6. **Index Validation** — compare index counts against actual directory contents

Recommended cadence: monthly, or after a batch of initiative completions.

### Staleness Model

Two staleness triggers:
- **Time-based**: Artifacts with `updated` > 90 days ago
- **Dependency-based**: Artifacts whose `depends_on` entries have been updated more recently than the artifact itself

Dependency staleness is more precise than time-based — a 30-day-old gap analysis is stale if the persona card it was built from was refreshed yesterday.

## Perplexity Computer Installation Status

All 16 pe-* skills are installed as custom skills on Perplexity Computer. Users invoke skills by name (e.g., "run pe-foundation-session", "competitor benchmarking for Germany"). The skill definitions in `_skills/` are the source of truth — Perplexity Computer reads them directly from this repository.

See `_skills/INSTALLATION_STATUS.md` for the full skill inventory with installation status.

## Perplexity Memory (Lightweight Pointers Only)

Perplexity memory stores only:
- **Foundation pointer**: "Product Engine Foundation is complete. Stored in GitHub repo Product-Engine under foundation/."
- **Session state**: "Last active initiative: Market Entry — Australia, phase: DISCOVER, updated 2026-03-24."
- **User preferences**: Working style, formatting preferences, domain expertise level.

All structured intelligence lives in the repo. Memory is for cross-session continuity, not storage.
