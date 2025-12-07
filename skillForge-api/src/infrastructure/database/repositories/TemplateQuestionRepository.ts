import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { Database } from '../Database';
import { ITemplateQuestionRepository } from '../../../domain/repositories/ITemplateQuestionRepository';
import { TemplateQuestion } from '../../../domain/entities/TemplateQuestion';

@injectable()
export class TemplateQuestionRepository implements ITemplateQuestionRepository {
  constructor(@inject(TYPES.Database) private readonly database: Database) { }

  async create(question: TemplateQuestion): Promise<TemplateQuestion> {
    const created = await this.database.getClient().templateQuestion.create({
      data: {
        id: question.id,
        templateId: question.templateId,
        level: question.level,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        isActive: question.isActive,
      },
    });

    return TemplateQuestion.create(
      created.id,
      created.templateId,
      created.level,
      created.question,
      created.options as string[],
      created.correctAnswer,
      created.explanation,
      created.isActive,
      created.createdAt,
      created.updatedAt
    );
  }

  async findById(id: string): Promise<TemplateQuestion | null> {
    const found = await this.database.getClient().templateQuestion.findUnique({
      where: { id },
    });

    if (!found) return null;

    return TemplateQuestion.create(
      found.id,
      found.templateId,
      found.level,
      found.question,
      found.options as string[],
      found.correctAnswer,
      found.explanation,
      found.isActive,
      found.createdAt,
      found.updatedAt
    );
  }

  async findByTemplateId(templateId: string): Promise<TemplateQuestion[]> {
    const questions = await this.database.getClient().templateQuestion.findMany({
      where: { templateId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return questions.map((q) =>
      TemplateQuestion.create(
        q.id,
        q.templateId,
        q.level,
        q.question,
        q.options as string[],
        q.correctAnswer,
        q.explanation,
        q.isActive,
        q.createdAt,
        q.updatedAt
      )
    );
  }

  async findByTemplateIdAndLevel(templateId: string, level: string): Promise<TemplateQuestion[]> {
    const questions = await this.database.getClient().templateQuestion.findMany({
      where: { templateId, level, isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return questions.map((q) =>
      TemplateQuestion.create(
        q.id,
        q.templateId,
        q.level,
        q.question,
        q.options as string[],
        q.correctAnswer,
        q.explanation,
        q.isActive,
        q.createdAt,
        q.updatedAt
      )
    );
  }

  async update(id: string, data: any): Promise<TemplateQuestion> {
    const updated = await this.database.getClient().templateQuestion.update({
      where: { id },
      data,
    });

    return TemplateQuestion.create(
      updated.id,
      updated.templateId,
      updated.level,
      updated.question,
      updated.options as string[],
      updated.correctAnswer,
      updated.explanation,
      updated.isActive,
      updated.createdAt,
      updated.updatedAt
    );
  }

  async delete(id: string): Promise<void> {
    await this.database.getClient().templateQuestion.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async bulkDelete(ids: string[]): Promise<number> {
    const result = await this.database.getClient().templateQuestion.updateMany({
      where: {
        id: { in: ids },
        isActive: true
      },
      data: { isActive: false },
    });
    return result.count;
  }

  async countByTemplateId(templateId: string): Promise<number> {
    return this.database.getClient().templateQuestion.count({
      where: { templateId, isActive: true },
    });
  }

  async countByTemplateIdAndLevel(templateId: string, level: string): Promise<number> {
    return this.database.getClient().templateQuestion.count({
      where: { templateId, level, isActive: true },
    });
  }

  async getRandomQuestions(templateId: string, level: string, count: number): Promise<TemplateQuestion[]> {
    const questions = await this.database.getClient().templateQuestion.findMany({
      where: { templateId, level, isActive: true },
    });

    // Shuffle and take 'count' questions
    const shuffled = questions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    return selected.map((q) =>
      TemplateQuestion.create(
        q.id,
        q.templateId,
        q.level,
        q.question,
        q.options as string[],
        q.correctAnswer,
        q.explanation,
        q.isActive,
        q.createdAt,
        q.updatedAt
      )
    );
  }

  async createMany(questions: TemplateQuestion[]): Promise<number> {
    const result = await this.database.getClient().templateQuestion.createMany({
      data: questions.map(q => ({
        id: q.id,
        templateId: q.templateId,
        level: q.level,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        isActive: q.isActive,
        createdAt: q.createdAt,
        updatedAt: q.updatedAt
      }))
    });
    return result.count;
  }
}
