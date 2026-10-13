"use server";

import { prisma } from "@/lib/prisma";
import { DashboardMetricsData } from "@/types/crm";

export async function getDashboardMetrics(): Promise<{
  success: boolean;
  data?: DashboardMetricsData;
  error?: string;
}> {
  try {
    const totalContacts = await prisma.contact.count();
    const leadsCount = await prisma.contact.count({ where: { status: "LEAD" } });
    const activeClientsCount = await prisma.contact.count({ where: { status: "ACTIVE" } });

    // Deals aggregation
    const allDeals = await prisma.deal.findMany({
      select: { stage: true, value: true },
    });

    const totalPipelineValue = allDeals
      .filter((d) => d.stage !== "LOST")
      .reduce((acc, curr) => acc + curr.value, 0);

    const wonDeals = allDeals.filter((d) => d.stage === "WON");
    const wonValue = wonDeals.reduce((acc, curr) => acc + curr.value, 0);
    const lostDeals = allDeals.filter((d) => d.stage === "LOST");

    const closedDealsCount = wonDeals.length + lostDeals.length;
    const winRate =
      closedDealsCount > 0 ? Math.round((wonDeals.length / closedDealsCount) * 100) : 0;

    const stageCounts: Record<string, number> = {
      LEAD: allDeals.filter((d) => d.stage === "LEAD").length,
      CONTACTED: allDeals.filter((d) => d.stage === "CONTACTED").length,
      PROPOSAL: allDeals.filter((d) => d.stage === "PROPOSAL").length,
      NEGOTIATION: allDeals.filter((d) => d.stage === "NEGOTIATION").length,
      WON: wonDeals.length,
      LOST: lostDeals.length,
    };

    const pendingTasksCount = await prisma.activity.count({
      where: { isCompleted: false },
    });

    // Top sales managers
    const managers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        deals: {
          where: { stage: "WON" },
          select: { value: true },
        },
        _count: {
          select: { contacts: true, deals: true },
        },
      },
    });

    const managerLeaderboard = managers
      .map((m) => {
        const totalWonAmount = m.deals.reduce((sum, d) => sum + d.value, 0);
        return {
          id: m.id,
          name: m.name,
          email: m.email,
          role: m.role,
          wonDealsCount: m.deals.length,
          totalWonAmount,
          totalClients: m._count.contacts,
        };
      })
      .sort((a, b) => b.totalWonAmount - a.totalWonAmount);

    const recentActivities = await prisma.activity.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        type: true,
        content: true,
        createdAt: true,
        contact: { select: { fullName: true, company: true } },
        user: { select: { name: true } },
      },
    });

    return {
      success: true,
      data: {
        totalContacts,
        leadsCount,
        activeClientsCount,
        totalPipelineValue,
        wonValue,
        winRate,
        pendingTasksCount,
        stageCounts,
        managerLeaderboard,
        recentActivities,
      },
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Metriklarni hisoblashda xatolik";
    console.error("getDashboardMetrics error:", errMessage);
    return { success: false, error: "Metriklarni hisoblashda xatolik yuz berdi" };
  }
}
