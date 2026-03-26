# I/O Contract: pe-competitor-benchmarking

## Skill-Level Contract

| | Details |
|---|---|
| **Required Inputs** | User-specified context (market, product, or audience); GitHub repo `zeyad-farrag/product-engine-live` accessible |
| **Optional Inputs** | `foundation/domains/07-competitive-landscape.md`, `foundation/domains/04-source-markets.md`, `foundation/domains/05-customer-segmentation.md`, `foundation/domains/03-destination-portfolio.md`, `foundation/domains/06-product-structure.md`, `foundation/domains/10-pricing-policies.md`, `foundation/domains/11-strategic-priorities.md`; existing competitor profiles in `artifacts/competitors/`; persona cards in `artifacts/personas/` |
| **Produces** | Competitor profile files at `artifacts/competitors/[kebab-case-name]-[market-context].md`; benchmark summary at `artifacts/competitors/_benchmark-[context]-[YYYY-MM-DD].md` |
| **Updates** | `intelligence/_index/[competitors-index].md` |

---

## Step-Level Contracts

### Step 0: Repo Setup

| Field | Details |
|---|---|
| **Inputs** | GitHub repo `zeyad-farrag/product-engine-live`; local workspace `/home/user/workspace` |
| **Outputs** | Cloned or pulled repo; index file(s) at `intelligence/_index/{category}.md` (attempted fast-path read) |
| **Feeds Into** | Step 1 (context check) |

---

### Step 1: Context Check

| Field | Details |
|---|---|
| **Inputs** | `artifacts/competitors/` directory listing (GitHub API); `artifacts/personas/` directory listing; foundation domain files: `07-competitive-landscape.md`, `04-source-markets.md`, `05-customer-segmentation.md`, `03-destination-portfolio.md`, `06-product-structure.md`, `10-pricing-policies.md`, `11-strategic-priorities.md` |
| **Outputs** | List of existing competitor profiles for [CONTEXT] with frontmatter (name, market, threat_level, updated); cross-market flag if competitor appears in other contexts; relevant persona cards for buyer perspective; parsed foundation context (competitive landscape, product tiers, strategic direction) |
| **Feeds Into** | Phase 1 (shapes which competitor categories to prioritize); Phase 2 (cross-reference notes for profiles) |

---

### Phase 1: Competitor Identification

| Field | Details |
|---|---|
| **Inputs** | Web search: direct search for [CONTEXT], OTA listings (Viator, GetYourGuide, TripAdvisor), social/review platforms, industry directories, B2B channels, SEO/content competitors; foundation context from Step 1 |
| **Outputs** | Categorized discovery list — Primary (3–5 direct substitutes), Secondary (3–5 OTA/adventure/DIY competitors), Peripheral (2–3 adjacent competitors) — each with name, one-line description, and URL; presented to user for confirmation |
| **Feeds Into** | Phase 2 (confirmed Primary competitors proceed to deep profiling) |

> **Gate**: User confirmation required before proceeding to Phase 2.

---

### Phase 2: Deep Profiling

| Field | Details |
|---|---|
| **Inputs** | Confirmed competitor list from Phase 1; `references/competitor-profile-template.md`; web research per competitor (website, OTA listings, social media, reviews, press); cross-reference check against `artifacts/competitors/` for existing cross-market profiles; persona cards from Step 1 (buyer perspective) |
| **Outputs** | Full 9-section competitor profile draft per Primary competitor (and any requested Secondary competitors); cross-reference note in header if prior profile exists |
| **Feeds Into** | Phase 3 (profiles populate benchmark matrix) |

---

### Phase 3: Benchmark Matrix

| Field | Details |
|---|---|
| **Inputs** | All competitor profiles from Phase 2; `references/benchmark-synthesis.md`; foundation context (product structure, pricing) from Step 1 |
| **Outputs** | Side-by-side benchmark matrix across 4 dimension groups: Products, Positioning, Distribution, Customer — each cell rated AHEAD / AT PARITY / BEHIND relative to Memphis Tours |
| **Feeds Into** | Phase 4 (matrix is raw material for synthesis) |

---

### Phase 4: Competitive Intelligence Synthesis

| Field | Details |
|---|---|
| **Inputs** | Benchmark matrix from Phase 3; competitor profiles from Phase 2; `references/benchmark-synthesis.md` synthesis sections |
| **Outputs** | Competitive Gaps table (opportunities where nobody excels); Competitive Threats table (where competitors outperform); Competitive Position Summary (where we win/lose/tied, biggest risk, biggest opportunity); 3+ Strategic Recommendations |
| **Feeds Into** | Step 5 (all outputs written to GitHub repo) |

---

### Step 5: Write to GitHub Repo

| Field | Details |
|---|---|
| **Inputs** | Profile drafts from Phase 2; benchmark summary from Phase 4; `intelligence/_index/[competitors-index].md` (current index); cross-reference check against existing `artifacts/competitors/` |
| **Outputs** | `artifacts/competitors/[kebab-case-name]-[market-context].md` per competitor (YAML frontmatter: type, name, market, destinations, positioning, threat_level, confidence, status, initiative, tags); `artifacts/competitors/_benchmark-[context]-[YYYY-MM-DD].md`; updated `intelligence/_index/[competitors-index].md` |
| **Feeds Into** | Step 6 (memory pointer references committed paths) |

---

### Step 6: Memory Pointer

| Field | Details |
|---|---|
| **Inputs** | Committed artifact paths from Step 5 |
| **Outputs** | Lightweight Perplexity memory entry: competitor names, benchmark summary path, repo location, creation date |
| **Feeds Into** | Future skill invocations (fast artifact lookup) |

---

## Dependency Graph

```
Step 0: Repo Setup
    │
    ▼
Step 1: Context Check ────────────────────────────────────────────┐
  [existing profiles + foundation domains + persona cards]         │
    │                                                              │
    ▼                                                              │
Phase 1: Competitor Identification ◄── Web search (multi-channel) │
  [Primary / Secondary / Peripheral list]                          │
    │  (user confirms)                                             │
    ▼                                                              │
Phase 2: Deep Profiling ◄──── references/competitor-profile-template.md
  [9-section profile per competitor]   + web research per competitor
    │                                                              │
    ▼                                                              │
Phase 3: Benchmark Matrix ◄──── references/benchmark-synthesis.md │
  [AHEAD/AT PARITY/BEHIND across 4 dimension groups]              │
    │                                                              │
    ▼                                                              │
Phase 4: Competitive Intelligence Synthesis ◄─────────────────────┘
  [gaps + threats + position summary + recommendations]
    │
    ▼
Step 5: Write to GitHub Repo
  [artifacts/competitors/*.md + _benchmark-*.md + index update]
    │
    ▼
Step 6: Memory Pointer
```

---

## Artifact Registry

| Artifact | Path Pattern | Frontmatter Type | Depends On |
|---|---|---|---|
| Competitor profile | `artifacts/competitors/[kebab-name]-[market-context].md` | `competitor-profile` | Web research, foundation domains 04/05/06/07/10/11, persona cards |
| Benchmark summary | `artifacts/competitors/_benchmark-[context]-[YYYY-MM-DD].md` | `benchmark-summary` | All competitor profiles for this context |
| Competitors index | `intelligence/_index/[competitors-index].md` | _(index table)_ | All competitor profiles and benchmark summaries |
