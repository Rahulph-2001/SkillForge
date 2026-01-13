import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IMCQRepository } from '../../../domain/repositories/IMCQRepository';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IStartMCQTestUseCase } from './interfaces/IStartMCQTestUseCase';
import { StartMCQRequestDTO } from '../../dto/mcq/StartMCQRequestDTO';
import { StartMCQResponseDTO } from '../../dto/mcq/StartMCQResponseDTO';
import { NotFoundError, ForbiddenError, ValidationError } from '../../../domain/errors/AppError';

@injectable()
export class StartMCQTestUseCase implements IStartMCQTestUseCase {
  constructor(
    @inject(TYPES.IMCQRepository) private mcqRepository: IMCQRepository,
    @inject(TYPES.ISkillRepository) private skillRepository: ISkillRepository
  ) { }

  async execute(request: StartMCQRequestDTO): Promise<StartMCQResponseDTO> {
    const { skillId, userId } = request;

    // Get skill details
    const skill = await this.skillRepository.findById(skillId);
    if (!skill) {
      throw new NotFoundError('Skill not found');
    }

    // Verify skill belongs to user
    if (skill.providerId !== userId) {
      throw new ForbiddenError('Unauthorized: This skill does not belong to you');
    }

    // Check if skill is in pending status
    if (skill.status !== 'pending') {
      throw new ValidationError('Skill is not in pending status');
    }

    // Check if template exists
    if (!skill.templateId) {
      throw new NotFoundError('Skill template not found');
    }

    // Get random questions for the skill's level from template
    const questionsNeeded = skill.mcqTotalQuestions || 7;
    const questions = await this.mcqRepository.getQuestionsByTemplate(
      skill.templateId,
      skill.level,
      questionsNeeded
    );

    if (questions.length === 0) {
      throw new NotFoundError(`No questions available for level: ${skill.level}`);
    }

    // Remove correct answers from questions sent to frontend
    const questionsWithoutAnswers = questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
    }));

    return {
      skillId: skill.id,
      templateId: skill.templateId,
      level: skill.level,
      questions: questionsWithoutAnswers,
      totalQuestions: questions.length,
      passingScore: skill.mcqPassingScore || 70,
    };
  }
}
