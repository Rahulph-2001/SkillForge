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
var CancelBookingUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelBookingUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const Booking_1 = require("../../../domain/entities/Booking");
const AppError_1 = require("../../../domain/errors/AppError");
const Notification_1 = require("../../../domain/entities/Notification");
let CancelBookingUseCase = CancelBookingUseCase_1 = class CancelBookingUseCase {
    constructor(bookingRepository, escrowRepository, notificationService, userRepository, skillRepository) {
        this.bookingRepository = bookingRepository;
        this.escrowRepository = escrowRepository;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
    }
    async execute(request) {
        const { bookingId, userId, reason } = request;
        // 1. Fetch Booking
        const booking = await this.bookingRepository.findById(bookingId);
        if (!booking)
            throw new AppError_1.NotFoundError('Booking not found');
        // 2. Authorization Check
        const isLearner = booking.learnerId === userId;
        const isProvider = booking.providerId === userId;
        if (!isLearner && !isProvider) {
            throw new AppError_1.ForbiddenError('You are not authorized to cancel this booking');
        }
        // 3. Status Validation
        if (!booking.canBeCancelled()) {
            throw new AppError_1.ValidationError('Booking cannot be cancelled in its current state');
        }
        // 4. Time-based validation: Block cancellation if session time window has started
        if (booking.status === Booking_1.BookingStatus.CONFIRMED) {
            const sessionStart = this.parseDateTime(booking.preferredDate, booking.preferredTime);
            const cancelCutoff = new Date(sessionStart.getTime() - CancelBookingUseCase_1.CANCEL_CUTOFF_MINUTES * 60 * 1000);
            const now = new Date();
            if (now >= cancelCutoff) {
                throw new AppError_1.ValidationError('Cannot cancel: Session is about to start or has already started');
            }
        }
        // 5. Refund credits from escrow to learner
        await this.escrowRepository.refundCredits(bookingId);
        // 6. Update booking status to cancelled
        await this.bookingRepository.updateStatus(bookingId, Booking_1.BookingStatus.CANCELLED, reason || 'Cancelled by user');
        // 7. Send notification to the other party
        const canceller = await this.userRepository.findById(userId);
        const skill = await this.skillRepository.findById(booking.skillId);
        const recipientId = isLearner ? booking.providerId : booking.learnerId;
        await this.notificationService.send({
            userId: recipientId,
            type: Notification_1.NotificationType.SESSION_CANCELLED,
            title: 'Session Cancelled',
            message: `${canceller?.name || 'User'} cancelled the ${skill?.title || 'skill'} session${reason ? `. Reason: ${reason}` : ''}`,
            data: { bookingId: booking.id, cancelledBy: userId, skillId: booking.skillId },
        });
    }
    parseDateTime(dateString, timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date(dateString);
        date.setHours(hours, minutes, 0, 0);
        return date;
    }
};
exports.CancelBookingUseCase = CancelBookingUseCase;
// Users can cancel up to 15 minutes before session starts (same as join window)
CancelBookingUseCase.CANCEL_CUTOFF_MINUTES = 15;
exports.CancelBookingUseCase = CancelBookingUseCase = CancelBookingUseCase_1 = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IBookingRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IEscrowRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.INotificationService)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.ISkillRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], CancelBookingUseCase);
//# sourceMappingURL=CancelBookingUseCase.js.map