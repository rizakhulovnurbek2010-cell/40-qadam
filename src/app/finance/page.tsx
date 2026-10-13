import { CreditCard } from "lucide-react";
import { ModulePlaceholder } from "@/components/crm/module-placeholder";

export const metadata = {
  title: "Moliya va To'lovlar | Apex CRM Pro",
  description: "Hisob-fakturalar, tushumlar va qarzdorliklar nazorati",
};

export default function FinancePage() {
  return (
    <ModulePlaceholder
      title="Moliya va To'lovlar"
      description="Kompaniyaning barcha hisob-fakturalari (invoices), qabul qilingan to'lovlar, debitorlik va kreditorlik qarzdorliklarini yagona joyda boshqaring."
      icon={CreditCard}
      expectedFeatures={[
        "Bitimlar bo'yicha hisob-fakturalar (Invoices) shakllantirish",
        "To'lovlarni qisman yoki to'liq qabul qilish tarixi",
        "Debitorlik (qarzdor mijozlar) bo'yicha avtomatik eslatmalar",
        "Bank va to'lov tizimlari (Click, Payme, Uzum) integratsiyasi",
      ]}
    />
  );
}
