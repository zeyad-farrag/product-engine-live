# I/O Contract: pe-product-health-check

## Skill-Level Contract

| | Details |
|---|---|
| **Required Inputs** | User-specified product, product line, or category; GitHub repo `zeyad-farrag/Product-Engine` accessible |
| **Optional Inputs** | `foundation/business-model-summary.md`; `foundation/domains/06-product-structure.md`; `foundation/domains/10-pricing-policies.md`; `foundation/domains/07-competitive-landscape.md`; existing health checks in `artifacts/health-checks/`; related demand signal reports and competitor profiles (found via `gh search code`) |
| **Produces** | Health check report at `artifacts/health-checks/[product-kebab]-[date].md`; marks previous check as superseded if one exists |
| **Updates** | `intelligence/_index/health-checks.md` |

---

## Step-Level Contracts

### Step 1: Check for Existing Health Checks

| Field | Details |
|---|---|
| **Inputs** | `artifacts/health-checks/` directory listing (GitHub API); `intelligence/_index/{category}.md` (fast-path index read attempted first); if a prior check exists: `artifacts/health-checks/[filename].md` content (full read) |
| **Outputs** | List of prior health checks for this product; most recent check's composite score and dimension scores extracted (if exists) — this run becomes a trend analysis; flag if first check for this product |
| **Feeds Into** | Phase 2 (prior scores populate Section 7: Comparison to Previous); Phase 4 (old file marked superseded) |

---

### Step 2: Load Foundation Context

| Field | Details |
|---|---|
| **Inputs** | `foundation/business-model-summary.md`; `foundation/domains/06-product-structure.md`; optionally `foundation/domains/10-pricing-policies.md` and `foundation/domains/07-competitive-landscape.md` |
| **Outputs** | Business model context; product tiers and structure; pricing benchmarks; existing competitive landscape — all used to contextualize health scores and strategic fit assessment |
| **Feeds Into** | Phase 2 (strategic fit dimension scoring requires product structure and competitive context) |

---

### Step 3: Check for Related Artifacts

| Field | Details |
|---|---|
| **Inputs** | `gh search code "[PRODUCT]" --repo zeyad-farrag/Product-Engine` — searches demand signal reports and competitor profiles |
| **Outputs** | List of relevant demand signal reports (provides booking/amendment data); relevant competitor profiles (provides competitive position data) |
| **Feeds Into** | Phase 2 (demand signals feed Performance Vitals and Amendment Intelligence; competitor profiles feed Competitive Position Check) |

---

### Phase 1: Clarify the Product

| Field | Details |
|---|---|
| **Inputs** | User's trigger prompt |
| **Outputs** | Confirmed [PRODUCT] scope (specific product, product line, or category) |
| **Feeds Into** | Phase 2 (all 8 sections scoped to this product) |

---

### Phase 2: Run All 8 Assessment Sections

| Field | Details |
|---|---|
| **Inputs** | MySQL (pymysql direct connection via env vars): `operation_files`, `requests`, `clients`, `countries`, `acc_srv_orders`, `acc_srv_orders_operation_files`, `destinations`, `sources` tables filtered to [PRODUCT]; `references/health-assessment-template.md` (all 8 section templates); foundation context from Step 2; demand signal reports from Step 3; competitor profiles from Step 3; prior health check scores from Step 1 |
| **Outputs** | 8 scored assessment sections: (1) Performance Vitals — Revenue/Conversion/Customer/Seasonal health, (2) Amendment Intelligence Snapshot, (3) Competitive Position Check, (4) Lifecycle Position, (5) Composite Health Score (weighted 0–100), (6) Attention Flags, (7) Comparison to Previous (deltas if prior check exists), (8) Recommendations; explicit gap notes for any skipped section |
| **Feeds Into** | Phase 3 (raw scores fed into composite calculation) |

---

### Phase 3: Compute the Composite Score

| Field | Details |
|---|---|
| **Inputs** | Dimension scores from Phase 2; `references/scoring-guide.md` (weighting: Revenue 25%, Conversion 20%, Customer satisfaction 20%, Competitive position 15%, Amendment health 10%, Strategic fit 10%); classification thresholds from `references/scoring-guide.md` |
| **Outputs** | Composite score (0–100); health classification: STRONG / STABLE / CONCERNING / CRITICAL / TERMINAL; trajectory assessment if prior check exists (getting healthier or sicker) |
| **Feeds Into** | Phase 4 (score and classification populate report frontmatter) |

---

### Phase 4: Store the Report

| Field | Details |
|---|---|
| **Inputs** | All section outputs from Phase 2; composite score from Phase 3; `intelligence/_index/health-checks.md` (current index); prior health check file path (if superseding) |
| **Outputs** | `artifacts/health-checks/[product-kebab]-[date].md` with YAML frontmatter (type, product, health_rating, composite_score, confidence, status, supersedes, depends_on, initiative, tags); prior health check updated to `status: superseded` (if applicable); updated `intelligence/_index/health-checks.md`; Perplexity memory pointer (path + score + classification + top flag) |
| **Feeds Into** | Future health checks for same product (this report becomes the prior check baseline) |

---

## Dependency Graph

```
Step 1: Check for Existing Health Checks ────────────────────────┐
  [prior scores for trend/delta analysis]                         │
    │                                                             │
Step 2: Load Foundation Context                                   │
  [06-product-structure.md + 07-competitive-landscape.md +        │
   10-pricing-policies.md + business-model-summary.md]            │
    │                                                             │
Step 3: Check for Related Artifacts                               │
  [demand signal reports + competitor profiles]                   │
    │                                                             │
Phase 1: Clarify the Product                                      │
  [confirmed [PRODUCT] scope]                                     │
    │                                                             │
    ▼                                                             │
Phase 2: Run All 8 Assessment Sections ◄── MySQL (pymysql)        │
  [1 Performance Vitals  2 Amendment Intelligence]  + health-assessment-template.md
  [3 Competitive Position  4 Lifecycle Position]                  │
  [5 Composite Score  6 Attention Flags]                          │
  [7 Comparison to Previous  8 Recommendations] ◄────────────────┘
    │
    ▼
Phase 3: Compute Composite Score ◄── references/scoring-guide.md
  [0–100 score + STRONG/STABLE/CONCERNING/CRITICAL/TERMINAL]
    │
    ▼
Phase 4: Store the Report
  [artifacts/health-checks/[product-kebab]-[date].md + index update]
```

---

## Artifact Registry

| Artifact | Path Pattern | Frontmatter Type | Depends On |
|---|---|---|---|
| Health check report | `artifacts/health-checks/[product-kebab]-[date].md` | `destination-health-check` | MySQL booking/amendment data, `06-product-structure.md`, `07-competitive-landscape.md`, `10-pricing-policies.md`, demand signal reports, competitor profiles |
| Health checks index | `intelligence/_index/health-checks.md` | _(index table)_ | All health check reports |
