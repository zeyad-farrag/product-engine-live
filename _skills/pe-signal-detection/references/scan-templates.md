# Scan Templates Reference

This file contains:
1. MySQL queries for all five DB sub-scans
2. Signal classification taxonomy
3. Signal detail card template
4. External scan search templates

---

## MySQL Queries

> **Database**: `system_travelapp` on `66.175.216.130`. Connection via pymysql (direct, SSL disabled). All queries use the real schema.

### Sub-Scan 1.1 — Booking Velocity Scan

```sql
-- Booking Velocity Scan
-- Intent: Compare current 30-day booking count against three baselines.
--         Flag any deviation >15%.

-- Current 30 days
SELECT COUNT(*) AS booking_count, 'current_30d' AS period_label
FROM operation_files
WHERE created >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
  AND created < CURDATE()
  AND operation_file_status_id NOT IN (5)

UNION ALL

-- Prior 30 days
SELECT COUNT(*) AS booking_count, 'prior_30d' AS period_label
FROM operation_files
WHERE created >= DATE_SUB(CURDATE(), INTERVAL 60 DAY)
  AND created < DATE_SUB(CURDATE(), INTERVAL 30 DAY)
  AND operation_file_status_id NOT IN (5)

UNION ALL

-- Same 30-day period last year (YoY)
SELECT COUNT(*) AS booking_count, 'same_period_ly' AS period_label
FROM operation_files
WHERE created >= DATE_SUB(DATE_SUB(CURDATE(), INTERVAL 1 YEAR), INTERVAL 0 DAY)
  AND created < DATE_SUB(CURDATE(), INTERVAL 335 DAY)
  AND operation_file_status_id NOT IN (5)

UNION ALL

-- 90-day rolling average (divide total by 3 to get 30d equivalent)
SELECT ROUND(COUNT(*) / 3.0) AS booking_count, '90d_rolling_avg' AS period_label
FROM operation_files
WHERE created >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
  AND created < CURDATE()
  AND operation_file_status_id NOT IN (5);
```

**Deviation calculation** (apply after fetching results):
```
deviation_pct = ((current_30d - baseline) / baseline) * 100
Flag if: ABS(deviation_pct) > 15
```

---

### Sub-Scan 1.2 — Revenue Anomaly Scan

```sql
-- Average Booking Value Scan
-- Intent: Compare average booking value current 30d vs. prior 30d and YoY.

SELECT
  'current_30d'       AS period_label,
  ROUND(AVG(aso.selling_rate), 2)  AS avg_booking_value,
  ROUND(SUM(aso.selling_rate), 2)  AS total_revenue,
  COUNT(DISTINCT of.id)            AS booking_count
FROM operation_files of
JOIN acc_srv_orders_operation_files asof ON asof.operation_file_id = of.id
JOIN acc_srv_orders aso ON asof.acc_srv_order_id = aso.id AND aso.cancelled = 0
WHERE of.created >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
  AND of.created < CURDATE()
  AND of.operation_file_status_id NOT IN (5)

UNION ALL

SELECT
  'prior_30d'         AS period_label,
  ROUND(AVG(aso.selling_rate), 2),
  ROUND(SUM(aso.selling_rate), 2),
  COUNT(DISTINCT of.id)
FROM operation_files of
JOIN acc_srv_orders_operation_files asof ON asof.operation_file_id = of.id
JOIN acc_srv_orders aso ON asof.acc_srv_order_id = aso.id AND aso.cancelled = 0
WHERE of.created >= DATE_SUB(CURDATE(), INTERVAL 60 DAY)
  AND of.created < DATE_SUB(CURDATE(), INTERVAL 30 DAY)
  AND of.operation_file_status_id NOT IN (5)

UNION ALL

SELECT
  'same_period_ly'    AS period_label,
  ROUND(AVG(aso.selling_rate), 2),
  ROUND(SUM(aso.selling_rate), 2),
  COUNT(DISTINCT of.id)
FROM operation_files of
JOIN acc_srv_orders_operation_files asof ON asof.operation_file_id = of.id
JOIN acc_srv_orders aso ON asof.acc_srv_order_id = aso.id AND aso.cancelled = 0
WHERE of.created >= DATE_SUB(DATE_SUB(CURDATE(), INTERVAL 1 YEAR), INTERVAL 0 DAY)
  AND of.created < DATE_SUB(CURDATE(), INTERVAL 335 DAY)
  AND of.operation_file_status_id NOT IN (5);
```

```sql
-- Revenue Concentration Scan
-- Intent: Top 10 destinations by revenue as % of total — detect concentration shifts.

SELECT
  d.name AS destination,
  ROUND(SUM(aso.selling_rate), 2)            AS destination_revenue,
  ROUND(
    SUM(aso.selling_rate) * 100.0
    / SUM(SUM(aso.selling_rate)) OVER (), 2
  )                                          AS revenue_pct
FROM operation_files of
JOIN requests r ON of.request_id = r.id
JOIN destinations d ON r.destination_id = d.id
JOIN acc_srv_orders_operation_files asof ON asof.operation_file_id = of.id
JOIN acc_srv_orders aso ON asof.acc_srv_order_id = aso.id AND aso.cancelled = 0
WHERE of.created >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
  AND of.created < CURDATE()
  AND of.operation_file_status_id NOT IN (5)
GROUP BY d.name
ORDER BY destination_revenue DESC
LIMIT 10;
```

---

### Sub-Scan 1.3 — Amendment Signal Scan

```sql
-- Cancellation Rate Scan
-- Intent: Calculate cancellation and postponement rates — compare current vs. prior 30d.
-- Note: No separate amendments table exists. Cancellation = status 5, Postponed = status 4.

SELECT
  'current_30d'                                     AS period_label,
  COUNT(*)                                          AS total_bookings,
  SUM(CASE WHEN operation_file_status_id = 4 THEN 1 ELSE 0 END)     AS postponed,
  SUM(CASE WHEN operation_file_status_id = 5 THEN 1 ELSE 0 END)     AS cancellations,
  ROUND(
    SUM(CASE WHEN operation_file_status_id = 4 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2
  )                                                  AS postponed_rate_pct,
  ROUND(
    SUM(CASE WHEN operation_file_status_id = 5 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2
  )                                                  AS cancellation_rate_pct
FROM operation_files
WHERE created >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
  AND created < CURDATE()

UNION ALL

SELECT
  'prior_30d',
  COUNT(*),
  SUM(CASE WHEN operation_file_status_id = 4 THEN 1 ELSE 0 END),
  SUM(CASE WHEN operation_file_status_id = 5 THEN 1 ELSE 0 END),
  ROUND(SUM(CASE WHEN operation_file_status_id = 4 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2),
  ROUND(SUM(CASE WHEN operation_file_status_id = 5 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2)
FROM operation_files
WHERE created >= DATE_SUB(CURDATE(), INTERVAL 60 DAY)
  AND created < DATE_SUB(CURDATE(), INTERVAL 30 DAY);
```

```sql
-- Cancellation Pattern by Destination
-- Intent: Which destinations have the highest cancellation rates?

SELECT
  d.name AS destination,
  SUM(CASE WHEN of.operation_file_status_id = 5 THEN 1 ELSE 0 END)  AS cancellation_count,
  COUNT(*)                                                            AS total_bookings,
  ROUND(
    SUM(CASE WHEN of.operation_file_status_id = 5 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2
  )                                                                   AS cancellation_rate_pct
FROM operation_files of
JOIN requests r ON of.request_id = r.id
JOIN destinations d ON r.destination_id = d.id
WHERE of.created >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
  AND of.created < CURDATE()
GROUP BY d.name
HAVING cancellation_count >= 3
ORDER BY cancellation_rate_pct DESC
LIMIT 15;
```

---

### Sub-Scan 1.4 — Conversion Signal Scan

```sql
-- Request-to-Booking Conversion Rate
-- Intent: Compare conversion rate by destination and source.

SELECT
  'destination'                                    AS segment_type,
  d.name                                           AS segment_value,
  COUNT(DISTINCT r.id)                             AS requests,
  COUNT(DISTINCT of.id)                            AS bookings,
  ROUND(
    COUNT(DISTINCT of.id) * 100.0
    / NULLIF(COUNT(DISTINCT r.id), 0), 2
  )                                                AS conversion_rate_pct
FROM requests r
LEFT JOIN operation_files of ON of.request_id = r.id AND of.operation_file_status_id NOT IN (5)
JOIN destinations d ON r.destination_id = d.id
WHERE r.created >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
  AND r.created < CURDATE()
GROUP BY d.name
ORDER BY requests DESC
LIMIT 20;
```

```sql
-- Request Volume Trend
-- Intent: Track total request volume — are fewer leads entering the funnel?

SELECT 'current_30d' AS period_label, COUNT(*) AS request_count
FROM requests
WHERE created >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
  AND created < CURDATE()

UNION ALL

SELECT 'prior_30d', COUNT(*)
FROM requests
WHERE created >= DATE_SUB(CURDATE(), INTERVAL 60 DAY)
  AND created < DATE_SUB(CURDATE(), INTERVAL 30 DAY);
```

---

### Sub-Scan 1.5 — Customer Behavior Scan

```sql
-- Booking Lead Time Scan
-- Intent: Has the average number of days between request and operation file changed?

SELECT
  'current_30d'                           AS period_label,
  ROUND(AVG(DATEDIFF(of.created, r.created)), 1)  AS avg_lead_time_days,
  NULL                                    AS median_lead_time_days
FROM operation_files of
JOIN requests r ON of.request_id = r.id
WHERE of.created >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
  AND of.created < CURDATE()
  AND of.operation_file_status_id NOT IN (5)

UNION ALL

SELECT
  'prior_30d',
  ROUND(AVG(DATEDIFF(of.created, r.created)), 1),
  NULL
FROM operation_files of
JOIN requests r ON of.request_id = r.id
WHERE of.created >= DATE_SUB(CURDATE(), INTERVAL 60 DAY)
  AND of.created < DATE_SUB(CURDATE(), INTERVAL 30 DAY)
  AND of.operation_file_status_id NOT IN (5);
```

```sql
-- Destination Preference Shift Scan
-- Intent: Rank top 10 destinations by booking volume — compare ranking vs. prior period.

SELECT
  d.name AS destination,
  COUNT(*) AS bookings_current
FROM operation_files of
JOIN requests r ON of.request_id = r.id
JOIN destinations d ON r.destination_id = d.id
WHERE of.created >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
  AND of.created < CURDATE()
  AND of.operation_file_status_id NOT IN (5)
GROUP BY d.name
ORDER BY bookings_current DESC
LIMIT 10;
```

```sql
-- New Market Activity Scan
-- Intent: Detect bookings from new geographic markets not seen in prior periods.

SELECT
  co.name                               AS market,
  COUNT(*)                              AS booking_count,
  MIN(of.created)                       AS first_seen_date
FROM operation_files of
JOIN requests r ON of.request_id = r.id
JOIN clients cl ON r.company_id = cl.id
JOIN countries co ON cl.country_id = co.id
WHERE of.created >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
  AND of.created < CURDATE()
  AND of.operation_file_status_id NOT IN (5)
  AND co.name NOT IN (
    SELECT DISTINCT co2.name
    FROM operation_files of2
    JOIN requests r2 ON of2.request_id = r2.id
    JOIN clients cl2 ON r2.company_id = cl2.id
    JOIN countries co2 ON cl2.country_id = co2.id
    WHERE of2.created >= DATE_SUB(CURDATE(), INTERVAL 120 DAY)
      AND of2.created < DATE_SUB(CURDATE(), INTERVAL 30 DAY)
  )
GROUP BY co.name
ORDER BY booking_count DESC;
```

---

## Signal Classification Taxonomy

### Categories

| Category | Description | Typical Sources |
|----------|-------------|-----------------|
| `GROWTH` | Positive acceleration — bookings, revenue, conversion, new markets trending up above normal | DB scans 1.1, 1.2, 1.4, 1.5 |
| `DECLINE` | Negative movement — volume, revenue, conversion, lead time shortening abnormally | DB scans 1.1, 1.2, 1.4 |
| `ANOMALY` | Unexpected pattern that doesn't fit the growth/decline binary — spike, sudden reversal, statistical outlier | Any source |
| `COMPETITIVE` | Activity from competitors — pricing, product launches, new routes, promotions | Source 3 (web) |
| `MARKET` | External market forces — economic, regulatory, event-driven, seasonal shifts | Source 3 (web), Source 2 (memory) |
| `OPERATIONAL` | Internal process signals — amendment spikes, cancellation clusters, conversion funnel breaks | DB scans 1.3, 1.4 |

### Severities

| Severity | Criteria | Response Urgency |
|----------|----------|-----------------|
| `CRITICAL` | Immediate revenue or market share impact. Metric deviation >30% OR competitor threat with direct product overlap OR regulatory change affecting core operations | This week |
| `WARNING` | Negative trend that will become critical if unaddressed. Metric deviation 15–30% OR pattern emerging over 2+ periods | This month |
| `OPPORTUNITY` | Positive signal with actionable upside. Growth >15% in a segment with capacity to scale OR unmet demand pattern detected | This quarter |
| `INFO` | Context-setting signal. Deviation <15% OR single-period pattern not yet confirmed | Track; revisit next scan |

### Severity Escalation Rules

- A signal that was `WARNING` in the prior report and has **not improved** → escalate to `CRITICAL`
- A signal that has appeared in **3+ consecutive reports** without a corresponding active initiative → escalate one severity level and add `[RECURRING x N]` tag
- A signal that was `INFO` and deviation has grown → escalate to `WARNING`

---

## Signal Detail Card Template

```
╔══════════════════════════════════════════════════════════════╗
  SIGNAL: [Short descriptive title — max 60 chars]
  Category: [CATEGORY]  |  Severity: [SEVERITY]  |  Timeframe: [THIS WEEK / THIS MONTH / THIS QUARTER]
╚══════════════════════════════════════════════════════════════╝

WHAT:
  [Exact numbers. E.g.: "Booking volume for Product X dropped from 142
  bookings (prior 30d) to 98 bookings (current 30d), a -31% decline.
  YoY comparison: 127 bookings in same period last year (-23% YoY).
  90-day rolling average: 138/month (-29% vs. average)."]

SO WHAT:
  [If this trend continues for another 30 days at the same rate, what
  happens? Quantify where possible. E.g.: "At current trajectory, Product
  X will fall below the minimum viable volume threshold (80 bookings/month)
  within 6 weeks. Annual revenue impact if not reversed: -$XXX,XXX."]

WHAT NOW:
  → Immediate action: [Specific action, e.g., "Pull full product health
    check to diagnose root cause before recommending response"]
  → Initiative/Capability to run: [pe-skill-name]
  → Data needed: [E.g., "Segment the decline by source market and channel
    to isolate whether this is demand-side or supply-side"]
  → Decision needed from: [E.g., "Product team to confirm if supply
    constraint exists; revenue team to confirm pricing competitiveness"]

CONFIDENCE: [H = confirmed by 2+ data sources | M = single source, strong signal | L = single source, early indicator]
Signal History: [NEW | RECURRING x N | ESCALATED from WARNING | ↓ RESOLVING]
```

---

## External Scan Search Templates

Use these search patterns in Step 3. Adapt to the actual business context.

```
# Competitor activity
"[competitor name 1] [competitor name 2] travel package pricing [current year]"
"[destination] tour operator new products [current year]"

# Industry trends
"travel industry bookings trend [current month] [current year]"
"outbound travel [source market] [current year] forecast"
"[destination] tourism arrivals [current year]"

# Regulatory / visa
"[destination] visa requirements changes [current year]"
"[source market] travel advisory [destination] [current year]"

# Economic / currency
"[source market currency] exchange rate trend [current month year]"
"[source market] consumer confidence travel spending [current year]"

# Events / disruptions
"[destination] major events [next 3 months]"
"[destination] travel disruption [current month year]"
```
