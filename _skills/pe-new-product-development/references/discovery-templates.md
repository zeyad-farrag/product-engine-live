# Discovery Templates — pe-new-product-development

This file contains all detailed templates and MySQL queries for Phase 2 (DISCOVER).

---

## § Internal Signals — MySQL Queries

All queries use the production schema. Replace bracketed parameters (e.g., `[product_keyword]`, `[target_market]`) with actual values at runtime.

### Direct Demand Query
```sql
-- Intent: Find requests or enquiries matching this product type
SELECT
  DATE_FORMAT(r.created, '%Y-%m') AS month,
  d.name AS destination,
  s.source AS source_channel,
  COUNT(*) AS request_count,
  SUM(CASE WHEN of.id IS NOT NULL AND of.operation_file_status_id NOT IN (5) THEN 1 ELSE 0 END) AS bookings,
  ROUND(AVG(aso.selling_rate), 2) AS avg_price_point
FROM requests r
LEFT JOIN operation_files of ON of.request_id = r.id
LEFT JOIN acc_srv_orders_operation_files asof ON asof.operation_file_id = of.id
LEFT JOIN acc_srv_orders aso ON asof.acc_srv_order_id = aso.id AND aso.cancelled = 0
LEFT JOIN destinations d ON r.destination_id = d.id
LEFT JOIN sources s ON r.source_id = s.id
WHERE r.subject LIKE '%[product_keyword]%'
  AND r.created >= DATE_SUB(NOW(), INTERVAL 24 MONTH)
GROUP BY 1, 2, 3
ORDER BY month DESC;
```

### Adjacent Signals Query
```sql
-- Intent: What does the target audience currently book? Find adjacent demand patterns
SELECT
  co.name AS source_market,
  d.name AS destination,
  COUNT(DISTINCT of.id) AS booking_count,
  ROUND(AVG(aso.selling_rate), 2) AS avg_booking_value
FROM operation_files of
JOIN requests r ON of.request_id = r.id
JOIN clients cl ON r.company_id = cl.id
JOIN countries co ON cl.country_id = co.id
JOIN destinations d ON r.destination_id = d.id
LEFT JOIN acc_srv_orders_operation_files asof ON asof.operation_file_id = of.id
LEFT JOIN acc_srv_orders aso ON asof.acc_srv_order_id = aso.id AND aso.cancelled = 0
WHERE co.name = '[target_market]'
  AND of.created >= DATE_SUB(NOW(), INTERVAL 36 MONTH)
  AND of.operation_file_status_id NOT IN (5)
GROUP BY 1, 2
ORDER BY booking_count DESC
LIMIT 20;
```

### Amendment Signals Query
```sql
-- Intent: Find cancellation/postponement patterns that suggest latent demand
-- Note: No separate amendments/add-ons table. Using operation file statuses.
SELECT
  CASE of.operation_file_status_id
    WHEN 4 THEN 'Postponed'
    WHEN 5 THEN 'Cancelled'
  END AS status_type,
  d.name AS destination,
  COUNT(*) AS frequency
FROM operation_files of
JOIN requests r ON of.request_id = r.id
JOIN destinations d ON r.destination_id = d.id
WHERE of.operation_file_status_id IN (4, 5)
GROUP BY of.operation_file_status_id, d.name
ORDER BY frequency DESC;
```

### Negative Signals Query
```sql
-- Intent: Capture requests that weren't converted — expressed demand not fulfilled
SELECT
  DATE_FORMAT(r.created, '%Y-%m') AS month,
  d.name AS destination,
  co.name AS source_market,
  COUNT(*) AS request_count
FROM requests r
LEFT JOIN operation_files of ON of.request_id = r.id
LEFT JOIN destinations d ON r.destination_id = d.id
LEFT JOIN clients cl ON r.company_id = cl.id
LEFT JOIN countries co ON cl.country_id = co.id
WHERE of.id IS NULL
  AND r.subject LIKE '%[product_keyword]%'
  AND r.created >= DATE_SUB(NOW(), INTERVAL 24 MONTH)
GROUP BY 1, 2, 3
ORDER BY request_count DESC;
```

---

## § Persona Template

Use this template for each of the 2–4 personas in Stream 2B. One persona file per artifact stored.

```yaml
---
type: persona
name: [Persona Name]
created: YYYY-MM-DD
updated: YYYY-MM-DD
confidence: HIGH | MEDIUM | LOW
status: active
initiative: new-product-[product-name]
tags: [audience-segment, market, product-type]
---
```

### Persona Card: [Name]

**Tagline**: [One-sentence character summary]

| Field | Detail |
|---|---|
| Age range | |
| Location/origin | |
| Income bracket | |
| Travel frequency | |
| Decision-making style | (independent, advised, group-influenced) |
| Booking lead time | |
| Typical spend per trip | |
| Primary motivation | |
| Secondary motivation | |

**Travel Behaviour**
- Current bookings: [what they already book]
- Channels: [how they research and book]
- Influence sources: [who/what shapes their decisions]
- Price sensitivity: LOW / MEDIUM / HIGH
- Loyalty pattern: [one-time, repeat, brand-loyal]

**What They Want From This Product**
- Core need: [the functional need]
- Emotional need: [the feeling they're seeking]
- Social need: [how this product fits their identity/story]

**Deal-Breakers** ⚠️
> What would make them NOT book — even if the product looks good on paper?

- [Deal-breaker 1] — [reason]
- [Deal-breaker 2] — [reason]
- [Deal-breaker 3] — [reason]

**Competitive Alternatives** 🔀
> What would they book if this product didn't exist?

| Alternative | Why They'd Choose It | What It Lacks |
|---|---|---|
| [Competitor / product type] | [appeal] | [gap vs. our concept] |
| [DIY / self-planned] | [appeal] | [gap] |
| [Adjacent category] | [appeal] | [gap] |

**Design Fit Score**: HIGH / MEDIUM / LOW
**Design vs. Volume Note**: [Is this persona the largest segment or the best design target? Explain the distinction if relevant.]

---

## § Whitespace Analysis Methodology

### 2C-1: Current Offerings Landscape Map

Map all relevant competitors currently offering similar products. Check `artifacts/competitors/` for existing profiles before sourcing fresh data.

| Competitor | Product Name | Price Range | Core Positioning | Strengths | Weaknesses |
|---|---|---|---|---|---|
| [Name] | [Product] | [Price] | [Positioning] | [What they do well] | [Where they fall short] |

**Landscape Summary**: [2–3 sentences describing the overall competitive landscape — what's crowded, what's absent]

### 2C-2: Whitespace Identification Table

For each gap found, assess whether it's genuinely unserved or just underserved.

| Unserved / Underserved Need | Evidence | Addressable By Us | Competitive Risk | Priority |
|---|---|---|---|---|
| [Need] | [Evidence: data, quotes, signals] | YES / PARTIAL / NO | LOW / MEDIUM / HIGH | HIGH / MEDIUM / LOW |

**Whitespace Verdict**: [What is the clearest white space available? What's the primary differentiating opportunity?]

### 2C-3: Differentiation Opportunities

For each dimension, assess whether a meaningful differentiation opportunity exists:

| Dimension | Current Market State | Our Opportunity | Evidence | Strength |
|---|---|---|---|---|
| **Structural** | [How products are currently built/packaged] | [What we could do differently in design] | [evidence] | STRONG / MODERATE / WEAK |
| **Positioning** | [How competitors position themselves] | [Positioning territory we could own] | [evidence] | STRONG / MODERATE / WEAK |
| **Service** | [Typical service model in category] | [Service innovation we could introduce] | [evidence] | STRONG / MODERATE / WEAK |
| **Price** | [Price points and structures in market] | [Pricing strategy advantage] | [evidence] | STRONG / MODERATE / WEAK |
| **Channel** | [How products are distributed/marketed] | [Channel advantage we could exploit] | [evidence] | STRONG / MODERATE / WEAK |

**Primary Differentiation Opportunity**: [The strongest 1–2 dimensions with rationale]

---

## § Feasibility Assessment — 8-Dimension Template

Score each dimension: STRONG / ADEQUATE / CONSTRAINED / BLOCKING

```yaml
---
type: feasibility-assessment
product: [product name]
assessed_date: YYYY-MM-DD
overall_verdict: FEASIBLE | FEASIBLE WITH CONSTRAINTS | NOT FEASIBLE
initiative: new-product-[name]
---
```

| Dimension | Current State | Key Constraints | Score | Notes |
|---|---|---|---|---|
| **Destination supply** | [Availability of destination infrastructure] | [capacity limits, seasonality] | STRONG / ADEQUATE / CONSTRAINED / BLOCKING | |
| **Accommodation** | [Hotel/property options that fit concept] | [availability, min-stay, exclusivity] | | |
| **Activities** | [Experience providers available] | [exclusivity, capacity, quality] | | |
| **Transport/logistics** | [Getting guests there and around] | [flight routes, ground ops, cost] | | |
| **Pricing viability** | [Can we hit the target price and margin?] | [cost build-up vs. target price] | | |
| **Brand fit** | [Does this fit our brand positioning?] | [tier alignment, brand stretch risk] | | |
| **Team capacity** | [Do we have the people to build and run this?] | [bandwidth, expertise gaps] | | |
| **Timeline** | [Can we launch by target date?] | [lead time, dependencies] | | |
| **Cannibalization risk** | [Which existing products might this compete with?] | [revenue at risk, audience overlap] | | |

### Feasibility Narrative

**Blockers** (any BLOCKING score): [List — these must be resolved or the product cannot proceed]

**Key constraints** (CONSTRAINED scores): [List — these can be managed but need mitigation plans]

**Overall verdict**: FEASIBLE / FEASIBLE WITH CONSTRAINTS / NOT FEASIBLE

**Rationale**: [2–3 sentences explaining the verdict]

---

## § External Validation Checklist

Use this checklist when assessing external demand signals. Cite sources for every data point.

### Market Size and Growth
- [ ] Total addressable market size for this product category (source: )
- [ ] Year-over-year growth rate in this segment (source: )
- [ ] Projected 3-year trajectory (source: )
- [ ] Regional market dynamics (source: )

### Search and Social Signals
- [ ] Google Trends data for relevant keywords (last 12 months vs. prior 12 months)
- [ ] Social media volume and sentiment for product category
- [ ] Hashtag/content engagement trends on relevant platforms
- [ ] Influencer coverage and content type

### Travel Industry Signals
- [ ] Relevant industry report findings (World Travel Monitor, Skift, Phocuswire, etc.)
- [ ] Booking platform trend data (if publicly available)
- [ ] Destination marketing organization data
- [ ] Conference/trade show themes indicating category momentum

### Timing and Seasonality
- [ ] Best months/seasons for this product type
- [ ] Lead time requirements (how far in advance target audience books)
- [ ] Current pipeline: does proposed launch align with booking window?
- [ ] Economic and geopolitical context affecting travel demand

**External Demand Rating**: STRONG / MODERATE / WEAK / INSUFFICIENT DATA
**Data Quality Note**: [Any gaps — what data would improve confidence?]
