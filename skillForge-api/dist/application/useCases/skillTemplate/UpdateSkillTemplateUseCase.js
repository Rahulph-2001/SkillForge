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
exports.UpdateSkillTemplateUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const UserRole_1 = require("../../../domain/enums/UserRole");
let UpdateSkillTemplateUseCase = class UpdateSkillTemplateUseCase {
    constructor(skillTemplateRepository, userRepository) {
        this.skillTemplateRepository = skillTemplateRepository;
        this.userRepository = userRepository;
    }
    async execute(adminUserId, dto) {
        // Verify admin
        const admin = await this.userRepository.findById(adminUserId);
        if (!admin || admin.role !== UserRole_1.UserRole.ADMIN) {
            throw new AppError_1.UnauthorizedError('Only admins can update skill templates');
        }
        const existing = await this.skillTemplateRepository.findById(dto.templateId);
        if (!existing) {
            throw new AppError_1.NotFoundError('Skill template not found');
        }
        const updates = {};
        if (dto.title)
            updates.title = dto.title;
        if (dto.category)
            updates.category = dto.category;
        if (dto.description)
            updates.description = dto.description;
        if (dto.creditsMin !== undefined)
            updates.creditsMin = dto.creditsMin;
        if (dto.creditsMax !== undefined)
            updates.creditsMax = dto.creditsMax;
        if (dto.mcqCount !== undefined)
            updates.mcqCount = dto.mcqCount;
        if (dto.passRange !== undefined)
            updates.passRange = dto.passRange;
        if (dto.levels)
            updates.levels = dto.levels;
        if (dto.tags)
            updates.tags = dto.tags;
        if (dto.status)
            updates.status = dto.status;
        return await this.skillTemplateRepository.update(dto.templateId, updates);
    }
};
exports.UpdateSkillTemplateUseCase = UpdateSkillTemplateUseCase;
exports.UpdateSkillTemplateUseCase = UpdateSkillTemplateUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ISkillTemplateRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __metadata("design:paramtypes", [Object, Object])
], UpdateSkillTemplateUseCase);
//# sourceMappingURL=UpdateSkillTemplateUseCase.js.map