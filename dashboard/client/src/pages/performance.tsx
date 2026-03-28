import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
  ComposedChart,
  Cell,
  PieChart,
  Pie,
  Treemap,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  ShoppingCart,
  DollarSign,
  Target,
  AlertTriangle,
  Star,
  Globe,
} from "lucide-react";
import { useState, useMemo } from "react";
import type {
  PerformanceKPIs,
  BookingVelocityPoint,
  MarketBreakdown,
  ProductMix,
  DestinationMix,
  FunnelStep,
  MonthlyTrend,
  WebsiteSource,
  RatingsSummary,
} from "@shared/schema";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

function TrendArrow({ change }: { change: number }) {
  if (change > 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-emerald-500 text-xs font-medium">
        <TrendingUp className="w-3 h-3" />+{change.toFixed(1)}%
      </span>
    );
  if (change < 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-red-400 text-xs font-medium">
        <TrendingDown className="w-3 h-3" />
        {change.toFixed(1)}%
      </span>
    );
  return (
    <span className="inline-flex items-center gap-0.5 text-muted-foreground text-xs font-medium">
      <Minus className="w-3 h-3" />
      0%
    </span>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive" data-testid="error-card">
      <AlertTriangle className="w-4 h-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

function SectionSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-6 w-full" />
      ))}
    </div>
  );
}

// ─── Compute 7-day Moving Average ─────────────────────────────────────────────

function computeMovingAvg(data: BookingVelocityPoint[], windowSize = 7) {
  return data.map((d, i) => {
    const start = Math.max(0, i - windowSize + 1);
    const window = data.slice(start, i + 1);
    const avgTotal = window.reduce((s, p) => s + p.total, 0) / window.length;
    const avgConfirmed = window.reduce((s, p) => s + p.confirmed, 0) / window.length;
    return {
      ...d,
      totalMA: Math.round(avgTotal),
      confirmedMA: Math.round(avgConfirmed),
    };
  });
}

// ─── Chart configs ────────────────────────────────────────────────────────────

const velocityConfig: ChartConfig = {
  total: { label: "Total Requests", color: "hsl(var(--chart-1))" },
  confirmed: { label: "Confirmed", color: "hsl(142 71% 45%)" },
  totalMA: { label: "Total (7d avg)", color: "hsl(var(--chart-2))" },
  confirmedMA: { label: "Confirmed (7d avg)", color: "hsl(142 50% 60%)" },
};

const marketConfig: ChartConfig = {
  confirmed: { label: "Confirmed", color: "hsl(142 71% 45%)" },
  unconfirmed: { label: "Unconfirmed", color: "hsl(var(--muted))" },
};

const trendConfig: ChartConfig = {
  revenue: { label: "Revenue", color: "hsl(var(--chart-3))" },
  confirmed: { label: "Bookings", color: "hsl(var(--chart-1))" },
};

// Funnel colors from wide to narrow
const FUNNEL_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(210 10% 40%)",
  "hsl(210 10% 50%)",
  "hsl(210 10% 60%)",
];

// Donut colors
const DONUT_COLORS = [
  "hsl(177 40% 47%)",
  "hsl(142 71% 45%)",
  "hsl(43 74% 55%)",
  "hsl(262 40% 55%)",
  "hsl(27 87% 55%)",
  "hsl(200 60% 50%)",
  "hsl(340 65% 55%)",
  "hsl(170 50% 40%)",
  "hsl(210 10% 50%)",
];

// ─── KPI Cards ────────────────────────────────────────────────────────────────

function KPICards({ data }: { data: PerformanceKPIs }) {
  const cards = [
    {
      title: "Total Requests",
      value: formatNumber(data.totalRequests.current),
      change: data.totalRequests.change,
      prev: formatNumber(data.totalRequests.previous),
      icon: BarChart3,
    },
    {
      title: "Confirmed Bookings",
      value: formatNumber(data.confirmedBookings.current),
      change: data.confirmedBookings.change,
      prev: formatNumber(data.confirmedBookings.previous),
      icon: ShoppingCart,
    },
    {
      title: "Avg Booking Value",
      value: formatCurrency(data.avgBookingValue.current),
      change: data.avgBookingValue.change,
      prev: formatCurrency(data.avgBookingValue.previous),
      icon: DollarSign,
    },
    {
      title: "Conversion Rate",
      value: `${data.conversionRate.current.toFixed(1)}%`,
      change: data.conversionRate.change,
      prev: `${data.conversionRate.previous.toFixed(1)}%`,
      icon: Target,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <Card key={c.title} className="relative overflow-hidden" data-testid={`kpi-${c.title.toLowerCase().replace(/\s+/g, "-")}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {c.title}
              </span>
              <c.icon className="w-4 h-4 text-muted-foreground/50" />
            </div>
            <div className="text-2xl font-semibold tabular-nums tracking-tight">
              {c.value}
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <TrendArrow change={c.change} />
              <span className="text-xs text-muted-foreground">
                vs {c.prev} last month
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Booking Velocity Chart ───────────────────────────────────────────────────

function BookingVelocityChart({ data }: { data: BookingVelocityPoint[] }) {
  const chartData = useMemo(() => computeMovingAvg(data), [data]);

  return (
    <Card data-testid="chart-booking-velocity">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Booking Velocity</CardTitle>
        <p className="text-xs text-muted-foreground">
          Daily request volume with 7-day moving average
        </p>
      </CardHeader>
      <CardContent className="px-2 pb-4">
        <ChartContainer config={velocityConfig} className="h-[300px] w-full aspect-auto">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="confirmedFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142 71% 45%)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="hsl(142 71% 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
            <XAxis
              dataKey="date"
              tickFormatter={(v: string) => {
                const d = new Date(v);
                return `${d.getMonth() + 1}/${d.getDate()}`;
              }}
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
            />
            <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" width={40} />
            <ChartTooltip
              content={<ChartTooltipContent />}
              labelFormatter={(v: string) =>
                new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              }
            />
            <Area
              type="monotone"
              dataKey="confirmed"
              stroke="hsl(142 71% 45%)"
              fill="url(#confirmedFill)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="totalMA"
              stroke="hsl(var(--chart-2))"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="confirmedMA"
              stroke="hsl(142 50% 60%)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// ─── Market Performance (Horizontal Bar) ──────────────────────────────────────

function MarketPerformanceChart({ data }: { data: MarketBreakdown[] }) {
  const chartData = useMemo(
    () =>
      data.slice(0, 15).map((d) => ({
        country: d.country.length > 18 ? d.country.slice(0, 16) + "…" : d.country,
        fullCountry: d.country,
        confirmed: d.confirmed,
        unconfirmed: d.total - d.confirmed,
        conversionRate: d.conversionRate,
      })),
    [data]
  );

  return (
    <Card data-testid="chart-market-performance">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Market Performance</CardTitle>
        <p className="text-xs text-muted-foreground">
          Top markets by request volume (last 90 days)
        </p>
      </CardHeader>
      <CardContent className="px-2 pb-4">
        <ChartContainer config={marketConfig} className="h-[400px] w-full aspect-auto">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 40, left: 5, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="country"
              tick={{ fontSize: 11 }}
              width={110}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              labelFormatter={(_: any, payload: any) => payload?.[0]?.payload?.fullCountry || ""}
            />
            <Bar dataKey="confirmed" stackId="a" fill="hsl(142 71% 45%)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="unconfirmed" stackId="a" fill="hsl(var(--muted))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// ─── Product Mix (Donut Chart) ────────────────────────────────────────────────

function ProductMixChart({ data }: { data: ProductMix[] }) {
  const chartData = useMemo(() => {
    if (data.length <= 8) {
      return data.map((d) => ({ name: d.productType, value: d.total }));
    }
    const top8 = data.slice(0, 8);
    const otherTotal = data.slice(8).reduce((s, d) => s + d.total, 0);
    return [
      ...top8.map((d) => ({ name: d.productType, value: d.total })),
      { name: "Other", value: otherTotal },
    ];
  }, [data]);

  const donutConfig: ChartConfig = {};
  chartData.forEach((d, i) => {
    donutConfig[d.name] = {
      label: d.name,
      color: DONUT_COLORS[i % DONUT_COLORS.length],
    };
  });

  return (
    <Card data-testid="chart-product-mix">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Product Mix</CardTitle>
        <p className="text-xs text-muted-foreground">
          Request distribution by product type (last 90 days)
        </p>
      </CardHeader>
      <CardContent className="px-2 pb-4">
        <div className="flex flex-col items-center">
          <ChartContainer config={donutConfig} className="h-[250px] w-full aspect-auto">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-2 px-2">
            {chartData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div
                  className="w-2.5 h-2.5 rounded-sm shrink-0"
                  style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }}
                />
                <span>{d.name}</span>
                <span className="tabular-nums font-medium text-foreground">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Destination Mix (Horizontal Bars) ────────────────────────────────────────

function DestinationMixChart({ data }: { data: DestinationMix[] }) {
  const chartData = useMemo(() => data.slice(0, 20), [data]);

  const destConfig: ChartConfig = {
    total: { label: "Total", color: "hsl(var(--chart-1))" },
    confirmed: { label: "Confirmed", color: "hsl(142 71% 45%)" },
  };

  return (
    <Card data-testid="chart-destination-mix">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Destination Mix</CardTitle>
        <p className="text-xs text-muted-foreground">
          Most requested destinations (last 90 days)
        </p>
      </CardHeader>
      <CardContent className="px-2 pb-4">
        <ChartContainer config={destConfig} className="h-[400px] w-full aspect-auto">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 5, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="destination"
              tick={{ fontSize: 11 }}
              width={100}
              tickFormatter={(v: string) => v.length > 16 ? v.slice(0, 14) + "…" : v}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="total" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} opacity={0.4} />
            <Bar dataKey="confirmed" fill="hsl(142 71% 45%)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// ─── Booking Funnel ───────────────────────────────────────────────────────────

function BookingFunnelChart({ data }: { data: FunnelStep[] }) {
  const sorted = useMemo(() => [...data].sort((a, b) => b.count - a.count), [data]);

  return (
    <Card data-testid="chart-booking-funnel">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Booking Funnel</CardTitle>
        <p className="text-xs text-muted-foreground">
          Pipeline by status (last 30 days)
        </p>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="space-y-2">
          {sorted.map((step, i) => {
            const maxCount = sorted[0]?.count || 1;
            const widthPct = Math.max((step.count / maxCount) * 100, 4);
            return (
              <div key={step.status} className="group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground truncate max-w-[60%]">
                    {step.status}
                  </span>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {step.count.toLocaleString()} ({step.percentage}%)
                  </span>
                </div>
                <div className="h-7 w-full rounded bg-muted/30 overflow-hidden">
                  <div
                    className="h-full rounded transition-all duration-500"
                    style={{
                      width: `${widthPct}%`,
                      backgroundColor: FUNNEL_COLORS[i % FUNNEL_COLORS.length],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Monthly Revenue Trends ───────────────────────────────────────────────────

function MonthlyTrendsChart({ data }: { data: MonthlyTrend[] }) {
  return (
    <Card data-testid="chart-monthly-trends">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Monthly Revenue & Bookings</CardTitle>
        <p className="text-xs text-muted-foreground">
          Revenue (bars) and confirmed bookings (line) over time
        </p>
      </CardHeader>
      <CardContent className="px-2 pb-4">
        <ChartContainer config={trendConfig} className="h-[300px] w-full aspect-auto">
          <ComposedChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11 }}
              tickFormatter={(v: string) => {
                const [y, m] = v.split("-");
                const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                return `${months[parseInt(m, 10) - 1]} '${y.slice(2)}`;
              }}
            />
            <YAxis
              yAxisId="revenue"
              tick={{ fontSize: 11 }}
              tickFormatter={(v: number) => formatCurrency(v)}
              width={60}
            />
            <YAxis
              yAxisId="bookings"
              orientation="right"
              tick={{ fontSize: 11 }}
              width={40}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              labelFormatter={(v: string) => {
                const [y, m] = v.split("-");
                const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                return `${months[parseInt(m, 10) - 1]} ${y}`;
              }}
            />
            <Bar
              yAxisId="revenue"
              dataKey="revenue"
              fill="hsl(var(--chart-3))"
              radius={[4, 4, 0, 0]}
              opacity={0.7}
            />
            <Line
              yAxisId="bookings"
              type="monotone"
              dataKey="confirmed"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// ─── Brand Performance Table ──────────────────────────────────────────────────

function BrandPerformanceTable({ data }: { data: WebsiteSource[] }) {
  const [sortField, setSortField] = useState<keyof WebsiteSource>("total");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      const va = a[sortField];
      const vb = b[sortField];
      if (typeof va === "number" && typeof vb === "number") {
        return sortDir === "desc" ? vb - va : va - vb;
      }
      return sortDir === "desc"
        ? String(vb).localeCompare(String(va))
        : String(va).localeCompare(String(vb));
    });
  }, [data, sortField, sortDir]);

  function toggleSort(field: keyof WebsiteSource) {
    if (sortField === field) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  const headerClass =
    "text-left text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer hover:text-foreground transition-colors select-none px-3 py-2";

  return (
    <Card data-testid="table-brand-performance">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium">Brand Performance</CardTitle>
            <p className="text-xs text-muted-foreground">
              Website/brand breakdown (last 90 days)
            </p>
          </div>
          <Globe className="w-4 h-4 text-muted-foreground/50" />
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="brand-table">
            <thead>
              <tr className="border-b border-border">
                <th className={headerClass} onClick={() => toggleSort("brand")}>
                  Brand {sortField === "brand" && (sortDir === "desc" ? "↓" : "↑")}
                </th>
                <th className={`${headerClass} text-right`} onClick={() => toggleSort("total")}>
                  Requests {sortField === "total" && (sortDir === "desc" ? "↓" : "↑")}
                </th>
                <th className={`${headerClass} text-right`} onClick={() => toggleSort("confirmed")}>
                  Confirmed {sortField === "confirmed" && (sortDir === "desc" ? "↓" : "↑")}
                </th>
                <th className={`${headerClass} text-right`} onClick={() => toggleSort("conversionRate")}>
                  Conv. Rate {sortField === "conversionRate" && (sortDir === "desc" ? "↓" : "↑")}
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => (
                <tr
                  key={row.brand}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-3 py-2.5 font-medium">{row.brand}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{row.total.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{row.confirmed.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-right">
                    <Badge
                      variant="outline"
                      className={`tabular-nums ${
                        row.conversionRate >= 20
                          ? "border-emerald-500/30 text-emerald-500"
                          : row.conversionRate >= 10
                          ? "border-amber-500/30 text-amber-500"
                          : "border-red-400/30 text-red-400"
                      }`}
                    >
                      {row.conversionRate.toFixed(1)}%
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Ratings Summary ──────────────────────────────────────────────────────────

function RatingsSummaryCard({ data }: { data: RatingsSummary }) {
  return (
    <Card data-testid="card-ratings-summary">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Client Satisfaction</CardTitle>
          <Star className="w-4 h-4 text-amber-400" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div className="flex items-center gap-3">
          <div className="text-3xl font-semibold tabular-nums">
            {data.avgRating.toFixed(1)}
          </div>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(data.avgRating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-semibold tabular-nums">{data.totalRatings}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div>
            <div className="text-lg font-semibold tabular-nums text-emerald-500">{data.positive}</div>
            <div className="text-xs text-muted-foreground">Positive</div>
          </div>
          <div>
            <div className="text-lg font-semibold tabular-nums text-red-400">{data.negative}</div>
            <div className="text-xs text-muted-foreground">Negative</div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Satisfaction</span>
            <span className="font-medium tabular-nums">{data.satisfactionRate.toFixed(1)}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${Math.min(data.satisfactionRate, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Performance Page ────────────────────────────────────────────────────

export default function Performance() {
  const [period, setPeriod] = useState("30");

  const kpis = useQuery<PerformanceKPIs>({
    queryKey: ["/api/performance/kpis"],
    queryFn: () => apiRequest("GET", "/api/performance/kpis").then((r) => r.json()),
    staleTime: 60_000,
  });

  const velocity = useQuery<BookingVelocityPoint[]>({
    queryKey: ["/api/performance/booking-velocity", period],
    queryFn: () =>
      apiRequest("GET", `/api/performance/booking-velocity?period=${period}`).then((r) => r.json()),
    staleTime: 60_000,
  });

  const markets = useQuery<MarketBreakdown[]>({
    queryKey: ["/api/performance/market-breakdown"],
    queryFn: () => apiRequest("GET", "/api/performance/market-breakdown").then((r) => r.json()),
    staleTime: 120_000,
  });

  const products = useQuery<ProductMix[]>({
    queryKey: ["/api/performance/product-mix"],
    queryFn: () => apiRequest("GET", "/api/performance/product-mix").then((r) => r.json()),
    staleTime: 120_000,
  });

  const destinations = useQuery<DestinationMix[]>({
    queryKey: ["/api/performance/destination-mix"],
    queryFn: () => apiRequest("GET", "/api/performance/destination-mix").then((r) => r.json()),
    staleTime: 120_000,
  });

  const funnel = useQuery<FunnelStep[]>({
    queryKey: ["/api/performance/booking-funnel"],
    queryFn: () => apiRequest("GET", "/api/performance/booking-funnel").then((r) => r.json()),
    staleTime: 120_000,
  });

  const trends = useQuery<MonthlyTrend[]>({
    queryKey: ["/api/performance/monthly-trends"],
    queryFn: () => apiRequest("GET", "/api/performance/monthly-trends?months=12").then((r) => r.json()),
    staleTime: 120_000,
  });

  const brands = useQuery<WebsiteSource[]>({
    queryKey: ["/api/performance/website-sources"],
    queryFn: () => apiRequest("GET", "/api/performance/website-sources").then((r) => r.json()),
    staleTime: 120_000,
  });

  const ratings = useQuery<RatingsSummary>({
    queryKey: ["/api/performance/ratings-summary"],
    queryFn: () => apiRequest("GET", "/api/performance/ratings-summary").then((r) => r.json()),
    staleTime: 120_000,
  });

  const isApiDown = kpis.isError && velocity.isError;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1400px] mx-auto" data-testid="page-performance">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Performance</h1>
          <p className="text-sm text-muted-foreground">
            Real-time booking and revenue analytics
          </p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[160px]" data-testid="select-period">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* API Down Message */}
      {isApiDown && (
        <ErrorCard message="MySQL API is unavailable. Performance data cannot be loaded. Ensure the Python API is running on port 8001." />
      )}

      {/* Section 1: KPI Cards */}
      {kpis.isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : kpis.isError ? (
        !isApiDown && <ErrorCard message="Failed to load KPI data" />
      ) : kpis.data ? (
        <KPICards data={kpis.data} />
      ) : null}

      {/* Section 2: Booking Velocity */}
      {velocity.isLoading ? (
        <Card>
          <CardContent className="p-6">
            <SectionSkeleton rows={5} />
          </CardContent>
        </Card>
      ) : velocity.isError ? (
        !isApiDown && <ErrorCard message="Failed to load booking velocity" />
      ) : velocity.data ? (
        <BookingVelocityChart data={velocity.data} />
      ) : null}

      {/* Section 3: Market Performance + Product Mix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {markets.isLoading ? (
          <Card>
            <CardContent className="p-6">
              <SectionSkeleton rows={6} />
            </CardContent>
          </Card>
        ) : markets.data ? (
          <MarketPerformanceChart data={markets.data} />
        ) : null}

        {products.isLoading ? (
          <Card>
            <CardContent className="p-6">
              <SectionSkeleton rows={6} />
            </CardContent>
          </Card>
        ) : products.data ? (
          <ProductMixChart data={products.data} />
        ) : null}
      </div>

      {/* Section 4: Destination Mix + Booking Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {destinations.isLoading ? (
          <Card>
            <CardContent className="p-6">
              <SectionSkeleton rows={6} />
            </CardContent>
          </Card>
        ) : destinations.data ? (
          <DestinationMixChart data={destinations.data} />
        ) : null}

        {funnel.isLoading ? (
          <Card>
            <CardContent className="p-6">
              <SectionSkeleton rows={6} />
            </CardContent>
          </Card>
        ) : funnel.data ? (
          <BookingFunnelChart data={funnel.data} />
        ) : null}
      </div>

      {/* Section 5: Monthly Revenue Trends */}
      {trends.isLoading ? (
        <Card>
          <CardContent className="p-6">
            <SectionSkeleton rows={5} />
          </CardContent>
        </Card>
      ) : trends.data ? (
        <MonthlyTrendsChart data={trends.data} />
      ) : null}

      {/* Section 6: Brand Performance + Ratings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {brands.isLoading ? (
            <Card>
              <CardContent className="p-6">
                <SectionSkeleton rows={5} />
              </CardContent>
            </Card>
          ) : brands.data ? (
            <BrandPerformanceTable data={brands.data} />
          ) : null}
        </div>
        <div>
          {ratings.isLoading ? (
            <Card>
              <CardContent className="p-6">
                <SectionSkeleton rows={4} />
              </CardContent>
            </Card>
          ) : ratings.data ? (
            <RatingsSummaryCard data={ratings.data} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
