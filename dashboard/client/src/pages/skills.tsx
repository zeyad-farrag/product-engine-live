import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Search,
  FileText,
  CheckCircle2,
  Minus,
  Wrench,
  Network,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Skill } from "@shared/schema";
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  MarkerType,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// Layer config: order, colors, labels
const LAYER_CONFIG: Record<
  string,
  { label: string; color: string; bgClass: string; textClass: string; borderClass: string; order: number }
> = {
  foundation: {
    label: "Foundation",
    color: "#3b82f6",
    bgClass: "bg-blue-500/15",
    textClass: "text-blue-400",
    borderClass: "border-blue-500/30",
    order: 0,
  },
  initiative: {
    label: "Initiatives",
    color: "#a855f7",
    bgClass: "bg-purple-500/15",
    textClass: "text-purple-400",
    borderClass: "border-purple-500/30",
    order: 1,
  },
  capability: {
    label: "Capabilities",
    color: "#22c55e",
    bgClass: "bg-green-500/15",
    textClass: "text-green-400",
    borderClass: "border-green-500/30",
    order: 2,
  },
  intelligence: {
    label: "Intelligence",
    color: "#f59e0b",
    bgClass: "bg-amber-500/15",
    textClass: "text-amber-400",
    borderClass: "border-amber-500/30",
    order: 3,
  },
  memory: {
    label: "Memory",
    color: "#14b8a6",
    bgClass: "bg-teal-500/15",
    textClass: "text-teal-400",
    borderClass: "border-teal-500/30",
    order: 4,
  },
};

function getLayerConfig(layer: string) {
  return (
    LAYER_CONFIG[layer] || {
      label: layer,
      color: "#6b7280",
      bgClass: "bg-gray-500/15",
      textClass: "text-gray-400",
      borderClass: "border-gray-500/30",
      order: 99,
    }
  );
}

function LayerBadge({ layer }: { layer: string }) {
  const config = getLayerConfig(layer);
  return (
    <Badge
      variant="outline"
      className={`${config.bgClass} ${config.textClass} ${config.borderClass} text-[10px] uppercase tracking-wider font-medium`}
    >
      {config.label}
    </Badge>
  );
}

function SkillCard({ skill }: { skill: Skill }) {
  const config = getLayerConfig(skill.layer);

  return (
    <Link href={`/skills/${skill.name}`}>
      <Card
        className={`group cursor-pointer transition-all hover:shadow-md hover:border-foreground/20 border ${config.borderClass}`}
        data-testid={`card-skill-${skill.name}`}
      >
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {skill.displayName}
              </h3>
              <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                {skill.name}
              </p>
            </div>
            <LayerBadge layer={skill.layer} />
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 min-h-[2rem]">
            {skill.description || "No description available"}
          </p>

          <div className="flex items-center gap-3 pt-1">
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <FileText className="w-3 h-3" />
              {skill.fileCount} files
            </span>
            <span
              className={`inline-flex items-center gap-1 text-[10px] ${
                skill.hasIoContract ? "text-green-400" : "text-muted-foreground/50"
              }`}
            >
              {skill.hasIoContract ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <Minus className="w-3 h-3" />
              )}
              I/O Contract
            </span>
            {skill.version && (
              <span className="text-[10px] text-muted-foreground font-mono">
                v{skill.version}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// --- Skill Relationship Map ---

function buildRelationshipGraph(skills: Skill[]): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const skillNames = new Set(skills.map((s) => s.name));

  // Layout: arrange by layer in rows
  const layerGroups: Record<string, Skill[]> = {};
  for (const skill of skills) {
    const key = skill.layer || "unknown";
    if (!layerGroups[key]) layerGroups[key] = [];
    layerGroups[key].push(skill);
  }

  const layerOrder = ["foundation", "initiative", "capability", "intelligence", "memory"];
  let y = 0;

  for (const layerKey of layerOrder) {
    const group = layerGroups[layerKey] || [];
    const config = getLayerConfig(layerKey);
    let x = 0;
    for (const skill of group) {
      nodes.push({
        id: skill.name,
        position: { x: x * 250, y: y * 140 },
        data: { label: skill.displayName, layer: skill.layer },
        style: {
          background: config.color + "22",
          border: `1px solid ${config.color}66`,
          borderRadius: "8px",
          padding: "8px 14px",
          fontSize: "12px",
          fontWeight: 500,
          color: config.color,
          minWidth: "140px",
          textAlign: "center" as const,
        },
      });
      x++;
    }
    if (group.length > 0) y++;
  }

  // For edges: we'd need to parse SKILL.md content for references.
  // Since we only have the list here (not full content), we'll add edges based on name mentions
  // This is a simplified version — the detail page will have richer data
  // We skip edges on the list page since we don't have SKILL.md content loaded

  return { nodes, edges };
}

function SkillRelationshipMap({ skills }: { skills: Skill[] }) {
  const { nodes, edges } = useMemo(() => buildRelationshipGraph(skills), [skills]);

  if (nodes.length === 0) return null;

  return (
    <div className="h-[400px] rounded-lg border border-border overflow-hidden bg-background" data-testid="skill-relationship-map">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.4}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={true}
        nodesConnectable={false}
      >
        <Background color="hsl(var(--border))" gap={24} size={1} />
        <Controls className="!bg-card !border-border !shadow-none [&>button]:!bg-card [&>button]:!border-border [&>button]:!text-foreground [&>button:hover]:!bg-muted" />
      </ReactFlow>
    </div>
  );
}

// --- Create Skill Dialog ---

function CreateSkillDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [layer, setLayer] = useState("capability");

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/skills", {
        name,
        displayName,
        description,
        layer,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({ title: "Skill created", description: `${name} has been created.` });
      onOpenChange(false);
      setName("");
      setDisplayName("");
      setDescription("");
      setLayer("capability");
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to create skill",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const isValid = /^pe-[a-z0-9-]+$/.test(name) && description.length > 0 && layer.length > 0;

  const previewMd = `---
name: ${displayName || name}
description: >
  ${description}
metadata:
  layer: ${layer}
  system: product-engine
  repo: zeyad-farrag/Product-Engine
---

# ${displayName || name}

## When to Use This Skill

[Describe when this skill should be loaded]

## Instructions

[Step-by-step workflow]

## Storage

[How and where artifacts are stored]

## Operating Principles

[Quality criteria and design principles]`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col" data-testid="dialog-create-skill">
        <DialogHeader>
          <DialogTitle className="text-base">Create New Skill</DialogTitle>
        </DialogHeader>

        <div className="flex gap-6 flex-1 min-h-0 overflow-hidden">
          {/* Form */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">
                Skill Name
              </label>
              <Input
                placeholder="pe-my-skill"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="font-mono text-sm"
                data-testid="input-skill-name"
              />
              {name && !/^pe-[a-z0-9-]*$/.test(name) && (
                <p className="text-[10px] text-destructive mt-1">
                  Must start with pe- and contain only lowercase letters, numbers, hyphens
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">
                Display Name
              </label>
              <Input
                placeholder="My Skill"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="text-sm"
                data-testid="input-skill-display-name"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">
                Description
              </label>
              <Textarea
                placeholder="What this skill does..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="text-sm resize-none"
                data-testid="input-skill-description"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">
                Layer
              </label>
              <Select value={layer} onValueChange={setLayer}>
                <SelectTrigger data-testid="select-skill-layer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="foundation">Foundation</SelectItem>
                  <SelectItem value="initiative">Initiative</SelectItem>
                  <SelectItem value="capability">Capability</SelectItem>
                  <SelectItem value="intelligence">Intelligence</SelectItem>
                  <SelectItem value="memory">Memory</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preview */}
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            <p className="text-xs font-medium text-muted-foreground mb-2">SKILL.md Preview</p>
            <ScrollArea className="flex-1 rounded-md border border-border bg-muted/30">
              <pre className="p-4 text-xs font-mono text-foreground/80 whitespace-pre-wrap leading-relaxed">
                {previewMd}
              </pre>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => createMutation.mutate()}
            disabled={!isValid || createMutation.isPending}
            data-testid="button-create-skill"
          >
            {createMutation.isPending ? "Creating..." : "Create Skill"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- Main Page ---

type ViewMode = "grid" | "map";

export default function Skills() {
  const { data: skills, isLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  const [search, setSearch] = useState("");
  const [layerFilter, setLayerFilter] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const filteredSkills = useMemo(() => {
    if (!skills) return [];
    let result = [...skills];
    if (layerFilter !== "all") {
      result = result.filter((s) => s.layer === layerFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.displayName.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [skills, search, layerFilter]);

  // Group by layer
  const grouped = useMemo(() => {
    const groups: Record<string, Skill[]> = {};
    for (const skill of filteredSkills) {
      const key = skill.layer || "unknown";
      if (!groups[key]) groups[key] = [];
      groups[key].push(skill);
    }
    // Sort by layer order
    const sorted = Object.entries(groups).sort(([a], [b]) => {
      return (getLayerConfig(a).order ?? 99) - (getLayerConfig(b).order ?? 99);
    });
    return sorted;
  }, [filteredSkills]);

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center gap-3 min-h-[400px]" data-testid="page-skills-loading">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading skills from repository...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" data-testid="page-skills">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-semibold flex items-center gap-2">
              <Wrench className="w-5 h-5 text-muted-foreground" />
              Skills
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              {skills?.length || 0} skills across {Object.keys(LAYER_CONFIG).length} layers
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setCreateDialogOpen(true)}
            data-testid="button-new-skill"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Create New Skill
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm"
              data-testid="input-search-skills"
            />
          </div>
          <Select value={layerFilter} onValueChange={setLayerFilter}>
            <SelectTrigger className="w-40 h-8 text-sm" data-testid="select-layer-filter">
              <SelectValue placeholder="All Layers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Layers</SelectItem>
              <SelectItem value="foundation">Foundation</SelectItem>
              <SelectItem value="initiative">Initiatives</SelectItem>
              <SelectItem value="capability">Capabilities</SelectItem>
              <SelectItem value="intelligence">Intelligence</SelectItem>
              <SelectItem value="memory">Memory</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center border border-border rounded-md overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 rounded-none px-3"
              onClick={() => setViewMode("grid")}
              data-testid="button-view-grid"
            >
              <FileText className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant={viewMode === "map" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 rounded-none px-3"
              onClick={() => setViewMode("map")}
              data-testid="button-view-map"
            >
              <Network className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          {viewMode === "map" && skills ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-medium text-foreground mb-1">Skill Relationship Map</h2>
                <p className="text-xs text-muted-foreground">
                  Skills organized by layer. Drag nodes to rearrange.
                </p>
              </div>
              <ReactFlowProvider>
                <SkillRelationshipMap skills={filteredSkills} />
              </ReactFlowProvider>
            </div>
          ) : (
            <div className="space-y-8">
              {grouped.map(([layerKey, layerSkills]) => {
                const config = getLayerConfig(layerKey);
                return (
                  <section key={layerKey} data-testid={`section-layer-${layerKey}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: config.color }}
                      />
                      <h2 className={`text-sm font-semibold ${config.textClass}`}>
                        {config.label}
                      </h2>
                      <span className="text-xs text-muted-foreground">
                        ({layerSkills.length})
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {layerSkills.map((skill) => (
                        <SkillCard key={skill.name} skill={skill} />
                      ))}
                    </div>
                  </section>
                );
              })}
              {grouped.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Wrench className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No skills found matching your filter.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      <CreateSkillDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </div>
  );
}
