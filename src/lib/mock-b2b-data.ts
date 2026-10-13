export interface B2BDeal {
  id: string;
  title: string;
  amount: number;
  stage: "WON" | "OPEN" | "LOST";
  clientName: string;
  managerName: string;
  createdAt: string; // ISO date string
}

export interface B2BLead {
  id: string;
  fullName: string;
  company: string;
  createdAt: string;
}

// 2026-yil 12-oktabr hozirgi vaqtga asoslangan 12 oylik B2B ma'lumotlar generatori
function generateMockB2BData() {
  const managers = [
    { name: "Sardor Rahimov", email: "sardor@apex.uz" },
    { name: "Dilnoza Karimova", email: "dilnoza@apex.uz" },
    { name: "Javohir To'rayev", email: "javohir@apex.uz" },
    { name: "Malika Sobirova", email: "malika@apex.uz" },
  ];

  const clients = [
    "Apex Logistics LLC",
    "Samarkand Textile Group",
    "FinTech Soft Systems",
    "Agro Export Global",
    "Tashkent Medical Holding",
    "Orient Mining & Energy",
    "Silk Road Freight",
    "Universal Banking Solutions",
    "Chirchiq Heavy Industry",
    "EuroAsia Retail Chain",
  ];

  const deals: B2BDeal[] = [];
  const leads: B2BLead[] = [];

  const now = new Date(2026, 9, 12); // 2026-10-12

  // 12 oy davomida jami 120+ ta realistik Enterprise bitimlar yaratish ($800,000 - $1,500,000 oralig'ida)
  let idCounter = 1;

  for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
    // har oy uchun 8 tadan 14 tagacha bitim
    const count = 9 + (monthOffset % 5);

    for (let i = 0; i < count; i++) {
      const daysAgo = monthOffset * 30 + (i * 2 + 1);
      const dealDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      
      const manager = managers[(idCounter + i) % managers.length];
      const client = clients[(idCounter * 3 + i) % clients.length];

      // Enterprise qiymatlari: $8,000 dan $110,000 gacha
      const baseValues = [8500, 12000, 18500, 24000, 35000, 48000, 65000, 92000];
      const amount = baseValues[(idCounter + i) % baseValues.length] + ((i * 700) % 5000);

      // Status taqsimoti: ~60% WON, ~30% OPEN, ~10% LOST
      let stage: "WON" | "OPEN" | "LOST" = "WON";
      if (monthOffset <= 1) {
        // Oxirgi 1-2 oyda ochiq bitimlar ko'proq bo'ladi
        stage = (i % 3 === 0) ? "WON" : (i % 4 === 0) ? "LOST" : "OPEN";
      } else {
        stage = (i % 8 === 0) ? "LOST" : (i % 5 === 0) ? "OPEN" : "WON";
      }

      deals.push({
        id: `deal-${idCounter}`,
        title: `${client} — Enterprise ERP & CRM Litsenziyasi`,
        amount,
        stage,
        clientName: client,
        managerName: manager.name,
        createdAt: dealDate.toISOString(),
      });

      // Har oy uchun yangi murojaatlar (Lidlar)
      leads.push({
        id: `lead-${idCounter}`,
        fullName: `Mas'ul rahbar #${idCounter}`,
        company: client,
        createdAt: dealDate.toISOString(),
      });

      idCounter++;
    }
  }

  return { deals, leads };
}

export const { deals: MOCK_B2B_DEALS, leads: MOCK_B2B_LEADS } = generateMockB2BData();
