export interface BrowseSkillDTO {
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
  };
  availableDays: string[];
}

export interface BrowseSkillsResponseDTO {
  skills: BrowseSkillDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
