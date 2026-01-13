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
exports.UpdateFeatureUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
let UpdateFeatureUseCase = class UpdateFeatureUseCase {
    constructor(featureRepository, featureMapper) {
        this.featureRepository = featureRepository;
        this.featureMapper = featureMapper;
    }
    async execute(featureId, dto) {
        // Find existing feature
        const feature = await this.featureRepository.findById(featureId);
        if (!feature) {
            throw new AppError_1.NotFoundError('Feature not found');
        }
        // Update feature details if name or description changed
        if (dto.name !== undefined || dto.description !== undefined || dto.limitValue !== undefined || dto.isEnabled !== undefined || dto.isHighlighted !== undefined) {
            const newName = dto.name ?? feature.name;
            const newDescription = dto.description ?? feature.description;
            const newLimit = dto.limitValue ?? (feature.hasLimit() ? feature.getLimit() : undefined);
            const newEnabled = dto.isEnabled ?? feature.isEnabled;
            const newHighlighted = dto.isHighlighted ?? feature.isHighlighted;
            feature.updateDetails(newName, newDescription, newLimit, newEnabled, newHighlighted);
        }
        // Update display order
        if (dto.displayOrder !== undefined) {
            feature.updateDisplayOrder(dto.displayOrder);
        }
        // Update enabled status
        if (dto.isEnabled !== undefined) {
            if (dto.isEnabled) {
                feature.enable();
            }
            else {
                feature.disable();
            }
        }
        // Update highlighted status
        if (dto.isHighlighted !== undefined) {
            if (dto.isHighlighted) {
                feature.highlight();
            }
            else {
                feature.unhighlight();
            }
        }
        // Save updated feature
        const updated = await this.featureRepository.update(feature);
        // Map to DTO
        return this.featureMapper.toDTO(updated);
    }
};
exports.UpdateFeatureUseCase = UpdateFeatureUseCase;
exports.UpdateFeatureUseCase = UpdateFeatureUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IFeatureRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IFeatureMapper)),
    __metadata("design:paramtypes", [Object, Object])
], UpdateFeatureUseCase);
//# sourceMappingURL=UpdateFeatureUseCase.js.map