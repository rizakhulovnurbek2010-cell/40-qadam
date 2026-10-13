"use client";

import { useState, useEffect, useMemo, useTransition } from "react";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  Briefcase,
  ArrowUpRight,
  Phone,
  Calendar,
  FileText,
  UserPlus,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { RevenueChart } from "@/components/crm/revenue-chart";
import { CustomSelect } from "@/components/ui/custom-select";
import { MOCK_B2B_DEALS, MOCK_B2B_LEADS } from "@/lib/mock-b2b-data";

export function DynamicDashboardClient() {
  const [isMounted, setIsMounted] = useState(false);
  const [timeRange, setTimeRange] = useState("30d");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRangeChange = (val: string) => {
    startTransition(() => {
      setTimeRange(val);
    });
  };

  // 2026-10-12 asosidagi hisoblash
  const currentSimulatedDate = new Date(2026, 9, 12);

  const { filteredDeals, filteredLeads, chartData, stats, periodLabel } = useMemo(() => {
    let daysCutoff = 30;
    let label = "oxirgi 30 kun";

    if (timeRange === "this_month") {
      daysCutoff = 12; // Oktyabr oyining shu kungacha bo'lgan qismi
      label = "shu oy";
    } else if (timeRange === "last_quarter") {
      daysCutoff = 90;
      label = "oxirgi chorak";
    } else if (timeRange === "year") {
      daysCutoff = 365;
      label = "yillik hisobot";
    }

    const cutoffTime = currentSimulatedDate.getTime() - daysCutoff * 24 * 60 * 60 * 1000;

    const deals = MOCK_B2B_DEALS.filter(
      (d) => new Date(d.createdAt).getTime() >= cutoffTime
    );

    const leads = MOCK_B2B_LEADS.filter(
      (l) => new Date(l.createdAt).getTime() >= cutoffTime
    );

    // KPI kalkulyatsiyasi
    const wonDeals = deals.filter((d) => d.stage === "WON");
    const openDeals = deals.filter((d) => d.stage === "OPEN");
    const lostDeals = deals.filter((d) => d.stage === "LOST");

    const wonRevenue = wonDeals.reduce((sum, d) => sum + d.amount, 0);
    const openPipeline = openDeals.reduce((sum, d) => sum + d.amount, 0);

    const closedCount = wonDeals.length + lostDeals.length;
    const winRate = closedCount > 0 ? Math.round((wonDeals.length / closedCount) * 100) : 74;

    // Chart ma'lumotlarini dinamik shakllantirish
    let chart: Array<{ month: string; revenue: number; deals: number }> = [];

    if (timeRange === "this_month" || timeRange === "30d") {
      // Oxirgi 4 haftalik dinamika
      chart = [
        { month: "1-hafta", revenue: Math.round(wonRevenue * 0.18), deals: Math.max(1, Math.round(wonDeals.length * 0.15)) },
        { month: "2-hafta", revenue: Math.round(wonRevenue * 0.26), deals: Math.max(2, Math.round(wonDeals.length * 0.28)) },
        { month: "3-hafta", revenue: Math.round(wonRevenue * 0.24), deals: Math.max(2, Math.round(wonDeals.length * 0.25)) },
        { month: "4-hafta", revenue: Math.round(wonRevenue * 0.32), deals: Math.max(2, Math.round(wonDeals.length * 0.32)) },
      ];
    } else if (timeRange === "last_quarter") {
      // 3 oylik
      chart = [
        { month: "Avgust", revenue: Math.round(wonRevenue * 0.28), deals: Math.max(4, Math.round(wonDeals.length * 0.28)) },
        { month: "Sentabr", revenue: Math.round(wonRevenue * 0.34), deals: Math.max(5, Math.round(wonDeals.length * 0.34)) },
        { month: "Oktabr", revenue: Math.round(wonRevenue * 0.38), deals: Math.max(6, Math.round(wonDeals.length * 0.38)) },
      ];
    } else {
      // To'liq yillik (12 oylik)
      const months = ["Noy", "Dek", "Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt"];
      chart = months.map((m, idx) => ({
        month: m,
        revenue: Math.round(48000 + idx * 8200 + ((idx * 3700) % 9000)),
        deals: 5 + Math.round((idx % 4) * 2),
      }));
    }

    // Leaderboard hisoblash
    const managerStatsMap: Record<string, { totalWon: number; dealsCount: number }> = {};
    wonDeals.forEach((d) => {
      if (!managerStatsMap[d.managerName]) {
        managerStatsMap[d.managerName] = { totalWon: 0, dealsCount: 0 };
      }
      managerStatsMap[d.managerName].totalWon += d.amount;
      managerStatsMap[d.managerName].dealsCount += 1;
    });

    const leaderboard = Object.entries(managerStatsMap)
      .map(([name, data]) => ({
        name,
        totalWon: data.totalWon,
        dealsCount: data.dealsCount,
      }))
      .sort((a, b) => b.totalWon - a.totalWon);

    // Agar ro'yxat bo'sh bo'lsa default menejerlar
    if (leaderboard.length === 0) {
      leaderboard.push(
        { name: "Sardor Rahimov", totalWon: Math.round(wonRevenue * 0.45), dealsCount: 3 },
        { name: "Dilnoza Karimova", totalWon: Math.round(wonRevenue * 0.35), dealsCount: 2 },
        { name: "Javohir To'rayev", totalWon: Math.round(wonRevenue * 0.20), dealsCount: 1 }
      );
    }

    return {
      filteredDeals: deals,
      filteredLeads: leads,
      chartData: chart,
      periodLabel: label,
      stats: {
        wonRevenue,
        openPipeline,
        winRate,
        leadsCount: leads.length,
        leaderboard,
        recentDeals: deals.slice(0, 6),
      },
    };
  }, [timeRange]);

  if (!isMounted) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto animate-pulse select-none">
        {/* Row 0: Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div className="space-y-2">
            <div className="h-6 w-44 bg-muted rounded-md" />
            <div className="h-3 w-72 bg-muted/60 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-36 bg-muted rounded-lg" />
            <div className="h-8 w-20 bg-muted rounded-lg" />
          </div>
        </div>

        {/* Row 1: KPI Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-border/50 bg-card/60 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-4 w-4 bg-muted rounded" />
              </div>
              <div className="flex items-baseline gap-2 mt-3">
                <div className="h-7 w-32 bg-muted rounded" />
                <div className="h-4 w-12 bg-muted/60 rounded" />
              </div>
              <div className="h-3 w-28 bg-muted/50 rounded" />
            </div>
          ))}
        </div>

        {/* Row 2: Chart Skeleton */}
        <div className="p-5 rounded-xl border border-border/50 bg-card/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <div className="h-4 w-56 bg-muted rounded" />
              <div className="h-3 w-72 bg-muted/60 rounded" />
            </div>
            <div className="h-4 w-28 bg-muted rounded" />
          </div>
          <div className="h-[280px] w-full bg-muted/20 rounded-lg flex items-center justify-center">
            <div className="h-5 w-40 bg-muted/40 rounded" />
          </div>
        </div>

        {/* Row 3: Split Panels Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 p-5 rounded-xl border border-border/50 bg-card/60 space-y-4">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="space-y-3 pt-2">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex items-center justify-between gap-3 py-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-muted" />
                    <div className="space-y-1.5">
                      <div className="h-3 w-24 bg-muted rounded" />
                      <div className="h-2.5 w-16 bg-muted/60 rounded" />
                    </div>
                  </div>
                  <div className="h-4 w-16 bg-muted rounded" />
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-1 lg:col-span-2 p-5 rounded-xl border border-border/50 bg-card/60 space-y-4">
            <div className="h-4 w-36 bg-muted rounded" />
            <div className="space-y-4 pt-2">
              {[1, 2, 3].map((k) => (
                <div key={k} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-muted" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-48 bg-muted rounded" />
                    <div className="h-3 w-28 bg-muted/60 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 max-w-7xl mx-auto transition-opacity duration-200 ${isPending ? "opacity-70" : "opacity-100"}`}>
      {/* Row 0: Clean Header with Reactive Date Range Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Boshqaruv paneli
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real B2B savdo oqimi va tahliliy ko'rsatkichlar ({periodLabel} bo'yicha)
          </p>
        </div>

        {/* Reactive Date Filter */}
        <div className="flex items-center gap-2">
          <CustomSelect
            options={[
              { value: "30d", label: "Oxirgi 30 kun" },
              { value: "this_month", label: "Shu oy" },
              { value: "last_quarter", label: "Oxirgi chorak" },
              { value: "year", label: "Yillik hisobot" },
            ]}
            value={timeRange}
            onChange={handleRangeChange}
          />

          <Link
            href="/deals"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow-xs hover:bg-primary/90 transition-colors"
          >
            Bitimlar
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Row 1: KPI Metric Cards - Dynamic Reactive Values */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Umumiy daromad */}
        <div className="p-4 rounded-xl border border-border/60 bg-card text-card-foreground select-none flex flex-col justify-between transition-all duration-300 hover:border-zinc-700/80 hover:shadow-[0_1px_12px_rgba(255,255,255,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Umumiy daromad</span>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-wrap items-baseline gap-2 mt-3">
            <span className="text-2xl font-bold tracking-tight text-foreground transition-all">
              {formatCurrency(stats.wonRevenue, "USD")}
            </span>
            <span className="text-xs font-semibold text-emerald-500">
              +{timeRange === "year" ? "32.8%" : "18.4%"}
            </span>
          </div>
          <div className="mt-1">
            <span className="text-xs text-muted-foreground">
              {periodLabel} bo'yicha yutildi
            </span>
          </div>
        </div>

        {/* 2. Ochiq bitimlar */}
        <div className="p-4 rounded-xl border border-border/60 bg-card text-card-foreground select-none flex flex-col justify-between transition-all duration-300 hover:border-zinc-700/80 hover:shadow-[0_1px_12px_rgba(255,255,255,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Ochiq bitimlar</span>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-wrap items-baseline gap-2 mt-3">
            <span className="text-2xl font-bold tracking-tight text-foreground transition-all">
              {formatCurrency(stats.openPipeline, "USD")}
            </span>
            <span className="text-xs font-semibold text-blue-400">
              Faol oqim
            </span>
          </div>
          <div className="mt-1">
            <span className="text-xs text-muted-foreground">
              jarayondagi shartnomalar
            </span>
          </div>
        </div>

        {/* 3. Konversiya foizi */}
        <div className="p-4 rounded-xl border border-border/60 bg-card text-card-foreground select-none flex flex-col justify-between transition-all duration-300 hover:border-zinc-700/80 hover:shadow-[0_1px_12px_rgba(255,255,255,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Konversiya (Win-Rate)</span>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-wrap items-baseline gap-2 mt-3">
            <span className="text-2xl font-bold tracking-tight text-foreground transition-all">
              {stats.winRate}%
            </span>
            <span className="text-xs font-semibold text-emerald-500">
              +{timeRange === "year" ? "6.5%" : "4.2%"}
            </span>
          </div>
          <div className="mt-1">
            <span className="text-xs text-muted-foreground">
              yopilgan bitimlar nisbati
            </span>
          </div>
        </div>

        {/* 4. Yangi Lidlar */}
        <div className="p-4 rounded-xl border border-border/60 bg-card text-card-foreground select-none flex flex-col justify-between transition-all duration-300 hover:border-zinc-700/80 hover:shadow-[0_1px_12px_rgba(255,255,255,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Yangi Lidlar</span>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-wrap items-baseline gap-2 mt-3">
            <span className="text-2xl font-bold tracking-tight text-foreground transition-all">
              {stats.leadsCount} ta
            </span>
            <span className="text-xs font-semibold text-muted-foreground">
              {filteredDeals.length} bitim
            </span>
          </div>
          <div className="mt-1">
            <span className="text-xs text-muted-foreground">
              {periodLabel} mobaynida kelgan
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Data Visualization (Dynamic AreaChart) */}
      <div className="p-5 rounded-xl border border-border/60 bg-card text-card-foreground shadow-xs space-y-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-foreground">
              Daromad va Yopilgan Bitimlar Dinamikasi
            </h2>
            <p className="text-xs text-muted-foreground">
              {timeRange === "year" ? "12 oylik umumiy korporativ daromad grafigi" : `${periodLabel} bo'yicha tushumlar o'sishi`}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Oqim daromadi ($)</span>
            </div>
          </div>
        </div>

        <RevenueChart data={chartData} />
      </div>

      {/* Row 3: Split Panels (Leaderboard + Dynamic Recent Activities) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Savdo menejerlari reytingi */}
        <div className="col-span-1 p-5 rounded-xl border border-border/60 bg-card text-card-foreground space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Menejerlar reytingi
              </h3>
              <p className="text-xs text-muted-foreground">{periodLabel} natijasi</p>
            </div>
            <Link
              href="/team"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Jamoa
            </Link>
          </div>

          <div className="divide-y divide-border/40">
            {stats.leaderboard.map((m, idx) => {
              const initials = m.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .substring(0, 2);

              const avatarColors = [
                "bg-zinc-800 text-zinc-200",
                "bg-zinc-700 text-zinc-200",
                "bg-zinc-800/80 text-zinc-300",
                "bg-zinc-900 text-zinc-400",
              ];
              const avatarBg = avatarColors[idx % avatarColors.length];

              return (
                <div
                  key={m.name}
                  className="py-2.5 flex items-center justify-between gap-3 first:pt-1 last:pb-1"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-bold text-muted-foreground w-4 text-center flex-shrink-0">
                      {idx + 1}
                    </span>

                    <div className={`w-8 h-8 rounded-full ${avatarBg} border border-border/40 font-semibold text-xs flex items-center justify-center flex-shrink-0`}>
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs font-medium text-foreground truncate">
                        {m.name}
                      </h4>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {m.dealsCount} ta bitim yopdi
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-semibold text-foreground">
                      {formatCurrency(m.totalWon, "USD")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: So'nggi harakatlar Continuous Vertical Timeline */}
        <div className="col-span-1 lg:col-span-2 p-5 rounded-xl border border-border/60 bg-card text-card-foreground space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                So'nggi harakatlar
              </h3>
              <p className="text-xs text-muted-foreground">Mijozlar bilan so'nggi yopilgan bitimlar va muloqotlar</p>
            </div>
            <Link
              href="/tasks"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Barcha vazifalar
            </Link>
          </div>

          <div className="pt-2">
            <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-border">
              {stats.recentDeals.map((deal) => (
                <div key={deal.id} className="relative flex items-start gap-3 group">
                  <div className="absolute -left-6 top-0.5 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center flex-shrink-0 z-10 shadow-xs">
                    {deal.stage === "WON" ? (
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Phone className="w-3.5 h-3.5 text-blue-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 -mt-0.5 space-y-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-xs text-muted-foreground truncate">
                        <span className="font-semibold text-foreground">
                          {deal.managerName}
                        </span>
                        {" "}tomonidan{" "}
                        <span className="font-medium text-foreground">
                          {deal.clientName}
                        </span>
                        {" "}bilan bitim tuzildi
                      </p>
                      <span className="text-[11px] text-muted-foreground shrink-0">
                        {formatDate(deal.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">
                        {formatCurrency(deal.amount, "USD")}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                        deal.stage === "WON"
                          ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                          : "border-blue-500/30 text-blue-400 bg-blue-500/10"
                      }`}>
                        {deal.stage === "WON" ? "Yutildi" : "Jarayonda"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
