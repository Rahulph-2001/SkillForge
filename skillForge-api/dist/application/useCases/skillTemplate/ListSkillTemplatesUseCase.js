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
exports.ListSkillTemplatesUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const UserRole_1 = require("../../../domain/enums/UserRole");
let ListSkillTemplatesUseCase = class ListSkillTemplatesUseCase {
    constructor(skillTemplateRepository, userRepository, paginationService) {
        this.skillTemplateRepository = skillTemplateRepository;
        this.userRepository = userRepository;
        this.paginationService = paginationService;
    }
    async execute(adminUserId, page = 1, limit = 10, search, category, status) {
        // Verify admin
        const admin = await this.userRepository.findById(adminUserId);
        if (!admin || admin.role !== UserRole_1.UserRole.ADMIN) {
            throw new AppError_1.UnauthorizedError('Only admins can view skill templates');
        }
        const paginationParams = this.paginationService.createParams(page, limit);
        const { templates, total } = await this.skillTemplateRepository.findWithPagination({ search, category, status }, paginationParams);
        const paginationResult = this.paginationService.createResult(templates, total, page, limit);
        return {
            templates,
            pagination: {
                total: paginationResult.total,
                page: paginationResult.page,
                limit: paginationResult.limit,
                totalPages: paginationResult.totalPages,
                hasNextPage: paginationResult.hasNextPage,
                hasPreviousPage: paginationResult.hasPreviousPage,
            },
        };
    }
    async executePublic() {
        return await this.skillTemplateRepository.findByStatus('Active');
    }
};
exports.ListSkillTemplatesUseCase = ListSkillTemplatesUseCase;
exports.ListSkillTemplatesUseCase = ListSkillTemplatesUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ISkillTemplateRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IPaginationService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ListSkillTemplatesUseCase);
//# sourceMappingURL=ListSkillTemplatesUseCase.js.map