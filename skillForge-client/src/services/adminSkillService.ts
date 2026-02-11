import api from './api';

export interface SkillData {
  id: string;
  providerId: string;
  providerName: string;
  providerEmail: string;
  title: string;
  description: string;
  category: string;
  level: string;
  durationHours: number;
  creditsPerHour: number;
  tags: string[];
  imageUrl: string | null;
  templateId: string | null;
  status: string;
  verificationStatus: string | null;
  mcqScore: number | null;
  mcqTotalQuestions: number | null;
  mcqPassingScore: number | null;
  verifiedAt: Date | null;
  rejectionReason: string | null;
  isBlocked: boolean;
  blockedReason: string | null;
  blockedAt: Date | null;
  totalSessions: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export type PendingSkill = SkillData;

export interface ApproveSkillResponse {
  skillId: string;
  status: string;
}

export interface RejectSkillResponse {
  skillId: string;
  status: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const adminSkillService = {
  // Get all skills (for admin management)
  getAllSkills: async () => {
    return api.get<ApiResponse<SkillData[]>>('/admin/skills');
  },

  // List skills with pagination and filters
  listSkills: async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: 'in-review' | 'approved' | 'rejected',
    isBlocked?: boolean
  ): Promise<{
    skills: SkillData[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> => {
    const params: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
    };
    if (search) params.search = search;
    if (status) params.status = status;
    if (isBlocked !== undefined) params.isBlocked = isBlocked.toString();

    const response = await api.get<ApiResponse<{
      skills: SkillData[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    }>>('/admin/skills', { params });
    return response.data.data;
  },

  // Get all skills pending admin approval
  getPendingSkills: async () => {
    return api.get<ApiResponse<PendingSkill[]>>('/admin/skills/pending');
  },

  // Approve a skill
  approveSkill: async (skillId: string) => {
    return api.post<ApiResponse<ApproveSkillResponse>>(`/admin/skills/${skillId}/approve`);
  },

  // Reject a skill with reason
  rejectSkill: async (skillId: string, reason: string) => {
    return api.post<ApiResponse<RejectSkillResponse>>(`/admin/skills/${skillId}/reject`, {
      reason,
    });
  },

  // Block a skill with reason
  blockSkill: async (skillId: string, reason: string) => {
    return api.post<ApiResponse<{ skillId: string; isBlocked: boolean }>>(`/admin/skills/${skillId}/block`, {
      reason,
    });
  },

  // Unblock a skill
  unblockSkill: async (skillId: string) => {
    return api.post<ApiResponse<{ skillId: string; isBlocked: boolean }>>(`/admin/skills/${skillId}/unblock`);
  },
};
