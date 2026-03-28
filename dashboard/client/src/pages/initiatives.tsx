import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/status-badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, FileText, ChevronRight, ChevronDown } from "lucide-react";
import type { Initiative, Artifact } from "@shared/schema";

const PHASES = ["FRAME", "DISCOVER", "DECIDE", "CONFIRM"] as const;

const PHASE_META: Record<string, { label: string; bg: string; headerBg: string }> = {
  FRAME: { label: "Frame", bg: "bg-slate-500/5", headerBg: "bg-slate-500/15 text-slate-300" },
  DISCOVER: { label: "Discover", bg: "bg-indigo-500/5", headerBg: "bg-indigo-500/15 text-indigo-300" },
  DECIDE: { label: "Decide", bg: "bg-amber-500/5", headerBg: "bg-amber-500/15 text-amber-300" },
  CONFIRM: { label: "Confirm", bg: "bg-green-500/5", headerBg: "bg-green-500/15 text-green-300" },
  CLOSED: { label: "Closed", bg: "bg-gray-500/5", headerBg: "bg-gray-500/15 text-gray-400" },
};

const TYPE_COLORS: Record<string, string> = {
  MARKET_ENTRY: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  OPTIMIZATION: "bg-teal-500/15 text-teal-400 border-teal-500/20",
  REPOSITIONING: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  NPD: "bg-orange-500/15 text-orange-400 border-orange-500/20",
};

const INFLECTION_POINTS: Record<string, string> = {
  "DISCOVER-DECIDE": "IP1: Worth pursuing?",
  "DECIDE-CONFIRM": "IP3: Ready to execute?",
};

function InitiativeCard({
  initiative,
  onClick,
}: {
  initiative: Initiative;
  onClick: () => void;
}) {
  return (
    <div
      className={`p-3 rounded-lg border border-border bg-card hover:bg-muted/20 cursor-pointer transition-colors ${
        initiative.status === "CLOSED" ? "opacity-70" : ""
      }`}
      onClick={onClick}
      data-testid={`kanban-card-${initiative.id}`}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <StatusBadge value={initiative.type} />
      </div>
      <h3 className="text-sm font-medium leading-tight mb-2">{initiative.subject}</h3>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>Started {initiative.started}</span>
        <span className="flex items-center gap-1">
          <FileText className="w-3 h-3" />
          {initiative.artifacts.length}
        </span>
      </div>
      <div className="text-[10px] text-muted-foreground mt-0.5">
        Updated {initiative.updated}
      </div>
      {initiative.status === "CLOSED" && initiative.decision && (
        <div className="mt-2 p-2 rounded-md bg-green-500/10 border border-green-500/20">
          <div className="flex items-center gap-1 text-green-400 text-[10px] font-medium mb-0.5">
            <CheckCircle2 className="w-3 h-3" />
            Decision
          </div>
          <p className="text-[10px] text-foreground/70 leading-relaxed line-clamp-2">
            {initiative.decision}
          </p>
        </div>
      )}
    </div>
  );
}

function KanbanColumn({
  phase,
  initiatives,
  onCardClick,
}: {
  phase: string;
  initiatives: Initiative[];
  onCardClick: (i: Initiative) => void;
}) {
  const meta = PHASE_META[phase];
  return (
    <div className={`flex flex-col min-w-[260px] w-[280px] shrink-0 rounded-lg ${meta.bg}`}>
      <div className={`px-3 py-2 rounded-t-lg ${meta.headerBg} flex items-center justify-between`}>
        <span className="text-xs font-semibold uppercase tracking-wider">{meta.label}</span>
        <span className="text-xs font-medium tabular-nums opacity-70">{initiatives.length}</span>
      </div>
      <div className="p-2 space-y-2 flex-1 overflow-y-auto">
        {initiatives.map((initiative) => (
          <InitiativeCard
            key={initiative.id}
            initiative={initiative}
            onClick={() => onCardClick(initiative)}
          />
        ))}
        {initiatives.length === 0 && (
          <div className="text-xs text-muted-foreground text-center py-8">
            No initiatives
          </div>
        )}
      </div>
    </div>
  );
}

function InflectionGate({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center w-8 shrink-0">
      <div className="w-px h-12 bg-border" />
      <div className="text-[9px] text-muted-foreground text-center leading-tight px-0.5 py-1 whitespace-nowrap -rotate-90 origin-center">
        {label}
      </div>
      <div className="w-px h-12 bg-border" />
    </div>
  );
}

export default function Initiatives() {
  const { data: initiatives, isLoading } = useQuery<Initiative[]>({
    queryKey: ["/api/initiatives"],
  });
  const { data: artifacts } = useQuery<Artifact[]>({
    queryKey: ["/api/artifacts"],
  });

  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null);
  const [closedExpanded, setClosedExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-64" />
          ))}
        </div>
      </div>
    );
  }

  const allInitiatives = initiatives || [];
  const active = allInitiatives.filter((i) => i.status === "ACTIVE");
  const closed = allInitiatives.filter((i) => i.status === "CLOSED");

  // Group active by phase
  const byPhase: Record<string, Initiative[]> = { FRAME: [], DISCOVER: [], DECIDE: [], CONFIRM: [] };
  for (const i of active) {
    if (byPhase[i.phase]) byPhase[i.phase].push(i);
  }

  // Get artifacts for selected initiative
  const selectedArtifacts = selectedInitiative
    ? (artifacts || []).filter((a) => selectedInitiative.artifacts.includes(a.id))
    : [];

  return (
    <div className="h-full flex flex-col" data-testid="page-initiatives">
      <div className="px-6 py-4 border-b border-border shrink-0">
        <h1 className="text-lg font-semibold">Initiatives</h1>
        <p className="text-xs text-muted-foreground mt-1">
          {active.length} active, {closed.length} closed — Kanban view across inflection points
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          <div className="flex items-stretch gap-0 overflow-x-auto pb-4">
            {PHASES.map((phase, idx) => (
              <div key={phase} className="flex items-stretch">
                <KanbanColumn
                  phase={phase}
                  initiatives={byPhase[phase]}
                  onCardClick={setSelectedInitiative}
                />
                {/* Inflection gates between specific columns */}
                {idx < PHASES.length - 1 && (
                  <div className="flex items-stretch">
                    {INFLECTION_POINTS[`${PHASES[idx]}-${PHASES[idx + 1]}`] ? (
                      <InflectionGate
                        label={INFLECTION_POINTS[`${PHASES[idx]}-${PHASES[idx + 1]}`]}
                      />
                    ) : (
                      <div className="w-3 shrink-0" />
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Closed column - collapsible */}
            <div className="ml-3 shrink-0">
              <div
                className="flex items-center gap-1 cursor-pointer mb-2"
                onClick={() => setClosedExpanded(!closedExpanded)}
                data-testid="button-toggle-closed"
              >
                {closedExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                )}
                <span className="text-xs text-muted-foreground font-medium">
                  Closed ({closed.length})
                </span>
              </div>
              {closedExpanded && (
                <KanbanColumn
                  phase="CLOSED"
                  initiatives={closed}
                  onCardClick={setSelectedInitiative}
                />
              )}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Detail dialog */}
      <Dialog
        open={!!selectedInitiative}
        onOpenChange={(open) => !open && setSelectedInitiative(null)}
      >
        <DialogContent className="max-w-lg" data-testid="dialog-initiative-detail">
          {selectedInitiative && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">{selectedInitiative.subject}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="flex items-center gap-2">
                  <StatusBadge value={selectedInitiative.type} />
                  <StatusBadge value={selectedInitiative.phase} />
                  {selectedInitiative.status === "CLOSED" && <StatusBadge value="CLOSED" />}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Started</span>
                    <p className="font-medium tabular-nums">{selectedInitiative.started}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Updated</span>
                    <p className="font-medium tabular-nums">{selectedInitiative.updated}</p>
                  </div>
                </div>

                {/* Artifacts list */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Linked Artifacts ({selectedArtifacts.length})
                  </p>
                  <div className="space-y-1.5">
                    {selectedArtifacts.map((a) => (
                      <div
                        key={a.id}
                        className="flex items-center gap-2 p-2 rounded-md bg-muted/20 border border-border text-xs"
                      >
                        <StatusBadge value={a.type} />
                        <span className="font-medium truncate flex-1">{a.subject}</span>
                        <StatusBadge value={a.confidence} />
                      </div>
                    ))}
                    {selectedArtifacts.length === 0 && (
                      <p className="text-xs text-muted-foreground">No linked artifacts found.</p>
                    )}
                  </div>
                </div>

                {selectedInitiative.decision && (
                  <div className="p-3 rounded-md bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-1.5 text-green-400 text-xs font-medium mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Decision
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {selectedInitiative.decision}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
