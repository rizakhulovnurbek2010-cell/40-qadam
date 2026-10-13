"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { CustomSelect } from "@/components/ui/custom-select";

const dateRangeOptions = [
  { value: "30d", label: "Oxirgi 30 kun" },
  { value: "this_month", label: "Shu oy" },
  { value: "last_quarter", label: "Oxirgi chorak" },
  { value: "year", label: "Yillik hisobot" },
];

export function DashboardDateFilter() {
  const [range, setRange] = useState("30d");

  return (
    <div className="flex items-center gap-1.5">
      <CustomSelect
        options={dateRangeOptions}
        value={range}
        onChange={setRange}
      />
    </div>
  );
}
