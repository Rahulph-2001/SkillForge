import { z } from 'zod';

// Request DTO for listing admin projects
export const AdminListProjectsRequestSchema = z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(20),
    search: z.string().optional(),
    status: z.enum(['Open', 'In_Progress', 'Pending_Completion', 'Payment_Pending', 'Refund_Pending', 'Completed', 'Cancelled']).optional(),
    category: z.string().optional(),
    isSuspended: z.boolean().optional(),
});

export type AdminListProjectsRequestDTO = z.infer<typeof AdminListProjectsRequestSchema>;

// Response DTO for a single project in admin view
export interface AdminProjectDTO {
    id: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    budget: number;
    duration: string;
    deadline: string | null;
    status: string;
    applicationsCount: number;
    createdAt: Date;
    updatedAt: Date;
    creator: {
        id: string;
        name: string;
        email: string;
        avatarUrl: string | null;
    };
    contributor: {
        id: string;
        name: string;
        avatarUrl: string | null;
    } | null;
    hasPendingPaymentRequest: boolean;
    isSuspended: boolean;
    suspendedAt: Date | null;
    suspendReason: string | null;
}

// Response DTO for paginated project list
export interface AdminListProjectsResponseDTO {
    projects: AdminProjectDTO[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Project statistics DTO
export interface AdminProjectStatsDTO {
    totalProjects: number;
    openProjects: number;
    inProgressProjects: number;
    completedProjects: number;
    pendingApprovalProjects: number; // Payment_Pending + Refund_Pending
    cancelledProjects: number;
    totalBudget: number;
}
