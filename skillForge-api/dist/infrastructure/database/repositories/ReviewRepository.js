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
exports.ReviewRepository = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../di/types");
const Review_1 = require("../../../domain/entities/Review");
const Database_1 = require("../Database");
const BaseRepository_1 = require("../BaseRepository");
let ReviewRepository = class ReviewRepository extends BaseRepository_1.BaseRepository {
    constructor(db) {
        super(db, 'review');
    }
    mapToDomain(data) {
        return new Review_1.Review({
            id: data.id,
            bookingId: data.bookingId,
            providerId: data.providerId,
            learnerId: data.learnerId,
            skillId: data.skillId,
            rating: data.rating,
            review: data.review,
            createdAt: data.createdAt,
        });
    }
    async create(review) {
        // This method is required by interface but for full logic we use createWithStats
        // We can just call createWithStats here or throw error
        return this.createWithStats(review);
    }
    async createWithStats(review) {
        const prisma = this.prisma;
        return await prisma.$transaction(async (tx) => {
            // 1. Create Review
            const newReview = await tx.review.create({
                data: {
                    id: review.id,
                    bookingId: review.bookingId,
                    providerId: review.providerId,
                    learnerId: review.learnerId,
                    skillId: review.skillId,
                    rating: review.rating,
                    review: review.review,
                    createdAt: review.createdAt,
                },
            });
            // 2. Update Provider Stats
            const providerReviews = await tx.review.aggregate({
                where: { providerId: review.providerId },
                _avg: { rating: true },
                _count: { rating: true },
            });
            await tx.user.update({
                where: { id: review.providerId },
                data: {
                    rating: providerReviews._avg.rating || 0,
                    reviewCount: providerReviews._count.rating || 0,
                },
            });
            // 3. Update Skill Stats
            const skillReviews = await tx.review.aggregate({
                where: { skillId: review.skillId },
                _avg: { rating: true },
            });
            await tx.skill.update({
                where: { id: review.skillId },
                data: {
                    rating: skillReviews._avg.rating || 0,
                },
            });
            return this.mapToDomain(newReview);
        });
    }
    async findByBookingId(bookingId) {
        const prisma = this.prisma;
        const data = await prisma.review.findUnique({
            where: { bookingId },
        });
        return data ? this.mapToDomain(data) : null;
    }
    async findByProviderId(providerId) {
        const prisma = this.prisma;
        const data = await prisma.review.findMany({
            where: { providerId },
            orderBy: { createdAt: 'desc' },
        });
        return data.map((item) => this.mapToDomain(item));
    }
    async findByLearnerId(learnerId) {
        const prisma = this.prisma;
        const data = await prisma.review.findMany({
            where: { learnerId },
            orderBy: { createdAt: 'desc' },
        });
        return data.map((item) => this.mapToDomain(item));
    }
};
exports.ReviewRepository = ReviewRepository;
exports.ReviewRepository = ReviewRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __metadata("design:paramtypes", [Database_1.Database])
], ReviewRepository);
//# sourceMappingURL=ReviewRepository.js.map