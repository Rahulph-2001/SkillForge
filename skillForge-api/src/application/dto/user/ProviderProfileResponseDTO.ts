export interface ProviderProfileResponseDTO {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  rating: number | null;
  reviewCount: number;
  totalSessionsCompleted: number;
  memberSince: Date;
  verification: boolean;
  skillsOffered: any[];
}

