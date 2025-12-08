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
const uuid_1 = require("uuid");
const types_1 = require("../../../infrastructure/di/types");
const Booking_1 = require("../../../domain/entities/Booking");
const AppError_1 = require("../../../domain/errors/AppError");
let CreateBookingUseCase = class CreateBookingUseCase {
    constructor(skillRepository, userRepository, bookingRepository, availabilityRepository, bookingMapper) {
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.availabilityRepository = availabilityRepository;
        this.bookingMapper = bookingMapper;
    }
    async execute(request) {
        const { learnerId, skillId, providerId, preferredDate, preferredTime, message } = request;
        const skill = await this.skillRepository.findById(skillId);
        if (!skill) {
            throw new AppError_1.NotFoundError('Skill not found');
        }
        if (skill.status !== 'approved') {
            throw new AppError_1.ValidationError('This skill is not available for booking');
        }
        if (skill.isBlocked) {
            throw new AppError_1.ValidationError('This skill is currently blocked');
        }
        if (skill.providerId !== providerId) {
            throw new AppError_1.ValidationError('Invalid provider for this skill');
        }
        // Validate learner is not the provider
        if (learnerId === providerId) {
            throw new AppError_1.ValidationError('You cannot book your own skill');
        }
        // Calculate session cost
        const sessionCost = skill.creditsPerHour * skill.durationHours;
        // Validate learner has sufficient credits
        const learner = await this.userRepository.findById(learnerId);
        if (!learner) {
            throw new AppError_1.NotFoundError('Learner not found');
        }
        if (learner.credits < sessionCost) {
            throw new AppError_1.ValidationError('Insufficient credits to book this session');
        }
        // Validate date is in the future
        const preferredDateTime = new Date(`${preferredDate}T${preferredTime}`);
        if (preferredDateTime <= new Date()) {
            throw new AppError_1.ValidationError('Preferred date and time must be in the future');
        }
        // --- Availability Validation ---
        const availability = await this.availabilityRepository.findByProviderId(providerId);
        if (!availability) {
            throw new AppError_1.ValidationError('Provider availability not set');
        }
        // 1. Check Blocked Dates
        const isBlocked = availability.blockedDates.some(d => d.date === preferredDate);
        if (isBlocked) {
            throw new AppError_1.ValidationError('Provider is not available on this date');
        }
        // 2. Check Weekly Schedule
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[preferredDateTime.getDay()];
        const daySchedule = availability.weeklySchedule[dayName];
        if (!daySchedule || !daySchedule.enabled) {
            throw new AppError_1.ValidationError(`Provider is not available on ${dayName}s`);
        }
        // 3. Check Time Slots
        const isTimeValid = daySchedule.slots.some(slot => {
            const slotStart = new Date(`${preferredDate}T${slot.start}`);
            const slotEnd = new Date(`${preferredDate}T${slot.end}`);
            // Simple check: preferred time must be >= slot start AND (preferred time + duration) <= slot end
            // Assuming duration is in hours
            const sessionEnd = new Date(preferredDateTime.getTime() + skill.durationHours * 60 * 60 * 1000);
            return preferredDateTime >= slotStart && sessionEnd <= slotEnd;
        });
        if (!isTimeValid) {
            throw new AppError_1.ValidationError('Selected time is outside provider\'s available slots');
        }
        // Create booking entity
        const booking = Booking_1.Booking.create({
            id: (0, uuid_1.v4)(),
            learnerId,
            skillId,
            providerId,
            preferredDate,
            preferredTime,
            message: message || null,
            status: Booking_1.BookingStatus.PENDING,
            sessionCost,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        // Persist booking
        const createdBooking = await this.bookingRepository.create(booking);
        // Return DTO
        return this.bookingMapper.toDTO(createdBooking);
    }
};
exports.CreateBookingUseCase = CreateBookingUseCase;
exports.CreateBookingUseCase = CreateBookingUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ISkillRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IBookingRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IAvailabilityRepository)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IBookingMapper)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], CreateBookingUseCase);
//# sourceMappingURL=CreateBookingUseCase.js.map