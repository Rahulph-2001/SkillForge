import { injectable } from 'inversify';
import { AdminSkillDTO } from '../dto/admin/AdminSkillDTO';
import { IAdminSkillMapper } from './interfaces/IAdminSkillMapper';
import { Skill } from '../../domain/entities/Skill';
import { User } from '../../domain/entities/User';

@injectable()
export class AdminSkillMapper implements IAdminSkillMapper {
    public toDTO(skill: Skill, provider: User): AdminSkillDTO {
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
            isBlocked: skill.isAdminBlocked,
            blockedReason: skill.blockedReason,
            blockedAt: skill.blockedAt,
            totalSessions: skill.totalSessions,
            rating: skill.rating || 0,
            rejectionReason: skill.blockedReason,
        };
    }
}
