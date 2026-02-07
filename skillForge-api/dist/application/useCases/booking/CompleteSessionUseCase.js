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
exports.CompleteSessionUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const Booking_1 = require("../../../domain/entities/Booking");
const AppError_1 = require("../../../domain/errors/AppError");
const Database_1 = require("../../../infrastructure/database/Database");
const Notification_1 = require("../../../domain/entities/Notification");
let CompleteSessionUseCase = class CompleteSessionUseCase {
    constructor(bookingRepository, escrowRepository, bookingMapper, database, notificationService, userRepository, skillRepository) {
        this.bookingRepository = bookingRepository;
        this.escrowRepository = escrowRepository;
        this.bookingMapper = bookingMapper;
        this.database = database;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
    }
    async execute(request) {
        const { bookingId, completedBy } = request;
        const booking = await this.bookingRepository.findById(bookingId);
        if (!booking) {
            throw new AppError_1.NotFoundError('Booking not found');
        }
        if (booking.providerId !== completedBy && booking.learnerId !== completedBy) {
            throw new AppError_1.ForbiddenError('You are not authorized to complete this session');
        }
        if (!booking.canBeCompleted()) {
            throw new AppError_1.ValidationError(`cannot complete booking with status: ${booking.status}`);
        }
        // Use transaction to ensure all updates are atomic
        const prisma = this.database.getClient();
        await prisma.$transaction(async (tx) => {
            // 1. Release escrow credits to provider
            await this.escrowRepository.releaseCredits(bookingId);
            // 2. Update booking status to completed
            await tx.booking.update({
                where: { id: bookingId },
                data: { status: Booking_1.BookingStatus.COMPLETED },
            });
            // 3. Increment provider's totalSessionsCompleted
            await tx.user.update({
                where: { id: booking.providerId },
                data: { totalSessionsCompleted: { increment: 1 } },
            });
            // 4. Increment learner's totalSessionsCompleted
            await tx.user.update({
                where: { id: booking.learnerId },
                data: { totalSessionsCompleted: { increment: 1 } },
            });
            // 5. Increment skill's totalSessions
            await tx.skill.update({
                where: { id: booking.skillId },
                data: { totalSessions: { increment: 1 } },
            });
        });
        // Fetch user and skill details for notifications
        const learner = await this.userRepository.findById(booking.learnerId);
        const provider = await this.userRepository.findById(booking.providerId);
        const skill = await this.skillRepository.findById(booking.skillId);
        // Send notification to learner about session completion
        await this.notificationService.send({
            userId: booking.learnerId,
            type: Notification_1.NotificationType.SESSION_COMPLETED,
            title: 'Session Completed',
            message: `Your ${skill?.title || 'skill'} session with ${provider?.name || 'provider'} has been completed`,
            data: { bookingId: booking.id, skillId: booking.skillId },
        });
        // Send notification to provider about session completion
        await this.notificationService.send({
            userId: booking.providerId,
            type: Notification_1.NotificationType.SESSION_COMPLETED,
            title: 'Session Completed',
            message: `Your ${skill?.title || 'skill'} session with ${learner?.name || 'learner'} has been completed`,
            data: { bookingId: booking.id, skillId: booking.skillId },
        });
        // Send notification to provider about credits earned
        await this.notificationService.send({
            userId: booking.providerId,
            type: Notification_1.NotificationType.CREDITS_EARNED,
            title: 'Credits Earned',
            message: `You earned ${booking.sessionCost} credits from your session with ${learner?.name || 'learner'}`,
            data: { bookingId: booking.id, creditsEarned: booking.sessionCost },
        });
        // Fetch the updated booking for response
        const updatedBooking = await this.bookingRepository.findById(bookingId);
        return this.bookingMapper.toDTO(updatedBooking);
    }
};
exports.CompleteSessionUseCase = CompleteSessionUseCase;
exports.CompleteSessionUseCase = CompleteSessionUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IBookingRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IEscrowRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IBookingMapper)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.INotificationService)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(6, (0, inversify_1.inject)(types_1.TYPES.ISkillRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Database_1.Database, Object, Object, Object])
], CompleteSessionUseCase);
//# sourceMappingURL=CompleteSessionUseCase.js.map