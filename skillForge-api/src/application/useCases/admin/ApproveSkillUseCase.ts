import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { Skill } from '../../../domain/entities/Skill';
import { NotFoundError, ValidationError } from '../../../domain/errors/AppError';
import { IApproveSkillUseCase } from './interfaces/IApproveSkillUseCase';
import { INotificationService } from '../../../domain/services/INotificationService';
import { NotificationType } from '../../../domain/entities/Notification';

@injectable()
export class ApproveSkillUseCase implements IApproveSkillUseCase {
  constructor(
    @inject(TYPES.ISkillRepository) private readonly skillRepository: ISkillRepository,
    @inject(TYPES.INotificationService) private readonly notificationService: INotificationService
  ) { }

  async execute(skillId: string, _adminId: string): Promise<void> {
    // Verify skill exists and is in review
    const skill = await this.skillRepository.findById(skillId);

    if (!skill) {
      throw new NotFoundError('Skill not found');
    }

    if (skill.status !== 'in-review') {
      throw new ValidationError('Skill is not in review status');
    }

    // Create updated skill with approved status
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
      status: 'approved',
      verificationStatus: 'passed',
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

    // Notify skill provider
    await this.notificationService.send({
      userId: skill.providerId,
      type: NotificationType.SKILL_APPROVED,
      title: 'Skill Approved!',
      message: `Your skill "${skill.title}" has been approved and is now visible to learners`,
      data: { skillId: skill.id },
    });
  }
}
