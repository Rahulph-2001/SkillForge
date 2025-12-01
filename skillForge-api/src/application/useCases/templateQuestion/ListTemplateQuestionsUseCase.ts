import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ITemplateQuestionRepository } from '../../../domain/repositories/ITemplateQuestionRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { TemplateQuestion } from '../../../domain/entities/TemplateQuestion';
import { UnauthorizedError } from '../../../domain/errors/AppError';

@injectable()
export class ListTemplateQuestionsUseCase {
  constructor(
    @inject(TYPES.ITemplateQuestionRepository)
    private readonly templateQuestionRepository: ITemplateQuestionRepository,
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(adminUserId: string, templateId: string, level?: string): Promise<TemplateQuestion[]> {
    // Verify admin authorization
    const admin = await this.userRepository.findById(adminUserId);
    if (!admin || admin.role !== 'admin') {
      throw new UnauthorizedError('Only admins can view template questions');
    }

    // Get questions by template and optionally by level
    if (level) {
      return await this.templateQuestionRepository.findByTemplateIdAndLevel(templateId, level);
    }

    return await this.templateQuestionRepository.findByTemplateId(templateId);
  }
}
