import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ITemplateQuestionRepository } from '../../../domain/repositories/ITemplateQuestionRepository';
import { ISkillTemplateRepository } from '../../../domain/repositories/ISkillTemplateRepository';
import { TemplateQuestion } from '../../../domain/entities/TemplateQuestion';

@injectable()
export class MCQTestController {
  constructor(
    @inject(TYPES.ITemplateQuestionRepository)
    private readonly templateQuestionRepository: ITemplateQuestionRepository,
    @inject(TYPES.ISkillTemplateRepository)
    private readonly skillTemplateRepository: ISkillTemplateRepository
  ) {}

  
  async getTest(req: Request, res: Response): Promise<void> {
    try {
      const { templateId, level } = req.params;

      // Validate template exists
      const template = await this.skillTemplateRepository.findById(templateId);
      if (!template) {
        res.status(404).json({
          success: false,
          message: 'Skill template not found',
        });
        return;
      }

      // Check if template is active
      if (template.status !== 'Active') {
        res.status(400).json({
          success: false,
          message: 'This skill template is not currently available',
        });
        return;
      }

      // Check if level is valid for this template
      if (!template.levels.includes(level)) {
        res.status(400).json({
          success: false,
          message: 'Invalid level for this skill template',
        });
        return;
      }

      // Get questions for this template and level
      const allQuestions = await this.templateQuestionRepository.findByTemplateIdAndLevel(
        templateId,
        level
      );

      // Filter only active questions
      const activeQuestions = allQuestions.filter((q: TemplateQuestion) => q.isActive);

      if (activeQuestions.length === 0) {
        res.status(404).json({
          success: false,
          message: 'No questions available for this test',
        });
        return;
      }

      // Shuffle and limit questions to mcqCount
      const shuffled = activeQuestions.sort(() => Math.random() - 0.5);
      const selectedQuestions = shuffled.slice(0, template.mcqCount);

      // Remove correct answers from response
      const questionsForTest = selectedQuestions.map((q: TemplateQuestion) => ({
        id: q.id,
        question: q.question,
        options: q.options,
      }));

      res.status(200).json({
        success: true,
        message: 'Test retrieved successfully',
        data: {
          templateId: template.id,
          templateTitle: template.title,
          level,
          questions: questionsForTest,
          duration: 30, // 30 minutes
          passingScore: template.passRange,
        },
      });
    } catch (error) {
      console.error('Get test error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve test',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  
  async submitTest(req: Request, res: Response): Promise<void> {
    try {
      const { templateId, level, answers } = req.body;
      // const userId = (req as any).user?.userId;

      // Validate input
      if (!templateId || !level || !Array.isArray(answers)) {
        res.status(400).json({
          success: false,
          message: 'Invalid request data',
        });
        return;
      }

      // Get template
      const template = await this.skillTemplateRepository.findById(templateId);
      if (!template) {
        res.status(404).json({
          success: false,
          message: 'Skill template not found',
        });
        return;
      }

      // Get questions
      const allQuestions = await this.templateQuestionRepository.findByTemplateIdAndLevel(
        templateId,
        level
      );

      // Calculate score
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

      // TODO: Save test result to database for history

      res.status(200).json({
        success: true,
        message: passed ? 'Congratulations! You passed the test!' : 'Test completed',
        data: {
          score,
          totalQuestions,
          correctAnswers,
          passed,
          questions: questionsWithAnswers,
        },
      });
    } catch (error) {
      console.error('Submit test error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit test',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  
  async getHistory(_req: Request, res: Response): Promise<void> {
    try {
      // const userId = (req as any).user?.userId;

      
      res.status(200).json({
        success: true,
        message: 'Test history retrieved successfully',
        data: [],
      });
    } catch (error) {
      console.error('Get history error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve test history',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
