export interface CommunityResponseDTO {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string | null;
  videoUrl: string | null;
  adminId: string;
  creditsCost: number;
  creditsPeriod: string;
  membersCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isJoined?: boolean;
  isAdmin?: boolean;
}