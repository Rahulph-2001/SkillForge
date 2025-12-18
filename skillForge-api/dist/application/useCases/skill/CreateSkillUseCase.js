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
exports.CreateSkillUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const Skill_1 = require("../../../domain/entities/Skill");
let CreateSkillUseCase = class CreateSkillUseCase {
    constructor(skillRepository, s3Service, skillMapper) {
        this.skillRepository = skillRepository;
        this.s3Service = s3Service;
        this.skillMapper = skillMapper;
    }
    async execute(userId, data, imageFile) {
        let imageUrl = null;
        if (imageFile) {
            // Create S3 key with skills/ prefix
            const key = `skills/${Date.now()}-${imageFile.originalname}`;
            imageUrl = await this.s3Service.uploadFile(imageFile.buffer, key, imageFile.mimetype);
        }
        const skill = new Skill_1.Skill({
            providerId: userId,
            title: data.title,
            description: data.description,
            category: data.category,
            level: data.level,
            durationHours: Number(data.durationHours),
            creditsPerHour: Number(data.creditsHour),
            // Handle potential stringified array from FormData
            tags: typeof data.tags === 'string' ? JSON.parse(data.tags) : data.tags,
            imageUrl: imageUrl,
            templateId: data.templateId || null
        });
        const createdSkill = await this.skillRepository.create(skill);
        return this.skillMapper.toResponseDTO(createdSkill);
    }
};
exports.CreateSkillUseCase = CreateSkillUseCase;
exports.CreateSkillUseCase = CreateSkillUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ISkillRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IS3Service)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.ISkillMapper)),
    __metadata("design:paramtypes", [Object, Object, Object])
], CreateSkillUseCase);
//# sourceMappingURL=CreateSkillUseCase.js.map