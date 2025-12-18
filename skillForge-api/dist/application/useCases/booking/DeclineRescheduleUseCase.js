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
exports.DeclineRescheduleUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
let DeclineRescheduleUseCase = class DeclineRescheduleUseCase {
    constructor(bookingRepository) {
        this.bookingRepository = bookingRepository;
    }
    async execute(request) {
        // 1. Get the booking
        const booking = await this.bookingRepository.findById(request.bookingId);
        if (!booking) {
            throw new AppError_1.NotFoundError('Booking not found');
        }
        // 2. Verify booking has a reschedule request
        if (!booking.isRescheduleRequest()) {
            throw new AppError_1.ValidationError('No reschedule request found for this booking');
        }
        // 3. Get reschedule info
        const rescheduleInfo = booking.rescheduleInfo;
        if (!rescheduleInfo) {
            throw new AppError_1.ValidationError('Reschedule information not found');
        }
        // 4. Verify authorization - The person who DIDN'T request the reschedule should decline it
        const isLearner = booking.learnerId === request.userId;
        const isProvider = booking.providerId === request.userId;
        if (!isLearner && !isProvider) {
            throw new AppError_1.ForbiddenError('Unauthorized to decline this reschedule request');
        }
        // Check if the user is the one who should decline (not the one who requested)
        if (rescheduleInfo.requestedBy === 'learner' && !isProvider) {
            throw new AppError_1.ForbiddenError('Only the provider can decline a learner-initiated reschedule request');
        }
        if (rescheduleInfo.requestedBy === 'provider' && !isLearner) {
            throw new AppError_1.ForbiddenError('Only the learner can decline a provider-initiated reschedule request');
        }
        // 5. Decline the reschedule request (revert to confirmed status and clear reschedule info)
        await this.bookingRepository.declineReschedule(request.bookingId, request.reason);
        // TODO: Send notification to the requester about declined reschedule
    }
};
exports.DeclineRescheduleUseCase = DeclineRescheduleUseCase;
exports.DeclineRescheduleUseCase = DeclineRescheduleUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IBookingRepository)),
    __metadata("design:paramtypes", [Object])
], DeclineRescheduleUseCase);
//# sourceMappingURL=DeclineRescheduleUseCase.js.map