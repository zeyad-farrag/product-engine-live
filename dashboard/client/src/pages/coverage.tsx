import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/status-badge";
import { Lightbulb, X } from "lucide-react";
import type { Artifact } from "@shared/schema";

interface CoverageCell {
  market: string;
  type: string;
  count: number;
  depth: string;
  artifactIds: string[];
}

const MARKETS = ["Germany", "United Kingdom", "Australia", "France"];
const TYPES = ["Persona", "Competitor", "Demand Signal", "Health Check", "Gap Analysis", "Market Assessment"];

const depthBg: Record<string, string> = {
  DEEP: "bg-green-500/30 hover:bg-green-500/40 text-green-300 cursor-pointer",
  MODERATE: "bg-amber-500/25 hover:bg-amber-500/35 text-amber-300 cursor-pointer",
  THIN: "bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 cursor-pointer",
  BLIND: "bg-gray-500/10 hover:bg-gray-500/15 text-gray-500 cursor-pointer",
};

function suggestAction(market: string, type: string): string {
  const skillMap: Record<string, string> = {
    Persona: "pe-persona-definition",
    Competitor: "pe-competitor-benchmarking",
    "Demand Signal": "pe-demand-signal-mining",
    "Health Check": "pe-product-health-check",
    "Gap Analysis": "pe-gap-analysis",
    "Market Assessment": "pe-cross-market-intelligence",
  };
  const skill = skillMap[type] || "pe-cross-market-intelligence";
  return `Run ${skill} for ${market}`;
}

export default function Coverage() {
  const [selected, setSelected] = useState<{ market: string; type: string } | null>(null);

  const { data: matrix, isLoading: matrixLoading } = useQuery<CoverageCell[]>({
    queryKey: ["/api/coverage"],
  });

  const { data: allArtifacts } = useQuery<Artifact[]>({
    queryKey: ["/api/artifacts"],
  });

  if (matrixLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const blindSpots = (matrix || []).filter((c) => c.depth === "BLIND");
  const thinSpots = (matrix || []).filter((c) => c.depth === "THIN");
  const totalCells = (matrix || []).length;
  const coveredCells = (matrix || []).filter((c) => c.depth !== "BLIND").length;
  const coveragePercent = totalCells > 0 ? Math.round((coveredCells / totalCells) * 100) : 0;

  const selectedCell = selected
    ? (matrix || []).find((c) => c.market === selected.market && c.type === selected.type)
    : null;

  const selectedArtifacts = selectedCell
    ? (allArtifacts || []).filter((a) =>
        a.type === selected?.type && a.markets.includes(selected?.market || "")
      )
    : [];

  return (
    <div className="p-6 space-y-6" data-testid="page-coverage">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Coverage Map</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {coveragePercent}% coverage | {blindSpots.length} blind spots | {thinSpots.length} thin spots
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Heatmap */}
        <Card className="lg:col-span-2 bg-card border-card-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Markets x Artifact Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="table-coverage">
                <thead>
                  <tr>
                    <th className="text-left text-xs text-muted-foreground font-medium pb-3 pr-3 w-36">Market</th>
                    {TYPES.map((t) => (
                      <th key={t} className="text-center text-[10px] text-muted-foreground font-medium pb-3 px-1" style={{ minWidth: 72 }}>
                        {t}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MARKETS.map((market) => (
                    <tr key={market}>
                      <td className="text-xs font-medium py-1 pr-3">{market}</td>
                      {TYPES.map((type) => {
                        const cell = (matrix || []).find(
                          (c) => c.market === market && c.type === type
                        );
                        const isSelected = selected?.market === market && selected?.type === type;
                        return (
                          <td key={type} className="p-0.5">
                            <div
                              className={`flex items-center justify-center text-xs font-medium tabular-nums rounded-md h-10 transition-all ${
                                depthBg[cell?.depth || "BLIND"]
                              } ${isSelected ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : ""}`}
                              onClick={() =>
                                setSelected(
                                  isSelected ? null : { market, type }
                                )
                              }
                              data-testid={`cell-${market}-${type}`}
                            >
                              <div className="text-center">
                                <div>{cell?.count || 0}</div>
                                <div className="text-[9px] opacity-60">{cell?.depth || "BLIND"}</div>
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center gap-4 mt-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-green-500/30" /> Deep (4+)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-amber-500/25" /> Moderate (2-3)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-orange-500/20" /> Thin (1)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-gray-500/10" /> Blind (0)</span>
            </div>
          </CardContent>
        </Card>

        {/* Detail panel */}
        <div className="space-y-4">
          {selected && selectedCell ? (
            <Card className="bg-card border-card-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {selected.market} — {selected.type}
                  </CardTitle>
                  <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <StatusBadge value={selectedCell.depth} />
                
                {selectedArtifacts.length > 0 ? (
                  <div className="space-y-2">
                    {selectedArtifacts.map((a) => (
                      <div key={a.id} className="p-2.5 rounded-md bg-muted/30 border border-border">
                        <p className="text-xs font-medium">{a.subject}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <StatusBadge value={a.confidence} />
                          <StatusBadge value={a.status} />
                          <span className="text-[10px] text-muted-foreground tabular-nums">{a.updated}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No artifacts in this cell.</p>
                )}

                {selectedCell.depth === "BLIND" && (
                  <div className="p-3 rounded-md bg-primary/10 border border-primary/20 mt-2">
                    <div className="flex items-center gap-1.5 text-primary text-xs font-medium mb-1">
                      <Lightbulb className="w-3.5 h-3.5" />
                      Suggested Action
                    </div>
                    <p className="text-xs text-foreground/80">{suggestAction(selected.market, selected.type)}</p>
                  </div>
                )}
                {selectedCell.depth === "THIN" && (
                  <div className="p-3 rounded-md bg-amber-500/10 border border-amber-500/20 mt-2">
                    <div className="flex items-center gap-1.5 text-amber-400 text-xs font-medium mb-1">
                      <Lightbulb className="w-3.5 h-3.5" />
                      Suggested Action
                    </div>
                    <p className="text-xs text-foreground/80">{suggestAction(selected.market, selected.type)}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card border-card-border">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground">Click a cell to view details</p>
              </CardContent>
            </Card>
          )}

          {/* Gap Summary */}
          <Card className="bg-card border-card-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Blind Spots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {blindSpots.map((cell) => (
                  <div
                    key={`${cell.market}-${cell.type}`}
                    className="flex items-center justify-between text-xs p-2 rounded-md hover:bg-muted/20 cursor-pointer"
                    onClick={() => setSelected({ market: cell.market, type: cell.type })}
                  >
                    <span>{cell.market}</span>
                    <span className="text-muted-foreground">{cell.type}</span>
                  </div>
                ))}
                {blindSpots.length === 0 && (
                  <p className="text-xs text-muted-foreground">No blind spots — full coverage.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
