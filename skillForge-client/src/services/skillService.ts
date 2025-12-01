import api from './api';

export interface CreateSkillPayload {
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  creditsHour: number;
  tags: string[];
  image?: string; 
}

export interface SkillResponse {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  creditsPerHour: number;
  tags: string[];
  imageUrl?: string;
  status: 'approved' | 'pending' | 'in-review' | 'rejected';
  totalSessions: number;
  rating: number;
}

export const skillService = {
  createSkill: async (data: CreateSkillPayload, imageFile?: Blob): Promise<{ success: boolean; data: SkillResponse }> => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('level', data.level);
      formData.append('duration', data.duration);
      formData.append('creditsHour', data.creditsHour.toString());
      formData.append('tags', JSON.stringify(data.tags));
      
      if (imageFile) {
        formData.append('image', imageFile, 'skill-image.jpg');
      }

      const response = await api.post('/skills', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  getMySkills: async (): Promise<{ success: boolean; data: SkillResponse[] }> => {
    try {
      const response = await api.get('/skills/me');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
};