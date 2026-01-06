import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { Skill } from '../../../domain/entities/Skill';
import { NotFoundError, ValidationError } from '../../../domain/errors/AppError';
import { IUnblockSkillUseCase } from './interfaces/IUnblockSkillUseCase';

@injectable()
export class UnblockSkillUseCase implements IUnblockSkillUseCase {
  constructor(
    @inject(TYPES.ISkillRepository) private readonly skillRepository: ISkillRepository
  ) {}

  async execute(skillId: string, _adminId: string): Promise<void> {
    // Verify skill exists
    const skill = await this.skillRepository.findById(skillId);

    if (!skill) {
      throw new NotFoundError('Skill not found');
    }

    if (!skill.isBlocked) {
      throw new ValidationError('Skill is not blocked');
    }

    // Create updated skill with unblocked status
    const skillData = skill.toJSON();
    const updatedSkill = new Skill({
      id: skillData.id as string,
      providerId: skillData.providerId as string,
      title: skillData.title as string,
      description: skillData.description as string,
      category: skillData.category as string,
      level: skillData.level as string,
      durationHours: skillData.durationHours as number,
      creditsPerHour: skillData.creditsPerHour as number,
      tags: skillData.tags as string[],
      imageUrl: skillData.imageUrl as string | null,
      templateId: skillData.templateId as string | null,
      status: skillData.status as any,
      verificationStatus: skillData.verificationStatus as string | null,
      mcqScore: skillData.mcqScore as number | null,
      mcqTotalQuestions: skillData.mcqTotalQuestions as number | null,
      mcqPassingScore: skillData.mcqPassingScore as number | null,
      verifiedAt: skillData.verifiedAt as Date | null,
      totalSessions: skillData.totalSessions as number,
      rating: skillData.rating as number,
      isBlocked: false,
      blockedReason: null,
      blockedAt: null,
      isAdminBlocked: false,
      createdAt: skillData.createdAt as Date,
      updatedAt: new Date(),
    });

    await this.skillRepository.update(updatedSkill);
  }
}
