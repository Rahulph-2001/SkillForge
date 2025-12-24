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
exports.DeleteFeatureUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
let DeleteFeatureUseCase = class DeleteFeatureUseCase {
    constructor(featureRepository) {
        this.featureRepository = featureRepository;
    }
    async execute(featureId) {
        // Find existing feature
        const feature = await this.featureRepository.findById(featureId);
        if (!feature) {
            throw new AppError_1.NotFoundError('Feature not found');
        }
        // Check if feature is in use by any plans
        // Note: In a real implementation, you might want to check if the feature
        // is linked to any active subscription plans before deleting
        // For now, we'll do a soft delete by disabling it
        feature.disable();
        // Update to mark as disabled (soft delete)
        await this.featureRepository.update(feature);
        // Or hard delete if preferred:
        // await this.featureRepository.delete(featureId);
    }
};
exports.DeleteFeatureUseCase = DeleteFeatureUseCase;
exports.DeleteFeatureUseCase = DeleteFeatureUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IFeatureRepository)),
    __metadata("design:paramtypes", [Object])
], DeleteFeatureUseCase);
//# sourceMappingURL=DeleteFeatureUseCase.js.map