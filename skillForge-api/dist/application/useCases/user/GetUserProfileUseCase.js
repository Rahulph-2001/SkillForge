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
exports.GetUserProfileUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
let GetUserProfileUseCase = class GetUserProfileUseCase {
    constructor(userRepository, skillRepository, subscriptionRepository, planRepository, usageRecordRepository) {
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.planRepository = planRepository;
        this.usageRecordRepository = usageRecordRepository;
    }
    async execute(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new AppError_1.NotFoundError('User not found');
        }
        // Count skills offered by this user
        const skills = await this.skillRepository.findByProviderId(userId);
        const skillsOffered = skills.filter(s => s.status === 'approved' &&
            s.verificationStatus === 'passed' &&
            !s.isBlocked &&
            !s.isAdminBlocked).length;
        // Get Subscription Stats
        let projectPostLimit = 0; // Default to 0 if no plan (or Free logic TBD)
        let projectPostUsage = 0;
        let communityCreateLimit = 0;
        let communityCreateUsage = 0;
        const subscription = await this.subscriptionRepository.findByUserId(userId);
        if (subscription) {
            // Get Plan Limits
            const plan = await this.planRepository.findById(subscription.planId);
            if (plan) {
                // Project Posts
                projectPostLimit = plan.projectPosts;
                // Community Creation
                communityCreateLimit = plan.createCommunity;
            }
            // Get Usage
            // Since feature keys might vary, we fetch all for this subscription and filter
            const usageRecords = await this.usageRecordRepository.findBySubscriptionId(subscription.id);
            // Project Posts
            const projectUsageRecord = usageRecords.find(r => r.featureKey === 'project_posts');
            if (projectUsageRecord && projectUsageRecord.isPeriodActive()) {
                projectPostUsage = projectUsageRecord.usageCount;
            }
            // Community Creation
            // Logic from CreateCommunityUseCase checks 'create_community' or feature name.
            // We'll look for standard keys or assume 'create_community' is the primary one used by legacy logic.
            const communityUsageRecord = usageRecords.find(r => r.featureKey === 'create_community' ||
                r.featureKey === 'create community' ||
                r.featureKey === 'community_creation');
            if (communityUsageRecord && communityUsageRecord.isPeriodActive()) {
                communityCreateUsage = communityUsageRecord.usageCount;
            }
        }
        else {
            // Handle "Free" plan defaults if no subscription record exists but user is conceptually on "Free"
            // Often "Free" users might not have a subscription record if the system creates it only on upgrade.
            // If your system creates a "Free" subscription on registration, the above if(subscription) covers it.
            // Providing safe defaults here:
            projectPostLimit = 2; // Hardcoded default for free tier as seen in UI
            communityCreateLimit = 0;
        }
        return {
            id: user.id,
            name: user.name,
            email: user.email.value,
            avatarUrl: user.avatarUrl,
            bio: user.bio,
            location: user.location,
            credits: user.credits,
            walletBalance: Number(user.walletBalance),
            skillsOffered,
            rating: user.rating ? Number(user.rating) : 0,
            reviewCount: user.reviewCount,
            totalSessionsCompleted: user.totalSessionsCompleted,
            memberSince: user.memberSince ? user.memberSince.toISOString() : new Date().toISOString(),
            subscriptionPlan: user.subscriptionPlan || '',
            subscriptionValidUntil: user.subscriptionValidUntil?.toISOString() || null,
            projectPostLimit,
            projectPostUsage,
            communityCreateLimit,
            communityCreateUsage
        };
    }
};
exports.GetUserProfileUseCase = GetUserProfileUseCase;
exports.GetUserProfileUseCase = GetUserProfileUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ISkillRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IUserSubscriptionRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.ISubscriptionPlanRepository)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IUsageRecordRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], GetUserProfileUseCase);
//# sourceMappingURL=GetUserProfileUseCase.js.map