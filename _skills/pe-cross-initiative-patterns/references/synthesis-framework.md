# Synthesis Framework — Cross-Initiative Pattern Mining

Scoring rubrics, convergence definitions, health metric thresholds, and prioritization frameworks for the Strategic Synthesis step.

---

## Convergence Level Definitions

| Level | Sources Required | Label | Usage |
|---|---|---|---|
| STRONG | 5+ independent sources | STRONG | High confidence pattern — act on it |
| MODERATE | 3–4 independent sources | MODERATE | Solid pattern — act with normal diligence |
| WEAK | 2 independent sources | WEAK | Emerging pattern — monitor and validate |
| SIGNAL | 1 source | SIGNAL (not pattern) | Do not call a pattern; label as "signal to watch" |

**Rule**: Never call something a pattern with fewer than 2 independent sources. A single study or document produces a signal, not a pattern.

**Independence criterion**: Two documents from the same initiative do not count as independent sources. Independence requires different markets, different time periods, or different research methods.

---

## Institutional Insight Scoring Rubric

Use this rubric to score candidate insights and select the top 5 for the Strategic Synthesis.

### Scoring Dimensions (each 1–5)

| Dimension | 1 | 3 | 5 |
|---|---|---|---|
| **Evidence strength** | Single source, weak | 2–3 moderate sources | 4+ sources, at least one strong |
| **Novelty** | Already known / obvious | Somewhat surprising | Genuinely unexpected finding |
| **Actionability** | No clear path to action | Possible action | Clear, specific strategic action |
| **Business impact** | Minor, local | Moderate, regional | Transformative, company-level |
| **Urgency** | Low — can wait | Medium — act within 6 months | High — act within quarter |

**Total score**: sum of 5 dimensions (max 25)

### Confidence Levels

Assign confidence based on evidence strength dimension:
- **HIGH**: Evidence strength score = 4–5 (multiple strong independent sources)
- **MEDIUM**: Evidence strength score = 2–3 (moderate sources or limited independence)
- **LOW**: Evidence strength score = 1 (thin evidence; preliminary finding)

### Insight Selection

1. Score all candidate insights using the rubric
2. Select top 5 by total score
3. If tied: prefer higher business impact and higher evidence strength
4. Ensure diversity: do not pick 5 insights from the same analysis; aim for cross-analysis coverage
5. Label each insight with its confidence level

### Insight Quality Criteria

Apply these tests before finalizing each insight:
- "Is this specific enough to drive a decision?" → if not, sharpen it
- "Could someone argue the opposite?" → if yes, note the counterargument
- "Does this make future decisions better?" → if not, it's an observation, not an insight
- "Would this be obvious to anyone paying attention?" → if yes, look for a deeper version

---

## Intelligence System Health Metrics

### Metric Calculations

**1. Portfolio Coverage — % of products with health data**
```
Products with health checks / Total products in portfolio × 100
```
Source: Count unique products appearing in health-checks/ vs. all products across all initiatives.

**2. Market Coverage — % of active markets with studies**
```
Markets with at least one study (persona, competitor, or demand signal) / Total markets served × 100
```
Source: Count unique markets in artifacts/ vs. markets mentioned in initiatives/.

**3. Intelligence Freshness — Average age of artifacts**
```
Sum of (today - artifact_date) for all artifacts / Total artifact count
```
Source: Extract dates from artifact frontmatter (`created:` field) or file names (YYYY-MM-DD format).

**4. Decision Tracking — % of decisions with outcome data**
```
Decision records with actual outcome / Total decision records × 100
```
Source: Count decision records where `projected vs. actual` section is populated.

**5. Cross-Reference Density — Interconnectedness**
```
Total cross-references across all artifacts / Total artifact count
```
A cross-reference is any mention of another artifact by name or ID in a document.
Higher density = more interconnected knowledge base = higher analytical value.

### Health Status Thresholds

| Metric | 🟢 Healthy | 🟡 Warning | 🔴 Critical |
|---|---|---|---|
| Portfolio health coverage | ≥ 70% | 40–69% | < 40% |
| Market study coverage | ≥ 60% | 30–59% | < 30% |
| Intelligence freshness | ≤ 90 days avg | 91–180 days | > 180 days |
| Decision outcome tracking | ≥ 50% | 25–49% | < 25% |
| Cross-reference density | ≥ 2.0 per artifact | 1.0–1.9 | < 1.0 |

### Health Interpretation Guide

| Status | Meaning | Recommended Action |
|---|---|---|
| 🟢 All healthy | Intelligence system functioning well | Continue cadence |
| 🟡 1–2 warnings | Coverage or freshness gaps | Schedule targeted studies |
| 🔴 Any critical | Significant blind spots | Address before next strategic cycle |
| 🔴 Multiple critical | Intelligence system immature | Prioritize artifact creation before next pattern run |

---

## Recommended Next Initiative Prioritization Framework

Use this framework to generate the Recommended Next Initiatives table.

### Prioritization Drivers (in order of weight)

1. **Systemic issues** (highest weight) — any systemic issue from Analysis 4 should generate a recommended initiative
2. **Universal archetypes unaddressed** — archetype appears 3+ markets but no product/initiative serves them
3. **Hidden demand signals** — strong signals from Analysis 5 that were never acted on
4. **Competitive gaps** — competitive gap convergence from Analysis 2 with no current initiative
5. **Intelligence gaps** — markets or products with no health data, no study, or stale intelligence

### Initiative Type Definitions

| Type | Description |
|---|---|
| **Research** | Need more data before acting — demand signal study, persona deep-dive, competitive audit |
| **Validation** | Hypothesis exists, need to test — pilot, prototype, experiment |
| **Launch** | Evidence sufficient to move — product build, market entry, repositioning |
| **Intelligence** | Close gaps in the knowledge base — health check, market assessment, decision record |

### Prioritization Table Format

```
| Priority | Initiative | Type | Rationale from Patterns | Urgency | Lead Indicator |
|---|---|---|---|---|---|
| 1 | [Specific initiative name] | Launch | [Systemic issue X + archetype Y both point here] | HIGH | [What to measure] |
| 2 | [Name] | Research | [Hidden demand signal Z never validated] | MEDIUM | [What to measure] |
| 3 | [Name] | Intelligence | [Market A has no health data — blind spot] | MEDIUM | [Coverage metric] |
```

### Rationale Writing Guide

Each rationale must:
- Reference at least one specific finding from the 6 analyses (not generic reasoning)
- State the convergence level of the evidence
- Explain WHY this initiative and WHY NOW

---

## Prior Report Comparison Framework

Use when prior cross-initiative-patterns reports exist in the repo.

### Tracking Changes Across Runs

For each insight in the current report, check if it appeared in prior reports:

| Insight | Status | Change | Implication |
|---|---|---|---|
| [Insight text] | **STRENGTHENED** | More sources now confirm it | Higher confidence; stronger action signal |
| [Insight text] | **WEAKENED** | Contradicting evidence emerged | Revisit; may have been premature |
| [Insight text] | **NEW** | Not in prior reports | Fresh finding from new data |
| [Insight text] | **RESOLVED** | Was an issue, now addressed | Document as institutional learning |

### Pattern Maturity

- Insight appears in 1 report: **Emerging** — monitor
- Insight appears in 2 consecutive reports: **Developing** — validate
- Insight appears in 3+ consecutive reports: **Established** — act

---

## Systemic Issue Elevation Criteria

An issue is elevated from product-level to **company-level systemic issue** when:

1. **Frequency**: Appears 3+ times across different products or contexts (not the same product studied multiple times)
2. **Independence**: The sources are independent (different initiatives, markets, or time periods)
3. **Consistency**: The manifestation is similar across contexts — same type of gap, same type of failure

When elevated:
- Mark with 🔴 SYSTEMIC ISSUE in the gap matrix
- Move to the dedicated Systemic Issues section
- Frame as an organizational problem requiring strategic intervention
- Do NOT suggest product-by-product fixes for systemic issues

### Examples of Systemic Issues (travel company context)

- Pricing infrastructure gaps appearing in 3+ product health checks → pricing platform problem
- "No mobile optimization" across 3+ products → tech platform debt
- "Customer data not shared across products" in 3+ gap analyses → data architecture problem
- "Arabic/local language support absent" in 3+ market studies → localization strategy gap

---

## Analytical Principles

1. **Patterns require convergence** — 2+ independent sources required. Label convergence level on every pattern.
2. **Institutional learning is the goal** — every pattern must make future decisions better-informed. If an insight doesn't change a future decision, it's an observation.
3. **Test, don't assume** — generate hypotheses and test against evidence. Never state a hypothesis as a fact without testing.
4. **Track prediction accuracy** — when projections exist, compare to actuals. Calibration improves over time.
5. **Surface the uncomfortable** — systemic issues, decision biases, and missed opportunities are the highest-value findings. Don't soft-pedal them.
6. **Point to the next action** — every institutional insight must connect to a recommended initiative or strategic action.
7. **This gets better with time** — the first run with 3 initiatives will be modest. The tenth run with 20+ initiatives produces strategic foresight. Note maturity level in the report.
