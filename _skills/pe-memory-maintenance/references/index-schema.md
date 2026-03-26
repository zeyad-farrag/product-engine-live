# Index Schema Reference

Complete schema for all 10 index files in `intelligence/_index/`.

---

## Frontmatter Format (all index files)

```yaml
---
type: memory-index
category: [artifact-type-slug]
artifact_count: [integer]
updated: YYYY-MM-DD
---
```

| Field | Type | Description |
|---|---|---|
| `type` | string | Always `memory-index` |
| `category` | string | Artifact type slug (see per-index sections below) |
| `artifact_count` | integer | Number of rows in the table body |
| `updated` | date | ISO date of last index rebuild/update |

---

## Standard Column Definitions

These columns appear in most index tables:

| Column | Source Frontmatter Field | Description | Default if Missing |
|---|---|---|---|
| Path | (file path in repo) | Relative path from repo root | — |
| Subject | `title` or `subject` | Human-readable artifact name | filename (no extension) |
| Markets | `markets` | Source/origin markets, comma-separated | — |
| Destinations | `destinations` | Travel destinations covered, comma-separated | — |
| Updated | `updated` | Last update date YYYY-MM-DD | file commit date |
| Author | `author` | Creator/last updater (email username or display name) | `unknown` |
| Confidence | `confidence` | `HIGH` / `MEDIUM` / `LOW` | `MEDIUM` |
| Status | `status` | `active` / `superseded` / `archived` | `active` |
| Session | `session` | Initiative slug that produced it, or `standalone` | `standalone` |
| Depends On | `depends_on` | Comma-separated artifact paths, or `—` | `—` |

---

## Extended Frontmatter Fields

All artifact types support these optional fields (added in memory layer v2):

```yaml
author: zeyad                         # email username or display name
session: market-entry-germany-2026    # initiative slug or "standalone"
supersedes: artifacts/personas/german-leisure-traveler-v1.md  # omit if first version
depends_on:
  - artifacts/personas/german-leisure-traveler.md
  - artifacts/health-checks/egypt-classic-2026-03.md
```

Backward compatibility: all four fields are optional. During index rebuild,
pe-memory-maintenance applies these defaults for any missing fields:
- `author` → `"unknown"`
- `session` → `"standalone"`
- `supersedes` → omit from index row (not a table column)
- `depends_on` → `"—"` (dash in table)

---

## 1. personas.md

**Category slug**: `persona-card`
**Source**: `artifacts/personas/`

### Full Schema

```yaml
---
type: memory-index
category: persona-card
artifact_count: 4
updated: 2026-03-24
---

# Persona Index

| Path | Subject | Markets | Destinations | Updated | Author | Confidence | Status | Session | Depends On |
|---|---|---|---|---|---|---|---|---|---|
| artifacts/personas/german-leisure-traveler.md | German Leisure Traveler | Germany | Egypt, Jordan | 2026-03-15 | zeyad | HIGH | active | market-entry-germany | — |
| artifacts/personas/australian-adventure-seeker.md | Australian Adventure Seeker | Australia | Egypt | 2026-02-10 | zeyad | MEDIUM | active | standalone | — |
```

**Notes**: `depends_on` is typically `—` for personas — they are primary
research artifacts.

---

## 2. competitors.md

**Category slug**: `competitor-profile`
**Source**: `artifacts/competitors/`

### Full Schema

```yaml
---
type: memory-index
category: competitor-profile
artifact_count: 5
updated: 2026-03-24
---

# Competitors Index

| Path | Subject | Markets | Destinations | Updated | Author | Confidence | Status | Session | Depends On |
|---|---|---|---|---|---|---|---|---|---|
| artifacts/competitors/intrepid-australia.md | Intrepid Travel (Australia) | Australia | Egypt, Jordan, Morocco | 2026-03-10 | zeyad | HIGH | active | market-entry-australia | — |
| artifacts/competitors/tui-germany.md | TUI Germany | Germany | Egypt, Turkey | 2026-01-20 | zeyad | HIGH | superseded | market-entry-germany | — |
```

**Notes**: For consolidation detection, the Subject column is parsed for the
competitor brand name (text before the parenthetical market qualifier).

---

## 3. demand-signals.md

**Category slug**: `demand-signal`
**Source**: `artifacts/demand-signals/`

### Full Schema

```yaml
---
type: memory-index
category: demand-signal
artifact_count: 3
updated: 2026-03-24
---

# Demand Signals Index

| Path | Subject | Markets | Destinations | Updated | Author | Confidence | Status | Session | Depends On |
|---|---|---|---|---|---|---|---|---|---|
| artifacts/demand-signals/germany-egypt-winter-2026.md | Germany→Egypt Winter Demand 2026 | Germany | Egypt | 2026-03-01 | zeyad | HIGH | active | standalone | — |
```

**Notes**: For consolidation detection, compare Subject + Markets + period
(derived from Updated and content) to identify duplicate signal reports.

---

## 4. health-checks.md

**Category slug**: `destination-health-check`
**Source**: `artifacts/health-checks/`

### Full Schema

```yaml
---
type: memory-index
category: destination-health-check
artifact_count: 6
updated: 2026-03-24
---

# Health Checks Index

| Path | Subject | Markets | Destinations | Updated | Author | Confidence | Status | Session | Depends On |
|---|---|---|---|---|---|---|---|---|---|
| artifacts/health-checks/egypt-classic-2026-03.md | Egypt Classic Circuit — Mar 2026 | Germany, UK | Egypt | 2026-03-15 | zeyad | HIGH | active | standalone | — |
```

---

## 5. gap-analyses.md

**Category slug**: `gap-analysis`
**Source**: `artifacts/gap-analyses/`

### Full Schema

```yaml
---
type: memory-index
category: gap-analysis
artifact_count: 4
updated: 2026-03-24
---

# Gap Analyses Index

| Path | Subject | Markets | Destinations | Updated | Author | Confidence | Status | Session | Depends On |
|---|---|---|---|---|---|---|---|---|---|
| artifacts/gap-analyses/egypt-vs-german-leisure.md | Egypt Product Gaps vs German Leisure | Germany | Egypt | 2026-02-01 | zeyad | HIGH | active | market-entry-germany | artifacts/personas/german-leisure-traveler.md, artifacts/health-checks/egypt-classic-2026-03.md |
```

**Notes**: `depends_on` is typically populated for gap analyses — they
derive from a persona + health check pair.

---

## 6. market-assessments.md

**Category slug**: `market-assessment`
**Source**: `artifacts/market-assessments/`

### Full Schema

```yaml
---
type: memory-index
category: market-assessment
artifact_count: 3
updated: 2026-03-24
---

# Market Assessments Index

| Path | Subject | Markets | Destinations | Updated | Author | Confidence | Status | Session | Depends On |
|---|---|---|---|---|---|---|---|---|---|
| artifacts/market-assessments/australia-2026-03.md | Australia Market Assessment Q1 2026 | Australia | Egypt, Jordan | 2026-03-20 | zeyad | HIGH | active | market-entry-australia | artifacts/personas/australian-adventure-seeker.md, artifacts/competitors/intrepid-australia.md |
```

---

## 7. decision-records.md

**Category slug**: `decision-record`
**Source**: `artifacts/decision-records/`

### Full Schema

```yaml
---
type: memory-index
category: decision-record
artifact_count: 5
updated: 2026-03-24
---

# Decision Records Index

| Path | Subject | Markets | Destinations | Updated | Author | Confidence | Status | Session | Depends On |
|---|---|---|---|---|---|---|---|---|---|
| artifacts/decision-records/germany-launch-timing.md | Germany Launch Timing Decision | Germany | Egypt | 2026-03-18 | zeyad | HIGH | active | market-entry-germany | artifacts/market-assessments/australia-2026-03.md, artifacts/competitors/tui-germany.md |
```

**Notes**: Decision records have the richest `depends_on` lists. For
consolidation detection, check for records with overlapping markets/subject
that may have contradictory conclusions.

---

## 8. initiatives.md

**Category slug**: `initiative`
**Source**: `initiatives/active/`, `initiatives/closed/`

### Full Schema

```yaml
---
type: memory-index
category: initiative
artifact_count: 8
updated: 2026-03-24
---

# Initiatives Index

| Path | Subject | Markets | Destinations | Updated | Author | Status | Session | Artifact Count | Phase |
|---|---|---|---|---|---|---|---|---|---|
| initiatives/active/market-entry-germany.md | Market Entry Germany | Germany | Egypt, Jordan | 2026-03-20 | zeyad | active | market-entry-germany | 12 | execution |
| initiatives/closed/pilot-uk-2025.md | UK Pilot 2025 | UK | Egypt | 2025-12-01 | zeyad | closed | pilot-uk-2025 | 8 | — |
```

**Column differences from standard schema**:
- No `Confidence` column (initiatives don't have a confidence rating)
- No `Depends On` column
- **Artifact Count** replaces Depends On — number of artifacts produced by
  this initiative
- **Phase** — current initiative phase (research / synthesis / decision /
  execution / closed)

---

## 9. intelligence-reports.md

**Category slug**: `intelligence-report`
**Sources**: `intelligence/portfolio-health/`, `intelligence/signal-detection/`,
`intelligence/cross-initiative-patterns/`, `intelligence/cross-market-intelligence/`

### Full Schema

Covers all three intelligence output types in one index with an extra
**Report Type** column.

```yaml
---
type: memory-index
category: intelligence-report
artifact_count: 7
updated: 2026-03-24
---

# Intelligence Reports Index

| Path | Report Type | Subject | Markets | Updated | Author | Confidence | Status | Session |
|---|---|---|---|---|---|---|---|---|
| intelligence/portfolio-health/q1-2026.md | portfolio-health | Portfolio Health Q1 2026 | All | 2026-03-20 | zeyad | HIGH | active | standalone |
| intelligence/signal-detection/germany-signals-mar-2026.md | signal-detection | Germany Demand Signals Mar 2026 | Germany | 2026-03-15 | zeyad | HIGH | active | standalone |
| intelligence/cross-initiative-patterns/persona-archetypes-q1.md | cross-initiative-patterns | Persona Archetypes Q1 | Germany, Australia, UK | 2026-03-22 | zeyad | MEDIUM | active | standalone |
```

**Column differences**:
- **Report Type** added as second column: `portfolio-health` /
  `signal-detection` / `cross-initiative-patterns`
- No `Destinations` column
- No `Depends On` column (intelligence reports synthesize many artifacts
  but the dependency graph is managed at the artifact level)

---

## 10. foundation.md

**Category slug**: `foundation`
**Sources**: `foundation/`, `foundation/domains/`

### Full Schema

Foundation files are context documents, not analytical artifacts. Simpler
schema — no Markets, Destinations, or Depends On columns.

```yaml
---
type: memory-index
category: foundation
artifact_count: 6
updated: 2026-03-24
---

# Foundation Index

| Path | Subject | Type | Updated | Author | Status |
|---|---|---|---|---|---|
| foundation/company-context.md | Company Context | context | 2026-01-01 | zeyad | active |
| foundation/product-catalog.md | Product Catalog | catalog | 2026-02-15 | zeyad | active |
| foundation/domains/germany.md | Germany Domain Profile | domain | 2026-03-10 | zeyad | active |
| foundation/domains/australia.md | Australia Domain Profile | domain | 2026-03-10 | zeyad | active |
```

**Column definitions for foundation**:
- **Path**: Relative path from repo root
- **Subject**: Human-readable document name
- **Type**: `context` / `catalog` / `domain` / `reference`
- **Updated**: Last update date
- **Author**: Creator/last updater
- **Status**: `active` / `superseded` / `archived`

---

## Parsing Notes for Rebuild

When reading artifact frontmatter to extract index row values:

1. **Subject/Title**: Try `title` field first, then `subject`, then derive
   from filename (replace hyphens with spaces, title-case).
2. **Markets**: Accept both list format (`markets: [Germany, UK]`) and
   comma-string (`markets: "Germany, UK"`). Normalize to comma-separated
   string for the table.
3. **Destinations**: Same normalization as Markets.
4. **depends_on**: May be YAML list or single string. Normalize to
   comma-separated paths for the table cell. If list has > 3 items,
   abbreviate to first 2 paths + "(+N more)" in the table, but store full
   list in the frontmatter.
5. **Status**: Normalize to lowercase. Default `active` if missing.
6. **Confidence**: Normalize to uppercase. Default `MEDIUM` if missing.
