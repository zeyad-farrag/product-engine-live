# Gap Analysis Framework — pe-repositioning

## Overview

The Repositioning Gap Analysis is the analytical core of this initiative. It compares the current product state against new audience expectations across 10 standardised dimensions, producing a severity-weighted view that drives the strategic classification decision.

---

## Part 1: Component Adaptability Assessment (Phase 2A-2)

### Adaptability Ratings

| Rating | Definition |
|---|---|
| **HIGH** | Component can serve the new audience with minimal or no change |
| **MEDIUM** | Component requires moderate adaptation (content, configuration, partial restructure) |
| **LOW** | Component is fundamentally misaligned; major rework or replacement required |

### Change Effort Ratings

| Rating | Definition | Indicative Scope |
|---|---|---|
| **MINOR** | Change is cosmetic or configurational | Translation, image swap, pricing display, copy update |
| **MODERATE** | Change requires cross-functional coordination | New itinerary variant, accommodation tier change, pricing restructure |
| **MAJOR** | Change requires product rebuild or new supplier contracts | New destination, fundamental duration change, new transport mode |

### Component Adaptability Template

For each component, complete:

```
Component: [Name]
Current State: [Brief description of how this component exists today]
Adaptability for [New Audience]: HIGH / MEDIUM / LOW
Change Effort: MINOR / MODERATE / MAJOR
Key Constraint: [What limits adaptability — supplier contract, regulation, infrastructure, etc.]
Change Required: [Specific adaptation needed, or "None" if HIGH + no change needed]
```

**Components to assess**:
1. Destination / Itinerary
2. Accommodation (standard, type, location)
3. Activities (included, optional, cultural fit)
4. Transport (mode, class, convenience)
5. Duration (total trip length, pacing)
6. Price Point (absolute level, perceived value vs. competitors)
7. Messaging / Positioning (brand tone, key claims)
8. Content / Language (copy language, imagery, cultural tone)
9. Booking Flow (UX, payment methods, lead time, deposit structure)

---

## Part 2: 10-Dimension Gap Analysis Matrix (Phase 2C)

### Gap Type Definitions

| Gap Type | Definition | Typical Response |
|---|---|---|
| **MISSING** | The new audience expects something that does not exist in the current product | Add the element |
| **DEFICIENT** | The element exists but is below the level the new audience expects | Upgrade or enhance |
| **MISALIGNED** | The element exists at adequate quality but is positioned, framed, or communicated wrong | Reframe or reposition |
| **EXCESS** | The product offers something the new audience doesn't want and may find off-putting or price-inflating | Remove, de-emphasise, or make optional |
| **NONE** | No meaningful gap; current state meets new audience expectation | No action needed |

### Severity Definitions

| Severity | Definition | Effect on Classification |
|---|---|---|
| **CRITICAL** | This gap, if unaddressed, will prevent the product from being viable for the new audience | Drives classification upward (toward REDESIGN) |
| **MODERATE** | This gap materially reduces appeal but does not make the product non-viable | Addressable within REPOSITIONING or PARTIAL REDESIGN |
| **MINOR** | This gap is cosmetic or edge-case; most new audience buyers would not be deterred | Addressable with Quick Wins |
| **NONE** | No gap | No action needed |

### The 10-Dimension Matrix

| # | Dimension | What It Captures |
|---|---|---|
| 1 | **Price positioning** | Absolute price level vs. new audience's willingness to pay and comparable alternatives |
| 2 | **Product duration** | Total trip length vs. new audience's travel behaviour norms |
| 3 | **Destination fit** | Whether the destination resonates with the new audience's aspirations and travel history |
| 4 | **Activity mix** | Types, pace, and cultural relevance of included activities |
| 5 | **Accommodation standard** | Hotel/property type, star rating, location vs. new audience expectations |
| 6 | **Cultural resonance** | Food, customs, communication style, group dynamics fit |
| 7 | **Language / content** | Copy language, translation quality, imagery, cultural tone of all touchpoints |
| 8 | **Distribution channels** | Whether the product is reachable through the channels the new audience uses to buy |
| 9 | **Messaging / brand tone** | Whether the brand voice and claims speak to new audience values and triggers |
| 10 | **Booking flow / UX** | Payment methods, booking interface, deposit structure, customer service access |

### Completing Each Dimension

For each of the 10 dimensions, fill in:

```
Dimension: [Name]
Current State: [What the product offers today]
New Audience Expectation: [What the new audience needs/expects — cite sources]
Gap Type: MISSING / DEFICIENT / MISALIGNED / EXCESS / NONE
Severity: CRITICAL / MODERATE / MINOR / NONE
Evidence: [Source of expectation data — market research, competitor benchmarking, internal signals]
Addressability: Easy / Possible / Difficult / Requires New Product
```

---

## Part 3: Strategic Classification Thresholds

### Classification Rules

Apply these thresholds to the completed 10-dimension matrix:

#### REPOSITIONING
**Condition**: Gaps are primarily addressable through messaging, content, and minor structural changes.

Typical profile:
- 0 CRITICAL gaps
- ≤ 3 MODERATE gaps
- No dimension rated LOW adaptability with MAJOR change effort
- Price and destination fit gaps are NONE or MISALIGNED (not MISSING or DEFICIENT)

**Implication**: Execute with existing product team + marketing. No new supplier contracts.

---

#### PARTIAL REDESIGN
**Condition**: Some structural changes are needed, but the core product (destination, primary experience) is viable.

Typical profile:
- 1–2 CRITICAL gaps — but both are addressable (e.g., price restructure, accommodation upgrade)
- 3–5 MODERATE gaps
- Some components rated MEDIUM adaptability with MODERATE change effort
- The destination and core experience resonate; execution elements are misaligned

**Implication**: Requires product development cycle, budget, possibly new supplier agreements. Marketing + Product must co-own.

---

#### FULL REDESIGN → Reclassify to pe-new-product-development
**Condition**: So many structural gaps that the current product is not the starting point; a new product must be built.

Typical profile (any one of the following is sufficient):
- 3+ CRITICAL gaps
- Destination fit is CRITICAL and MISSING (the destination itself is wrong)
- Price positioning is CRITICAL and the required price change is > 40% from current
- 5+ dimensions rated LOW adaptability
- Core experience and activity mix are MISSING or DEFICIENT at CRITICAL severity

**Implication**: Honest reclassification. Present to the user at Inflection Point 1. Recommend pe-new-product-development. Note: this is the system working correctly, not a failure.

---

#### REJECT
**Condition**: The new audience opportunity is not worth pursuing regardless of changes.

Triggers:
- Market size is insufficient to justify even Quick Win investment
- Regulatory, legal, or operational barriers make entry non-viable
- A dominant competitor has locked up distribution for this audience
- The existing audience impact risk is unacceptably high

---

## Part 4: Convergence Methodology

### Step 1 — Independent track completion
Complete Track A (product) and Track B (audience) independently. Do not let product limitations bias audience expectation research.

### Step 2 — Dimension-by-dimension comparison
For each of the 10 dimensions, pair the Track A finding (current state) against the Track B finding (audience expectation). Do not infer gaps — cite evidence for both sides.

### Step 3 — Gap typing
Assign Gap Type first (the nature of the mismatch), then Severity (the consequence of not closing it). Severity should reflect the new audience's decision psychology: a gap that is CRITICAL in one market may be MINOR in another.

### Step 4 — Addressability check
For each CRITICAL or MODERATE gap, assess whether it can be closed:
- What would need to change?
- Who owns the change (Product / Marketing / Tech / Operations / Suppliers)?
- How long would it take?
- What does it cost?

### Step 5 — Classification
Apply the classification thresholds from Part 3. If borderline, default to the more conservative classification (e.g., PARTIAL REDESIGN over REPOSITIONING) and present both options at Inflection Point 1.

### Step 6 — Gap Analysis as a living artifact
The completed matrix is stored as `artifacts/gap-analyses/[product]-vs-[audience]-[date].md` and becomes reusable for tracking gap closure over time. Each gap can be updated as changes are made.

---

## Part 5: Confidence and Evidence Standards

### Evidence Hierarchy (highest to lowest)
1. Internal booking data with statistical significance
2. Primary research (surveys, interviews with new audience buyers)
3. Competitor product analysis (direct observation)
4. Published market research (cited with source + date)
5. Expert inference (AI-generated, labelled as LOW confidence)

### Disclosure Requirements
- For every new audience expectation claim: cite the evidence tier and source
- If a gap's severity relies on inference rather than data: label as `[INFERRED — LOW CONFIDENCE]`
- If a dimension lacks sufficient evidence: mark as `[INSUFFICIENT DATA]` and recommend how to fill the gap

---

## Quick Reference: Classification Decision Tree

```
Start: Complete 10-dimension gap analysis
          |
          v
   Count CRITICAL gaps
          |
     0 CRITICAL ──────────────────────────────→ Count MODERATE gaps
          |                                              |
    1–2 CRITICAL                                  0–3 MODERATE → REPOSITIONING
          |                                              |
   Are they addressable?                          4–5 MODERATE → PARTIAL REDESIGN
          |
    Yes → PARTIAL REDESIGN
    No  → Full Redesign check
          |
    3+ CRITICAL or destination/price CRITICAL?
          |
    Yes → FULL REDESIGN → reclassify to pe-new-product-development
    
   Market opportunity insufficient or barriers too high?
          |
    Yes → REJECT
```
