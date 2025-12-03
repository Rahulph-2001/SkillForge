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
    console.log('🟡 [userProfileService] updateProfile called');
    console.log('🟡 [userProfileService] Input data:', {
      name: data.name,
      bio: data.bio,
      location: data.location,
      hasAvatar: !!data.avatar
    });

    const formData = new FormData();
    
    if (data.name) {
      formData.append('name', data.name);
      console.log('🟡 [userProfileService] Added name to FormData');
    }
    if (data.bio !== undefined) {
      formData.append('bio', data.bio);
      console.log('🟡 [userProfileService] Added bio to FormData');
    }
    if (data.location !== undefined) {
      formData.append('location', data.location);
      console.log('🟡 [userProfileService] Added location to FormData');
    }
    if (data.avatar) {
      formData.append('avatar', data.avatar);
      console.log('🟡 [userProfileService] Added avatar to FormData:', {
        name: data.avatar.name,
        type: data.avatar.type,
        size: data.avatar.size
      });
    } else {
      console.log('⚠️ [userProfileService] No avatar file to append');
    }

    // Log FormData contents
    console.log('🟡 [userProfileService] FormData entries:');
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}:`, { name: value.name, type: value.type, size: value.size });
      } else {
        console.log(`  ${key}:`, value);
      }
    }

    console.log('🟡 [userProfileService] Sending PUT request to /profile...');
    // Don't manually set Content-Type - axios will set it automatically with boundary
    const response = await api.put('/profile', formData);
    console.log('✅ [userProfileService] Response received');
    console.log('🟡 [userProfileService] Response data:', response.data);
    
    return response.data.data;
  },
};
