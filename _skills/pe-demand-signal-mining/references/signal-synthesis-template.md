# Signal Synthesis Template — Demand Signal Mining

Complete this section after running all six analysis types. This is where raw data becomes intelligence.

---

## Demand Signal Summary Table

Consolidate all significant signals across the six analyses into one table. Rate each signal by strength and specify the action type it implies.

| Signal | Finding | Strength | Strategic Implication | Action Type |
|---|---|---|---|---|
| [signal 1] | [what the data shows] | [STRONG/MODERATE/WEAK] | [what it means for strategy] | [Optimize/Create/Reposition/Monitor/Investigate] |
| [signal 2] | | | | |
| [signal 3] | | | | |
| [signal 4] | | | | |
| [signal 5] | | | | |

**Signal Strength definitions:**
- `STRONG` — consistent pattern across multiple data dimensions, high sample size, clear directional implication
- `MODERATE` — clear pattern but limited data, or mixed signals across dimensions
- `WEAK` — early indication, small sample, requires monitoring before acting

**Action Type definitions:**
- `Optimize` — existing product or channel needs adjustment
- `Create` — new product, feature, or market activation needed
- `Reposition` — existing offering is targeting the wrong audience or message
- `Monitor` — signal is emerging but not yet actionable; track in next analysis cycle
- `Investigate` — anomaly or gap that requires additional data collection before interpretation

---

## Hidden Demand Indicators

Identify demand that exists but is not being captured by current products, pricing, or marketing. This is frequently the highest-value section of the report.

### Expressed Demand, Unconverted

Customers who showed intent but did not book.

- **Inquiry-to-booking gap**: [What volume of inquiries or page views did not convert? What is the gap vs. portfolio average? What might explain it — price, product-market fit, content quality, response speed?]
- **Specific unconverted segments**: [Are there markets or segments with disproportionately low conversion? What does this suggest?]

### Adjacent Demand

Customers already buying related products who might buy this product if it existed or improved.

- **Cross-purchase patterns**: [What products do current customers also buy? Does this reveal an unmet need for a bundled or related product?]
- **Upgrade propensity**: [Are customers in lower tiers purchasing upgrades at high rates? This signals willingness to pay more if the right product exists.]

### Amendment-Revealed Demand

Customers who are building the product they want through post-booking modifications. This is the most direct evidence of unmet demand.

- **Products customers are assembling via amendments**: [If customers consistently add X activity and extend duration by Y days, there is likely a latent demand for a longer itinerary that includes X by default.]
- **Upgrade patterns**: [If a specific accommodation tier is upgraded at high rates, a default tier uplift or a premium variant should be evaluated.]
- **Structural gaps revealed**: [List 2–3 product gaps that amendment data directly implies, framed as: "Customers are doing [behavior] through amendments, which suggests they want [product that doesn't exist or isn't marketed well]."]

### Negative Space Demand

Markets or segments with no data at all. Absence is a signal — but it requires careful interpretation.

- **Markets with zero or minimal bookings**: [List markets where booking data is absent. For each: Is this because there is no demand, no marketing presence, no product fit, or no distribution?]
- **Segments underrepresented relative to market size**: [Are there customer segments that should logically be booking but aren't showing up in the data?]
- **Interpretation guidance**: Before concluding "no demand exists," check whether the market has been marketed to, whether the product is priced and positioned appropriately, and whether distribution channels reach that market.

---

## Trend Trajectories

Project the direction of key metrics over the next 6–12 months based on current trajectory.

| Metric | 12-Month Trend | Acceleration | Forecast (if continued) |
|---|---|---|---|
| [key metric 1 — e.g., Total bookings] | [direction + %] | [accelerating/decelerating/stable] | [where this heads in 6–12 months] |
| [key metric 2 — e.g., Avg booking value] | | | |
| [key metric 3 — e.g., Amendment rate] | | | |
| [key metric 4 — e.g., Repeat customer rate] | | | |

**Inflection points to watch**: [Are there metrics approaching a threshold — e.g., a declining market approaching zero, an amendment rate so high it signals systemic product misalignment, or a growth market approaching capacity?]

---

## Data Quality & Gaps

Assess the quality and completeness of the data underlying this analysis. Be honest — the confidence rating in the frontmatter depends on this assessment.

| Data Area | Quality | Completeness | Gap Impact |
|---|---|---|---|
| Booking data | [GOOD/ADEQUATE/POOR] | [% completeness or "unknown"] | [what we can't answer without full data] |
| Amendment data | | | |
| Traffic/conversion data | | | |
| Customer profile data | | | |
| Revenue/pricing data | | | |

**Data quality ratings:**
- `GOOD` — data is complete, consistent, and trustworthy for analysis
- `ADEQUATE` — some gaps or inconsistencies but sufficient for directional conclusions
- `POOR` — significant gaps, inconsistencies, or suspected data quality issues; findings should be treated as indicative only

**Recommendations for data improvement**: [What should be tracked that currently isn't? What instrumentation, database fields, or collection processes would materially improve future analyses?]

---

## Report Frontmatter Checklist

Before saving the report, confirm:

- [ ] `focus` field accurately describes the query focus
- [ ] `period` field covers the full date range of the data analyzed
- [ ] `data_source` is set correctly: `mysql` (live queries), `manual` (user-provided exports), or `mixed`
- [ ] `confidence` reflects the data quality assessment above
- [ ] `initiative` is set to the relevant initiative slug or `standalone`
- [ ] `tags` include the destination(s), source market(s), and key themes (e.g., `egypt`, `germany`, `amendments`, `seasonality`)
- [ ] Any previous demand signal reports on the same focus are referenced in the body
- [ ] Memory pointer is updated after commit
