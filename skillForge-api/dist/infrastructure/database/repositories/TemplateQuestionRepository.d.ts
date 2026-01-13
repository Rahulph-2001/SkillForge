import { Database } from '../Database';
import { ITemplateQuestionRepository } from '../../../domain/repositories/ITemplateQuestionRepository';
import { TemplateQuestion } from '../../../domain/entities/TemplateQuestion';
import { BaseRepository } from '../BaseRepository';
export declare class TemplateQuestionRepository extends BaseRepository<TemplateQuestion> implements ITemplateQuestionRepository {
    constructor(db: Database);
    create(question: TemplateQuestion): Promise<TemplateQuestion>;
    findById(id: string): Promise<TemplateQuestion | null>;
    findByTemplateId(templateId: string): Promise<TemplateQuestion[]>;
    findByTemplateIdAndLevel(templateId: string, level: string): Promise<TemplateQuestion[]>;
    update(id: string, data: any): Promise<TemplateQuestion>;
    delete(id: string): Promise<void>;
    bulkDelete(ids: string[]): Promise<number>;
    countByTemplateId(templateId: string): Promise<number>;
    countByTemplateIdAndLevel(templateId: string, level: string): Promise<number>;
    getRandomQuestions(templateId: string, level: string, count: number): Promise<TemplateQuestion[]>;
    createMany(questions: TemplateQuestion[]): Promise<number>;
}
//# sourceMappingURL=TemplateQuestionRepository.d.ts.map