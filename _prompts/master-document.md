# Product Engine — Prompt System Architecture & Guide

## Document Purpose

This document is the comprehensive design specification for the Product Engine prompt system. It explains the architecture, the rationale behind every design decision, and how to use, extend, and evolve the system over time.

**Who this is for**: You — the system architect and operator. This document gives you complete understanding of the prompt system so you can run it, teach it to the team, adapt it as needs change, and build new prompts that are consistent with the architecture.

**What this is NOT**: This is not a user manual for the team. The prompts themselves are self-contained — team members paste them into Perplexity Computer and follow the conversation. They don't need to read this document to use the system.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Why Perplexity Computer](#2-why-perplexity-computer)
3. [The Transformation Model](#3-the-transformation-model)
4. [Prompt Architecture — Four Layers](#4-prompt-architecture--four-layers)
5. [The 4-Phase Rhythm](#5-the-4-phase-rhythm)
6. [AI Modes Per Phase](#6-ai-modes-per-phase)
7. [Inflection Points — Where Intelligence Earns Its Keep](#7-inflection-points--where-intelligence-earns-its-keep)
8. [Initiative Types — The Taxonomy](#8-initiative-types--the-taxonomy)
9. [Capability Model — Atomic Building Blocks](#9-capability-model--atomic-building-blocks)
10. [Memory & Compounding Intelligence](#10-memory--compounding-intelligence)
11. [Acquisition Mode vs Intelligence Mode](#11-acquisition-mode-vs-intelligence-mode)
12. [The Guidance Density Principle](#12-the-guidance-density-principle)
13. [Cold Start Strategy](#13-cold-start-strategy)
14. [The 10-Step Transformation](#14-the-10-step-transformation)
15. [Prompt Inventory & Usage Guide](#15-prompt-inventory--usage-guide)
16. [Extending the System](#16-extending-the-system)
17. [Design Principles — Non-Negotiables](#17-design-principles--non-negotiables)

---

## 1. System Overview

Product Engine is a **prompt-powered intelligence system** that runs on Perplexity Computer. It replaces the Product Department's manual, fragmented workflow — currently spread across spreadsheets and ad-hoc ChatGPT sessions — with a structured, persistent, compounding intelligence system.

**What it is**: A collection of carefully engineered prompts organized into four layers (Foundation, Initiative, Capability, Intelligence) that transform Perplexity Computer from a general-purpose AI agent into a purpose-built Product Department intelligence partner.

**What it is NOT**: A software application. There is no codebase, no deployment, no infrastructure to maintain. The "platform" is Perplexity Computer. The prompts are the application layer. The intelligence compounds through Perplexity's persistent memory system.

**The core insight**: Perplexity Computer already provides multi-model orchestration (19 models), persistent memory, direct MySQL database access (via pymysql), web search, deep research, sub-agent spawning, and workflow execution. We don't need to build any of that. We need to **direct** it — give it the domain knowledge, workflow structure, and quality standards that turn a general-purpose AI agent into the Product Department's Informed Colleague.

### What the System Produces

For any product initiative — entering a new market, optimizing an existing product, repositioning for a new audience, developing a new package — the system produces:

- **Structured intelligence** — market research, competitor benchmarks, persona cards, demand signals, gap analyses — all cited, confidence-rated, and persisted
- **Evidence-based recommendations** — enter/reject/optimize/reposition decisions backed by data, with explicit uncertainty disclosure
- **Reusable artifacts** — every piece of intelligence generated in one initiative is available to every future initiative
- **Decision records** — what was decided, why, what evidence supported it, and what would trigger re-evaluation
- **Compounding institutional memory** — the system gets smarter with every interaction because nothing is ever lost

---

## 2. Why Perplexity Computer

The product brief originally envisioned a custom-built three-layer platform (Intelligence Engine, Workbench, Strategic Command). Perplexity Computer provides the infrastructure for all three layers out of the box:

| Product Brief Concept | Perplexity Computer Capability |
|---|---|
| Intelligence Engine (always-on data) | Persistent memory + MySQL direct connection (pymysql) + web search + Deep Research |
| Workbench (daily operations) | Multi-step workflow execution with sub-agent orchestration |
| Strategic Command (portfolio view) | Cross-session intelligence queries leveraging accumulated memory |
| Conversational Interface ("Informed Colleague") | Native — it's a conversational AI agent |
| AI Context Memory (no reconstruction tax) | Persistent memory across sessions, vector-embedded |
| Multi-model orchestration | 19 models with automatic task routing |
| Document generation | Native file operations and artifact creation |
| Internal data integration | MySQL direct connection (pymysql to `system_travelapp`, host via `MYSQL_HOST` env var) |
| External data integration | Web search + MCP support |

### How Perplexity Computer Routes Tasks

Understanding this helps you design better prompts:

| Model | Automatically Routed For |
|---|---|
| Claude Opus 4.6 *(as of March 2026)* | Core reasoning, orchestration, code, synthesis |
| Gemini *(as of March 2026)* | Deep research (spawns its own sub-agents) |
| GPT-5.2 *(as of March 2026)* | Long-context recall, expansive web search |
| Grok *(as of March 2026)* | Lightweight, speed-sensitive tasks |
| Nano Banana *(as of March 2026)* | Image generation |
| Veo 3.1 *(as of March 2026)* | Video generation |

**Implication for prompts**: When a prompt separates research-heavy steps from analysis-heavy steps, Perplexity Computer naturally routes them to the optimal models. Research goes to Gemini, synthesis goes to Opus, quick lookups go to Grok. This is why the prompts are structured with clearly delineated sub-tasks rather than monolithic instructions.

### Pricing & Access

Perplexity Max: $200/month *(as of March 2026)*. Includes 10,000 credits/month and access to Computer, Deep Research, all models, persistent memory, and full connector suite.

---

## 3. The Transformation Model

The Product Department currently operates a 10-step manual workflow (documented in Sheet1.html) across three scenarios: Optimize Existing Product, Add New Product, and Reposition for New Target Audience.

The prompt system doesn't automate this workflow. It **transforms** it. The transformation has three dimensions:

### Dimension 1: Step Elimination

Not every step survives. Some cease to exist because the Intelligence Engine (Perplexity's persistent memory + data connectors) absorbs their function:

| Step | Current State | Transformed State | Verdict |
|---|---|---|---|
| 1. Create Product Initiative | Human frames the objective | Persists but simplified — framing intent is always human | **Simplified** |
| 2. Collect Market & Internal Inputs | Manual data gathering from multiple sources | Ceases to exist as a discrete step — data is always available via memory + MySQL + web | **Eliminated** |
| 3. Define Buyer Persona(s) | Human creates personas from scratch | System proposes personas from data — human validates, doesn't create | **Inverted** |
| 4. Benchmark Competitors | Manual Google searches and analysis | Automated discovery — human reviews and narrows | **80% Eliminated** |
| 5. Audit Current Product/Page | Periodic manual review | Continuous data availability — "audit" becomes a query, not a project | **Reduced to a query** |
| 6. Define Product Gaps | Human discovers gaps manually | System continuously compares what exists against market expectations — human prioritizes, doesn't discover | **Inverted** |
| 7. Build Market-Ready V1 | Human creates product/positioning | AI assists with options, simulations, drafts — but human makes creative and strategic decisions | **AI-assisted** |
| 8. Prepare Implementation Specs | Manual translation of decisions into specs | Eliminated — if the product is defined in the system, the definition IS the spec | **Eliminated** |
| 9. Review Implementation | Manual review against separate documents | System validates against its own data | **Simplified** |
| 10. Monitor Performance | Periodic manual reporting | Ceases to exist as a step — monitoring IS the Intelligence Engine | **Eliminated** |

**Net result**: The 10-step process becomes a **4-phase rhythm** — Frame, Discover, Decide, Confirm. The collecting, analyzing, and documenting work (roughly 70% of current effort) is absorbed by the system.

### Dimension 2: Scenario Unification

The sheet presents three scenarios as parallel tracks. The prompt system recognizes them as **initiative types** that share a common rhythm but diverge in the action phase. The shared discovery capabilities (persona definition, competitor benchmarking, market intelligence, demand signal mining) work identically regardless of initiative type. Only the creative/strategic decisions in the Decide phase are scenario-specific.

### Dimension 3: Intelligence Compounding

The manual process is stateless — every project starts from zero. The prompt system is cumulative — every piece of intelligence generated in any initiative is persisted and available to every future initiative. The tenth market study isn't just faster than the first — it's qualitatively better, because the system can surface cross-market patterns, recurring competitor strategies, and persona archetypes that no individual study would reveal.

---

## 4. Prompt Architecture — Four Layers

The prompt system is organized into four layers, each with a distinct purpose:

```
Layer 0: FOUNDATION
    └── Business Model Session (run once)
         Populates persistent memory with Memphis Tours' identity

Layer 1: INITIATIVES (run per project)
    ├── Market Entry
    ├── Repositioning
    ├── Product Optimization
    └── New Product Development
         Each encodes the full 4-phase lifecycle

Layer 2: CAPABILITIES (run per task)
    ├── Persona Definition
    ├── Competitor Benchmarking
    ├── Gap Analysis
    ├── Demand Signal Mining
    ├── Product Health Check
    └── Cross-Market Intelligence
         Atomic prompts — work standalone or compose into initiatives

Layer 3: INTELLIGENCE (run on-demand)
    ├── Portfolio Health Query
    ├── Signal Detection
    └── Cross-Initiative Patterns
         Leverage accumulated memory across all initiatives
```

### How Layers Relate

- **Foundation** is prerequisite to everything. Run it once. It establishes the business context that every other prompt references.
- **Initiative prompts** are self-contained end-to-end workflows. They internally invoke the same capabilities that Layer 2 offers as standalone prompts. Use initiative prompts when you're running a full project from start to finish.
- **Capability prompts** are for targeted work outside of a formal initiative. "I just need a competitor benchmark for X" or "Build me persona cards for Y." They draw from Foundation memory and produce artifacts that persist for future use.
- **Intelligence prompts** are for querying what the system already knows. They produce no new research — they synthesize existing intelligence into strategic views. These become more powerful as more initiatives are completed.

### Why This Architecture

**Composability over rigidity.** The original product brief organized the system around three functional workbenches (Market Entry, Product Optimization, Content). The problem: real work often crosses workbench boundaries. Repositioning, for example, requires market intelligence, product audit, AND content rework — touching all three workbenches.

The four-layer architecture solves this. Capabilities are atomic and shared. Initiative types are workflow templates that compose capabilities in the order needed. A repositioning initiative pulls from the same persona capability, the same competitor capability, and the same gap analysis capability as a market entry initiative — but sequences them differently and applies different decision criteria.

This also means new initiative types can be created without new capabilities. A "Product Retirement" initiative, for example, would compose existing capabilities (product health check, demand signal mining, gap analysis) in a new sequence with a different definition of "done."

---

## 5. The 4-Phase Rhythm

Every initiative follows the same four-phase rhythm, regardless of type. This replaces the 10-step linear process with a structured but flexible progression:

### Phase 1: FRAME
**What happens**: The user declares intent. The system listens, classifies, and marshals relevant context.

**Purpose**: Establish what we're trying to do, what we already know, and what "done" looks like for this initiative.

**Key activities**:
- User states the initiative in natural language
- System retrieves all relevant existing intelligence from memory
- System checks internal data (MySQL) for relevant signals
- System presents an initiative summary: what's known, what's unknown, what needs to happen
- User confirms or adjusts

**Duration**: Minutes. This should be fast.

**Exit condition**: User confirms the initiative summary and agrees to proceed.

### Phase 2: DISCOVER
**What happens**: The system leads a comprehensive intelligence-gathering effort. The user reviews, challenges, and refines.

**Purpose**: Build the evidence base that will inform the decision.

**Key activities**:
- Internal demand signal mining (MySQL queries)
- External market research (web search, Deep Research)
- Competitor discovery and analysis
- Persona identification and profiling
- Cross-initiative intelligence (patterns from previous work)
- Gap analysis (where relevant)

**Duration**: The bulk of the work. Perplexity Computer will spawn sub-agents to parallelize research tasks. This phase may take 10-30 minutes of active processing, with the user reviewing outputs as they arrive.

**Exit condition**: Inflection Point 1 — "Is this worth pursuing?"

### Phase 3: DECIDE
**What happens**: The user leads the strategic and creative decisions. The system advises, proposes options, and simulates impact.

**Purpose**: Make the key decisions — what to build, how to position, what to prioritize.

**Key activities**:
- Strategy options with trade-offs
- Impact simulation (projected outcomes per option)
- Risk assessment
- Confidence scoring
- Human makes the call

**Duration**: Variable. This is where strategic thinking happens. The system can work fast, but the human may need time to deliberate.

**Exit condition**: User makes a decision and instructs the system to proceed.

### Phase 4: CONFIRM
**What happens**: Shared validation. The system produces final deliverables. The user reviews and signs off.

**Purpose**: Lock in the decision, produce implementation-ready artifacts, document everything for the record.

**Key activities**:
- Final deliverable generation (recommendation document, persona cards, competitor benchmarks, playbooks)
- Decision record creation
- Memory persistence confirmation — all findings stored for future use
- Cross-referencing with other initiatives flagged

**Duration**: Minutes. Mostly automated.

**Exit condition**: User confirms deliverables. Initiative closes.

---

## 6. AI Modes Per Phase

This is a critical design element. The AI's behavior should be fundamentally different in each phase. If the prompts don't encode this, the system either over-helps (annoying) or under-helps (useless).

| Phase | AI Mode | Behavior | Human Role |
|---|---|---|---|
| Frame | **Listener** | Receives intent, marshals context, confirms understanding. Minimal proactive suggestion. | Declares intent, provides constraints |
| Discover | **Presenter** | Leads the work. Researches, analyzes, synthesizes. Presents findings with confidence ratings. | Reviews, challenges, asks for deeper dives |
| Decide | **Advisor** | Proposes options, models impact, discloses uncertainty. Does NOT make the decision. | Makes strategic and creative calls |
| Confirm | **Validator** | Produces artifacts, checks consistency, ensures persistence. | Reviews and signs off |

### Why This Matters

Without explicit mode encoding, the AI tends toward one of two failure patterns:

1. **Over-eager advisor**: Jumps to recommendations before the evidence is gathered. Makes the user feel like the system has already decided.
2. **Passive report generator**: Dumps data without synthesis. Makes the user do all the analytical work.

The mode mapping prevents both. In the Discover phase, the AI is doing the heavy lifting — but presenting, not deciding. In the Decide phase, the AI steps back to advisory — proposing options, not choosing. This keeps the human in the strategic driver's seat while the AI handles the intelligence work.

---

## 7. Inflection Points — Where Intelligence Earns Its Keep

Between each phase, there's a decision point where the initiative can change direction or exit entirely. These are the moments where the AI's value is highest — not in executing steps, but in synthesizing evidence to inform a decision.

### Inflection Point 0: "What just changed?" (Pre-Initiative)
**Position**: Before any initiative begins.
**What it is**: The system detects a signal — a pattern in booking data, a competitor move, a traffic anomaly — and surfaces it proactively.
**Note**: This inflection point doesn't exist on day one. It emerges as the Intelligence Engine accumulates data and the intelligence prompts are run regularly. It represents the transition from human-initiated to system-initiated workflows.

### Inflection Point 1: "Is this worth pursuing?" (Frame → Discover transition)
**Position**: After discovery is complete, before committing to the Decide phase.
**What the AI presents**:
- Evidence summary table (signal, finding, strength, source)
- Preliminary scores (market attractiveness, product-market fit, competitive opportunity)
- Data confidence assessment (what we know well vs. what we're uncertain about)
- Explicit recommendation: PROCEED / REJECT / PAUSE

**Critical design principle**: REJECT is a valuable, successful outcome. Evidence-based rejection prevents wasted effort and documents the reasoning. The system should celebrate good "no" decisions as much as good "yes" decisions.

### Inflection Point 2: "What kind of initiative is this, actually?" (Within Discover phase)
**Position**: Mid-discovery, when evidence might reclassify the initiative.
**What the AI surfaces**: "Based on the data, this looks more like [different initiative type] than what we started with. Here's why..."
**Example**: An optimization initiative discovers that the product's issues aren't performance-related — the target audience has shifted. The system suggests reclassifying as a repositioning initiative.

### Inflection Point 3: "Is this V1 ready?" (Decide → Confirm transition)
**Position**: After the user makes key decisions, before generating final deliverables.
**What the AI presents**:
- Confidence in the proposed approach
- Specific areas of uncertainty
- What additional information would increase confidence
- Recommendation: PROCEED to deliverables / ITERATE on specific aspects

### Design Principle: Every Inflection Point is a Potential Exit

The system should make it as easy and as valuable to STOP as to CONTINUE. The original 10-step sheet only knows forward motion. The prompt system embraces exits at every inflection point. An initiative that closes with a well-documented "no" is a successful outcome — it saved the team from pursuing a bad idea and created an evidence record for future reference.

---

## 8. Initiative Types — The Taxonomy

The system recognizes four core initiative types, each with a distinct trigger, workflow emphasis, and definition of "done":

### Market Entry
**Trigger**: "Should we target [market] as a source market?"
**Emphasis**: Heavy on external research, market sizing, competitive landscape, persona discovery. Light on internal product data (the product may not exist yet for this market).
**Definition of Done**: Evidence-based recommendation to enter, monitor, or reject, with full supporting artifacts (personas, competitor benchmark, market assessment).
**Phase where value concentrates**: Discover (evidence gathering is the core work).

### Repositioning
**Trigger**: "Can we adapt [existing product] for [new audience]?"
**Emphasis**: Hybrid — requires both internal product understanding AND external market/audience research. Heaviest use of gap analysis (comparing what exists against what the new audience expects).
**Definition of Done**: Repositioning strategy with specific changes to positioning, content, and potentially product structure. Evidence trail showing why the new audience is viable.
**Phase where value concentrates**: Decide (the creative/strategic work of redefining positioning).

### Product Optimization
**Trigger**: "This product is underperforming / How can we improve [product]?"
**Emphasis**: Heavy on internal data — bookings, amendments, conversion rates, traffic patterns. Competitive analysis focused on same-product competitors. Persona validation (are we serving the right audience correctly?).
**Definition of Done**: Specific optimization recommendations with projected impact, prioritized by effort-to-impact ratio.
**Phase where value concentrates**: Discover (diagnostic analysis of internal data).

### New Product Development
**Trigger**: "We need a new product for [audience/destination]."
**Emphasis**: Creative latitude is highest. Draws heavily from persona research and competitive whitespace analysis. Internal data provides demand validation but not a product template.
**Definition of Done**: Product definition (structure, positioning, content direction, pricing framework) with market validation evidence.
**Phase where value concentrates**: Decide (creative product design decisions).

### Future Initiative Types (Not Yet Prompted)

The capability architecture supports additional initiative types that can be added as the system matures:

- **Product Retirement** — "Should we sunset [product]?" Composes: product health check, demand signal mining, cannibalization analysis, portfolio impact assessment.
- **Competitive Response** — "Competitor X just launched Y. What should we do?" Composes: competitor benchmarking, gap analysis, impact simulation.
- **Opportunity Pursuit** — System-initiated. "Three markets are showing demand for a product type we don't offer." Composes: cross-market intelligence, demand validation, new product development.

These don't require new capabilities — just new prompt templates that compose existing capabilities in new sequences with different decision criteria.

---

## 9. Capability Model — Atomic Building Blocks

Capabilities are the atomic units of the system. Each capability prompt is independently runnable and produces a specific artifact. Initiative prompts compose capabilities in sequence. Capability prompts can also be run standalone for ad-hoc work.

### Capability Inventory

| Capability | Input | Output Artifact | Used By |
|---|---|---|---|
| Persona Definition | Market/audience context | Persona card(s) with demographics, motivations, behaviors | All initiative types |
| Competitor Benchmarking | Market + product context | Competitor benchmark summary (players, positioning, pricing, gaps) | All initiative types |
| Gap Analysis | Current product + target audience expectations | Gap & issues list with severity and priority | Repositioning, Optimization |
| Demand Signal Mining | Market or product identifier | Demand signal report from MySQL data (bookings, traffic, amendments) | All initiative types |
| Product Health Check | Product identifier | Composite health assessment (traffic, conversion, booking trends, amendments) | Optimization, Retirement |
| Cross-Market Intelligence | 2+ markets or "all" | Pattern report (recurring personas, shared competitors, structural similarities) | Market Entry, Strategic planning |

### Capability Design Principles

1. **Self-contained**: Each capability prompt includes its own output contract, quality criteria, and memory persistence instructions. It doesn't assume it's being called from an initiative.
2. **Context-aware**: Each capability prompt retrieves relevant existing intelligence from memory before starting new work. If persona cards already exist for this market, the system builds on them rather than starting from scratch.
3. **Artifact-producing**: Every capability produces a named, structured artifact that persists in memory. "Persona Card: German Leisure Traveler" is retrievable by name in any future session.
4. **Composable**: Capabilities declare their inputs and outputs. Initiative prompts use these declarations to sequence capabilities correctly (e.g., gap analysis requires persona cards and competitor benchmark as inputs).

---

## 10. Memory & Compounding Intelligence

Perplexity Computer's persistent memory is the backbone of the entire system. It serves three functions:

### Function 1: Business Context Persistence
The Foundation prompt populates memory with Memphis Tours' identity — brands, destinations, segments, policies, business model. Every subsequent prompt retrieves this context automatically. This eliminates the "context reconstruction tax" that plagues ad-hoc ChatGPT sessions.

### Function 2: Initiative Artifact Storage
Every artifact produced by any initiative or capability prompt — persona cards, competitor benchmarks, market assessments, demand signal reports, decision records — is persisted to memory. Future prompts can retrieve these by name or by association (e.g., "everything we know about the German market").

### Function 3: Cross-Initiative Intelligence
As artifacts accumulate across multiple initiatives, the Intelligence layer prompts can query across them: "What competitor appears in 3+ of our market studies?" "What persona archetype recurs across markets?" "What product gap has been identified in multiple contexts?" This cross-initiative intelligence is impossible with manual processes and is the system's highest-value capability over time.

### The Compounding Effect

- **Initiative 1**: Everything is new. Full research required. The system is in acquisition mode.
- **Initiative 5**: The system has accumulated competitor data across multiple markets, persona patterns are emerging, and the business context is deeply understood. Discovery phases are faster because 30-50% of the intelligence already exists.
- **Initiative 20**: The system has a comprehensive market map, a persona library, a competitor database, and a track record of recommendations. New initiatives start from a position of rich context. The Intelligence layer can surface strategic patterns that no individual study would reveal.

This compounding is automatic — it's built into how each prompt persists its artifacts. But it only works if prompts are consistently used. Ad-hoc, un-prompted conversations with Perplexity don't persist artifacts in the structured way the prompts require.

---

## 11. Acquisition Mode vs Intelligence Mode

The system operates in two modes per domain, and the prompts make this visible to the user:

### Acquisition Mode
**When**: The system has no or minimal existing intelligence on a topic.
**Behavior**: The system is explicit about what it doesn't know. It says: "I don't have competitor data for the German Egypt market yet — let's build it together. What I learn here will be available for all future work."
**User experience**: Feels like building a knowledge base collaboratively. Every interaction is explicitly captured and structured.
**Value proposition**: "We're investing in building this intelligence once. You'll never have to gather this again."

### Intelligence Mode
**When**: The system has accumulated substantial intelligence on a topic.
**Behavior**: The system leads with what it already knows. It says: "Based on 3 previous studies, here's what we know about competitor positioning in this space. Here's what's changed since our last analysis. Here's what's still uncertain."
**User experience**: Feels like consulting an expert colleague who's been tracking this topic for months.
**Value proposition**: "The system already knows this. Let's build on it, not rebuild it."

### The Transition

The transition isn't binary — it's per-domain, per-capability. You might be in intelligence mode for competitor data (rich library built over months) and acquisition mode for persona data (never studied this specific audience before). The prompts surface this explicitly through the confidence map:

```
Intelligence Status for [Market/Product]:
- Business context: HIGH (Foundation session complete)
- Competitor landscape: MEDIUM (3 competitors profiled, last updated 6 weeks ago)
- Buyer personas: NONE (no previous research)
- Internal demand signals: HIGH (MySQL data available, last queried today)
- Product-market fit: NONE (not yet assessed)
```

This confidence map appears at the start of every initiative's Discover phase. It tells the user exactly where the system is knowledgeable and where it's starting from scratch.

---

## 12. The Guidance Density Principle

The system's guidance density — how much it suggests, explains, and structures — should be inversely proportional to the user's intent clarity.

### Three Interaction Modes

| User Intent | System Behavior | Example |
|---|---|---|
| **Clear** | Execute and present — minimal friction | "Benchmark competitors for Egypt travel in the German market" → system works, presents results |
| **Fuzzy** | Clarify and guide — conversational discovery | "Something feels off with our Jordan packages" → system asks questions, surfaces data, helps sharpen intent |
| **None (system-initiated)** | Alert and recommend — system leads | "Amendment rates on Egypt Premium packages have increased 40% in 6 weeks. This pattern typically indicates product-market misfit. Recommend initiating a Product Optimization study." |

### Implementation in Prompts

The initiative prompts handle this through the Frame phase. If the user provides a clear intent ("Evaluate Australia as a new source market"), the Frame phase is fast — confirm understanding, present what's known, move to Discover. If the user provides a fuzzy intent ("I've been thinking about Australia"), the Frame phase becomes a structured conversation that helps crystallize the intent before committing to a specific initiative type.

The third mode (system-initiated) requires accumulated intelligence and regular running of the Intelligence layer prompts. It represents the system's maturity state — when it can proactively surface opportunities and risks rather than waiting for human triggers.

---

## 13. Cold Start Strategy

On day one, the system has no accumulated intelligence. The cold start strategy is designed to build value fast while managing expectations.

### Week 1: The Foundation Session

**What**: Run the Business Model Session prompt (foundation/business-model-session.md). A single structured conversation that populates Perplexity's memory with everything the system needs to know about Memphis Tours.

**Covers**: Company overview, brands, destination portfolio, source markets (current and aspirational), customer segments, tier structure, pricing philosophy, policies, competitive positioning, distribution channels, business model, internal data landscape.

**Outcome**: Every future prompt starts with rich business context. This is the single highest-ROI hour the team will spend.

**Why it matters**: Without this, every prompt starts with "tell me about your company" — replicating the exact problem the system is designed to eliminate.

### Weeks 2-3: The First Initiative

**What**: Pick a market the team is curious about. Run the full Market Entry initiative prompt. Everything gathered — competitor analysis, persona research, market assessment — gets persisted.

**Expectations to set**: The first initiative won't be dramatically faster than manual work. The system is in full acquisition mode — it's building everything from scratch. The visible payoff is:
1. The output quality matches or exceeds manual work
2. Nothing is lost — every finding is structured and persisted
3. The decision record provides an auditable trail the team has never had

### Week 4: The Compounding Moment

**What**: Run a second initiative — ideally one with some overlap with the first (similar region, overlapping competitor landscape, related audience). The system should surface connections from the first initiative unprompted.

**The "aha" moment**: The user asks about a different market, and the system says "This competitor also appeared in our [first market] study — here's how their positioning differs between the two markets." The user didn't ask for this connection. The system made it.

**If this moment doesn't happen**: Check that memory persistence is working correctly. The prompts explicitly instruct the AI to persist artifacts and cross-reference — but Perplexity's memory system needs the data to be there. This is diagnosable.

### Ongoing: The Confidence Map

From the first initiative onward, every initiative's Frame phase includes a confidence map showing what the system knows and doesn't know. This makes the compounding value visible — over time, more domains shift from "NONE" to "HIGH." This isn't a progress bar. It's proof that the system is learning.

---

## 14. The 10-Step Transformation

For reference — how the original 10-step process (Sheet1.html) maps to the prompt system:

| Old Step | Old Activity | New Reality | Where It Lives |
|---|---|---|---|
| 1. Create Product Initiative | Select/define what to work on | **Frame phase** — user declares intent, system classifies | Initiative prompts, Frame phase |
| 2. Collect Market & Internal Inputs | Manual data gathering | **Eliminated** — Intelligence Engine is always available | Memory + MySQL direct connection (pymysql) + web |
| 3. Define Buyer Persona(s) | Human creates personas | **Inverted** — system proposes, human validates | Persona Definition capability |
| 4. Benchmark Competitors | Manual research | **80% eliminated** — automated discovery, human narrows | Competitor Benchmarking capability |
| 5. Audit Current Product/Page | Periodic manual review | **Reduced to a query** — "show me the state of X" | Product Health Check capability |
| 6. Define Product Gaps | Human discovers gaps | **Inverted** — system identifies, human prioritizes | Gap Analysis capability |
| 7. Build Market-Ready V1 | Human creates product | **AI-assisted** — system proposes, simulates, drafts; human decides | Initiative prompts, Decide phase |
| 8. Prepare Implementation Specs | Manual spec writing | **Eliminated** — the product definition IS the spec | Initiative prompts, Confirm phase |
| 9. Review Implementation | Manual verification | **Simplified** — system validates against its own data | Initiative prompts, Confirm phase |
| 10. Monitor Performance | Periodic reporting | **Eliminated as a step** — continuous data availability | Product Health Check + Intelligence prompts |

**Net**: 10 steps → 4 phases. 3 steps eliminated. 3 steps inverted (human-discovers → system-proposes). 4 steps simplified or AI-assisted.

---

## 15. Prompt Inventory & Usage Guide

### Directory Structure

```
_prompts/
├── master-document.md                    ← You are here
├── foundation/
│   └── business-model-session.md         ← Run FIRST. Once only.
├── initiatives/
│   ├── market-entry.md                   ← Full market entry lifecycle
│   ├── repositioning.md                  ← Full repositioning lifecycle
│   ├── product-optimization.md           ← Full optimization lifecycle
│   └── new-product-development.md        ← Full new product lifecycle
├── capabilities/
│   ├── persona-definition.md             ← Standalone persona creation
│   ├── competitor-benchmarking.md        ← Standalone competitor analysis
│   ├── gap-analysis.md                   ← Standalone gap identification
│   ├── demand-signal-mining.md           ← Standalone MySQL data analysis
│   ├── product-health-check.md           ← Standalone product assessment
│   └── cross-market-intelligence.md      ← Cross-market pattern queries
└── intelligence/
    ├── portfolio-health.md               ← Portfolio-level health view
    ├── signal-detection.md               ← Proactive signal scanning
    └── cross-initiative-patterns.md      ← Pattern mining across initiatives
```

### Usage Decision Tree

```
"I need to..."

├── Set up the system for the first time
│   └── Run: foundation/business-model-session.md
│
├── Run a complete end-to-end project
│   ├── Evaluate a new source market → initiatives/market-entry.md
│   ├── Adapt a product for a new audience → initiatives/repositioning.md
│   ├── Fix an underperforming product → initiatives/product-optimization.md
│   └── Create a new product → initiatives/new-product-development.md
│
├── Do a specific piece of work (not a full initiative)
│   ├── Build persona cards → capabilities/persona-definition.md
│   ├── Analyze competitors → capabilities/competitor-benchmarking.md
│   ├── Find gaps in a product → capabilities/gap-analysis.md
│   ├── Mine booking/traffic data → capabilities/demand-signal-mining.md
│   ├── Check product health → capabilities/product-health-check.md
│   └── Compare across markets → capabilities/cross-market-intelligence.md
│
├── Understand the big picture
│   ├── Portfolio health overview → intelligence/portfolio-health.md
│   ├── What signals should I act on? → intelligence/signal-detection.md
│   └── What patterns are emerging? → intelligence/cross-initiative-patterns.md
```

### Sequencing for New Users

1. **Day 1**: Run foundation/business-model-session.md
2. **Day 1-2**: Run one initiative prompt end-to-end (market-entry.md recommended as first)
3. **Week 2+**: Run second initiative or standalone capabilities as needed
4. **Monthly**: Run intelligence prompts to surface cross-initiative patterns

---

## 16. Extending the System

### Adding a New Initiative Type

To create a new initiative type (e.g., Product Retirement):

1. Identify the trigger: "Should we sunset [product]?"
2. Map the 4-phase rhythm for this initiative type — what happens in Frame, Discover, Decide, Confirm?
3. Identify which existing capabilities it uses (Product Health Check, Demand Signal Mining, Gap Analysis)
4. Define the inflection points — where does the initiative pause for human decision?
5. Define the output artifacts — what deliverables does this initiative produce?
6. Define "done" — what marks this initiative as complete?
7. Write the prompt following the pattern established by existing initiative prompts

### Adding a New Capability

To add a new capability (e.g., Pricing Analysis):

1. Define the input: What does this capability need to start?
2. Define the output artifact: What named, structured artifact does it produce?
3. Define the quality criteria: What makes a good output vs. a bad one?
4. Write the prompt with: context retrieval, execution instructions, output contract, memory persistence instructions
5. Update the initiative prompts that should compose this capability

### Evolving Existing Prompts

As the system accumulates intelligence, prompts may need adjustment:

- **Tighten output contracts**: Early prompts may produce verbose outputs. Once you know what's useful, tighten the format specifications.
- **Add cross-references**: As the artifact library grows, prompts can reference more existing intelligence. "Compare against all existing persona cards" becomes more valuable over time.
- **Increase confidence thresholds**: Early on, low-confidence findings are acceptable. Over time, raise the bar — the system should have enough accumulated intelligence to produce higher-confidence outputs.

---

## 17. Design Principles — Non-Negotiables

These principles are embedded in every prompt. They are not optional.

### 1. Never Invent Data
If the system doesn't know something, it says "I don't have this" and suggests how to get it. No hallucination. No fabrication. No confident statements without evidence. This is the foundation of trust.

### 2. Cite Everything
Every external claim includes a source. Every internal data point references the MySQL query that produced it. The user should be able to verify any finding independently.

### 3. Disclose Uncertainty
Every finding carries a confidence rating. The system distinguishes between facts, inferences, and assumptions — and labels each. "I'm confident about X because of these 5 sources. I'm uncertain about Y because I only found 1 conflicting source. I'm assuming Z — if this assumption is wrong, the conclusion changes."

### 4. Persist Everything
Every artifact is named, structured, and stored to memory. The system explicitly confirms persistence at the end of every prompt execution. Nothing is ever a throwaway.

### 5. Celebrate Good "No" Decisions
Rejecting an opportunity with evidence is a valuable outcome. The system treats "don't enter this market" with the same rigor and artifact quality as "enter this market." Decision records capture rejection reasoning with the same completeness as approval reasoning.

### 6. Human Decides, AI Informs
The system never makes strategic or creative decisions. It proposes, simulates, advises, and discloses. The human makes the call. The mode mapping (listener → presenter → advisor → validator) enforces this at every phase.

### 7. Structure for Reuse
Every artifact is designed to be useful beyond the initiative that produced it. Persona cards, competitor benchmarks, market assessments — all structured consistently so they can be retrieved and compared across initiatives.

### 8. Make Intelligence Status Visible
The system is always transparent about what it knows, what it doesn't, and how confident it is. The confidence map at the start of every initiative makes this explicit. The user should never have to guess whether the system is speaking from deep intelligence or from a single source.

---

## Appendix: Key Terms

| Term | Definition |
|---|---|
| **Initiative** | A named, persistent unit of work with a goal, a type, and a definition of done |
| **Capability** | An atomic prompt that produces a specific artifact (e.g., persona cards, competitor benchmark) |
| **Artifact** | A named, structured output that persists in memory (e.g., "Persona Card: German Leisure Traveler") |
| **Confidence Map** | A per-domain assessment of intelligence completeness shown at initiative start |
| **Inflection Point** | A decision point between phases where the initiative can proceed, pivot, or exit |
| **Acquisition Mode** | System behavior when intelligence is sparse — explicitly collaborative, building knowledge |
| **Intelligence Mode** | System behavior when intelligence is rich — leading with what it knows, building on it |
| **Foundation** | The one-time Business Model Session that establishes persistent business context |
| **Informed Colleague** | The interaction pattern — the AI behaves like a knowledgeable teammate, not a tool |

---

*This document is the design specification for the Product Engine prompt system. It should be updated as the system evolves — new initiative types, new capabilities, refined principles, and lessons learned from actual use.*
