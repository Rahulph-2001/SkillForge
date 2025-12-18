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
exports.GetSkillDetailsUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
let GetSkillDetailsUseCase = class GetSkillDetailsUseCase {
    constructor(skillRepository, userRepository, availabilityRepository, bookingRepository, skillDetailsMapper) {
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
        this.availabilityRepository = availabilityRepository;
        this.bookingRepository = bookingRepository;
        this.skillDetailsMapper = skillDetailsMapper;
    }
    async execute(skillId) {
        const skill = await this.skillRepository.findById(skillId);
        if (!skill)
            throw new AppError_1.NotFoundError('Skill not found');
        // Check if skill is active
        if (skill.status !== 'approved' || skill.isBlocked) {
            throw new AppError_1.NotFoundError('This skill is currently not available');
        }
        const provider = await this.userRepository.findById(skill.providerId);
        if (!provider)
            throw new AppError_1.NotFoundError('Provider not found');
        // 1. Get Provider Statistics (Rating)
        const providerSkills = await this.skillRepository.findByProviderId(skill.providerId);
        const validSkills = providerSkills.filter(s => s.status === 'approved' && !s.isBlocked);
        const totalRating = validSkills.reduce((sum, s) => sum + (s.rating || 0), 0);
        const avgRating = validSkills.length ? totalRating / validSkills.length : 0;
        const reviewCount = validSkills.reduce((sum, s) => sum + (s.totalSessions || 0), 0); // Approx logic
        // 2. Fetch Availability & Booked Slots
        const availability = await this.availabilityRepository.findByProviderId(skill.providerId);
        let enrichedAvailability = null;
        if (availability) {
            // Calculate date range (Next 30 days)
            const today = new Date();
            const nextMonth = new Date();
            nextMonth.setDate(today.getDate() + 30);
            // Fetch existing confirmed/pending bookings
            const activeBookings = await this.bookingRepository.findInDateRange(skill.providerId, today, nextMonth);
            // Map to simple objects for Frontend to gray out
            // User Request: Only show bookings related to THIS skill.
            const bookedSlots = activeBookings
                .filter((b) => b.skillId === skillId)
                .map((b) => ({
                id: b.id,
                title: b.skillTitle || 'Session',
                date: b.preferredDate,
                startTime: b.preferredTime,
                endTime: this.calculateEndTime(b.preferredTime, b.duration || (skill.durationHours * 60))
            }));
            enrichedAvailability = {
                ...availability,
                bookedSlots // <-- Crucial for "Industrial" feel
            };
        }
        return this.skillDetailsMapper.toDTO(skill, provider, { rating: Number(avgRating.toFixed(1)), reviewCount }, enrichedAvailability);
    }
    calculateEndTime(startTime, durationMinutes) {
        const [h, m] = startTime.split(':').map(Number);
        const totalMinutes = h * 60 + m + durationMinutes;
        const endH = Math.floor(totalMinutes / 60);
        const endM = totalMinutes % 60;
        return `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
    }
};
exports.GetSkillDetailsUseCase = GetSkillDetailsUseCase;
exports.GetSkillDetailsUseCase = GetSkillDetailsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ISkillRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IAvailabilityRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IBookingRepository)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.ISkillDetailsMapper)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], GetSkillDetailsUseCase);
//# sourceMappingURL=GetSkillDetailsUseCase.js.map