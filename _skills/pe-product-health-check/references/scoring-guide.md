# Scoring Guide — Product Health Check

This file defines the composite scoring methodology, per-dimension scoring criteria, health classification thresholds, and actionable next steps for each classification level.

---

## Composite Scoring Methodology

The composite health score is calculated as a weighted average of six dimensions, each scored on a **1–10 scale**. The weighted average is then multiplied by 10 to produce a **0–100 composite score**.

### Dimension Weights

| Health Dimension | Weight | Rationale |
|---|---|---|
| Revenue performance | 25% | Core business health indicator — bookings and revenue drive everything |
| Conversion efficiency | 20% | Shows whether the product is commercially effective in the market |
| Customer satisfaction | 20% | Proxy for product-market fit and long-term retention |
| Competitive position | 15% | External benchmark — healthy products must be competitively viable |
| Amendment health | 10% | Vital sign for product-market fit; high amendments = hidden misfit |
| Strategic fit | 10% | Alignment with company priorities and portfolio direction |
| **Total** | **100%** | |

### Calculation Formula

```
Composite Score (0-100) = (
  (Revenue Score × 0.25) +
  (Conversion Score × 0.20) +
  (Customer Score × 0.20) +
  (Competitive Score × 0.15) +
  (Amendment Score × 0.10) +
  (Strategic Score × 0.10)
) × 10
```

### Handling Missing Data

If data is unavailable for a dimension, **redistribute that weight proportionally** across the remaining scored dimensions. Document this clearly in the Attention Flags section.

Example: If conversion data is unavailable (20% weight), redistribute:
- Revenue: 25% → ~31%
- Customer: 20% → ~25%
- Competitive: 15% → ~19%
- Amendment: 10% → ~13%
- Strategic: 10% → ~13%

Always note in the confidence rating when weight redistribution occurred.

---

## Per-Dimension Scoring Criteria

### Revenue Performance (weight: 25%)

| Score | Criteria |
|---|---|
| 9–10 | Bookings and revenue significantly above portfolio average; strong YoY growth (>15%) |
| 7–8 | At or above portfolio average; positive YoY growth (5–15%) |
| 5–6 | Near portfolio average; flat or slightly negative growth (−5% to +5%) |
| 3–4 | Below portfolio average; declining revenue (−5% to −15%) YoY |
| 1–2 | Significantly below average; accelerating decline (>−15% YoY) or near-zero bookings |

---

### Conversion Efficiency (weight: 20%)

| Score | Criteria |
|---|---|
| 9–10 | Conversion rate significantly above portfolio average; inquiry-to-booking funnel is efficient |
| 7–8 | At or above portfolio average; funnel performing well |
| 5–6 | Below portfolio average; some funnel leakage but not critical |
| 3–4 | Notably below average; significant funnel drop-off at one or more stages |
| 1–2 | Very low conversion; product is generating interest but not closing |

> If conversion data is unavailable, note the gap and redistribute weight. Do not assign a score.

---

### Customer Satisfaction (weight: 20%)

| Score | Criteria |
|---|---|
| 9–10 | High review ratings (4.5+/5), low cancellation rate (<5%), meaningful repeat booking rate |
| 7–8 | Good ratings (4.0–4.4/5), normal cancellation rate (5–10%), some repeat bookings |
| 5–6 | Average ratings (3.5–3.9/5), moderate cancellation (10–15%), limited repeats |
| 3–4 | Below average ratings (<3.5/5), elevated cancellations (15–25%), few/no repeats |
| 1–2 | Poor ratings, high cancellations (>25%), customer complaint pattern present |

---

### Competitive Position (weight: 15%)

| Score | Criteria |
|---|---|
| 9–10 | Clear competitive advantage in pricing, inclusions, and quality; outperforms competitors on reviews |
| 7–8 | Competitive on most dimensions; no significant weaknesses vs. market |
| 5–6 | Comparable to market; no strong differentiators but no critical gaps |
| 3–4 | Underperforming vs. competitors on multiple dimensions; losing market share |
| 1–2 | Significantly uncompetitive; overpriced for value, below-market inclusions, poor visibility |

---

### Amendment Health (weight: 10%)

| Score | Criteria |
|---|---|
| 9–10 | Amendment rate <5%; customers accept the product as designed |
| 7–8 | Amendment rate 5–10%; minor adjustments, no systematic misfit signal |
| 5–6 | Amendment rate 10–20%; moderate misfit; top amendments reveal addressable gaps |
| 3–4 | Amendment rate 20–30%; significant misfit; customers are consistently rebuilding the product |
| 1–2 | Amendment rate >30%; severe misfit; product as sold does not match what customers actually want |

---

### Strategic Fit (weight: 10%)

| Score | Criteria |
|---|---|
| 9–10 | Directly aligned with top strategic priorities; product is explicitly featured in growth plans |
| 7–8 | Supports strategic direction; fits within priority destinations, segments, or price tiers |
| 5–6 | Neutral alignment; product exists in the portfolio but is not a strategic focus |
| 3–4 | Misaligned with current strategy; diverts resources from strategic priorities |
| 1–2 | Directly conflicts with strategic direction; market or segment being exited |

---

## Health Classification Scale

### 🟢 STRONG (80–100)

Product is healthy and performing well.

**Characteristics**: Above-average revenue, good conversion, satisfied customers, competitive positioning, low amendment rate.

**Recommended actions**:
- Continue monitoring with regular health checks
- Look for growth opportunities: new source markets, adjacent segments, pricing optimization
- Consider using this product as a model for new product development
- No intervention required

---

### 🔵 STABLE (60–79)

Product is adequate but has improvement opportunities.

**Characteristics**: Near-average performance across most dimensions; no critical issues but not maximizing potential.

**Recommended actions**:
- Identify the 1–2 lowest-scoring dimensions as highest-leverage improvement areas
- Proactive optimization recommended — light-touch Product Optimization initiative
- Focus on moving the lowest scores first; small gains in weak dimensions yield the highest composite improvement
- Re-assess within 3–6 months to confirm trajectory

---

### 🟡 CONCERNING (40–59)

Product needs attention. Specific issues should be addressed.

**Characteristics**: Below-average performance in multiple dimensions; declining trend; flags present that require action.

**Recommended actions**:
- Launch a Product Optimization initiative
- Define the primary diagnosis and focus area before starting the initiative
- Identify whether the issue is product design, pricing, distribution, or customer satisfaction
- Escalate to team review; don't wait for the next routine check cycle
- Re-assess within 1–3 months of intervention

---

### 🔴 CRITICAL (20–39)

Product is significantly underperforming. Requires immediate assessment.

**Characteristics**: Significantly below-average performance; multiple critical flags; possible declining lifecycle; competitive position weakening.

**Recommended actions**:
- Immediate Optimization or Repositioning initiative required
- Conduct a root cause analysis before prescribing a solution
- Determine whether the product has a fixable problem (optimization) or a fundamental misfit (repositioning)
- Flag for leadership attention
- Set a 30–60 day intervention deadline

---

### ⚫ TERMINAL (0–19)

Product is failing. Consider Retirement or fundamental Redesign.

**Characteristics**: Severe underperformance across most dimensions; persistent decline; optimization unlikely to recover value; possible strategic misalignment.

**Recommended actions**:
- Initiate a formal Retirement Assessment
- Document evidence for why optimization or repositioning would not yield sufficient returns
- Consider whether any elements of this product can be salvaged for a new product design
- If redesign is considered, treat as a New Product Development initiative, not an optimization
- Protect the broader portfolio from resource drain

---

## Status Emoji Key

Use these consistently in all health check tables:

| Symbol | Label | Meaning |
|---|---|---|
| 🟢 | HEALTHY | At or above portfolio average, positive or stable trend |
| 🔵 | STABLE | Near average, no critical issues |
| 🟡 | WATCH | Below portfolio average or declining trend |
| 🔴 | ATTENTION | Significantly below average or accelerating decline |
| ⚫ | CRITICAL | Severe underperformance or failure state |

---

## Trend Indicators

Use these in the Composite Score table trend column:

| Symbol | Meaning |
|---|---|
| ↑ | Improving vs. previous health check |
| ↓ | Declining vs. previous health check |
| → | Stable vs. previous health check |
| ↑↑ | Significantly improving (>1 full classification tier gain) |
| ↓↓ | Significantly declining (>1 full classification tier drop) |
| — | No previous data / first health check |

---

## Classification Change Signals

When comparing to a previous health check, classify the trajectory:

| Change | Signal Type | Action |
|---|---|---|
| Improved by ≥ 20 points | Significant improvement | Note recovery driver; review if intervention worked |
| Improved by 5–19 points | Gradual improvement | Continue current course; flag what's driving it |
| Changed by < 5 points | Stable | No material change |
| Declined by 5–19 points | Gradual decline | Increase monitoring frequency; consider intervention |
| Declined by ≥ 20 points | Significant deterioration | Escalate immediately; initiate intervention |
| Classification tier dropped | Critical signal | Immediately escalate to team review |
