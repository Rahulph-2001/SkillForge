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
exports.ListFeaturesUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
let ListFeaturesUseCase = class ListFeaturesUseCase {
    constructor(featureRepository, featureMapper, paginationService) {
        this.featureRepository = featureRepository;
        this.featureMapper = featureMapper;
        this.paginationService = paginationService;
    }
    async execute(page, limit, search, planId, highlightedOnly = false) {
        // If planId is provided, use old non-paginated approach
        if (planId) {
            let features;
            if (highlightedOnly) {
                features = await this.featureRepository.findHighlightedByPlanId(planId);
            }
            else {
                features = await this.featureRepository.findByPlanId(planId);
            }
            return this.featureMapper.toDTOArray(features);
        }
        // For library features, use pagination
        const paginationParams = this.paginationService.createParams(page || 1, limit || 10);
        const { features, total } = await this.featureRepository.findLibraryFeatures({ search }, paginationParams);
        const featureDTOs = this.featureMapper.toDTOArray(features);
        const paginationResult = this.paginationService.createResult(featureDTOs, total, page || 1, limit || 10);
        return {
            features: featureDTOs,
            pagination: {
                total: paginationResult.total,
                page: paginationResult.page,
                limit: paginationResult.limit,
                totalPages: paginationResult.totalPages,
                hasNextPage: paginationResult.hasNextPage,
                hasPreviousPage: paginationResult.hasPreviousPage,
            },
        };
    }
};
exports.ListFeaturesUseCase = ListFeaturesUseCase;
exports.ListFeaturesUseCase = ListFeaturesUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IFeatureRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IFeatureMapper)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IPaginationService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ListFeaturesUseCase);
//# sourceMappingURL=ListFeaturesUseCase.js.map