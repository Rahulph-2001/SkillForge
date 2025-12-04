import api from './api';

export interface BrowseSkillsFilters {
  search?: string;
  category?: string;
  level?: string;
  page?: number;
  limit?: number;
  excludeProviderId?: string;
}

export interface BrowseSkill {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  durationHours: number;
  creditsPerHour: number;
  imageUrl: string | null;
  tags: string[];
  rating: number;
  totalSessions: number;
  provider: {
    id: string;
    name: string;
    email: string;
  };
}

export interface BrowseSkillsResponse {
  skills: BrowseSkill[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const browseSkillsService = {
  async browseSkills(filters: BrowseSkillsFilters): Promise<BrowseSkillsResponse> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.level) params.append('level', filters.level);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.excludeProviderId) params.append('excludeProviderId', filters.excludeProviderId);

    const response = await api.get(`/skills/browse?${params.toString()}`);
    return response.data.data;
  }
};
