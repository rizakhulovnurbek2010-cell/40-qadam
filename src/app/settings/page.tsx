import { Settings } from "lucide-react";
import { ModulePlaceholder } from "@/components/crm/module-placeholder";

export const metadata = {
  title: "Tizim Sozlamalari | Apex CRM Pro",
  description: "Integratsiyalar (Telegram, SMS, Telefoniya) va tizim parametrlari",
};

export default function SettingsPage() {
  return (
    <ModulePlaceholder
      title="Tizim Sozlamalari va Integratsiyalar"
      description="Tashqi xizmatlar, aloqa kanallari (IP telefoniya, Telegram bot, SMS xabarnomalar) va tizim konfiguratsiyasi."
      icon={Settings}
      expectedFeatures={[
        "IP Telefoniya (Zadarma, Asterisk, Moizvonki) bilan avtomatik qo'ng'iroq yozish",
        "Telegram bot va Webhook orqali lidlarni qabul qilish",
        "SMS provayderlar (Eskiz, PlayMobile) integratsiyasi",
        "Kompaniya profili, rekvizitlar va valyuta sozlamalari",
      ]}
    />
  );
}
