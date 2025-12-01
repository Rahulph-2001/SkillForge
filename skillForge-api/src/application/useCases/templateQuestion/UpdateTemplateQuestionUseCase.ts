import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ITemplateQuestionRepository } from '../../../domain/repositories/ITemplateQuestionRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { TemplateQuestion } from '../../../domain/entities/TemplateQuestion';
import { UpdateTemplateQuestionDTO } from '../../dto/templateQuestion/UpdateTemplateQuestionDTO';
import { UnauthorizedError, NotFoundError } from '../../../domain/errors/AppError';

@injectable()
export class UpdateTemplateQuestionUseCase {
  constructor(
    @inject(TYPES.ITemplateQuestionRepository)
    private readonly templateQuestionRepository: ITemplateQuestionRepository,
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(adminUserId: string, dto: UpdateTemplateQuestionDTO): Promise<TemplateQuestion> {
    // Verify admin authorization
    const admin = await this.userRepository.findById(adminUserId);
    if (!admin || admin.role !== 'admin') {
      throw new UnauthorizedError('Only admins can update template questions');
    }

    // Check if question exists
    const existingQuestion = await this.templateQuestionRepository.findById(dto.questionId);
    if (!existingQuestion) {
      throw new NotFoundError('Template question not found');
    }

    // Prepare update data
    const updateData: any = {};
    if (dto.question !== undefined) updateData.question = dto.question;
    if (dto.options !== undefined) updateData.options = dto.options;
    if (dto.correctAnswer !== undefined) updateData.correctAnswer = dto.correctAnswer;
    if (dto.explanation !== undefined) updateData.explanation = dto.explanation;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

    // Update question
    return await this.templateQuestionRepository.update(dto.questionId, updateData);
  }
}
