# Query Patterns Reference

Detailed pattern matching, synthesis templates, and dependency mapping logic for pe-memory-query.

---

## Query Dimension Extraction

### Market Extraction
Match source market references (case-insensitive):

| User Says | Extracted Market |
|---|---|
| "Germany", "German", "Germans" | Germany |
| "Australia", "Australian" | Australia |
| "United Kingdom", "UK", "British" | UK |
| "France", "French" | France |
| "United States", "US", "American" | United States |

Check against the `Markets` column in index rows.

### Destination Extraction
Match destination/product market references:

| User Says | Extracted Destination |
|---|---|
| "Egypt", "Egyptian" | Egypt |
| "Jordan", "Jordanian" | Jordan |
| "Morocco", "Moroccan" | Morocco |

Check against the `Destinations` column in index rows.

### Artifact Type Extraction
Map natural language to index file names:

| User Says | Index File |
|---|---|
| "personas", "person", "traveler profiles", "customer segments" | personas |
| "competitors", "competition", "rival", "market players" | competitors |
| "demand signals", "demand", "trends", "market demand" | demand-signals |
| "health check", "product health", "health score" | health-checks |
| "gap analysis", "gaps", "fit assessment" | gap-analyses |
| "market assessment", "market report", "market overview" | market-assessments |
| "decision records", "decisions", "ADR" | decision-records |
| "initiatives", "initiative", "program", "project" | initiatives |
| "intelligence reports", "reports", "analysis reports" | intelligence-reports |
| "foundation", "domain", "context", "background" | foundation |

If no artifact type is specified, query ALL index files.

### Date Range Extraction

| User Says | Filter Logic |
|---|---|
| "last 3 months" | Updated >= today - 90 days |
| "last 6 months" | Updated >= today - 180 days |
| "since January" | Updated >= [current year]-01-01 |
| "recent", "latest" | Updated >= today - 30 days |
| "this year" | Updated >= [current year]-01-01 |
| "stale", "old" | Updated < today - 90 days |

### Confidence Extraction

| User Says | Filter |
|---|---|
| "high confidence", "confident", "reliable" | Confidence = HIGH |
| "medium confidence" | Confidence = MEDIUM |
| "low confidence", "uncertain" | Confidence = LOW |
| (not specified) | all confidence levels |

### Initiative / Session Extraction
If user references an initiative by name or slug (e.g., "from the Germany market entry", "market-entry-germany"), match against the `Session` column.

---

## Synthesis Templates

### Market-Focused Query
**Example**: "What do we know about Germany?"

Organize synthesis around:
1. **Who are the German travelers?** → personas section
2. **What are German travelers demanding?** → demand signals section
3. **Which products do we have for Germany?** → health checks, gap analyses
4. **Who are we competing against in Germany?** → competitors section
5. **What decisions have we made for Germany?** → decision records, initiatives
6. **What's our strategic assessment?** → market assessments

Lead the Intelligence Summary with: "Our Germany intelligence covers [N] artifacts across [X] types, spanning [date range]. The strongest coverage is in [types with most artifacts]."

### Product-Focused Query
**Example**: "What do we know about Nile Cruises?" / "Brief me on the Egypt Classic product"

Organize synthesis around:
1. **Who buys this product?** → relevant personas (filter by destination)
2. **How healthy is this product?** → health checks
3. **Where are the product gaps?** → gap analyses
4. **Who are our competitors on this product?** → competitors
5. **What demand exists for this product?** → demand signals
6. **What have we decided about this product?** → decision records

Lead the Intelligence Summary with: "Our intelligence on [product] covers [N] artifacts. Product health is [HIGH/MEDIUM/LOW] based on [health check summary]."

### Competitor-Focused Query
**Example**: "What do we know about Intrepid Travel?"

Organize synthesis around:
1. **Competitor profile** → competitors (primary)
2. **How do they compare to our products?** → gap analyses that reference this competitor
3. **What decisions did we make based on this intel?** → decision records with this competitor in depends_on
4. **Are there patterns across competitors?** → intelligence reports (cross-initiative-patterns type)

Lead the Intelligence Summary with: "We have [N] artifacts covering [Competitor]. Profile confidence is [level] based on [source quality]."

### Initiative-Focused Query
**Example**: "What came out of the Germany market entry initiative?"

Organize synthesis around:
1. **Initiative record** → initiatives index
2. **Artifacts produced** → all artifact types filtered by Session=[initiative slug]
3. **Decisions made** → decision records from this initiative
4. **What's still valid?** → staleness check on all produced artifacts
5. **What was built on top?** → artifacts in OTHER sessions whose depends_on points to this initiative's artifacts

Lead the Intelligence Summary with: "The [initiative] initiative produced [N] artifacts across [X] types. [Y] are still current, [Z] are stale."

---

## Contradiction Handling

When two artifacts covering the same subject disagree:

**Scenario 1: Different confidence levels**
> "Two health checks exist for the Egypt Classic product: `artifacts/health-checks/egypt-classic-2026-01.md` (Score: 72, MEDIUM confidence) and `artifacts/health-checks/egypt-classic-2026-03.md` (Score: 68, HIGH confidence). The more recent HIGH-confidence assessment supersedes the older one."

**Scenario 2: Different markets leading to different conclusions**
> "Persona data shows German travelers prioritize cultural immersion (`artifacts/personas/german-leisure-traveler.md`), while Australian persona data shows adventure preference (`artifacts/personas/australian-adventure-traveler.md`). These are consistent — different source markets, different archetypes."

**Scenario 3: Genuine contradiction (same subject, same market, conflicting findings)**
> "⚠️ Contradiction detected: `artifacts/demand-signals/germany-egypt-2025-Q4.md` shows declining demand, while `artifacts/market-assessments/germany-2026-02.md` shows growth potential. These may reflect different time windows or methodologies. Flag for review — consider running pe-demand-signal-mining to get current data."

---

## Dependency Mapping Logic

### Building the Dependency Map

For each artifact in the result set that has a non-empty `Depends On` column:

1. List the artifact path
2. List each dependency path from the `Depends On` column
3. Check if each dependency is also in the result set (or fetch its index metadata)
4. For each dependency, compare its `Updated` date against the dependent artifact's `Updated` date:
   - If dependency `Updated` > dependent `Updated` → **dependency-stale** (⚠)
   - If dependency `Updated` <= dependent `Updated` → **current** (✓)
   - If dependency not found in index → **missing** (✗)

### Staleness Labels

```
✓ current     — dependency updated before or same day as this artifact
⚠ stale       — dependency was updated AFTER this artifact was created/updated
✗ missing     — dependency path not found in any index (deleted or moved)
⏰ time-stale — this artifact itself is > 90 days old (regardless of dependencies)
```

### Cascading Staleness

If a foundational artifact (e.g., a persona card) is stale, surface all downstream artifacts that depend on it:

> "**Cascading staleness alert**: `artifacts/personas/german-leisure-traveler.md` is 94 days old. The following artifacts were built from it and may need re-evaluation:
> - `artifacts/gap-analyses/germany-nile-cruise.md` (depends on this persona)
> - `artifacts/decision-records/germany-market-entry-decision.md` (depends on this persona)"

---

## Answer Template (Compact Version for ≥ 20 matches)

When 20+ artifacts match, use this abbreviated format and ask for drill-down:

```markdown
## Intelligence Overview: [Subject]

**[N] artifacts found** across [X] types, spanning [date range].

| Type | Count | Freshness | Confidence |
|---|---|---|---|
| Personas | [n] | [newest date] | [avg level] |
| Competitors | [n] | [newest date] | [avg level] |
| Demand Signals | [n] | [newest date] | [avg level] |
| Health Checks | [n] | [newest date] | [avg level] |
| Gap Analyses | [n] | [newest date] | [avg level] |
| Market Assessments | [n] | [newest date] | [avg level] |
| Decision Records | [n] | [newest date] | [avg level] |

**Coverage gaps**: [types with 0 matches]

Which type would you like me to deep-dive into full artifact content?
```

---

## Gap-to-Skill Mapping

| Missing Artifact Type | Recommended Skill |
|---|---|
| Personas | `pe-persona-definition` |
| Competitor profiles | `pe-competitor-benchmarking` |
| Demand signals | `pe-demand-signal-mining` |
| Health checks | `pe-product-health-check` |
| Gap analyses | `pe-gap-analysis` |
| Market assessments | `pe-market-entry` |
| Decision records | No skill — decisions are logged manually or via initiative close-out |
| Index files missing entirely | `pe-memory-maintenance` (rebuild index) |

Always phrase gap suggestions as actionable offers:
> "No persona data found for Australia. Would you like me to run pe-persona-definition for the Australian market?"
