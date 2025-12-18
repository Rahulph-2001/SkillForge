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
exports.GetOccupiedSlotsUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const Booking_1 = require("../../../domain/entities/Booking");
let GetOccupiedSlotsUseCase = class GetOccupiedSlotsUseCase {
    constructor(bookingRepository) {
        this.bookingRepository = bookingRepository;
    }
    async execute(providerId, startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const bookings = await this.bookingRepository.findInDateRange(providerId, start, end);
        return bookings
            .filter(b => b.status === Booking_1.BookingStatus.CONFIRMED || b.status === Booking_1.BookingStatus.PENDING)
            .map(b => {
            // Fallback if startAt/endAt not migrated for old records (though we should assume new system)
            if (b.startAt && b.endAt) {
                return {
                    start: b.startAt.toISOString(),
                    end: b.endAt.toISOString()
                };
            }
            // Fallback logic for old data or if null
            const startTime = new Date(b.preferredDate);
            const [h, m] = b.preferredTime.split(':').map(Number);
            startTime.setHours(h, m, 0, 0);
            const durationMs = (b.duration || 60) * 60 * 1000;
            const endTime = new Date(startTime.getTime() + durationMs);
            return {
                start: startTime.toISOString(),
                end: endTime.toISOString()
            };
        });
    }
};
exports.GetOccupiedSlotsUseCase = GetOccupiedSlotsUseCase;
exports.GetOccupiedSlotsUseCase = GetOccupiedSlotsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IBookingRepository)),
    __metadata("design:paramtypes", [Object])
], GetOccupiedSlotsUseCase);
//# sourceMappingURL=GetOccupiedSlotsUseCase.js.map