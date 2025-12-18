import { TemplateQuestion } from '../entities/TemplateQuestion';
export interface ITemplateQuestionRepository {
    create(question: TemplateQuestion): Promise<TemplateQuestion>;
    findById(id: string): Promise<TemplateQuestion | null>;
    findByTemplateId(templateId: string): Promise<TemplateQuestion[]>;
    findByTemplateIdAndLevel(templateId: string, level: string): Promise<TemplateQuestion[]>;
    update(id: string, data: Partial<TemplateQuestion>): Promise<TemplateQuestion>;
    delete(id: string): Promise<void>;
    bulkDelete(ids: string[]): Promise<number>;
    countByTemplateId(templateId: string): Promise<number>;
    countByTemplateIdAndLevel(templateId: string, level: string): Promise<number>;
    getRandomQuestions(templateId: string, level: string, count: number): Promise<TemplateQuestion[]>;
    createMany(questions: TemplateQuestion[]): Promise<number>;
}
//# sourceMappingURL=ITemplateQuestionRepository.d.ts.map