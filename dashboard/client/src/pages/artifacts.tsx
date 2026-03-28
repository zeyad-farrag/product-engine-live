import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Artifact } from "@shared/schema";

const ARTIFACT_TABS = [
  { value: "all", label: "All" },
  { value: "Persona", label: "Personas" },
  { value: "Competitor", label: "Competitors" },
  { value: "Demand Signal", label: "Demand Signals" },
  { value: "Health Check", label: "Health Checks" },
  { value: "Gap Analysis", label: "Gap Analyses" },
  { value: "Market Assessment", label: "Market Assessments" },
];

function isStale(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays > 90;
}

export default function Artifacts() {
  const [activeTab, setActiveTab] = useState("all");
  const [marketFilter, setMarketFilter] = useState("all");
  const [confidenceFilter, setConfidenceFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<"updated" | "subject">("updated");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const { data: artifacts, isLoading } = useQuery<Artifact[]>({
    queryKey: ["/api/artifacts"],
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  let filtered = artifacts || [];
  if (activeTab !== "all") filtered = filtered.filter((a) => a.type === activeTab);
  if (marketFilter !== "all") filtered = filtered.filter((a) => a.markets.includes(marketFilter));
  if (confidenceFilter !== "all") filtered = filtered.filter((a) => a.confidence === confidenceFilter);

  filtered = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortField === "updated") cmp = new Date(a.updated).getTime() - new Date(b.updated).getTime();
    else cmp = a.subject.localeCompare(b.subject);
    return sortDir === "asc" ? cmp : -cmp;
  });

  const handleSort = (field: "updated" | "subject") => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3 inline ml-0.5" />
    ) : (
      <ChevronDown className="w-3 h-3 inline ml-0.5" />
    );
  };

  return (
    <div className="p-6 space-y-4" data-testid="page-artifacts">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Artifacts Browser</h1>
        <span className="text-xs text-muted-foreground tabular-nums">{filtered.length} artifacts</span>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <TabsList className="bg-muted/50 h-8">
            {ARTIFACT_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-xs px-2.5 h-7"
                data-testid={`tab-${tab.value}`}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex items-center gap-2 ml-auto">
            <Select value={marketFilter} onValueChange={setMarketFilter}>
              <SelectTrigger className="h-8 w-36 text-xs" data-testid="filter-market">
                <SelectValue placeholder="Market" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Markets</SelectItem>
                <SelectItem value="Germany">Germany</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                <SelectItem value="Australia">Australia</SelectItem>
                <SelectItem value="France">France</SelectItem>
              </SelectContent>
            </Select>
            <Select value={confidenceFilter} onValueChange={setConfidenceFilter}>
              <SelectTrigger className="h-8 w-32 text-xs" data-testid="filter-confidence">
                <SelectValue placeholder="Confidence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-4">
          <Card className="bg-card border-card-border">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="table-artifacts">
                  <thead className="sticky top-0 bg-card z-10">
                    <tr className="border-b border-border">
                      <th
                        className="text-left text-xs font-medium text-muted-foreground py-3 px-4 cursor-pointer select-none"
                        onClick={() => handleSort("subject")}
                      >
                        Subject <SortIcon field="subject" />
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">Type</th>
                      <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">Markets</th>
                      <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">Destinations</th>
                      <th
                        className="text-left text-xs font-medium text-muted-foreground py-3 px-4 cursor-pointer select-none"
                        onClick={() => handleSort("updated")}
                      >
                        Updated <SortIcon field="updated" />
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">Confidence</th>
                      <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((a) => (
                      <>
                        <tr
                          key={a.id}
                          className={`border-b border-border/50 cursor-pointer transition-colors hover:bg-muted/20 ${
                            isStale(a.updated) ? "border-l-2 border-l-amber-500/50" : ""
                          }`}
                          onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                          data-testid={`row-artifact-${a.id}`}
                        >
                          <td className="py-3 px-4 font-medium">{a.subject}</td>
                          <td className="py-3 px-4 text-xs text-muted-foreground">{a.type}</td>
                          <td className="py-3 px-4 text-xs text-muted-foreground">{a.markets.join(", ")}</td>
                          <td className="py-3 px-4 text-xs text-muted-foreground">{a.destinations.join(", ")}</td>
                          <td className="py-3 px-4 text-xs tabular-nums text-muted-foreground">{a.updated}</td>
                          <td className="py-3 px-4"><StatusBadge value={a.confidence} /></td>
                          <td className="py-3 px-4"><StatusBadge value={a.status} /></td>
                        </tr>
                        {expandedId === a.id && (
                          <tr key={`${a.id}-detail`} className="border-b border-border/50">
                            <td colSpan={7} className="py-4 px-6 bg-muted/10">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>Created: {a.created}</span>
                                  <span>|</span>
                                  <span>Author: <span className="font-mono">{a.author}</span></span>
                                </div>
                                {a.summary && (
                                  <p className="text-sm text-foreground/80 leading-relaxed max-w-3xl">
                                    {a.summary}
                                  </p>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-muted-foreground text-sm">
                          No artifacts match the current filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
