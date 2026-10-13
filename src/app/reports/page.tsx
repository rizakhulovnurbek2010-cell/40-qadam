import { TrendingUp } from "lucide-react";
import { ModulePlaceholder } from "@/components/crm/module-placeholder";

export const metadata = {
  title: "Savdo Tahlili | Apex CRM Pro",
  description: "Menejerlar samaradorligi, konversiya va tahliliy hisobotlar",
};

export default function ReportsPage() {
  return (
    <ModulePlaceholder
      title="Savdo Tahlili va Hisobotlar"
      description="Chuqurlashtirilgan savdo statistikasi, xodimlar samaradorligi (KPI), savdo kanallari bo'yicha konversiya grafigi."
      icon={TrendingUp}
      expectedFeatures={[
        "Menejerlar kesimida oylik/haftalik savdo rejalari (KPI) ijrosi",
        "Savdo bosqichlari bo'yicha boy berilgan bitimlar tahlili",
        "Mijozlarni jalb qilish kanallari rentabelligi (ROI)",
        "Excel va CSV formatida to'liq eksport qilish",
      ]}
    />
  );
}
