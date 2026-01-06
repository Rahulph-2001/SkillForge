export interface UserProfileDTO {
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

export interface IGetUserProfileUseCase {
  execute(userId: string): Promise<UserProfileDTO>;
}

