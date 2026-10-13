import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing records
  await prisma.activity.deleteMany({});
  await prisma.deal.deleteMany({});
  await prisma.contact.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash("password123", 10);

  // 1. Create Users
  const adminUser = await prisma.user.create({
    data: {
      name: "Sardor Rahimov",
      email: "admin@crm.uz",
      passwordHash,
      role: "ADMIN",
    },
  });

  const managerUser = await prisma.user.create({
    data: {
      name: "Dilnoza Karimova",
      email: "manager@crm.uz",
      passwordHash,
      role: "MANAGER",
    },
  });

  // 2. Create Contacts
  const contact1 = await prisma.contact.create({
    data: {
      fullName: "Alisher Usmonov",
      email: "alisher@apex-group.uz",
      phone: "+998 90 123 45 67",
      company: "Apex Logistics LLC",
      status: "ACTIVE",
      notes: "Logistika avtomatlashtirish tizimiga qiziqish bildirmoqda.",
      assignedToId: adminUser.id,
    },
  });

  const contact2 = await prisma.contact.create({
    data: {
      fullName: "Malika Sobirova",
      email: "malika@samarqand-textile.uz",
      phone: "+998 93 987 65 43",
      company: "Samarkand Textile",
      status: "LEAD",
      notes: "CRM orqali 50 ta xodimning savdo jarayonini nazorat qilmoqchi.",
      assignedToId: managerUser.id,
    },
  });

  const contact3 = await prisma.contact.create({
    data: {
      fullName: "Javohir To'rayev",
      email: "j.turayev@fintech-soft.uz",
      phone: "+998 97 555 44 33",
      company: "FinTech Soft Systems",
      status: "ACTIVE",
      notes: "Shartnoma loyihasi yuborildi, yakuniy imzoni kutayapmiz.",
      assignedToId: adminUser.id,
    },
  });

  const contact4 = await prisma.contact.create({
    data: {
      fullName: "Nodirbek Qodirov",
      email: "nodir@agro-export.uz",
      phone: "+998 99 111 22 33",
      company: "Agro Export Global",
      status: "LEAD",
      notes: "Dastlabki tanishuv uchrashuvi o'tkazilishi kerak.",
      assignedToId: managerUser.id,
    },
  });

  // 3. Create Deals
  const deal1 = await prisma.deal.create({
    data: {
      title: "Apex - Korxona CRM litsenziyasi (50 ta foydalanuvchi)",
      value: 4500.0,
      currency: "USD",
      stage: "PROPOSAL",
      contactId: contact1.id,
      ownerId: adminUser.id,
    },
  });

  const deal2 = await prisma.deal.create({
    data: {
      title: "Samarkand Textile - B2B Savdo moduli va integratsiya",
      value: 8200.0,
      currency: "USD",
      stage: "NEGOTIATION",
      contactId: contact2.id,
      ownerId: managerUser.id,
    },
  });

  const deal3 = await prisma.deal.create({
    data: {
      title: "FinTech Soft - Yillik Enterprise obuna",
      value: 12000.0,
      currency: "USD",
      stage: "WON",
      contactId: contact3.id,
      ownerId: adminUser.id,
    },
  });

  const deal4 = await prisma.deal.create({
    data: {
      title: "Agro Export - Cloud CRM startap paketi",
      value: 2300.0,
      currency: "USD",
      stage: "LEAD",
      contactId: contact4.id,
      ownerId: managerUser.id,
    },
  });

  // 4. Create Activities
  await prisma.activity.createMany({
    data: [
      {
        type: "CALL",
        content: "Alisher aka bilan qo'ng'iroqlashdik, texnik topshiriqni tasdiqladi.",
        contactId: contact1.id,
        dealId: deal1.id,
        userId: adminUser.id,
        isCompleted: true,
      },
      {
        type: "MEETING",
        content: "Samarqand Textile ofisida rahbariyat bilan taqdimot uchrashuvi.",
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Ertaga
        contactId: contact2.id,
        dealId: deal2.id,
        userId: managerUser.id,
        isCompleted: false,
      },
      {
        type: "NOTE",
        content: "To'lov hisob-fakturasi imzolandi va buxgalteriyaga topshirildi.",
        contactId: contact3.id,
        dealId: deal3.id,
        userId: adminUser.id,
        isCompleted: true,
      },
      {
        type: "CALL",
        content: "Nodirbekka qayta qo'ng'iroq qilib demo sanasini kelishib olish kerak.",
        dueDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // Kechikkan
        contactId: contact4.id,
        dealId: deal4.id,
        userId: managerUser.id,
        isCompleted: false,
      },
    ],
  });

  console.log("Database successfully seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
