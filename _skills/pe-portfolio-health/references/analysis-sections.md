# Portfolio Health — Analysis Section Templates

All 7 analysis sections for the Portfolio Health report. Populate each table
with data extracted from the artifact repository. Use status codes and notes
from the source data. Where data is absent, record `⚫ No Data`.

---

## Section 1: Portfolio Health Heatmap

Create a health matrix across the two most strategic dimensions available.
Default: Destination × Source Market. Alternate: Product Line × Customer Segment.

**[Destination × Source Market] Heatmap:**

| | [Market 1] | [Market 2] | [Market 3] | [Market 4] | Destination Health |
|---|---|---|---|---|---|
| [Destination 1] | [score/status] | [score/status] | [score/status] | [score/status] | [aggregate] |
| [Destination 2] | | | | | |
| [Destination 3] | | | | | |
| **Market Health** | [aggregate] | [aggregate] | [aggregate] | [aggregate] | **[overall]** |

**Status codes**: 🟢 Strong | 🟡 Watch | 🔴 Attention | ⚫ No Data

Cell values should reference the composite score from the most recent active
`health-check` artifact for that product/market pair, or the `recommendation`
field from the relevant `market-assessment` artifact. If no artifact exists,
mark ⚫ No Data.

**Key readings from the heatmap (required sub-section):**

| Reading | Observation |
|---|---|
| Strongest cells | [where to double down — top 2–3 cells] |
| Weakest cells | [where to intervene or exit — bottom 2–3 cells] |
| No-data cells | [count and list — blind spots: risk or opportunity?] |
| Concentration patterns | [over-reliance on specific destinations or markets] |

---

## Section 2: Portfolio Composition Analysis

### Product Health Breakdown

| Metric | Value | Assessment |
|---|---|---|
| Total active products | [count] | |
| Products in STRONG health | [count / %] | |
| Products in STABLE / WATCH | [count / %] | |
| Products in CONCERNING / CRITICAL | [count / %] | |
| Products with no health data | [count / %] | [blind spot risk] |

Source: `artifacts/health-checks/` — count all files with `status: active`,
then group by `health_rating` field. Products with no `health-check` artifact
constitute the blind spot count.

### Revenue Concentration

| Top Products (by revenue) | Revenue Share | Health Status | Risk if Declines |
|---|---|---|---|
| [product 1] | [%] | [status] | [impact description] |
| [product 2] | | | |
| [product 3] | | | |
| [product 4] | | | |
| [product 5] | | | |
| **Top 5 total** | [?%] | | |

Revenue share data comes from `foundation/domains/06-product-structure.md`
and `artifacts/demand-signals/`. If exact revenue % is unavailable, use
booking volume as proxy and note it.

### Market Concentration

| Top Markets (by revenue) | Revenue Share | Trend | Risk |
|---|---|---|---|
| [market 1] | [%] | [↑/↓/→] | [dependency risk] |
| [market 2] | | | |
| [market 3] | | | |
| **Top 3 total** | [?%] | | |

Market data comes from `artifacts/demand-signals/` (`focus` field) and
`foundation/domains/04-source-markets.md`.

---

## Section 3: Trend Analysis

### Portfolio Volume Trends

| Dimension | 3-Month Trend | 6-Month Trend | 12-Month Trend | Assessment |
|---|---|---|---|---|
| Total bookings | [%] | [%] | [%] | [accelerating / stable / decelerating] |
| Total revenue | | | | |
| Average booking value | | | | |
| New market contribution | | | | |

Data source: `artifacts/demand-signals/` — compare `period` fields across
multiple reports. If only one demand signal report exists, note "single period
only — trend requires 2+ reports."

### Growth Drivers

What is pulling the portfolio upward?

| Growth Driver | Contribution | Sustainability |
|---|---|---|
| [driver 1] | [impact description] | [H/M/L — will this continue?] |
| [driver 2] | | |
| [driver 3] | | |

### Decline Drivers

What is pulling the portfolio downward?

| Decline Driver | Impact | Reversibility |
|---|---|---|
| [driver 1] | [impact description] | [H/M/L — can this be fixed?] |
| [driver 2] | | |

Growth and decline drivers come from `artifacts/health-checks/` body content,
`artifacts/gap-analyses/` (`fit_rating` field), and `artifacts/demand-signals/`.

---

## Section 4: Risk Assessment

See `references/risk-framework.md` for threshold definitions and scoring rules.

### Concentration Risk

| Risk Dimension | Measured Value | Threshold | Risk Level |
|---|---|---|---|
| Destination concentration (top 1–2 destinations % revenue) | [%] | >60% = HIGH | [HIGH/MED/LOW] |
| Market concentration (top 1–2 markets % revenue) | [%] | >50% = HIGH | [HIGH/MED/LOW] |
| Product concentration (top 5 products % revenue) | [%] | >70% = HIGH | [HIGH/MED/LOW] |
| Seasonal concentration (peak season % revenue) | [%] | >65% = HIGH | [HIGH/MED/LOW] |

### Competitive Risk

| Risk Area | Description | Source Artifact | Severity |
|---|---|---|---|
| Markets where competitors are gaining | [list] | [competitor profile file] | [H/M/L] |
| Undefended positions | [where we lack competitive response] | [competitor profile file] | [H/M/L] |
| Emerging competitors | [new entrants flagged] | [competitor profile file] | [H/M/L] |

Source: `artifacts/competitors/` — read all active competitor profiles and
check `positioning` and body content for threat signals.

### Lifecycle Risk

| Lifecycle Stage | Product Count | Revenue Share | Concern |
|---|---|---|---|
| Launch | [count] | [%] | [pipeline health — enough new products?] |
| Growth | [count] | [%] | [future revenue drivers] |
| Maturity | [count] | [%] | [stability — but also stagnation risk] |
| Decline | [count] | [%] | [sunset candidates — dragging the portfolio?] |

Lifecycle stage comes from `artifacts/health-checks/` body content and from
`foundation/domains/03-destination-portfolio.md` or
`foundation/domains/06-product-structure.md`.

---

## Section 5: Opportunity Assessment

### All Identified Opportunities

| Opportunity | Source Artifact | Potential Impact | Confidence | Status |
|---|---|---|---|---|
| [opportunity 1] | [initiative slug or artifact path] | [H/M/L] | [H/M/L] | [being pursued / not yet actioned / investigating] |
| [opportunity 2] | | | | |
| [opportunity 3] | | | | |

Source: `artifacts/gap-analyses/`, `artifacts/market-assessments/`
(`recommendation: ENTER` entries), `artifacts/decision-records/` body content,
and `artifacts/demand-signals/` body content. Surface every forward-looking
recommendation found across all artifacts.

### Untapped Opportunities (Not Yet Actioned)

Opportunities surfaced in past analyses that have no active initiative pursuing them.

| Opportunity | When Identified | Why Not Yet Actioned | Recommended Next Step |
|---|---|---|---|
| [opportunity] | [artifact date] | [known reason or unknown] | [specific action + skill to use] |

Cross-reference opportunity mentions in artifact bodies against
`initiatives/active/` to identify which have no corresponding initiative.

---

## Section 6: Priority Action List

Top 5 highest-ROI actions the Product Department can take right now, based on
all available intelligence. Each action must be mapped to a specific Product
Engine skill.

| Priority | Action | Type | Rationale | Expected Impact | Effort | Execute With |
|---|---|---|---|---|---|---|
| 1 | [specific action] | [Optimize / Enter / Reposition / Retire / Investigate] | [why #1] | [projected outcome] | [H/M/L] | [skill name] |
| 2 | | | | | | |
| 3 | | | | | | |
| 4 | | | | | | |
| 5 | | | | | | |

**Execute With** — map each action to the correct Product Engine skill:

| Action Type | Skill to Use |
|---|---|
| Product health investigation | `pe-health-check` |
| Market entry assessment | `pe-market-entry` |
| Product/audience fit | `pe-gap-analysis` |
| Demand signal analysis | `pe-demand-signals` |
| Competitor deep-dive | `pe-competitive-intelligence` |
| Cross-portfolio pattern mining | `pe-cross-market-intelligence` |
| Portfolio overview refresh | `pe-portfolio-health` |
| Persona development | `pe-persona-builder` |

---

## Section 7: Intelligence Gaps

What the system doesn't know that it should — ranked by strategic importance.

| Gap | Why It Matters | How to Fill | Priority |
|---|---|---|---|
| Products never assessed | Decisions made without health data | Run `pe-health-check` on each product | [H/M/L] |
| Markets never studied | Opportunities may exist undetected | Run `pe-market-entry` or `pe-demand-signals` | [H/M/L] |
| Stale intelligence (>90 days) | May no longer reflect current reality | Re-run the producing capability | [H/M/L] |
| Missing competitor profiles | Blind spots in competitive landscape | Run `pe-competitive-intelligence` | [H/M/L] |
| No persona cards for key segments | Audience understanding incomplete | Run `pe-persona-builder` | [H/M/L] |
| Unresolved gap analyses | Known fit issues left unaddressed | Run `pe-gap-analysis` follow-up | [H/M/L] |

**Staleness rule**: Any artifact whose `updated` (or `created`) date is more
than 90 days before today's date is considered potentially stale. Flag it in
this table and note what has likely changed in the interim.

### Gap Priority Matrix

| Priority | Gap Count | Recommended Response |
|---|---|---|
| HIGH | [count] | Address before next strategic planning session |
| MEDIUM | [count] | Schedule within next quarter |
| LOW | [count] | Track; address opportunistically |

---

## Trend Comparison (when prior reports exist)

When one or more prior `portfolio-health` reports exist in
`intelligence/portfolio-health/`, include this section.

| Metric | Previous Report ([date]) | Current Report | Change | Direction |
|---|---|---|---|---|
| Overall health rating | [STRONG/STABLE/CONCERNING/CRITICAL] | [current] | [delta] | [↑/↓/→] |
| Products in STRONG health | [count/%] | [current] | | |
| Products in CONCERNING/CRITICAL | [count/%] | [current] | | |
| Top risk | [prior] | [current] | | |
| Top opportunity | [prior] | [current] | | |
| Artifacts analyzed | [prior count] | [current count] | [+N new] | |

**Trend narrative**: In 2–4 sentences, describe the overall portfolio
trajectory. Is health improving, stable, or deteriorating? What has changed
since the last assessment?
