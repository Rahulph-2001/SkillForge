import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISkillTemplateRepository } from '../../../domain/repositories/ISkillTemplateRepository';
import { SkillTemplate } from '../../../domain/entities/SkillTemplate';
import { UpdateSkillTemplateDTO } from '../../dto/skillTemplate/UpdateSkillTemplateDTO';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UnauthorizedError, NotFoundError } from '../../../domain/errors/AppError';
import { UserRole } from '../../../domain/enums/UserRole';

@injectable()
export class UpdateSkillTemplateUseCase {
  constructor(
    @inject(TYPES.ISkillTemplateRepository)
    private readonly skillTemplateRepository: ISkillTemplateRepository,
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(adminUserId: string, dto: UpdateSkillTemplateDTO): Promise<SkillTemplate> {
    // Verify admin
    const admin = await this.userRepository.findById(adminUserId);
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new UnauthorizedError('Only admins can update skill templates');
    }

    const existing = await this.skillTemplateRepository.findById(dto.templateId);
    if (!existing) {
      throw new NotFoundError('Skill template not found');
    }

    const updates: any = {};
    if (dto.title) updates.title = dto.title;
    if (dto.category) updates.category = dto.category;
    if (dto.description) updates.description = dto.description;
    if (dto.creditsMin !== undefined) updates.creditsMin = dto.creditsMin;
    if (dto.creditsMax !== undefined) updates.creditsMax = dto.creditsMax;
    if (dto.mcqCount !== undefined) updates.mcqCount = dto.mcqCount;
    if (dto.passRange !== undefined) updates.passRange = dto.passRange;
    if (dto.levels) updates.levels = dto.levels;
    if (dto.tags) updates.tags = dto.tags;
    if (dto.status) updates.status = dto.status;

    return await this.skillTemplateRepository.update(dto.templateId, updates);
  }
}
