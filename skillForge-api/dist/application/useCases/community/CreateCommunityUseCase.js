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
exports.CreateCommunityUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const Community_1 = require("../../../domain/entities/Community");
const CommunityMember_1 = require("../../../domain/entities/CommunityMember");
const AppError_1 = require("../../../domain/errors/AppError");
const SubscriptionEnums_1 = require("../../../domain/enums/SubscriptionEnums");
const UsageRecord_1 = require("../../../domain/entities/UsageRecord");
const uuid_1 = require("uuid");
let CreateCommunityUseCase = class CreateCommunityUseCase {
    constructor(communityRepository, storageService, communityMapper, subscriptionRepository, planRepository, featureRepository, usageRecordRepository, transactionService) {
        this.communityRepository = communityRepository;
        this.storageService = storageService;
        this.communityMapper = communityMapper;
        this.subscriptionRepository = subscriptionRepository;
        this.planRepository = planRepository;
        this.featureRepository = featureRepository;
        this.usageRecordRepository = usageRecordRepository;
        this.transactionService = transactionService;
    }
    async execute(userId, dto, imageFile) {
        // Validation
        if (!dto.name || dto.name.trim().length === 0) {
            throw new AppError_1.ValidationError('Community name is required');
        }
        if (!dto.description || dto.description.trim().length === 0) {
            throw new AppError_1.ValidationError('Community description is required');
        }
        if (!dto.category || dto.category.trim().length === 0) {
            throw new AppError_1.ValidationError('Community category is required');
        }
        // ============================================
        // SUBSCRIPTION AND FEATURE CHECK - INDUSTRIAL LEVEL
        // ============================================
        // 1. Check if user has an active subscription
        const subscription = await this.subscriptionRepository.findByUserId(userId);
        if (!subscription) {
            throw new AppError_1.ForbiddenError('You need an active subscription to create communities. Please subscribe to a plan first.');
        }
        // 2. Verify subscription is active
        if (!subscription.isActive()) {
            throw new AppError_1.ForbiddenError('Your subscription is not active. Please renew your subscription to create communities.');
        }
        // 3. Get subscription plan with features
        const plan = await this.planRepository.findById(subscription.planId);
        if (!plan) {
            throw new AppError_1.NotFoundError('Subscription plan not found');
        }
        // 4. Check limits (legacy or feature model)
        let limitValue = undefined;
        let featureKey = 'create_community';
        let createCommunityFeature = null;
        const legacyLimit = plan.createCommunity;
        if (legacyLimit !== null && legacyLimit !== undefined) {
            limitValue = legacyLimit;
            featureKey = 'create_community';
        }
        else {
            const features = await this.featureRepository.findByPlanId(plan.id);
            createCommunityFeature = features.find(f => f.name.toLowerCase() === 'create_community' ||
                f.name.toLowerCase() === 'create community' ||
                f.name.toLowerCase() === 'community_creation' ||
                f.name.toLowerCase() === 'communities');
            if (!createCommunityFeature) {
                throw new AppError_1.ForbiddenError('Your subscription plan does not include community creation feature.');
            }
            if (!createCommunityFeature.isEnabled) {
                throw new AppError_1.ForbiddenError('Community creation feature is disabled for your plan.');
            }
            if (createCommunityFeature.featureType === SubscriptionEnums_1.FeatureType.NUMERIC_LIMIT) {
                limitValue = createCommunityFeature.limitValue;
                featureKey = createCommunityFeature.name;
                if (limitValue === null || limitValue === undefined) {
                    throw new AppError_1.ForbiddenError('Community creation limit is not configured for your plan.');
                }
            }
            else if (createCommunityFeature.featureType === SubscriptionEnums_1.FeatureType.BOOLEAN) {
                if (!createCommunityFeature.isEnabled) {
                    throw new AppError_1.ForbiddenError('Community creation is not available in your plan.');
                }
                limitValue = -1; // Unlimited
                featureKey = createCommunityFeature.name;
            }
            else {
                throw new AppError_1.ForbiddenError('Invalid feature type for community creation.');
            }
        }
        // 5. Check current usage
        let currentUsage = 0;
        if (limitValue !== null && limitValue !== undefined && limitValue !== -1) {
            const currentUsageRecords = await this.usageRecordRepository.findBySubscriptionId(subscription.id);
            const featureUsageRecord = currentUsageRecords.find(record => record.featureKey === featureKey &&
                record.periodStart <= subscription.currentPeriodEnd &&
                record.periodEnd >= subscription.currentPeriodStart);
            currentUsage = featureUsageRecord ? featureUsageRecord.usageCount : 0;
            if (currentUsage >= limitValue) {
                throw new AppError_1.ForbiddenError(`You have reached your community creation limit (${limitValue}). Please upgrade your plan or wait for your billing period to reset.`);
            }
        }
        // 6. Handle image upload
        let imageUrl = null;
        if (imageFile) {
            if (imageFile.buffer.length > 5 * 1024 * 1024) {
                throw new AppError_1.ValidationError('Image size must be less than 5MB');
            }
            if (!imageFile.mimetype.startsWith('image/')) {
                throw new AppError_1.ValidationError('Only image files are allowed');
            }
            try {
                const timestamp = Date.now();
                // Sanitize filename: replace spaces with hyphens and remove special characters
                const sanitizedFilename = imageFile.originalname
                    .replace(/\s+/g, '-') // Replace spaces with hyphens
                    .replace(/[^a-zA-Z0-9.-]/g, '') // Remove special characters except dots and hyphens
                    .toLowerCase(); // Convert to lowercase for consistency
                const key = `communities/${userId}/${timestamp}-${sanitizedFilename}`;
                imageUrl = await this.storageService.uploadFile(imageFile.buffer, key, imageFile.mimetype);
            }
            catch (error) {
                throw new AppError_1.InternalServerError('Failed to upload image. Please try again.');
            }
        }
        // 7. Create community entity
        const community = new Community_1.Community({
            name: dto.name,
            description: dto.description,
            category: dto.category,
            imageUrl,
            adminId: userId,
            creditsCost: dto.creditsCost,
            creditsPeriod: dto.creditsPeriod,
        });
        // 8. Use transaction service for atomic operations
        const createdCommunity = await this.transactionService.execute(async (repos) => {
            // Create community using repository
            const created = await repos.communityRepository.create(community);
            // Create admin member
            const adminMember = new CommunityMember_1.CommunityMember({
                communityId: community.id,
                userId,
                role: 'admin',
            });
            await repos.communityRepository.addMember(adminMember);
            // Track feature usage if needed
            if (limitValue !== null && limitValue !== undefined && limitValue !== -1) {
                try {
                    const existingUsageRecord = await repos.usageRecordRepository.findBySubscriptionAndFeature(subscription.id, featureKey, subscription.currentPeriodStart, subscription.currentPeriodEnd);
                    if (existingUsageRecord) {
                        existingUsageRecord.incrementUsage(1);
                        await repos.usageRecordRepository.update(existingUsageRecord);
                    }
                    else {
                        const newUsageRecord = new UsageRecord_1.UsageRecord({
                            id: (0, uuid_1.v4)(),
                            subscriptionId: subscription.id,
                            featureKey: featureKey,
                            usageCount: 1,
                            limitValue: limitValue,
                            periodStart: subscription.currentPeriodStart,
                            periodEnd: subscription.currentPeriodEnd,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        });
                        await repos.usageRecordRepository.create(newUsageRecord);
                    }
                }
                catch (usageError) {
                    console.error('[CreateCommunityUseCase] Failed to track feature usage:', usageError);
                }
            }
            return created;
        });
        // 9. Return DTO using mapper
        return await this.communityMapper.toDTO(createdCommunity, userId);
    }
};
exports.CreateCommunityUseCase = CreateCommunityUseCase;
exports.CreateCommunityUseCase = CreateCommunityUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ICommunityRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IStorageService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.ICommunityMapper)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IUserSubscriptionRepository)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.ISubscriptionPlanRepository)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.IFeatureRepository)),
    __param(6, (0, inversify_1.inject)(types_1.TYPES.IUsageRecordRepository)),
    __param(7, (0, inversify_1.inject)(types_1.TYPES.ITransactionService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object])
], CreateCommunityUseCase);
//# sourceMappingURL=CreateCommunityUseCase.js.map