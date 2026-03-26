# Product Engine

The Product Department's intelligence system. Runs on Perplexity Computer.

## Quick Start

1. **Install skills** — Download any skill from `_skills/` and upload at [perplexity.ai/computer/skills](https://www.perplexity.ai/computer/skills)
2. **Connect GitHub** — Connect your GitHub account in Perplexity Computer to enable artifact storage
3. **Run the Foundation Session** — Tell Perplexity Computer: `"Run the foundation session"`. This populates the business context every other skill depends on.

## What You Can Do

Just tell Perplexity Computer what you need. The skills load automatically.

| Need | Say This | Skill |
|---|---|---|
| **Evaluate a new market** | "Should we target Australia as a source market?" | pe-market-entry |
| **Fix an underperforming product** | "This Egypt Premium package is underperforming" | pe-product-optimization |
| **Adapt a product for a new audience** | "Can we adapt this package for the French market?" | pe-repositioning |
| **Design a new product** | "We need a new diving package for the German market" | pe-new-product-development |
| **Build persona cards** | "Build me persona cards for the UK market" | pe-persona-definition |
| **Analyze competitors** | "Benchmark competitors for Egypt travel in Germany" | pe-competitor-benchmarking |
| **Mine demand signals** | "What does the booking data tell us about Jordan?" | pe-demand-signal-mining |
| **Check product health** | "How is the Nile Cruise performing?" | pe-product-health-check |
| **Find product gaps** | "Where are the gaps in our premium offering?" | pe-gap-analysis |
| **Compare markets** | "Compare the German and UK markets" | pe-cross-market-intelligence |
| **Portfolio overview** | "Give me the department view" | pe-portfolio-health |
| **Signal scan** | "What's changed? Run a signal scan" | pe-signal-detection |
| **Strategic patterns** | "What patterns are emerging across our work?" | pe-cross-initiative-patterns |
| **Search intelligence** | "What do we know about Germany?" | pe-memory-query |
| **Memory maintenance** | "Rebuild the index" | pe-memory-maintenance |

## How Intelligence Compounds

Every skill you run produces artifacts that persist in this repo. Future skills build on what's already known.

- **Run 1**: Everything is new. Full research. The system is learning.
- **Run 5**: 30-50% of intelligence already exists. Discovery is faster.
- **Run 20**: Comprehensive market map, persona library, competitor database. The system surfaces patterns no individual study could reveal.

## System Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full technical spec.

```
_skills/              ← 16 skills across 5 layers
foundation/           ← Business model context (run once)
artifacts/            ← All intelligence outputs
  personas/           ← Buyer persona cards
  competitors/        ← Competitor profiles
  demand-signals/     ← Demand signal reports
  health-checks/      ← Product health assessments
  gap-analyses/       ← Gap analysis reports
  market-assessments/ ← Market assessment reports
  decision-records/   ← Initiative decision records
initiatives/          ← Active and closed initiatives
intelligence/         ← Portfolio health, signals, patterns
  _index/             ← Shared memory index files
```

## Dashboard

The Product Engine Dashboard is a separate web app that visualizes this repo's contents and connects to the MySQL database for real-time performance tracking.

## Skills by Layer

**Foundation** (run once)
- `pe-foundation-session` — Populates business context

**Initiatives** (full project lifecycle)
- `pe-market-entry` — Evaluate new source markets
- `pe-product-optimization` — Diagnose and fix products
- `pe-repositioning` — Adapt products for new audiences
- `pe-new-product-development` — Design new products

**Capabilities** (standalone tasks)
- `pe-persona-definition` — Build buyer persona cards
- `pe-competitor-benchmarking` — Analyze competitors
- `pe-demand-signal-mining` — Mine booking/traffic data
- `pe-product-health-check` — Assess product health
- `pe-gap-analysis` — Find product-market gaps
- `pe-cross-market-intelligence` — Compare across markets

**Intelligence** (periodic synthesis)
- `pe-portfolio-health` — Portfolio-level health view
- `pe-signal-detection` — Detect emerging signals
- `pe-cross-initiative-patterns` — Mine patterns across initiatives

**Memory** (shared intelligence management)
- `pe-memory-query` — Search and synthesize knowledge
- `pe-memory-maintenance` — Index management and hygiene
