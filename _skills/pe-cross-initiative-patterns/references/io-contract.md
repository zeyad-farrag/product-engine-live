# I/O Contract: pe-cross-initiative-patterns

## Skill-Level Contract

| | Details |
|---|---|
| **Required Inputs** | At least 1 initiative (active or closed) in the repo; artifact directories accessible in GitHub repo |
| **Optional Inputs** | `foundation/business-model-summary.md` (business model context); `intelligence/_index/{category}.md` index files (accelerate lookup); prior `intelligence/cross-initiative-patterns/` reports (enable prior insight comparison); 3+ initiatives recommended for meaningful patterns |
| **Produces** | `intelligence/cross-initiative-patterns/YYYY-MM-DD.md` (full pattern mining report: manifest, 6 analyses, 5 institutional insights, intelligence system health, recommended next initiatives) |
| **Updates** | `intelligence/_index/` — relevant index file for `cross-initiative-patterns` artifact type; all prior cross-initiative-patterns reports set to `status: superseded` |

---

## Step-Level Contracts

### Step 0: Foundation Check

| Field | Details |
|---|---|
| **Inputs** | `foundation/business-model-summary.md`; `intelligence/_index/{category}.md` (fast-path index check) |
| **Outputs** | Foundation loaded (business model context available) or nudge displayed (proceeding without context); index files parsed if present |
| **Feeds Into** | All analysis steps (business model framing distinguishes company-level vs. market-level patterns); Step 1 (index data replaces directory scanning where available) |

---

### Step 1: Complete Memory Retrieval

| Field | Details |
|---|---|
| **Inputs** | All artifact directories: `artifacts/personas/`, `artifacts/competitors/`, `artifacts/demand-signals/`, `artifacts/health-checks/`, `artifacts/gap-analyses/`, `artifacts/decision-records/`, `artifacts/market-assessments/`; intelligence layer: `intelligence/portfolio-health/`, `intelligence/signal-detection/`, `intelligence/cross-initiative-patterns/`; `initiatives/active/`, `initiatives/closed/`; `foundation/` (all files); full file contents read in parallel (priority order: initiatives → personas → competitors → decision-records → gap-analyses → demand-signals → health-checks → intelligence layer) |
| **Outputs** | Complete Repository Manifest table (category, files found, artifact count); total initiatives count; total artifacts count; list of prior pattern reports for comparison tracking; threshold warning if fewer than 3 initiatives |
| **Feeds Into** | All 6 analyses (Step 2); Step 3 Synthesis (intelligence system health metrics); Step 4 Storage (frontmatter counts) |

---

### Step 2 — Analysis 1: Persona Convergence

| Field | Details |
|---|---|
| **Inputs** | All `artifacts/personas/` file contents (from Step 1); `references/synthesis-framework.md` (convergence labels); `references/analysis-templates.md` (Analysis 1 table format) |
| **Outputs** | Persona Convergence Matrix: archetypes grouped by job-to-be-done/pain cluster, market appearance count, convergence label; universal archetypes (3+ markets) flagged as market-agnostic product opportunities; market-unique personas called out |
| **Feeds Into** | Step 2 — Analysis 6 (Hypothesis Testing — persona hypotheses); Step 3 Synthesis (Insight #N, Recommended Next Initiatives) |

---

### Step 2 — Analysis 2: Competitive Intelligence Convergence

| Field | Details |
|---|---|
| **Inputs** | All `artifacts/competitors/` file contents (from Step 1); `references/analysis-templates.md` (Analysis 2 table format) |
| **Outputs** | Competitive Convergence Table: multi-market competitors (2+ markets), aggregated strengths/weaknesses, threat trajectory (STRONGER/WEAKER/STABLE); "what winners do differently" patterns; competitive gap convergence across markets |
| **Feeds Into** | Step 2 — Analysis 6 (Hypothesis Testing — competitive hypotheses); Step 3 Synthesis |

---

### Step 2 — Analysis 3: Decision Pattern Analysis

| Field | Details |
|---|---|
| **Inputs** | All `artifacts/decision-records/` file contents (from Step 1); `references/analysis-templates.md` (Analysis 3 table format) |
| **Outputs** | Decision Pattern Table (categorized by type: Market Entry / Repositioning / Optimization / New Product; outcome; rationale); common approval and rejection factors; decision quality tracking (projections vs. actuals where available); Bias Assessment (optimism bias if approval rate >80%, risk aversion if rejection rate >60%, overestimation bias, familiarity bias) |
| **Feeds Into** | Step 2 — Analysis 6 (Hypothesis Testing — decision bias hypotheses); Step 3 Synthesis |

---

### Step 2 — Analysis 4: Gap & Issue Patterns

| Field | Details |
|---|---|
| **Inputs** | All `artifacts/gap-analyses/` file contents; `artifacts/health-checks/` issue sections (from Step 1); `references/analysis-templates.md` (Analysis 4 table format) |
| **Outputs** | Gap Pattern Matrix (gap/issue, source documents, occurrence count, context); systemic issues flagged where gap appears 3+ times across different products/contexts — elevated from product problem to company-level issue |
| **Feeds Into** | Step 2 — Analysis 6 (Hypothesis Testing); Step 3 Synthesis (systemic_issues count for frontmatter) |

---

### Step 2 — Analysis 5: Demand Pattern Synthesis

| Field | Details |
|---|---|
| **Inputs** | All `artifacts/demand-signals/` file contents; `intelligence/signal-detection/` reports (from Step 1); `references/analysis-templates.md` (Analysis 5 table format) |
| **Outputs** | Demand Pattern Synthesis Table (signal, classification: Growth/Decline/Neutral/Ambiguous, convergence level by independent source count); structural vs. cyclical classification for decline patterns; hidden demand patterns (signals in data never acted upon) explicitly flagged |
| **Feeds Into** | Step 2 — Analysis 6 (Hypothesis Testing — demand hypotheses); Step 3 Synthesis |

---

### Step 2 — Analysis 6: Hypothesis Testing

| Field | Details |
|---|---|
| **Inputs** | User-provided hypothesis (if any); outputs of Analyses 1–5 (patterns, archetypes, competitive findings, decision biases, systemic gaps, demand patterns); `references/analysis-templates.md` (Analysis 6 format) |
| **Outputs** | 3–5 data-suggested hypotheses (if none provided); per hypothesis: supporting evidence (source file + strength: STRONG/MODERATE/WEAK), contradicting evidence, verdict (SUPPORTED / PARTIALLY SUPPORTED / NOT SUPPORTED / INSUFFICIENT DATA) |
| **Feeds Into** | Step 3 Strategic Synthesis (Institutional Insights — hypothesis verdicts contribute to evidence base) |

---

### Step 3: Strategic Synthesis

| Field | Details |
|---|---|
| **Inputs** | All 6 analysis outputs (Step 2); manifest data from Step 1 (portfolio coverage, artifact age, decision outcome data, cross-reference density); prior pattern reports from Step 1 (for strengthening/weakening comparison); `references/synthesis-framework.md` (insight scoring rubric, health metric thresholds, convergence definitions) |
| **Outputs** | Exactly 5 Institutional Insights (each with evidence base, confidence level HIGH/MEDIUM/LOW, strategic implication); Intelligence System Health table (% portfolio with health data, % markets with studies, avg intelligence age, % decisions with outcome data, cross-reference density); Recommended Next Initiatives table (3–5 items with rationale from patterns, type: Research/Validation/Launch); Prior Report Comparison (insights strengthened/weakened/new since last report, if applicable) |
| **Feeds Into** | Step 4 Storage (top_insight, persona_archetypes_found, multi_market_competitors, systemic_issues frontmatter fields) |

---

### Step 4: Store Output

| Field | Details |
|---|---|
| **Inputs** | Complete report body (Step 1 manifest + Step 2 analyses + Step 3 synthesis); frontmatter values: `initiatives_analyzed`, `artifacts_analyzed`, `persona_archetypes_found`, `multi_market_competitors`, `systemic_issues`, `top_insight` |
| **Outputs** | `intelligence/cross-initiative-patterns/YYYY-MM-DD.md` (committed to GitHub via local clone at `/tmp/product-engine-live`); all prior cross-initiative-patterns reports updated to `status: superseded` via GitHub API; `intelligence/_index/` index row added/updated; Perplexity memory pointer |
| **Feeds Into** | Future cross-initiative-patterns runs (Step 1 — prior report for comparison); pe-portfolio-health Step 0; pe-signal-detection Step 0 |

---

## Dependency Graph

```
foundation/business-model-summary.md
    │
    ▼
Step 0: Foundation Check + Index Lookup
    │
    ▼
Step 1: Complete Memory Retrieval
    (personas, competitors, demand-signals,
     health-checks, gap-analyses, decision-records,
     market-assessments, initiatives, intelligence layer)
    │
    ├──► Analysis 1: Persona Convergence
    │        (personas → archetypes, universal opportunities)
    │                │
    ├──► Analysis 2: Competitive Convergence
    │        (competitors → multi-market threats, winner patterns)
    │                │
    ├──► Analysis 3: Decision Pattern Analysis
    │        (decision-records → approval/rejection factors, bias)
    │                │
    ├──► Analysis 4: Gap & Issue Patterns
    │        (gap-analyses, health-checks → systemic issues)
    │                │
    ├──► Analysis 5: Demand Pattern Synthesis
    │        (demand-signals, signal-detection → hidden patterns)
    │                │
    └──► Analysis 6: Hypothesis Testing ◄─── (Analyses 1–5 outputs)
             (user hypothesis or data-suggested)
                     │
                     ▼
              Step 3: Strategic Synthesis
              (5 Insights + System Health + Next Initiatives)
              ◄─── synthesis-framework.md
              ◄─── prior cross-initiative-patterns reports (comparison)
                     │
                     ▼
              Step 4: Storage
              → intelligence/cross-initiative-patterns/YYYY-MM-DD.md
              → intelligence/_index/ (updated)
              → prior reports (status: superseded)
```

---

## Artifact Registry

| Artifact | Path Pattern | Frontmatter Type | Depends On |
|---|---|---|---|
| Cross-Initiative Patterns Report | `intelligence/cross-initiative-patterns/YYYY-MM-DD.md` | `cross-initiative-patterns` | personas, competitors, demand-signals, health-checks, gap-analyses, decision-records, market-assessments, initiatives (active + closed), portfolio-health reports, signal-detection reports |
| Intelligence Index (cross-initiative-patterns) | `intelligence/_index/cross-initiative-patterns.md` | index | Cross-Initiative Patterns Report |
