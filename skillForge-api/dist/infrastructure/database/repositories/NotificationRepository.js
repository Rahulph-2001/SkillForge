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
exports.NotificationRepository = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../di/types");
const Database_1 = require("../Database");
const Notification_1 = require("../../../domain/entities/Notification");
let NotificationRepository = class NotificationRepository {
    constructor(db) {
        this.db = db;
    }
    get prisma() {
        return this.db.getClient();
    }
    async create(notification) {
        const data = notification.toJSON();
        const created = await this.prisma.notification.create({
            data: {
                id: data.id,
                userId: data.userId,
                type: data.type,
                title: data.title,
                message: data.message,
                data: data.data,
                isRead: data.isRead,
                readAt: data.readAt,
                createdAt: data.createdAt,
            },
        });
        return Notification_1.Notification.fromDatabaseRow(created);
    }
    async findById(id) {
        const notification = await this.prisma.notification.findUnique({
            where: { id },
        });
        return notification ? Notification_1.Notification.fromDatabaseRow(notification) : null;
    }
    async findByUserId(userId, filters) {
        const page = filters?.page || 1;
        const limit = filters?.limit || 20;
        const skip = (page - 1) * limit;
        const where = { userId };
        if (filters?.isRead !== undefined) {
            where.isRead = filters.isRead;
        }
        const [notifications, total] = await Promise.all([
            this.prisma.notification.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.notification.count({ where }),
        ]);
        return {
            notifications: notifications.map(n => Notification_1.Notification.fromDatabaseRow(n)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async markAsRead(id) {
        const updated = await this.prisma.notification.update({
            where: { id },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
        return Notification_1.Notification.fromDatabaseRow(updated);
    }
    async markAllAsRead(userId) {
        await this.prisma.notification.updateMany({
            where: {
                userId,
                isRead: false,
            },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
    }
    async getUnreadCount(userId) {
        return this.prisma.notification.count({
            where: {
                userId,
                isRead: false,
            },
        });
    }
    async delete(id) {
        await this.prisma.notification.delete({
            where: { id },
        });
    }
};
exports.NotificationRepository = NotificationRepository;
exports.NotificationRepository = NotificationRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __metadata("design:paramtypes", [Database_1.Database])
], NotificationRepository);
//# sourceMappingURL=NotificationRepository.js.map