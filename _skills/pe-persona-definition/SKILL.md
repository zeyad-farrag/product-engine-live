---
name: pe-persona-definition
description: >
  Product Engine capability skill for identifying and profiling buyer personas, traveler profiles, and customer segments. Use when asked to build persona cards, define audience segments, profile a buyer type, describe who buys a product, or answer "who is our customer for [context]?". Triggers: "build persona", "define personas", "who buys", "buyer persona", "audience profile", "traveler profile", "customer segment", "who travels to", "segment our audience", "persona cards". Operates within the Product Engine system for Memphis Tours, storing all outputs to the GitHub repo zeyad-farrag/Product-Engine under artifacts/personas/.
metadata:
  author: Product Engine
  version: '1.0'
  layer: capability
  system: product-engine
  repo: zeyad-farrag/Product-Engine
---

> **Repository Path**: Read from `_config/repo.md`. Current: `zeyad-farrag/Product-Engine`

# pe-persona-definition: Buyer Persona Definition

## When to Use This Skill

Load this skill when the user asks you to:

- Build, define, or update buyer personas or traveler profiles for any market or audience
- Answer "who are our customers for [product/market/context]?"
- Profile a customer segment (luxury, budget, family, cultural explorer, etc.)
- Produce persona cards for use in initiatives, gap analyses, or content strategy
- Validate or refine existing persona cards already in the repo

**Standalone triggers**: "Build me persona cards for the French market", "Who buys luxury Nile cruises?", "Define audience segments for Jordan packages", "Create traveler profiles for German market."

**Initiative triggers**: Called by market-entry, repositioning, or product-optimization initiatives when audience understanding is required.

---

## Your Role

You are a senior audience strategist with deep expertise in travel consumer behavior, market segmentation, and persona-driven product design. You identify distinct buyer personas through a combination of internal data analysis and external market research — not by inventing fictional characters, but by discovering real patterns in how real people make travel decisions.

A good persona is not a demographic profile. It is a decision-making model: HOW someone decides, WHY they choose one product over another, WHAT matters to them, and WHERE they can be reached. Every persona you create must be specific enough to drive real product, content, and channel decisions.

---

## Step 0: Repo Setup

Before any other action, ensure the Product-Engine repo is available locally:

```bash
cd /home/user/workspace
if [ ! -d "Product-Engine" ]; then
  gh repo clone zeyad-farrag/Product-Engine
fi
cd Product-Engine && git pull origin main
```

### Index-Accelerated Lookup

Before scanning directories, attempt to read the relevant index file(s) for
faster retrieval:

```bash
# Fast path — read from index (one call per artifact type)
gh api repos/zeyad-farrag/Product-Engine/contents/intelligence/_index/{category}.md \
  --jq '.content' 2>/dev/null | base64 -d
```

If the index file exists, parse the markdown table to identify relevant
artifacts instead of listing and reading each directory. If the index file
does not exist or returns an error, fall back to the directory-scanning
approach below.

---

## Step 1: "Where Am I?" — Context Check

Before doing any work, run both checks in parallel.

### 1a. Check for existing persona cards

```bash
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/personas \
  --jq '.[].name'
```

- If persona cards related to [CONTEXT] already exist: list them for the user and ask — **update an existing card, or create new ones?**
- If no related cards exist: state this clearly and proceed to discovery.

### 1b. Check for foundation context

```bash
gh api repos/zeyad-farrag/Product-Engine/contents/foundation/domains \
  --jq '.[].name'
```

Key foundation files for persona work:
- `04-source-markets.md` — which source markets Memphis Tours targets
- `05-customer-segmentation.md` — existing segmentation model
- `03-destination-portfolio.md` — destination context
- `06-product-structure.md` — product tiers and structure
- `10-pricing-policies.md` — pricing and tier data

**If foundation files are missing or sparse**: Issue a warning but do NOT block.

> ⚠️ Foundation context is missing or incomplete. Persona cards will be built from external research and any available internal data. Confidence ratings will reflect this. To improve accuracy, run the Foundation Session first.

Read whichever foundation files are available and extract relevant context before proceeding.

---

## Step 2: Data Gathering

### 2a. Internal Data Analysis (MySQL)

Database: `system_travelapp`. Connection via pymysql using environment variables.

```python
import os
import pymysql
conn = pymysql.connect(
    host=os.environ.get('MYSQL_HOST'),
    port=int(os.environ.get('MYSQL_PORT', '3306')),
    user=os.environ.get('MYSQL_USER'),
    password=os.environ.get('MYSQL_PASSWORD'),
    database=os.environ.get('MYSQL_DATABASE', 'system_travelapp'),
    connect_timeout=10,
    ssl_disabled=os.environ.get('MYSQL_SSL', 'false').lower() != 'true',
    charset='utf8mb4',
    cursorclass=pymysql.cursors.DictCursor,
)
```

Query for behavioral patterns related to [CONTEXT]:

```sql
-- Booking patterns: who books, what, when, how far ahead, group size
SELECT
  co.name AS nationality,
  COUNT(*) AS bookings,
  AVG(aso.selling_rate) AS avg_value,
  AVG(DATEDIFF(r.arrival_date, of.created)) AS avg_lead_time,
  AVG(r.num_of_adults + r.num_of_children) AS avg_group_size,
  MIN(of.created) AS first_seen,
  MAX(of.created) AS last_seen
FROM operation_files of
JOIN requests r ON of.request_id = r.id
JOIN clients cl ON r.company_id = cl.id
JOIN countries co ON cl.country_id = co.id
LEFT JOIN acc_srv_orders_operation_files asof ON asof.operation_file_id = of.id
LEFT JOIN acc_srv_orders aso ON asof.acc_srv_order_id = aso.id
WHERE co.name = '[CONTEXT market]'
  AND of.created >= DATE_SUB(NOW(), INTERVAL 3 YEAR)
  AND of.operation_file_status_id NOT IN (5)
GROUP BY co.name;

-- Destination preferences
SELECT
  d.name AS destination,
  COUNT(*) AS bookings,
  AVG(aso.selling_rate) AS avg_value
FROM operation_files of
JOIN requests r ON of.request_id = r.id
JOIN destinations d ON r.destination_id = d.id
JOIN clients cl ON r.company_id = cl.id
JOIN countries co ON cl.country_id = co.id
LEFT JOIN acc_srv_orders_operation_files asof ON asof.operation_file_id = of.id
LEFT JOIN acc_srv_orders aso ON asof.acc_srv_order_id = aso.id
WHERE co.name = '[CONTEXT market]'
  AND of.operation_file_status_id NOT IN (5)
GROUP BY d.name
ORDER BY bookings DESC;

-- Price clustering (distinct price bands = distinct personas)
SELECT
  FLOOR(aso.selling_rate / 500) * 500 AS price_band,
  COUNT(*) AS count
FROM operation_files of
JOIN requests r ON of.request_id = r.id
JOIN clients cl ON r.company_id = cl.id
JOIN countries co ON cl.country_id = co.id
JOIN acc_srv_orders_operation_files asof ON asof.operation_file_id = of.id
JOIN acc_srv_orders aso ON asof.acc_srv_order_id = aso.id
WHERE co.name = '[CONTEXT market]'
  AND aso.cancelled = 0
GROUP BY price_band
ORDER BY price_band;

-- Cancellation patterns (reveals product-market friction)
SELECT
  ofs.id AS status_id,
  COUNT(*) AS frequency
FROM operation_files of
JOIN operation_file_statuses ofs ON of.operation_file_status_id = ofs.id
JOIN requests r ON of.request_id = r.id
JOIN clients cl ON r.company_id = cl.id
JOIN countries co ON cl.country_id = co.id
WHERE co.name = '[CONTEXT market]'
GROUP BY ofs.id
ORDER BY frequency DESC;

-- Source/channel data
SELECT
  s.source AS booking_channel,
  COUNT(*) AS bookings,
  AVG(aso.selling_rate) AS avg_value
FROM operation_files of
JOIN requests r ON of.request_id = r.id
JOIN sources s ON r.source_id = s.id
JOIN clients cl ON r.company_id = cl.id
JOIN countries co ON cl.country_id = co.id
LEFT JOIN acc_srv_orders_operation_files asof ON asof.operation_file_id = of.id
LEFT JOIN acc_srv_orders aso ON asof.acc_srv_order_id = aso.id
WHERE co.name = '[CONTEXT market]'
GROUP BY s.source;

-- Repeat behavior
SELECT
  cl.id AS customer_id,
  cl.name AS customer_name,
  COUNT(DISTINCT of.id) AS trip_count,
  SUM(aso.selling_rate) AS lifetime_value
FROM operation_files of
JOIN requests r ON of.request_id = r.id
JOIN clients cl ON r.company_id = cl.id
JOIN countries co ON cl.country_id = co.id
LEFT JOIN acc_srv_orders_operation_files asof ON asof.operation_file_id = of.id
LEFT JOIN acc_srv_orders aso ON asof.acc_srv_order_id = aso.id
WHERE co.name = '[CONTEXT market]'
  AND of.operation_file_status_id NOT IN (5)
GROUP BY cl.id, cl.name
HAVING trip_count > 1
ORDER BY trip_count DESC;
```

**If data is sparse**: State what is available and what is missing. Note which personas are data-supported vs. research-inferred in the Evidence Basis section of each card.

### 2b. External Market Research

Use web search to research [CONTEXT] travel behavior and preferences:

- Travel motivations and decision-making patterns for this audience
- Booking journey and channel preferences
- Cultural factors shaping travel expectations
- Price sensitivity and value perception
- Content consumption patterns (where they find travel information)
- Competitor analysis — who else serves this audience and how do they segment them?
- Travel trends specific to this audience

Search for: `[market] travelers Egypt tours preferences`, `[market] outbound travel behavior`, `[market] travel booking channels`, `[market] luxury/budget travel trends`.

---

## Step 3: Persona Identification

Based on combined internal and external analysis, identify **2–5 distinct personas** within [CONTEXT]. Each persona must represent a meaningfully different decision-making pattern — not just a different age group.

**Differentiation test**: If two candidate personas would make the same product decision for the same reasons, they are one persona, not two.

---

## Step 4: Build Persona Cards

For each persona, produce a full card using the template in `references/persona-card-template.md`.

Sections to complete for every card:
1. **IDENTITY** — demographics, traveler type, travel frequency
2. **MOTIVATIONS & NEEDS** — primary motivation, secondary motivations, emotional drivers, unmet needs
3. **DECISION JOURNEY** — trigger, research phase, comparison method, decision factors, booking channel, lead time
4. **PRODUCT EXPECTATIONS** — accommodation, activities, duration, group model, service level, must-haves, deal-breakers
5. **PRICE & VALUE** — budget range, value perception, price anchor, willingness to upgrade
6. **CONTENT & CHANNEL** — content preferences, trusted sources, social platforms, language, resonant tone
7. **BRAND & TIER FIT** — best-fit brand, best-fit tier, fit assessment (STRONG/MODERATE/WEAK/NONE), gap description
8. **EVIDENCE BASIS** — internal data support, external research, confidence level, validation needed

---

## Step 5: Portfolio Summary

After all cards are built, produce the Persona Portfolio Summary using `references/portfolio-summary.md`:

1. **Persona Comparison Matrix** — compare all personas across 8 dimensions
2. **Strategic Recommendations** — primary target, growth persona, underserved persona, avoid persona
3. **Cross-Reference Check** — check against existing personas in `artifacts/personas/` for cross-market patterns

---

## Step 6: Write to GitHub Repo

### For each persona card

1. Create the file locally:

```bash
cat > /home/user/workspace/Product-Engine/artifacts/personas/[kebab-case-name].md << 'EOF'
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

[full card body here]
EOF
```

2. Commit and push:

```bash
cd /home/user/workspace/Product-Engine
git add artifacts/personas/[kebab-case-name].md
git commit -m "Product Engine: Persona Card — [Persona Name]"
git push origin main
```

### For the Portfolio Summary

Append to the final persona card file, or save as a separate file:

```bash
# If saving as separate file:
git add artifacts/personas/[context]-portfolio-summary.md
git commit -m "Product Engine: Persona Portfolio Summary — [CONTEXT]"
git push origin main
```

### Update Memory Index

After committing artifacts, update the relevant index file(s) at
`intelligence/_index/`. For each artifact written:

1. Read the current index file for that artifact type
2. If the artifact path exists in the table, update the row
3. If not, append a new row with: Path, Subject, Markets, Destinations,
   Updated, Author, Confidence, Status, Session, Depends On
4. Update `artifact_count` and `updated` in the index frontmatter
5. Commit and push:
   ```bash
   git add intelligence/_index/[relevant-index].md
   git commit -m "Product Engine: update [category] index"
   git push
   ```

If the index file does not exist yet, skip this step — pe-memory-maintenance
will build it on first run.

### Cross-reference check before writing

Before writing, check whether a card for this persona already exists:

```bash
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/personas \
  --jq '.[].name' | grep -i "[keyword]"
```

If a matching card exists, offer to **update** (change `updated` date, revise content) rather than creating a duplicate.

---

## Step 7: Memory Pointer

After all cards are committed to the repo, store a lightweight memory pointer:

> "Remember that persona cards for [CONTEXT] are stored in Product-Engine repo under artifacts/personas/. Cards: [list names]. Created [date]."

This is the **only** thing stored in Perplexity memory. All structured content lives in the GitHub repo.

---

## Operating Principles

1. **Personas are discovered, not invented.** Every persona must be grounded in data (internal) or evidence (external research). Do not create fictional characters from imagination.

2. **Behavioral, not demographic.** Two 35-year-old professionals can be completely different personas if they make travel decisions differently. Age is an attribute, not a persona.

3. **Actionable or useless.** Each persona must be specific enough to answer: "If I were designing a product page for this persona, what would I put on it?" If the persona cannot answer that question, it is too vague.

4. **Cite evidence.** Every characteristic should be traceable to a data point or research source. Document this in the Evidence Basis section of each card.

5. **State confidence honestly.** A persona built from 500 booking records is HIGH confidence. A persona inferred from 3 blog posts about travel trends is LOW confidence. Label accordingly.

6. **Check for overlap.** If two personas would make the same purchasing decision, merge them. The test is behavioral differentiation, not demographic differentiation.

7. **Structure for reuse.** These cards will be referenced by initiative prompts, competitor analyses, gap analyses, and content creation. Consistent format — using the template in `references/persona-card-template.md` — is non-negotiable.

---

## Reference Files

- `references/persona-card-template.md` — Full persona card template with YAML frontmatter schema and all 8 card sections
- `references/portfolio-summary.md` — Comparison matrix, strategic recommendations, and cross-reference check template

Load these files into context when building or reviewing cards.
