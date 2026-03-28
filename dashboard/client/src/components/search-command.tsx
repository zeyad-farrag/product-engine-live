import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  User,
  Shield,
  TrendingUp,
  HeartPulse,
  Search as SearchIcon,
  BarChart3,
  FileText,
} from "lucide-react";
import type { Artifact } from "@shared/schema";

const TYPE_ICONS: Record<string, any> = {
  Persona: User,
  Competitor: Shield,
  "Demand Signal": TrendingUp,
  "Health Check": HeartPulse,
  "Gap Analysis": BarChart3,
  "Market Assessment": FileText,
};

const TYPE_ICON_COLORS: Record<string, string> = {
  Persona: "text-blue-400",
  Competitor: "text-purple-400",
  "Demand Signal": "text-amber-400",
  "Health Check": "text-green-400",
  "Gap Analysis": "text-red-400",
  "Market Assessment": "text-teal-400",
};

// Natural language patterns
const NL_PATTERNS: Array<{ pattern: RegExp; field: string; transform?: (m: string) => string }> = [
  { pattern: /^stale$/i, field: "status", transform: () => "STALE" },
  { pattern: /^active$/i, field: "status", transform: () => "ACTIVE" },
  { pattern: /^(competitors?|competitor profiles?)$/i, field: "type", transform: () => "Competitor" },
  { pattern: /^(personas?|traveler profiles?)$/i, field: "type", transform: () => "Persona" },
  { pattern: /^(demand signals?|signals?)$/i, field: "type", transform: () => "Demand Signal" },
  { pattern: /^(health checks?|performance)$/i, field: "type", transform: () => "Health Check" },
  { pattern: /^(gap analysis|gaps?)$/i, field: "type", transform: () => "Gap Analysis" },
  { pattern: /^(market assessments?|assessments?)$/i, field: "type", transform: () => "Market Assessment" },
  { pattern: /^what about (.+)$/i, field: "destination_or_market" },
];

interface ScoredArtifact {
  artifact: Artifact;
  score: number;
}

function scoreArtifact(artifact: Artifact, query: string): number {
  if (!query) return 0;
  const q = query.toLowerCase();
  let score = 0;

  // Check natural language patterns first
  for (const { pattern, field, transform } of NL_PATTERNS) {
    const match = q.match(pattern);
    if (match) {
      if (field === "status") {
        const target = transform ? transform(match[1] || "") : match[1];
        if (artifact.status === target) return 100;
        return 0;
      }
      if (field === "type") {
        const target = transform ? transform(match[1] || "") : match[1];
        if (artifact.type === target) return 90;
        return 0;
      }
      if (field === "destination_or_market") {
        const location = (match[1] || "").toLowerCase();
        if (artifact.markets.some((m) => m.toLowerCase().includes(location))) return 80;
        if (artifact.destinations.some((d) => d.toLowerCase().includes(location))) return 70;
        return 0;
      }
    }
  }

  // Exact subject match
  if (artifact.subject.toLowerCase() === q) score = Math.max(score, 100);
  // Subject contains
  else if (artifact.subject.toLowerCase().includes(q)) score = Math.max(score, 80);

  // Market matches
  if (artifact.markets.some((m) => m.toLowerCase().includes(q))) score = Math.max(score, 60);

  // Destination matches
  if (artifact.destinations.some((d) => d.toLowerCase().includes(q))) score = Math.max(score, 50);

  // Summary contains
  if (artifact.summary?.toLowerCase().includes(q)) score = Math.max(score, 30);

  // Author matches
  if (artifact.author.toLowerCase().includes(q)) score = Math.max(score, 20);

  // Type matches (partial)
  if (artifact.type.toLowerCase().includes(q)) score = Math.max(score, 60);

  return score;
}

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();

  const { data: artifacts } = useQuery<Artifact[]>({
    queryKey: ["/api/artifacts"],
  });

  // Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const results = useCallback(() => {
    if (!artifacts || !query.trim()) return [];

    const scored: ScoredArtifact[] = artifacts
      .map((artifact) => ({ artifact, score: scoreArtifact(artifact, query.trim()) }))
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 15);

    return scored;
  }, [artifacts, query]);

  const scoredResults = results();

  // Group results by type
  const groupedResults = scoredResults.reduce<Record<string, ScoredArtifact[]>>((acc, item) => {
    const type = item.artifact.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {});

  const handleSelect = (artifactId: string) => {
    setOpen(false);
    setQuery("");
    // Navigate to artifacts page - the user can then find the item
    setLocation(`/artifacts`);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-muted/30 hover:bg-muted/50 transition-colors text-sm text-muted-foreground w-64"
        data-testid="button-search"
      >
        <SearchIcon className="w-3.5 h-3.5" />
        <span className="flex-1 text-left text-xs">Search intelligence...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
          <span>⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search artifacts, markets, authors..."
          value={query}
          onValueChange={setQuery}
          data-testid="input-search"
        />
        <CommandList>
          {query.trim() && scoredResults.length === 0 && (
            <CommandEmpty>
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">No results found.</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try "Germany", "competitors", "stale", or "what about Egypt"
                </p>
              </div>
            </CommandEmpty>
          )}
          {!query.trim() && (
            <CommandEmpty>
              <div className="text-center py-6">
                <p className="text-xs text-muted-foreground">
                  Type to search across all intelligence artifacts
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                  {["Germany", "competitors", "stale", "diving", "premium"].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setQuery(suggestion)}
                      className="px-2 py-0.5 rounded-md bg-muted/50 border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </CommandEmpty>
          )}
          {Object.entries(groupedResults).map(([type, items]) => {
            const Icon = TYPE_ICONS[type] || FileText;
            const iconColor = TYPE_ICON_COLORS[type] || "text-gray-400";
            return (
              <CommandGroup key={type} heading={type}>
                {items.map(({ artifact }) => (
                  <CommandItem
                    key={artifact.id}
                    value={`${artifact.subject} ${artifact.type} ${artifact.markets.join(" ")}`}
                    onSelect={() => handleSelect(artifact.id)}
                    className="flex items-center gap-3 cursor-pointer"
                    data-testid={`search-result-${artifact.id}`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{artifact.subject}</p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {artifact.markets.join(", ")} · {artifact.destinations.join(", ")}
                      </p>
                    </div>
                    <span className={`text-[10px] shrink-0 ${
                      artifact.status === "STALE" ? "text-amber-400" : "text-green-400"
                    }`}>
                      {artifact.status}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}
