"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface RevenueChartProps {
  data: Array<{
    month: string;
    revenue: number;
    deals: number;
  }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="h-[280px] w-full pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 15, right: 15, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#27272a"
            vertical={false}
            opacity={0.3}
          />
          <XAxis
            dataKey="month"
            stroke="#71717a"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            dy={8}
          />
          <YAxis
            stroke="#71717a"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
          />
          <Tooltip
            cursor={{ stroke: "#3b82f6", strokeWidth: 1, strokeDasharray: "4 4" }}
            offset={15}
            allowEscapeViewBox={{ x: false, y: false }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const revenue = payload[0]?.value as number;
                const deals = payload[0]?.payload?.deals as number;
                return (
                  <div className="rounded-lg border border-zinc-700/60 bg-zinc-900/95 px-3 py-2.5 shadow-xl text-xs space-y-1.5 select-none pointer-events-none">
                    <p className="font-semibold text-zinc-200 text-xs border-b border-zinc-800 pb-1">{label}</p>
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-1.5 text-zinc-400">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        Tushum:
                      </span>
                      <span className="font-bold text-white">
                        {formatCurrency(revenue, "USD")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-1.5 text-zinc-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Bitimlar:
                      </span>
                      <span className="font-bold text-emerald-400">
                        {deals} ta
                      </span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#2563eb"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#revenueGradient)"
            activeDot={{ r: 4, fill: "#2563eb", stroke: "#ffffff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
