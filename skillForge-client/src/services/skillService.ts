import api from './api';

export interface CreateSkillPayload {
  title: string;
  description: string;
  category: string;
  level: string;
  durationHours: number;
  creditsHour: number;
  tags: string[];
  image?: string; 
  templateId?: string;
}

export interface SkillResponse {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  durationHours: number;
  creditsPerHour: number;
  tags: string[];
  imageUrl?: string;
  templateId?: string;
  status: 'approved' | 'pending' | 'in-review' | 'rejected';
  totalSessions: number;
  rating: number;
}

export const skillService = {
  createSkill: async (data: CreateSkillPayload, imageFile?: Blob): Promise<{ success: boolean; data: SkillResponse }> => {
    try {
      console.log(' [skillService] Creating skill with payload:', data);
      console.log(' [skillService] Image file:', imageFile ? `${imageFile.size} bytes` : 'No image');
      
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('level', data.level);
      formData.append('durationHours', data.durationHours.toString());
      formData.append('creditsHour', data.creditsHour.toString());
      formData.append('tags', JSON.stringify(data.tags));
      
      if (data.templateId) {
        formData.append('templateId', data.templateId);
        console.log(' [skillService] Template ID:', data.templateId);
      }
      
      if (imageFile) {
        formData.append('image', imageFile, 'skill-image.jpg');
      }

      console.log(' [skillService] Sending POST request to /skills...');
      const response = await api.post('/skills', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(' [skillService] Skill created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(' [skillService] Error creating skill:', error);
      console.error(' [skillService] Error response:', error.response);
      console.error(' [skillService] Error status:', error.response?.status);
      console.error(' [skillService] Error data:', error.response?.data);
      throw error.response?.data || error;
    }
  },

  getMySkills: async (): Promise<{ success: boolean; data: SkillResponse[] }> => {
    try {
      console.log(' [skillService] Sending GET request to /skills/me...');
      const response = await api.get('/skills/me');
      console.log(' [skillService] Retrieved skills:', response.data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
};