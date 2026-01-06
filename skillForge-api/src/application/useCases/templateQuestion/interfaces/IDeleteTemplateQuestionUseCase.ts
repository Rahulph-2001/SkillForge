export interface IDeleteTemplateQuestionUseCase {
  execute(adminUserId: string, questionId: string): Promise<void>;
}

