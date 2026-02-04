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