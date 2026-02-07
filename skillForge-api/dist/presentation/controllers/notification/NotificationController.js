"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const messages_1 = require("../../../config/messages");
const HttpStatusCode_1 = require("../../../domain/enums/HttpStatusCode");
const ListNotificationsDTO_1 = require("../../../application/dto/notification/ListNotificationsDTO");
let NotificationController = class NotificationController {
    constructor(getNotificationsUseCase, markAsReadUseCase, markAllAsReadUseCase, getUnreadCountUseCase, deleteNotificationUseCase, responseBuilder) {
        this.getNotificationsUseCase = getNotificationsUseCase;
        this.markAsReadUseCase = markAsReadUseCase;
        this.markAllAsReadUseCase = markAllAsReadUseCase;
        this.getUnreadCountUseCase = getUnreadCountUseCase;
        this.deleteNotificationUseCase = deleteNotificationUseCase;
        this.responseBuilder = responseBuilder;
        this.getNotifications = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const query = ListNotificationsDTO_1.ListNotificationsQuerySchema.parse(req.query);
                const result = await this.getNotificationsUseCase.execute(userId, query);
                const response = this.responseBuilder.success(result, messages_1.SUCCESS_MESSAGES.NOTIFICATION.FETCHED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.getUnreadCount = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const result = await this.getUnreadCountUseCase.execute(userId);
                const response = this.responseBuilder.success(result, messages_1.SUCCESS_MESSAGES.NOTIFICATION.COUNT_FETCHED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.markAsRead = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const { id } = req.params;
                const result = await this.markAsReadUseCase.execute(userId, id);
                const response = this.responseBuilder.success(result, messages_1.SUCCESS_MESSAGES.NOTIFICATION.MARKED_READ, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.markAllAsRead = async (req, res, next) => {
            try {
                const userId = req.user.id;
                await this.markAllAsReadUseCase.execute(userId);
                const response = this.responseBuilder.success(null, messages_1.SUCCESS_MESSAGES.NOTIFICATION.ALL_MARKED_READ, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteNotification = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const { id } = req.params;
                await this.deleteNotificationUseCase.execute(userId, id);
                const response = this.responseBuilder.success(null, messages_1.SUCCESS_MESSAGES.NOTIFICATION.DELETED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
    }
};
exports.NotificationController = NotificationController;
exports.NotificationController = NotificationController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IGetNotificationsUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IMarkNotificationAsReadUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IMarkAllNotificationsAsReadUseCase)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IGetUnreadCountUseCase)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IDeleteNotificationUseCase)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], NotificationController);
//# sourceMappingURL=NotificationController.js.map