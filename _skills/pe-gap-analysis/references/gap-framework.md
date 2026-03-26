# Gap Analysis Framework — 6-Step Reference

This file contains the complete execution framework for a gap analysis. Load this file when running any gap analysis for a product/benchmark pair.

---

## Step 1: Define the Benchmark Standard

Before identifying gaps, articulate what "good" looks like from the benchmark perspective. The benchmark type determines what questions to answer.

### If [BENCHMARK] is an Audience

Draw from persona cards, market research, and booking behavior data:

| Question | Source |
|---|---|
| What does [BENCHMARK] expect from this type of product? | Persona cards, market research |
| What are their must-haves, nice-to-haves, and deal-breakers? | Persona cards |
| What do they value most? What do they care least about? | Persona cards, demand signal reports |
| What are competitors delivering to this audience? | Competitor profiles (sets the competitive expectation floor) |

**Required output**: A benchmark standard summary — 5–10 bullet points listing the expectations, ranked by importance to the audience.

### If [BENCHMARK] is a Competitor

Draw from competitor profiles:

| Question | Source |
|---|---|
| What does [competitor] deliver in their equivalent product? | Competitor profile |
| What is their positioning and value proposition? | Competitor profile |
| What do their customers praise and complain about? | Competitor profile, review data |
| What is the minimum standard to compete with them? | Competitive analysis |

**Required output**: A competitor standard summary — what they deliver across each relevant dimension.

### If [BENCHMARK] is a Market Norm or Best Practice

Draw from industry research, competitor profiles, demand signal reports:

| Question | Source |
|---|---|
| What is the industry standard for this type of product? | Market research, competitor profiles |
| What do top-performing products in this category include? | Competitor profiles, industry benchmarks |
| What do customer reviews across the industry consistently praise or demand? | Review data, demand signal reports |

**Required output**: An industry standard summary across relevant dimensions.

---

## Step 2: Assess Current Product State

Document the current state of [PRODUCT] across every relevant dimension. Use evidence sources for each claim.

| Dimension | Current State | Evidence Source |
|---|---|---|
| Value proposition / positioning | [what it promises] | [website/content] |
| Product structure / itinerary | [what's included] | [product catalog] |
| Accommodation level | [current] | [product spec] |
| Activities / experiences | [current inclusions] | [product spec] |
| Duration / flexibility | [current] | [product spec] |
| Pricing | [current price point] | [catalog/database] |
| Content / presentation | [quality of descriptions, images, info depth] | [website audit] |
| Booking experience | [how customers book this product] | [channel assessment] |
| Trust signals | [reviews, ratings, guarantees, social proof] | [platforms] |
| Distribution | [where this product is available] | [channel assessment] |
| Post-booking experience | [confirmations, prep materials, amendments handling] | [process assessment] |
| Customer satisfaction indicators | [reviews, repeat rate, NPS if available] | [data] |

> Add or remove dimensions as appropriate for the product category. Every dimension must have an evidence source — if data is unavailable for a dimension, mark it `[unknown — insufficient data]` and note it as a gap in the analysis confidence.

---

## Step 3: Gap Identification

For each dimension, compare current state against the benchmark standard. Assign a gap type and severity for every dimension — including dimensions with no gap (NONE).

### Gap Identification Table

| # | Dimension | Current State | [BENCHMARK] Expectation | Gap Description | Gap Type | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 1 | [dimension] | [what we have] | [what's expected] | [specific gap] | [type] | [severity] | [how we know] |
| 2 | | | | | | | |
| ... | | | | | | | |

### Gap Types

| Type | Definition |
|---|---|
| **MISSING** | We don't have something the benchmark expects |
| **DEFICIENT** | We have it, but it's below benchmark standard |
| **MISALIGNED** | We have it, but it's positioned or framed wrong for the benchmark |
| **EXCESS** | We have more than the benchmark needs (potential cost savings or repositioning opportunity) |
| **NONE** | Current state meets or exceeds benchmark |

### Severity Definitions

| Severity | Definition |
|---|---|
| **CRITICAL** | This gap prevents purchase. The benchmark audience/standard considers this a deal-breaker. Must fix before proceeding. |
| **MAJOR** | This gap significantly reduces competitiveness. Most of the benchmark audience would notice and care. |
| **MODERATE** | This gap affects perception but isn't a deal-breaker. Important for competitive parity. |
| **MINOR** | Nice to close but doesn't materially impact conversion or satisfaction. |
| **NONE** | No gap. Current state meets or exceeds benchmark. |

> **Severity is relative to impact on the benchmark audience.** A gap that exists but doesn't affect purchase decisions is MINOR regardless of how "wrong" it feels from an internal perspective.

---

## Step 4: Gap Prioritization

Organize gaps into a four-level priority matrix. Separate excess findings for their own analysis.

### Priority 1: Critical Gaps — Must Fix

| Gap | Current State | Expected State | Fix Approach | Effort (H/M/L) | Impact (H/M/L) |
|---|---|---|---|---|---|
| [gap name] | [current] | [target] | [how to close] | [H/M/L] | [H/M/L] |

### Priority 2: Major Gaps — Should Fix

| Gap | Current State | Expected State | Fix Approach | Effort (H/M/L) | Impact (H/M/L) |
|---|---|---|---|---|---|
| [gap name] | [current] | [target] | [how to close] | [H/M/L] | [H/M/L] |

### Priority 3: Moderate Gaps — Plan to Fix

| Gap | Current State | Expected State | Fix Approach | Effort (H/M/L) | Impact (H/M/L) |
|---|---|---|---|---|---|
| [gap name] | [current] | [target] | [how to close] | [H/M/L] | [H/M/L] |

### Priority 4: Minor Gaps — Fix If Easy

| Gap | Current State | Expected State | Fix Approach | Effort (H/M/L) | Impact (H/M/L) |
|---|---|---|---|---|---|
| [gap name] | [current] | [target] | [how to close] | [H/M/L] | [H/M/L] |

### Excess Analysis — Potential Reallocation

| Dimension | What We Have | What Benchmark Needs | Opportunity |
|---|---|---|---|
| [dimension] | [our level] | [benchmark level] | [can resources from here be reallocated to gap areas?] |

> Excess dimensions are not automatically good. Over-delivering on features the benchmark doesn't value means misallocated resources or misaligned positioning. Treat excess findings as optimization candidates.

---

## Gap Summary Counts

At the end of gap identification, produce a summary count for use in memory pointers and frontmatter tags:

| Severity | Count |
|---|---|
| CRITICAL | [n] |
| MAJOR | [n] |
| MODERATE | [n] |
| MINOR | [n] |
| NONE | [n] |
| EXCESS | [n] |
| **Total dimensions assessed** | [n] |

---

## Step 5: Strategic Classification

See `references/classification-guide.md` for full classification criteria and decision trees.

### Quick Reference Table

| Classification | Criteria | Implication |
|---|---|---|
| **STRONG_FIT** | No critical gaps; 0–1 major gaps | Minor adjustments needed — optimization territory |
| **FIXABLE_FIT** | Some critical/major gaps; all are closable with reasonable effort | Clear optimization path — prioritize and execute |
| **REPOSITIONING_NEEDED** | Gaps are primarily in positioning/messaging, not product structure | Product is fundamentally sound but presented wrong for this benchmark |
| **REDESIGN_NEEDED** | Multiple critical structural gaps — product doesn't match what's expected | Changes are too deep for optimization — consider new product or major restructuring |
| **FUNDAMENTAL_MISMATCH** | Product and benchmark are incompatible | Closing the gaps would mean building a different product entirely |

**Classification output format:**

```
Classification: [OUTCOME]
Reasoning: [2–4 sentences explaining what drove this classification — specifically the pattern of gaps that led to this verdict, not just a restatement of the table criteria]
```

---

## Step 6: Action Recommendations

Organize recommendations into four time horizons plus decisions requiring human judgment. Do not prescribe fixes during gap identification (Step 3) — prescribe here only.

### Immediate Actions — Critical Gaps and Quick Wins

Items from Priority 1 (critical) and any Priority 2/3 items where effort is LOW and impact is HIGH.

| Action | Gap It Closes | Specific Change | Owner Type | Estimated Effort |
|---|---|---|---|---|
| [action] | [gap] | [specific change] | [product/marketing/ops] | [H/M/L] |

### Short-Term Actions — Major Gaps, Moderate Effort

Items from Priority 2 with medium or high effort.

| Action | Gap It Closes | Specific Change | Owner Type | Estimated Effort |
|---|---|---|---|---|
| [action] | [gap] | [specific change] | [product/marketing/ops] | [H/M/L] |

### Medium-Term Actions — Moderate Gaps, Planned Improvement

Items from Priority 3, plus systemic fixes that require cross-product coordination.

| Action | Gap It Closes | Specific Change | Owner Type | Estimated Effort |
|---|---|---|---|---|
| [action] | [gap] | [specific change] | [product/marketing/ops] | [H/M/L] |

### Strategic Decisions Requiring Human Judgment

List decisions that cannot be made analytically — they require commercial, strategic, or resourcing input from a human decision-maker.

| Decision | Why Human Judgment is Required | Relevant Data Points |
|---|---|---|
| [decision] | [reason — e.g., trade-off between cost and competitive parity] | [what we know that informs the decision] |

---

## Cross-Reference Check

Before finalizing the analysis, run the following cross-reference:

1. **Systemic gap check**: Have similar gaps been identified in other products for the same benchmark? If yes, note it — a systemic gap affects the whole portfolio, not just this product.

2. **Benchmark consistency check**: Are these benchmark expectations consistent with what other analyses have found for this audience or competitor? If contradictions exist, flag them.

3. **Initiative alignment check**: Do gap findings validate or contradict conclusions from active or closed initiatives? If gap findings contradict a recent initiative decision, flag it for review.

**Cross-reference output format:**

```
Systemic gaps: [none found | list of gaps appearing across multiple products]
Benchmark consistency: [consistent | contradictions found — describe]
Initiative alignment: [aligned | contradictions found — cite initiative and conflict]
```
