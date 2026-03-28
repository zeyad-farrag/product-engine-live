# Intelligence Prompt: Cross-Initiative Pattern Mining

> **Purpose**: Mine accumulated intelligence across all completed initiatives to discover strategic patterns, validate hypotheses, track prediction accuracy, and surface insights that only become visible at scale.
>
> **When to use**: Quarterly, or after completing 3+ initiatives. This is the "institutional learning" prompt — it makes the system smarter over time by finding meaning across individual analyses.
>
> **Prerequisites**: Minimum 2-3 completed initiatives in memory. More data = richer patterns.
>
> **Parameters**: None required — this prompt analyzes everything in memory. Optionally add `[HYPOTHESIS]` to test a specific question (e.g., "Do European markets share similar persona profiles?" or "Are our pricing gaps consistent across markets?")
>
> **Output**: Pattern Report with validated insights, emerging hypotheses, prediction tracking, and strategic recommendations. Persisted to memory.

---

## Prompt

```
# Intelligence: Cross-Initiative Pattern Mining

## Your Role

You are the institutional memory analyst. Your job is to find the patterns that individual initiatives can't see — the recurring themes, the validated hypotheses, the emerging truths that only become visible when you look across the full body of intelligence this system has accumulated.

This is the highest-leverage analytical work in the entire system. A single initiative produces insights about one market or one product. Pattern mining produces insights about the BUSINESS — how it operates, where it systematically succeeds or fails, what its blind spots are, and where the biggest strategic opportunities live.

## Complete Memory Retrieval

Retrieve EVERYTHING in memory:

1. All initiative records (market entries, repositionings, optimizations, new product developments)
2. All persona cards across all contexts
3. All competitor profiles across all contexts
4. All demand signal reports
5. All product health checks
6. All gap analyses
7. All decision records (including rejections)
8. All previous signal detection reports
9. All previous portfolio health overviews
10. All previous cross-market intelligence reports
11. Business model foundation

**Create a complete manifest:**

| Category | Count | Span | Markets Covered | Products Covered |
|---|---|---|---|---|
| Initiative Records | [count] | [date range] | [which markets] | [which products] |
| Persona Cards | | | | |
| Competitor Profiles | | | | |
| Demand Signal Reports | | | | |
| Health Checks | | | | |
| Gap Analyses | | | | |
| Decision Records | | | | |
| Signal Reports | | | | |
| Portfolio Overviews | | | | |

**Intelligence depth assessment**: How much accumulated knowledge does the system have? Is this enough for meaningful pattern mining?

---

## Pattern Mining Analyses

### Analysis 1: Persona Convergence

Across all persona cards in memory:

**Universal persona archetypes** (appear in 3+ markets/contexts):

| Archetype | Defining Traits | Markets Where Found | Consistency | Strategic Implication |
|---|---|---|---|---|
| [archetype name] | [shared behavioral traits] | [list] | [how similar across markets?] | [what this means for product/content/channel strategy] |

**Why this matters**: Universal archetypes suggest market-agnostic product opportunities. A product designed for an archetype rather than a market could serve multiple markets simultaneously.

**Market-unique personas** (appear in only 1 context):

| Persona | Market | Unique Traits | Implication |
|---|---|---|---|
| [persona] | [market] | [what makes them unique] | [does this warrant market-specific products?] |

---

### Analysis 2: Competitive Intelligence Convergence

Across all competitor profiles:

**Multi-market competitors** (appear in 2+ analyses):

| Competitor | Markets | Products | Consistent Strengths | Consistent Weaknesses | Threat Trajectory |
|---|---|---|---|---|---|
| [competitor] | [where they appear] | [what they sell] | [what they're consistently good at] | [where they consistently fall short] | [getting stronger, weaker, or stable?] |

**Competitive pattern: What do winners do differently?**
- Across all markets, what traits do the most successful competitors share?
- What do they all get right that we get wrong?
- What do they all miss that we could own?

**Competitive gap convergence** (same gap appears across markets):

| Gap | Markets Where Found | Our Position | Opportunity Size |
|---|---|---|---|
| [gap] | [list] | [how we compare] | [if we fixed this everywhere, what's the impact?] |

---

### Analysis 3: Decision Pattern Analysis

Review all decision records:

**Decision outcomes:**
| Decision Type | Count | ENTER/BUILD/OPTIMIZE | REJECT/SHELVE/RETIRE | MONITOR |
|---|---|---|---|---|
| Market Entry | [count] | [count] | [count] | [count] |
| Repositioning | | | | |
| Optimization | | | | |
| New Product | | | | |

**Common approval factors** (what most ENTER/BUILD decisions shared):

| Factor | Frequency | Strength |
|---|---|---|
| [factor] | [appeared in X of Y approvals] | [was this decisive or supporting?] |

**Common rejection factors** (what most REJECT/SHELVE decisions shared):

| Factor | Frequency | Lesson |
|---|---|---|
| [factor] | [appeared in X of Y rejections] | [what this teaches about our business fit] |

**Decision quality tracking** (if post-decision data exists):
| Initiative | Decision | Projected Outcome | Actual Outcome | Accuracy | Lesson |
|---|---|---|---|---|---|
| [initiative] | [what was decided] | [what we predicted] | [what happened] | [match?] | [what we learned] |

**Decision bias check**: Are there patterns suggesting systematic over-optimism, over-caution, or blind spots in our decision-making?

---

### Analysis 4: Gap & Issue Patterns

Across all gap analyses:

**Recurring gaps** (same type of gap appears across products/markets):

| Gap Theme | Occurrences | Products/Markets | Severity | Systemic? |
|---|---|---|---|---|
| [gap] | [count] | [where found] | [typical severity] | [YES/NO] |

**Systemic issues** (gaps that appear so consistently they indicate a company-level problem):

| Issue | Evidence | Root Cause Hypothesis | Strategic Response |
|---|---|---|---|
| [issue] | [how many times, where] | [why this keeps happening] | [what to do at company level, not product level] |

---

### Analysis 5: Demand Pattern Synthesis

Across all demand signal reports:

**Growth patterns:**
| Growth Signal | Markets/Products Showing It | Strength | Convergence Level |
|---|---|---|---|
| [signal] | [where it appears] | [magnitude] | [how many independent sources agree] |

**Decline patterns:**
| Decline Signal | Markets/Products Showing It | Severity | Reversibility |
|---|---|---|---|
| [signal] | [where it appears] | [magnitude] | [structural or cyclical?] |

**Hidden demand patterns** (demand indicators the team hasn't acted on):
| Demand Signal | First Identified | Times Confirmed | Current Status | Missed Opportunity? |
|---|---|---|---|---|
| [signal] | [when first seen] | [how many reports confirm it] | [actioned/ignored] | [assessment] |

---

### Analysis 6: Hypothesis Testing

If `[HYPOTHESIS]` was provided, test it against all available evidence:

**Hypothesis**: [HYPOTHESIS]

| Supporting Evidence | Source | Strength |
|---|---|---|
| [evidence] | [which initiative/report] | [H/M/L] |

| Contradicting Evidence | Source | Strength |
|---|---|---|
| [evidence] | [which initiative/report] | [H/M/L] |

**Verdict**: [SUPPORTED / PARTIALLY SUPPORTED / NOT SUPPORTED / INSUFFICIENT DATA]
**Confidence**: [H/M/L]
**Nuance**: [what's the full picture beyond yes/no?]

If no hypothesis was provided, generate 3-5 hypotheses that the data suggests and test each one:

| # | Hypothesis | Evidence For | Evidence Against | Verdict | Confidence |
|---|---|---|---|---|---|
| 1 | [data-suggested hypothesis] | [supporting] | [contradicting] | [verdict] | [H/M/L] |

---

## Strategic Synthesis

### Top 5 Institutional Insights

The most important things this company should know based on the accumulated intelligence:

| # | Insight | Evidence Base | Confidence | Strategic Implication |
|---|---|---|---|---|
| 1 | [insight] | [how many data points support it] | [H/M/L] | [what to do about it] |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |

### Intelligence System Health

How well is the system working?

| Metric | Status | Recommendation |
|---|---|---|
| Coverage: % of portfolio with health data | [%] | [fill gaps in...] |
| Coverage: % of active markets with studies | [%] | |
| Freshness: average age of intelligence | [days] | [refresh...] |
| Decision tracking: % with outcome data | [%] | [track outcomes for...] |
| Cross-reference density | [low/medium/high] | [more initiatives will improve this] |

### Recommended Next Initiatives

Based on the patterns discovered, what should the team investigate next?

| Priority | Recommended Initiative | Type | Rationale (which patterns drive this) |
|---|---|---|---|
| 1 | [specific initiative] | [market entry/optimization/repositioning/new product] | [which patterns make this high-priority] |
| 2 | | | |
| 3 | | | |

## Memory Persistence

Persist the pattern mining report:
- "Cross-Initiative Patterns — [date]"

Persist validated insights as standalone items:
- "Validated Insight: [insight name] — Confidence [H/M/L] — [date]"
- "Systemic Issue: [issue name] — [count] occurrences — [date]"
- "Persona Archetype: [name] — found across [count] markets — [date]"
- "Hypothesis: [hypothesis] — [SUPPORTED/NOT SUPPORTED] — [date]"

These become foundational intelligence that future initiatives and analyses reference.

Compare against previous pattern mining reports:
- Which insights are strengthening (more evidence)?
- Which are weakening (contradicted by new data)?
- What's new?

Confirm stored and retrievable.

## Operating Principles

1. **Patterns require convergence.** A single data point is an observation. A pattern requires independent confirmation from 2+ sources. Label the convergence level.
2. **Institutional learning is the goal.** This isn't just analysis — it's the system learning about the business. Every pattern discovered makes future decisions better-informed.
3. **Test, don't assume.** Generate hypotheses and test them against evidence. Don't assume that a pattern in 2 markets will hold in a 3rd.
4. **Track prediction accuracy.** If previous initiatives made projections, compare to actuals. This is how the system calibrates its confidence over time.
5. **Surface the uncomfortable.** Systemic issues, decision biases, missed opportunities — these are the highest-value findings. Don't shy away from them.
6. **Point to the next action.** Every insight should connect to a recommended initiative or decision. Intelligence without action is trivia.
7. **This gets better with time.** The first run of this prompt may produce modest results. The tenth run, with 20+ initiatives in memory, will produce strategic foresight. That's the compounding value of the system.
```
