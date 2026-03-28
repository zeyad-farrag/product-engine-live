import { useState, useCallback, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  Position,
  MarkerType,
  Handle,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatusBadge } from "@/components/status-badge";
import type { Artifact, Initiative } from "@shared/schema";

// Type → color map
const TYPE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  Persona: { bg: "bg-blue-500/15", border: "border-blue-500/40", text: "text-blue-400" },
  Competitor: { bg: "bg-purple-500/15", border: "border-purple-500/40", text: "text-purple-400" },
  "Demand Signal": { bg: "bg-amber-500/15", border: "border-amber-500/40", text: "text-amber-400" },
  "Health Check": { bg: "bg-green-500/15", border: "border-green-500/40", text: "text-green-400" },
  "Gap Analysis": { bg: "bg-red-500/15", border: "border-red-500/40", text: "text-red-400" },
  "Market Assessment": { bg: "bg-teal-500/15", border: "border-teal-500/40", text: "text-teal-400" },
  "Decision Record": { bg: "bg-gray-500/15", border: "border-gray-500/40", text: "text-gray-400" },
};

const TYPE_HEX: Record<string, string> = {
  Persona: "#3b82f6",
  Competitor: "#a855f7",
  "Demand Signal": "#f59e0b",
  "Health Check": "#22c55e",
  "Gap Analysis": "#ef4444",
  "Market Assessment": "#14b8a6",
  "Decision Record": "#6b7280",
};

function isStale(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24) > 90;
}

// Custom artifact node
function ArtifactNode({ data }: { data: any }) {
  const stale = isStale(data.updated);
  const colors = TYPE_COLORS[data.type] || TYPE_COLORS["Decision Record"];
  const isHighlighted = data.isHighlighted;
  const isSelected = data.isSelected;

  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground !w-2 !h-2" />
      <div
        className={`px-3 py-2 rounded-lg border ${colors.bg} ${colors.border} min-w-[140px] max-w-[200px] transition-all
          ${stale ? "ring-2 ring-amber-500/50 animate-pulse" : ""}
          ${isHighlighted ? "ring-2 ring-cyan-400/70 shadow-lg shadow-cyan-500/20" : ""}
          ${isSelected ? "ring-2 ring-primary shadow-lg" : ""}
        `}
        data-testid={`graph-node-${data.id}`}
      >
        <div className={`text-[10px] font-medium uppercase tracking-wider ${colors.text} mb-1`}>
          {data.type}
        </div>
        <div className="text-xs font-medium text-foreground leading-tight truncate">
          {data.subject}
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[10px] text-muted-foreground tabular-nums">{data.updated}</span>
          <span className={`text-[10px] font-medium ${
            data.confidence === "HIGH" ? "text-green-400" :
            data.confidence === "MEDIUM" ? "text-amber-400" : "text-red-400"
          }`}>
            {data.confidence}
          </span>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground !w-2 !h-2" />
    </>
  );
}

// Custom initiative node (larger)
function InitiativeNode({ data }: { data: any }) {
  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground !w-2 !h-2" />
      <div
        className="px-4 py-3 rounded-lg border-2 border-primary/40 bg-primary/10 min-w-[180px] max-w-[240px]"
        data-testid={`graph-initiative-${data.id}`}
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <StatusBadge value={data.initiativeType} />
          <StatusBadge value={data.phase} />
        </div>
        <div className="text-sm font-semibold text-foreground leading-tight">
          {data.subject}
        </div>
        <div className="text-[10px] text-muted-foreground mt-1">
          {data.artifactCount} artifacts
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground !w-2 !h-2" />
    </>
  );
}

const nodeTypes = {
  artifact: ArtifactNode,
  initiative: InitiativeNode,
};

function layoutNodes(artifacts: Artifact[], initiatives: Initiative[]): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const artifactMap = new Map(artifacts.map((a) => [a.id, a]));

  // Group artifacts by type for layout
  const typeGroups: Record<string, Artifact[]> = {};
  for (const a of artifacts) {
    if (!typeGroups[a.type]) typeGroups[a.type] = [];
    typeGroups[a.type].push(a);
  }

  const typeOrder = ["Persona", "Competitor", "Demand Signal", "Health Check", "Gap Analysis", "Market Assessment"];
  let x = 0;

  for (const type of typeOrder) {
    const group = typeGroups[type] || [];
    let y = 0;
    for (const artifact of group) {
      nodes.push({
        id: artifact.id,
        type: "artifact",
        position: { x: x * 260, y: y * 120 },
        data: {
          ...artifact,
          isHighlighted: false,
          isSelected: false,
        },
      });

      // Build edges from dependsOn
      if (artifact.dependsOn) {
        for (const depId of artifact.dependsOn) {
          if (artifactMap.has(depId)) {
            edges.push({
              id: `e-${depId}-${artifact.id}`,
              source: depId,
              target: artifact.id,
              type: "smoothstep",
              animated: true,
              style: { stroke: "hsl(var(--muted-foreground))", strokeWidth: 1.5, opacity: 0.5 },
              markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--muted-foreground))" },
            });
          }
        }
      }
      y++;
    }
    x++;
  }

  // Add initiative nodes below
  let initX = 0;
  const initY = Math.max(...Object.values(typeGroups).map((g) => g.length), 1) * 120 + 80;

  for (const initiative of initiatives) {
    nodes.push({
      id: `init-${initiative.id}`,
      type: "initiative",
      position: { x: initX * 300, y: initY },
      data: {
        id: initiative.id,
        subject: initiative.subject,
        initiativeType: initiative.type,
        phase: initiative.phase,
        artifactCount: initiative.artifacts.length,
      },
    });

    // Connect initiative to its artifacts
    for (const artifactId of initiative.artifacts) {
      if (artifactMap.has(artifactId)) {
        edges.push({
          id: `e-init-${initiative.id}-${artifactId}`,
          source: artifactId,
          target: `init-${initiative.id}`,
          type: "smoothstep",
          style: { stroke: "hsl(var(--primary))", strokeWidth: 2, opacity: 0.4 },
          markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--primary))" },
        });
      }
    }
    initX++;
  }

  return { nodes, edges };
}

function GraphInner() {
  const { data: artifacts, isLoading: artLoading } = useQuery<Artifact[]>({
    queryKey: ["/api/artifacts"],
  });
  const { data: initiatives, isLoading: initLoading } = useQuery<Initiative[]>({
    queryKey: ["/api/initiatives"],
  });

  const [selectedNode, setSelectedNode] = useState<Artifact | null>(null);
  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(new Set());

  const { nodes: baseNodes, edges: baseEdges } = useMemo(() => {
    if (!artifacts || !initiatives) return { nodes: [], edges: [] };
    return layoutNodes(artifacts, initiatives);
  }, [artifacts, initiatives]);

  // Apply highlighting
  const nodes = useMemo(() => {
    return baseNodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        isHighlighted: highlightedIds.has(node.id),
        isSelected: selectedNode?.id === node.id,
      },
    }));
  }, [baseNodes, highlightedIds, selectedNode]);

  // Find all downstream dependents of a given node
  const findDownstream = useCallback((nodeId: string, allEdges: Edge[]): Set<string> => {
    const downstream = new Set<string>();
    const queue = [nodeId];
    while (queue.length > 0) {
      const current = queue.shift()!;
      for (const edge of allEdges) {
        if (edge.source === current && !downstream.has(edge.target)) {
          downstream.add(edge.target);
          queue.push(edge.target);
        }
      }
    }
    return downstream;
  }, []);

  const onNodeClick = useCallback(
    (_: any, node: Node) => {
      if (node.type === "initiative") return;
      const artifact = artifacts?.find((a) => a.id === node.id);
      if (artifact) {
        setSelectedNode(artifact);
        const downstream = findDownstream(node.id, baseEdges);
        setHighlightedIds(downstream);
      }
    },
    [artifacts, baseEdges, findDownstream]
  );

  const isLoading = artLoading || initLoading;

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[600px]" />
      </div>
    );
  }

  const isEmpty = (artifacts?.length || 0) === 0 && (initiatives?.length || 0) === 0;

  return (
    <div className="h-full flex flex-col" data-testid="page-graph">
      <div className="px-6 py-4 border-b border-border shrink-0">
        <h1 className="text-lg font-semibold">Dependency Graph</h1>
        <p className="text-xs text-muted-foreground mt-1">
          {artifacts?.length || 0} artifacts, {initiatives?.length || 0} initiatives — click a node to see downstream impact
        </p>
      </div>
      {isEmpty && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2 max-w-md px-6">
            <p className="text-sm text-muted-foreground">No artifacts or initiatives to visualize yet.</p>
            <p className="text-xs text-muted-foreground">Run skills in Perplexity Computer to produce artifacts. The dependency graph will map their relationships automatically.</p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="px-6 py-2 border-b border-border flex flex-wrap gap-3 shrink-0">
        {Object.entries(TYPE_COLORS).filter(([k]) => k !== "Decision Record").map(([type, colors]) => (
          <span key={type} className={`inline-flex items-center gap-1 text-[10px] ${colors.text}`}>
            <span className={`w-2.5 h-2.5 rounded-sm ${colors.bg} ${colors.border} border`} />
            {type}
          </span>
        ))}
        <span className="inline-flex items-center gap-1 text-[10px] text-amber-400">
          <span className="w-2.5 h-2.5 rounded-full ring-2 ring-amber-500/50 animate-pulse" />
          Stale (&gt;90d)
        </span>
      </div>

      <div className="flex-1 min-h-0">
        <ReactFlow
          nodes={nodes}
          edges={baseEdges}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.3}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="hsl(var(--border))" gap={24} size={1} />
          <Controls className="!bg-card !border-border !shadow-none [&>button]:!bg-card [&>button]:!border-border [&>button]:!text-foreground [&>button:hover]:!bg-muted" />
          <MiniMap
            nodeColor={(node) => {
              const type = node.data?.type as string;
              return TYPE_HEX[type] || "#6b7280";
            }}
            className="!bg-card !border-border"
            maskColor="rgba(0,0,0,0.3)"
          />
        </ReactFlow>
      </div>

      {/* Detail panel */}
      <Sheet open={!!selectedNode} onOpenChange={(open) => !open && setSelectedNode(null)}>
        <SheetContent className="w-[400px] sm:w-[440px]" data-testid="graph-detail-panel">
          {selectedNode && (
            <>
              <SheetHeader>
                <SheetTitle className="text-base">{selectedNode.subject}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-2">
                  <StatusBadge value={selectedNode.type} />
                  <StatusBadge value={selectedNode.confidence} />
                  <StatusBadge value={selectedNode.status} />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Markets</span>
                    <span>{selectedNode.markets.join(", ")}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Destinations</span>
                    <span>{selectedNode.destinations.join(", ")}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Updated</span>
                    <span className="tabular-nums">{selectedNode.updated}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Created</span>
                    <span className="tabular-nums">{selectedNode.created}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Author</span>
                    <span className="font-mono">{selectedNode.author}</span>
                  </div>
                  {selectedNode.dependsOn && selectedNode.dependsOn.length > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Depends On</span>
                      <span>{selectedNode.dependsOn.join(", ")}</span>
                    </div>
                  )}
                </div>
                {selectedNode.summary && (
                  <div className="mt-4 p-3 rounded-md bg-muted/30 border border-border">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Summary</p>
                    <p className="text-sm leading-relaxed text-foreground/80">{selectedNode.summary}</p>
                  </div>
                )}
                {highlightedIds.size > 0 && (
                  <div className="mt-4 p-3 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                    <p className="text-xs font-medium text-cyan-400 uppercase tracking-wider mb-1">Downstream Impact</p>
                    <p className="text-xs text-foreground/70">
                      {highlightedIds.size} artifact{highlightedIds.size > 1 ? "s" : ""} depend{highlightedIds.size === 1 ? "s" : ""} on this node (highlighted in cyan)
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function Graph() {
  return (
    <ReactFlowProvider>
      <GraphInner />
    </ReactFlowProvider>
  );
}
