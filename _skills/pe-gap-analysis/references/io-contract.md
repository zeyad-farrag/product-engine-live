# I/O Contract: pe-gap-analysis

## Skill-Level Contract

| | Details |
|---|---|
| **Required Inputs** | User-specified [PRODUCT] and [BENCHMARK] (audience, competitor, or market norm); GitHub repo `zeyad-farrag/Product-Engine` accessible; persona card (if benchmark is an audience) OR competitor profile (if benchmark is a competitor) |
| **Optional Inputs** | `foundation/business-model-summary.md`; `foundation/domains/06-product-structure.md`; health check for [PRODUCT] in `artifacts/health-checks/`; existing gap analyses in `artifacts/gap-analyses/`; demand signal reports and market assessments related to [PRODUCT] or [BENCHMARK] |
| **Produces** | Gap analysis report at `artifacts/gap-analyses/[product-kebab]-vs-[benchmark-kebab]-[date].md`; marks previous analysis as superseded if same product/benchmark pair exists |
| **Updates** | `intelligence/_index/gap-analyses.md` |

---

## Step-Level Contracts

### Step 1: Check for Existing Gap Analyses

| Field | Details |
|---|---|
| **Inputs** | `artifacts/gap-analyses/` directory listing (GitHub API); `intelligence/_index/{category}.md` (fast-path index read attempted first); if prior analysis exists for same pair: `artifacts/gap-analyses/[filename].md` content (full read) |
| **Outputs** | List of existing gap analyses; most recent one for same product/benchmark retrieved (patterns format, flags supersession); prior analyses for same product (different benchmark) noted for systemic gap patterns; prior analyses for same benchmark (different product) noted |
| **Feeds Into** | Phase 3 (cross-reference check uses these for systemic gap patterns) |

---

### Step 2: Check for Prerequisite Artifacts

| Field | Details |
|---|---|
| **Inputs** | `artifacts/personas/` directory listing (GitHub API); `artifacts/competitors/` directory listing (GitHub API); `artifacts/health-checks/` directory listing (GitHub API) |
| **Outputs** | Confirmation that persona card exists (if benchmark is an audience); confirmation that competitor profile exists (if benchmark is a competitor); health check availability for [PRODUCT]. **Hard block**: if the benchmark has no supporting persona card (audience benchmark) or competitor profile (competitor benchmark) _and_ the user has no data to substitute, do not proceed — emit a prerequisite gap warning naming the missing artifact, its impact (e.g., "Benchmark standard is ungrounded" for a missing persona card; "Competitive floor is unknown" for a missing competitor profile; "Current product state is unassessed" for a missing health check), and recommend the upstream skill (`pe-persona-definition`, `pe-competitor-benchmarking`, or `pe-product-health-check` respectively). |
| **Feeds Into** | Phase 2, Step 1 (persona card / competitor profile loaded as benchmark source); Phase 2, Step 2 (health check loaded as current product state source) |

---

### Step 3: Load Foundation Context

| Field | Details |
|---|---|
| **Inputs** | `foundation/business-model-summary.md`; `foundation/domains/06-product-structure.md` |
| **Outputs** | Business model context; product tiers and structure — used to frame current product state assessment |
| **Feeds Into** | Phase 2, Step 2 (product structure context used when assessing current state) |

---

### Step 4: Cross-Reference Related Artifacts

| Field | Details |
|---|---|
| **Inputs** | `gh search code "[PRODUCT]" --repo zeyad-farrag/Product-Engine`; `gh search code "[BENCHMARK]" --repo zeyad-farrag/Product-Engine` |
| **Outputs** | Related demand signal reports (evidence for benchmark expectations); related market assessments (competitive standards context); prior gap analyses for same product/benchmark |
| **Feeds Into** | Phase 2 (demand signals and market assessments provide evidence for both benchmark standard and current state) |

---

### Phase 1: Clarify Parameters

| Field | Details |
|---|---|
| **Inputs** | User's trigger prompt |
| **Outputs** | Confirmed [PRODUCT] scope and [BENCHMARK] type (audience / competitor / market norm) |
| **Feeds Into** | Phase 2 (all 6 framework steps scoped to this product/benchmark pair) |

---

### Phase 2: Run the 6-Step Framework

| Field | Details |
|---|---|
| **Inputs** | `references/gap-framework.md` (all table templates, gap type definitions, severity definitions, prioritization matrix); persona card from Step 2 (if benchmark is audience); competitor profile from Step 2 (if benchmark is competitor); health check from Step 2 (current product state); demand signal reports and market assessments from Step 4; foundation context from Step 3 |
| **Outputs** | Step 1 — Benchmark Standard: what "good" looks like from benchmark perspective across all dimensions; Step 2 — Current Product State: documented current state with evidence per dimension; Step 3 — Gap Identification: per-dimension comparison with gap type (MISSING/DEFICIENT/MISALIGNED/EXCESS/NONE) and severity (CRITICAL/MAJOR/MODERATE/MINOR/NONE); Step 4 — Gap Prioritization: Priority 1–4 matrix + excess analysis; Step 5 — Strategic Classification: overall fit rating (STRONG_FIT / FIXABLE_FIT / REPOSITIONING_NEEDED / REDESIGN_NEEDED / FUNDAMENTAL_MISMATCH); Step 6 — Action Recommendations: immediate, short-term, medium-term, and decisions requiring human judgment |
| **Feeds Into** | Phase 3 (cross-reference check before finalizing) |

---

### Phase 3: Cross-Reference Check

| Field | Details |
|---|---|
| **Inputs** | `gh search code "CRITICAL" --repo zeyad-farrag/Product-Engine` (in `artifacts/gap-analyses/`); `gh search code "MAJOR" --repo zeyad-farrag/Product-Engine` (in `artifacts/gap-analyses/`); prior gap analyses from Step 1 |
| **Outputs** | Systemic gap identification (gaps appearing across multiple products for same benchmark); validation or contradiction of prior initiative conclusions; cross-analysis pattern notes appended to report |
| **Feeds Into** | Phase 4 (finalized report includes cross-reference section) |

---

### Phase 4: Store the Report

| Field | Details |
|---|---|
| **Inputs** | Full gap analysis from Phase 2; cross-reference notes from Phase 3; `intelligence/_index/gap-analyses.md` (current index); prior analysis file path (if superseding) |
| **Outputs** | `artifacts/gap-analyses/[product-kebab]-vs-[benchmark-kebab]-[date].md` with YAML frontmatter (type, product, target_audience, fit_rating, confidence, status, supersedes, depends_on, initiative, tags); prior analysis updated to `status: superseded` (if applicable); updated `intelligence/_index/gap-analyses.md`; Perplexity memory pointer (path + fit rating + gap counts + top gap) |
| **Feeds Into** | Future cross-market intelligence runs (systemic gap patterns); future initiative planning (fit rating drives optimization/repositioning/new-product decisions) |

---

## Dependency Graph

```
Step 1: Check for Existing Gap Analyses ─────────────────────────┐
  [prior analyses for same pair or same product]                  │
    │                                                             │
Step 2: Check for Prerequisite Artifacts                          │
  [persona card + competitor profile + health check]              │
    │  (blocks if required artifacts missing)                     │
    │                                                             │
Step 3: Load Foundation Context                                   │
  [06-product-structure.md + business-model-summary.md]           │
    │                                                             │
Step 4: Cross-Reference Related Artifacts                         │
  [demand signals + market assessments via gh search]             │
    │                                                             │
Phase 1: Clarify Parameters                                       │
  [confirmed [PRODUCT] + [BENCHMARK]]                             │
    │                                                             │
    ▼                                                             │
Phase 2: Run 6-Step Framework ◄── references/gap-framework.md    │
  Step 1: Benchmark Standard          ◄── persona card OR         │
  Step 2: Current Product State           competitor profile       │
  Step 3: Gap Identification          ◄── health check            │
  Step 4: Gap Prioritization          ◄── demand signals          │
  Step 5: Strategic Classification                                 │
  Step 6: Action Recommendations                                   │
    │                                                             │
    ▼                                                             │
Phase 3: Cross-Reference Check ◄─────────────────────────────────┘
  [systemic gap patterns across gap-analyses/]
    │
    ▼
Phase 4: Store the Report
  [artifacts/gap-analyses/[product]-vs-[benchmark]-[date].md + index]
```

---

## Artifact Registry

| Artifact | Path Pattern | Frontmatter Type | Depends On |
|---|---|---|---|
| Gap analysis report | `artifacts/gap-analyses/[product-kebab]-vs-[benchmark-kebab]-[date].md` | `gap-analysis` | Persona card (audience benchmark), competitor profile (competitor benchmark), health check, demand signal reports, `06-product-structure.md` |
| Gap analyses index | `intelligence/_index/gap-analyses.md` | _(index table)_ | All gap analysis reports |
