# I/O Contract: pe-persona-definition

## Skill-Level Contract

| | Details |
|---|---|
| **Required Inputs** | User-specified context (market, product, or audience); GitHub repo `zeyad-farrag/Product-Engine` accessible |
| **Optional Inputs** | `foundation/domains/04-source-markets.md`, `foundation/domains/05-customer-segmentation.md`, `foundation/domains/03-destination-portfolio.md`, `foundation/domains/06-product-structure.md`, `foundation/domains/10-pricing-policies.md`; existing persona cards in `artifacts/personas/`; MySQL booking data |
| **Produces** | Persona card files at `artifacts/personas/[kebab-case-name].md`; portfolio summary at `artifacts/personas/[context]-portfolio-summary.md` |
| **Updates** | `intelligence/_index/personas.md` |

---

## Step-Level Contracts

### Step 0: Repo Setup

| Field | Details |
|---|---|
| **Inputs** | GitHub repo `zeyad-farrag/Product-Engine`; local workspace `/home/user/workspace` |
| **Outputs** | Cloned or pulled repo at `/home/user/workspace/Product-Engine`; index file(s) at `intelligence/_index/{category}.md` (attempted fast-path read) |
| **Feeds Into** | Step 1 (context check) |

---

### Step 1: Context Check

| Field | Details |
|---|---|
| **Inputs** | `artifacts/personas/` directory listing (GitHub API); foundation domain files: `04-source-markets.md`, `05-customer-segmentation.md`, `03-destination-portfolio.md`, `06-product-structure.md`, `10-pricing-policies.md` |
| **Outputs** | List of existing persona cards relevant to [CONTEXT]; parsed foundation context (market targets, segmentation model, product tiers, pricing); warning if foundation is missing |
| **Feeds Into** | Step 2 (informs which data to gather and which MySQL filters to apply) |

---

### Step 2: Data Gathering

| Field | Details |
|---|---|
| **Inputs** | MySQL (pymysql direct connection via env vars): booking patterns by nationality — `operation_files`, `requests`, `clients`, `countries`, `acc_srv_orders`, `acc_srv_orders_operation_files`, `destinations`, `sources` tables; Web search: `[market] travelers Egypt tours preferences`, `[market] outbound travel behavior`, `[market] travel booking channels`, `[market] luxury/budget travel trends` |
| **Outputs** | Booking pattern data (nationality, avg value, lead time, group size); product/tier preference breakdown; price band clusters; amendment frequency by type; channel split; repeat/LTV data; external research findings on motivations, booking journey, cultural factors, price sensitivity, content channels |
| **Feeds Into** | Step 3 (combined internal + external data drives persona identification) |

---

### Step 3: Persona Identification

| Field | Details |
|---|---|
| **Inputs** | Output of Step 2 (internal data + external research); foundation segmentation model from Step 1 |
| **Outputs** | 2–5 distinct persona candidates with defined decision-making patterns; differentiation test applied (same decision = same persona) |
| **Feeds Into** | Step 4 (one persona card built per candidate) |

---

### Step 4: Build Persona Cards

| Field | Details |
|---|---|
| **Inputs** | Persona candidates from Step 3; `references/persona-card-template.md`; foundation context from Step 1 (brand/tier fit assessment requires `06-product-structure.md`); evidence from Step 2 |
| **Outputs** | Full persona card draft for each persona — 8 sections: IDENTITY, MOTIVATIONS & NEEDS, DECISION JOURNEY, PRODUCT EXPECTATIONS, PRICE & VALUE, CONTENT & CHANNEL, BRAND & TIER FIT, EVIDENCE BASIS |
| **Feeds Into** | Step 5 (all cards feed portfolio summary) |

---

### Step 5: Portfolio Summary

| Field | Details |
|---|---|
| **Inputs** | All persona cards from Step 4; `references/portfolio-summary.md`; existing `artifacts/personas/` (cross-reference check for cross-market patterns) |
| **Outputs** | Persona Comparison Matrix (8-dimension comparison across all personas); Strategic Recommendations (primary target, growth persona, underserved persona, avoid persona); cross-market pattern notes |
| **Feeds Into** | Step 6 (persisted as separate file or appended to final card) |

---

### Step 6: Write to GitHub Repo

| Field | Details |
|---|---|
| **Inputs** | Persona card drafts from Step 4; portfolio summary from Step 5; existing `artifacts/personas/` (cross-reference check before writing); `intelligence/_index/personas.md` (current index content) |
| **Outputs** | `artifacts/personas/[kebab-case-name].md` per persona (YAML frontmatter: type, name, market, segment, destinations, confidence, status, initiative, tags); `artifacts/personas/[context]-portfolio-summary.md`; updated `intelligence/_index/personas.md` |
| **Feeds Into** | Step 7 (memory pointer references committed paths) |

---

### Step 7: Memory Pointer

| Field | Details |
|---|---|
| **Inputs** | Committed artifact paths and names from Step 6 |
| **Outputs** | Lightweight Perplexity memory entry: persona card names, repo path, creation date |
| **Feeds Into** | Future skill invocations (enables fast artifact lookup without re-scanning repo) |

---

## Dependency Graph

```
Step 0: Repo Setup
    │
    ▼
Step 1: Context Check ──────────────────────────────────────────────┐
  [existing personas + foundation domain files]                      │
    │                                                                 │
    ▼                                                                 │
Step 2: Data Gathering                                                │
  [MySQL booking data + web research]                                 │
    │                                                                 │
    ▼                                                                 │
Step 3: Persona Identification                                        │
  [2–5 distinct behavioral personas]                                  │
    │                                                                 │
    ▼                                                                 │
Step 4: Build Persona Cards ◄──── references/persona-card-template.md
  [8-section card per persona]         + foundation context (Step 1) │
    │                                                                 │
    ▼                                                                 │
Step 5: Portfolio Summary ◄──────────────────────────────────────────┘
  [comparison matrix + recommendations]  (cross-ref existing personas)
    │
    ▼
Step 6: Write to GitHub Repo
  [artifacts/personas/*.md + index update]
    │
    ▼
Step 7: Memory Pointer
```

---

## Artifact Registry

| Artifact | Path Pattern | Frontmatter Type | Depends On |
|---|---|---|---|
| Persona card | `artifacts/personas/[kebab-case-name].md` | `persona-card` | MySQL booking data, web research, foundation domains 04/05/06/10 |
| Portfolio summary | `artifacts/personas/[context]-portfolio-summary.md` | _(inline in file)_ | All persona cards for this context |
| Persona index | `intelligence/_index/personas.md` | _(index table)_ | All persona cards |
