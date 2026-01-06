export interface IBulkDeleteTemplateQuestionsUseCase {
  execute(templateId: string, questionIds: string[]): Promise<{ deletedCount: number }>;
}

