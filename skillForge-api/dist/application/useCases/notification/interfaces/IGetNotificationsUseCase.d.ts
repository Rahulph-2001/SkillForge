import { ListNotificationsQueryDTO, ListNotificationsResponseDTO } from "../../../dto/notification/ListNotificationsDTO";
export interface IGetNotificationUseCase {
    execute(userId: string, query: ListNotificationsQueryDTO): Promise<ListNotificationsResponseDTO>;
}
//# sourceMappingURL=IGetNotificationsUseCase.d.ts.map