import { FileText } from "lucide-react";
import { ModulePlaceholder } from "@/components/crm/module-placeholder";

export const metadata = {
  title: "Hujjatlar va Takliflar | Apex CRM Pro",
  description: "Tijoriy takliflar (KP), shartnoma shablonlari va fayllar",
};

export default function DocumentsPage() {
  return (
    <ModulePlaceholder
      title="Hujjatlar va Takliflar"
      description="Tijoriy takliflar (KP), B2B shartnoma namunalari, dalolatnomalar va PDF fayllarni boshqarish markazi."
      icon={FileText}
      expectedFeatures={[
        "Mijoz va bitim ma'lumotlaridan avtomatik shartnoma (PDF) generatsiyasi",
        "Tijoriy takliflar (Commercial Proposals) shablonlari konstruktori",
        "Elektron raqamli imzo (E-imzo / Didox) integratsiyasi",
        "Fayllar va ilovalarni xavfsiz bulutda saqlash",
      ]}
    />
  );
}
