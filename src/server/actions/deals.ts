"use server";

import { prisma } from "@/lib/prisma";
import { dealSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getPipelineDeals() {
  try {
    const deals = await prisma.deal.findMany({
      include: {
        contact: {
          select: { id: true, fullName: true, company: true, phone: true },
        },
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return { success: true, data: deals };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Bitimlarni yuklashda xatolik";
    console.error("getPipelineDeals error:", errMessage);
    return { success: false, error: "Bitimlarni yuklashda xatolik yuz berdi" };
  }
}

export async function updateDealStage(dealId: string, newStage: string) {
  try {
    const validStages = ["LEAD", "CONTACTED", "PROPOSAL", "NEGOTIATION", "WON", "LOST"];
    if (!validStages.includes(newStage)) {
      return { success: false, error: "Noto'g'ri bosqich tanlandi" };
    }

    const updatedDeal = await prisma.deal.update({
      where: { id: dealId },
      data: { stage: newStage },
      include: { contact: true },
    });

    // Faoliyat yozuvini qo'shish
    const systemUser = await prisma.user.findFirst();
    if (systemUser && updatedDeal.contactId) {
      await prisma.activity.create({
        data: {
          type: "NOTE",
          content: `Bitim "${updatedDeal.title}" bosqichi [${newStage}] ga o'zgartirildi.`,
          contactId: updatedDeal.contactId,
          dealId: updatedDeal.id,
          userId: systemUser.id,
          isCompleted: true,
        },
      });
    }

    revalidatePath("/pipeline");
    revalidatePath("/");
    revalidatePath(`/contacts/${updatedDeal.contactId}`);

    return { success: true, data: updatedDeal };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Bosqichni o'zgartirishda xatolik";
    console.error("updateDealStage error:", errMessage);
    return { success: false, error: "Bosqichni o'zgartirishda xatolik yuz berdi" };
  }
}

export async function createDeal(formData: unknown) {
  try {
    const parsed = dealSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Validatsiya xatosi" };
    }

    const { title, value, currency, stage, contactId, ownerId, expectedCloseDate } = parsed.data;

    const deal = await prisma.deal.create({
      data: {
        title,
        value,
        currency,
        stage,
        contactId,
        ownerId: ownerId || null,
        expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
      },
    });

    const systemUser = await prisma.user.findFirst();
    if (systemUser) {
      await prisma.activity.create({
        data: {
          type: "NOTE",
          content: `Yangi bitim yaratildi: "${title}" qiymati: ${value} ${currency}`,
          contactId,
          dealId: deal.id,
          userId: systemUser.id,
          isCompleted: true,
        },
      });
    }

    revalidatePath("/pipeline");
    revalidatePath(`/contacts/${contactId}`);
    revalidatePath("/");

    return { success: true, data: deal };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Bitimni saqlashda xatolik";
    console.error("createDeal error:", errMessage);
    return { success: false, error: "Bitimni saqlashda xatolik yuz berdi" };
  }
}

export async function deleteDeal(id: string) {
  try {
    const deal = await prisma.deal.delete({
      where: { id },
    });

    revalidatePath("/pipeline");
    revalidatePath(`/contacts/${deal.contactId}`);
    revalidatePath("/");

    return { success: true };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Bitimni o'chirishda xatolik";
    console.error("deleteDeal error:", errMessage);
    return { success: false, error: "Bitimni o'chirishda xatolik yuz berdi" };
  }
}
