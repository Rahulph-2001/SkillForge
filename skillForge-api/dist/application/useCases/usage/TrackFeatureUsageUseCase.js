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
exports.TrackFeatureUsageUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
let TrackFeatureUsageUseCase = class TrackFeatureUsageUseCase {
    constructor(usageRepository, subscriptionRepository, usageRecordMapper) {
        this.usageRepository = usageRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.usageRecordMapper = usageRecordMapper;
    }
    async execute(dto) {
        // Verify subscription exists and is active
        const subscription = await this.subscriptionRepository.findById(dto.subscriptionId);
        if (!subscription) {
            throw new AppError_1.NotFoundError('Subscription not found');
        }
        if (!subscription.isActive()) {
            throw new AppError_1.ConflictError('Subscription is not active');
        }
        // Get or create usage record for current period
        const usageRecord = await this.usageRepository.getOrCreate(dto.subscriptionId, dto.featureKey, undefined, // Limit will be set by the repository if needed
        subscription.currentPeriodStart, subscription.currentPeriodEnd);
        // Check if limit would be exceeded
        if (usageRecord.limitValue !== undefined) {
            const newCount = usageRecord.usageCount + dto.incrementBy;
            if (newCount > usageRecord.limitValue) {
                throw new AppError_1.ConflictError(`Feature usage limit exceeded. Current: ${usageRecord.usageCount}, Limit: ${usageRecord.limitValue}, Attempting to add: ${dto.incrementBy}`);
            }
        }
        // Increment usage
        usageRecord.incrementUsage(dto.incrementBy);
        // Save updated record
        const updated = await this.usageRepository.update(usageRecord);
        // Return DTO using mapper
        return this.usageRecordMapper.toDTO(updated);
    }
};
exports.TrackFeatureUsageUseCase = TrackFeatureUsageUseCase;
exports.TrackFeatureUsageUseCase = TrackFeatureUsageUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUsageRecordRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserSubscriptionRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IUsageRecordMapper)),
    __metadata("design:paramtypes", [Object, Object, Object])
], TrackFeatureUsageUseCase);
//# sourceMappingURL=TrackFeatureUsageUseCase.js.map