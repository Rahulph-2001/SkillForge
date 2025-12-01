export interface CreateSkillDTO {
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  creditsHour: number;
  tags: string[];
}