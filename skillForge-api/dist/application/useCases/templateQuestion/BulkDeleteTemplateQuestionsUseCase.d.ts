import { ITemplateQuestionRepository } from '../../../domain/repositories/ITemplateQuestionRepository';
import { IBulkDeleteTemplateQuestionsUseCase } from './interfaces/IBulkDeleteTemplateQuestionsUseCase';
export declare class BulkDeleteTemplateQuestionsUseCase implements IBulkDeleteTemplateQuestionsUseCase {
    private questionRepository;
    constructor(questionRepository: ITemplateQuestionRepository);
    execute(templateId: string, questionIds: string[]): Promise<{
        deletedCount: number;
    }>;
}
//# sourceMappingURL=BulkDeleteTemplateQuestionsUseCase.d.ts.map