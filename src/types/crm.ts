export type ContactStatus = "LEAD" | "ACTIVE" | "INACTIVE" | "CLOSED";

export type DealStage =
  | "LEAD"
  | "CONTACTED"
  | "PROPOSAL"
  | "NEGOTIATION"
  | "WON"
  | "LOST";

export type ActivityType = "CALL" | "MEETING" | "NOTE";

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface ContactItem {
  id: string;
  fullName: string;
  phone: string;
  email?: string | null;
  company?: string | null;
  status: string;
  notes?: string | null;
  assignedToId?: string | null;
  createdAt: Date | string;
  assignedTo?: UserSummary | null;
  deals?: Array<{ id: string; value: number; stage: string }>;
  _count?: {
    activities: number;
    deals: number;
  };
}

export interface DealItem {
  id: string;
  title: string;
  value: number;
  currency: string;
  stage: string;
  expectedCloseDate?: Date | string | null;
  createdAt: Date | string;
  contactId: string;
  contact: {
    id: string;
    fullName: string;
    company?: string | null;
    phone: string;
  };
  ownerId?: string | null;
  owner?: UserSummary | null;
}

export interface ActivityItem {
  id: string;
  type: string;
  content: string;
  dueDate?: Date | string | null;
  isCompleted: boolean;
  createdAt: Date | string;
  contactId: string;
  dealId?: string | null;
  contact?: {
    id: string;
    fullName: string;
    company?: string | null;
    phone: string;
  };
  deal?: {
    id: string;
    title: string;
  } | null;
  user?: UserSummary | null;
}

export interface DashboardMetricsData {
  totalContacts: number;
  leadsCount: number;
  activeClientsCount: number;
  totalPipelineValue: number;
  wonValue: number;
  winRate: number;
  pendingTasksCount: number;
  stageCounts: Record<string, number>;
  managerLeaderboard: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    wonDealsCount: number;
    totalWonAmount: number;
    totalClients: number;
  }>;
  recentActivities: Array<{
    id: string;
    type: string;
    content: string;
    createdAt: Date | string;
    contact?: {
      fullName: string;
      company?: string | null;
    };
    user?: {
      name: string;
    };
  }>;
}
