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
exports.GetFeatureByIdUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const FeatureMapper_1 = require("../../mappers/FeatureMapper");
const AppError_1 = require("../../../domain/errors/AppError");
let GetFeatureByIdUseCase = class GetFeatureByIdUseCase {
    constructor(featureRepository) {
        this.featureRepository = featureRepository;
    }
    async execute(featureId) {
        const feature = await this.featureRepository.findById(featureId);
        if (!feature) {
            throw new AppError_1.NotFoundError('Feature not found');
        }
        return FeatureMapper_1.FeatureMapper.toDTO(feature);
    }
};
exports.GetFeatureByIdUseCase = GetFeatureByIdUseCase;
exports.GetFeatureByIdUseCase = GetFeatureByIdUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IFeatureRepository)),
    __metadata("design:paramtypes", [Object])
], GetFeatureByIdUseCase);
//# sourceMappingURL=GetFeatureByIdUseCase.js.map