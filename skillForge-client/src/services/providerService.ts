import api from './api';

export interface ProviderProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  rating: number;
  reviewCount: number;
  totalSessionsCompleted: number;
  memberSince: string;
  verification: {
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    isIdentityVerified: boolean;
  };
  skillsOffered: string[];
}

export interface ProviderReview {
  id: string;
  userName: string;
  userAvatar: string | null;
  rating: number;
  createdAt: string;
  comment: string;
  skillTitle: string;
}

export const providerService = {
  /**
   * Get provider profile by ID
   */
  async getProviderProfile(providerId: string): Promise<ProviderProfile> {
    console.log('📋 [providerService] Fetching provider profile:', providerId);
    const response = await api.get(`/users/${providerId}/profile`);
    console.log('✅ [providerService] Provider profile fetched:', response.data);
    return response.data.data;
  },

  /**
   * Get provider reviews
   */
  async getProviderReviews(providerId: string): Promise<ProviderReview[]> {
    console.log('📋 [providerService] Fetching provider reviews:', providerId);
    const response = await api.get(`/users/${providerId}/reviews`);
    console.log('✅ [providerService] Provider reviews fetched:', response.data);
    return response.data.data;
  },
};
