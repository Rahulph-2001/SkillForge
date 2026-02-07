
export interface IDeleteNotificationUseCase {
    execute(userId: string, notificationId: string): Promise<void>
}