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
exports.ListPendingSkillsUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
let ListPendingSkillsUseCase = class ListPendingSkillsUseCase {
    constructor(skillRepository, userRepository, pendingSkillMapper) {
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
        this.pendingSkillMapper = pendingSkillMapper;
    }
    async execute() {
        // Get all skills that passed MCQ and are waiting for admin approval
        const skills = await this.skillRepository.findPending();
        const dtos = await Promise.all(skills.map(async (skill) => {
            const provider = await this.userRepository.findById(skill.providerId);
            if (!provider) {
                // Log error or handle gracefully. For strictness, we assume provider exists.
                throw new Error(`Provider ${skill.providerId} not found for skill ${skill.id}`);
            }
            return this.pendingSkillMapper.toDTO(skill, provider);
        }));
        return dtos;
    }
};
exports.ListPendingSkillsUseCase = ListPendingSkillsUseCase;
exports.ListPendingSkillsUseCase = ListPendingSkillsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ISkillRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IPendingSkillMapper)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ListPendingSkillsUseCase);
//# sourceMappingURL=ListPendingSkillsUseCase.js.map