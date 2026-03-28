import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/status-badge";
import {
  FileText,
  Rocket,
  AlertTriangle,
  Clock,
  Target,
} from "lucide-react";
import type { DashboardOverview, Artifact, Initiative } from "@shared/schema";

function KPICard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
}: {
  title: string;
  value: number | string;
  icon: any;
  color: string;
  subtitle?: string;
}) {
  return (
    <Card className="bg-card border-card-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-semibold tabular-nums mt-1">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          <div className={`p-2 rounded-md ${color}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function HeatmapCell({ depth, count }: { depth: string; count: number }) {
  const bg: Record<string, string> = {
    DEEP: "bg-green-500/30 text-green-300",
    MODERATE: "bg-amber-500/25 text-amber-300",
    THIN: "bg-orange-500/20 text-orange-300",
    BLIND: "bg-gray-500/10 text-gray-500",
  };
  return (
    <div
      className={`flex items-center justify-center text-xs font-medium tabular-nums rounded-sm h-9 ${bg[depth] || bg.BLIND}`}
      title={`${depth} — ${count} artifacts`}
    >
      {count > 0 ? count : "—"}
    </div>
  );
}

const PHASES = ["FRAME", "DISCOVER", "DECIDE", "CONFIRM"] as const;

function PhaseProgress({ phase }: { phase: string }) {
  const currentIndex = PHASES.indexOf(phase as any);
  return (
    <div className="flex items-center gap-1">
      {PHASES.map((p, i) => (
        <div key={p} className="flex items-center gap-1">
          <div
            className={`h-2 w-8 rounded-full transition-colors ${
              i <= currentIndex
                ? i === currentIndex
                  ? "bg-primary"
                  : "bg-primary/40"
                : "bg-muted"
            }`}
          />
        </div>
      ))}
    </div>
  );
}

export default function Overview() {
  const { data, isLoading } = useQuery<DashboardOverview>({
    queryKey: ["/api/overview"],
  });

  const { data: coverageData } = useQuery<
    Array<{ market: string; type: string; count: number; depth: string }>
  >({
    queryKey: ["/api/coverage"],
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!data) return null;

  const markets = ["Germany", "United Kingdom", "Australia", "France"];
  const types = ["Persona", "Competitor", "Demand Signal", "Health Check", "Gap Analysis", "Market Assessment"];

  return (
    <div className="p-6 space-y-6" data-testid="page-overview">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPICard
          title="Total Artifacts"
          value={data.totalArtifacts}
          icon={FileText}
          color="bg-primary/15 text-primary"
        />
        <KPICard
          title="Active Initiatives"
          value={data.activeInitiatives}
          icon={Rocket}
          color="bg-blue-500/15 text-blue-400"
        />
        <KPICard
          title="Critical Signals"
          value={data.criticalSignals}
          icon={AlertTriangle}
          color="bg-red-500/15 text-red-400"
        />
        <KPICard
          title="Stale Artifacts"
          value={data.staleArtifacts}
          icon={Clock}
          color="bg-amber-500/15 text-amber-400"
          subtitle=">90 days"
        />
        <KPICard
          title="Coverage Score"
          value={`${data.coverageScore}%`}
          icon={Target}
          color="bg-green-500/15 text-green-400"
        />
      </div>

      {/* Empty state banner */}
      {data.totalArtifacts === 0 && data.activeInitiatives === 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-4 px-5 flex items-center gap-4">
            <Rocket className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">No intelligence artifacts yet</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Run <span className="font-mono text-primary">pe-foundation-session</span> in Perplexity Computer to populate the business context, then start your first initiative. The dashboard will reflect artifacts as they're created.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Intelligence Health Heatmap */}
        <Card className="lg:col-span-2 bg-card border-card-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Intelligence Health</CardTitle>
          </CardHeader>
          <CardContent>
            {coverageData && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left text-xs text-muted-foreground font-medium pb-2 pr-3 w-32">Market</th>
                      {types.map((t) => (
                        <th key={t} className="text-center text-[10px] text-muted-foreground font-medium pb-2 px-1" style={{ minWidth: 60 }}>
                          {t}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {markets.map((market) => (
                      <tr key={market}>
                        <td className="text-xs font-medium py-1 pr-3">{market}</td>
                        {types.map((type) => {
                          const cell = coverageData.find(
                            (c) => c.market === market && c.type === type
                          );
                          return (
                            <td key={type} className="p-0.5">
                              <HeatmapCell
                                depth={cell?.depth || "BLIND"}
                                count={cell?.count || 0}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-green-500/30" /> Deep</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-amber-500/25" /> Moderate</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-orange-500/20" /> Thin</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-gray-500/10" /> Blind</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Initiatives */}
        <Card className="bg-card border-card-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Initiatives</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.activeInitiativesList.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">
                No active initiatives. Start one from the Actions page.
              </p>
            ) : (
              data.activeInitiativesList.map((initiative: Initiative) => (
                <div
                  key={initiative.id}
                  className="p-3 rounded-md bg-muted/30 border border-border space-y-2"
                  data-testid={`card-initiative-${initiative.id}`}
                >
                  <div className="flex items-center gap-2">
                    <StatusBadge value={initiative.type} />
                    <StatusBadge value={initiative.phase} />
                  </div>
                  <p className="text-sm font-medium">{initiative.subject}</p>
                  <PhaseProgress phase={initiative.phase} />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{initiative.artifacts.length} artifacts</span>
                    <span>Updated {initiative.updated}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-card border-card-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="table-recent-activity">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground py-2 pr-4">Type</th>
                  <th className="text-left text-xs font-medium text-muted-foreground py-2 pr-4">Subject</th>
                  <th className="text-left text-xs font-medium text-muted-foreground py-2 pr-4">Markets</th>
                  <th className="text-left text-xs font-medium text-muted-foreground py-2 pr-4">Author</th>
                  <th className="text-left text-xs font-medium text-muted-foreground py-2 pr-4">Updated</th>
                  <th className="text-left text-xs font-medium text-muted-foreground py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentActivity.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-muted-foreground">
                      No artifacts yet. Intelligence will appear here as skills produce artifacts.
                    </td>
                  </tr>
                )}
                {data.recentActivity.map((artifact: Artifact) => (
                  <tr
                    key={artifact.id}
                    className="border-b border-border/50 last:border-0"
                    data-testid={`row-artifact-${artifact.id}`}
                  >
                    <td className="py-2 pr-4">
                      <span className="text-xs font-medium text-muted-foreground">{artifact.type}</span>
                    </td>
                    <td className="py-2 pr-4 font-medium text-sm">{artifact.subject}</td>
                    <td className="py-2 pr-4 text-xs text-muted-foreground">{artifact.markets.join(", ")}</td>
                    <td className="py-2 pr-4 text-xs text-muted-foreground font-mono">{artifact.author}</td>
                    <td className="py-2 pr-4 text-xs tabular-nums text-muted-foreground">{artifact.updated}</td>
                    <td className="py-2">
                      <StatusBadge value={artifact.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
