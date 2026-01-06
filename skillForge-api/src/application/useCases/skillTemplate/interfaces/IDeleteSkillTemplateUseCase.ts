export interface IDeleteSkillTemplateUseCase {
  execute(adminUserId: string, templateId: string): Promise<void>;
}

