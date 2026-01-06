export interface BlockSkillDTO {
  skillId: string;
  adminId: string;
  reason: string;
}

export interface IBlockSkillUseCase {
  execute(data: BlockSkillDTO): Promise<void>;
}

