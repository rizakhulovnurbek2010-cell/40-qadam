import { ShieldCheck } from "lucide-react";
import { ModulePlaceholder } from "@/components/crm/module-placeholder";

export const metadata = {
  title: "Jamoa va Rollar | Apex CRM Pro",
  description: "Foydalanuvchilar, KPI rejalari va rollar (Admin/Manager)",
};

export default function TeamPage() {
  return (
    <ModulePlaceholder
      title="Jamoa va Rollar Boshqaruvi"
      description="Savdo bo'limi xodimlari, kirish huquqlari (Admin, Bo'lim boshlig'i, Savdo menejeri) va shaxsiy rejalashtirish."
      icon={ShieldCheck}
      expectedFeatures={[
        "Foydalanuvchilarni taklif qilish va faollashtirish",
        "Rolga asoslangan ruxsatlar (RBAC: Admin, Team Lead, Sales Agent)",
        "Shaxsiy savdo rejalari va bonuslar hisob-kitobi",
        "Faoliyat va xavfsizlik jurnali (Audit Log)",
      ]}
    />
  );
}
