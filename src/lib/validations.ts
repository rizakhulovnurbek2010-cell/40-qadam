import { z } from "zod";

export const contactSchema = z.object({
  fullName: z
    .string()
    .min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak")
    .refine((val) => !/\d/.test(val), "Ismda raqamlar ishlatilishi mumkin emas"),
  phone: z
    .string()
    .refine((val) => {
      const digits = val.replace(/\D/g, "");
      return digits.startsWith("998") && digits.length === 12;
    }, "Telefon raqami +998 bilan boshlanishi va 9 ta raqamdan iborat bo'lishi kerak"),
  email: z.string().email("Noto'g'ri email formati").optional().or(z.literal("")),
  company: z.string().optional().or(z.literal("")),
  status: z.enum(["LEAD", "ACTIVE", "INACTIVE", "CLOSED"]).default("LEAD"),
  notes: z.string().optional().or(z.literal("")),
  assignedToId: z.string().optional().or(z.literal("")),
});

export const dealSchema = z.object({
  title: z.string().min(3, "Bitim sarlavhasi kamida 3 ta belgidan iborat bo'lishi kerak"),
  value: z.coerce.number().min(0, "Qiymat 0 dan kam bo'lishi mumkin emas"),
  currency: z.string().default("USD"),
  stage: z.enum(["LEAD", "CONTACTED", "PROPOSAL", "NEGOTIATION", "WON", "LOST"]).default("LEAD"),
  contactId: z.string().min(1, "Mijoz tanlanishi shart"),
  ownerId: z.string().optional().or(z.literal("")),
  expectedCloseDate: z.string().optional().or(z.literal("")),
});

export const activitySchema = z.object({
  type: z.enum(["CALL", "MEETING", "NOTE"]),
  content: z.string().min(3, "Mazmun kamida 3 ta belgidan iborat bo'lishi kerak"),
  contactId: z.string().min(1, "Mijoz tanlanishi shart"),
  dealId: z.string().optional().or(z.literal("")),
  dueDate: z.string().optional().or(z.literal("")),
  isCompleted: z.boolean().default(false),
});
