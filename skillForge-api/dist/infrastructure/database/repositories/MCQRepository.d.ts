import { IMCQRepository } from '../../../domain/repositories/IMCQRepository';
import { MCQAttempt, MCQQuestion } from '../../../domain/entities/MCQAttempt';
import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';
export declare class MCQRepository extends BaseRepository<MCQAttempt> implements IMCQRepository {
    constructor(db: Database);
    getQuestionsByTemplate(templateId: string, level: string, limit: number): Promise<MCQQuestion[]>;
    private shuffleArray;
    getQuestionById(id: string): Promise<MCQQuestion | null>;
    getQuestionsByIds(ids: string[]): Promise<MCQQuestion[]>;
    createAttempt(data: Omit<MCQAttempt, 'id' | 'attemptedAt'>): Promise<MCQAttempt>;
    getAttemptsBySkill(skillId: string): Promise<MCQAttempt[]>;
    getAttemptsByUser(userId: string): Promise<MCQAttempt[]>;
    getLatestAttempt(skillId: string, userId: string): Promise<MCQAttempt | null>;
    private toDomainQuestion;
    private toDomainAttempt;
}
//# sourceMappingURL=MCQRepository.d.ts.map