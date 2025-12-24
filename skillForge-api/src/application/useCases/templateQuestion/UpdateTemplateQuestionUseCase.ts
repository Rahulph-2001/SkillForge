import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ITemplateQuestionRepository } from '../../../domain/repositories/ITemplateQuestionRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { TemplateQuestion } from '../../../domain/entities/TemplateQuestion';
import { UpdateTemplateQuestionDTO } from '../../dto/templateQuestion/UpdateTemplateQuestionDTO';
import { UnauthorizedError, NotFoundError } from '../../../domain/errors/AppError';
import { UserRole } from '../../../domain/enums/UserRole';

@injectable()
export class UpdateTemplateQuestionUseCase {
  constructor(
    @inject(TYPES.ITemplateQuestionRepository)
    private readonly templateQuestionRepository: ITemplateQuestionRepository,
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository
  ) { }

  async execute(adminUserId: string, questionId: string, dto: UpdateTemplateQuestionDTO): Promise<TemplateQuestion> {
    // Verify admin authorization
    const admin = await this.userRepository.findById(adminUserId);
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new UnauthorizedError('Only admins can update template questions');
    }

    // Check if question exists
    const existingQuestion = await this.templateQuestionRepository.findById(questionId);
    if (!existingQuestion) {
      throw new NotFoundError('Template question not found');
    }

    // Prepare update data
    const updateData: any = {};
    if (dto.level !== undefined) updateData.level = dto.level;
    if (dto.question !== undefined) updateData.question = dto.question;
    if (dto.options !== undefined) updateData.options = dto.options;
    if (dto.correctAnswer !== undefined) updateData.correctAnswer = dto.correctAnswer;
    if (dto.explanation !== undefined) updateData.explanation = dto.explanation;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

    // Update question
    return await this.templateQuestionRepository.update(questionId, updateData);
  }
}
