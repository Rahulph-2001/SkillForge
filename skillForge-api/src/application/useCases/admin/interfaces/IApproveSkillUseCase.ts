export interface IApproveSkillUseCase {
  execute(skillId: string, adminId: string): Promise<void>;
}

