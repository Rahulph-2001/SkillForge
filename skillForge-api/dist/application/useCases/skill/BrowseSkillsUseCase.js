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
exports.BrowseSkillsUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
let BrowseSkillsUseCase = class BrowseSkillsUseCase {
    constructor(skillRepository, userRepository, availabilityRepository, browseSkillMapper) {
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
        this.availabilityRepository = availabilityRepository;
        this.browseSkillMapper = browseSkillMapper;
    }
    async execute(filters) {
        const { skills, total } = await this.skillRepository.browse(filters);
        // Collect provider IDs
        const providerIds = [...new Set(skills.map(s => s.providerId))];
        // Fetch providers
        const providers = await this.userRepository.findByIds(providerIds);
        const providersMap = new Map(providers.map(p => [p.id, p]));
        // Fetch availability
        const availabilities = await this.availabilityRepository.findByProviderIds(providerIds);
        const availabilityMap = new Map(availabilities.map(a => [a.providerId, a]));
        const skillDTOs = skills.map(skill => {
            const provider = providersMap.get(skill.providerId);
            if (!provider) {
                throw new Error(`Provider not found for skill ${skill.id}`);
            }
            const availability = availabilityMap.get(skill.providerId);
            return this.browseSkillMapper.toDTO(skill, provider, availability);
        });
        const page = filters.page || 1;
        const limit = filters.limit || 12;
        return {
            skills: skillDTOs,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
};
exports.BrowseSkillsUseCase = BrowseSkillsUseCase;
exports.BrowseSkillsUseCase = BrowseSkillsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ISkillRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IAvailabilityRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IBrowseSkillMapper)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], BrowseSkillsUseCase);
//# sourceMappingURL=BrowseSkillsUseCase.js.map