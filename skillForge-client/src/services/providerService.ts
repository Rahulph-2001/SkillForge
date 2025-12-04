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
    const response = await api.get(`/users/${providerId}/profile`);
    return response.data.data;
  },

  /**
   * Get provider reviews
   */
  async getProviderReviews(providerId: string): Promise<ProviderReview[]> {
    const response = await api.get(`/users/${providerId}/reviews`);
    return response.data.data;
  },
};
