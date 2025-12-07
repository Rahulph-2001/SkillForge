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
exports.ListUserSkillsUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
let ListUserSkillsUseCase = class ListUserSkillsUseCase {
    constructor(skillRepository, skillMapper) {
        this.skillRepository = skillRepository;
        this.skillMapper = skillMapper;
    }
    async execute(userId) {
        const skills = await this.skillRepository.findByProviderId(userId);
        return skills.map(skill => this.skillMapper.toResponseDTO(skill));
    }
};
exports.ListUserSkillsUseCase = ListUserSkillsUseCase;
exports.ListUserSkillsUseCase = ListUserSkillsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ISkillRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ISkillMapper)),
    __metadata("design:paramtypes", [Object, Object])
], ListUserSkillsUseCase);
//# sourceMappingURL=ListUserSkillsUseCase.js.map