# Portfolio Health — Risk Framework

Definitions, thresholds, and scoring rules for all three risk dimensions
assessed in Section 4 of the Portfolio Health report.

---

## 1. Concentration Risk

Concentration risk measures over-dependence on a narrow slice of the
portfolio. It is the #1 hidden risk in most product portfolios because it
looks like strength until a single disruption reveals fragility.

### Destination Concentration

**Definition**: The percentage of total revenue (or bookings if revenue is
unavailable) attributable to the top 1–2 destination products.

| Level | Threshold | Meaning |
|---|---|---|
| LOW | < 40% from top 2 destinations | Healthy diversification |
| MEDIUM | 40–60% from top 2 destinations | Manageable — monitor and diversify |
| HIGH | > 60% from top 2 destinations | Over-indexed — single event can crater revenue |
| CRITICAL | > 75% from a single destination | Existential dependence — immediate diversification needed |

**Assessment note**: High destination concentration is especially dangerous
when the top destination faces geopolitical instability, seasonality shifts,
or new competitor entry. Always cross-reference with the `competitive-risk`
findings for those same destinations.

### Market Concentration

**Definition**: The percentage of total revenue from the top 1–2 source markets
(countries/regions that send customers).

| Level | Threshold | Meaning |
|---|---|---|
| LOW | < 35% from top 2 markets | Healthy — external shocks are absorbed |
| MEDIUM | 35–50% from top 2 markets | Acceptable — watch for policy/FX/travel sentiment shifts |
| HIGH | > 50% from top 2 markets | Vulnerable — one market slowdown = portfolio decline |
| CRITICAL | > 65% from a single market | Extremely fragile — currency or geopolitical event = crisis |

**Assessment note**: Market concentration risk compounds with destination
concentration. If the top market primarily buys the top destination, the
portfolio is doubly exposed.

### Product Concentration

**Definition**: The percentage of total revenue from the top 5 individual
products (SKUs, tours, packages).

| Level | Threshold | Meaning |
|---|---|---|
| LOW | < 50% from top 5 products | Well-distributed — pipeline is healthy |
| MEDIUM | 50–70% from top 5 products | Watch — new product development needed |
| HIGH | > 70% from top 5 products | Exposed — few products must continuously perform |
| CRITICAL | > 85% from top 5 products | Single product failure = major revenue event |

**Assessment note**: Product concentration is often masked by revenue growth.
Even a growing portfolio can be critically concentrated if one product drives
all of the growth.

### Seasonal Concentration

**Definition**: The percentage of annual revenue booked during the peak season
(typically Q3 or the 3-month peak window).

| Level | Threshold | Meaning |
|---|---|---|
| LOW | < 45% in peak season | Year-round business — resilient to seasonal shifts |
| MEDIUM | 45–65% in peak season | Typical for travel — manageable with advance planning |
| HIGH | > 65% in peak season | Over-reliant on peak — operational strain + off-season gaps |
| CRITICAL | > 80% in peak season | Near-total seasonality — vulnerable to peak disruptions |

**Assessment note**: Seasonal concentration interacts with all other risks.
A disruption during peak season for a seasonally concentrated portfolio is
disproportionately damaging.

---

## 2. Competitive Risk

Competitive risk measures how exposed the portfolio is to known competitor
threats. Sources: all active `artifacts/competitors/` profiles.

### Risk Dimensions

#### Markets Where Competitors Are Gaining

Read each active competitor profile for evidence of:
- Market share gains in specific geographies or segments
- New product launches targeting your current customers
- Aggressive pricing or distribution expansion

**Risk levels:**

| Level | Definition |
|---|---|
| LOW | Competitors stable; no significant gains observed in any active profiles |
| MEDIUM | 1–2 competitors making gains in non-core markets or segments |
| HIGH | Competitor gaining in a core market or directly displacing top-revenue products |
| CRITICAL | Multiple competitors converging on the same core segment/destination |

#### Undefended Positions

An undefended position is a market, segment, or destination where:
1. A competitor threat has been documented in an artifact, AND
2. No corresponding initiative (`initiatives/active/`) exists to respond.

**Identification method**: For every threat flagged in competitor profiles,
check `initiatives/active/` for a matching defensive initiative. Gaps =
undefended positions.

| Risk Level | Condition |
|---|---|
| LOW | All documented threats have active defensive initiatives |
| MEDIUM | 1–2 threats have no active response but are low-impact |
| HIGH | 1+ high-impact threats have no defensive initiative |
| CRITICAL | Core products face documented threats with no active response |

#### Emerging Competitors

New entrants flagged in competitor profiles or demand signal reports within
the last 90 days. These are higher risk because they are less understood.

**Flag as HIGH risk** if a new entrant operates in the same destination +
market combination as any product in the top-5 revenue list.

---

## 3. Lifecycle Risk

Lifecycle risk measures portfolio balance across product lifecycle stages.
A healthy portfolio has products across all four stages. Imbalance signals
future revenue risk.

### Lifecycle Stage Definitions

| Stage | Definition | Typical Signals in Artifacts |
|---|---|---|
| **Launch** | Product live < 12 months or in ramp phase | `health-check` composite score < 40; `status: active` in recent initiative |
| **Growth** | Booking/revenue trend consistently positive | Demand signals showing ↑ trend; health score 60–80; no major fit issues |
| **Maturity** | Stable bookings, established margins, predictable | Health score 65–85; no growth signal; demand signals showing → trend |
| **Decline** | Declining bookings or revenue; fit issues emerging | Health score dropping; gap analyses flagging `REPOSITIONING_NEEDED` or worse; demand signals showing ↓ |

### Portfolio Balance Benchmarks

| Scenario | Assessment | Risk |
|---|---|---|
| All products in Maturity/Decline | Aging portfolio — revenue at risk within 2–3 years | HIGH |
| No products in Launch | No pipeline — growth will stall when mature products decline | HIGH |
| Heavy Launch concentration | Execution risk — unproven revenue | MEDIUM |
| Balanced across all stages | Healthy portfolio rhythm | LOW |

### Lifecycle Risk Signal: "Decline Drag"

When **Decline** products represent > 20% of revenue share, they are
actively suppressing portfolio-level margin and potentially distracting
resources from higher-potential products. Flag as **CONCERNING** or **CRITICAL**
depending on trajectory.

---

## 4. Overall Portfolio Health Rating

Synthesize all risk findings into a single overall health rating.

| Rating | Definition |
|---|---|
| **STRONG** | Portfolio diversified, competitive position solid, lifecycle balanced, no HIGH/CRITICAL concentration risks |
| **STABLE** | Minor risks present but contained; at least one MEDIUM concentration or competitive risk; trajectory positive |
| **CONCERNING** | One or more HIGH risks identified in any category; trajectory unclear or slightly negative |
| **CRITICAL** | CRITICAL concentration risk OR multiple HIGH risks converging OR significant undefended competitive position in core products |

**Decision rule**: The overall rating is set by the **worst** single risk
finding. One CRITICAL finding = overall CRITICAL. Two HIGH findings = overall
CONCERNING minimum.

---

## 5. Risk Change Tracking (Trend)

When a prior portfolio health report exists, compare risk levels across
all dimensions and note direction:

| Risk Dimension | Previous Level | Current Level | Change |
|---|---|---|---|
| Destination concentration | | | [Improved / Stable / Worsened] |
| Market concentration | | | |
| Product concentration | | | |
| Seasonal concentration | | | |
| Competitive — markets gaining | | | |
| Competitive — undefended positions | | | |
| Lifecycle balance | | | |

**Worsening trend** in any MEDIUM or HIGH risk is a red flag regardless of
absolute level — flag it explicitly in the Risk Assessment section.
