import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISkillTemplateRepository } from '../../../domain/repositories/ISkillTemplateRepository';
import { SkillTemplate } from '../../../domain/entities/SkillTemplate';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UnauthorizedError, NotFoundError } from '../../../domain/errors/AppError';
import { UserRole } from '../../../domain/enums/UserRole';
import { IGetSkillTemplateByIdUseCase } from './interfaces/IGetSkillTemplateByIdUseCase';

@injectable()
export class GetSkillTemplateByIdUseCase implements IGetSkillTemplateByIdUseCase {
    constructor(
        @inject(TYPES.ISkillTemplateRepository)
        private readonly skillTemplateRepository: ISkillTemplateRepository,
        @inject(TYPES.IUserRepository)
        private readonly userRepository: IUserRepository
    ) { }

    async execute(adminUserId: string, templateId: string): Promise<SkillTemplate> {
        // Verify admin
        const admin = await this.userRepository.findById(adminUserId);

        if (!admin || admin.role !== UserRole.ADMIN) {
            throw new UnauthorizedError('Only admins can view skill templates');
        }

        const template = await this.skillTemplateRepository.findById(templateId);

        if (!template) {
            throw new NotFoundError('Skill template not found');
        }

        return template;
    }
}
