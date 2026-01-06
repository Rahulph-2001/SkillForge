import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ITemplateQuestionRepository } from '../../../domain/repositories/ITemplateQuestionRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { TemplateQuestion } from '../../../domain/entities/TemplateQuestion';
import { CreateTemplateQuestionDTO } from '../../dto/templateQuestion/CreateTemplateQuestionDTO';
import { UnauthorizedError } from '../../../domain/errors/AppError';
import { UserRole } from '../../../domain/enums/UserRole';
import { v4 as uuidv4 } from 'uuid';
import { ICreateTemplateQuestionUseCase } from './interfaces/ICreateTemplateQuestionUseCase';

@injectable()
export class CreateTemplateQuestionUseCase implements ICreateTemplateQuestionUseCase {
  constructor(
    @inject(TYPES.ITemplateQuestionRepository)
    private readonly templateQuestionRepository: ITemplateQuestionRepository,
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(adminUserId: string, dto: CreateTemplateQuestionDTO): Promise<TemplateQuestion> {
    // Verify admin authorization
    const admin = await this.userRepository.findById(adminUserId);
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new UnauthorizedError('Only admins can create template questions');
    }

    // Create question entity
    const question = TemplateQuestion.create(
      uuidv4(),
      dto.templateId,
      dto.level,
      dto.question,
      dto.options,
      dto.correctAnswer,
      dto.explanation || null,
      true,
      new Date(),
      new Date()
    );

    // Save to database
    return await this.templateQuestionRepository.create(question);
  }
}
