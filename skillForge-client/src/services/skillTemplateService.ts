import api from './api';

export interface SkillTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  creditsMin: number;
  creditsMax: number;
  mcqCount: number;
  passRange: number;
  levels: string[];
  tags: string[];
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateSkillTemplatePayload {
  title: string;
  category: string;
  description: string;
  creditsMin: number;
  creditsMax: number;
  mcqCount: number;
  passRange?: number;
  levels: string[];
  tags: string[];
  status?: 'Active' | 'Inactive';
}

export interface UpdateSkillTemplatePayload {
  title?: string;
  category?: string;
  description?: string;
  creditsMin?: number;
  creditsMax?: number;
  mcqCount?: number;
  passRange?: number;
  levels?: string[];
  tags?: string[];
  status?: 'Active' | 'Inactive';
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const skillTemplateService = {
  // Get all skill templates
  getAll: async () => {
    return api.get<ApiResponse<SkillTemplate[]>>('/admin/skill-templates');
  },

  // Get single skill template by ID
  getById: async (id: string) => {
    return api.get<ApiResponse<SkillTemplate>>(`/admin/skill-templates/${id}`);
  },

  // Create new skill template
  create: async (data: CreateSkillTemplatePayload) => {
    return api.post<ApiResponse<SkillTemplate>>('/admin/skill-templates', data);
  },

  // Update skill template
  update: async (id: string, data: UpdateSkillTemplatePayload) => {
    return api.put<ApiResponse<SkillTemplate>>(`/admin/skill-templates/${id}`, data);
  },

  // Delete skill template
  delete: async (id: string) => {
    return api.delete<ApiResponse<{ message: string }>>(`/admin/skill-templates/${id}`);
  },

  // Toggle status (Active/Inactive)
  toggleStatus: async (id: string) => {
    return api.patch<ApiResponse<SkillTemplate>>(`/admin/skill-templates/${id}/toggle-status`);
  },

  // Get all active skill templates (public endpoint for users)
  getAllActive: async () => {
    return api.get<ApiResponse<SkillTemplate[]>>('/skill-templates/active');
  },
};
