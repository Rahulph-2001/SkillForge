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
exports.GetSkillDetailsUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
let GetSkillDetailsUseCase = class GetSkillDetailsUseCase {
    constructor(skillRepository, userRepository, availabilityRepository, skillDetailsMapper) {
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
        this.availabilityRepository = availabilityRepository;
        this.skillDetailsMapper = skillDetailsMapper;
    }
    async execute(skillId) {
        // Fetch skill
        const skill = await this.skillRepository.findById(skillId);
        if (!skill) {
            throw new AppError_1.NotFoundError('Skill not found');
        }
        // Only show approved, verified, non-blocked, non-deleted skills
        if (skill.status !== 'approved' ||
            skill.verificationStatus !== 'passed' ||
            skill.isBlocked) {
            throw new AppError_1.NotFoundError('Skill not available');
        }
        // Fetch provider
        const provider = await this.userRepository.findById(skill.providerId);
        if (!provider) {
            throw new AppError_1.NotFoundError('Provider not found');
        }
        // Calculate provider stats from all their skills
        const providerSkills = await this.skillRepository.findByProviderId(skill.providerId);
        // Filter for valid skills for stats
        const validSkills = providerSkills.filter(s => s.status === 'approved' &&
            s.verificationStatus === 'passed' &&
            !s.isBlocked);
        const providerTotalRating = validSkills.reduce((sum, s) => sum + (s.rating || 0), 0);
        const providerAverageRating = validSkills.length > 0 ? providerTotalRating / validSkills.length : 0;
        const providerTotalSessions = validSkills.reduce((sum, s) => sum + (s.totalSessions || 0), 0);
        // Fetch availability
        const availability = await this.availabilityRepository.findByProviderId(skill.providerId);
        return this.skillDetailsMapper.toDTO(skill, provider, {
            rating: Number(providerAverageRating.toFixed(1)),
            reviewCount: providerTotalSessions
        }, availability);
    }
};
exports.GetSkillDetailsUseCase = GetSkillDetailsUseCase;
exports.GetSkillDetailsUseCase = GetSkillDetailsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ISkillRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IAvailabilityRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.ISkillDetailsMapper)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], GetSkillDetailsUseCase);
//# sourceMappingURL=GetSkillDetailsUseCase.js.map