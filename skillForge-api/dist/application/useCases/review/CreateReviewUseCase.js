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
exports.CreateReviewUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const Booking_1 = require("../../../domain/entities/Booking");
const Review_1 = require("../../../domain/entities/Review");
const Database_1 = require("../../../infrastructure/database/Database");
let CreateReviewUseCase = class CreateReviewUseCase {
    constructor(reviewRepository, bookingRepository, reviewMapper, db) {
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
        this.reviewMapper = reviewMapper;
        this.db = db;
    }
    async execute(userId, request) {
        const { bookingId, rating, review } = request;
        // 1. Validate Booking
        const booking = await this.bookingRepository.findById(bookingId);
        if (!booking) {
            throw new AppError_1.NotFoundError('Booking not found');
        }
        // 2. Validate User is the Learner
        if (booking.learnerId !== userId) {
            throw new AppError_1.ForbiddenError('Only the learner can submit a review for this session');
        }
        // 3. Validate Booking Status (Must be Completed)
        if (booking.status !== Booking_1.BookingStatus.COMPLETED) {
            throw new AppError_1.ValidationError('Cannot review a session that is not completed');
        }
        // 4. Check if review already exists
        const existingReview = await this.reviewRepository.findByBookingId(bookingId);
        if (existingReview) {
            throw new AppError_1.ValidationError('Review already submitted for this session');
        }
        // 5. Create Review Entity
        const reviewEntity = new Review_1.Review({
            bookingId,
            providerId: booking.providerId,
            learnerId: booking.learnerId,
            skillId: booking.skillId,
            rating,
            review,
        });
        // 6. Persist with Transaction (Industrial Level: Update Aggregates)
        // We need to cast to any to access prisma transaction if repository doesn't expose it directly.
        // However, clean architecture says UseCase shouldn't know about DB implementation details.
        // Ideally, the repository should handle the transaction or we inject a UnitOfWork.
        // For this strict architecture, we'll implement a 'createWithAggregates' method in Repository?
        // Or we use the prisma client directly from the Database service if available.
        // Since I injected Database, I can use it.
        // Note: IReviewRepository.create signature assumes simple create. 
        // I will implement the transaction logic inside the Repository for cleaner separation, 
        // OR use the database service here.
        // Given the complexity of updating User and Skill stats, it's better to encapsulate this in the Repository 
        // or a Domain Service. I'll put it in Repository as `createAndUpdateStats`.
        // But standard pattern is Repository methods are simple.
        // Let's use the Database service to start a transaction here if possible, or extend the repository.
        // I'll extend the repository interface for this specific complex operation.
        // Actually, I'll allow the repository to handle the transaction logic for "Review Creation" 
        // because it involves data integrity across tables.
        const createdReview = await this.reviewRepository.createWithStats(reviewEntity);
        return this.reviewMapper.toResponseDTO(createdReview);
    }
};
exports.CreateReviewUseCase = CreateReviewUseCase;
exports.CreateReviewUseCase = CreateReviewUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IReviewRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IBookingRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IReviewMapper)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __metadata("design:paramtypes", [Object, Object, Object, Database_1.Database])
], CreateReviewUseCase);
//# sourceMappingURL=CreateReviewUseCase.js.map