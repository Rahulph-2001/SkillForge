"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationBindings = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../types");
const NotificationRepository_1 = require("../../database/repositories/NotificationRepository");
const NotificationService_1 = require("../../services/NotificationService");
const AdminNotificationService_1 = require("../../services/AdminNotificationService");
const NotificationMapper_1 = require("../../../application/mappers/NotificationMapper");
const GetNotificationsUseCase_1 = require("../../../application/useCases/notification/GetNotificationsUseCase");
const MarkNotificationAsReadUseCase_1 = require("../../../application/useCases/notification/MarkNotificationAsReadUseCase");
const MarkAllNotificationsAsReadUseCase_1 = require("../../../application/useCases/notification/MarkAllNotificationsAsReadUseCase");
const GetUnreadCountUseCase_1 = require("../../../application/useCases/notification/GetUnreadCountUseCase");
const DeleteNotificationUseCase_1 = require("../../../application/useCases/notification/DeleteNotificationUseCase");
const NotificationController_1 = require("../../../presentation/controllers/notification/NotificationController");
const notificationRoutes_1 = require("../../../presentation/routes/notification/notificationRoutes");
exports.notificationBindings = new inversify_1.ContainerModule((bind) => {
    bind(types_1.TYPES.INotificationRepository)
        .to(NotificationRepository_1.NotificationRepository).inSingletonScope();
    bind(types_1.TYPES.INotificationService)
        .to(NotificationService_1.NotificationService).inSingletonScope();
    bind(types_1.TYPES.IAdminNotificationService)
        .to(AdminNotificationService_1.AdminNotificationService).inSingletonScope();
    bind(types_1.TYPES.INotificationMapper)
        .to(NotificationMapper_1.NotificationMapper).inSingletonScope();
    bind(types_1.TYPES.IGetNotificationsUseCase)
        .to(GetNotificationsUseCase_1.GetNotificationsUseCase).inSingletonScope();
    bind(types_1.TYPES.IMarkNotificationAsReadUseCase)
        .to(MarkNotificationAsReadUseCase_1.MarkNotificationAsReadUseCase).inSingletonScope();
    bind(types_1.TYPES.IMarkAllNotificationsAsReadUseCase)
        .to(MarkAllNotificationsAsReadUseCase_1.MarkAllNotificationsAsReadUseCase).inSingletonScope();
    bind(types_1.TYPES.IGetUnreadCountUseCase)
        .to(GetUnreadCountUseCase_1.GetUnreadCountUseCase).inSingletonScope();
    bind(types_1.TYPES.IDeleteNotificationUseCase)
        .to(DeleteNotificationUseCase_1.DeleteNotificationUseCase).inSingletonScope();
    bind(types_1.TYPES.NotificationController)
        .to(NotificationController_1.NotificationController).inSingletonScope();
    bind(types_1.TYPES.NotificationRoutes)
        .to(notificationRoutes_1.NotificationRoutes).inSingletonScope();
});
//# sourceMappingURL=notification.bindings.js.map