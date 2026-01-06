import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISkillTemplateRepository } from '../../../domain/repositories/ISkillTemplateRepository';
import { SkillTemplate } from '../../../domain/entities/SkillTemplate';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UnauthorizedError } from '../../../domain/errors/AppError';
import { UserRole } from '../../../domain/enums/UserRole';
import { IListSkillTemplatesUseCase } from './interfaces/IListSkillTemplatesUseCase';

@injectable()
export class ListSkillTemplatesUseCase implements IListSkillTemplatesUseCase {
  constructor(
    @inject(TYPES.ISkillTemplateRepository)
    private readonly skillTemplateRepository: ISkillTemplateRepository,
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(adminUserId: string): Promise<SkillTemplate[]> {
    // Verify admin
    const admin = await this.userRepository.findById(adminUserId);
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new UnauthorizedError('Only admins can view skill templates');
    }

    return await this.skillTemplateRepository.findAll();
  }

  async executePublic(): Promise<SkillTemplate[]> {
    // Public endpoint - only return active templates
    return await this.skillTemplateRepository.findByStatus('Active');
  }
}
