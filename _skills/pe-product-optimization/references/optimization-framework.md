# Optimization Framework

Templates and scoring frameworks for Phase 3 (DECIDE): impact-effort matrix, recommendation scoring, monitoring dashboard spec, 30/60/90-day target setting, and strategy option comparison.

---

## Impact-Effort Scoring Methodology

Before placing recommendations in the matrix, score each on two dimensions:

### Impact Score (1–5)

| Score | Revenue/Volume Impact      | Conversion Impact        | Customer Experience Impact |
|-------|---------------------------|--------------------------|---------------------------|
| 5     | >20% improvement expected  | >5pp conversion uplift   | Structural improvement     |
| 4     | 10–20% improvement         | 2–5pp conversion uplift  | Significant improvement    |
| 3     | 5–10% improvement          | 1–2pp conversion uplift  | Moderate improvement       |
| 2     | 1–5% improvement           | <1pp conversion uplift   | Minor improvement          |
| 1     | <1% improvement            | Negligible               | Cosmetic only              |

**Basis for estimates**: tie each score to a specific finding from Phase 2 (e.g., "funnel drop-off at inquiry stage = 14pp gap vs portfolio → fixing inquiry-to-booking CTA could recover ~40% of gap").

### Effort Score (1–5)

| Score | Effort Level | Typical Effort Indicators                                   |
|-------|--------------|-------------------------------------------------------------|
| 1     | Very Low     | <1 day, no dependencies, single person, no tech change      |
| 2     | Low          | 1–3 days, minor content or config change                    |
| 3     | Medium       | 1–2 weeks, cross-team coordination, minor system change     |
| 4     | High         | 2–6 weeks, significant content rebuild or tech work         |
| 5     | Very High    | >6 weeks, major structural change, multiple teams, budget   |

---

## Implementation Priority Matrix (2×2 Quadrant)

Plot each recommendation by Impact Score (high = top) and Effort Score (low = left):

```
HIGH IMPACT
    │
    │  ┌─────────────────────────┬─────────────────────────┐
    │  │                         │                         │
    │  │    QUICK WINS           │    MAJOR PROJECTS       │
    │  │                         │                         │
    │  │  High Impact            │  High Impact            │
    │  │  Low Effort             │  High Effort            │
    │  │                         │                         │
    │  │  → DO FIRST             │  → PLAN CAREFULLY       │
    │  │                         │                         │
    │  ├─────────────────────────┼─────────────────────────┤
    │  │                         │                         │
    │  │    FILL-INS             │    TIME SINKS           │
    │  │                         │                         │
    │  │  Low Impact             │  Low Impact             │
    │  │  Low Effort             │  High Effort            │
    │  │                         │                         │
    │  │  → BATCH WHEN           │  → AVOID /              │
    │  │    CONVENIENT           │    DEPRIORITIZE         │
    │  │                         │                         │
    │  └─────────────────────────┴─────────────────────────┘
    │
LOW IMPACT
              LOW EFFORT ────────────────── HIGH EFFORT
```

### Quadrant Definitions

| Quadrant       | Impact | Effort | Action                             |
|----------------|--------|--------|------------------------------------|
| Quick Wins     | High   | Low    | Implement immediately (Week 1–2)   |
| Major Projects | High   | High   | Plan, resource, and sequence carefully |
| Fill-ins       | Low    | Low    | Batch into next sprint             |
| Time Sinks     | Low    | High   | Avoid; deprioritize or eliminate   |

---

## Optimization Recommendation Scoring Table

Use this template to build the full recommendation table in Phase 3-A:

```
### Optimization Recommendations — [PRODUCT NAME]

| #  | Recommendation                          | Root Cause Addressed    | Impact Score | Effort Score | Quadrant      | Expected Outcome (Quantified)              | Owner        | Timeline    | Dependencies               |
|----|-----------------------------------------|-------------------------|:------------:|:------------:|---------------|--------------------------------------------|--------------|-------------|----------------------------|
| 1  | [e.g. Revise pricing — reduce by 8–12%] | Pricing Issue           | 4            | 2            | Quick Win     | +15–25% inquiry→booking conv. (est.)       | Revenue Mgmt | Week 1–2    | Yield approval             |
| 2  | [e.g. Rewrite itinerary detail page]    | Content/Messaging Issue | 3            | 2            | Quick Win     | +8% detail view→inquiry rate (est.)        | Content Team | Week 1–3    | None                       |
| 3  | [e.g. Add premium accommodation option] | Amendment: Upgrades     | 4            | 4            | Major Project | +$200/pax avg revenue uplift (est.)        | Product Team | Month 1–2   | Supplier contract          |
| 4  | [e.g. Optimize UK-market channel mix]   | Channel Issue           | 3            | 3            | Quick Win     | +20% UK bookings (est.)                    | Sales/Channel| Month 1     | Channel partner access     |
| 5  | [e.g. Add activity selection module]    | Amendment: Additions    | 3            | 5            | Major Project | Capture $150/pax hidden demand (est.)      | Tech Team    | Month 2–3   | Tech build, pricing model  |

Impact estimates are directional. Tie each estimate to a specific data point from Phase 2.
```

---

## Strategy Option Comparison Format

Present 2–3 distinct strategic approaches in Phase 3-B:

```
### Strategy Options — [PRODUCT NAME]

---

#### Option A: Quick Fix (Conservative)

**Focus**: Address top 2–3 Quick Wins only. Minimal investment, fast results.

| Dimension           | Detail                                                   |
|---------------------|----------------------------------------------------------|
| Key Actions         | [Rec #1, #2, #4 from table above]                       |
| Timeline            | 6 weeks to full implementation                           |
| Resource Requirement| Low — content team + revenue management, no tech build   |
| Projected Impact    | +10–18% bookings within 90 days (conservative)          |
| Investment Est.     | [USD / AED range or FTE weeks]                           |
| Primary Risk        | Doesn't address structural issues; incremental only      |
| Best for            | When budget is constrained or speed is the priority      |

---

#### Option B: Balanced Optimization (Recommended)

**Focus**: Quick Wins + 1 Major Project. Addresses root causes with manageable investment.

| Dimension           | Detail                                                   |
|---------------------|----------------------------------------------------------|
| Key Actions         | [Rec #1, #2, #3, #4 from table above]                   |
| Timeline            | 10–12 weeks to full implementation                       |
| Resource Requirement| Medium — cross-team, one sprint of tech work             |
| Projected Impact    | +20–35% bookings + $150/pax revenue uplift within 90 days|
| Investment Est.     | [USD / AED range or FTE weeks]                           |
| Primary Risk        | Supplier negotiation timeline may slip Major Project     |
| Best for            | When product is fundamentally sound but underoptimized   |

---

#### Option C: Transformation (Ambitious)

**Focus**: All recommendations including full structural overhaul.

| Dimension           | Detail                                                   |
|---------------------|----------------------------------------------------------|
| Key Actions         | [All recs including Rec #5]                              |
| Timeline            | 16–20 weeks to full implementation                       |
| Resource Requirement| High — dedicated project manager, tech sprint, multiple teams |
| Projected Impact    | +40–55% bookings + $250/pax revenue uplift within 180 days |
| Investment Est.     | [USD / AED range or FTE weeks]                           |
| Primary Risk        | Execution complexity; risk of over-engineering           |
| Best for            | When product has strong bones and significant upside     |

---

Recommendation: Option [A/B/C] — [1-sentence rationale tied to Phase 2 findings]
```

---

## Monitoring Dashboard Spec Template

Produce this as Deliverable 5 in Phase 4. One row per metric.

```
### Monitoring Dashboard Spec — [PRODUCT NAME]
Initiative: optimization-[product] | Started: [YYYY-MM-DD] | Next Review: [YYYY-MM-DD]

| # | Metric                     | Definition                                     | Data Source            | Current Baseline | 30-Day Target | 60-Day Target | 90-Day Target | Alert Threshold               | Review Cadence |
|---|----------------------------|------------------------------------------------|------------------------|------------------|---------------|---------------|---------------|-------------------------------|----------------|
| 1 | Monthly Booking Volume     | Count of confirmed bookings per calendar month | Bookings DB            | [N] bookings     | [+X%]         | [+X%]         | [+X%]         | <[N] bookings = escalate      | Weekly         |
| 2 | Overall Conversion Rate    | Bookings ÷ Page Views × 100                    | Analytics + Bookings DB| [X.XX%]          | [X.XX%]       | [X.XX%]       | [X.XX%]       | <[X.XX%] for 2 weeks = review | Weekly         |
| 3 | Inquiry→Booking Rate       | Bookings ÷ Inquiries × 100                     | CRM + Bookings DB      | [XX%]            | [XX%]         | [XX%]         | [XX%]         | <[XX%] = review               | Weekly         |
| 4 | Average Booking Value      | Total Revenue ÷ Booking Count                  | Bookings DB            | [$/pax]          | [+X%]         | [+X%]         | [+X%]         | <[$/pax] = price review       | Monthly        |
| 5 | Amendment Rate             | Amendments ÷ Bookings × 100                    | Amendments DB          | [X.X%]           | [X.X%]        | [X.X%]        | [X.X%]        | >[X.X%] spike = investigate   | Monthly        |
| 6 | Hidden Demand Score        | (Upgrades + Additions + Extensions) ÷ Bookings | Amendments DB          | [X.X%]           | [X.X%]        | [X.X%]        | [X.X%]        | N/A (monitoring only)         | Monthly        |
| 7 | Cancellation Rate          | Cancellations ÷ Bookings × 100                 | Bookings DB            | [X.X%]           | ≤[X.X%]       | ≤[X.X%]       | ≤[X.X%]       | >[X.X%] = investigate         | Weekly         |
| 8 | Portfolio Rank (Tier)      | Rank by booking volume within destination/tier | Bookings DB            | [N of M]         | [target rank] | [target rank] | [target rank] | Falls >2 ranks = review       | Monthly        |

#### Target-Setting Rationale

Targets are set relative to current baseline, not absolute ideals:
- 30-day targets: focus on leading indicators (inquiry rate, conversion quality) — changes from Quick Wins
- 60-day targets: early outcome metrics (booking volume up, amendment rate stabilizing)
- 90-day targets: full outcome metrics (revenue per booking, portfolio rank)

Baseline source: Phase 2A data (queried [YYYY-MM-DD])

#### Alert and Escalation Protocol

| Alert Level | Trigger                                     | Response                                          |
|-------------|---------------------------------------------|---------------------------------------------------|
| 🟡 WATCH    | Any metric 10–20% below target for 1 week   | Flag in weekly review; monitor for trend           |
| 🔴 ESCALATE | Any metric >20% below target for 2+ weeks   | Escalate to initiative owner; review root cause    |
| 🔴 ESCALATE | Cancellation rate spikes >50% above baseline| Immediate product review; check for external cause |
| ⚪ NOTE     | Hidden Demand Score increases significantly  | Flag as upsell opportunity; consider Phase 3C add  |

Re-run Trigger: At 60 days, if ≥3 metrics below 60-day targets, re-run this skill from Phase 2A.
```

---

## 30/60/90-Day Target Setting Framework

Use this logic to set each target row in the Monitoring Dashboard Spec:

### Step 1: Anchor to Baseline
Always state the current baseline as a specific number, not a range.
Example: "Current monthly bookings: 14 (3-month average)"

### Step 2: Apply Change Logic by Recommendation Type

| Recommendation Type     | 30-Day Expectation          | 60-Day Expectation          | 90-Day Expectation          |
|-------------------------|-----------------------------|-----------------------------|-----------------------------|
| Pricing change          | Inquiry rate improves        | Booking conversion improves | Volume uplift materializes  |
| Content/messaging change| Detail view rate improves    | Inquiry rate improves       | Conversion improves         |
| Structural change       | Inquiry quality improves     | Booking rate improves       | Revenue/pax improves        |
| Channel optimization    | Channel-specific conv. up    | Volume from channel up      | Portfolio rank improves     |
| New product element     | No change (build/launch)     | Early adoption signals      | Revenue uplift measurable   |

### Step 3: Apply Conservatism Discount
Never project the full theoretical impact. Apply a 40% discount to all estimates (i.e., if theory says +25%, target +15% at 90 days). Disclose the discount in the rationale.

### Step 4: State What Would Invalidate the Target
For each 90-day target, state: "If [external condition], this target should be revised — specifically [what to revise]."
Example: "If GCC market travel advisories change in this period, monthly booking targets should be revised downward by 30%."

---

## Decision Record Template

Artifact stored at `artifacts/decision-records/optimization-[product]-[YYYY-MM-DD].md`

```markdown
---
type: decision-record
initiative_type: product-optimization
subject: [product name]
decision: OPTIMIZE | REPOSITION | RETIRE | HOLD
created: YYYY-MM-DD
confidence: HIGH | MEDIUM | LOW
status: active | revisit-triggered | superseded
revisit_triggers:
  - [condition 1, e.g. "Booking volume falls below N for 2 consecutive months"]
  - [condition 2, e.g. "New competitor enters destination at lower price point"]
  - [condition 3, e.g. "90-day targets not met — re-run optimization skill"]
tags: [product-name, destination, optimization, YYYY]
---

# Decision Record: [Product Name] Optimization — [YYYY-MM-DD]

## Decision
**Outcome**: [OPTIMIZE / REPOSITION / RETIRE / HOLD]
**Decision made by**: [user/stakeholder]
**Confidence**: [HIGH / MEDIUM / LOW]

## Summary of Findings
[3–5 bullet summary of key diagnostic findings that drove the decision]

## Rationale
[2–3 paragraph explanation: what the data showed, what the root cause was, why this outcome
was chosen over the alternatives]

## Strategy Selected (if OPTIMIZE)
**Option chosen**: [A / B / C]
**Key recommendations**: [list top 3–4]
**Expected outcomes**: [primary metrics and 90-day targets]

## Routing (if not OPTIMIZE)
- If REPOSITION: "[Product] audience mismatch confirmed. Recommend running pe-repositioning."
- If RETIRE: "[Product] has no viable performance path. Recommend retiring by [date]."
- If HOLD: "Re-evaluate after [trigger/date]. Next check-in: [YYYY-MM-DD]."

## Artifacts Produced
- [ ] Product Diagnostic Report: `artifacts/health-checks/[product]-[date].md`
- [ ] Optimization Recommendations: included in diagnostic report
- [ ] Competitive Position Analysis: `artifacts/competitors/[name]-[context].md`
- [ ] Implementation Priority Matrix: included in diagnostic report
- [ ] Monitoring Dashboard Spec: included in diagnostic report
- [ ] This Decision Record: `artifacts/decision-records/optimization-[product]-[date].md`

## Revisit Protocol
This decision should be revisited if any revisit trigger above is met, or at the scheduled
60–90 day post-implementation check (target date: [YYYY-MM-DD]).
```

---

## Product Diagnostic Report Structure

Artifact stored at `artifacts/health-checks/[product]-[YYYY-MM-DD].md`

```markdown
---
type: health-check
created: YYYY-MM-DD
updated: YYYY-MM-DD
confidence: HIGH | MEDIUM | LOW
status: active
initiative: optimization-[product]
tags: [product-name, destination, health-check, YYYY]
---

# Product Diagnostic Report: [Product Name]
Date: [YYYY-MM-DD] | Initiative: optimization-[product]

## 1. Executive Summary
[3–5 sentences: product name, trigger, primary findings, decision outcome, next steps]

## 2. Performance Analysis
[Booking performance table from 2A-1, portfolio comparison, RAG status]
[Conversion funnel from 2A-2 with drop-off analysis]

## 3. Amendment Signal Analysis
[Amendment table from 2A-3, hidden demand calculation, market/segment patterns]

## 4. Customer Profile Analysis
[Buyer profile table from 2A-4, audience match assessment, cross-purchase patterns]

## 5. Competitive Position
[Competitive matrix from 2B, gaps, advantages]
[Or: reference to standalone competitor artifact if used]

## 6. Root Cause Summary
[Root cause table from 2C, primary cause, contributing factors, confidence levels]

---
*Re-run: This report should be refreshed 60–90 days post-implementation. Use pe-product-optimization and reference this document as the baseline.*
```
