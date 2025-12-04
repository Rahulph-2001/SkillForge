import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IMCQRepository } from '../../../domain/repositories/IMCQRepository';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { ISubmitMCQTestUseCase } from './interfaces/ISubmitMCQTestUseCase';
import { SubmitMCQRequestDTO } from '../../dto/mcq/SubmitMCQRequestDTO';
import { SubmitMCQResponseDTO } from '../../dto/mcq/SubmitMCQResponseDTO';

@injectable()
export class SubmitMCQTestUseCase implements ISubmitMCQTestUseCase {
  constructor(
    @inject(TYPES.IMCQRepository) private mcqRepository: IMCQRepository,
    @inject(TYPES.ISkillRepository) private skillRepository: ISkillRepository
  ) {}

  async execute(request: SubmitMCQRequestDTO): Promise<SubmitMCQResponseDTO> {
    const { skillId, userId, questionIds, answers, timeTaken } = request;

    // Get skill details
    const skill = await this.skillRepository.findById(skillId);
    if (!skill) {
      throw new Error('Skill not found');
    }

    // Verify skill belongs to user
    if (skill.providerId !== userId) {
      throw new Error('Unauthorized: This skill does not belong to you');
    }

    // Validate question IDs are provided
    if (!questionIds || questionIds.length === 0) {
      throw new Error('Question IDs are required');
    }

    // Get the EXACT questions that were asked (by their IDs)
    const questions = await this.mcqRepository.getQuestionsByIds(questionIds);

    if (questions.length === 0) {
      throw new Error('No questions found');
    }

    // Validate answers length matches questions
    if (answers.length !== questions.length) {
      throw new Error(`Invalid number of answers. Expected ${questions.length}, got ${answers.length}`);
    }

    // Grade the test
    let correctAnswers = 0;
    const details = questions.map((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        correctAnswers++;
      }

      return {
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
      };
    });

    // Calculate score percentage
    const score = Math.round((correctAnswers / questions.length) * 100);
    const passingScore = skill.mcqPassingScore || 70;
    const passed = score >= passingScore;

    let attemptId = '';

    // Only save attempt and update skill if passed
    if (passed) {
      // Create attempt record for passed attempts only
      const attempt = await this.mcqRepository.createAttempt({
        skillId,
        userId,
        questionsAsked: questions.map(q => q.id),
        userAnswers: answers,
        score,
        passed,
        timeTaken,
      });
      attemptId = attempt.id;

      // Update skill to "in-review" status (waiting for admin approval)
      skill.passMCQ(score);
      await this.skillRepository.update(skill);
    }

    return {
      attemptId,
      score,
      passed,
      correctAnswers,
      totalQuestions: questions.length,
      passingScore,
      details,
    };
  }
}
