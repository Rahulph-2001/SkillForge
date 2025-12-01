export interface CreateSkillTemplateDTO {
  title: string;
  category: string;
  description?: string; // Optional - users add this when creating skills from template
  creditsMin: number;
  creditsMax: number;
  mcqCount: number;
  passRange?: number;
  levels: string[];
  tags: string[];
  status?: string;
}
