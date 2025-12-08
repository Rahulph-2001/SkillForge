import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { Skill } from '../../../domain/entities/Skill';
import { NotFoundError, ForbiddenError } from '../../../domain/errors/AppError';

export interface UpdateSkillDTO {
    description?: string;
    category?: string;
    level?: string;
    durationHours?: number;
    creditsPerHour?: number;
    tags?: string[];
    imageUrl?: string;
}

export interface IUpdateSkillUseCase {
    execute(skillId: string, providerId: string, updates: UpdateSkillDTO): Promise<Skill>;
}

@injectable()
export class UpdateSkillUseCase implements IUpdateSkillUseCase {
    constructor(
        @inject(TYPES.ISkillRepository) private skillRepository: ISkillRepository
    ) { }

    async execute(skillId: string, providerId: string, updates: UpdateSkillDTO): Promise<Skill> {
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

        // Create a new Skill instance with updated properties
        // We do NOT allow updating the title
        const updatedSkill = new Skill({
            ...skill.toJSON() as any, // Spread existing properties
            ...updates, // Overwrite with allowed updates
            updatedAt: new Date()
        });

        return this.skillRepository.update(updatedSkill);
    }
}
