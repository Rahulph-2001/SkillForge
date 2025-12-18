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
exports.UpdateSkillUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const Skill_1 = require("../../../domain/entities/Skill");
const AppError_1 = require("../../../domain/errors/AppError");
let UpdateSkillUseCase = class UpdateSkillUseCase {
    constructor(skillRepository, s3Service) {
        this.skillRepository = skillRepository;
        this.s3Service = s3Service;
    }
    async execute(skillId, providerId, updates, imageFile) {
        console.log('🔍 [UpdateSkillUseCase] Executing update for skill:', skillId);
        const skill = await this.skillRepository.findById(skillId);
        if (!skill) {
            throw new AppError_1.NotFoundError('Skill not found');
        }
        if (skill.providerId !== providerId) {
            throw new AppError_1.ForbiddenError('You are not authorized to update this skill');
        }
        if (skill.isAdminBlocked) {
            throw new AppError_1.ForbiddenError('This skill has been blocked by an admin and cannot be updated');
        }
        let imageUrl = updates.imageUrl;
        if (imageFile) {
            // Create S3 key with skills/ prefix
            const key = `skills/${Date.now()}-${imageFile.originalname}`;
            console.log('🔍 [UpdateSkillUseCase] Uploading new image to S3:', key);
            imageUrl = await this.s3Service.uploadFile(imageFile.buffer, key, imageFile.mimetype);
            console.log('✅ [UpdateSkillUseCase] Image uploaded successfully. URL:', imageUrl);
        }
        // Create a new Skill instance with updated properties
        // We do NOT allow updating the title
        const updatedSkill = new Skill_1.Skill({
            ...skill.toJSON(), // Spread existing properties
            ...updates, // Overwrite with allowed updates
            imageUrl: imageUrl || skill.imageUrl, // Use new URL if uploaded, or existing
            updatedAt: new Date()
        });
        return this.skillRepository.update(updatedSkill);
    }
};
exports.UpdateSkillUseCase = UpdateSkillUseCase;
exports.UpdateSkillUseCase = UpdateSkillUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ISkillRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IS3Service)),
    __metadata("design:paramtypes", [Object, Object])
], UpdateSkillUseCase);
//# sourceMappingURL=UpdateSkillUseCase.js.map