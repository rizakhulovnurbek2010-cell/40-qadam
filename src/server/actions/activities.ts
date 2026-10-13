"use server";

import { prisma } from "@/lib/prisma";
import { activitySchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export async function createActivity(formData: unknown) {
  try {
    const parsed = activitySchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Validatsiya xatosi" };
    }

    const { type, content, contactId, dealId, dueDate, isCompleted } = parsed.data;

    const user = await prisma.user.findFirst();
    if (!user) {
      return { success: false, error: "Tizimda foydalanuvchi topilmadi" };
    }

    const activity = await prisma.activity.create({
      data: {
        type,
        content,
        contactId,
        dealId: dealId || null,
        userId: user.id,
        dueDate: dueDate ? new Date(dueDate) : null,
        isCompleted: isCompleted ?? false,
      },
    });

    revalidatePath(`/contacts/${contactId}`);
    revalidatePath("/tasks");
    revalidatePath("/");

    return { success: true, data: activity };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Xatolik yuz berdi";
    console.error("createActivity error:", errMessage);
    return { success: false, error: "Eslatma/vazifani saqlashda xatolik yuz berdi" };
  }
}

export async function toggleTaskComplete(activityId: string) {
  try {
    const existing = await prisma.activity.findUnique({
      where: { id: activityId },
    });

    if (!existing) {
      return { success: false, error: "Vazifa topilmadi" };
    }

    const updated = await prisma.activity.update({
      where: { id: activityId },
      data: { isCompleted: !existing.isCompleted },
    });

    revalidatePath("/tasks");
    revalidatePath(`/contacts/${existing.contactId}`);
    revalidatePath("/");

    return { success: true, data: updated };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Holatni o'zgartirishda xatolik";
    console.error("toggleTaskComplete error:", errMessage);
    return { success: false, error: "Holatni o'zgartirishda xatolik" };
  }
}

export async function getTasks(filter?: "all" | "today" | "overdue" | "completed") {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const where: Prisma.ActivityWhereInput = {};

    if (filter === "completed") {
      where.isCompleted = true;
    } else if (filter === "overdue") {
      where.isCompleted = false;
      where.dueDate = { lt: startOfToday };
    } else if (filter === "today") {
      where.isCompleted = false;
      where.dueDate = { gte: startOfToday, lte: endOfToday };
    }

    const tasks = await prisma.activity.findMany({
      where,
      include: {
        contact: {
          select: { id: true, fullName: true, company: true, phone: true },
        },
        deal: {
          select: { id: true, title: true },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: [
        { isCompleted: "asc" },
        { dueDate: "asc" },
        { createdAt: "desc" },
      ],
    });

    return { success: true, data: tasks };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Vazifalarni yuklashda xatolik";
    console.error("getTasks error:", errMessage);
    return { success: false, error: "Vazifalarni yuklashda xatolik yuz berdi" };
  }
}
