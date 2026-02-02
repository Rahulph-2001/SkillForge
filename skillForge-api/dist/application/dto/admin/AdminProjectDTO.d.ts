import { z } from 'zod';
export declare const AdminListProjectsRequestSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    search: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        Open: "Open";
        In_Progress: "In_Progress";
        Pending_Completion: "Pending_Completion";
        Payment_Pending: "Payment_Pending";
        Refund_Pending: "Refund_Pending";
        Completed: "Completed";
        Cancelled: "Cancelled";
    }>>;
    category: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AdminListProjectsRequestDTO = z.infer<typeof AdminListProjectsRequestSchema>;
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
}
export interface AdminListProjectsResponseDTO {
    projects: AdminProjectDTO[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface AdminProjectStatsDTO {
    totalProjects: number;
    openProjects: number;
    inProgressProjects: number;
    completedProjects: number;
    pendingApprovalProjects: number;
    cancelledProjects: number;
    totalBudget: number;
}
//# sourceMappingURL=AdminProjectDTO.d.ts.map