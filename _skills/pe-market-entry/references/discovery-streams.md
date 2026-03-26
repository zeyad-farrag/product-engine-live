# Discovery Streams — Detailed Templates (Phase 2)

Reference for all five parallel research streams in the DISCOVER phase.

---

## Stream 2A — Internal Demand Signal Mining (MySQL)

Database: `system_travelapp` on `66.175.216.130`. Connection via pymysql (direct, SSL disabled). All queries use the real schema.

### A1. 24-Month Booking Trend
```sql
-- Intent: Measure bookings originating from the target market over 24 months
SELECT
  DATE_FORMAT(of.created, '%Y-%m') AS month,
  COUNT(DISTINCT of.id) AS booking_count,
  SUM(aso.selling_rate) AS total_revenue,
  AVG(aso.selling_rate) AS avg_booking_value
FROM operation_files of
JOIN requests r ON of.request_id = r.id
JOIN clients cl ON r.company_id = cl.id
JOIN countries co ON cl.country_id = co.id
LEFT JOIN acc_srv_orders_operation_files asof ON asof.operation_file_id = of.id
LEFT JOIN acc_srv_orders aso ON asof.acc_srv_order_id = aso.id AND aso.cancelled = 0
WHERE co.iso_alpha2 = '[TARGET_MARKET_ISO]'
  AND of.created >= DATE_SUB(NOW(), INTERVAL 24 MONTH)
  AND of.operation_file_status_id NOT IN (5)
GROUP BY month
ORDER BY month ASC;
```

### A2. Destination Breakdown
```sql
-- Intent: Which destinations do target-market customers book most?
SELECT
  d.name AS destination,
  COUNT(DISTINCT of.id) AS booking_count,
  SUM(aso.selling_rate) / SUM(SUM(aso.selling_rate)) OVER () AS revenue_share
FROM operation_files of
JOIN requests r ON of.request_id = r.id
JOIN destinations d ON r.destination_id = d.id
JOIN clients cl ON r.company_id = cl.id
JOIN countries co ON cl.country_id = co.id
LEFT JOIN acc_srv_orders_operation_files asof ON asof.operation_file_id = of.id
LEFT JOIN acc_srv_orders aso ON asof.acc_srv_order_id = aso.id AND aso.cancelled = 0
WHERE co.iso_alpha2 = '[TARGET_MARKET_ISO]'
  AND of.created >= DATE_SUB(NOW(), INTERVAL 24 MONTH)
  AND of.operation_file_status_id NOT IN (5)
GROUP BY d.name
ORDER BY booking_count DESC;
```

### A3. Product Type Mix
```sql
-- Intent: Which destinations and package types do target-market customers prefer?
SELECT
  d.name AS destination,
  COUNT(DISTINCT of.id) AS booking_count,
  AVG(aso.selling_rate) AS avg_value,
  AVG(DATEDIFF(r.arrival_date, of.created)) AS avg_lead_time_days
FROM operation_files of
JOIN requests r ON of.request_id = r.id
JOIN destinations d ON r.destination_id = d.id
JOIN clients cl ON r.company_id = cl.id
JOIN countries co ON cl.country_id = co.id
LEFT JOIN acc_srv_orders_operation_files asof ON asof.operation_file_id = of.id
LEFT JOIN acc_srv_orders aso ON asof.acc_srv_order_id = aso.id AND aso.cancelled = 0
WHERE co.iso_alpha2 = '[TARGET_MARKET_ISO]'
  AND of.created >= DATE_SUB(NOW(), INTERVAL 24 MONTH)
  AND of.operation_file_status_id NOT IN (5)
GROUP BY d.name
ORDER BY booking_count DESC;
```

### A4. Group Size Distribution
```sql
-- Intent: Average party size for target-market bookings
SELECT
  CASE
    WHEN (r.num_of_adults + r.num_of_children) = 1 THEN 'solo'
    WHEN (r.num_of_adults + r.num_of_children) = 2 THEN 'couple'
    WHEN (r.num_of_adults + r.num_of_children) BETWEEN 3 AND 5 THEN 'small_group'
    ELSE 'large_group'
  END AS group_size_bucket,
  COUNT(DISTINCT of.id) AS booking_count,
  COUNT(DISTINCT of.id) * 100.0 / SUM(COUNT(DISTINCT of.id)) OVER () AS pct
FROM operation_files of
JOIN requests r ON of.request_id = r.id
JOIN clients cl ON r.company_id = cl.id
JOIN countries co ON cl.country_id = co.id
WHERE co.iso_alpha2 = '[TARGET_MARKET_ISO]'
  AND of.created >= DATE_SUB(NOW(), INTERVAL 24 MONTH)
  AND of.operation_file_status_id NOT IN (5)
GROUP BY group_size_bucket;
```

### A5. Seasonality Pattern
```sql
-- Intent: Which months have peak demand from this market?
SELECT
  MONTH(r.arrival_date) AS travel_month,
  COUNT(DISTINCT of.id) AS booking_count,
  AVG(aso.selling_rate) AS avg_value
FROM operation_files of
JOIN requests r ON of.request_id = r.id
JOIN clients cl ON r.company_id = cl.id
JOIN countries co ON cl.country_id = co.id
LEFT JOIN acc_srv_orders_operation_files asof ON asof.operation_file_id = of.id
LEFT JOIN acc_srv_orders aso ON asof.acc_srv_order_id = aso.id AND aso.cancelled = 0
WHERE co.iso_alpha2 = '[TARGET_MARKET_ISO]'
  AND of.created >= DATE_SUB(NOW(), INTERVAL 24 MONTH)
  AND of.operation_file_status_id NOT IN (5)
  AND r.arrival_date IS NOT NULL
GROUP BY travel_month
ORDER BY travel_month;
```

### A6. Website Traffic from Target Market
```sql
-- Intent: Web form submissions (enquiries) from the target market
-- Note: Web analytics sessions are not in the database. Use enquiries table for web form data.
SELECT
  DATE_FORMAT(e.created, '%Y-%m') AS month,
  COUNT(*) AS enquiry_count
FROM enquiries e
JOIN clients cl ON e.client_id = cl.id
JOIN countries co ON cl.country_id = co.id
WHERE co.iso_alpha2 = '[TARGET_MARKET_ISO]'
  AND e.created >= DATE_SUB(NOW(), INTERVAL 24 MONTH)
GROUP BY month
ORDER BY month ASC;
```

### A7. Cancellation / Status Patterns
```sql
-- Intent: How often do target-market customers cancel or postpone?
-- Note: No separate amendments table. Use operation_file_status_id for status tracking.
SELECT
  CASE of.operation_file_status_id
    WHEN 1 THEN 'Active'
    WHEN 2 THEN 'Running'
    WHEN 3 THEN 'Completed'
    WHEN 4 THEN 'Postponed'
    WHEN 5 THEN 'Cancelled'
  END AS status_label,
  COUNT(*) AS count,
  COUNT(*) * 100.0 / (
    SELECT COUNT(*) FROM operation_files of2
    JOIN requests r2 ON of2.request_id = r2.id
    JOIN clients cl2 ON r2.company_id = cl2.id
    JOIN countries co2 ON cl2.country_id = co2.id
    WHERE co2.iso_alpha2 = '[TARGET_MARKET_ISO]'
  ) AS pct_of_bookings
FROM operation_files of
JOIN requests r ON of.request_id = r.id
JOIN clients cl ON r.company_id = cl.id
JOIN countries co ON cl.country_id = co.id
WHERE co.iso_alpha2 = '[TARGET_MARKET_ISO]'
GROUP BY of.operation_file_status_id;
```

**Disclosure rule**: If the target market has zero or near-zero rows, report: "Internal demand signal: NONE / very sparse — this is a new market with no booking history. Treat as greenfield."

---

## Stream 2B — External Market Intelligence Checklist

Research each dimension via web search. Cite every claim with source name + URL + publication date.

### B1. Market Size & Growth
- [ ] Outbound travel volume (trips/year) from target country
- [ ] Total outbound travel spend (USD or local currency)
- [ ] YoY growth rate (last 3 years)
- [ ] Post-COVID recovery trajectory
- [ ] Forecast for next 3–5 years
- Sources to check: UNWTO, national tourism boards, Euromonitor, Statista, IATA

### B2. Travel Behavior Patterns
- [ ] Top outbound destinations
- [ ] Preferred booking channel (OTA, direct, agent)
- [ ] Average trip duration
- [ ] Average spend per trip
- [ ] Travel party composition (solo, couples, families)
- [ ] Decision timeline (how far in advance do they book?)
- [ ] Holiday vs. leisure vs. MICE split

### B3. Structural Factors
- [ ] **Visa**: Does the target market have visa-free / visa-on-arrival access to key destinations the company serves?
- [ ] **Flight connectivity**: Direct flights or connections to the company's core destinations?
- [ ] **Currency stability**: Exchange rate risk, inflation, purchasing power
- [ ] **Language**: Primary language(s), English proficiency level
- [ ] **Cultural factors**: Travel motivations, destination preferences, brand trust drivers
- [ ] **Payment preferences**: Credit card penetration, preferred payment methods, BNPL usage

### B4. Digital Landscape
- [ ] Primary OTAs and booking platforms in market
- [ ] Search volume for relevant keywords (Google Trends or SEMrush if available)
- [ ] Social media platforms dominant for travel discovery
- [ ] Mobile vs. desktop booking split
- [ ] Influencer and content marketing landscape

### B5. Regulatory & Risk Factors
- [ ] Any restrictions on foreign travel companies operating in the market
- [ ] Currency repatriation rules
- [ ] Data protection / GDPR equivalent
- [ ] Political stability score
- [ ] Travel advisories (home country → destinations)
- [ ] COVID or health-related travel barriers (current)

**Confidence labeling**: Attach HIGH / MEDIUM / LOW confidence to each finding. Note data age.

---

## Stream 2C — Competitor Profiling Matrix (9 Dimensions)

Profile each identified competitor across all 9 dimensions.

### Competitor Identification
Search for:
1. **Direct competitors**: Travel companies targeting same market, same destinations
2. **Indirect competitors**: OTAs, airlines with holiday arms, local aggregators
3. **Local competitors**: Market-native travel companies with strong brand presence

### 9-Dimension Profile Template

| Dimension | Questions to Answer |
|-----------|-------------------|
| **1. Presence** | Are they actively marketing in this source market? Since when? |
| **2. Product** | What product types do they sell? Package holidays, flights+hotel, tours, experiences? |
| **3. Pricing** | What price tier? Budget / mid / premium? Avg basket value if available. |
| **4. Distribution** | Direct website, OTA listings, retail agents, B2B? |
| **5. Brand positioning** | How do they describe themselves? Safety, value, luxury, experience, specialist? |
| **6. Marketing channels** | Search, social, TV, print, influencer, affiliate? Estimated spend tier. |
| **7. Customer reviews** | Overall rating (Trustpilot, Google, TripAdvisor). Top complaints. Top praise. |
| **8. Tech & UX** | Mobile-first? Multi-language? Local payment methods? Self-service? |
| **9. Weaknesses / gaps** | What are they NOT doing well? What customer needs are unmet? |

### Competitive Gap Analysis Summary

After profiling all competitors:

```
What ALL competitors do well:
- [shared strength 1]
- [shared strength 2]

What competitors do POORLY (consistent weaknesses):
- [gap 1]
- [gap 2]

What NOBODY does (white space):
- [opportunity 1]
- [opportunity 2]
```

---

## Stream 2D — Buyer Persona Discovery (12 Dimensions)

Discover 2–5 distinct buyer personas. Cross-validate against Stream 2A internal data.

**First**: Check repo for existing persona artifacts from prior initiatives. If fresh (< 90 days) and overlapping with this market, reuse and note explicitly.

### 12-Dimension Persona Template

For each persona, document:

| Dimension | Content |
|-----------|---------|
| **1. Name & Archetype** | Give a memorable name + 1-line archetype (e.g., "The Family Planner", "The Adventure-Seeker") |
| **2. Demographics** | Age range, gender split, income bracket, family status |
| **3. Geography** | City / region tier within the source market |
| **4. Travel motivations** | Why they travel; what they're seeking |
| **5. Destination preferences** | Where they want to go; categories (beach, culture, adventure, city) |
| **6. Booking behavior** | How far in advance, which channels, direct vs. agent |
| **7. Budget sensitivity** | Price elasticity, willingness to pay premium for what |
| **8. Decision triggers** | What moves them from research to purchase |
| **9. Trust signals** | What makes a travel brand trustworthy to them |
| **10. Digital behavior** | Platforms, content types, search intent patterns |
| **11. Pain points** | What frustrates them about travel booking today |
| **12. Internal data cross-validation** | Does booking data support this persona? What does the data show? |

### Persona Confidence Rating
Rate each persona: HIGH (supported by internal data + external research) / MEDIUM (external research only) / LOW (inferred, limited evidence).

---

## Stream 2E — Cross-Initiative Intelligence

Scan the GitHub repo for overlapping intelligence from previous initiatives.

### Repo Scan Pattern
```bash
# List all existing artifacts
gh api repos/zeyad-farrag/product-engine-live/contents/artifacts/personas --jq '[.[] | .name]' 2>/dev/null
gh api repos/zeyad-farrag/product-engine-live/contents/artifacts/competitors --jq '[.[] | .name]' 2>/dev/null
gh api repos/zeyad-farrag/product-engine-live/contents/artifacts/decision-records --jq '[.[] | .name]' 2>/dev/null
gh api repos/zeyad-farrag/product-engine-live/contents/initiatives/closed --jq '[.[] | .name]' 2>/dev/null
```

### What to Look For

| Check | Action |
|-------|--------|
| **Competitor overlap** | Is [Competitor X] already profiled from a prior market entry? Read existing profile, note "reused from [initiative]", add market-specific deltas only. |
| **Persona archetypes** | Do prior personas share demographic/behavioral profiles with this market's segments? Cross-reference explicitly. |
| **Market similarities** | Have we evaluated adjacent or similar markets before? What did we learn? |
| **Decision record patterns** | Previous REJECT decisions — do they contain warnings relevant to this market? Previous ENTER decisions — what worked? |
| **Product gaps** | Prior initiatives may have flagged unmet needs that apply to this market too. |

### Cross-Initiative Summary Output
```
Cross-Initiative Findings for [TARGET MARKET]:
- Competitors reused: [list with source initiative]
- Personas partially overlapping: [list with note on overlap]
- Relevant prior decisions: [list with outcome]
- New intelligence (not in repo): [what's net-new from this initiative]
```
