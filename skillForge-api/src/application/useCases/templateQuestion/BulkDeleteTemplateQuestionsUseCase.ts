import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ITemplateQuestionRepository } from '../../../domain/repositories/ITemplateQuestionRepository';
import { NotFoundError, ValidationError } from '../../../domain/errors/AppError';

@injectable()
export class BulkDeleteTemplateQuestionsUseCase {
    constructor(
        @inject(TYPES.ITemplateQuestionRepository)
        private questionRepository: ITemplateQuestionRepository
    ) { }

    async execute(templateId: string, questionIds: string[]): Promise<{ deletedCount: number }> {
        // Validation
        if (!questionIds || questionIds.length === 0) {
            throw new ValidationError('No question IDs provided for deletion');
        }

        if (questionIds.length > 100) {
            throw new ValidationError('Cannot delete more than 100 questions at once');
        }

        // Verify all questions belong to the template
        const questions = await this.questionRepository.findByTemplateId(templateId);
        const templateQuestionIds = new Set(questions.map(q => q.id));

        const invalidIds = questionIds.filter(id => !templateQuestionIds.has(id));
        if (invalidIds.length > 0) {
            throw new NotFoundError(`Some questions do not belong to this template: ${invalidIds.join(', ')}`);
        }

        // Perform bulk delete
        const deletedCount = await this.questionRepository.bulkDelete(questionIds);

        return { deletedCount };
    }
}
