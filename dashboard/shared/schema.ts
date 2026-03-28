// Product Engine Dashboard — no database needed, just types for API responses

export interface Artifact {
  id: string;
  type: string;
  subject: string;
  markets: string[];
  destinations: string[];
  updated: string;
  created: string;
  author: string;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  status: "ACTIVE" | "STALE" | "ARCHIVED";
  summary?: string;
  content?: string;
  path?: string;
  dependsOn?: string[];
  session?: string;
}

export interface Initiative {
  id: string;
  type: "MARKET_ENTRY" | "OPTIMIZATION" | "REPOSITIONING" | "NPD";
  subject: string;
  phase: "FRAME" | "DISCOVER" | "DECIDE" | "CONFIRM";
  status: "ACTIVE" | "CLOSED";
  started: string;
  updated: string;
  decision?: string;
  artifacts: string[];
}

export interface Signal {
  id: string;
  title: string;
  description: string;
  severity: "CRITICAL" | "WARNING" | "OPPORTUNITY" | "INFO";
  category: "GROWTH" | "DECLINE" | "ANOMALY" | "COMPETITIVE" | "MARKET" | "OPERATIONAL";
  market?: string;
  detected: string;
  source?: string;
}

export interface CoverageCell {
  market: string;
  artifactType: string;
  count: number;
  depth: "DEEP" | "MODERATE" | "THIN" | "BLIND";
  artifacts: Artifact[];
}

export interface FreshnessEntry {
  type: string;
  count: number;
  newest: string;
  oldest: string;
  staleCount: number;
}

export interface DashboardOverview {
  totalArtifacts: number;
  activeInitiatives: number;
  criticalSignals: number;
  staleArtifacts: number;
  coverageScore: number;
  recentActivity: Artifact[];
  activeInitiativesList: Initiative[];
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  triggerPhrase: string;
  icon: string;
  lastRun?: string;
}

// Skill Management Types
export interface Skill {
  name: string;           // directory name (e.g., "pe-market-entry")
  displayName: string;    // from frontmatter name field
  description: string;    // from frontmatter description
  layer: string;          // from metadata.layer
  version?: string;       // from metadata.version if present
  files: string[];        // list of files in the skill directory
  fileCount: number;
  hasIoContract: boolean; // whether references/io-contract.md exists
  lastModified?: string;  // from git if available
}

export interface SkillReferenceFile {
  name: string;
  path: string;
  content: string;
}

export interface SkillDetail extends Skill {
  skillMd: string;        // raw SKILL.md content
  referenceFiles: SkillReferenceFile[];
}

// ─── Performance Tracking Types ──────────────────────────────────────────────

export interface PerformanceKPIs {
  totalRequests: { current: number; previous: number; change: number };
  confirmedBookings: { current: number; previous: number; change: number };
  avgBookingValue: { current: number; previous: number; change: number };
  conversionRate: { current: number; previous: number; change: number };
  cancellationRate: number;
}

export interface BookingVelocityPoint {
  date: string;
  total: number;
  confirmed: number;
}

export interface MarketBreakdown {
  country: string;
  iso: string;
  total: number;
  confirmed: number;
  avgValue: number;
  conversionRate: number;
}

export interface ProductMix {
  productType: string;
  total: number;
  confirmed: number;
  avgValue: number;
}

export interface DestinationMix {
  destination: string;
  total: number;
  confirmed: number;
}

export interface FunnelStep {
  status: string;
  count: number;
  percentage: number;
}

export interface MonthlyTrend {
  month: string;
  totalRequests: number;
  confirmed: number;
  revenue: number;
}

export interface WebsiteSource {
  brand: string;
  total: number;
  confirmed: number;
  conversionRate: number;
}

export interface RatingsSummary {
  avgRating: number;
  totalRatings: number;
  positive: number;
  negative: number;
  satisfactionRate: number;
}
