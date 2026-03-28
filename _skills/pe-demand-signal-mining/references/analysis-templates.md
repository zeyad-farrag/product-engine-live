# Analysis Templates — Demand Signal Mining

> **Database**: `system_travelapp` (host configured via `MYSQL_HOST` env var). Connection via pymysql.

Use these templates for each of the six analysis types. Populate all tables with real data from database queries. Skip any analysis where the required data is unavailable — note the gap, do not fabricate values.

---

## Analysis 1: Volume & Revenue Trends

**Purpose**: Establish the baseline demand picture — how much are customers booking, how much revenue is it generating, and how is this changing over time?

```sql
-- Booking volume and revenue over time for [QUERY_FOCUS]
SELECT
    DATE_FORMAT(of.created, '%Y-%m') AS period,
    COUNT(DISTINCT of.id) AS bookings,
    SUM(aso.selling_rate) AS total_revenue,
    AVG(aso.selling_rate) AS avg_booking_value
FROM operation_files of
LEFT JOIN acc_srv_orders_operation_files asof ON asof.operation_file_id = of.id
LEFT JOIN acc_srv_orders aso ON asof.acc_srv_order_id = aso.id AND aso.cancelled = 0
WHERE of.operation_file_status_id NOT IN (5)
  AND [focus_filter]
GROUP BY period
ORDER BY period;
```

**Output table:**

| Period | Bookings | Revenue | Avg Booking Value | vs. Previous Period | vs. Same Period Last Year |
|---|---|---|---|---|---|
| [month/quarter] | [count] | [amount] | [avg] | [% change] | [% change] |
| | | | | | |

**Trend interpretation**: [Is volume growing, declining, or stable? Is there acceleration or deceleration? Are there inflection points? Describe the shape of the trend curve.]

**Anomalies**: [Any unusual spikes or drops? What might explain them — external events, promotions, data issues?]

---

## Analysis 2: Segmentation Breakdown

**Purpose**: Understand who is buying — break down volume and revenue by the key dimensions that matter for product and market decisions.

```sql
-- Segmentation breakdown for [QUERY_FOCUS]
SELECT
    co.name AS source_market,
    d.name AS destination,
    s.source AS channel,
    COUNT(DISTINCT of.id) AS bookings,
    SUM(aso.selling_rate) AS total_revenue,
    AVG(aso.selling_rate) AS avg_value
FROM operation_files of
JOIN requests r ON of.request_id = r.id
LEFT JOIN clients cl ON r.company_id = cl.id
LEFT JOIN countries co ON cl.country_id = co.id
LEFT JOIN destinations d ON r.destination_id = d.id
LEFT JOIN sources s ON r.source_id = s.id
LEFT JOIN acc_srv_orders_operation_files asof ON asof.operation_file_id = of.id
LEFT JOIN acc_srv_orders aso ON asof.acc_srv_order_id = aso.id AND aso.cancelled = 0
WHERE of.operation_file_status_id NOT IN (5)
  AND [focus_filter]
GROUP BY co.name, d.name, s.source
ORDER BY bookings DESC;
```

**By Source Market:**

| Source Market | Bookings | Revenue | Avg Value | Share % | Trend |
|---|---|---|---|---|---|
| [market] | | | | | [↑/↓/→] |
| | | | | | |

**By Product/Destination:**

| Product/Destination | Bookings | Revenue | Avg Value | Share % | Trend |
|---|---|---|---|---|---|
| | | | | | |

**By Customer Segment/Tier:**

| Segment/Tier | Bookings | Revenue | Avg Value | Share % | Trend |
|---|---|---|---|---|---|
| | | | | | |

**By Booking Channel (if available):**

| Channel | Bookings | Share % | Avg Value | Trend |
|---|---|---|---|---|
| | | | | |

**Cross-tabulation insight**: [What patterns emerge when you cross dimensions? e.g., "German bookings are concentrated in luxury tier for Egypt but budget tier for Jordan — suggesting different personas by destination."]

---

## Analysis 3: Seasonality Pattern

**Purpose**: Identify when customers travel vs. when they book, and what the natural demand rhythm looks like across the calendar year.

```sql
-- Seasonality: travel month vs booking month + lead time
SELECT
    MONTH(r.arrival_date) AS travel_month,
    MONTH(of.created) AS booking_month,
    COUNT(DISTINCT of.id) AS bookings,
    AVG(DATEDIFF(r.arrival_date, of.created)) AS avg_lead_time_days
FROM operation_files of
JOIN requests r ON of.request_id = r.id
WHERE of.operation_file_status_id NOT IN (5)
  AND r.arrival_date IS NOT NULL
  AND [focus_filter]
GROUP BY travel_month, booking_month
ORDER BY travel_month;
```

**Output table:**

| Month | Bookings (Travel Month) | Bookings (Booking Month) | Lead Time Avg |
|---|---|---|---|
| Jan | [when they travel] | [when they book] | [days] |
| Feb | | | |
| Mar | | | |
| Apr | | | |
| May | | | |
| Jun | | | |
| Jul | | | |
| Aug | | | |
| Sep | | | |
| Oct | | | |
| Nov | | | |
| Dec | | | |

**Seasonality interpretation**:
- Peak travel months: [months] — why? [holiday patterns, weather, cultural calendar]
- Peak booking months: [months] — how far in advance?
- Off-season opportunity: [when is demand lowest? Is this addressable or structural?]

**Hemisphere and cultural calendar note**: [For non-domestic markets, account for inverted seasons, local holidays, school calendars. e.g., Australian market peaks align with Southern Hemisphere winter and school holidays.]

---

## Analysis 4: Amendment Signal Intelligence

**Purpose**: Amendments reveal what customers wanted but didn't get from the original product. This is the highest-value analytical lens in demand signal mining.

```sql
-- Cancellation and status distribution for [QUERY_FOCUS]
-- Note: Amendment data is tracked via operation_file_status_id changes
-- and tr_reservation_statuses (status 15 = Amended)
SELECT
    CASE of.operation_file_status_id
        WHEN 1 THEN 'Active'
        WHEN 2 THEN 'Running'
        WHEN 3 THEN 'Completed'
        WHEN 4 THEN 'Postponed'
        WHEN 5 THEN 'Cancelled'
    END AS status_label,
    COUNT(*) AS file_count,
    COUNT(*) * 100.0 / (SELECT COUNT(*) FROM operation_files WHERE [focus_filter]) AS pct_of_total
FROM operation_files of
WHERE [focus_filter]
GROUP BY of.operation_file_status_id
ORDER BY file_count DESC;
```

**Amendment Volume Table:**

| Amendment Type | Count | % of Bookings | Avg Cost Impact | Trend |
|---|---|---|---|---|
| Accommodation upgrade | | | | |
| Accommodation downgrade | | | | |
| Activity addition | | | | |
| Activity removal | | | | |
| Duration extension | | | | |
| Duration reduction | | | | |
| Date change | | | | |
| Destination addition | | | | |
| Destination removal | | | | |
| Cancellation | | | | |
| Other | | | | |

**Amendment Intelligence Synthesis:**

For each significant amendment pattern (>5% of bookings or notable trend):

| Pattern | What Customers Do | What It Signals | Product Implication |
|---|---|---|---|
| [pattern 1] | [observed behavior] | [interpretation] | [what to build/change] |
| [pattern 2] | | | |
| [pattern 3] | | | |

**Key diagnostic questions the amendment data answers:**

- Are customers consistently **upgrading accommodation**? → Default accommodation level may be too low for this audience
- Are customers **adding specific activities**? → These activities should be included by default
- Are customers **extending duration**? → Trip length may be too short
- Are **cancellation rates high** for specific segments? → Possible product-market mismatch
- Do amendment patterns **differ by source market**? → Different markets have different expectations for the same product

---

## Analysis 5: Customer Behavior Patterns

**Purpose**: Understand how customers behave as buyers — group size, repeat rate, cross-purchase, lead time, and other behavioral signals that reveal persona characteristics and bundling opportunities.

```sql
-- Customer behavior metrics for [QUERY_FOCUS]
SELECT
    AVG(r.num_of_adults + r.num_of_children) AS avg_group_size,
    SUM(CASE WHEN r.num_of_adults = 1 AND r.num_of_children = 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS solo_pct,
    SUM(CASE WHEN r.num_of_children > 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS family_pct,
    AVG(DATEDIFF(r.arrival_date, of.created)) AS avg_lead_time_days
FROM operation_files of
JOIN requests r ON of.request_id = r.id
WHERE of.operation_file_status_id NOT IN (5)
  AND [focus_filter];
```

**Behavioral Metrics Table:**

| Metric | Value | Comparison to Portfolio Avg | Interpretation |
|---|---|---|---|
| Average group size | | | |
| Solo traveler % | | | |
| Family booking % | | | |
| Repeat customer rate | | | |
| Multi-product bookings | | | |
| Average lead time (days) | | | |
| Weekend vs. weekday bookings | | | |

**Cross-purchase analysis**: What else do [QUERY_FOCUS] customers buy? [This reveals personas and bundling opportunities. e.g., "Egypt booking customers also book Jordan at 34% rate, suggesting a regional explorer persona."]

---

## Analysis 6: Conversion Indicators (if data available)

**Purpose**: Map the funnel from first touch to confirmed booking to identify where demand is leaking and what the conversion efficiency looks like relative to portfolio averages.

> **Note**: This analysis requires web analytics and CRM data in addition to booking data. Skip if conversion data is unavailable — note the gap.

```sql
-- Conversion funnel for [QUERY_FOCUS]
SELECT
    'Requests' AS stage,
    COUNT(*) AS volume
FROM requests r
WHERE [focus_filter]
UNION ALL
SELECT
    'Operation Files' AS stage,
    COUNT(*) AS volume
FROM operation_files of
JOIN requests r ON of.request_id = r.id
WHERE of.operation_file_status_id NOT IN (5)
  AND [focus_filter];
```

**Funnel Table:**

| Stage | Volume | Rate | vs. Portfolio Avg |
|---|---|---|---|
| Website visits | | | |
| Product page views | | | |
| Inquiries/quotes | | | |
| Bookings | | | |
| Inquiry-to-booking rate | | | |
| Visit-to-booking rate | | | |

**Funnel analysis**: Where do potential customers drop off? What does this suggest about the product, pricing, or content? [e.g., "High page views but low inquiry rate suggests price or content is creating friction at the consideration stage."]
