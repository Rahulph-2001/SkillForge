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
exports.AdminListSkillsUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AdminListSkillsRequestDTO_1 = require("../../dto/admin/AdminListSkillsRequestDTO");
const AppError_1 = require("../../../domain/errors/AppError");
const UserRole_1 = require("../../../domain/enums/UserRole");
const messages_1 = require("../../../config/messages");
let AdminListSkillsUseCase = class AdminListSkillsUseCase {
    constructor(userRepository, skillRepository, adminSkillMapper) {
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.adminSkillMapper = adminSkillMapper;
    }
    async execute(request) {
        // Validate request
        const validatedRequest = AdminListSkillsRequestDTO_1.AdminListSkillsRequestSchema.parse(request);
        // Verify admin user
        const adminUser = await this.userRepository.findById(validatedRequest.adminUserId);
        if (!adminUser || adminUser.role !== UserRole_1.UserRole.ADMIN) {
            throw new AppError_1.ForbiddenError(messages_1.ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
        }
        // Get paginated skills from repository
        const result = await this.skillRepository.findAllAdminWithPagination({
            page: validatedRequest.page,
            limit: validatedRequest.limit,
            search: validatedRequest.search,
            status: validatedRequest.status,
            isBlocked: validatedRequest.isBlocked,
        });
        // Get unique provider IDs
        const providerIds = [...new Set(result.skills.map(s => s.providerId))];
        const providers = await this.userRepository.findByIds(providerIds);
        const providersMap = new Map(providers.map(p => [p.id, p]));
        // Map to DTOs
        const skillDTOs = result.skills.map(skill => {
            const provider = providersMap.get(skill.providerId);
            if (!provider) {
                throw new Error(`Provider not found for skill ${skill.id}`);
            }
            return this.adminSkillMapper.toDTO(skill, provider);
        });
        return {
            skills: skillDTOs,
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
            hasNextPage: result.page < result.totalPages,
            hasPreviousPage: result.page > 1,
        };
    }
};
exports.AdminListSkillsUseCase = AdminListSkillsUseCase;
exports.AdminListSkillsUseCase = AdminListSkillsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ISkillRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IAdminSkillMapper)),
    __metadata("design:paramtypes", [Object, Object, Object])
], AdminListSkillsUseCase);
//# sourceMappingURL=AdminListSkillsUseCase.js.map