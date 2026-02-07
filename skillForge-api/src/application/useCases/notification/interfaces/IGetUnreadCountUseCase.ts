export interface IGetUnreadCountUseCase {
  execute(userId: string): Promise<{ count: number }>;
}