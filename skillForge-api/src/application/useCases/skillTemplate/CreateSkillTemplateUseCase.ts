import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISkillTemplateRepository } from '../../../domain/repositories/ISkillTemplateRepository';
import { SkillTemplate } from '../../../domain/entities/SkillTemplate';
import { CreateSkillTemplateDTO } from '../../dto/skillTemplate/CreateSkillTemplateDTO';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UnauthorizedError } from '../../../domain/errors/AppError';
import { UserRole } from '../../../domain/enums/UserRole';
import { ICreateSkillTemplateUseCase } from './interfaces/ICreateSkillTemplateUseCase';

@injectable()
export class CreateSkillTemplateUseCase implements ICreateSkillTemplateUseCase {
  constructor(
    @inject(TYPES.ISkillTemplateRepository)
    private readonly skillTemplateRepository: ISkillTemplateRepository,
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(adminUserId: string, dto: CreateSkillTemplateDTO): Promise<SkillTemplate> {
    // Verify admin
    const admin = await this.userRepository.findById(adminUserId);
    
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new UnauthorizedError('Only admins can create skill templates');
    }
    const template = new SkillTemplate({
      title: dto.title,
      category: dto.category,
      description: dto.description || '', // Default to empty string if not provided
      creditsMin: dto.creditsMin,
      creditsMax: dto.creditsMax,
      mcqCount: dto.mcqCount,
      passRange: dto.passRange || 70,
      levels: dto.levels,
      tags: dto.tags || [],
      status: dto.status || 'Active',
    });

    return await this.skillTemplateRepository.create(template);
  }
}
