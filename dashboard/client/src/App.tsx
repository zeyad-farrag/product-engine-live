import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { apiRequest } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchCommand } from "@/components/search-command";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Overview from "@/pages/overview";
import Artifacts from "@/pages/artifacts";
import Initiatives from "@/pages/initiatives";
import Signals from "@/pages/signals";
import Coverage from "@/pages/coverage";
import Actions from "@/pages/actions";
import Graph from "@/pages/graph";
import Skills from "@/pages/skills";
import SkillDetail from "@/pages/skill-detail";
import Performance from "@/pages/performance";
import NotFound from "@/pages/not-found";

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Overview} />
      <Route path="/performance" component={Performance} />
      <Route path="/artifacts" component={Artifacts} />
      <Route path="/initiatives" component={Initiatives} />
      <Route path="/signals" component={Signals} />
      <Route path="/coverage" component={Coverage} />
      <Route path="/graph" component={Graph} />
      <Route path="/skills/:name" component={SkillDetail} />
      <Route path="/skills" component={Skills} />
      <Route path="/actions" component={Actions} />
      <Route component={NotFound} />
    </Switch>
  );
}

function RefreshButton() {
  const { toast } = useToast();

  const handleRefresh = async () => {
    try {
      await apiRequest("POST", "/api/refresh");
      // Invalidate all queries
      await queryClient.invalidateQueries();
      toast({
        title: "Refreshed",
        description: "Cache cleared. Data reloaded.",
      });
    } catch {
      toast({
        title: "Refresh failed",
        description: "Could not refresh data.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleRefresh}
      className="h-8 w-8"
      data-testid="button-refresh"
    >
      <RefreshCw className="h-4 w-4" />
    </Button>
  );
}

function AppLayout() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <header className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/80 backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <span className="text-sm font-medium text-muted-foreground hidden sm:inline">Product Engine</span>
            </div>
            <div className="flex items-center gap-2">
              <SearchCommand />
              <RefreshButton />
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto overflow-x-hidden" style={{ overscrollBehavior: "contain" }}>
            <AppRouter />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router hook={useHashLocation}>
          <AppLayout />
        </Router>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
