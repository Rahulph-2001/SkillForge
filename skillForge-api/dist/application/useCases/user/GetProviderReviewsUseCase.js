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
exports.GetProviderReviewsUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
let GetProviderReviewsUseCase = class GetProviderReviewsUseCase {
    constructor(reviewRepository, userRepository, skillRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
    }
    async execute(userId) {
        // Fetch all reviews where the user is the provider
        const reviews = await this.reviewRepository.findByProviderId(userId);
        // Map reviews to DTOs with learner information and skill title
        const reviewDTOs = await Promise.all(reviews.map(async (review) => {
            // Get learner info for each review
            const learner = await this.userRepository.findById(review.learnerId);
            // Get skill title
            const skill = await this.skillRepository.findById(review.skillId);
            return {
                id: review.id,
                userName: learner?.name || 'Anonymous',
                userAvatar: learner?.avatarUrl || null,
                rating: review.rating,
                comment: review.review,
                skillTitle: skill?.title || 'Session',
                createdAt: review.createdAt,
            };
        }));
        return reviewDTOs;
    }
};
exports.GetProviderReviewsUseCase = GetProviderReviewsUseCase;
exports.GetProviderReviewsUseCase = GetProviderReviewsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IReviewRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.ISkillRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], GetProviderReviewsUseCase);
//# sourceMappingURL=GetProviderReviewsUseCase.js.map