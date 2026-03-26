# Analysis Frameworks — Cross-Market Intelligence

All five analysis frameworks with full table templates. Load this file during
Phase 2 execution. Run each analysis that is supported by available data —
skip frameworks where fewer than 2 data points exist and note the gap.

---

## Analysis 1: Persona Pattern Recognition

Compare persona cards across markets and contexts. Key frontmatter fields to
extract: `market`, `segment`, `destinations`, `tags`.

### Trait Comparison Table

| Persona Trait | [Market / Context 1] | [Market / Context 2] | [Market / Context 3] | Pattern? |
|---|---|---|---|---|
| Travel motivation | [persona names + motivations] | | | [recurring / unique] |
| Price sensitivity | | | | |
| Booking behavior | | | | |
| Channel preference | | | | |
| Product expectations | | | | |
| Deal-breakers | | | | |
| Preferred destinations | | | | |
| Group composition | | | | |

### Universal Persona Archetypes

Archetypes are persona types that recur across 2+ markets with shared
characteristics. These represent universal customer profiles that should
inform platform-level product and content strategy.

| Archetype | Description | Markets Where Found | Confidence | Implications |
|---|---|---|---|---|
| [archetype name] | [shared characteristics — motivation, behavior, expectations] | [which markets] | [STRONG / MODERATE] | [what this means for product / content strategy] |

**Identifying archetypes**: Look for personas where `tags` overlap significantly
across different `market` values. Shared tags like `luxury`, `family-travel`,
`adventure`, `cultural` across markets signal a cross-market archetype.

### Market-Specific Personas

Personas that appear in only one market and have no equivalent elsewhere.

| Market-Specific Persona | Market | What Makes Them Unique | Opportunity / Risk |
|---|---|---|---|
| [persona] | [market] | [distinctive traits not found in other markets] | [strategic implication — localized product need or market risk] |

### Persona Analysis Summary

- **Universal archetypes found**: [count and names]
- **Market-specific personas**: [count and markets]
- **Coverage gaps**: [markets with no persona cards — flag as intelligence gap]
- **Key pattern**: [one-sentence summary of the most important persona finding]

---

## Analysis 2: Competitor Landscape Mapping

Map all competitor profiles across contexts. Key frontmatter fields: `market`,
`destinations`, `positioning`, `tags`.

### Full Competitor Map

| Competitor | Markets Active In | Destinations Served | Positioning | Threat Level |
|---|---|---|---|---|
| [competitor 1] | [list of markets from `market` field] | [product types] | [positioning summary] | [HIGH / MED / LOW] |
| [competitor 2] | | | | |

### Multi-Market Competitors

Competitors appearing in 2+ markets. These represent the most significant
strategic threats — they are building cross-market scale and brand recognition.

| Competitor | Markets | Consistent Positioning? | Strength Across Markets | Our Vulnerability |
|---|---|---|---|---|
| [competitor] | [which markets] | [yes — how it's consistent / no — how it varies] | [strong everywhere / patchy / market-specific strength] | [where they beat us] |

**Priority rule**: A competitor appearing in 3+ markets with consistent
positioning is a CRITICAL strategic threat regardless of individual market
threat level.

### Competitive Gap Convergence

Gaps in competitor offerings that appear across multiple markets. When the
same gap appears across markets, it is a platform-level opportunity — not a
market-specific advantage.

| Gap | Markets Where Found | Severity | Strategic Opportunity |
|---|---|---|---|
| [gap description] | [list of markets] | [consistent / varies by market] | [platform-level opportunity if 2+ markets; define what product or positioning would capture it] |

### Competitor Analysis Summary

- **Total competitors profiled**: [count] across [count] markets
- **Multi-market competitors**: [count] — names
- **Platform-level competitive gaps**: [count]
- **Key pattern**: [one-sentence summary of the most important competitive finding]

---

## Analysis 3: Demand Signal Convergence

Compare demand patterns across markets and products. Key frontmatter fields:
`focus`, `period`, `data_source`, `tags`.

### Signal Comparison Table

| Signal | [Market / Product 1] | [Market / Product 2] | [Market / Product 3] | Convergence |
|---|---|---|---|---|
| Growth trajectory | [trend — growing / flat / declining] | | | [aligned / divergent] |
| Seasonal patterns | [peak periods] | | | [similar / different] |
| Popular products | [top products] | | | [overlap?] |
| Amendment patterns | [top amendment types] | | | [recurring?] |
| Booking lead time | [avg lead time] | | | [similar?] |
| Price point demand | [price brackets] | | | [converging?] |
| Channel demand | [booking channels] | | | [consistent?] |

### Converging Signals

A convergence signal is a pattern where 2+ independent markets or products
show the same demand behavior.

| Converging Signal | Markets / Products | Strength | Strategic Implication |
|---|---|---|---|
| [signal description] | [which markets agree] | [STRONG = 3+ markets / MODERATE = 2 markets] | [what the business should do — product, pricing, inventory, or marketing action] |

### Diverging Signals

Divergence is also a finding. Where markets differ, localization or
market-specific strategy is required.

| Diverging Signal | Market A Behavior | Market B Behavior | Implication |
|---|---|---|---|
| [signal] | [behavior in market A] | [behavior in market B] | [why this matters — market-specific product or pricing required] |

### Demand Analysis Summary

- **Periods covered**: [date range across all signal reports]
- **Data quality**: [mysql / manual / mixed — note reliability differences]
- **Converging signals**: [count] — names
- **Diverging signals**: [count] — names
- **Key pattern**: [one-sentence summary of the most important demand finding]

---

## Analysis 4: Gap & Issue Patterns

Identify gaps that recur across multiple products or markets. Key frontmatter
fields: `product`, `fit_rating`, `target_audience`, `tags`.

### Gap Theme Matrix

| Gap Theme | Products / Contexts Where Found | Severity (consistent?) | Systemic? |
|---|---|---|---|
| [gap theme] | [list of products or analyses] | [consistent severity / varies] | [YES — platform issue / NO — product-specific] |

**Identifying gap themes**: Look for shared `tags` across gap analyses. Gaps
tagged identically across multiple products signal a systemic issue.

### Systemic Issues

Gaps appearing across multiple products indicate a company-level problem —
not a product-level one. These require strategic attention, not
product-by-product fixes.

| Systemic Issue | Products Affected | Count | Root Cause Hypothesis | Recommended Strategic Response |
|---|---|---|---|---|
| [issue] | [list of products] | [count] | [why this might be company-wide] | [strategic fix — policy, platform, capability, or investment] |

### Fit Rating Distribution

| Fit Rating | Count | Products |
|---|---|---|
| STRONG_FIT | | |
| FIXABLE_FIT | | |
| REPOSITIONING_NEEDED | | |
| REDESIGN_NEEDED | | |
| FUNDAMENTAL_MISMATCH | | |

A portfolio skewed toward REDESIGN_NEEDED or FUNDAMENTAL_MISMATCH indicates
a systemic product-market fit issue requiring portfolio-level strategy.

### Gap Analysis Summary

- **Total gap analyses reviewed**: [count]
- **Systemic issues identified**: [count]
- **Products with CRITICAL gaps**: [count]
- **Key pattern**: [one-sentence summary of the most important gap finding]

---

## Analysis 5: Decision Pattern Analysis

Review all decision records across initiatives. Key frontmatter fields:
`decision`, `initiative_type`, `subject`, `tags`.

### Decision Record Table

| Initiative | Type | Subject | Decision | Key Factor | Outcome (if tracked) |
|---|---|---|---|---|---|
| [initiative 1] | [market-entry / repositioning / etc.] | [what was decided about] | [ENTER / REJECT / OPTIMIZE / etc.] | [primary deciding factor] | [results if known] |
| [initiative 2] | | | | | |

### Decision Pattern Analysis

| Pattern | Evidence | Frequency | Risk / Bias to Check |
|---|---|---|---|
| Recurring approval factor | [what consistently drives positive decisions] | [count / percent] | [is this factor reliable or is there confirmation bias?] |
| Recurring rejection factor | [what consistently kills initiatives] | [count / percent] | [are we too conservative here?] |
| Decision reversals | [any decisions later re-evaluated] | [count] | [what triggered the reversal — are triggers consistent?] |

### Decision Bias Assessment

Answer these questions:
- **Are ENTER decisions concentrated in specific market types?** If so, may
  indicate risk appetite bias toward familiar markets.
- **Are REJECT decisions based on data or assumptions?** Low-confidence
  rejections may be leaving opportunity on the table.
- **Is there a recency bias?** Do recent initiatives show different decision
  patterns than earlier ones?

### Decision Analysis Summary

- **Total decision records reviewed**: [count]
- **Decision breakdown**: [ENTER: N, REJECT: N, OPTIMIZE: N, etc.]
- **Identified biases**: [yes / no — describe if yes]
- **Key pattern**: [one-sentence summary of the most important decision finding]
