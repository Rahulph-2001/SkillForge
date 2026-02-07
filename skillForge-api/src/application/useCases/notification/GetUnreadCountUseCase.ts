import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/di/types";
import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";
import { IGetUnreadCountUseCase } from "./interfaces/IGetUnreadCountUseCase";

@injectable()
export class GetUnreadCountUseCase implements IGetUnreadCountUseCase {
    constructor(
        @inject(TYPES.INotificationRepository) private readonly notificationRepository: INotificationRepository
    ) { }

    async execute(userId: string): Promise<{ count: number }> {
        const count = await this.notificationRepository.getUnreadCount(userId);
        return { count }
    }
}