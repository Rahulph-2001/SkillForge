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
exports.ToggleSkillBlockUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const Skill_1 = require("../../../domain/entities/Skill");
const AppError_1 = require("../../../domain/errors/AppError");
let ToggleSkillBlockUseCase = class ToggleSkillBlockUseCase {
    constructor(skillRepository) {
        this.skillRepository = skillRepository;
    }
    async execute(skillId, providerId) {
        const skill = await this.skillRepository.findById(skillId);
        if (!skill) {
            throw new AppError_1.NotFoundError('Skill not found');
        }
        if (skill.providerId !== providerId) {
            throw new AppError_1.ForbiddenError('You are not authorized to modify this skill');
        }
        if (skill.isAdminBlocked) {
            throw new AppError_1.ForbiddenError('This skill has been blocked by an admin and cannot be modified');
        }
        const isBlocked = !skill.isBlocked;
        const updatedSkill = new Skill_1.Skill({
            ...skill.toJSON(),
            isBlocked: isBlocked,
            blockedReason: isBlocked ? 'Blocked by provider' : null,
            blockedAt: isBlocked ? new Date() : null,
            updatedAt: new Date()
        });
        return this.skillRepository.update(updatedSkill);
    }
};
exports.ToggleSkillBlockUseCase = ToggleSkillBlockUseCase;
exports.ToggleSkillBlockUseCase = ToggleSkillBlockUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ISkillRepository)),
    __metadata("design:paramtypes", [Object])
], ToggleSkillBlockUseCase);
//# sourceMappingURL=ToggleSkillBlockUseCase.js.map