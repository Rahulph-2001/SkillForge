export interface IDeleteMessageUseCase {
  execute(userId: string, messageId: string): Promise<void>;
}

