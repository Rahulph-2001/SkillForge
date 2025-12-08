import { ITemplateQuestionRepository } from '../../../domain/repositories/ITemplateQuestionRepository';
export declare class BulkDeleteTemplateQuestionsUseCase {
    private questionRepository;
    constructor(questionRepository: ITemplateQuestionRepository);
    execute(templateId: string, questionIds: string[]): Promise<{
        deletedCount: number;
    }>;
}
//# sourceMappingURL=BulkDeleteTemplateQuestionsUseCase.d.ts.map