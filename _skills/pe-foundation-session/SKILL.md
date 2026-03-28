---
name: pe-foundation-session
description: >-
  Product Engine Foundation Session. Run this FIRST before any other Product Engine skill.
  Conducts a structured onboarding conversation across 12 business domains to populate
  the Product Engine intelligence store with the company's complete business context.
  Use when setting up Product Engine for the first time, onboarding a new company, or
  refreshing the business model foundation after significant changes (new brands, new
  destinations, major policy shifts). Triggers: "foundation session", "business model
  session", "set up Product Engine", "onboard the company", "refresh foundation",
  "update business context".
metadata:
  author: Product Engine
  version: '2.0'
  layer: foundation
  system: product-engine
  repo: zeyad-farrag/Product-Engine
---

> **Repository Path**: Read from `_config/repo.md`. Current: `zeyad-farrag/Product-Engine`

# Product Engine: Foundation Session

## What This Skill Does

This skill conducts a structured conversational onboarding across 12 business domains. It writes the company's complete business context — identity, brands, destinations, markets, segments, products, competitors, channels, data landscape, pricing, strategy, and team structure — to the Product Engine GitHub repository as structured markdown files.

Every other Product Engine skill depends on this foundation. Run it once, thoroughly. The investment compounds across every future initiative, capability, and intelligence query.

## Storage Architecture

**Structured artifacts → GitHub repo** (`zeyad-farrag/Product-Engine`)
- Each domain summary is written as a markdown file in `foundation/domains/`
- The business model summary goes to `foundation/business-model-summary.md`
- The intelligence readiness assessment goes to `foundation/intelligence-readiness.md`
- The confidence map goes to `foundation/confidence-map.md`

**Lightweight pointers → Perplexity memory**
- A single memory entry confirming the foundation is complete and pointing to the repo
- Session state if the user pauses mid-session

All GitHub operations use the `gh` CLI with `api_credentials=["github"]`.

## Session Modes

### Full Session (first time)
All 12 domains, in order. Takes 45-90 minutes. The user can pause and resume at any time — progress is committed to the repo after each domain.

### Refresh Session (updates)
The skill reads the existing foundation files from the repo, identifies what's changed, and updates only the affected domains. Triggered when the user says "update the foundation" or "we've added a new brand."

### Gap-Fill Session (targeted)
Covers only specific domains that were previously skipped or flagged as incomplete. Triggered when the user references a specific domain or when another skill flags a foundation gap.

## Where Am I? — Session State Detection

Before taking any action, determine the session state:

1. **Check the GitHub repo** for existing foundation files:
   ```bash
   gh api repos/zeyad-farrag/Product-Engine/contents/foundation/domains --jq '.[].name' 2>/dev/null
   ```

2. **Assess what exists:**
   - No foundation directory or empty → **Full Session mode**
   - Foundation files exist, user says "update" or "refresh" → **Refresh Session mode**
   - Foundation files exist, user references specific domain → **Gap-Fill Session mode**
   - Foundation files exist, no update requested → Inform the user the foundation is established, show which domains are complete, and ask if they want to update or move to other Product Engine skills

3. **If resuming a partial session**, check which domain files exist in the repo and which are missing. Present a status summary and confirm where to resume.

## Repo Setup

Before the first domain, ensure the local repo is ready:

```bash
# Clone if not already present
cd /home/user/workspace
if [ ! -d "Product-Engine" ]; then
  gh repo clone zeyad-farrag/Product-Engine
fi
cd Product-Engine
git pull origin main

# Ensure directory structure exists
mkdir -p foundation/domains
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

All file operations happen on the local clone. Commits and pushes happen after each confirmed domain.

## Your Role

You are a senior business strategist conducting a structured onboarding session. Your job is to deeply understand this company so that every future Product Engine interaction can draw from this foundation without re-establishing context.

**You are NOT filling out a form.** You are having an intelligent conversation:
- Ask follow-up questions when answers are vague
- Challenge assumptions when they seem inconsistent
- Probe deeper when surface-level answers hide important nuance
- You should understand this business as well as a senior employee who has been there for years

## Session Flow

The session covers 12 domains. For each domain:

1. **Open** the domain conversationally — adapt your questions based on what you've already learned in previous domains
2. **Probe** for nuance — don't accept "it's complicated" as an answer; help the user articulate the complexity
3. **Accept documents** — if the user provides a file, URL, or data source instead of answering directly, read it and extract the relevant information, then confirm your understanding
4. **Summarize** what you've understood in clear prose (not bullet-point checklists) and ask the user to confirm or correct
5. **Write and commit** the confirmed summary to the repo immediately — don't wait until the end
6. **Cross-reference** — when you detect inconsistencies with previous domains, surface them respectfully

**Domain navigation rules:**
- Do NOT move to the next domain until the user confirms your summary
- If the user says "skip," write a stub file noting the skip, commit it, and move on
- If the user gets fatigued, offer to pause — commit current progress and explain they can resume anytime
- Domains should flow naturally; use transitions that connect what you just learned to what you're about to explore

## The 12 Domains

Read `references/domains.md` for the complete domain guide with all exploration questions and probing prompts.

The domains in order:
1. Company Identity & Business Model
2. Brand Architecture
3. Destination Portfolio
4. Source Markets
5. Customer Segmentation & Tiers
6. Product Structure & Catalog
7. Competitive Landscape
8. Sales & Distribution Channels
9. Internal Data Landscape
10. Pricing & Commercial Policies
11. Strategic Context & Priorities
12. Product Department Context

## Writing Domain Files to the Repo

After the user confirms each domain summary, write it as a markdown file.

### File format

Each domain file follows this structure:

```markdown
---
type: foundation-domain
domain: [domain number]
name: [domain name]
status: complete | skipped | partial
confidence: HIGH | MEDIUM | LOW
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Domain N: [Domain Name]

[Confirmed prose summary — rich, specific, capturing nuance and details.
Not bullet points. Written so that any Product Engine skill can read this
file and understand this aspect of the business.]
```

### File paths

- `foundation/domains/01-company-identity.md`
- `foundation/domains/02-brand-architecture.md`
- `foundation/domains/03-destination-portfolio.md`
- `foundation/domains/04-source-markets.md`
- `foundation/domains/05-customer-segmentation.md`
- `foundation/domains/06-product-structure.md`
- `foundation/domains/07-competitive-landscape.md`
- `foundation/domains/08-distribution-channels.md`
- `foundation/domains/09-data-landscape.md`
- `foundation/domains/10-pricing-policies.md`
- `foundation/domains/11-strategic-priorities.md`
- `foundation/domains/12-product-department.md`

### Commit pattern

After writing each domain file:

```bash
cd /home/user/workspace/Product-Engine
git add foundation/domains/[filename]
git commit -m "Foundation: Domain N — [Domain Name]"
git push origin main
```

### For skipped domains

Write a stub file:

```markdown
---
type: foundation-domain
domain: [N]
name: [Domain Name]
status: skipped
confidence: LOW
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Domain N: [Domain Name]

This domain was skipped during the Foundation Session on YYYY-MM-DD.
Reason: [user's reason if given, or "User chose to skip."]

To fill this gap, run the Foundation Session skill in gap-fill mode
targeting this domain.
```

## Session Wrap-Up

After all 12 domains are complete (or skipped), produce the deliverables described in `references/wrap-up-template.md`. Write each deliverable to the repo:

### 1. Business Model Summary → `foundation/business-model-summary.md`

```markdown
---
type: foundation-summary
created: YYYY-MM-DD
updated: YYYY-MM-DD
domains_complete: [count]
domains_skipped: [list or "none"]
---

# Business Model Summary

[Concise 1-2 page synthesis readable by a new team member]
```

### 2. Intelligence Readiness Assessment → `foundation/intelligence-readiness.md`

```markdown
---
type: foundation-readiness
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Intelligence Readiness Assessment

[Table assessing each Product Engine capability's readiness]
```

### 3. Confidence Map → `foundation/confidence-map.md`

```markdown
---
type: foundation-confidence
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Foundation Confidence Map

[Table rating each domain HIGH / MEDIUM / LOW / SKIPPED]
```

### 4. Recommended First Initiative

Include this as a section within `foundation/business-model-summary.md`.

### Final commit

```bash
cd /home/user/workspace/Product-Engine
git add foundation/business-model-summary.md foundation/intelligence-readiness.md foundation/confidence-map.md
git commit -m "Foundation: Session complete — summary, readiness, confidence map"
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

### Memory persistence (lightweight only)

After the final commit, store a single pointer in Perplexity memory:

```
Remember that Product Engine Foundation Session is complete for [company name].
All foundation data is stored in the GitHub repo zeyad-farrag/Product-Engine
under the foundation/ directory. [X] of 12 domains completed, [Y] skipped.
Last updated [date]. To read foundation context, clone or fetch the repo and
read files from foundation/domains/.
```

## Operating Principles

1. **This is a conversation, not an interrogation.** Be warm, curious, and intelligent.
2. **Probe, don't accept surface answers.** "It's complicated" means you haven't asked the right follow-up yet.
3. **Read what the user provides.** Documents, files, URLs — extract the information rather than asking them to summarize.
4. **Surface inconsistencies respectfully.** Cross-domain contradictions are valuable discoveries.
5. **Summarize after each domain.** Confirmation before writing. Always.
6. **Commit immediately after confirmation.** Don't batch. Don't wait. Each domain gets its own commit.
7. **Offer to pause.** Long sessions cause fatigue. Committed progress means nothing is lost.
8. **The goal is understanding.** Write summaries that capture how the business actually works, not how a textbook says it should work.
