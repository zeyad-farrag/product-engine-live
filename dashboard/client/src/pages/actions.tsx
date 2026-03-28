import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Radar,
  Database,
  Activity,
  Grid3X3,
  Globe,
  Settings,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";
import type { QuickAction } from "@shared/schema";

const iconMap: Record<string, any> = {
  radar: Radar,
  database: Database,
  activity: Activity,
  grid: Grid3X3,
  globe: Globe,
  settings: Settings,
};

function ActionCard({ action }: { action: QuickAction }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const Icon = iconMap[action.icon] || Radar;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(action.triggerPhrase);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: action.triggerPhrase,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for sandboxed environments
      const textarea = document.createElement("textarea");
      textarea.value = action.triggerPhrase;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        toast({
          title: "Copied to clipboard",
          description: action.triggerPhrase,
        });
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast({
          title: "Copy the trigger phrase",
          description: action.triggerPhrase,
        });
      }
      document.body.removeChild(textarea);
    }
  };

  return (
    <Card
      className="bg-card border-card-border hover:border-primary/30 transition-colors"
      data-testid={`card-action-${action.id}`}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-md bg-primary/10 text-primary shrink-0">
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold">{action.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
            
            <div className="mt-3 p-2.5 rounded-md bg-muted/30 border border-border">
              <p className="text-xs font-mono text-foreground/80">{action.triggerPhrase}</p>
            </div>

            <div className="flex items-center justify-between mt-3">
              {action.lastRun ? (
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  Last run: {action.lastRun}
                </span>
              ) : (
                <span className="text-[10px] text-muted-foreground">Never run</span>
              )}
              <Button
                variant="secondary"
                size="sm"
                className="h-7 text-xs gap-1.5"
                onClick={handleCopy}
                data-testid={`button-copy-${action.id}`}
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy Trigger
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Actions() {
  const { data: actions, isLoading } = useQuery<QuickAction[]>({
    queryKey: ["/api/actions"],
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" data-testid="page-actions">
      <div>
        <h1 className="text-lg font-semibold">Quick Actions</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Copy trigger phrases and run them in Perplexity Computer
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(actions || []).map((action) => (
          <ActionCard key={action.id} action={action} />
        ))}
      </div>

      <div className="p-4 rounded-md bg-muted/20 border border-border">
        <p className="text-xs text-muted-foreground">
          These actions run Product Engine skills in Perplexity Computer.
          Copy the trigger phrase, paste it into a new Perplexity Computer conversation, and the skill will execute automatically.
        </p>
      </div>
    </div>
  );
}
