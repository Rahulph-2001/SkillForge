import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ITemplateQuestionRepository } from '../../../domain/repositories/ITemplateQuestionRepository';
import { ISkillTemplateRepository } from '../../../domain/repositories/ISkillTemplateRepository';
import { TemplateQuestion } from '../../../domain/entities/TemplateQuestion';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../../config/messages';

@injectable()
export class MCQTestController {
  constructor(
    @inject(TYPES.ITemplateQuestionRepository)
    private readonly templateQuestionRepository: ITemplateQuestionRepository,
    @inject(TYPES.ISkillTemplateRepository)
    private readonly skillTemplateRepository: ISkillTemplateRepository,
    @inject(TYPES.IResponseBuilder)
    private readonly responseBuilder: IResponseBuilder
  ) { }

  async getTest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { templateId, level } = req.params;

      const template = await this.skillTemplateRepository.findById(templateId);
      if (!template) {
        const response = this.responseBuilder.error(
          'TEMPLATE_NOT_FOUND',
          ERROR_MESSAGES.MCQ.TEMPLATE_NOT_FOUND,
          HttpStatusCode.NOT_FOUND
        );
        res.status(response.statusCode).json(response.body);
        return;
      }

      if (template.status !== 'Active') {
        const response = this.responseBuilder.error(
          'TEMPLATE_INACTIVE',
          ERROR_MESSAGES.MCQ.TEMPLATE_INACTIVE,
          HttpStatusCode.BAD_REQUEST
        );
        res.status(response.statusCode).json(response.body);
        return;
      }

      if (!template.levels.includes(level)) {
        const response = this.responseBuilder.error(
          'INVALID_LEVEL',
          ERROR_MESSAGES.MCQ.INVALID_LEVEL,
          HttpStatusCode.BAD_REQUEST
        );
        res.status(response.statusCode).json(response.body);
        return;
      }

      const allQuestions = await this.templateQuestionRepository.findByTemplateIdAndLevel(
        templateId,
        level
      );

      const activeQuestions = allQuestions.filter((q: TemplateQuestion) => q.isActive);

      if (activeQuestions.length === 0) {
        const response = this.responseBuilder.error(
          'NO_QUESTIONS',
          ERROR_MESSAGES.MCQ.NO_QUESTIONS,
          HttpStatusCode.NOT_FOUND
        );
        res.status(response.statusCode).json(response.body);
        return;
      }

      const shuffled = activeQuestions.sort(() => Math.random() - 0.5);
      const selectedQuestions = shuffled.slice(0, template.mcqCount);

      const questionsForTest = selectedQuestions.map((q: TemplateQuestion) => ({
        id: q.id,
        question: q.question,
        options: q.options,
      }));

      const response = this.responseBuilder.success(
        {
          templateId: template.id,
          templateTitle: template.title,
          level,
          questions: questionsForTest,
          duration: 30,
          passingScore: template.passRange,
        },
        SUCCESS_MESSAGES.MCQ.TEST_FETCHED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  async submitTest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { templateId, level, answers } = req.body;

      if (!templateId || !level || !Array.isArray(answers)) {
        const response = this.responseBuilder.error(
          'INVALID_REQUEST',
          ERROR_MESSAGES.MCQ.INVALID_REQUEST,
          HttpStatusCode.BAD_REQUEST
        );
        res.status(response.statusCode).json(response.body);
        return;
      }

      const template = await this.skillTemplateRepository.findById(templateId);
      if (!template) {
        const response = this.responseBuilder.error(
          'TEMPLATE_NOT_FOUND',
          ERROR_MESSAGES.MCQ.TEMPLATE_NOT_FOUND,
          HttpStatusCode.NOT_FOUND
        );
        res.status(response.statusCode).json(response.body);
        return;
      }

      const allQuestions = await this.templateQuestionRepository.findByTemplateIdAndLevel(
        templateId,
        level
      );

      let correctAnswers = 0;
      const questionsWithAnswers = allQuestions.slice(0, answers.length).map((q: TemplateQuestion, index: number) => {
        const userAnswer = answers[index];
        const isCorrect = userAnswer === q.correctAnswer;
        if (isCorrect) correctAnswers++;

        return {
          id: q.id,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        };
      });

      const totalQuestions = answers.length;
      const score = Math.round((correctAnswers / totalQuestions) * 100);
      const passed = score >= template.passRange;

      const response = this.responseBuilder.success(
        {
          score,
          totalQuestions,
          correctAnswers,
          passed,
          questions: questionsWithAnswers,
        },
        passed ? SUCCESS_MESSAGES.MCQ.TEST_SUBMITTED_PASS : SUCCESS_MESSAGES.MCQ.TEST_SUBMITTED_FAIL,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  async getHistory(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response = this.responseBuilder.success(
        [],
        SUCCESS_MESSAGES.MCQ.HISTORY_FETCHED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }
}
