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

        // Create a new Skill instance with updated properties
        // We do NOT allow updating the title
        const updatedSkill = new Skill({
            ...skill.toJSON() as any, // Spread existing properties
            ...updates, // Overwrite with allowed updates
            imageUrl: imageUrl || skill.imageUrl, // Use new URL if uploaded, or existing
            updatedAt: new Date()
        });

        return this.skillRepository.update(updatedSkill);
    }
}
