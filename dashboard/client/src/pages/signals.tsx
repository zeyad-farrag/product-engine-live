import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/status-badge";
import { AlertTriangle, AlertCircle, TrendingUp, Info } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { Signal, FreshnessEntry } from "@shared/schema";

const severityIcons: Record<string, any> = {
  CRITICAL: AlertTriangle,
  WARNING: AlertCircle,
  OPPORTUNITY: TrendingUp,
  INFO: Info,
};

const severityOrder = ["CRITICAL", "WARNING", "OPPORTUNITY", "INFO"];

function SignalCard({ signal }: { signal: Signal }) {
  const Icon = severityIcons[signal.severity] || Info;
  const borderColors: Record<string, string> = {
    CRITICAL: "border-l-red-500",
    WARNING: "border-l-amber-500",
    OPPORTUNITY: "border-l-green-500",
    INFO: "border-l-blue-500",
  };

  return (
    <Card
      className={`bg-card border-card-border border-l-2 ${borderColors[signal.severity] || "border-l-gray-500"}`}
      data-testid={`card-signal-${signal.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <Icon className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge value={signal.severity} />
              <StatusBadge value={signal.category} />
              {signal.market && (
                <span className="text-[10px] text-muted-foreground">{signal.market}</span>
              )}
            </div>
            <h3 className="text-sm font-medium">{signal.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{signal.description}</p>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground pt-1">
              <span>Detected {signal.detected}</span>
              {signal.source && <span>Source: {signal.source}</span>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Signals() {
  const { data: signals, isLoading: signalsLoading } = useQuery<Signal[]>({
    queryKey: ["/api/signals"],
  });

  const { data: freshness, isLoading: freshnessLoading } = useQuery<FreshnessEntry[]>({
    queryKey: ["/api/freshness"],
  });

  if (signalsLoading || freshnessLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  const sortedSignals = [...(signals || [])].sort(
    (a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity)
  );

  // Build category breakdown for chart
  const categories = ["GROWTH", "DECLINE", "ANOMALY", "COMPETITIVE", "MARKET", "OPERATIONAL"];
  const categoryCounts = categories.map((cat) => ({
    category: cat,
    count: (signals || []).filter((s) => s.category === cat).length,
  }));

  const categoryColors: Record<string, string> = {
    GROWTH: "#22c55e",
    DECLINE: "#ef4444",
    ANOMALY: "#f59e0b",
    COMPETITIVE: "#8b5cf6",
    MARKET: "#3b82f6",
    OPERATIONAL: "#6b7280",
  };

  // Summary counts
  const critical = (signals || []).filter((s) => s.severity === "CRITICAL").length;
  const warning = (signals || []).filter((s) => s.severity === "WARNING").length;
  const opportunity = (signals || []).filter((s) => s.severity === "OPPORTUNITY").length;
  const info = (signals || []).filter((s) => s.severity === "INFO").length;

  return (
    <div className="p-6 space-y-6" data-testid="page-signals">
      <div>
        <h1 className="text-lg font-semibold">Signal Detection</h1>
        <p className="text-xs text-muted-foreground mt-1">
          {(signals || []).length} active signals across all markets
        </p>
      </div>

      {/* Summary pills */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-500/10 text-red-400 text-xs font-medium">
          <AlertTriangle className="w-3.5 h-3.5" />
          {critical} Critical
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-500/10 text-amber-400 text-xs font-medium">
          <AlertCircle className="w-3.5 h-3.5" />
          {warning} Warning
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-green-500/10 text-green-400 text-xs font-medium">
          <TrendingUp className="w-3.5 h-3.5" />
          {opportunity} Opportunity
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-500/10 text-blue-400 text-xs font-medium">
          <Info className="w-3.5 h-3.5" />
          {info} Info
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Signals list */}
        <div className="lg:col-span-2 space-y-3">
          {sortedSignals.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </div>

        {/* Sidebar: category chart + freshness */}
        <div className="space-y-6">
          {/* Category breakdown */}
          <Card className="bg-card border-card-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={categoryCounts.filter((c) => c.count > 0)} layout="vertical" margin={{ left: 0, right: 10 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="category"
                    width={90}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {categoryCounts
                      .filter((c) => c.count > 0)
                      .map((entry) => (
                        <Cell
                          key={entry.category}
                          fill={categoryColors[entry.category] || "#6b7280"}
                          opacity={0.7}
                        />
                      ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Intelligence Freshness */}
          <Card className="bg-card border-card-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Intelligence Freshness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs" data-testid="table-freshness">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left font-medium text-muted-foreground py-2 pr-2">Type</th>
                      <th className="text-right font-medium text-muted-foreground py-2 px-1">Count</th>
                      <th className="text-right font-medium text-muted-foreground py-2 px-1">Stale</th>
                      <th className="text-right font-medium text-muted-foreground py-2 pl-1">Newest</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(freshness || []).map((entry) => (
                      <tr key={entry.type} className="border-b border-border/50 last:border-0">
                        <td className="py-2 pr-2 font-medium">{entry.type}</td>
                        <td className="py-2 px-1 text-right tabular-nums">{entry.count}</td>
                        <td className="py-2 px-1 text-right tabular-nums">
                          {entry.staleCount > 0 ? (
                            <span className="text-amber-400">{entry.staleCount}</span>
                          ) : (
                            <span className="text-muted-foreground">0</span>
                          )}
                        </td>
                        <td className="py-2 pl-1 text-right tabular-nums text-muted-foreground">
                          {entry.newest}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
