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
exports.RescheduleBookingUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const BookingValidator_1 = require("../../../shared/validators/BookingValidator");
const DateTimeUtils_1 = require("../../../shared/utils/DateTimeUtils");
let RescheduleBookingUseCase = class RescheduleBookingUseCase {
    constructor(bookingRepository, skillRepository) {
        this.bookingRepository = bookingRepository;
        this.skillRepository = skillRepository;
    }
    async execute(request) {
        // 1. Validate date and time format
        const formatValidation = BookingValidator_1.BookingValidator.validateDateTimeFormat(request.newDate, request.newTime);
        if (!formatValidation.valid) {
            throw new AppError_1.ValidationError(formatValidation.error || 'Invalid date or time format');
        }
        // 2. Validate new date is in the future
        const newDateTime = new Date(`${request.newDate}T${request.newTime}`);
        if (newDateTime <= new Date()) {
            throw new AppError_1.ValidationError('Reschedule date must be in the future');
        }
        // 3. Get the booking
        const booking = await this.bookingRepository.findById(request.bookingId);
        if (!booking) {
            throw new AppError_1.NotFoundError('Booking not found');
        }
        // 4. Verify authorization (User must be learner or provider)
        const isLearner = booking.learnerId === request.userId;
        const isProvider = booking.providerId === request.userId;
        if (!isLearner && !isProvider) {
            throw new AppError_1.ForbiddenError('Unauthorized to reschedule this booking');
        }
        // 5. Verify booking can be rescheduled
        if (!booking.canBeRescheduled()) {
            throw new AppError_1.ValidationError(`Cannot reschedule booking with status: ${booking.status}`);
        }
        // 5b. Time-based validation: Block rescheduling if session time window has started
        const RESCHEDULE_CUTOFF_MINUTES = 15; // Same as join window
        const sessionStart = this.parseDateTime(booking.preferredDate, booking.preferredTime);
        const rescheduleCutoff = new Date(sessionStart.getTime() - RESCHEDULE_CUTOFF_MINUTES * 60 * 1000);
        const now = new Date();
        if (now >= rescheduleCutoff) {
            throw new AppError_1.ValidationError('Cannot reschedule: Session is about to start or has already started');
        }
        // 6. Get skill to calculate duration
        const skill = await this.skillRepository.findById(booking.skillId);
        if (!skill) {
            throw new AppError_1.NotFoundError('Skill not found');
        }
        // 7. Calculate new start and end times
        const [startHours, startMinutes] = request.newTime.split(':').map(Number);
        const newStartAt = new Date(request.newDate);
        newStartAt.setHours(startHours, startMinutes, 0, 0);
        const newEndAt = DateTimeUtils_1.DateTimeUtils.addHours(newStartAt, skill.durationHours);
        // 8. Create reschedule info with calculated times
        const rescheduleInfo = {
            newDate: request.newDate,
            newTime: request.newTime,
            reason: request.reason,
            requestedBy: isLearner ? 'learner' : 'provider',
            requestedAt: new Date(),
            newStartAt,
            newEndAt,
        };
        // 9. Update booking with reschedule request
        await this.bookingRepository.updateWithReschedule(request.bookingId, rescheduleInfo);
        // TODO: Send notification to the other party (learner or provider)
    }
    parseDateTime(dateString, timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date(dateString);
        date.setHours(hours, minutes, 0, 0);
        return date;
    }
};
exports.RescheduleBookingUseCase = RescheduleBookingUseCase;
exports.RescheduleBookingUseCase = RescheduleBookingUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IBookingRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ISkillRepository)),
    __metadata("design:paramtypes", [Object, Object])
], RescheduleBookingUseCase);
//# sourceMappingURL=RescheduleBookingUseCase.js.map