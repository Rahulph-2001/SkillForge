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
exports.AdminNotificationService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../di/types");
let AdminNotificationService = class AdminNotificationService {
    constructor(userRepository, notificationService) {
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }
    async notifyAllAdmins(params) {
        const admins = await this.userRepository.findAllAdmins();
        if (admins.length === 0) {
            return;
        }
        await this.notificationService.sendToMany(admins.map(admin => admin.id), {
            type: params.type,
            title: params.title,
            message: params.message,
            data: params.data
        });
    }
};
exports.AdminNotificationService = AdminNotificationService;
exports.AdminNotificationService = AdminNotificationService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.INotificationService)),
    __metadata("design:paramtypes", [Object, Object])
], AdminNotificationService);
//# sourceMappingURL=AdminNotificationService.js.map