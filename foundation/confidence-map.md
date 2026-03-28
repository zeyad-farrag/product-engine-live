---
type: foundation-confidence
created: 2026-03-26
updated: 2026-03-26
---

# Foundation Confidence Map

This map rates the depth and quality of information captured for each domain during the Foundation Session conducted on 2026-03-26.

| Domain | Confidence | Notes |
|---|---|---|
| 1. Company Identity & Business Model | **HIGH** | Rich detail on founding history, legal structure, revenue ($61.5M), employee count (348), business model mechanics, value chain position, and brand identity. Grounded in database stats and public company information. |
| 2. Brand Architecture | **HIGH** | All 16 brands identified with strategic positioning, target audiences, and inter-brand relationships. Database source table confirms brand hierarchy. Language-market mapping is precise. |
| 3. Destination Portfolio | **HIGH** | All 8 core destinations profiled with revenue shares, supply models, seasonality, and strategic roles. TravelVerse 30+ destinations cataloged. Build-vs-partner continuum well articulated. |
| 4. Source Markets | **HIGH** | 20 markets profiled with exact client counts from database (866K total). Three-tier framework with market entry criteria. LATAM competitive moat clearly documented. |
| 5. Customer Segmentation & Tiers | **HIGH** | Four-tier spending model with booking/revenue share estimates. Nine purpose segments. Market-by-market behavioral profiles. Brand-to-segment mapping complete. |
| 6. Product Structure & Catalog | **HIGH** | 17K packages analyzed by organization logic. Six core product categories with pricing examples. 70% customization rate documented. Product lifecycle and creation process detailed. |
| 7. Competitive Landscape | **HIGH** | 10+ named competitors with strategic assessments. Competitive dynamics mapped by segment and source market. Indirect/platform competitors included. Intelligence gap honestly assessed. |
| 8. Sales & Distribution Channels | **HIGH** | All direct (75%) and indirect (25%) channels documented with conversion characteristics. Full customer journey mapped. Technology stack described. Database source names referenced throughout. |
| 9. Internal Data Landscape | **HIGH** | Complete database architecture documented — 518 tables, key table schemas, row counts, access methodology. Data quality issues honestly cataloged. Known gaps identified. |
| 10. Pricing & Commercial Policies | **HIGH** | Per-person pricing model, currency strategy (4 currencies), margin ranges by product type, discount/promotion policies, cancellation terms, payment terms, regulatory requirements, and commercial tensions all documented. |
| 11. Strategic Context & Priorities | **HIGH** | Three strategic priorities clearly articulated with rationale. Growth strategy multi-dimensional. Threat landscape realistic. Key pending decisions listed. Product Engine role framed strategically. |
| 12. Product Department Context | **HIGH** | Team structure (6-8 people) with named roles. Seven-step workflow documented. Tool landscape mapped. Three core pain points identified. Collaboration touchpoints named. Aspirational state clearly framed. |

## Overall Assessment

All twelve domains achieved **HIGH** confidence. The foundation benefits from three data-rich sources: (1) the production MySQL database with 849K requests and 866K clients providing quantitative grounding, (2) public company information (TripAdvisor, ZoomInfo, press coverage) providing external validation, and (3) the database schema itself revealing operational structure (sources table hierarchy, request lifecycle, multi-language support).

The foundation is comprehensive enough to support all Product Engine capabilities. The recommended cadence for foundation refresh is every six months, or immediately when significant business changes occur (new brand launch, new destination entry, major organizational restructuring).

## Domains Most Likely to Need Early Refresh

1. **Strategic Priorities** — Strategy evolves fastest. Refresh if any of the three priorities shift or new initiatives are launched.
2. **Competitive Landscape** — Competitors change positioning, new entrants appear. Refresh quarterly.
3. **Brand Architecture** — If new brands are launched (Chinese market, new niche brands) or existing brands are retired.
