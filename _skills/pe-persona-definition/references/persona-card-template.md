# Persona Card Template

Use this template for every persona produced by the pe-persona-definition skill. Each card is written to the GitHub repo at `artifacts/personas/[kebab-case-name].md` with the YAML frontmatter block below.

---

## YAML Frontmatter (required for every card written to repo)

```yaml
---
type: persona-card
name: [persona name]
market: [source market]
segment: [customer segment]
destinations: [list]
created: YYYY-MM-DD
updated: YYYY-MM-DD
confidence: HIGH | MEDIUM | LOW
status: active
initiative: [producing initiative slug or "standalone"]
tags: [searchable tags]
---
```

---

## Card Body

```
═══════════════════════════════════════════════════
PERSONA CARD: [PERSONA NAME]
Context: [CONTEXT]
Date Created: [date]
Confidence: [HIGH/MEDIUM/LOW]
═══════════════════════════════════════════════════

IDENTITY
─────────────────────────────────────────────────
Demographics:     [age range, income level, family status, location]
Traveler type:    [e.g., luxury seeker, cultural explorer, adventure enthusiast,
                   family planner, deal hunter]
Travel frequency: [how often they travel internationally, to this type of destination]

MOTIVATIONS & NEEDS
─────────────────────────────────────────────────
Primary motivation:    [the #1 reason they travel to these destinations]
Secondary motivations: [other factors]
Emotional drivers:     [what feeling are they seeking? Status, discovery,
                        relaxation, connection, achievement?]
Unmet needs:           [what current market offerings fail to deliver for them]

DECISION JOURNEY
─────────────────────────────────────────────────
Trigger:          [what initiates their travel planning?]
Research phase:   [where do they look? How long? What info matters?]
Comparison:       [how do they compare options? Price-first? Experience-first?]
Decision factors: [ranked — what matters most to least?]
Booking channel:  [where do they actually transact?]
Lead time:        [how far in advance do they book?]

PRODUCT EXPECTATIONS
─────────────────────────────────────────────────
Accommodation:  [level/type expected]
Activities:     [what they want to do and experience]
Duration:       [preferred trip length]
Group model:    [private, small group, large group, self-guided?]
Service level:  [hands-off, guided, concierge?]
Must-haves:     [non-negotiable elements]
Deal-breakers:  [what would make them NOT book]

PRICE & VALUE
─────────────────────────────────────────────────
Budget range:            [per person, for this type of trip]
Value perception:        [what does "good value" mean to them? Cheapest?
                          Best experience per dollar? All-inclusive?]
Price anchor:            [what do they compare prices against? Competitors?
                          Other vacation types? DIY cost?]
Willingness to upgrade:  [for what?]

CONTENT & CHANNEL
─────────────────────────────────────────────────
Content preferences:  [video, blogs, reviews, social proof, itinerary detail?]
Trusted sources:      [travel publications, influencers, friends, review sites?]
Social platforms:     [where they're active and receptive]
Language:             [primary language, secondary if relevant]
Tone that resonates:  [inspirational, practical, luxury, adventurous, reassuring?]

BRAND & TIER FIT
─────────────────────────────────────────────────
Best-fit brand:   [which company brand]
Best-fit tier:    [which segment/tier]
Fit assessment:   [how well does our current offering serve this persona?
                   STRONG / MODERATE / WEAK / NONE]
Gap if WEAK/NONE: [what's missing?]

EVIDENCE BASIS
─────────────────────────────────────────────────
Internal data support:  [which data points informed this persona]
External research:      [which sources informed this persona]
Confidence level:       [HIGH = strong data support / MEDIUM = mixed data +
                         research / LOW = primarily research-inferred]
Validation needed:      [what would increase confidence?]
═══════════════════════════════════════════════════
```

---

## File Naming Convention

Filename: `artifacts/personas/[kebab-case-persona-name].md`

Examples:
- `artifacts/personas/german-leisure-traveler.md`
- `artifacts/personas/uk-luxury-nile-cruiser.md`
- `artifacts/personas/french-family-multi-destination.md`

## Commit Message Pattern

```
Product Engine: Persona Card — [Persona Name]
```
