export interface IUnblockSkillUseCase {
  execute(skillId: string, adminId: string): Promise<void>;
}

