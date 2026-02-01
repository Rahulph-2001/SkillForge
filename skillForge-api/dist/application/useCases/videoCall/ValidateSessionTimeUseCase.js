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
var ValidateSessionTimeUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateSessionTimeUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const messages_1 = require("../../../config/messages");
const Booking_1 = require("../../../domain/entities/Booking");
let ValidateSessionTimeUseCase = ValidateSessionTimeUseCase_1 = class ValidateSessionTimeUseCase {
    constructor(bookingRepository) {
        this.bookingRepository = bookingRepository;
    }
    async execute(userId, bookingId) {
        const booking = await this.bookingRepository.findById(bookingId);
        if (!booking) {
            throw new AppError_1.NotFoundError('Booking not found');
        }
        // Verify user is part of this booking
        if (booking.providerId !== userId && booking.learnerId !== userId) {
            throw new AppError_1.ForbiddenError('You are not authorized to join this session');
        }
        // Check booking status - must be confirmed or in_session
        if (booking.status !== Booking_1.BookingStatus.CONFIRMED && booking.status !== Booking_1.BookingStatus.IN_SESSION) {
            throw new AppError_1.ValidationError(messages_1.ERROR_MESSAGES.SESSION.NOT_CONFIRMED);
        }
        // Parse session start and end times
        const sessionStartAt = this.parseDateTime(booking.preferredDate, booking.preferredTime);
        const sessionDurationMinutes = booking.duration || 60;
        const sessionEndAt = new Date(sessionStartAt.getTime() + sessionDurationMinutes * 60 * 1000);
        const now = new Date();
        // Calculate join window
        const joinWindowStart = new Date(sessionStartAt.getTime() - ValidateSessionTimeUseCase_1.JOIN_WINDOW_MINUTES_BEFORE * 60 * 1000);
        const joinWindowEnd = new Date(sessionEndAt.getTime() + ValidateSessionTimeUseCase_1.GRACE_PERIOD_MINUTES_AFTER * 60 * 1000);
        // Check if session has expired
        if (now > joinWindowEnd) {
            return {
                canJoin: false,
                message: messages_1.ERROR_MESSAGES.SESSION.SESSION_EXPIRED,
                sessionStartAt,
                sessionEndAt,
                remainingSeconds: 0,
                sessionDurationMinutes,
            };
        }
        // Check if it's too early to join
        if (now < joinWindowStart) {
            const remainingSeconds = Math.floor((joinWindowStart.getTime() - now.getTime()) / 1000);
            return {
                canJoin: false,
                message: messages_1.ERROR_MESSAGES.SESSION.JOIN_WINDOW_NOT_OPEN,
                sessionStartAt,
                sessionEndAt,
                remainingSeconds,
                sessionDurationMinutes,
            };
        }
        // Calculate remaining session time
        let remainingSeconds = 0;
        if (now < sessionEndAt) {
            remainingSeconds = Math.floor((sessionEndAt.getTime() - now.getTime()) / 1000);
        }
        return {
            canJoin: true,
            message: 'Session is available to join',
            sessionStartAt,
            sessionEndAt,
            remainingSeconds,
            sessionDurationMinutes,
        };
    }
    parseDateTime(dateString, timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date(dateString);
        date.setHours(hours, minutes, 0, 0);
        return date;
    }
};
exports.ValidateSessionTimeUseCase = ValidateSessionTimeUseCase;
// Allow joining 15 minutes before session start
ValidateSessionTimeUseCase.JOIN_WINDOW_MINUTES_BEFORE = 15;
// Allow joining up to the session end time
ValidateSessionTimeUseCase.GRACE_PERIOD_MINUTES_AFTER = 0;
exports.ValidateSessionTimeUseCase = ValidateSessionTimeUseCase = ValidateSessionTimeUseCase_1 = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IBookingRepository)),
    __metadata("design:paramtypes", [Object])
], ValidateSessionTimeUseCase);
//# sourceMappingURL=ValidateSessionTimeUseCase.js.map