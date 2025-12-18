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
exports.CreateBookingUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const Booking_1 = require("../../../domain/entities/Booking");
const AppError_1 = require("../../../domain/errors/AppError");
const BookingValidator_1 = require("../../../shared/validators/BookingValidator");
const DateTimeUtils_1 = require("../../../shared/utils/DateTimeUtils");
let CreateBookingUseCase = class CreateBookingUseCase {
    constructor(bookingRepository, skillRepository, userRepository, availabilityRepository, bookingMapper) {
        this.bookingRepository = bookingRepository;
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
        this.availabilityRepository = availabilityRepository;
        this.bookingMapper = bookingMapper;
    }
    async execute(request) {
        // 1. Validate required fields
        const fieldsValidation = BookingValidator_1.BookingValidator.validateRequiredFields(request);
        if (!fieldsValidation.valid) {
            throw new AppError_1.ValidationError(fieldsValidation.error || 'Invalid booking request');
        }
        // 2. Validate date and time format
        const formatValidation = BookingValidator_1.BookingValidator.validateDateTimeFormat(request.preferredDate, request.preferredTime);
        if (!formatValidation.valid) {
            throw new AppError_1.ValidationError(formatValidation.error || 'Invalid date or time format');
        }
        // 3. Validate not self-booking
        const selfBookingValidation = BookingValidator_1.BookingValidator.validateNotSelfBooking(request.learnerId, request.providerId);
        if (!selfBookingValidation.valid) {
            throw new AppError_1.ValidationError(selfBookingValidation.error || 'Cannot book your own skill');
        }
        // 4. Verify skill exists and belongs to provider
        const skill = await this.skillRepository.findById(request.skillId);
        if (!skill) {
            throw new AppError_1.NotFoundError('Skill not found');
        }
        if (skill.providerId !== request.providerId) {
            throw new AppError_1.ValidationError('Skill does not belong to the specified provider');
        }
        // 5. Verify learner exists and has sufficient credits
        const learner = await this.userRepository.findById(request.learnerId);
        if (!learner) {
            throw new AppError_1.NotFoundError('Learner not found');
        }
        const sessionCost = skill.creditsPerHour * skill.durationHours;
        if (learner.credits < sessionCost) {
            throw new AppError_1.ValidationError(`Insufficient credits. Required: ${sessionCost}, Available: ${learner.credits}`);
        }
        // 6. Check for duplicate booking
        const duplicate = await this.bookingRepository.findDuplicateBooking(request.learnerId, request.skillId, request.preferredDate, request.preferredTime);
        if (duplicate) {
            throw new AppError_1.ValidationError('You already have a booking for this skill at this time');
        }
        // 7. Get provider availability settings
        const availability = await this.availabilityRepository.findByProviderId(request.providerId);
        if (availability) {
            // Validate booking is not in the past
            const pastValidation = BookingValidator_1.BookingValidator.validateDateNotInPast(request.preferredDate, request.preferredTime, availability.timezone);
            if (!pastValidation.valid) {
                throw new AppError_1.ValidationError(pastValidation.error || 'Booking date must be in the future');
            }
            // Validate advance booking window
            const bookingDate = DateTimeUtils_1.DateTimeUtils.parseDateTime(request.preferredDate, request.preferredTime);
            const advanceValidation = BookingValidator_1.BookingValidator.validateWithinAdvanceBookingWindow(bookingDate, availability.minAdvanceBooking, availability.maxAdvanceBooking);
            if (!advanceValidation.valid) {
                throw new AppError_1.ValidationError(advanceValidation.error || 'Booking outside allowed time window');
            }
            // Validate against blocked dates
            const blockedDates = availability.blockedDates;
            const blockedValidation = BookingValidator_1.BookingValidator.validateAgainstBlockedDates(request.preferredDate, blockedDates);
            if (!blockedValidation.valid) {
                throw new AppError_1.ValidationError(blockedValidation.error || 'Provider unavailable on this date');
            }
            // Validate session doesn't cross midnight
            const midnightValidation = BookingValidator_1.BookingValidator.validateSessionWithinSameDay(request.preferredDate, request.preferredTime, skill.durationHours, availability.timezone);
            if (!midnightValidation.valid) {
                throw new AppError_1.ValidationError(midnightValidation.error || 'Session cannot cross midnight');
            }
            // Validate within working hours
            const dayOfWeek = new Date(request.preferredDate).toLocaleDateString('en-US', { weekday: 'long' });
            const weeklySchedule = availability.weeklySchedule;
            const daySchedule = weeklySchedule[dayOfWeek];
            if (daySchedule) {
                const workingHoursValidation = BookingValidator_1.BookingValidator.validateWithinWorkingHours(request.preferredTime, skill.durationHours, daySchedule);
                if (!workingHoursValidation.valid) {
                    throw new AppError_1.ValidationError(workingHoursValidation.error || 'Outside provider working hours');
                }
            }
            // Check for overlapping bookings with buffer
            const [startHours, startMinutes] = request.preferredTime.split(':').map(Number);
            const startDate = new Date(request.preferredDate);
            startDate.setHours(startHours, startMinutes, 0, 0);
            const endDate = DateTimeUtils_1.DateTimeUtils.addHours(startDate, skill.durationHours);
            const endTime = DateTimeUtils_1.DateTimeUtils.formatTime(endDate);
            const overlapping = await this.bookingRepository.findOverlappingWithBuffer(request.providerId, startDate, request.preferredTime, endTime, availability.bufferTime);
            if (overlapping.length > 0) {
                throw new AppError_1.ValidationError('This time slot conflicts with an existing booking');
            }
            // Check max sessions per day if configured
            if (availability.maxSessionsPerDay) {
                const sessionsCount = await this.bookingRepository.countActiveBookingsByProviderAndDate(request.providerId, request.preferredDate);
                if (sessionsCount >= availability.maxSessionsPerDay) {
                    throw new AppError_1.ValidationError(`Provider has reached maximum sessions for this day (${availability.maxSessionsPerDay})`);
                }
            }
        }
        // 8. Calculate start and end times for the booking
        const [startHours, startMinutes] = request.preferredTime.split(':').map(Number);
        const startAt = new Date(request.preferredDate);
        startAt.setHours(startHours, startMinutes, 0, 0);
        const endAt = DateTimeUtils_1.DateTimeUtils.addHours(startAt, skill.durationHours);
        // 9. Create booking entity
        const booking = Booking_1.Booking.create({
            learnerId: request.learnerId,
            skillId: request.skillId,
            providerId: request.providerId,
            preferredDate: request.preferredDate,
            preferredTime: request.preferredTime,
            message: request.message || null,
            sessionCost,
            status: 'pending',
            startAt,
            endAt,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        // 9. Create booking with transaction (deducts credits from learner)
        const createdBooking = await this.bookingRepository.createTransactional(booking, sessionCost);
        // TODO: Send notification to provider
        // TODO: Send confirmation to learner
        return this.bookingMapper.toDTO(createdBooking);
    }
};
exports.CreateBookingUseCase = CreateBookingUseCase;
exports.CreateBookingUseCase = CreateBookingUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IBookingRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ISkillRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IAvailabilityRepository)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IBookingMapper)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], CreateBookingUseCase);
//# sourceMappingURL=CreateBookingUseCase.js.map