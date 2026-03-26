# Benchmark Synthesis Template

Use this template to produce the Phase 3 Benchmark Matrix and Phase 4 Competitive Intelligence Synthesis. Complete all four sections in order.

---

## YAML Frontmatter (for the saved file)

```yaml
---
type: benchmark-summary
context: [CONTEXT — e.g., "Egypt travel packages for the UK market"]
market: [source market]
profiles_included: [list of competitor names included in this benchmark]
created: YYYY-MM-DD
updated: YYYY-MM-DD
confidence: HIGH | MEDIUM | LOW
status: active | superseded | archived
initiative: [producing initiative slug or "standalone"]
tags: [searchable tags]
---
```

---

## Section 1: Benchmark Matrix

Create a side-by-side comparison across all profiled competitors and Memphis Tours. For each cell, note whether Memphis Tours is **AHEAD**, **AT PARITY**, or **BEHIND** relative to that competitor on that dimension.

| Dimension | Memphis Tours | [Comp 1] | [Comp 2] | [Comp 3] | [Comp 4] | [Comp 5] |
|---|---|---|---|---|---|---|
| **PRODUCTS** | | | | | | |
| Destination coverage | | | | | | |
| Product range | | | | | | |
| Price range | | | | | | |
| Product structure | | | | | | |
| Unique offerings | | | | | | |
| Product breadth | | | | | | |
| **POSITIONING** | | | | | | |
| Market positioning | | | | | | |
| Content quality | | | | | | |
| Trust signals | | | | | | |
| Brand clarity | | | | | | |
| **DISTRIBUTION** | | | | | | |
| Channel breadth | | | | | | |
| OTA presence | | | | | | |
| Digital marketing | | | | | | |
| SEO performance | | | | | | |
| **CUSTOMER** | | | | | | |
| Review ratings | | | | | | |
| Review volume | | | | | | |
| Customer sentiment | | | | | | |

**Legend**: AHEAD = we outperform them on this dimension | AT PARITY = roughly equivalent | BEHIND = they outperform us

**Note**: Add or remove competitors columns as needed. Add rows for any dimensions particularly important to [CONTEXT].

---

## Section 2: Competitive Gaps (Opportunities)

Gaps are unmet needs or underserved areas across the competitive landscape — where nobody does things well. This is where differentiation lives.

| Gap | Description | Evidence | Opportunity Size | Difficulty to Close |
|---|---|---|---|---|
| [Gap 1] | [What's missing or poorly served in the market] | [How we know — what evidence shows this gap] | H / M / L | H / M / L |
| [Gap 2] | | | | |
| [Gap 3] | | | | |
| [Gap 4] | | | | |
| [Gap 5] | | | | |

**Opportunity Size**: H = large addressable demand, M = meaningful but bounded, L = niche  
**Difficulty to Close**: H = requires significant investment or capability, M = achievable with moderate effort, L = quick win

---

## Section 3: Competitive Threats (Risks)

| Threat | Description | Evidence | Severity | Urgency |
|---|---|---|---|---|
| [Threat 1] | [What a competitor does better, or a competitive move that risks our position] | [Evidence — cite sources] | H / M / L | H / M / L |
| [Threat 2] | | | | |
| [Threat 3] | | | | |
| [Threat 4] | | | | |
| [Threat 5] | | | | |

**Severity**: H = could significantly erode our position in [CONTEXT], M = meaningful but manageable, L = minor  
**Urgency**: H = requires response within 3 months, M = address within 6 months, L = monitor for now

---

## Section 4: Our Competitive Position Summary

### Where We Stand

**Where we win** (top competitive advantages in [CONTEXT]):
1. [Specific advantage — evidence-based]
2. [Specific advantage — evidence-based]
3. [Specific advantage — evidence-based]

**Where we lose** (top competitive disadvantages in [CONTEXT]):
1. [Specific disadvantage — evidence-based]
2. [Specific disadvantage — evidence-based]
3. [Specific disadvantage — evidence-based]

**Where nobody wins** (market whitespace — unserved or underserved needs):
1. [Whitespace area 1]
2. [Whitespace area 2]
3. [Whitespace area 3]

**Biggest competitive risk**: [Single most threatening competitive development — be specific]

**Biggest competitive opportunity**: [Single most promising gap or whitespace to exploit — be specific]

---

## Section 5: Strategic Recommendations

Based on this competitive analysis, the following actions are recommended:

1. **[Recommendation title]**  
   [Specific action — what to do, why, and what evidence supports it. Be concrete.]

2. **[Recommendation title]**  
   [Specific action — what to do, why, and what evidence supports it. Be concrete.]

3. **[Recommendation title]**  
   [Specific action — what to do, why, and what evidence supports it. Be concrete.]

[Add more recommendations if warranted — up to 5]

---

## Cross-Reference Patterns

Before finalizing the synthesis, check whether competitive gaps or threats identified here echo findings from other analyses in the repo:

```bash
# Search for related gap analyses
gh api repos/zeyad-farrag/product-engine-live/contents/artifacts/gap-analyses \
  --jq '.[].name'

# Search for related market assessments
gh api repos/zeyad-farrag/product-engine-live/contents/artifacts/market-assessments \
  --jq '.[].name'
```

If patterns echo gaps or threats found in other contexts, note them:

> Pattern flag: The gap identified here ("X") also appears in [other analysis] — this suggests a systemic opportunity rather than a context-specific one.
