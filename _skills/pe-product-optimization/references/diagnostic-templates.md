# Diagnostic Templates

MySQL queries, output formats, and analysis templates for Phase 2A (Performance Diagnostic), Phase 2B (Competitive Analysis), and Phase 2C (Root Cause Analysis).

---

## 2A-1. Booking Performance Analysis

### Query: Booking Volume by Period

```sql
-- Intent: Get booking volume, revenue, and key metrics broken down by 3/6/12-month windows
SELECT
    CASE
        WHEN of.created >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)  THEN 'last_3m'
        WHEN of.created >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)  THEN 'last_6m'
        WHEN of.created >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH) THEN 'last_12m'
    END                             AS period_label,
    COUNT(DISTINCT of.id)           AS booking_count,
    SUM(aso.selling_rate)           AS total_revenue,
    AVG(aso.selling_rate)           AS avg_booking_value
FROM operation_files of
JOIN requests r ON of.request_id = r.id
LEFT JOIN acc_srv_orders_operation_files asof ON asof.operation_file_id = of.id
LEFT JOIN acc_srv_orders aso ON asof.acc_srv_order_id = aso.id AND aso.cancelled = 0
WHERE r.destination_id = :destination_id
  AND of.created >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
  AND of.operation_file_status_id NOT IN (5)
GROUP BY period_label
ORDER BY period_label;
```

### Query: Portfolio Comparison

```sql
-- Intent: Compare target destination performance against portfolio average and similar destinations
SELECT
    d.name AS destination,
    COUNT(DISTINCT of.id)           AS booking_count_12m,
    SUM(aso.selling_rate)           AS revenue_12m,
    AVG(aso.selling_rate)           AS avg_booking_value_12m,
    RANK() OVER (ORDER BY COUNT(DISTINCT of.id) DESC) AS rank_in_portfolio
FROM operation_files of
JOIN requests r ON of.request_id = r.id
JOIN destinations d ON r.destination_id = d.id
LEFT JOIN acc_srv_orders_operation_files asof ON asof.operation_file_id = of.id
LEFT JOIN acc_srv_orders aso ON asof.acc_srv_order_id = aso.id AND aso.cancelled = 0
WHERE of.created >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
  AND of.operation_file_status_id NOT IN (5)
GROUP BY d.name
ORDER BY booking_count_12m DESC;
```

### Output Format: Booking Performance Table

```
### Booking Performance — [PRODUCT NAME]

| Period    | Bookings | Revenue    | Avg Value | vs Portfolio Avg | Trend |
|-----------|----------|------------|-----------|------------------|-------|
| Last 3M   | [N]      | [$ / AED]  | [$/pax]   | [+/- %]          | ▲/▼/→ |
| Last 6M   | [N]      | [$ / AED]  | [$/pax]   | [+/- %]          | ▲/▼/→ |
| Last 12M  | [N]      | [$ / AED]  | [$/pax]   | [+/- %]          | ▲/▼/→ |
| YoY (12M) | [N]      | [$ / AED]  | [$/pax]   | [+/- %]          | ▲/▼/→ |

Portfolio Position: Rank [N] of [M] products in [destination/tier] segment

RAG Status: 🔴 RED / 🟡 AMBER / 🟢 GREEN
Rationale: [brief explanation, e.g. "Booking volume down 34% vs portfolio peers"]

Data confidence: HIGH / MEDIUM / LOW — [basis, e.g. "12 months of complete booking records"]
```

Trend Arrow Key: ▲ = growing (>5%) | → = stable (±5%) | ▼ = declining (>5% drop)

---

## 2A-2. Conversion Funnel Analysis

### Query: Funnel by Stage

```sql
-- Intent: Build request → operation file conversion funnel
-- Note: page_events and detail_view_events are not available in the database.
-- Using requests → operation_files as the measurable funnel.
SELECT
    'requests'     AS stage, 1 AS stage_order, COUNT(*) AS event_count
FROM requests WHERE destination_id = :destination_id AND created >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
UNION ALL
SELECT 'operation_files' AS stage, 2 AS stage_order, COUNT(*) AS event_count
FROM operation_files of
JOIN requests r ON of.request_id = r.id
WHERE r.destination_id = :destination_id
  AND of.created >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
  AND of.operation_file_status_id NOT IN (5);
```

### Output Format: Funnel Visualization

```
### Conversion Funnel — [PRODUCT NAME] (Last 3 Months)

Page Views         [N,NNN]    (100%)
      ↓ [XX%] conversion        ← portfolio avg: [XX%]
Detail Views       [N,NNN]    ([XX%] of page views)
      ↓ [XX%] conversion        ← portfolio avg: [XX%]
Inquiries          [NNN]      ([X.X%] of detail views)
      ↓ [XX%] conversion        ← portfolio avg: [XX%]
Bookings           [NN]       ([X.X%] of inquiries)

Overall: [X.XX%] page view → booking    ← portfolio avg: [X.XX%]

⚠ Primary Drop-Off Point: [stage] → [stage] ([XX%] vs [XX%] portfolio avg)
Interpretation: [e.g. "Visitors engage with detail content but don't inquire — suggests
pricing shock, missing information, or weak call-to-action"]
```

---

## 2A-3. Amendment Signal Analysis

### Query: Amendment Breakdown

```sql
-- Intent: Break down operation file statuses (cancellation/postponement rates)
-- Note: No separate amendments table. Using operation_file_status_id for status tracking.
SELECT
    CASE of.operation_file_status_id
        WHEN 1 THEN 'Active'
        WHEN 2 THEN 'Running'
        WHEN 3 THEN 'Completed'
        WHEN 4 THEN 'Postponed'
        WHEN 5 THEN 'Cancelled'
    END AS status_label,
    COUNT(*)                                                              AS status_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM operation_files of2
        JOIN requests r2 ON of2.request_id = r2.id
        WHERE r2.destination_id = :destination_id
        AND of2.created >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)), 2)   AS pct_of_bookings,
    co.name AS source_market
FROM operation_files of
JOIN requests r ON of.request_id = r.id
LEFT JOIN clients cl ON r.company_id = cl.id
LEFT JOIN countries co ON cl.country_id = co.id
WHERE r.destination_id = :destination_id
  AND of.created >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
GROUP BY of.operation_file_status_id, co.name
ORDER BY status_count DESC;
```

### Query: Portfolio Amendment Rate Benchmark

```sql
-- Intent: Get portfolio-average cancellation rate for comparison
SELECT
    ROUND(
        (SELECT COUNT(*) FROM operation_files of2
         JOIN requests r2 ON of2.request_id = r2.id
         WHERE r2.destination_id = :destination_id
           AND of2.created >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
           AND of2.operation_file_status_id = 5) * 100.0 /
        NULLIF((SELECT COUNT(*) FROM operation_files of3
                JOIN requests r3 ON of3.request_id = r3.id
                WHERE r3.destination_id = :destination_id
                AND of3.created >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)), 0), 2) AS product_cancellation_rate_pct,
    ROUND(
        (SELECT COUNT(*) FROM operation_files
         WHERE created >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
           AND operation_file_status_id = 5) * 100.0 /
        NULLIF((SELECT COUNT(*) FROM operation_files
                WHERE created >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)), 0), 2) AS portfolio_cancellation_rate_pct;
```

### Output Format: Amendment Signal Table

```
### Amendment Signal Analysis — [PRODUCT NAME] (Last 12 Months)

Amendment Rate: [X.X%] vs portfolio average [X.X%]  → [ABOVE / BELOW / AT] average

#### Amendment Breakdown by Type

| Amendment Type           | Count | % of Bookings | Avg Revenue Δ | Signal Type        |
|--------------------------|-------|---------------|---------------|--------------------|
| Accommodation upgrade    | [N]   | [X.X%]        | +[$/pax]      | Hidden Demand      |
| Accommodation downgrade  | [N]   | [X.X%]        | -[$/pax]      | Dissatisfaction    |
| Activity addition        | [N]   | [X.X%]        | +[$/pax]      | Hidden Demand      |
| Activity removal         | [N]   | [X.X%]        | -[$/pax]      | Dissatisfaction    |
| Duration extension       | [N]   | [X.X%]        | +[$/pax]      | Hidden Demand      |
| Duration reduction       | [N]   | [X.X%]        | -[$/pax]      | Dissatisfaction    |
| Date change              | [N]   | [X.X%]        | ~[$/pax]      | Neutral/Scheduling |
| Destination addition     | [N]   | [X.X%]        | +[$/pax]      | Hidden Demand      |
| Cancellation             | [N]   | [X.X%]        | -[full]       | Dissatisfaction    |
| Other                    | [N]   | [X.X%]        | [$/pax]       | Mixed              |

#### Hidden Demand Signal Calculation

Hidden Demand Score = (Upgrades + Activity Additions + Extensions + Destination Additions)
                      ÷ Total Bookings × 100

[PRODUCT] Hidden Demand Score: [X.X%]  ← Portfolio Average: [X.X%]

Interpretation:
- Score > portfolio avg → customers want more than what's included; expansion opportunity
- Score < portfolio avg → product aligns with expectations OR customers are disengaged
- High dissatisfaction rate (downgrades + removals + cancellations > [X%]) → structural mismatch

#### Patterns by Market & Segment

| Market      | Top Amendment Type        | Rate    | Interpretation               |
|-------------|---------------------------|---------|------------------------------|
| [Market 1]  | [type]                    | [X.X%]  | [e.g. "Accommodation too basic for UK market"] |
| [Market 2]  | [type]                    | [X.X%]  | [...]                        |

Amendment Intelligence Summary: [2–3 sentence synthesis of what amendments collectively reveal]
```

---

## 2A-4. Customer Profile Analysis

### Query: Actual Buyer Demographics

```sql
-- Intent: Build actual buyer profile — source markets and group composition
SELECT
    co.name AS source_market,
    CASE
        WHEN r.num_of_adults + r.num_of_children = 1 THEN 'solo'
        WHEN r.num_of_adults = 2 AND r.num_of_children = 0 THEN 'couple'
        WHEN r.num_of_children > 0 THEN 'family'
        ELSE 'group'
    END AS traveler_type,
    COUNT(DISTINCT of.id)                                               AS booking_count,
    ROUND(COUNT(DISTINCT of.id) * 100.0 / SUM(COUNT(DISTINCT of.id)) OVER (), 1) AS pct_of_bookings
FROM operation_files of
JOIN requests r ON of.request_id = r.id
LEFT JOIN clients cl ON r.company_id = cl.id
LEFT JOIN countries co ON cl.country_id = co.id
WHERE r.destination_id = :destination_id
  AND of.created >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
  AND of.operation_file_status_id NOT IN (5)
GROUP BY co.name, traveler_type
ORDER BY booking_count DESC
LIMIT 20;
```

### Query: Cross-Purchase Patterns

```sql
-- Intent: Find what other destinations customers of this destination also book
SELECT
    d.name AS cross_destination,
    COUNT(DISTINCT of2.id)                                                    AS cross_booking_count,
    ROUND(COUNT(DISTINCT of2.id) * 100.0 /
        (SELECT COUNT(DISTINCT of3.id) FROM operation_files of3
         JOIN requests r3 ON of3.request_id = r3.id
         WHERE r3.destination_id = :destination_id
         AND of3.created >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
         AND of3.operation_file_status_id NOT IN (5)), 1)                    AS overlap_pct
FROM operation_files of1
JOIN requests r1 ON of1.request_id = r1.id
JOIN operation_files of2 ON of2.request_id IN (
    SELECT r4.id FROM requests r4
    JOIN clients cl4 ON r4.company_id = cl4.id
    WHERE cl4.id IN (
        SELECT cl5.id FROM operation_files of5
        JOIN requests r5 ON of5.request_id = r5.id
        JOIN clients cl5 ON r5.company_id = cl5.id
        WHERE r5.destination_id = :destination_id
          AND of5.operation_file_status_id NOT IN (5)
    )
)
JOIN requests r2 ON of2.request_id = r2.id
JOIN destinations d ON r2.destination_id = d.id
WHERE r1.destination_id = :destination_id
  AND r2.destination_id != :destination_id
  AND of1.created >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
  AND of1.operation_file_status_id NOT IN (5)
  AND of2.operation_file_status_id NOT IN (5)
GROUP BY d.name
ORDER BY cross_booking_count DESC
LIMIT 10;
```

### Output Format: Customer Profile Summary

```
### Customer Profile Analysis — [PRODUCT NAME] (Last 12 Months)

#### Actual Buyer Profile

| Dimension           | Actual                          | Intended (Persona)              | Match?      |
|---------------------|---------------------------------|---------------------------------|-------------|
| Top Source Markets  | [M1 X%], [M2 Y%], [M3 Z%]      | [intended markets]              | ✅ / ⚠ / ❌ |
| Primary Segment     | [e.g. FIT couples]              | [e.g. small group luxury]       | ✅ / ⚠ / ❌ |
| Age Bracket         | [e.g. 45–60]                    | [e.g. 35–55]                    | ✅ / ⚠ / ❌ |
| Repeat vs First     | [X%] repeat / [Y%] first-time   | [target split]                  | ✅ / ⚠ / ❌ |
| Booking Lead Time   | [X days average]                | [target lead time]              | ✅ / ⚠ / ❌ |

Audience Match Assessment: STRONG / PARTIAL / WEAK / INVERTED

#### Cross-Purchase Patterns (Top 5)

| Product             | Overlap % | Implication                              |
|---------------------|-----------|------------------------------------------|
| [product name]      | [X%]      | [e.g. "Same customers buy luxury lodges"] |
| ...                 | ...       | ...                                      |

#### Interpretation
[2–3 sentences: Does the actual audience match the intended audience? What does
this mean for product fit, positioning, and pricing?]

If WEAK or INVERTED audience match: flag for Inflection Point 1 as potential REPOSITION case.
```

---

## 2B. Competitive Comparison Matrix Template

```
### Competitive Position Matrix — [PRODUCT NAME] vs Competitors

| Dimension                  | [OUR PRODUCT] | [Competitor 1] | [Competitor 2] | [Competitor 3] |
|----------------------------|---------------|----------------|----------------|----------------|
| 1. Price Positioning (USD) | [price range] | [range]        | [range]        | [range]        |
| 2. Itinerary Length (days) | [N days]      | [N days]       | [N days]       | [N days]       |
| 3. Included Activities     | [list/count]  | [list/count]   | [list/count]   | [list/count]   |
| 4. Accommodation Tier      | [3*/4*/5*]    | [tier]         | [tier]         | [tier]         |
| 5. Unique Selling Points   | [USPs]        | [USPs]         | [USPs]         | [USPs]         |
| 6. Source Market Focus     | [markets]     | [markets]      | [markets]      | [markets]      |
| 7. Booking Flexibility     | [policy]      | [policy]       | [policy]       | [policy]       |
| 8. Digital Presence/Ratings| [score/N rev] | [score/N rev]  | [score/N rev]  | [score/N rev]  |
| 9. Amendment/Cancel Policy | [policy]      | [policy]       | [policy]       | [policy]       |

#### Competitive Gaps (Where We Are Weaker)
1. [Dimension]: [gap description] — [implication]
2. [Dimension]: [gap description] — [implication]

#### Competitive Advantages (Where We Lead)
1. [Dimension]: [advantage description] — [implication]
2. [Dimension]: [advantage description] — [implication]

Data sources: [list sources — e.g. operator websites, TripAdvisor, Google, industry reports]
Data date: [YYYY-MM-DD]
Confidence: HIGH / MEDIUM / LOW — [basis]
```

---

## 2C. Root Cause Analysis Table

For each symptom identified in Phase 2A, map to the 8 root cause categories:

```
### Root Cause Analysis — [PRODUCT NAME]

| # | Root Cause Category     | Symptom Evidence                          | Supporting Data                     | Confidence | Counterfactual                                  |
|---|-------------------------|-------------------------------------------|-------------------------------------|------------|-------------------------------------------------|
| 1 | Pricing Issue           | [e.g. high traffic, low conversion]       | [e.g. "Funnel: 8% inquiry→booking vs 22% portfolio avg"] | HIGH / MEDIUM / LOW | [e.g. "Test price reduction → if conversion improves, confirms pricing issue"] |
| 2 | Content/Messaging Issue | [e.g. high page views, low detail views]  | [e.g. "Detail view rate 18% vs 31% portfolio avg"]       | HIGH / MEDIUM / LOW | [e.g. "A/B test description rewrite"]           |
| 3 | Structural Issue        | [e.g. high inquiry, low booking]          | [e.g. "Inquiries ask about what's included 40% of time"] | HIGH / MEDIUM / LOW | [e.g. "Clarify inclusions in itinerary"]        |
| 4 | Audience Mismatch       | [e.g. wrong segment buying, high amendments] | [e.g. "Actual buyers: budget FIT vs intended: luxury couples"] | HIGH / MEDIUM / LOW | [e.g. "Redirect to pe-repositioning"]        |
| 5 | Competitive Displacement| [e.g. declining share, growing market]    | [e.g. "Market grew 15%, our bookings down 8%"]           | HIGH / MEDIUM / LOW | [e.g. "Confirm with competitor booking data"]   |
| 6 | Channel Issue           | [e.g. performance varies by source]       | [e.g. "Direct channel: 12% conv.; OTA channel: 4% conv."] | HIGH / MEDIUM / LOW | [e.g. "Analyze OTA listing quality"]           |
| 7 | Seasonal/Cyclical       | [e.g. recovers without intervention]      | [e.g. "Prior 3 years: same dip in Q1, recovery by Q2"]   | HIGH / MEDIUM / LOW | [e.g. "Compare to same period prior years"]    |
| 8 | Lifecycle Decline       | [e.g. consistent long-term decline]       | [e.g. "YoY decline: -12%, -18%, -23% over 3 years"]      | HIGH / MEDIUM / LOW | [e.g. "Review product refresh history"]        |

Primary Root Cause: [Category] — [1-sentence rationale]
Contributing Factors: [list secondary causes]
Data Gaps: [what additional data would increase confidence]
```

**Root Cause Priority Logic:**
- If Audience Mismatch is HIGH confidence → flag REPOSITION at Inflection Point 1
- If Lifecycle Decline is HIGH confidence with no addressable cause → flag RETIRE
- If Seasonal/Cyclical is HIGH confidence → flag HOLD
- Multiple addressable causes (Pricing + Content + Structural) → flag OPTIMIZE with prioritized plan
