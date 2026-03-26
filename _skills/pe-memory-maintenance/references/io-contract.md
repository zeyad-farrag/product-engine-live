# I/O Contract: pe-memory-maintenance

## Skill-Level Contract

| | Details |
|---|---|
| **Required Inputs** | GitHub repo access (`zeyad-farrag/product-engine-live`); at least one artifact directory or index file to operate on |
| **Optional Inputs** | Existing `intelligence/_index/` files (required for Modes 2–6; Mode 1 rebuilds them from scratch) |
| **Produces** | Up to 10 updated index files at `intelligence/_index/`; Memory Health Dashboard (conversational output) |
| **Updates** | `intelligence/_index/*.md` (all 10 files in Mode 1; subset in other modes) — **no other files modified** |

> **Write scope is strictly `intelligence/_index/`**. This skill never modifies artifact content outside that directory.

---

## Step-Level Contracts

### Full Maintenance Run Sequence

When triggered by "run memory maintenance", "check memory health", or "memory hygiene", all modes execute in order: **6 → 1 (if drift) → 2 → 3 → 4 → 5**.

---

### Mode 6: Index Validation (always runs first)

| Field | Details |
|---|---|
| **Inputs** | `intelligence/_index/*.md` (10 files, frontmatter `artifact_count` field); actual file counts from `artifacts/`, `intelligence/`, `initiatives/`, `foundation/` directories |
| **Outputs** | Drift report: index `artifact_count` vs. actual directory file count, per artifact type |
| **Feeds Into** | Mode 1 (if drift > 0); otherwise skip to Mode 2 |

### Mode 1: Full Index Rebuild

**Step 1 — Scan all artifact directories**

| Field | Details |
|---|---|
| **Inputs** | Directory listings for: `artifacts/{personas,competitors,demand-signals,health-checks,gap-analyses,market-assessments,decision-records}/`; `intelligence/{portfolio-health,signal-detection,cross-initiative-patterns,cross-market-intelligence}/`; `initiatives/{active,closed}/`; `foundation/`, `foundation/domains/` |
| **Outputs** | Full file list with paths across all artifact directories |
| **Feeds Into** | Mode 1 Step 2 |

**Step 2 — Read each artifact's frontmatter**

| Field | Details |
|---|---|
| **Inputs** | Each artifact file path from Step 1 |
| **Outputs** | Extracted fields per artifact: subject/title, markets, destinations, updated, author, confidence, status, session, depends_on (defaults applied for missing fields) |
| **Feeds Into** | Mode 1 Step 3 |

**Step 3 — Build all 10 index files**

| Field | Details |
|---|---|
| **Inputs** | Extracted frontmatter from all artifacts (Step 2); index schema from `references/index-schema.md` |
| **Outputs** | 10 rebuilt index markdown files (in memory, ready to commit) |
| **Feeds Into** | Mode 1 Step 4 |

**Step 4 — Commit and push**

| Field | Details |
|---|---|
| **Inputs** | 10 rebuilt index files |
| **Outputs** | `intelligence/_index/{personas,competitors,demand-signals,health-checks,gap-analyses,market-assessments,decision-records,initiatives,intelligence-reports,foundation}.md` committed and pushed |
| **Feeds Into** | Modes 2–5 (which now read the freshly rebuilt indexes) |

---

### Mode 2: Dependency Staleness Detection

| Field | Details |
|---|---|
| **Inputs** | All 10 index files (or artifact frontmatter directly); `depends_on` and `updated` fields across all artifacts |
| **Outputs** | Staleness table: artifact path, updated date, stale dependency path, dependency's updated date, suggested action (pe-skill to re-run); time-stale flags (>90 days) |
| **Feeds Into** | Memory Health Dashboard |

### Mode 3: Orphan Detection

| Field | Details |
|---|---|
| **Inputs** | All 10 index files; initiative state files (`initiatives/active/`, `initiatives/closed/`); actual directory listings for all artifact paths |
| **Outputs** | Orphan table: artifact path, orphan type (not referenced by initiative / superseded-without-successor / index-entry-missing-file / file-missing-from-index), last updated, recommended action (archive / delete / add to initiative) |
| **Feeds Into** | Memory Health Dashboard |

### Mode 4: Coverage Report

| Field | Details |
|---|---|
| **Inputs** | All 10 index files (Markets and Destinations columns) |
| **Outputs** | Matrix 1 (Markets × Artifact Types) with counts; Matrix 2 (Products/Destinations × Artifact Types) with counts; depth scores per market/product: DEEP / MODERATE / THIN / BLIND |
| **Feeds Into** | Memory Health Dashboard |

### Mode 5: Consolidation Suggestions

| Field | Details |
|---|---|
| **Inputs** | All 10 index files; artifact content (subject, markets, conclusions) for pattern detection |
| **Outputs** | Consolidation suggestions: duplicate competitor profiles (→ `pe-competitor-analysis`), cross-market persona archetypes (→ `pe-cross-initiative-patterns`), overlapping demand signal reports (→ `pe-signal-detection`), contradicting decision records (→ human review) |
| **Feeds Into** | Memory Health Dashboard |

---

## Dependency Graph

```
Trigger phrase
      │
      ▼
Mode 6: Index Validation
      │
      ├─ drift > 0 ──► Mode 1: Full Index Rebuild
      │                    Step 1: Scan all artifact directories
      │                        │
      │                    Step 2: Read each artifact's frontmatter
      │                        │
      │                    Step 3: Build 10 index files
      │                        │
      │                    Step 4: Commit & push ──► intelligence/_index/*.md (×10)
      │                        │
      └─ no drift ─────────────┤
                               │
                     ┌─────────┴──────────┐
                     │                    │
               Mode 2: Staleness    Mode 3: Orphans
               (index files +       (index files +
                frontmatter)         initiative files)
                     │                    │
                     └─────────┬──────────┘
                               │
                     ┌─────────┴──────────┐
                     │                    │
               Mode 4: Coverage    Mode 5: Consolidation
               (index files only)  (index files + content)
                     │                    │
                     └─────────┬──────────┘
                               │
                               ▼
                  Memory Health Dashboard (output only)
```

---

## Artifact Registry

| Artifact | Path Pattern | Frontmatter Type | Depends On |
|---|---|---|---|
| Personas index | `intelligence/_index/personas.md` | index | `artifacts/personas/` |
| Competitors index | `intelligence/_index/competitors.md` | index | `artifacts/competitors/` |
| Demand Signals index | `intelligence/_index/demand-signals.md` | index | `artifacts/demand-signals/` |
| Health Checks index | `intelligence/_index/health-checks.md` | index | `artifacts/health-checks/` |
| Gap Analyses index | `intelligence/_index/gap-analyses.md` | index | `artifacts/gap-analyses/` |
| Market Assessments index | `intelligence/_index/market-assessments.md` | index | `artifacts/market-assessments/` |
| Decision Records index | `intelligence/_index/decision-records.md` | index | `artifacts/decision-records/` |
| Initiatives index | `intelligence/_index/initiatives.md` | index | `initiatives/active/`, `initiatives/closed/` |
| Intelligence Reports index | `intelligence/_index/intelligence-reports.md` | index | `intelligence/portfolio-health/`, `intelligence/signal-detection/`, `intelligence/cross-initiative-patterns/`, `intelligence/cross-market-intelligence/` |
| Foundation index | `intelligence/_index/foundation.md` | index | `foundation/`, `foundation/domains/` |

---

## Skill-Specific Notes

- **Six modes, not one workflow**: each mode is independently triggerable; Full Maintenance Run sequences all six.
- **Mode 6 always runs first** in a full maintenance run — its drift check determines whether Mode 1 is needed.
- **Mode 1 is the only mode that writes**: all other modes are diagnostic/reporting only (read index files, produce conversational output).
- **Write scope is `intelligence/_index/` exclusively**: artifact files in `artifacts/`, `intelligence/`, `initiatives/`, and `foundation/` are never modified.
- **Recommended cadence**: monthly, or after a batch of initiative completions.
- **Index does not exist yet**: if `intelligence/_index/` is empty or missing, Mode 1 creates all 10 files from scratch (the GitHub API PUT implicitly creates the directory).
