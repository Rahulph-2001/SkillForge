import { injectable,inject } from "inversify";
import { TYPES } from '../../../infrastructure/di/types'
import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";
import { IMarkAllNotificationsAsReadUseCase } from "./interfaces/IMarkAllNotificationsAsReadUseCase";

@injectable()
export class MarkAllNotificationsAsReadUseCase implements IMarkAllNotificationsAsReadUseCase {
    constructor(
        @inject(TYPES.INotificationRepository) private readonly notificationRepository: INotificationRepository
    ) {}
    async execute(userId: string): Promise<void> {
        await this.notificationRepository.markAllAsRead(userId)
    }
}