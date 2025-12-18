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
exports.UpdateProviderAvailabilityUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const ProviderAvailability_1 = require("../../../domain/entities/ProviderAvailability");
let UpdateProviderAvailabilityUseCase = class UpdateProviderAvailabilityUseCase {
    constructor(availabilityRepository) {
        this.availabilityRepository = availabilityRepository;
    }
    async execute(providerId, data) {
        // Industrial Level Validation: Sanitize and Merge Overlapping Slots
        if (data.weeklySchedule) {
            data.weeklySchedule = this.validateAndMergeSchedule(data.weeklySchedule);
        }
        const existing = await this.availabilityRepository.findByProviderId(providerId);
        if (!existing) {
            const newAvailability = ProviderAvailability_1.ProviderAvailability.create(providerId, data.weeklySchedule, data.timezone, data.bufferTime, data.minAdvanceBooking, data.maxAdvanceBooking, data.autoAccept, data.blockedDates, data.maxSessionsPerDay);
            return this.availabilityRepository.create(newAvailability);
        }
        return this.availabilityRepository.update(providerId, data);
    }
    validateAndMergeSchedule(schedule) {
        const result = { ...schedule };
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        for (const day of days) {
            if (result[day] && result[day].enabled && result[day].slots && result[day].slots.length > 0) {
                result[day].slots = this.mergeSlots(result[day].slots);
            }
        }
        return result;
    }
    mergeSlots(slots) {
        // 1. Convert to minutes for easy comparison
        const timeToMin = (t) => {
            const [h, m] = t.split(':').map(Number);
            return h * 60 + m;
        };
        const minToTime = (min) => {
            const h = Math.floor(min / 60).toString().padStart(2, '0');
            const m = (min % 60).toString().padStart(2, '0');
            return `${h}:${m}`;
        };
        // 2. Map, Sort by Start Time
        const ranges = slots
            .map(s => ({ start: timeToMin(s.start), end: timeToMin(s.end) }))
            .sort((a, b) => a.start - b.start);
        // 3. Merge Overlaps
        const merged = [];
        for (const current of ranges) {
            if (current.start >= current.end)
                continue; // Skip invalid slots (e.g. 5pm to 4pm)
            if (merged.length === 0) {
                merged.push(current);
            }
            else {
                const prev = merged[merged.length - 1];
                // Overlap or Adjacent: Current Start <= Previous End
                if (current.start <= prev.end) {
                    prev.end = Math.max(prev.end, current.end);
                }
                else {
                    merged.push(current);
                }
            }
        }
        // 4. Convert back
        return merged.map(r => ({ start: minToTime(r.start), end: minToTime(r.end) }));
    }
};
exports.UpdateProviderAvailabilityUseCase = UpdateProviderAvailabilityUseCase;
exports.UpdateProviderAvailabilityUseCase = UpdateProviderAvailabilityUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IAvailabilityRepository)),
    __metadata("design:paramtypes", [Object])
], UpdateProviderAvailabilityUseCase);
//# sourceMappingURL=UpdateProviderAvailabilityUseCase.js.map