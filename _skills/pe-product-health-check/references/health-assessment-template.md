# Health Assessment Template

This file contains all 8 assessment sections for the Product Health Check capability. Load this file when running any assessment and populate each table with available data.

---

## Section 1: Performance Vitals

### 1a. Revenue Health

Query the database for revenue and booking metrics for `[PRODUCT]` over the current and previous period (typically current quarter/month vs. same period last year).

| Metric | Current Period | Previous Period | YoY | Portfolio Avg | Status |
|---|---|---|---|---|---|
| Total bookings | | | | | [🟢/🟡/🔴] |
| Total revenue | | | | | |
| Average booking value | | | | | |
| Revenue growth rate | | | | | |

**SQL reference:**
```sql
-- Revenue and booking metrics for [PRODUCT/DESTINATION]
SELECT
  COUNT(DISTINCT of.id) AS total_bookings,
  SUM(aso.selling_rate) AS total_revenue,
  AVG(aso.selling_rate) AS avg_booking_value
FROM operation_files of
JOIN requests r ON of.request_id = r.id
LEFT JOIN acc_srv_orders_operation_files asof ON asof.operation_file_id = of.id
LEFT JOIN acc_srv_orders aso ON asof.acc_srv_order_id = aso.id AND aso.cancelled = 0
WHERE r.destination_id = [DESTINATION_ID]
  AND of.created BETWEEN '[START_DATE]' AND '[END_DATE]'
  AND of.operation_file_status_id NOT IN (5);
```

---

### 1b. Conversion Health

Populate if website analytics or funnel data is available.

| Metric | Value | Portfolio Avg | Trend | Status |
|---|---|---|---|---|
| Page views | | | | |
| Inquiry rate | | | | |
| Booking rate | | | | |
| Overall conversion | | | | |

> If conversion data is unavailable, note: "Conversion metrics not available — website analytics not yet connected to Product Engine."

---

### 1c. Customer Health

| Metric | Value | Portfolio Avg | Trend | Status |
|---|---|---|---|---|
| Amendment rate | | | | |
| Cancellation rate | | | | |
| Repeat booking rate | | | | |
| Average review rating | | | | |
| Customer complaints | | | | |

**SQL reference:**
```sql
-- Cancellation and postponement rates for [PRODUCT/DESTINATION]
SELECT
  SUM(CASE WHEN operation_file_status_id = 4 THEN 1 ELSE 0 END) * 1.0 / COUNT(*) AS postponement_rate,
  SUM(CASE WHEN operation_file_status_id = 5 THEN 1 ELSE 0 END) * 1.0 / COUNT(*) AS cancellation_rate
FROM operation_files of
JOIN requests r ON of.request_id = r.id
WHERE r.destination_id = [DESTINATION_ID]
  AND of.created BETWEEN '[START_DATE]' AND '[END_DATE]';
```

---

### 1d. Seasonal Health

Assess whether the product performs in line with expected seasonal patterns.

| Quarter/Month | Bookings | vs. Last Year | vs. Expected Seasonal Pattern |
|---|---|---|---|
| [period 1] | | | [above/at/below expected] |
| [period 2] | | | |
| [period 3] | | | |
| [period 4] | | | |

**Seasonal pattern source**: Compare against prior 2–3 years of data. If data is unavailable, use industry benchmarks for the destination/product type.

---

### Status Key

| Symbol | Status | Meaning |
|---|---|---|
| 🟢 | HEALTHY | At or above portfolio average, positive or stable trend |
| 🟡 | WATCH | Below portfolio average or declining trend |
| 🔴 | ATTENTION | Significantly below average or accelerating decline |

---

## Section 2: Amendment Intelligence Snapshot

Amendment data reveals whether customers are accepting the product as-is or rebuilding it after booking. High amendment rates are a product-market misfit signal.

| Top Amendments | Frequency | Signal |
|---|---|---|
| [most common amendment] | [count / %] | [what it suggests about the product] |
| [second most common] | | |
| [third most common] | | |
| [fourth most common] | | |
| [fifth most common] | | |

**SQL reference:**
```sql
-- Status distribution for [PRODUCT/DESTINATION]
-- Note: No separate amendments table. Using operation_file_status_id.
SELECT
  CASE of.operation_file_status_id
    WHEN 1 THEN 'Active'
    WHEN 2 THEN 'Running'
    WHEN 3 THEN 'Completed'
    WHEN 4 THEN 'Postponed'
    WHEN 5 THEN 'Cancelled'
  END AS status_label,
  COUNT(*) AS frequency,
  COUNT(*) * 1.0 / (SELECT COUNT(*) FROM operation_files of2
    JOIN requests r2 ON of2.request_id = r2.id
    WHERE r2.destination_id = [DESTINATION_ID]) AS rate
FROM operation_files of
JOIN requests r ON of.request_id = r.id
WHERE r.destination_id = [DESTINATION_ID]
  AND of.created BETWEEN '[START_DATE]' AND '[END_DATE]'
GROUP BY of.operation_file_status_id
ORDER BY frequency DESC;
```

**Amendment health verdict**: State clearly — are customers treating this product as-is, or are they rebuilding it through amendments?

- **Low amendment rate (<10%)**: Product is accepted as designed. HEALTHY signal.
- **Moderate amendment rate (10-25%)**: Some misfit. WATCH — investigate top amendments.
- **High amendment rate (>25%)**: Significant misfit. ATTENTION — product likely needs re-engineering.

---

## Section 3: Competitive Position Check

Use existing competitor profiles from memory (or run a quick market scan if none exist). Reference `artifacts/competitors/` for any profiles related to this product's destination and market.

| Dimension | Our Position | Market Position | Competitive Health |
|---|---|---|---|
| Pricing | [our price] | [competitor range] | [competitive / expensive / underpriced] |
| Product inclusions | [our offering] | [market standard] | [above / at / below] |
| Content quality | [assessment] | [competitor benchmark] | [above / at / below] |
| Visibility/distribution | [our channels] | [competitor coverage] | [above / at / below] |
| Customer reviews | [our rating] | [competitor ratings] | [above / at / below] |

**Competitive health summary**: In 1-2 sentences, state whether this product is competitively positioned, and what the primary competitive risk is.

---

## Section 4: Lifecycle Position

Identify where this product sits in its lifecycle. This context is critical for interpreting performance metrics correctly.

| Stage | Characteristics | Assessment |
|---|---|---|
| **Launch** | New, low volume, building awareness | [✓ if this is the current stage] |
| **Growth** | Volume increasing, market fit validated | |
| **Maturity** | Stable volume, established market position | |
| **Decline** | Volume decreasing, market shifting | |
| **End-of-life** | Persistent decline, better alternatives exist | |

**Current lifecycle stage**: [stage]

**Evidence**: [Explain why you assessed this stage — cite specific data points: booking trajectory over 2+ years, market growth rates, competitive dynamics, customer demographics shifting, etc.]

**Expected trajectory**: [Where this product is heading over the next 12-24 months without intervention]

> Note: A declining product in end-of-life isn't necessarily "unhealthy" — it may be naturally sunsetting. Lifecycle position must inform how you interpret the composite score.

---

## Section 5: Composite Health Score

Score each dimension on a 1–10 scale based on the evidence gathered. Then calculate the weighted composite score. See `references/scoring-guide.md` for scoring criteria per dimension.

| Health Dimension | Score (1-10) | Weight | Weighted Score | Trend |
|---|---|---|---|---|
| Revenue performance | [score] | 25% | [score × 0.25] | [↑/↓/→] |
| Conversion efficiency | [score] | 20% | [score × 0.20] | |
| Customer satisfaction | [score] | 20% | [score × 0.20] | |
| Competitive position | [score] | 15% | [score × 0.15] | |
| Amendment health | [score] | 10% | [score × 0.10] | |
| Strategic fit | [score] | 10% | [score × 0.10] | |
| **COMPOSITE SCORE** | | **100%** | **[sum of weighted scores]** | **[overall trend]** |

**Composite score → 0-100**: Multiply the weighted average by 10.

**Health Classification**: [STRONG / STABLE / CONCERNING / CRITICAL / TERMINAL]

See `references/scoring-guide.md` for full classification thresholds and decision guidance.

---

## Section 6: Attention Flags

List specific issues that require human attention, ordered by severity. Include both data-backed findings and notable data gaps.

| Flag | Severity | Finding | Recommended Action |
|---|---|---|---|
| [flag 1] | CRITICAL | [what the data shows] | [what to do] |
| [flag 2] | WARNING | | |
| [flag 3] | INFO | | |

**Severity levels:**
- **CRITICAL** — Requires immediate action. This issue is materially harming the product's performance.
- **WARNING** — Requires attention within the next planning cycle. Trend is negative or risk is building.
- **INFO** — Notable finding for awareness. No immediate action required.

> If no flags exist, state: "No critical flags. Product is performing within expected parameters."

---

## Section 7: Comparison to Previous Health Check

**Only populate this section if a previous health check exists for this product in `artifacts/health-checks/`.**

Previous health check: `[filename]` — Date: `[date]` — Score: `[score]`

| Dimension | Previous Score | Current Score | Change | Assessment |
|---|---|---|---|---|
| Revenue performance | [old] | [new] | [±delta] | [improving / declining / stable] |
| Conversion efficiency | | | | |
| Customer satisfaction | | | | |
| Competitive position | | | | |
| Amendment health | | | | |
| Strategic fit | | | | |
| **Composite score** | | | | |

**Trajectory assessment**: Is this product getting healthier or sicker over time?

- State clearly if the health classification has changed (e.g., STABLE → CONCERNING is a significant signal requiring immediate attention)
- Note which dimensions drove the change
- Identify whether the trend is accelerating or decelerating

> If no previous health check exists, state: "First health check for this product — no historical baseline available. This assessment establishes the baseline for future trend analysis."

---

## Section 8: Recommendations

Base recommendations on the composite health classification. Be specific — name the exact areas to address and suggest the appropriate Product Engine initiative type.

### If STRONG (80–100):
- Identify growth opportunities: new source markets, adjacent customer segments, bundle opportunities, price optimization
- Consider whether this product should be used as a model for product development elsewhere in the portfolio
- Recommendation: Continue monitoring. No intervention required.

### If STABLE (60–79):
- Identify the 1-2 dimensions with the lowest scores — these are the highest-leverage improvement areas
- Recommend specific optimizations: pricing review, content enhancement, distribution expansion, etc.
- Recommendation: Proactive optimization recommended. Consider a light-touch Product Optimization initiative.

### If CONCERNING (40–59):
- Identify the primary diagnosis — which dimension(s) are dragging the score?
- Define the specific focus area for an Optimization initiative (e.g., "conversion funnel", "customer satisfaction", "competitive repositioning")
- Recommendation: Launch a Product Optimization initiative. Suggested focus: [dimension].

### If CRITICAL (20–39):
- State the primary diagnosis clearly — what is fundamentally wrong with this product?
- Assess whether the issue is fixable through optimization or requires repositioning
- Recommendation: Immediate Optimization or Repositioning initiative required. Primary diagnosis: [issue].

### If TERMINAL (0–19):
- Present the evidence that optimization would not work (e.g., market has shifted, product is obsolete, costs exceed recoverable revenue)
- Recommend a formal Retirement Assessment
- Recommendation: Consider Retirement. Evidence: [specific data points showing unfixable decline].
