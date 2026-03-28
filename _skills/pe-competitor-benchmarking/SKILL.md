---
name: pe-competitor-benchmarking
description: >
  Product Engine capability skill for competitor analysis, competitive benchmarking, and competitive intelligence. Use when asked to map the competitive landscape, profile competitors, run a competitive analysis, build a benchmark matrix, identify competitive gaps, assess competitive threats, or answer "who competes with us for [context]?". Triggers: "competitor analysis", "competitive benchmarking", "competitive landscape", "competitive intelligence", "benchmark competitors", "who are our competitors", "profile a competitor", "competitive gaps", "competitive threats", "benchmark matrix", "competitive positioning", "who competes with us", "map competition". Operates within the Product Engine system for Memphis Tours, storing all outputs to the GitHub repo zeyad-farrag/Product-Engine under artifacts/competitors/.
metadata:
  author: Product Engine
  version: '1.0'
  layer: capability
  system: product-engine
  repo: zeyad-farrag/Product-Engine
---

> **Repository Path**: Read from `_config/repo.md`. Current: `zeyad-farrag/Product-Engine`

# pe-competitor-benchmarking: Competitor Benchmarking

## When to Use This Skill

Load this skill when the user asks you to:

- Map or analyze the competitive landscape for a given market, product, or audience context
- Profile one or more specific competitors in depth
- Build a benchmark matrix comparing us to competitors
- Identify competitive gaps and opportunities
- Assess competitive threats and risks
- Answer "Who competes with us for [context]?" or "What are the best [product type] on the market?"
- Update or refresh existing competitor profiles already in the repo

**Standalone triggers**: "Who competes with us for UK travelers to Egypt?", "Profile TravelCo for the German market", "Build a competitive benchmark for luxury Nile cruises", "What are our competitors doing on Jordan packages?"

**Initiative triggers**: Called by market-entry, repositioning, product-optimization, and new-product-development initiatives when competitive context is required.

---

## Your Role

You are a competitive intelligence analyst with deep expertise in the travel industry. Your job is to map the competitive landscape with the precision of a market researcher and the strategic lens of a business strategist.

You don't just list competitors — you analyze positioning, identify differentiation strategies, evaluate strengths and weaknesses, and surface competitive gaps and opportunities. Every finding must be evidence-based and sourced.

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

Before doing any work, run all three checks in parallel.

### 1a. Check for existing competitor profiles

```bash
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/competitors \
  --jq '.[].name'
```

- If competitor profiles related to [CONTEXT] already exist: list them for the user. Present their frontmatter (name, market, threat_level, updated date). Ask — **update an existing profile, or start fresh for a new context?**
- If no related profiles exist: state this clearly and proceed to discovery.
- **Cross-reference check**: If a competitor appears in other market contexts, note the cross-reference (e.g., "TravelCo already has a profile for the French market — will cross-reference."). Check with:

```bash
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/competitors \
  --jq '.[].name' | grep -i "[competitor keyword]"
```

### 1b. Check for foundation context

```bash
gh api repos/zeyad-farrag/Product-Engine/contents/foundation/domains \
  --jq '.[].name'
```

Key foundation files for competitive analysis:
- `07-competitive-landscape.md` — existing competitive context already documented
- `04-source-markets.md` — which source markets Memphis Tours targets
- `05-customer-segmentation.md` — customer segmentation model
- `03-destination-portfolio.md` — destination context
- `06-product-structure.md` — product tiers and structure
- `10-pricing-policies.md` — pricing and tier data
- `11-strategic-priorities.md` — strategic direction shapes competitive evaluation

Read whichever foundation files are available and extract relevant context before proceeding.

**If foundation files are missing or sparse**: Issue a warning but do NOT block.

> ⚠️ Foundation context is missing or incomplete. Competitor profiles will be built from external research only. Confidence ratings will reflect this. To improve accuracy, run the Foundation Session first.

### 1c. Check for relevant persona cards

```bash
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/personas \
  --jq '.[].name'
```

Understanding the buyer in [CONTEXT] shapes how you evaluate competitors — what a luxury traveler values vs. what a budget traveler values changes which competitor strengths matter. Pull any persona cards relevant to [CONTEXT] and incorporate buyer perspective into all assessments.

---

## Phase 1: Competitor Identification

> **Conversation gate**: Complete Phase 1 and present the discovery list to the user. **Wait for confirmation before proceeding to Phase 2.** The user may add competitors you missed or remove ones that aren't relevant.

Cast a wide net, then narrow. Search for competitors across multiple dimensions:

- Direct web search for [CONTEXT] — who shows up in search results?
- OTA and aggregator listings — who's selling in this space on Viator, GetYourGuide, TripAdvisor, etc.?
- Social media and review platforms — who gets mentioned by travelers?
- Industry directories and associations
- B2B and wholesale channels (if relevant)
- Content and SEO competitors — who ranks for relevant search terms?

Categorize all discovered competitors:

| Category | Definition | Expected Count |
|---|---|---|
| **Primary** | Same business model, same destinations, same audience, direct substitutes | 3–5 |
| **Secondary** | Different business model but competing for the same customer spend (OTAs, adventure brands, DIY alternatives) | 3–5 |
| **Peripheral** | Adjacent competitors — different destinations or audiences but could expand into our space | 2–3 |

Present the full discovery list to the user in this format, then **stop and wait for confirmation**:

```
COMPETITOR DISCOVERY — [CONTEXT]

PRIMARY COMPETITORS (direct substitutes)
1. [Name] — [one-line description + URL]
2. ...

SECONDARY COMPETITORS (competing for same spend)
1. [Name] — [one-line description + URL]
2. ...

PERIPHERAL COMPETITORS (adjacent, could expand)
1. [Name] — [one-line description + URL]
2. ...

Please confirm this list. Add any competitors I missed, or remove any that aren't relevant for this analysis. I'll proceed to deep profiling once you confirm.
```

---

## Phase 2: Deep Profiling

For each **Primary** competitor (and any Secondary competitors the user requests), build a comprehensive profile using the full template in `references/competitor-profile-template.md`.

For each competitor:
1. Research their website, OTA listings, social media, reviews, and press coverage
2. Complete all 9 sections of the profile template
3. Before writing to the repo, check whether a cross-market profile already exists for this competitor (see Step 1a cross-reference check). If so, note it in the profile header.

---

## Phase 3: Benchmark Matrix

After completing all deep profiles, build the side-by-side benchmark matrix from `references/benchmark-synthesis.md`.

For each cell, note whether Memphis Tours is **AHEAD**, **AT PARITY**, or **BEHIND** relative to that competitor on that dimension.

Dimensions covered:
- **Products**: Destination coverage, product range, price range, unique offerings
- **Positioning**: Market positioning, content quality, trust signals
- **Distribution**: Channel breadth, OTA presence, digital marketing
- **Customer**: Review ratings, review volume, customer sentiment

---

## Phase 4: Competitive Intelligence Synthesis

Complete all four synthesis sections from `references/benchmark-synthesis.md`:

1. **Competitive Gaps (Opportunities)** — what nobody in the market does well; where differentiation lives
2. **Competitive Threats (Risks)** — where competitors outperform us; severity and urgency
3. **Our Competitive Position Summary** — where we win, where we lose, where nobody wins, biggest risk, biggest opportunity
4. **Strategic Recommendations** — 3+ specific, evidence-based action recommendations

---

## Step 5: Write to GitHub Repo

### For each competitor profile

1. Create the file locally:

```bash
cat > /home/user/workspace/Product-Engine/artifacts/competitors/[kebab-case-name]-[market-context].md << 'EOF'
---
type: competitor-profile
name: [Competitor Name]
market: [source market context]
destinations: [list]
positioning: [one-line positioning summary]
threat_level: HIGH | MEDIUM | LOW
created: YYYY-MM-DD
updated: YYYY-MM-DD
confidence: HIGH | MEDIUM | LOW
status: active
initiative: [producing initiative slug or "standalone"]
tags: [searchable tags]
---

[full profile body here]
EOF
```

2. Commit and push each profile individually:

```bash
cd /home/user/workspace/Product-Engine
git add artifacts/competitors/[kebab-case-name]-[market-context].md
git commit -m "Product Engine: Competitor Profile — [Competitor Name] ([market context])"
git push origin main
```

### For the benchmark summary

Save as a separate file prefixed with underscore (sorts to top of directory):

```bash
cat > /home/user/workspace/Product-Engine/artifacts/competitors/_benchmark-[context]-[YYYY-MM-DD].md << 'EOF'
---
type: benchmark-summary
context: [CONTEXT]
market: [source market]
profiles_included: [list of competitor names]
created: YYYY-MM-DD
updated: YYYY-MM-DD
confidence: HIGH | MEDIUM | LOW
status: active
initiative: [producing initiative slug or "standalone"]
tags: [searchable tags]
---

[full benchmark body here]
EOF

cd /home/user/workspace/Product-Engine
git add artifacts/competitors/_benchmark-[context]-[YYYY-MM-DD].md
git commit -m "Product Engine: Competitive Benchmark Summary — [CONTEXT]"
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

Before writing any profile, check whether a profile for this competitor already exists in a different market context:

```bash
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/competitors \
  --jq '.[].name' | grep -i "[competitor-name-keyword]"
```

If a match exists, add a cross-reference note in the profile header:
```
> Cross-reference: Profile also exists for [competitor] in [other market context] — see artifacts/competitors/[other-file].md
```

---

## Step 6: Memory Pointer

After all files are committed to the repo, store a lightweight memory pointer:

> "Remember that competitor profiles for [CONTEXT] are stored in Product-Engine repo under artifacts/competitors/. Profiles: [list names]. Benchmark summary: _benchmark-[context]-[date].md. Created [date]."

This is the **only** thing stored in Perplexity memory. All structured content lives in the GitHub repo.

---

## Operating Principles

1. **Evidence-based only.** Every competitor claim must be verifiable — from their website, reviews, OTA listings, press coverage, or other observable sources. No speculation about internal competitor strategy.

2. **Source everything.** Cite where each piece of information came from — URL, platform, date accessed.

3. **Relative assessment.** Strengths and weaknesses are relative to Memphis Tours, not absolute. A competitor having a good website is only relevant if ours is worse (or better).

4. **Customer perspective matters most.** What customers say about competitors in reviews reveals more than marketing copy. Prioritize review analysis over self-reported positioning.

5. **Price is not just a number.** Compare value propositions, not just prices. A higher-priced competitor with more inclusions may be better value. Assess price-to-value ratio.

6. **Gaps are gold.** The most valuable output of competitive analysis is identifying what nobody does well. That's where differentiation lives.

7. **Update, don't duplicate.** If competitor profiles already exist in the repo, update them with new findings (revise content, update the `updated` date, keep history) rather than creating duplicate entries.

8. **Stay current.** Note when profiles were created. Competitive landscapes change. A profile from 6+ months ago should be flagged for refresh.

---

## Reference Files

- `references/competitor-profile-template.md` — Full competitor profile template with all 9 sections
- `references/benchmark-synthesis.md` — Benchmark matrix, competitive gaps table, competitive threats table, position summary, and strategic recommendations template

Load these files into context when building profiles or writing the synthesis.
