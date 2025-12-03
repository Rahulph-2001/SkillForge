export interface CreateSkillDTO {
  title: string;
  description: string;
  category: string;
  level: string;
  durationHours: number;
  creditsHour: number;
  tags: string[];
  templateId?: string;
}