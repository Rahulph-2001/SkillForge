import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ITemplateQuestionRepository } from '../../../domain/repositories/ITemplateQuestionRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UnauthorizedError, NotFoundError } from '../../../domain/errors/AppError';
import { UserRole } from '../../../domain/enums/UserRole';

@injectable()
export class DeleteTemplateQuestionUseCase {
  constructor(
    @inject(TYPES.ITemplateQuestionRepository)
    private readonly templateQuestionRepository: ITemplateQuestionRepository,
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(adminUserId: string, questionId: string): Promise<void> {
    // Verify admin authorization
    const admin = await this.userRepository.findById(adminUserId);
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new UnauthorizedError('Only admins can delete template questions');
    }

    // Check if question exists
    const existingQuestion = await this.templateQuestionRepository.findById(questionId);
    if (!existingQuestion) {
      throw new NotFoundError('Template question not found');
    }

    // Soft delete question
    await this.templateQuestionRepository.delete(questionId);
  }
}
