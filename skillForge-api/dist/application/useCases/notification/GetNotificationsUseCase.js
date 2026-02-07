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
exports.GetNotificationsUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
let GetNotificationsUseCase = class GetNotificationsUseCase {
    constructor(notificationRepository, notificationMapper) {
        this.notificationRepository = notificationRepository;
        this.notificationMapper = notificationMapper;
    }
    async execute(userId, query) {
        const { page, limit, isRead } = query;
        const result = await this.notificationRepository.findByUserId(userId, {
            page,
            limit,
            isRead,
        });
        const unreadCount = await this.notificationRepository.getUnreadCount(userId);
        return {
            notifications: this.notificationMapper.toDTOList(result.notifications),
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
            unreadCount,
        };
    }
};
exports.GetNotificationsUseCase = GetNotificationsUseCase;
exports.GetNotificationsUseCase = GetNotificationsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.INotificationRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.INotificationMapper)),
    __metadata("design:paramtypes", [Object, Object])
], GetNotificationsUseCase);
//# sourceMappingURL=GetNotificationsUseCase.js.map