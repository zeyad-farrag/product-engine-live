# Repositioning Templates — pe-repositioning

All templates used in Phases 2 and 3. References for Track A/B discovery queries, persona format, messaging framework, implementation brief, and risk assessment.

---

## Template 1: Track A MySQL Queries (Phase 2A-1 — Product Current State)

### Query A1: Booking Volume Trend (12–24 months)

```sql
-- Intent: Understand booking volume trend for this destination over the past 12–24 months
SELECT
  DATE_FORMAT(of.created, '%Y-%m') AS month,
  COUNT(DISTINCT of.id) AS bookings_count,
  SUM(aso.selling_rate) AS revenue,
  AVG(aso.selling_rate) AS avg_booking_value
FROM operation_files of
JOIN requests r ON of.request_id = r.id
LEFT JOIN acc_srv_orders_operation_files asof ON asof.operation_file_id = of.id
LEFT JOIN acc_srv_orders aso ON asof.acc_srv_order_id = aso.id AND aso.cancelled = 0
WHERE r.destination_id = [DESTINATION_ID]
  AND of.created >= DATE_SUB(NOW(), INTERVAL 24 MONTH)
  AND of.operation_file_status_id NOT IN (5)
GROUP BY month
ORDER BY month ASC;
```

### Query A2: Source Market Breakdown

```sql
-- Intent: Identify which source markets bookings come from
SELECT
  co.name AS source_market,
  COUNT(DISTINCT of.id) AS bookings_count,
  ROUND(SUM(aso.selling_rate) / SUM(SUM(aso.selling_rate)) OVER () * 100, 1) AS revenue_share_pct
FROM operation_files of
JOIN requests r ON of.request_id = r.id
LEFT JOIN clients cl ON r.company_id = cl.id
LEFT JOIN countries co ON cl.country_id = co.id
LEFT JOIN acc_srv_orders_operation_files asof ON asof.operation_file_id = of.id
LEFT JOIN acc_srv_orders aso ON asof.acc_srv_order_id = aso.id AND aso.cancelled = 0
WHERE r.destination_id = [DESTINATION_ID]
  AND of.created >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
  AND of.operation_file_status_id NOT IN (5)
GROUP BY co.name
ORDER BY bookings_count DESC;
```

### Query A3: Customer Segment Breakdown

```sql
-- Intent: Understand group composition of current buyers
SELECT
  CASE
    WHEN r.num_of_adults = 1 AND r.num_of_children = 0 THEN 'Solo'
    WHEN r.num_of_adults = 2 AND r.num_of_children = 0 THEN 'Couple'
    WHEN r.num_of_children > 0 THEN 'Family'
    WHEN r.num_of_adults >= 3 THEN 'Group'
    ELSE 'Other'
  END AS traveler_type,
  r.num_of_adults + r.num_of_children AS group_size,
  COUNT(DISTINCT of.id) AS bookings_count
FROM operation_files of
JOIN requests r ON of.request_id = r.id
WHERE r.destination_id = [DESTINATION_ID]
  AND of.created >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
  AND of.operation_file_status_id NOT IN (5)
GROUP BY traveler_type, group_size
ORDER BY bookings_count DESC;
```

### Query A4: Conversion Metrics

```sql
-- Intent: Measure funnel conversion from request to booking
-- Note: product_views not available in database. Using requests → operation_files funnel.
SELECT 'Requests' AS stage, COUNT(*) AS count
FROM requests WHERE destination_id = [DESTINATION_ID] AND created >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
UNION ALL
SELECT 'Operation Files', COUNT(*)
FROM operation_files of JOIN requests r ON of.request_id = r.id
WHERE r.destination_id = [DESTINATION_ID] AND of.created >= DATE_SUB(NOW(), INTERVAL 12 MONTH) AND of.operation_file_status_id NOT IN (5)
UNION ALL
SELECT 'Completed', COUNT(*)
FROM operation_files of JOIN requests r ON of.request_id = r.id
WHERE r.destination_id = [DESTINATION_ID] AND of.operation_file_status_id = 3;
```

### Query A5: Amendment and Cancellation Patterns

```sql
-- Intent: Identify cancellation and postponement patterns suggesting product-fit friction
-- Note: No separate amendments table. Using operation_file_status_id for status tracking.
SELECT
  CASE of.operation_file_status_id
    WHEN 1 THEN 'Active'
    WHEN 2 THEN 'Running'
    WHEN 3 THEN 'Completed'
    WHEN 4 THEN 'Postponed'
    WHEN 5 THEN 'Cancelled'
  END AS status_label,
  COUNT(*) AS frequency
FROM operation_files of
JOIN requests r ON of.request_id = r.id
WHERE r.destination_id = [DESTINATION_ID]
  AND of.created >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
GROUP BY of.operation_file_status_id
ORDER BY frequency DESC;
```

### Query A6: Seasonal Patterns

```sql
-- Intent: Identify peak booking and travel months
SELECT
  MONTH(of.created) AS month_num,
  MONTHNAME(of.created) AS month_name,
  COUNT(DISTINCT of.id) AS bookings_count,
  SUM(CASE WHEN r.arrival_date IS NOT NULL AND r.arrival_date <= CURDATE() THEN 1 ELSE 0 END) AS departures_count
FROM operation_files of
JOIN requests r ON of.request_id = r.id
WHERE r.destination_id = [DESTINATION_ID]
  AND of.created >= DATE_SUB(NOW(), INTERVAL 24 MONTH)
  AND of.operation_file_status_id NOT IN (5)
GROUP BY month_num, month_name
ORDER BY month_num;
```

---

## Template 2: Track B MySQL Queries (Phase 2B-3 — Internal Demand Signals for New Audience)

### Query B1: Existing Bookings from New Audience

```sql
-- Intent: Check if any bookings already come from the new audience geography
SELECT
  co.name AS source_market,
  COUNT(DISTINCT of.id) AS bookings_count,
  SUM(aso.selling_rate) AS revenue,
  MIN(of.created) AS first_booking_date,
  MAX(of.created) AS last_booking_date
FROM operation_files of
JOIN requests r ON of.request_id = r.id
LEFT JOIN clients cl ON r.company_id = cl.id
LEFT JOIN countries co ON cl.country_id = co.id
LEFT JOIN acc_srv_orders_operation_files asof ON asof.operation_file_id = of.id
LEFT JOIN acc_srv_orders aso ON asof.acc_srv_order_id = aso.id AND aso.cancelled = 0
WHERE r.destination_id = [DESTINATION_ID]
  AND co.name = '[NEW_AUDIENCE_COUNTRY]'
  AND of.operation_file_status_id NOT IN (5)
GROUP BY co.name;
```

### Query B2: Traffic and Inquiry Patterns from New Audience

```sql
-- Intent: Measure requests and enquiries from new audience source market
-- Note: product_views / session data not in database. Using requests + enquiries.
SELECT
  DATE_FORMAT(r.created, '%Y-%m') AS month,
  COUNT(DISTINCT r.id) AS requests,
  COUNT(DISTINCT e.id) AS enquiries
FROM requests r
LEFT JOIN enquiries e ON e.request_id = r.id
JOIN clients cl ON r.company_id = cl.id
JOIN countries co ON cl.country_id = co.id
WHERE r.destination_id = [DESTINATION_ID]
  AND co.name = '[NEW_AUDIENCE_COUNTRY]'
  AND r.created >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
GROUP BY month
ORDER BY month;
```

### Query B3: Similar Products with New Audience Crossover

```sql
-- Intent: Find similar destinations that the new audience is already booking — signals latent demand
SELECT
  d.name AS destination,
  COUNT(DISTINCT of.id) AS bookings_from_new_audience
FROM operation_files of
JOIN requests r ON of.request_id = r.id
JOIN destinations d ON r.destination_id = d.id
JOIN clients cl ON r.company_id = cl.id
JOIN countries co ON cl.country_id = co.id
WHERE co.name = '[NEW_AUDIENCE_COUNTRY]'
  AND r.destination_id != [DESTINATION_ID]
  AND of.operation_file_status_id NOT IN (5)
  AND of.created >= DATE_SUB(NOW(), INTERVAL 24 MONTH)
GROUP BY d.name
ORDER BY bookings_from_new_audience DESC
LIMIT 10;
```

---

## Template 3: Buyer Persona (Phase 2B-2)

File stored at: `artifacts/personas/[name].md`

```markdown
---
type: persona
name: [Persona Name — descriptive, e.g., "The Gulf Millennial Explorer"]
audience: [New audience market/segment]
product_context: [Product this persona is being evaluated for]
created: YYYY-MM-DD
updated: YYYY-MM-DD
confidence: HIGH | MEDIUM | LOW
status: active
initiative: repositioning-[product]-[audience]
tags: [audience, market, segment, persona]
---

# [Persona Name]

## Snapshot
- **Age Range**: [e.g., 28–38]
- **Location**: [City/Region, Country]
- **Occupation**: [Type]
- **Household Income**: [Range or descriptor]
- **Travel Budget**: [Per-person trip budget range]
- **Travel Frequency**: [Trips per year]
- **Booking Channel**: [OTA / Direct / Travel Agent / Social / Other]
- **Lead Time**: [How far in advance they book]

## Motivations
[What drives this persona to travel — experiences, status, family, discovery, etc.]

## Decision Triggers
[What causes them to choose a specific product — price event, recommendation, content, FOMO, etc.]

## Objections / Hesitations
[What would cause them NOT to book — perceived risks, trust gaps, cultural concerns, etc.]

## Information Sources
[Where they research and discover travel products]

## Non-Negotiables
[Things this persona requires — deal-breakers if absent]

## Delighters
[Things that exceed expectations and generate loyalty/advocacy]

## Fit Assessment for [Product]
| Dimension | Fit Level | Notes |
|---|---|---|
| Price | HIGH/MEDIUM/LOW | |
| Duration | | |
| Destination | | |
| Activities | | |
| Accommodation | | |
| Cultural resonance | | |

## Confidence Note
[What data underlies this persona — internal bookings, market research, competitor analysis, or inference]
```

---

## Template 4: Competitor Profile (Phase 2B-1)

File stored at: `artifacts/competitors/[name]-[audience-market].md`

```markdown
---
type: competitor
name: [Competitor Name]
audience_market: [New audience market this analysis is for]
product_context: [Product category being compared]
created: YYYY-MM-DD
updated: YYYY-MM-DD
confidence: HIGH | MEDIUM | LOW
status: active
initiative: repositioning-[product]-[audience]
tags: [competitor, market, audience]
---

# [Competitor Name] — [Audience Market] Benchmark

## Company Overview
[Brief description: HQ, size, market position]

## Product Offering for [New Audience]
[What they offer specifically for the new audience segment]

## Pricing
| Tier | Price (per person) | Inclusions |
|---|---|---|
| Entry | | |
| Standard | | |
| Premium | | |

## Distribution Channels
[How they reach the new audience — OTA listing, direct website, agents, social, etc.]

## Messaging / Positioning
[How they talk to the new audience — key claims, tone, imagery themes]

## Strengths (vs. our product)
[What they do better]

## Weaknesses (vs. our product)
[Where we have an advantage or they underperform]

## Market Share Estimate
[If available — or label as [INFERRED]]

## Key Insight
[One-sentence takeaway for the repositioning decision]
```

---

## Template 5: Messaging Framework (Phase 3.2)

```markdown
## Messaging Framework — [Product] for [New Audience]

### Core Positioning Statement
"[Product name] is the [category] for [new audience descriptor] who want [primary desire] without [primary friction]."

### Value Proposition (New Audience)
[2–3 sentences: what we offer, who it's for, why it's different]

### Proof Points
1. [Claim 1] — [Supporting evidence or fact]
2. [Claim 2] — [Supporting evidence or fact]
3. [Claim 3] — [Supporting evidence or fact]
4. [Claim 4 — optional]
5. [Claim 5 — optional]

### Objection Handling
| Anticipated Objection | Response |
|---|---|
| [Objection 1] | [Message that addresses it] |
| [Objection 2] | |
| [Objection 3] | |

### Tone Guidance
- **Current tone** (existing audience): [Descriptor]
- **New audience tone**: [Descriptor]
- **Shift required**: [What changes; what stays the same]

### Call to Action
- **Primary CTA**: [e.g., "Book your [product] experience today — [lead time hook]"]
- **Secondary CTA**: [e.g., "Download our [audience-language] guide"]

### Channel-Specific Adaptations
| Channel | Headline variant | Key message | CTA |
|---|---|---|---|
| Paid social | | | |
| Email | | | |
| Agent brief | | | |
| OTA listing | | | |
```

---

## Template 6: Implementation Brief (Phase 3.4 + Phase 4 Deliverable 5)

File stored as part of the Repositioning Assessment Document (deliverable 1) and as a standalone section.

```markdown
## Implementation Brief — [Product] Repositioned for [New Audience]

### Phase 1: Quick Wins (Weeks 1–4)
*Focus: Messaging and content changes. Zero or low cost. Immediate impact.*

| Change | Current State | Desired State | Rationale | Effort | Owner | Success Metric |
|---|---|---|---|---|---|---|
| [e.g., Update product description language] | [Current copy excerpt] | [New audience-optimised copy] | [Why this matters] | LOW | Marketing | [e.g., CTR from new audience traffic +X%] |
| | | | | | | |
| | | | | | | |

### Phase 2: Core Changes (Months 2–4)
*Focus: Structural adaptations — product, pricing, booking flow.*

| Change | Current State | Desired State | Rationale | Effort | Owner | Success Metric |
|---|---|---|---|---|---|---|
| [e.g., Add accommodation tier option] | [Single tier] | [Two-tier: standard + premium] | [New audience willingness to pay split] | MEDIUM | Product | [Bookings per tier] |
| | | | | | | |
| | | | | | | |

### Phase 3: Refinement (Months 5–6+)
*Focus: Data-driven optimisation post-launch. Respond to what the data shows.*

| Change | Trigger | Current State | Desired State | Effort | Owner | Success Metric |
|---|---|---|---|---|---|---|
| [e.g., Adjust pricing based on conversion data] | [Conversion rate < X%] | | | LOW | Product + Marketing | |
| | | | | | | |

### Implementation Owner Matrix
| Function | Phase 1 Responsibilities | Phase 2 Responsibilities | Phase 3 Responsibilities |
|---|---|---|---|
| Marketing | | | |
| Product | | | |
| Technology | | | |
| Operations | | | |
| Suppliers | | | |
```

---

## Template 7: Risk Assessment (Phase 3.7)

Includes the mandatory "Impact on existing audience" section.

```markdown
## Risk Assessment — [Product] Repositioning for [New Audience]

### Risk Register

| # | Risk | Probability | Impact | Severity | Mitigation |
|---|---|---|---|---|---|
| 1 | [Risk description] | HIGH/MEDIUM/LOW | HIGH/MEDIUM/LOW | [P × I] | [Mitigation action] |
| 2 | | | | | |
| 3 | | | | | |

### Impact on Existing Audience — MANDATORY SECTION

**"Protect the existing audience"**: Repositioning must not harm current buyers.

#### Messaging Risk
- Does the new positioning dilute brand clarity for current buyers? [YES / NO / PARTIAL]
- Could current buyers be confused by changes in tone or claims? [Assessment]
- Mitigation: [e.g., Run separate campaigns; maintain existing audience touchpoints unchanged]

#### Product Change Risk
- Do any structural changes in Phase 2 degrade the existing product for current buyers? [YES / NO / PARTIAL]
- Which specific changes carry existing audience risk?

| Change (from Phase 2) | Risk to Existing Audience | Severity | Mitigation |
|---|---|---|---|
| | | | |

#### Revenue Concentration Risk
- What % of current revenue is at risk if any changes alienate existing buyers?
- Estimated revenue at risk: [$ range or % of current product revenue]
- Breakeven: At what new audience volume does repositioning break even even if [X]% of existing audience is lost?

#### Recommendation on Existing Audience Protection
[Clear recommendation: what must NOT change for existing audience, what can be dual-positioned, what requires parallel products]

### Overall Risk Verdict
| Risk Category | Level | Primary Concern |
|---|---|---|
| Execution risk | HIGH/MEDIUM/LOW | |
| Market risk | | |
| Existing audience risk | | |
| Competitive response risk | | |
| Financial risk | | |

**Overall Risk Level**: HIGH / MEDIUM / LOW
**Recommendation**: [Proceed / Proceed with safeguards / Defer / Reject]
```

---

## Template 8: Decision Record (Phase 4 Deliverable 6)

File stored at: `artifacts/decision-records/repositioning-[product]-[audience]-[date].md`

```markdown
---
type: decision-record
initiative_type: repositioning
subject: "[Product] → [New Audience]"
decision: REPOSITION | PARTIAL REDESIGN | FULL REDESIGN | REJECT
created: YYYY-MM-DD
confidence: HIGH | MEDIUM | LOW
status: active
revisit_triggers:
  - [Condition that would warrant re-evaluation, e.g., "New audience bookings exceed 15% of product revenue"]
  - [e.g., "Competitor enters new audience segment with direct competing product"]
tags: [product-name, audience, market, repositioning]
---

# Decision Record — [Product] Repositioned for [New Audience]

## Decision
**[REPOSITION / PARTIAL REDESIGN / FULL REDESIGN / REJECT]**

## Rationale
[2–3 sentences: why this decision, what evidence drove it]

## Gap Analysis Summary
- CRITICAL gaps: [N] — [list]
- MODERATE gaps: [N] — [list]
- MINOR gaps: [N] — [list]

## Classification Basis
[Why this falls into the chosen classification tier, with reference to thresholds]

## Impact on Existing Audience
[Assessment: LOW / MEDIUM / HIGH risk. Key safeguards required.]

## Artifacts Produced
- [ ] Repositioning Assessment Document
- [ ] Audience Persona Cards ([N] personas)
- [ ] Competitor Benchmark
- [ ] Gap Analysis Matrix
- [ ] Implementation Brief
- [ ] This Decision Record

## Assumptions and Uncertainties
[Key assumptions that, if wrong, would change the decision]

## Revisit Triggers
[Specific conditions that should cause this decision to be re-evaluated]

## Decided By
[Name / role]

## Date
[YYYY-MM-DD]
```

---

## Template 9: Initiative State File

Stored at `initiatives/active/repositioning-[product]-[audience].md` when opened.
Moved to `initiatives/closed/` when completed.

```yaml
---
type: initiative
initiative_type: repositioning
subject: "[product] → [audience]"
phase: frame | discover | decide | confirm | closed
status: active | completed | rejected | monitoring | paused
started: YYYY-MM-DD
updated: YYYY-MM-DD
artifacts_produced:
  - artifacts/gap-analyses/[product]-vs-[audience]-[date].md
  - artifacts/personas/[persona-name].md
  - artifacts/competitors/[name]-[audience-market].md
  - artifacts/decision-records/repositioning-[product]-[audience]-[date].md
# Add when closing:
# closed: YYYY-MM-DD
# decision: REPOSITION | PARTIAL REDESIGN | FULL REDESIGN | REJECT
---
```
