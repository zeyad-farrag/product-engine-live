import {
  LayoutDashboard,
  FolderOpen,
  Rocket,
  Radio,
  Map,
  Zap,
  Network,
  Wrench,
  BarChart3,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";

const navItems = [
  { title: "Performance", url: "/performance", icon: BarChart3 },
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Artifacts", url: "/artifacts", icon: FolderOpen },
  { title: "Initiatives", url: "/initiatives", icon: Rocket },
  { title: "Signals", url: "/signals", icon: Radio },
  { title: "Coverage", url: "/coverage", icon: Map },
  { title: "Graph", url: "/graph", icon: Network },
  { title: "Skills", url: "/skills", icon: Wrench },
  { title: "Actions", url: "/actions", icon: Zap },
];

function ProductEngineLogo() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className="w-8 h-8"
      aria-label="Product Engine"
    >
      {/* Hexagonal shape representing interconnected intelligence */}
      <path
        d="M16 2L28 9V23L16 30L4 23V9L16 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-primary"
      />
      {/* Inner node network — 3 connected nodes */}
      <circle cx="16" cy="10" r="2" fill="currentColor" className="text-primary" />
      <circle cx="10" cy="22" r="2" fill="currentColor" className="text-primary" />
      <circle cx="22" cy="22" r="2" fill="currentColor" className="text-primary" />
      <line x1="16" y1="10" x2="10" y2="22" stroke="currentColor" strokeWidth="1.2" className="text-primary" opacity="0.6" />
      <line x1="16" y1="10" x2="22" y2="22" stroke="currentColor" strokeWidth="1.2" className="text-primary" opacity="0.6" />
      <line x1="10" y1="22" x2="22" y2="22" stroke="currentColor" strokeWidth="1.2" className="text-primary" opacity="0.6" />
      {/* Center dot */}
      <circle cx="16" cy="18" r="1.5" fill="currentColor" className="text-primary" opacity="0.4" />
    </svg>
  );
}

export function AppSidebar() {
  const [location] = useLocation();
  const { data: systemInfo } = useQuery<{ mode: string; repo: string; skillCount: number; layers: string[] }>({
    queryKey: ["/api/system"],
  });

  const isLive = systemInfo?.mode === "live";

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-4">
        <div className="flex items-center gap-3">
          <ProductEngineLogo />
          <div>
            <div className="font-semibold text-sm text-sidebar-foreground">Product Engine</div>
            <div className="text-xs text-muted-foreground">Intelligence Dashboard</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.url === "/"
                    ? location === "/" || location === ""
                    : location.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      data-testid={`nav-${item.title.toLowerCase()}`}
                    >
                      <Link href={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-3 py-2 text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Mode</span>
                <span className="inline-flex items-center gap-1" data-testid="status-mode">
                  <span className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-green-500" : "bg-amber-500"}`} />
                  {isLive ? "Live" : "Demo"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Skills</span>
                <span>{systemInfo?.skillCount || 16}</span>
              </div>
              <div className="flex justify-between">
                <span>Layers</span>
                <span>{systemInfo?.layers?.length || 5}</span>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3">
        <PerplexityAttribution />
      </SidebarFooter>
    </Sidebar>
  );
}
