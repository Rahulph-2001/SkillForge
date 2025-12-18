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
exports.AdminController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const messages_1 = require("../../../config/messages");
let AdminController = class AdminController {
    constructor(listUsersUseCase, suspendUserUseCase, unsuspendUserUseCase, responseBuilder) {
        this.listUsersUseCase = listUsersUseCase;
        this.suspendUserUseCase = suspendUserUseCase;
        this.unsuspendUserUseCase = unsuspendUserUseCase;
        this.responseBuilder = responseBuilder;
    }
    async listUsers(req, res, next) {
        try {
            const adminUserId = req.user.userId; // Typed via middleware
            const result = await this.listUsersUseCase.execute({ adminUserId });
            const response = this.responseBuilder.success(result, messages_1.SUCCESS_MESSAGES.AUTH.LIST_USERS_SUCCESS);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    async suspendUser(req, res, next) {
        try {
            const adminUserId = req.user.userId;
            const { userId, reason } = req.body;
            const result = await this.suspendUserUseCase.execute({ adminUserId, userId, reason });
            const response = this.responseBuilder.success({ message: result.message }, result.message);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    async unsuspendUser(req, res, next) {
        try {
            const adminUserId = req.user.userId;
            const { userId } = req.body;
            const result = await this.unsuspendUserUseCase.execute({ adminUserId, userId });
            const response = this.responseBuilder.success({ message: result.message }, result.message);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
};
exports.AdminController = AdminController;
exports.AdminController = AdminController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ListUsersUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.SuspendUserUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.UnsuspendUserUseCase)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], AdminController);
//# sourceMappingURL=AdminController.js.map