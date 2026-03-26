# Foundation Session — Wrap-Up Deliverables

After all 12 domains are complete (or skipped), produce the following deliverables. Present them to the user for review, then write each to the repo.

---

## 1. Business Model Summary

**Repo path:** `foundation/business-model-summary.md`

Write a concise (1-2 page) synthesis of everything learned across all 12 domains. This should read as a coherent narrative, not a domain-by-domain recap.

**Requirements:**
- Clear enough that a new team member could read it and understand the business
- Written in prose, not bullet points
- Captures the business model, market position, competitive dynamics, and strategic direction
- Highlights key tensions or contradictions discovered during the session
- Notes what makes this business distinctive — what an outsider would find surprising
- Includes a "Recommended First Initiative" section at the end

---

## 2. Intelligence Readiness Assessment

**Repo path:** `foundation/intelligence-readiness.md`

For each Product Engine capability, assess whether the foundation provides sufficient context for the capability to operate effectively.

Present as a table:

| Capability | Data Available | Readiness | Gaps |
|---|---|---|---|
| Persona Definition | [what from the foundation supports this] | ready / partial / not ready | [what's missing] |
| Competitor Benchmarking | [what from the foundation supports this] | ready / partial / not ready | [what's missing] |
| Demand Signal Mining | [what from the foundation supports this] | ready / partial / not ready | [what's missing] |
| Product Health Check | [what from the foundation supports this] | ready / partial / not ready | [what's missing] |
| Gap Analysis | [what from the foundation supports this] | ready / partial / not ready | [what's missing] |
| Cross-Market Intelligence | [what from the foundation supports this] | ready / partial / not ready | [what's missing] |

**Readiness criteria:**
- **Ready**: Foundation provides enough context. External data sources (MySQL, web) are identified and accessible.
- **Partial**: Some context exists, but key information is missing or a data source is unavailable. The capability can run but outputs will have lower confidence.
- **Not ready**: Critical information is missing. Specific gaps should be actionable.

---

## 3. Confidence Map

**Repo path:** `foundation/confidence-map.md`

Rate the depth and quality of information gathered for each domain:

| Domain | Confidence | Notes |
|---|---|---|
| Company Identity | HIGH / MEDIUM / LOW / SKIPPED | [brief note] |
| Brand Architecture | HIGH / MEDIUM / LOW / SKIPPED | [brief note] |
| Destination Portfolio | HIGH / MEDIUM / LOW / SKIPPED | [brief note] |
| Source Markets | HIGH / MEDIUM / LOW / SKIPPED | [brief note] |
| Customer Segmentation | HIGH / MEDIUM / LOW / SKIPPED | [brief note] |
| Product Structure | HIGH / MEDIUM / LOW / SKIPPED | [brief note] |
| Competitive Landscape | HIGH / MEDIUM / LOW / SKIPPED | [brief note] |
| Distribution Channels | HIGH / MEDIUM / LOW / SKIPPED | [brief note] |
| Data Landscape | HIGH / MEDIUM / LOW / SKIPPED | [brief note] |
| Pricing & Policies | HIGH / MEDIUM / LOW / SKIPPED | [brief note] |
| Strategic Priorities | HIGH / MEDIUM / LOW / SKIPPED | [brief note] |
| Product Department | HIGH / MEDIUM / LOW / SKIPPED | [brief note] |

**Confidence criteria:**
- **HIGH**: Deep understanding with specific details, names, numbers. No significant gaps.
- **MEDIUM**: Good general understanding but some areas lacked specificity.
- **LOW**: Surface-level understanding only. Recommend revisiting.
- **SKIPPED**: Domain was skipped by user request.

---

## 4. Memory Persistence Confirmation

After all files are committed to the repo, present a confirmation listing every file written:

```
Repository Commit Confirmation (zeyad-farrag/product-engine-live):

Foundation Domains:
✓ foundation/domains/01-company-identity.md
✓ foundation/domains/02-brand-architecture.md
✓ foundation/domains/03-destination-portfolio.md
✓ foundation/domains/04-source-markets.md
✓ foundation/domains/05-customer-segmentation.md
✓ foundation/domains/06-product-structure.md
✓ foundation/domains/07-competitive-landscape.md
✓ foundation/domains/08-distribution-channels.md
✓ foundation/domains/09-data-landscape.md
✓ foundation/domains/10-pricing-policies.md
✓ foundation/domains/11-strategic-priorities.md
✓ foundation/domains/12-product-department.md

Summary & Assessment:
✓ foundation/business-model-summary.md
✓ foundation/intelligence-readiness.md
✓ foundation/confidence-map.md

⊘ [any skipped domains listed here]
```

Also confirm the lightweight memory pointer was stored in Perplexity memory.
