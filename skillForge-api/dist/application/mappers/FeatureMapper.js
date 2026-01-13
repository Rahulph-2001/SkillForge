"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureMapper = void 0;
const inversify_1 = require("inversify");
let FeatureMapper = class FeatureMapper {
    /**
     * Map Feature entity to FeatureResponseDTO
     */
    toDTO(feature) {
        return {
            id: feature.id,
            planId: feature.planId,
            name: feature.name,
            description: feature.description,
            featureType: feature.featureType,
            limitValue: feature.limitValue,
            isEnabled: feature.isEnabled,
            displayOrder: feature.displayOrder,
            isHighlighted: feature.isHighlighted,
            createdAt: feature.createdAt,
            updatedAt: feature.updatedAt,
        };
    }
    /**
     * Map array of Feature entities to DTOs
     */
    toDTOArray(features) {
        return features.map((feature) => this.toDTO(feature));
    }
};
exports.FeatureMapper = FeatureMapper;
exports.FeatureMapper = FeatureMapper = __decorate([
    (0, inversify_1.injectable)()
], FeatureMapper);
//# sourceMappingURL=FeatureMapper.js.map