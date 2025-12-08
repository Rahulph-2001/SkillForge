import { injectable, inject } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { TYPES } from '../../di/types';
import { IMCQRepository } from '../../../domain/repositories/IMCQRepository';
import { MCQAttempt, MCQQuestion } from '../../../domain/entities/MCQAttempt';

@injectable()
export class MCQRepository implements IMCQRepository {
  constructor(
    @inject(TYPES.PrismaClient) private prisma: PrismaClient
  ) { }

  async getQuestionsByTemplate(
    templateId: string,
    level: string,
    limit: number
  ): Promise<MCQQuestion[]> {
    // Fetch all available questions for the template and level
    const allQuestions = await this.prisma.templateQuestion.findMany({
      where: {
        templateId,
        level: { equals: level, mode: 'insensitive' },
        isActive: true,
      },
    });

    // If we have fewer questions than requested, return all
    if (allQuestions.length <= limit) {
      return allQuestions.map(this.toDomainQuestion);
    }

    // Randomly shuffle and select 'limit' number of questions
    const shuffled = this.shuffleArray([...allQuestions]);
    const selectedQuestions = shuffled.slice(0, limit);

    return selectedQuestions.map(this.toDomainQuestion);
  }

  // Fisher-Yates shuffle algorithm for random question selection
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  async getQuestionById(id: string): Promise<MCQQuestion | null> {
    const question = await this.prisma.templateQuestion.findUnique({
      where: { id },
    });

    return question ? this.toDomainQuestion(question) : null;
  }

  async getQuestionsByIds(ids: string[]): Promise<MCQQuestion[]> {
    const questions = await this.prisma.templateQuestion.findMany({
      where: {
        id: { in: ids },
        isActive: true,
      },
    });

    // Maintain the order of the input IDs
    const orderedQuestions = ids
      .map(id => questions.find(q => q.id === id))
      .filter((q): q is any => q !== undefined);

    return orderedQuestions.map(this.toDomainQuestion);
  }

  async createAttempt(
    data: Omit<MCQAttempt, 'id' | 'attemptedAt'>
  ): Promise<MCQAttempt> {
    const attempt = await this.prisma.skillVerificationAttempt.create({
      data: {
        skillId: data.skillId,
        userId: data.userId,
        questionsAsked: data.questionsAsked,
        userAnswers: data.userAnswers,
        score: data.score,
        passed: data.passed,
        timeTaken: data.timeTaken,
      },
    });

    return this.toDomainAttempt(attempt);
  }

  async getAttemptsBySkill(skillId: string): Promise<MCQAttempt[]> {
    const attempts = await this.prisma.skillVerificationAttempt.findMany({
      where: { skillId },
      orderBy: { attemptedAt: 'desc' },
    });

    return attempts.map(this.toDomainAttempt);
  }

  async getAttemptsByUser(userId: string): Promise<MCQAttempt[]> {
    const attempts = await this.prisma.skillVerificationAttempt.findMany({
      where: { userId },
      orderBy: { attemptedAt: 'desc' },
    });

    return attempts.map(this.toDomainAttempt);
  }

  async getLatestAttempt(
    skillId: string,
    userId: string
  ): Promise<MCQAttempt | null> {
    const attempt = await this.prisma.skillVerificationAttempt.findFirst({
      where: {
        skillId,
        userId,
      },
      orderBy: { attemptedAt: 'desc' },
    });

    return attempt ? this.toDomainAttempt(attempt) : null;
  }

  private toDomainQuestion(question: any): MCQQuestion {
    return {
      id: question.id,
      templateId: question.templateId,
      level: question.level,
      question: question.question,
      options: question.options as string[],
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      isActive: question.isActive,
    };
  }

  private toDomainAttempt(attempt: any): MCQAttempt {
    return {
      id: attempt.id,
      skillId: attempt.skillId,
      userId: attempt.userId,
      questionsAsked: attempt.questionsAsked as string[],
      userAnswers: attempt.userAnswers as number[],
      score: attempt.score,
      passed: attempt.passed,
      timeTaken: attempt.timeTaken,
      attemptedAt: attempt.attemptedAt,
    };
  }
}
