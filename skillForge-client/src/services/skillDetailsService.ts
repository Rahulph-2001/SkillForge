import api from './api';

export interface SkillProvider {
  id: string;
  name: string;
  email: string;
  rating: number;
  reviewCount: number;
}

export interface SkillDetail {
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
  provider: SkillProvider;
}

export const skillDetailsService = {
  async getSkillDetails(skillId: string): Promise<SkillDetail> {
    const response = await api.get(`/skills/${skillId}`);
    return response.data.data;
  }
};
