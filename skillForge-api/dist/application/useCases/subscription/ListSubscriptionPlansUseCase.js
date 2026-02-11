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
exports.ListSubscriptionPlansUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const UserRole_1 = require("../../../domain/enums/UserRole");
const messages_1 = require("../../../config/messages");
const ListSubscriptionPlansRequestDTO_1 = require("../../dto/subscription/ListSubscriptionPlansRequestDTO");
let ListSubscriptionPlansUseCase = class ListSubscriptionPlansUseCase {
    constructor(userRepository, subscriptionPlanRepository, subscriptionPlanMapper) {
        this.userRepository = userRepository;
        this.subscriptionPlanRepository = subscriptionPlanRepository;
        this.subscriptionPlanMapper = subscriptionPlanMapper;
    }
    async execute(request) {
        const validatedRequest = ListSubscriptionPlansRequestDTO_1.ListSubscriptionPlansRequestSchema.parse(request);
        const adminUser = await this.userRepository.findById(validatedRequest.adminUserId);
        if (!adminUser || adminUser.role !== UserRole_1.UserRole.ADMIN) {
            throw new AppError_1.ForbiddenError(messages_1.ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
        }
        const result = await this.subscriptionPlanRepository.findWithPagination({
            page: validatedRequest.page,
            limit: validatedRequest.limit,
            isActive: validatedRequest.isActive,
        });
        return {
            plans: result.plans.map(plan => this.subscriptionPlanMapper.toDTO(plan)),
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
            hasNextPage: result.page < result.totalPages,
            hasPreviousPage: result.page > 1,
        };
    }
};
exports.ListSubscriptionPlansUseCase = ListSubscriptionPlansUseCase;
exports.ListSubscriptionPlansUseCase = ListSubscriptionPlansUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ISubscriptionPlanRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.ISubscriptionPlanMapper)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ListSubscriptionPlansUseCase);
//# sourceMappingURL=ListSubscriptionPlansUseCase.js.map