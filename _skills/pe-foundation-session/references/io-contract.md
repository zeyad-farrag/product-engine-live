# I/O Contract: pe-foundation-session

## Skill-Level Contract

| | Details |
|---|---|
| **Required Inputs** | User (conversational) — answers to 12 domain interviews; GitHub repo access (`zeyad-farrag/Product-Engine`) |
| **Optional Inputs** | Existing `foundation/domains/` files (enables Refresh or Gap-Fill mode instead of Full Session); documents/URLs provided by user during interview |
| **Produces** | 12 domain files (`foundation/domains/`), `foundation/business-model-summary.md`, `foundation/intelligence-readiness.md`, `foundation/confidence-map.md`; Perplexity memory pointer |
| **Updates** | `intelligence/_index/foundation.md` (if it already exists); no other index files touched |

> **Prerequisite note**: This is the FIRST skill anyone runs. It has no artifact dependencies — it creates the foundation that every other Product Engine skill depends on.

---

## Step-Level Contracts

### Step 1: Session State Detection

| Field | Details |
|---|---|
| **Inputs** | GitHub repo listing: `foundation/domains/` directory contents |
| **Outputs** | Session mode determination: Full / Refresh / Gap-Fill / Already-complete |
| **Feeds Into** | Step 2 (if Full/Refresh/Gap-Fill) |

### Step 2: Repo Setup

| Field | Details |
|---|---|
| **Inputs** | GitHub repo (`zeyad-farrag/Product-Engine`) |
| **Outputs** | Local clone at `/home/user/workspace/Product-Engine`; `foundation/domains/` directory created |
| **Feeds Into** | Step 3 |

### Step 3: Domain Interview (×12, sequential)

| Field | Details |
|---|---|
| **Inputs** | User conversation; optional documents/URLs provided by user; previously confirmed domain summaries (for cross-referencing) |
| **Outputs** | Per-domain markdown file at `foundation/domains/NN-[name].md` (type: `foundation-domain`, status: complete/skipped/partial, confidence: HIGH/MEDIUM/LOW); one `git commit` + `git push` per confirmed domain |
| **Feeds Into** | Step 4 (all 12 files); each domain also informs subsequent domain questions |

Domains in order:
1. `01-company-identity.md`
2. `02-brand-architecture.md`
3. `03-destination-portfolio.md`
4. `04-source-markets.md`
5. `05-customer-segmentation.md`
6. `06-product-structure.md`
7. `07-competitive-landscape.md`
8. `08-distribution-channels.md`
9. `09-data-landscape.md`
10. `10-pricing-policies.md`
11. `11-strategic-priorities.md`
12. `12-product-department.md`

### Step 4: Session Wrap-Up

| Field | Details |
|---|---|
| **Inputs** | All 12 confirmed domain summaries from Step 3 |
| **Outputs** | `foundation/business-model-summary.md` (type: `foundation-summary`, includes Recommended First Initiative section); `foundation/intelligence-readiness.md` (type: `foundation-readiness`); `foundation/confidence-map.md` (type: `foundation-confidence`) |
| **Feeds Into** | Step 5 |

### Step 5: Index Update

| Field | Details |
|---|---|
| **Inputs** | All artifacts written in Steps 3–4; existing `intelligence/_index/foundation.md` (if present) |
| **Outputs** | Updated `intelligence/_index/foundation.md` row(s); skipped if index does not yet exist (pe-memory-maintenance builds it on first run) |
| **Feeds Into** | Step 6 |

### Step 6: Memory Persistence

| Field | Details |
|---|---|
| **Inputs** | Final commit confirmation; domain completion count |
| **Outputs** | Single Perplexity memory entry confirming foundation is complete and pointing to the GitHub repo |
| **Feeds Into** | (terminal — session ends) |

---

## Dependency Graph

```
User (conversational)
        │
        ▼
Step 1: Session State Detection
        │
        ▼
Step 2: Repo Setup
        │
        ▼
Step 3: Domain Interview ×12  ──► foundation/domains/NN-*.md (×12, one commit each)
        │                                    │
        ▼                                    │
Step 4: Wrap-Up  ◄───────────────────────────┘
        │
        ├──► foundation/business-model-summary.md
        ├──► foundation/intelligence-readiness.md
        └──► foundation/confidence-map.md
                          │
                          ▼
              Step 5: Index Update
                          │
                          └──► intelligence/_index/foundation.md (if exists)
                                        │
                                        ▼
                          Step 6: Memory Persistence
                                        │
                                        └──► Perplexity memory pointer
```

---

## Artifact Registry

| Artifact | Path Pattern | Frontmatter Type | Depends On |
|---|---|---|---|
| Domain file (complete) | `foundation/domains/NN-[name].md` | `foundation-domain` | User interview (that domain) |
| Domain file (skipped) | `foundation/domains/NN-[name].md` | `foundation-domain` (status: skipped) | — |
| Business Model Summary | `foundation/business-model-summary.md` | `foundation-summary` | All 12 domain files |
| Intelligence Readiness | `foundation/intelligence-readiness.md` | `foundation-readiness` | All 12 domain files |
| Confidence Map | `foundation/confidence-map.md` | `foundation-confidence` | All 12 domain files |

---

## Skill-Specific Notes

- **No artifact prerequisites**: this skill starts from zero. It is the root of the entire Product Engine dependency graph.
- **Commit-per-domain**: each confirmed domain is committed immediately — partial sessions are safe to pause and resume.
- **Skipped domains** produce stub files (status: skipped, confidence: LOW) rather than gaps.
- **Index update is conditional**: if `intelligence/_index/foundation.md` doesn't exist yet, skip Step 5 — pe-memory-maintenance will create it on first run.
- **Three session modes**: Full (first time, all 12 domains), Refresh (user-triggered updates), Gap-Fill (specific domains only).
