---
type: foundation-domain
domain: 9
name: Internal Data Landscape
status: complete
confidence: HIGH
created: 2026-03-26
updated: 2026-03-26
---

# Domain 9: Internal Data Landscape

## The Asset Most Companies Don't Have

Memphis Tours is sitting on something rare: a single, self-contained production database that has captured nearly every commercial interaction the company has had since approximately 2010. That database — MySQL, named `system_travelapp`, hosted at `66.175.216.130:3306` — contains 518 tables and spans fifteen-plus years of continuous operational history. For a company of Memphis Tours' size and geographic complexity, this is genuinely unusual. Most regional tour operators of comparable revenue operate on fragmented systems — a booking tool here, a spreadsheet there, a separate CRM that doesn't talk to finance. Memphis Tours built its own platform, evolved it organically over nearly two decades, and as a result has a depth of data coverage that would be the envy of much larger travel businesses.

The implications for Product Engine are significant. There is no need to instrument a new data collection layer from scratch, negotiate with a SaaS vendor for data export rights, or stitch together five systems with ETL pipelines. The primary source of truth for commercial operations is accessible via direct SQL query through `pymysql`. The task is not collection — it is comprehension, curation, and activation.

## The Core Systems

The platform is best understood as a custom-built CRM and booking engine that has grown to encompass lead management, product catalog management, operations execution, and revenue accounting in a single schema. It is actively used by more than 300 staff across sales, operations, and management functions. Data flows into it in real time: every new inquiry, every status change, every booking confirmation, every service order. This is live production data, not a periodic export or a data warehouse copy.

Direct database access is the primary interface for Product Engine. There is no API abstraction layer — queries run directly against the production schema. This creates both opportunity (full flexibility, full depth) and responsibility (care must be taken to avoid long-running queries that affect production performance, and any writes or updates require particular discipline).

Web analytics data lives separately in Google Analytics and is not queryable through the MySQL system. Financial reporting may have additional layers not yet fully mapped. But for the core commercial story — who inquired, what they wanted, whether they booked, and what revenue resulted — the MySQL database is authoritative.

## Requests: The Heartbeat of the Business

The `requests` table is the most analytically important asset in the system. With approximately 849,000 records, it captures every customer inquiry that has ever entered the pipeline, stretching back to the early 2010s with increasing density from 2015 onward. A "request" in Memphis Tours terminology is the atomic unit of commercial activity — the moment a prospective traveler raised their hand and said they wanted a trip.

What makes this table remarkable is its column breadth. Each request record captures not just the obvious transactional fields (arrival and departure dates, number of travelers, price, currency) but an unusually rich set of context: the specific source brand or channel that generated the inquiry, UTM campaign parameters for digital attribution, the device type and originating URL, the language the customer engaged in, their accommodation preferences down to room configuration (single, double, triple, family), the assigned sales staff member and department, the branch handling the request, and multiple free-text notes fields that preserve the conversational record. There are more than 100 columns in this table.

The `request_type` field functions as a product category tag, and `status` tracks lifecycle stage — the database contains a reference table of request statuses where key values include New (6), Active (1), Completed (10), and Cancelled (9), among others. Following a request's status transitions over time creates a behavioral timeline: how long did it sit in each stage, when did it convert, when did it drop off, and what characterized the requests that converted versus those that didn't?

The `source_id` field is the attribution backbone of the entire business. Every request is tagged to the brand or channel that generated it, linking back to the `sources` table which carries a parent-child hierarchy mapping sub-brands to parent brands, and parent brands to business units. This is how Memphis Tours tracks performance across its portfolio of sixteen brands — from the flagship Memphis Tours sites in English, French, German, Spanish, and Italian, through specialist brands like Egypt Tours Plus, Vamos Viajando, TravelVerse, GoElite, and She Drives.

## Clients: 866,000 Customer Profiles

The `clients` table holds approximately 866,000 records — one for each unique customer who has ever engaged with the business. This is not raw inquiry volume; it is a deduplicated customer base of substantial scale. Each profile captures name, email, and phone, along with the `country_id` field that links to a reference table of 243 countries. That country field is the key to source market analysis — it is how the business knows that Italy is its single largest market by client volume (131,817 clients), that the United States is second (107,515), and that Brazil's 96,291 clients represent an extraordinary organic penetration for a company headquartered in Cairo.

Client profiles also carry language preference, currency preference, date of birth, gender, passport details (for operational use), corporate client flags, CRM loyalty points balance, WhatsApp verification status, and mobile app registration status. The last two fields reflect the business's investment in digital and messaging-based customer engagement — they are not decoration; they track whether a customer can be reached through Memphis Tours' preferred contact channels.

The quality of client data is generally strong on core identity fields, particularly country of origin. This is in part because country detection happens at the point of inquiry, before a human ever touches the record, making it one of the more reliably populated fields in the system. It is the foundation for any source market segmentation or geographic revenue analysis.

## Products, Operations, and Revenue

The `tr_packages` table catalogs approximately 17,000 tour packages — the product universe from which customer itineraries are built. Each package is linked to one of eight core destinations (Egypt, Jordan, UAE, Oman, Turkey, Greece, Morocco, Mexico), carries pricing and description data, and is organized with attributes for categorization. This table is the product master; it is what sales staff pull from when constructing a custom itinerary and what the website surfaces when a traveler is browsing.

When a request matures into a confirmed booking, it graduates to `operation_files`, which holds approximately 82,000 records. These are not inquiries — they are trips that are actually happening or have happened. They contain the actual trip logistics, traveler manifests, and operational details that the ground operations team executes against. The conversion from `requests` (849K) to `operation_files` (82K) implies an overall pipeline conversion rate in the range of 9–10%, though this calculation requires care since some requests will have converted to a different record type and the time window for each population differs.

The financial layer is the `acc_srv_orders` table, which holds approximately 520,000 records. These are revenue and accounting entries that tie specific services — a Nile cruise night, a private guide day, an airport transfer — to the clients and operations they were delivered for. This table is the closest the database comes to a revenue ledger for delivered services, and its analytical potential is substantially underexplored.

## The Underutilized Intelligence Layer

The `acc_srv_orders` table deserves particular attention precisely because it tends to get used for accounting rather than intelligence. With half a million service-level records, it is possible to construct a granular picture of what Memphis Tours actually sold — not what was requested, not what was confirmed, but what was delivered and charged for. Cross-referencing service orders with client country of origin, request type (product category), destination, and time of year creates a revenue matrix that no summary report currently produces: actual yield by source market, by product, by season, and by destination, trended over multiple years.

This analysis would answer the question the business most needs answered: not just "which markets are biggest" (Italy, USA, Brazil, by client count) but "which market × product × season combinations are most profitable, and how is that profile shifting?" A Brazilian client booking a private Egypt tour in November is a different business proposition from a German client booking a Nile cruise group in March. The data to distinguish those propositions — and to find ten thousand more of whichever is more valuable — is in the database today.

Similarly, the amendment and status-change history embedded in the `requests` table is largely unread. When a customer changes their travel dates, upgrades their accommodation tier, adds a family member, or reduces the group size between initial inquiry and booking confirmation, that change is logged. The aggregate pattern of these amendments, if analyzed, reveals something important about how customers actually make decisions — what they're uncertain about at inquiry stage, what triggers their commitment, and what they value enough to pay more for.

The `enquiries` table (approximately 303,000 records) represents a separate entry point into the inquiry pipeline — possibly a different funnel stage or a different system integration — whose relationship to the `requests` table has not been fully characterized. Understanding the precise boundary between these two populations, and whether a single traveler can appear in both, is a prerequisite for accurate funnel analysis.

## Data Quality: Honest Assessment

The database is rich, but it was built to run a business, not to be analyzed. Several quality considerations matter for anyone building intelligence systems on top of it.

Fields like `budget` and `flexible_date` are stored as varchar rather than typed numeric or boolean fields, meaning their contents can vary in format and require normalization before use. The `sources` table has grown organically over years to hundreds of entries, and the parent-child hierarchy that maps sub-brands to parent brands is not always consistent — some entries that should be related are not properly linked, and the naming conventions have evolved in ways that make automated grouping tricky without a curated mapping. There is at least one known column name with a typo in the production schema (`oprator_prediction` rather than `operator_prediction`), which is a small but real indicator of organic, unaudited growth.

The boundaries between `requests`, `enquiries`, and `operation_files` reflect real business distinctions in the customer lifecycle, but those boundaries may not be perfectly clean in practice. A rigorous funnel analysis requires verifying that records do not appear in overlapping states simultaneously and that the lifecycle transitions are consistently logged.

Historical data becomes denser from 2015 onward, though records exist back to 2010. For trend analysis, the 2015–present window is the most reliable and comparable.

Known gaps outside the MySQL system include customer satisfaction data beyond what appears in TripAdvisor reviews (there is no internal NPS or post-trip survey instrument tracked in the database), detailed supplier cost data per booking (the cost side of the margin equation may live in a separate system or spreadsheet), web traffic and behavioral analytics (Google Analytics, entirely separate), and social media engagement metrics (managed natively in each platform). Competitor pricing data is not systematically collected.

## What This Means for Product Engine

Product Engine operates with direct SQL access to a production database that is, by the standards of a $60M+ tour operator, extraordinarily complete. The 518-table schema is not a data warehouse built for analysis — it is the operational nervous system of the company, and that is both its strength and its complexity. The strength is freshness and fidelity: this data reflects what actually happened, in real time, with no intermediary transformation that might introduce error or lag. The complexity is that schema comprehension requires investment — the table relationships, the status taxonomy, the source hierarchy, and the product categorization all require domain knowledge to query correctly.

The highest-leverage analytical work the database enables is a compound query that has never been systematically run: conversion rate and average revenue per booking, segmented by source market, destination, product type, and season, trended across the past three years. That single analysis — achievable from existing data — would underpin the majority of product prioritization, market investment, and pricing decisions the business needs to make. It is the intelligence gap Memphis Tours most urgently needs closed, and it is already answerable from data the company owns today.
