import api from './api'

export interface SkillTemplate {
  id: string
  title: string
  category: string
  description: string
  creditsMin: number
  creditsMax: number
  mcqCount: number
  passRange: number
  levels: string[]
  tags: string[]
  status: "Active" | "Inactive"
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface SkillTemplateListResponse {
  templates: SkillTemplate[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface CreateSkillTemplateRequest {
  title: string
  category: string
  description: string
  creditsMin: number
  creditsMax: number
  mcqCount: number
  passRange: number
  levels: string[]
  tags: string[]
  status?: "Active" | "Inactive"
}

export interface UpdateSkillTemplateRequest {
  title?: string
  category?: string
  description?: string
  creditsMin?: number
  creditsMax?: number
  mcqCount?: number
  passRange?: number
  levels?: string[]
  tags?: string[]
  status?: "Active" | "Inactive"
}

export const skillTemplateService = {
  getAll: async (
    page = 1,
    limit = 10,
    search?: string,
    category?: string,
    status?: string
  ): Promise<SkillTemplateListResponse> => {
    const params: Record<string, string | number> = { page, limit }
    if (search) params.search = search
    if (category && category !== 'All') params.category = category
    if (status && status !== 'All Status') params.status = status

    const response = await api.get('/admin/skill-templates', { params })
    return response.data.data
  },

  getById: async (id: string): Promise<SkillTemplate> => {
    const response = await api.get(`/admin/skill-templates/${id}`)
    return response.data.data
  },

  create: async (data: CreateSkillTemplateRequest): Promise<SkillTemplate> => {
    const response = await api.post('/admin/skill-templates', data)
    return response.data.data
  },

  update: async (id: string, data: UpdateSkillTemplateRequest): Promise<SkillTemplate> => {
    const response = await api.put(`/admin/skill-templates/${id}`, data)
    return response.data.data
  },

  toggleStatus: async (id: string): Promise<SkillTemplate> => {
    const response = await api.patch(`/admin/skill-templates/${id}/toggle-status`)
    return response.data.data
  },

  getActive: async (): Promise<SkillTemplate[]> => {
    const response = await api.get('/skill-templates/active')
    return response.data.data
  }
}