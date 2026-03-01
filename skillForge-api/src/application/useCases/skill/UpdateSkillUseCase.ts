import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { Skill } from '../../../domain/entities/Skill';
import { NotFoundError, ForbiddenError } from '../../../domain/errors/AppError';
import { IStorageService } from '../../../domain/services/IStorageService';
import { IUpdateSkillUseCase, UpdateSkillDTO } from './interfaces/IUpdateSkillUseCase';

@injectable()
export class UpdateSkillUseCase implements IUpdateSkillUseCase {
    constructor(
        @inject(TYPES.ISkillRepository) private skillRepository: ISkillRepository,
        @inject(TYPES.IStorageService) private storageService: IStorageService
    ) { }

    async execute(
        skillId: string,
        providerId: string,
        updates: UpdateSkillDTO,
        imageFile?: { buffer: Buffer; originalname: string; mimetype: string }
    ): Promise<Skill> {
        const skill = await this.skillRepository.findById(skillId);

        if (!skill) {
            throw new NotFoundError('Skill not found');
        }

        if (skill.providerId !== providerId) {
            throw new ForbiddenError('You are not authorized to update this skill');
        }

        if (skill.isAdminBlocked) {
            throw new ForbiddenError('This skill has been blocked by an admin and cannot be updated');
        }

        let imageUrl = updates.imageUrl;

        if (imageFile) {
            // Create S3 key with skills/ prefix
            const key = `skills/${Date.now()}-${imageFile.originalname}`;
            imageUrl = await this.storageService.uploadFile(
                imageFile.buffer,
                key,
                imageFile.mimetype
            );
        }

        // Construct updated Skill using named getters to preserve type safety
        const updatedSkill = new Skill({
            id: skill.id,
            providerId: skill.providerId,
            title: skill.title, // Title is not updatable
            description: updates.description ?? skill.description,
            category: updates.category ?? skill.category,
            level: updates.level ?? skill.level,
            durationHours: updates.durationHours ?? skill.durationHours,
            creditsPerHour: updates.creditsPerHour ?? skill.creditsPerHour,
            tags: updates.tags ?? skill.tags,
            imageUrl: imageUrl ?? skill.imageUrl,
            templateId: skill.templateId,
            status: skill.status,
            verificationStatus: skill.verificationStatus,
            mcqScore: skill.mcqScore,
            mcqTotalQuestions: skill.mcqTotalQuestions,
            mcqPassingScore: skill.mcqPassingScore,
            verifiedAt: skill.verifiedAt,
            totalSessions: skill.totalSessions,
            rating: skill.rating,
            isBlocked: skill.isBlocked,
            blockedReason: skill.blockedReason,
            blockedAt: skill.blockedAt,
            isAdminBlocked: skill.isAdminBlocked,
            createdAt: skill.createdAt,
            updatedAt: new Date()
        });

        return this.skillRepository.update(updatedSkill);
    }
}
