import api from './api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  credits: number;
  walletBalance: number;
  skillsOffered: number;
  rating: number;
  reviewCount: number;
  totalSessionsCompleted: number;
  memberSince: string;
  subscriptionPlan: string;
  subscriptionValidUntil: string | null;
}

export interface UpdateProfileData {
  name?: string;
  bio?: string;
  location?: string;
  avatar?: File;
}

export const userProfileService = {
  async getProfile(): Promise<UserProfile> {
    const response = await api.get('/profile');
    return response.data.data;
  },

  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const formData = new FormData();

    if (data.name) {
      formData.append('name', data.name);
    }
    if (data.bio !== undefined) {
      formData.append('bio', data.bio);
    }
    if (data.location !== undefined) {
      formData.append('location', data.location);
    }
    if (data.avatar) {
      formData.append('avatar', data.avatar);
    }

    const response = await api.put('/profile', formData);
    return response.data.data;
  },
};
