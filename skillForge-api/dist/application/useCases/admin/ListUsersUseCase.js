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
exports.ListUsersUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const UserRole_1 = require("../../../domain/enums/UserRole");
const messages_1 = require("../../../config/messages");
const ListUsersRequestDTO_1 = require("../../dto/admin/ListUsersRequestDTO");
let ListUsersUseCase = class ListUsersUseCase {
    constructor(userRepository, userMapper, paginationService) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.paginationService = paginationService;
    }
    async execute(request) {
        // Validate request
        const validatedRequest = ListUsersRequestDTO_1.ListUsersRequestDTOSchema.parse(request);
        // Verify admin user
        const adminUser = await this.userRepository.findById(validatedRequest.adminUserId);
        if (!adminUser || adminUser.role !== UserRole_1.UserRole.ADMIN) {
            throw new AppError_1.ForbiddenError(messages_1.ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
        }
        // Create pagination params
        const paginationParams = this.paginationService.createParams(validatedRequest.page, validatedRequest.limit);
        // Get paginated users
        const { users, total } = await this.userRepository.findWithPagination({
            search: validatedRequest.search,
            role: validatedRequest.role,
            isActive: validatedRequest.isActive
        }, paginationParams);
        // Create pagination result
        const paginationResult = this.paginationService.createResult(users, total, validatedRequest.page, validatedRequest.limit);
        return {
            users: users.map(user => this.userMapper.toDTO(user)),
            pagination: {
                total: paginationResult.total,
                page: paginationResult.page,
                limit: paginationResult.limit,
                totalPages: paginationResult.totalPages,
                hasNextPage: paginationResult.hasNextPage,
                hasPreviousPage: paginationResult.hasPreviousPage,
            }
        };
    }
};
exports.ListUsersUseCase = ListUsersUseCase;
exports.ListUsersUseCase = ListUsersUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IAdminUserDTOMapper)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IPaginationService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ListUsersUseCase);
//# sourceMappingURL=ListUsersUseCase.js.map