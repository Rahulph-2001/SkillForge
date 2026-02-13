import { ContainerModule } from "inversify";
import { TYPES } from "../types";
import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";
import { NotificationRepository } from "../../database/repositories/NotificationRepository";
import { INotificationService } from "../../../domain/services/INotificationService";
import { NotificationService } from "../../services/NotificationService";
import { IAdminNotificationService } from "../../../domain/services/IAdminNotificationService";
import { AdminNotificationService } from "../../services/AdminNotificationService";
import { INotificationMapper } from "../../../application/mappers/interfaces/INotificationMapper";
import { NotificationMapper } from "../../../application/mappers/NotificationMapper";
import { IGetNotificationUseCase } from "../../../application/useCases/notification/interfaces/IGetNotificationsUseCase";
import { GetNotificationsUseCase } from "../../../application/useCases/notification/GetNotificationsUseCase";
import { MarkNotificationAsReadUseCase } from "../../../application/useCases/notification/MarkNotificationAsReadUseCase";
import { IMarkNotificationAsReadUseCase } from "../../../application/useCases/notification/interfaces/IMarkNotificationAsReadUseCase";
import { IMarkAllNotificationsAsReadUseCase } from "../../../application/useCases/notification/interfaces/IMarkAllNotificationsAsReadUseCase";
import { MarkAllNotificationsAsReadUseCase } from "../../../application/useCases/notification/MarkAllNotificationsAsReadUseCase";
import { IGetUnreadCountUseCase } from "../../../application/useCases/notification/interfaces/IGetUnreadCountUseCase";
import { GetUnreadCountUseCase } from "../../../application/useCases/notification/GetUnreadCountUseCase";
import { IDeleteNotificationUseCase } from "../../../application/useCases/notification/interfaces/IDeleteNotificationUseCase";
import { DeleteNotificationUseCase } from "../../../application/useCases/notification/DeleteNotificationUseCase";
import { NotificationController } from "../../../presentation/controllers/notification/NotificationController";
import { NotificationRoutes } from "../../../presentation/routes/notification/notificationRoutes";

export const notificationBindings = new ContainerModule((bind) => {
  bind<INotificationRepository>(TYPES.INotificationRepository)
    .to(NotificationRepository).inSingletonScope();
  bind<INotificationService>(TYPES.INotificationService)
    .to(NotificationService).inSingletonScope();
  bind<IAdminNotificationService>(TYPES.IAdminNotificationService)
    .to(AdminNotificationService).inSingletonScope();
  bind<INotificationMapper>(TYPES.INotificationMapper)
    .to(NotificationMapper).inSingletonScope();
  bind<IGetNotificationUseCase>(TYPES.IGetNotificationsUseCase)
    .to(GetNotificationsUseCase).inSingletonScope();
  bind<IMarkNotificationAsReadUseCase>(TYPES.IMarkNotificationAsReadUseCase)
    .to(MarkNotificationAsReadUseCase).inSingletonScope();
  bind<IMarkAllNotificationsAsReadUseCase>(TYPES.IMarkAllNotificationsAsReadUseCase)
    .to(MarkAllNotificationsAsReadUseCase).inSingletonScope();
  bind<IGetUnreadCountUseCase>(TYPES.IGetUnreadCountUseCase)
    .to(GetUnreadCountUseCase).inSingletonScope();
  bind<IDeleteNotificationUseCase>(TYPES.IDeleteNotificationUseCase)
    .to(DeleteNotificationUseCase).inSingletonScope();
  bind<NotificationController>(TYPES.NotificationController)
    .to(NotificationController).inSingletonScope();
  bind<NotificationRoutes>(TYPES.NotificationRoutes)
    .to(NotificationRoutes).inSingletonScope();
});