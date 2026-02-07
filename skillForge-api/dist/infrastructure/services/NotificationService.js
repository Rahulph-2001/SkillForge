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
exports.NotificationService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../di/types");
const Notification_1 = require("../../domain/entities/Notification");
let NotificationService = class NotificationService {
    constructor(notificationRepository, webSocketService) {
        this.notificationRepository = notificationRepository;
        this.webSocketService = webSocketService;
    }
    async send(params) {
        const notification = new Notification_1.Notification({
            userId: params.userId,
            type: params.type,
            title: params.title,
            message: params.message,
            data: params.data,
        });
        const saved = await this.notificationRepository.create(notification);
        this.webSocketService.sendToUser(params.userId, {
            type: 'notification_received',
            data: {
                id: saved.id,
                type: saved.type,
                title: saved.title,
                message: saved.message,
                data: saved.data,
                createdAt: saved.createdAt,
            },
        });
        return saved;
    }
    async sendToMany(userIds, params) {
        await Promise.all(userIds.map(userId => this.send({
            userId,
            ...params,
        })));
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.INotificationRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IWebSocketService)),
    __metadata("design:paramtypes", [Object, Object])
], NotificationService);
//# sourceMappingURL=NotificationService.js.map