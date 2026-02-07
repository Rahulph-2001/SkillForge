import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { Skill } from '../../../domain/entities/Skill';
import { NotFoundError, ValidationError } from '../../../domain/errors/AppError';
import { IBlockSkillUseCase, BlockSkillDTO } from './interfaces/IBlockSkillUseCase';
import { INotificationService } from '../../../domain/services/INotificationService';
import { NotificationType } from '../../../domain/entities/Notification';

@injectable()
export class BlockSkillUseCase implements IBlockSkillUseCase {
  constructor(
    @inject(TYPES.ISkillRepository) private readonly skillRepository: ISkillRepository,
    @inject(TYPES.INotificationService) private readonly notificationService: INotificationService
  ) { }

  async execute(data: BlockSkillDTO): Promise<void> {
    // Verify skill exists
    const skill = await this.skillRepository.findById(data.skillId);

    if (!skill) {
      throw new NotFoundError('Skill not found');
    }

    // Only approved skills can be blocked
    if (skill.status !== 'approved') {
      throw new ValidationError('Only approved skills can be blocked');
    }

    if (skill.isBlocked) {
      throw new ValidationError('Skill is already blocked');
    }

    // Create updated skill with blocked status
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
      isBlocked: true,
      blockedReason: data.reason,
      blockedAt: new Date(),
      isAdminBlocked: true,
      createdAt: skillData.createdAt as Date,
      updatedAt: new Date(),
    });

    await this.skillRepository.update(updatedSkill);

    // Notify skill provider
    await this.notificationService.send({
      userId: skill.providerId,
      type: NotificationType.SKILL_BLOCKED,
      title: 'Skill Blocked',
      message: `Your skill "${skill.title}" has been blocked by admin. ${data.reason ? `Reason: ${data.reason}` : ''}`,
      data: { skillId: skill.id, reason: data.reason },
    });
  }
}
