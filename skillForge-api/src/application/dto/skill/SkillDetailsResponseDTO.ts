export interface SkillDetailsDTO {
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
  provider: {
    id: string;
    name: string;
    email: string;
    rating: number;
    reviewCount: number;
  };
}
