export interface SkillResponseDTO {
  id: string;
  providerId: string;
  title: string;
  description: string;
  category: string;
  level: string;
  durationHours: number;
  creditsPerHour: number;
  tags: string[];
  imageUrl: string | null;
  templateId: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
