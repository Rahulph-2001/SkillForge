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
exports.AcceptRescheduleUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const Notification_1 = require("../../../domain/entities/Notification");
let AcceptRescheduleUseCase = class AcceptRescheduleUseCase {
    constructor(bookingRepository, userRepository, notificationService) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
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
        // 4. Verify authorization - The person who DIDN'T request the reschedule should accept it
        // If learner requested, provider should accept. If provider requested, learner should accept.
        const isLearner = booking.learnerId === request.userId;
        const isProvider = booking.providerId === request.userId;
        if (!isLearner && !isProvider) {
            throw new AppError_1.ForbiddenError('Unauthorized to accept this reschedule request');
        }
        // Check if the user is the one who should accept (not the one who requested)
        if (rescheduleInfo.requestedBy === 'learner' && !isProvider) {
            throw new AppError_1.ForbiddenError('Only the provider can accept a learner-initiated reschedule request');
        }
        if (rescheduleInfo.requestedBy === 'provider' && !isLearner) {
            throw new AppError_1.ForbiddenError('Only the learner can accept a provider-initiated reschedule request');
        }
        // 5. Update booking with new date/time and set status to confirmed
        // Note: Repository method handles overlap detection transactionally
        await this.bookingRepository.acceptReschedule(request.bookingId, rescheduleInfo.newDate, rescheduleInfo.newTime);
        // 6. Send notification to the requester about accepted reschedule
        const requesterId = rescheduleInfo.requestedBy === 'learner' ? booking.learnerId : booking.providerId;
        const accepter = await this.userRepository.findById(request.userId);
        const formattedDate = new Date(rescheduleInfo.newDate).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        });
        await this.notificationService.send({
            userId: requesterId,
            type: Notification_1.NotificationType.RESCHEDULE_ACCEPTED,
            title: 'Reschedule Accepted',
            message: `${accepter?.name || 'User'} accepted your reschedule request. Session is now scheduled for ${formattedDate} at ${rescheduleInfo.newTime}`,
            data: {
                bookingId: booking.id,
                newDate: rescheduleInfo.newDate,
                newTime: rescheduleInfo.newTime
            },
        });
    }
};
exports.AcceptRescheduleUseCase = AcceptRescheduleUseCase;
exports.AcceptRescheduleUseCase = AcceptRescheduleUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IBookingRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.INotificationService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], AcceptRescheduleUseCase);
//# sourceMappingURL=AcceptRescheduleUseCase.js.map