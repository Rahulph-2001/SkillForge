import { injectable } from 'inversify';
import { PendingSkillDTO } from '../dto/admin/PendingSkillDTO';
import { IPendingSkillMapper } from './interfaces/IPendingSkillMapper';
import { Skill } from '../../domain/entities/Skill';
import { User } from '../../domain/entities/User';

@injectable()
export class PendingSkillMapper implements IPendingSkillMapper {
  public toDTO(skill: Skill, provider: User): PendingSkillDTO {
    return {
      id: skill.id,
      providerId: skill.providerId,
      providerName: provider.name,
      providerEmail: provider.email.value,
      title: skill.title,
      description: skill.description,
      category: skill.category,
      level: skill.level,
      durationHours: skill.durationHours,
      creditsPerHour: skill.creditsPerHour,
      tags: skill.tags,
      imageUrl: skill.imageUrl,
      templateId: skill.templateId,
      status: skill.status,
      verificationStatus: skill.verificationStatus,
      mcqScore: skill.mcqScore,
      mcqTotalQuestions: skill.mcqTotalQuestions,
      mcqPassingScore: skill.mcqPassingScore,
      verifiedAt: skill.verifiedAt,
      createdAt: skill.createdAt,
      updatedAt: skill.updatedAt,
    };
  }
}
