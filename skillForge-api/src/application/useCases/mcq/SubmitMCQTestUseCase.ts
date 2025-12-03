import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IMCQRepository } from '../../../domain/repositories/IMCQRepository';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { MCQSubmission, MCQResult } from '../../../domain/entities/MCQAttempt';
import { PrismaClient } from '@prisma/client';

@injectable()
export class SubmitMCQTestUseCase {
  constructor(
    @inject(TYPES.IMCQRepository) private mcqRepository: IMCQRepository,
    @inject(TYPES.ISkillRepository) private skillRepository: ISkillRepository,
    @inject(TYPES.PrismaClient) private prisma: PrismaClient
  ) {}

  async execute(submission: MCQSubmission): Promise<MCQResult> {
    // Get skill details
    const skill = await this.skillRepository.findById(submission.skillId);
    if (!skill) {
      throw new Error('Skill not found');
    }

    // Verify skill belongs to user
    if (skill.providerId !== submission.userId) {
      throw new Error('Unauthorized: This skill does not belong to you');
    }

    // Validate question IDs are provided
    if (!submission.questionIds || submission.questionIds.length === 0) {
      throw new Error('Question IDs are required');
    }

    // Get the EXACT questions that were asked (by their IDs)
    const questions = await this.mcqRepository.getQuestionsByIds(submission.questionIds);

    if (questions.length === 0) {
      throw new Error('No questions found');
    }

    // Validate answers length matches questions
    if (submission.answers.length !== questions.length) {
      throw new Error(`Invalid number of answers. Expected ${questions.length}, got ${submission.answers.length}`);
    }

    console.log(` [SubmitMCQTestUseCase] Validating answers for ${questions.length} questions`);
    console.log(` [SubmitMCQTestUseCase] Question IDs: ${submission.questionIds.join(', ')}`);
    console.log(` [SubmitMCQTestUseCase] User answers: ${submission.answers.join(', ')}`);

    // Grade the test
    let correctAnswers = 0;
    const details = questions.map((question, index) => {
      const userAnswer = submission.answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        correctAnswers++;
      }

      console.log(`  Q${index + 1}: User answered ${userAnswer}, Correct: ${question.correctAnswer} - ${isCorrect ? '✅ Correct' : '❌ Wrong'}`);

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

    console.log(`📊 [SubmitMCQTestUseCase] Score: ${score}%, Passing: ${passingScore}%, Passed: ${passed}`);

    // Only save attempt and update skill if passed
    if (passed) {
      // Create attempt record for passed attempts only
      const attempt = await this.mcqRepository.createAttempt({
        skillId: submission.skillId,
        userId: submission.userId,
        questionsAsked: questions.map(q => q.id),
        userAnswers: submission.answers,
        score,
        passed,
        timeTaken: submission.timeTaken,
      });

      // Update skill to "in-review" status (waiting for admin approval)
      await this.prisma.skill.update({
        where: { id: submission.skillId },
        data: {
          verificationStatus: 'passed',
          mcqScore: score,
          status: 'in-review', // Move to in-review for admin approval
          verifiedAt: new Date(),
        },
      });

      console.log(`✅ [SubmitMCQTestUseCase] Passed! Skill moved to in-review. Attempt ID: ${attempt.id}`);

      return {
        attemptId: attempt.id,
        score,
        passed,
        correctAnswers,
        totalQuestions: questions.length,
        passingScore,
        details,
      };
    } else {
      // Failed - don't save attempt, don't update skill, just return results
      console.log(`❌ [SubmitMCQTestUseCase] Failed! No record saved. User can retake.`);

      return {
        attemptId: '', // No attempt ID for failed tests
        score,
        passed,
        correctAnswers,
        totalQuestions: questions.length,
        passingScore,
        details,
      };
    }
  }
}
