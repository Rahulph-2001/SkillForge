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
    constructor(listUsersUseCase, suspendUserUseCase, unsuspendUserUseCase, listCommunitiesUseCase, updateCommunityUseCase, blockCommunityUseCase, unblockCommunityUseCase, responseBuilder, getDashboardStatsUseCase) {
        this.listUsersUseCase = listUsersUseCase;
        this.suspendUserUseCase = suspendUserUseCase;
        this.unsuspendUserUseCase = unsuspendUserUseCase;
        this.listCommunitiesUseCase = listCommunitiesUseCase;
        this.updateCommunityUseCase = updateCommunityUseCase;
        this.blockCommunityUseCase = blockCommunityUseCase;
        this.unblockCommunityUseCase = unblockCommunityUseCase;
        this.responseBuilder = responseBuilder;
        this.getDashboardStatsUseCase = getDashboardStatsUseCase;
        this.getDashboardStats = async (req, res, next) => {
            try {
                const adminUserId = req.user.userId;
                const result = await this.getDashboardStatsUseCase.execute(adminUserId);
                const response = this.responseBuilder.success(result, messages_1.SUCCESS_MESSAGES.ADMIN.DASHBOARD_STATS_FETCHED);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
    }
    async listUsers(req, res, next) {
        try {
            const adminUserId = req.user.userId;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 20;
            const search = req.query.search;
            const role = req.query.role;
            const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
            const result = await this.listUsersUseCase.execute({
                adminUserId,
                page,
                limit,
                search,
                role,
                isActive
            });
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
            // Support both 'targetUserId' and 'userId' from frontend
            const { targetUserId, userId, reason, duration } = req.body;
            const userToSuspend = targetUserId || userId;
            const result = await this.suspendUserUseCase.execute({
                adminUserId,
                targetUserId: userToSuspend,
                reason,
                duration
            });
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
            // Support both 'targetUserId' and 'userId' from frontend
            const { targetUserId, userId } = req.body;
            const userToUnsuspend = targetUserId || userId;
            const result = await this.unsuspendUserUseCase.execute({
                adminUserId,
                targetUserId: userToUnsuspend,
                reason: '' // Required by DTO but not used for unsuspend
            });
            const response = this.responseBuilder.success({ message: result.message }, result.message);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    async listCommunities(req, res, next) {
        try {
            const adminUserId = req.user.userId;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 20;
            const search = req.query.search;
            const category = req.query.category;
            const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
            const result = await this.listCommunitiesUseCase.execute({
                adminUserId,
                page,
                limit,
                search,
                category,
                isActive
            });
            const response = this.responseBuilder.success(result, 'Communities retrieved successfully');
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    async updateCommunity(req, res, next) {
        try {
            const adminUserId = req.user.userId;
            const communityId = req.params.id;
            const { name, description, category, creditsCost, creditsPeriod, isActive } = req.body;
            const result = await this.updateCommunityUseCase.execute({
                adminUserId,
                communityId,
                name,
                description,
                category,
                creditsCost,
                creditsPeriod,
                isActive
            });
            const response = this.responseBuilder.success(result, 'Community updated successfully');
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    async blockCommunity(req, res, next) {
        try {
            const adminUserId = req.user.userId;
            const communityId = req.params.id;
            const { reason } = req.body;
            const result = await this.blockCommunityUseCase.execute({
                adminUserId,
                communityId,
                reason
            });
            const response = this.responseBuilder.success(result, result.message);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    async unblockCommunity(req, res, next) {
        try {
            const adminUserId = req.user.userId;
            const communityId = req.params.id;
            const { reason } = req.body;
            const result = await this.unblockCommunityUseCase.execute({
                adminUserId,
                communityId,
                reason
            });
            const response = this.responseBuilder.success(result, result.message);
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
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IListUsersUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ISuspendUserUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IUnsuspendUserUseCase)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IListCommunitiesUseCase)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IUpdateCommunityByAdminUseCase)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.IBlockCommunityUseCase)),
    __param(6, (0, inversify_1.inject)(types_1.TYPES.IUnblockCommunityUseCase)),
    __param(7, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __param(8, (0, inversify_1.inject)(types_1.TYPES.IGetAdminDashboardStatsUseCase)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object])
], AdminController);
//# sourceMappingURL=AdminController.js.map