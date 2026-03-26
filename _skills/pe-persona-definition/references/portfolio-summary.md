# Persona Portfolio Summary Template

After all persona cards for a given context are defined, produce the Portfolio Summary. This can be appended to the final persona card file or saved as a separate file (e.g., `artifacts/personas/[context]-portfolio-summary.md`).

---

## Persona Comparison Matrix

| Dimension | [Persona 1] | [Persona 2] | [Persona 3] | [Persona 4] |
|---|---|---|---|---|
| Primary motivation | | | | |
| Budget range | | | | |
| Preferred booking channel | | | | |
| Trip duration | | | | |
| Brand/tier fit | | | | |
| Market size (relative) | | | | |
| Servability (current) | | | | |
| Priority for business | | | | |

---

## Strategic Recommendations

- **Primary target persona**: [which persona to prioritize and why]
- **Growth persona**: [which persona represents the biggest growth opportunity]
- **Underserved persona**: [which persona has the weakest current offering — product gap signal]
- **Avoid persona**: [which persona, if any, is not viable for us to serve — and why]

---

## Cross-Reference Check

Answer each of the following:

1. Do any of these personas match archetypes from other markets or initiatives already stored in `artifacts/personas/`?
2. Are there universal persona patterns emerging across contexts (e.g., "The Cultural Purist" appearing in German, French, and UK markets)?
3. If yes, note the cross-market pattern explicitly — this is high-value intelligence for product positioning and brand strategy.

Template for cross-reference note:
```
Cross-Market Pattern Detected:
  Pattern name:     [e.g., "The Independent Researcher"]
  Appears in:       [list of markets/contexts]
  Common traits:    [shared decision-making characteristics]
  Strategic signal: [what this means for product or brand strategy]
```

---

## Portfolio Summary Frontmatter (if saved as separate file)

```yaml
---
type: persona-card
name: [Context] Persona Portfolio Summary
market: [source market or "multi-market"]
segment: portfolio-summary
destinations: [list]
created: YYYY-MM-DD
updated: YYYY-MM-DD
confidence: HIGH | MEDIUM | LOW
status: active
initiative: [producing initiative slug or "standalone"]
tags: [searchable tags]
---
```
