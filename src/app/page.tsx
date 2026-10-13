import { DynamicDashboardClient } from "@/components/crm/dynamic-dashboard-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Boshqaruv Paneli | Apex CRM Pro",
  description: "B2B savdo bo'limi uchun korporativ boshqaruv paneli",
};

export default function DashboardPage() {
  return <DynamicDashboardClient />;
}
