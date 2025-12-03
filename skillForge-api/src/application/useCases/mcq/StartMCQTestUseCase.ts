import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IMCQRepository } from '../../../domain/repositories/IMCQRepository';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { MCQTestSession } from '../../../domain/entities/MCQAttempt';

@injectable()
export class StartMCQTestUseCase {
  constructor(
    @inject(TYPES.IMCQRepository) private mcqRepository: IMCQRepository,
    @inject(TYPES.ISkillRepository) private skillRepository: ISkillRepository
  ) {}

  async execute(skillId: string, userId: string): Promise<MCQTestSession> {
    // Get skill details
    const skill = await this.skillRepository.findById(skillId);
    if (!skill) {
      throw new Error('Skill not found');
    }

    // Verify skill belongs to user
    if (skill.providerId !== userId) {
      throw new Error('Unauthorized: This skill does not belong to you');
    }

    // Check if skill is in pending status
    if (skill.status !== 'pending') {
      throw new Error('Skill is not in pending status');
    }

    // Check if template exists
    if (!skill.templateId) {
      throw new Error('Skill template not found');
    }

    // Get random questions for the skill's level from template
    const questionsNeeded = skill.mcqTotalQuestions || 7;
    const questions = await this.mcqRepository.getQuestionsByTemplate(
      skill.templateId,
      skill.level,
      questionsNeeded
    );

    console.log(`📝 [StartMCQTestUseCase] Fetched ${questions.length} random questions out of available pool for ${skill.level} level`);

    if (questions.length === 0) {
      throw new Error(`No questions available for level: ${skill.level}`);
    }

    if (questions.length < questionsNeeded) {
      console.warn(`⚠️ [StartMCQTestUseCase] Only ${questions.length} questions available, but ${questionsNeeded} were requested`);
    }

    // Remove correct answers from questions sent to frontend
    const questionsWithoutAnswers = questions.map(q => ({
      ...q,
      correctAnswer: -1, // Hide correct answer
      explanation: undefined, // Hide explanation
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
