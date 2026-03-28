import type { Artifact, Initiative, Signal, QuickAction, FreshnessEntry, Skill, SkillDetail } from "@shared/schema";

const MARKETS = ["Germany", "United Kingdom", "Australia", "France"];
const ARTIFACT_TYPES = ["Persona", "Competitor", "Demand Signal", "Health Check", "Gap Analysis", "Market Assessment"];

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

export const mockArtifacts: Artifact[] = [
  // Germany — good coverage
  { id: "a1", type: "Persona", subject: "German Family Traveler", markets: ["Germany"], destinations: ["Hurghada", "Sharm El Sheikh"], updated: daysAgo(5), created: daysAgo(60), author: "pe-persona-definition", confidence: "HIGH", status: "ACTIVE", summary: "Budget-conscious families from NRW/Bavaria seeking all-inclusive Red Sea packages. Peak demand Dec-Feb and Jul-Aug." },
  { id: "a2", type: "Competitor", subject: "FTI Touristik (DE)", markets: ["Germany"], destinations: ["Hurghada"], updated: daysAgo(12), created: daysAgo(90), author: "pe-competitor-benchmarking", confidence: "HIGH", status: "ACTIVE", summary: "FTI holds ~18% of German Egypt market share. Aggressive pricing on charter flights. Weak on premium segment." },
  { id: "a3", type: "Demand Signal", subject: "Red Sea Diving Interest Surge", markets: ["Germany"], destinations: ["Marsa Alam"], updated: daysAgo(3), created: daysAgo(3), author: "pe-demand-signal-mining", confidence: "MEDIUM", status: "ACTIVE", summary: "+42% YoY search volume for 'Tauchen Rotes Meer' on Google Trends DE. Social media mentions up 35%." },
  { id: "a4", type: "Health Check", subject: "Germany Package Performance Q4", markets: ["Germany"], destinations: ["Hurghada", "Sharm El Sheikh"], updated: daysAgo(20), created: daysAgo(20), author: "pe-product-health-check", confidence: "HIGH", status: "ACTIVE", summary: "Conversion rate 4.2% (above benchmark). AOV €1,840. Repeat booking rate 28%.", dependsOn: ["a1"] },
  { id: "a5", type: "Gap Analysis", subject: "Germany Premium Gap", markets: ["Germany"], destinations: ["Hurghada"], updated: daysAgo(15), created: daysAgo(45), author: "pe-gap-analysis", confidence: "MEDIUM", status: "ACTIVE", summary: "No premium/boutique offering for German market. Competitors have 3-4 luxury options.", dependsOn: ["a1", "a4"] },
  
  // UK — moderate coverage
  { id: "a6", type: "Persona", subject: "UK Young Couple", markets: ["United Kingdom"], destinations: ["Sharm El Sheikh"], updated: daysAgo(30), created: daysAgo(120), author: "pe-persona-definition", confidence: "HIGH", status: "ACTIVE", summary: "25-35 year olds from London/SE seeking Instagram-worthy beach + nightlife. Price-sensitive but willing to pay for experiences." },
  { id: "a7", type: "Competitor", subject: "TUI UK Egypt Programs", markets: ["United Kingdom"], destinations: ["Hurghada", "Sharm El Sheikh"], updated: daysAgo(95), created: daysAgo(180), author: "pe-competitor-benchmarking", confidence: "MEDIUM", status: "STALE", summary: "TUI dominates UK-Egypt corridor with 40% share. Strong charter program from Manchester and Gatwick." },
  { id: "a8", type: "Health Check", subject: "UK Sharm Performance Q4", markets: ["United Kingdom"], destinations: ["Sharm El Sheikh"], updated: daysAgo(25), created: daysAgo(25), author: "pe-product-health-check", confidence: "HIGH", status: "ACTIVE", summary: "Conversion 3.1% (below target 3.5%). AOV £1,420. FCDO travel advisory still impacting bookings.", dependsOn: ["a6"] },

  // Australia — thin coverage
  { id: "a9", type: "Persona", subject: "Australian Luxury Traveler", markets: ["Australia"], destinations: ["Hurghada"], updated: daysAgo(45), created: daysAgo(100), author: "pe-persona-definition", confidence: "MEDIUM", status: "ACTIVE", summary: "High-net-worth travelers from Sydney/Melbourne. Long-haul comfort important. Interested in cultural add-ons (Luxor)." },
  { id: "a10", type: "Market Assessment", subject: "Australia Market Entry Assessment", markets: ["Australia"], destinations: ["Hurghada", "Sharm El Sheikh"], updated: daysAgo(60), created: daysAgo(60), author: "pe-cross-market-intelligence", confidence: "MEDIUM", status: "ACTIVE", summary: "AU-Egypt corridor growing 15% YoY. Low competition. Requires stopover partnerships (Dubai/Doha).", dependsOn: ["a9"] },
  
  // France — minimal
  { id: "a11", type: "Demand Signal", subject: "Club Med Egypt Competitor Launch", markets: ["France"], destinations: ["Hurghada"], updated: daysAgo(7), created: daysAgo(7), author: "pe-demand-signal-mining", confidence: "HIGH", status: "ACTIVE", summary: "Club Med announcing new Hurghada resort for 2027. Will pull French family segment. Need competitive response." },

  // Cross-market
  { id: "a12", type: "Market Assessment", subject: "Cross-Market Q4 Intelligence", markets: ["Germany", "United Kingdom", "Australia", "France"], destinations: ["Hurghada", "Sharm El Sheikh", "Marsa Alam"], updated: daysAgo(10), created: daysAgo(10), author: "pe-cross-market-intelligence", confidence: "HIGH", status: "ACTIVE", summary: "Overall demand up 12% across markets. Germany strongest. AU fastest growth. UK constrained by FCDO.", dependsOn: ["a3", "a14", "a2", "a7"] },
  
  { id: "a13", type: "Gap Analysis", subject: "UK Diving Product Gap", markets: ["United Kingdom"], destinations: ["Marsa Alam"], updated: daysAgo(100), created: daysAgo(150), author: "pe-gap-analysis", confidence: "LOW", status: "STALE", summary: "No dedicated diving package for UK market despite 200K+ UK PADI-certified divers.", dependsOn: ["a6", "a8"] },
  
  { id: "a14", type: "Demand Signal", subject: "Luxury All-Inclusive Trend", markets: ["Germany", "United Kingdom"], destinations: ["Hurghada"], updated: daysAgo(18), created: daysAgo(18), author: "pe-demand-signal-mining", confidence: "MEDIUM", status: "ACTIVE", summary: "Premium all-inclusive searches up 28% across DE/UK. Guests willing to pay 40% more for curated experiences." },
  
  { id: "a15", type: "Health Check", subject: "France Nile Cruise Performance", markets: ["France"], destinations: ["Luxor"], updated: daysAgo(35), created: daysAgo(35), author: "pe-product-health-check", confidence: "HIGH", status: "ACTIVE", summary: "Nile cruise conversion 5.8% (strong). AOV €2,100. French market loves cultural itineraries." },
];

export const mockInitiatives: Initiative[] = [
  {
    id: "i1",
    type: "MARKET_ENTRY",
    subject: "Australia Source Market Entry",
    phase: "DISCOVER",
    status: "ACTIVE",
    started: daysAgo(45),
    updated: daysAgo(5),
    artifacts: ["a9", "a10"],
  },
  {
    id: "i2",
    type: "OPTIMIZATION",
    subject: "Germany Premium Package Development",
    phase: "FRAME",
    status: "ACTIVE",
    started: daysAgo(15),
    updated: daysAgo(3),
    artifacts: ["a1", "a4", "a5"],
  },
  {
    id: "i3",
    type: "REPOSITIONING",
    subject: "UK Sharm El Sheikh Relaunch",
    phase: "CONFIRM",
    status: "CLOSED",
    started: daysAgo(180),
    updated: daysAgo(30),
    decision: "Approved: Rebrand as adventure/culture destination. Launch Q2 2026 with Thomas Cook partnership.",
    artifacts: ["a6", "a7", "a8"],
  },
];

export const mockSignals: Signal[] = [
  { id: "s1", title: "FTI Touristik Bankruptcy Risk", description: "Financial distress indicators for FTI Touristik. Potential market share redistribution in German Egypt corridor.", severity: "CRITICAL", category: "COMPETITIVE", market: "Germany", detected: daysAgo(2), source: "Financial news monitoring" },
  { id: "s2", title: "FCDO Advisory Update Expected", description: "UK FCDO reviewing Sharm El Sheikh travel advisory. Positive revision would unlock 30% demand increase.", severity: "CRITICAL", category: "MARKET", market: "United Kingdom", detected: daysAgo(4), source: "Government affairs monitoring" },
  { id: "s3", title: "Egypt Visa-on-Arrival Policy Change", description: "Egypt expanding e-visa to more nationalities. Could simplify Australian corridor.", severity: "WARNING", category: "MARKET", market: "Australia", detected: daysAgo(7), source: "Policy monitoring" },
  { id: "s4", title: "Club Med Hurghada Announcement", description: "Club Med planning new resort in Hurghada targeting French family segment for 2027.", severity: "WARNING", category: "COMPETITIVE", market: "France", detected: daysAgo(7), source: "Competitor press releases" },
  { id: "s5", title: "Red Sea Diving Demand Spike", description: "Search volume for Red Sea diving up 42% YoY across DACH region.", severity: "WARNING", category: "GROWTH", market: "Germany", detected: daysAgo(3), source: "Google Trends analysis" },
  { id: "s6", title: "AU-Egypt Flight Route Expansion", description: "Emirates adding daily Sydney-Cairo via Dubai. Capacity up 40%.", severity: "OPPORTUNITY", category: "GROWTH", market: "Australia", detected: daysAgo(10), source: "Airline route monitoring" },
  { id: "s7", title: "Premium All-Inclusive Trend Acceleration", description: "Luxury all-inclusive searches up 28% across DE/UK.", severity: "OPPORTUNITY", category: "GROWTH", market: "Germany", detected: daysAgo(14), source: "Search trend analysis" },
  { id: "s8", title: "French Nile Cruise Renaissance", description: "Cultural tourism driving 35% increase in FR Nile cruise interest.", severity: "OPPORTUNITY", category: "GROWTH", market: "France", detected: daysAgo(12), source: "Booking trend analysis" },
  { id: "s9", title: "Exchange Rate Impact — GBP Weakening", description: "GBP down 3% vs EGP. May reduce UK booking AOV.", severity: "INFO", category: "OPERATIONAL", detected: daysAgo(5), source: "FX monitoring" },
];

export const mockFreshness: FreshnessEntry[] = [
  { type: "Persona", count: 3, newest: daysAgo(5), oldest: daysAgo(120), staleCount: 0 },
  { type: "Competitor", count: 2, newest: daysAgo(12), oldest: daysAgo(180), staleCount: 1 },
  { type: "Demand Signal", count: 3, newest: daysAgo(3), oldest: daysAgo(18), staleCount: 0 },
  { type: "Health Check", count: 3, newest: daysAgo(20), oldest: daysAgo(35), staleCount: 0 },
  { type: "Gap Analysis", count: 2, newest: daysAgo(15), oldest: daysAgo(150), staleCount: 1 },
  { type: "Market Assessment", count: 2, newest: daysAgo(10), oldest: daysAgo(60), staleCount: 0 },
];

export const mockQuickActions: QuickAction[] = [
  { id: "qa1", title: "Run Signal Scan", description: "Detect emerging signals across all markets", triggerPhrase: "Run a signal detection scan", icon: "radar", lastRun: daysAgo(2) },
  { id: "qa2", title: "Rebuild Memory Index", description: "Rebuild the intelligence index and freshness data", triggerPhrase: "Run memory maintenance — rebuild the index", icon: "database", lastRun: daysAgo(5) },
  { id: "qa3", title: "Portfolio Health Check", description: "Run a health overview across all products", triggerPhrase: "Run a portfolio health overview", icon: "activity", lastRun: daysAgo(10) },
  { id: "qa4", title: "Coverage Report", description: "Analyze market coverage gaps and blind spots", triggerPhrase: "Run memory maintenance — coverage report", icon: "grid", lastRun: daysAgo(5) },
  { id: "qa5", title: "Start Market Entry", description: "Evaluate a new source market for entry", triggerPhrase: "Evaluate [market] as a new source market", icon: "globe", lastRun: undefined },
  { id: "qa6", title: "Start Optimization", description: "Run an optimization study for a product", triggerPhrase: "Run an optimization study for [product]", icon: "settings", lastRun: undefined },
];

// Build coverage matrix
export function buildCoverageMatrix(): Array<{ market: string; type: string; count: number; depth: string; artifactIds: string[] }> {
  const matrix: Array<{ market: string; type: string; count: number; depth: string; artifactIds: string[] }> = [];
  
  for (const market of MARKETS) {
    for (const type of ARTIFACT_TYPES) {
      const matching = mockArtifacts.filter(a => a.type === type && a.markets.includes(market));
      const freshMatching = matching.filter(a => a.status !== "STALE");
      
      let depth = "BLIND";
      if (freshMatching.length >= 4) depth = "DEEP";
      else if (freshMatching.length >= 2) depth = "MODERATE";
      else if (freshMatching.length >= 1) depth = "THIN";
      
      matrix.push({
        market,
        type,
        count: matching.length,
        depth,
        artifactIds: matching.map(a => a.id),
      });
    }
  }
  
  return matrix;
}

// Mock Skills Data
export const mockSkills: Skill[] = [
  // Foundation (1)
  { name: "pe-orchestrator", displayName: "Orchestrator", description: "Central routing skill that analyses user intent, selects the right Product Engine skill, and hands off execution with full context.", layer: "foundation", version: "2.0", files: ["SKILL.md", "references/io-contract.md", "references/routing-table.md"], fileCount: 3, hasIoContract: true },
  // Initiatives (4)
  { name: "pe-market-entry", displayName: "Market Entry", description: "Full workflow for evaluating and entering a new source market — from opportunity sizing through go/no-go decision.", layer: "initiative", version: "1.2", files: ["SKILL.md", "references/io-contract.md", "references/market-entry-template.md"], fileCount: 3, hasIoContract: true },
  { name: "pe-product-optimization", displayName: "Product Optimization", description: "Iterative improvement cycle for existing products using health-check data, competitor benchmarks, and demand signals.", layer: "initiative", files: ["SKILL.md", "references/io-contract.md"], fileCount: 2, hasIoContract: true },
  { name: "pe-repositioning", displayName: "Repositioning", description: "Strategic repositioning of a product or destination when market conditions shift or performance declines.", layer: "initiative", files: ["SKILL.md", "references/io-contract.md"], fileCount: 2, hasIoContract: true },
  { name: "pe-new-product-development", displayName: "New Product Development", description: "End-to-end workflow for creating new travel products — from concept through launch readiness.", layer: "initiative", files: ["SKILL.md", "references/io-contract.md"], fileCount: 2, hasIoContract: true },
  // Capabilities (6)
  { name: "pe-persona-definition", displayName: "Persona Definition", description: "Build detailed traveler personas using search trends, booking data, and competitive intelligence.", layer: "capability", version: "1.1", files: ["SKILL.md", "references/io-contract.md", "references/persona-template.md"], fileCount: 3, hasIoContract: true },
  { name: "pe-competitor-benchmarking", displayName: "Competitor Benchmarking", description: "Systematic competitor analysis covering pricing, distribution, product mix, and market positioning.", layer: "capability", files: ["SKILL.md", "references/io-contract.md"], fileCount: 2, hasIoContract: true },
  { name: "pe-demand-signal-mining", displayName: "Demand Signal Mining", description: "Detect and validate emerging demand signals from search trends, social media, and booking patterns.", layer: "capability", files: ["SKILL.md", "references/io-contract.md"], fileCount: 2, hasIoContract: true },
  { name: "pe-product-health-check", displayName: "Product Health Check", description: "Comprehensive health assessment of existing products covering conversion, revenue, satisfaction, and market fit.", layer: "capability", files: ["SKILL.md", "references/io-contract.md", "references/health-metrics.md"], fileCount: 3, hasIoContract: true },
  { name: "pe-gap-analysis", displayName: "Gap Analysis", description: "Identify gaps in product coverage by comparing current offerings against market demand and competitor portfolios.", layer: "capability", files: ["SKILL.md", "references/io-contract.md"], fileCount: 2, hasIoContract: true },
  { name: "pe-pricing-strategy", displayName: "Pricing Strategy", description: "Data-driven pricing recommendations based on competitor analysis, demand elasticity, and margin targets.", layer: "capability", files: ["SKILL.md", "references/io-contract.md"], fileCount: 2, hasIoContract: true },
  // Intelligence (3)
  { name: "pe-cross-market-intelligence", displayName: "Cross-Market Intelligence", description: "Synthesize insights across multiple source markets to identify patterns, opportunities, and threats.", layer: "intelligence", files: ["SKILL.md", "references/io-contract.md"], fileCount: 2, hasIoContract: true },
  { name: "pe-trend-forecasting", displayName: "Trend Forecasting", description: "Forward-looking analysis combining demand signals, macro trends, and seasonal patterns to forecast market direction.", layer: "intelligence", files: ["SKILL.md", "references/io-contract.md"], fileCount: 2, hasIoContract: true },
  { name: "pe-signal-detection", displayName: "Signal Detection", description: "Automated scanning for market anomalies, competitive moves, and emerging opportunities requiring attention.", layer: "intelligence", files: ["SKILL.md", "references/io-contract.md"], fileCount: 2, hasIoContract: true },
  // Memory (2)
  { name: "pe-memory-maintenance", displayName: "Memory Maintenance", description: "Index management, staleness detection, and artifact lifecycle operations for the intelligence repository.", layer: "memory", version: "1.0", files: ["SKILL.md", "references/io-contract.md", "references/index-schema.md"], fileCount: 3, hasIoContract: true },
  { name: "pe-decision-log", displayName: "Decision Log", description: "Record and retrieve strategic decisions with full context, rationale, and outcome tracking.", layer: "memory", files: ["SKILL.md", "references/io-contract.md"], fileCount: 2, hasIoContract: true },
];

export function getMockSkillDetail(name: string): SkillDetail | null {
  const skill = mockSkills.find((s) => s.name === name);
  if (!skill) return null;

  const skillMd = `---
name: ${skill.displayName}
description: >
  ${skill.description}
metadata:
  layer: ${skill.layer}
  system: product-engine
  repo: zeyad-farrag/Product-Engine
${skill.version ? `  version: ${skill.version}` : ""}
---

# ${skill.displayName}

## When to Use This Skill

Load this skill when you need to ${skill.description.toLowerCase().replace(/\.$/, "")}.

## Instructions

1. **Gather context** — Collect all relevant inputs as specified in the I/O contract.
2. **Analyze** — Apply the analytical framework to the gathered data.
3. **Synthesize** — Produce structured outputs in the standard format.
4. **Store** — Save artifacts to the intelligence repository.

## Storage

Artifacts are stored in \`intelligence/\` with frontmatter metadata.
Indexes are maintained in \`intelligence/_index/\`.

## Operating Principles

- Evidence over opinion — every claim needs a data source
- Confidence must be explicit (HIGH / MEDIUM / LOW)
- Staleness tracking: flag artifacts older than 90 days
- Cross-reference related artifacts via \`depends_on\`
`;

  const referenceFiles = [
    {
      name: "io-contract.md",
      path: "references/io-contract.md",
      content: `# I/O Contract — ${skill.displayName}\n\n## Trigger\n\nInvoked by the Orchestrator when user intent matches this skill's domain.\n\n## Required Inputs\n\n| Input | Source | Description |\n|-------|--------|-------------|\n| Market | User / Context | Target source market |\n| Scope | User | Specific focus area |\n| Existing artifacts | Memory | Related previous analyses |\n\n## Outputs\n\n| Output | Format | Destination |\n|--------|--------|-------------|\n| Analysis artifact | Markdown + YAML | intelligence/ |\n| Index update | Table row | intelligence/_index/ |\n\n## Quality Criteria\n\n- [ ] Confidence level assigned\n- [ ] All data sources cited\n- [ ] Cross-references validated\n`,
    },
  ];

  return {
    ...skill,
    skillMd,
    referenceFiles,
  };
}

export function getOverview() {
  const stale = mockArtifacts.filter(a => a.status === "STALE").length;
  const coverageMatrix = buildCoverageMatrix();
  const totalCells = coverageMatrix.length;
  const coveredCells = coverageMatrix.filter(c => c.depth !== "BLIND").length;
  const coverageScore = Math.round((coveredCells / totalCells) * 100);
  
  const recentActivity = [...mockArtifacts]
    .sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())
    .slice(0, 10);
  
  return {
    totalArtifacts: mockArtifacts.length,
    activeInitiatives: mockInitiatives.filter(i => i.status === "ACTIVE").length,
    criticalSignals: mockSignals.filter(s => s.severity === "CRITICAL").length,
    staleArtifacts: stale,
    coverageScore,
    recentActivity,
    activeInitiativesList: mockInitiatives.filter(i => i.status === "ACTIVE"),
  };
}
