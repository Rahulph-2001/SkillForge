import { MCQAttempt, MCQQuestion } from '../entities/MCQAttempt';

export interface IMCQRepository {
  // Question Management
  getQuestionsByTemplate(templateId: string, level: string, limit: number): Promise<MCQQuestion[]>;
  getQuestionById(id: string): Promise<MCQQuestion | null>;
  getQuestionsByIds(ids: string[]): Promise<MCQQuestion[]>;
  
  // Attempt Management
  createAttempt(attempt: Omit<MCQAttempt, 'id' | 'attemptedAt'>): Promise<MCQAttempt>;
  getAttemptsBySkill(skillId: string): Promise<MCQAttempt[]>;
  getAttemptsByUser(userId: string): Promise<MCQAttempt[]>;
  getLatestAttempt(skillId: string, userId: string): Promise<MCQAttempt | null>;
}
