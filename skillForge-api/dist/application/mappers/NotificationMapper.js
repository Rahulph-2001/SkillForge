"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationMapper = void 0;
const inversify_1 = require("inversify");
let NotificationMapper = class NotificationMapper {
    toDTO(notification) {
        return {
            id: notification.id,
            userId: notification.userId,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            data: notification.data,
            isRead: notification.isRead,
            readAt: notification.readAt,
            createdAt: notification.createdAt,
        };
    }
    toDTOList(notifications) {
        return notifications.map(n => this.toDTO(n));
    }
};
exports.NotificationMapper = NotificationMapper;
exports.NotificationMapper = NotificationMapper = __decorate([
    (0, inversify_1.injectable)()
], NotificationMapper);
//# sourceMappingURL=NotificationMapper.js.map