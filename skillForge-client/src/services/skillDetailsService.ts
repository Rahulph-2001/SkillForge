import api from './api';

export interface SkillProvider {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
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
  availability: {
    weeklySchedule: Record<string, { enabled: boolean; slots: { start: string; end: string }[] }>;
    blockedDates: { date: Date; reason?: string }[];
    timezone: string;
    bookedSlots?: { id: string; title: string; date: string; startTime: string; endTime: string }[];
  } | null;
}

export const skillDetailsService = {
  async getSkillDetails(skillId: string): Promise<SkillDetail> {
    const response = await api.get(`/skills/${skillId}`);
    return response.data.data;
  }
};
