import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { Skill } from '../../../domain/entities/Skill';
import { NotFoundError, ForbiddenError } from '../../../domain/errors/AppError';
import { IToggleSkillBlockUseCase } from './interfaces/IToggleSkillBlockUseCase';

@injectable()
export class ToggleSkillBlockUseCase implements IToggleSkillBlockUseCase {
    constructor(
        @inject(TYPES.ISkillRepository) private skillRepository: ISkillRepository
    ) { }

    async execute(skillId: string, providerId: string): Promise<Skill> {
        const skill = await this.skillRepository.findById(skillId);

        if (!skill) {
            throw new NotFoundError('Skill not found');
        }

        if (skill.providerId !== providerId) {
            throw new ForbiddenError('You are not authorized to modify this skill');
        }

        if (skill.isAdminBlocked) {
            throw new ForbiddenError('This skill has been blocked by an admin and cannot be modified');
        }

        const isBlocked = !skill.isBlocked;

        const updatedSkill = new Skill({
            ...skill.toJSON() as any,
            isBlocked: isBlocked,
            blockedReason: isBlocked ? 'Blocked by provider' : null,
            blockedAt: isBlocked ? new Date() : null,
            updatedAt: new Date()
        });

        return this.skillRepository.update(updatedSkill);
    }
}
