"use server";

import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export async function getContacts(params?: {
  search?: string;
  status?: string;
  assignedToId?: string;
}) {
  try {
    const where: Prisma.ContactWhereInput = {};

    if (params?.status && params.status !== "ALL") {
      where.status = params.status;
    }

    if (params?.assignedToId && params.assignedToId !== "ALL") {
      where.assignedToId = params.assignedToId;
    }

    if (params?.search) {
      where.OR = [
        { fullName: { contains: params.search } },
        { phone: { contains: params.search } },
        { company: { contains: params.search } },
        { email: { contains: params.search } },
      ];
    }

    const contacts = await prisma.contact.findMany({
      where,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        deals: {
          select: { id: true, value: true, stage: true },
        },
        _count: {
          select: { activities: true, deals: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: contacts };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Mijozlarni yuklashda xatolik yuz berdi";
    console.error("getContacts error:", errMessage);
    return { success: false, error: "Mijozlarni yuklashda xatolik yuz berdi" };
  }
}

export async function getContactById(id: string) {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        deals: {
          include: {
            owner: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        activities: {
          include: {
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!contact) {
      return { success: false, error: "Mijoz topilmadi" };
    }

    return { success: true, data: contact };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Mijoz ma'lumotlarini yuklashda xatolik";
    console.error("getContactById error:", errMessage);
    return { success: false, error: "Mijoz ma'lumotlarini yuklashda xatolik" };
  }
}

export async function createContact(formData: unknown) {
  try {
    const parsed = contactSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Validatsiya xatosi" };
    }

    const { fullName, phone, email, company, status, notes, assignedToId } = parsed.data;

    const contact = await prisma.contact.create({
      data: {
        fullName,
        phone,
        email: email || null,
        company: company || null,
        status,
        notes: notes || null,
        assignedToId: assignedToId || null,
      },
    });

    // Avtomatik birinchi activity
    const systemUser = await prisma.user.findFirst();
    if (systemUser) {
      await prisma.activity.create({
        data: {
          type: "NOTE",
          content: "Yangi mijoz bazaga muvaffaqiyatli kiritildi.",
          contactId: contact.id,
          userId: systemUser.id,
          isCompleted: true,
        },
      });
    }

    revalidatePath("/contacts");
    revalidatePath("/pipeline");
    revalidatePath("/");

    return { success: true, data: contact };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Mijozni saqlashda xatolik";
    console.error("createContact error:", errMessage);
    return { success: false, error: "Mijozni saqlashda xatolik yuz berdi" };
  }
}

export async function updateContact(id: string, formData: unknown) {
  try {
    const parsed = contactSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Validatsiya xatosi" };
    }

    const { fullName, phone, email, company, status, notes, assignedToId } = parsed.data;

    const updated = await prisma.contact.update({
      where: { id },
      data: {
        fullName,
        phone,
        email: email || null,
        company: company || null,
        status,
        notes: notes || null,
        assignedToId: assignedToId || null,
      },
    });

    revalidatePath("/contacts");
    revalidatePath(`/contacts/${id}`);
    revalidatePath("/");

    return { success: true, data: updated };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Mijozni yangilashda xatolik";
    console.error("updateContact error:", errMessage);
    return { success: false, error: "Mijozni yangilashda xatolik yuz berdi" };
  }
}

export async function deleteContact(id: string) {
  try {
    await prisma.contact.delete({
      where: { id },
    });

    revalidatePath("/contacts");
    revalidatePath("/pipeline");
    revalidatePath("/");

    return { success: true };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Mijozni o'chirishda xatolik";
    console.error("deleteContact error:", errMessage);
    return { success: false, error: "Mijozni o'chirishda xatolik yuz berdi" };
  }
}

export async function getUsersList() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
      orderBy: { name: "asc" },
    });
    return { success: true, data: users };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Foydalanuvchilarni yuklashda xatolik";
    console.error("getUsersList error:", errMessage);
    return { success: false, error: "Foydalanuvchilarni yuklashda xatolik" };
  }
}
