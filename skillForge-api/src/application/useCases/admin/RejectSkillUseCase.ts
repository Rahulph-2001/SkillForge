import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { Skill } from '../../../domain/entities/Skill';
import { NotFoundError, ValidationError } from '../../../domain/errors/AppError';
import { IRejectSkillUseCase, RejectSkillDTO } from './interfaces/IRejectSkillUseCase';

@injectable()
export class RejectSkillUseCase implements IRejectSkillUseCase {
  constructor(
    @inject(TYPES.ISkillRepository) private readonly skillRepository: ISkillRepository
  ) {}

  async execute(data: RejectSkillDTO): Promise<void> {
    // Verify skill exists and is in review
    const skill = await this.skillRepository.findById(data.skillId);

    if (!skill) {
      throw new NotFoundError('Skill not found');
    }

    if (skill.status !== 'in-review') {
      throw new ValidationError('Skill is not in review status');
    }

    // Create updated skill with rejected status
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
      status: 'rejected',
      verificationStatus: skillData.verificationStatus as string | null,
      mcqScore: skillData.mcqScore as number | null,
      mcqTotalQuestions: skillData.mcqTotalQuestions as number | null,
      mcqPassingScore: skillData.mcqPassingScore as number | null,
      verifiedAt: skillData.verifiedAt as Date | null,
      totalSessions: skillData.totalSessions as number,
      rating: skillData.rating as number,
      isBlocked: skillData.isBlocked as boolean,
      blockedReason: skillData.blockedReason as string | null,
      blockedAt: skillData.blockedAt as Date | null,
      isAdminBlocked: skillData.isAdminBlocked as boolean,
      createdAt: skillData.createdAt as Date,
      updatedAt: new Date(),
    });

    await this.skillRepository.update(updatedSkill);
  }
}
