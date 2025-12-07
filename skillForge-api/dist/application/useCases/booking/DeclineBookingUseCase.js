"use strict";
/**
 * Decline Booking Use Case
 * Handles the business logic for declining a booking request
 * Following Single Responsibility Principle
 */
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
exports.DeclineBookingUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const Booking_1 = require("../../../domain/entities/Booking");
let DeclineBookingUseCase = class DeclineBookingUseCase {
    constructor(bookingRepository) {
        this.bookingRepository = bookingRepository;
    }
    async execute(request) {
        try {
            // 1. Find the booking
            const booking = await this.bookingRepository.findById(request.bookingId);
            if (!booking) {
                return {
                    success: false,
                    message: 'Booking not found',
                };
            }
            // 2. Verify the provider owns this booking
            if (booking.providerId !== request.providerId) {
                return {
                    success: false,
                    message: 'Unauthorized: You can only decline your own bookings',
                };
            }
            // 3. Check if booking can be rejected
            if (!booking.canBeRejected()) {
                return {
                    success: false,
                    message: `Cannot decline booking with status: ${booking.status}`,
                };
            }
            // 4. Update booking status to rejected
            await this.bookingRepository.updateStatus(request.bookingId, Booking_1.BookingStatus.REJECTED);
            // TODO: Refund credits to learner
            // TODO: Send notification to learner
            // TODO: Update provider statistics
            return {
                success: true,
                message: 'Booking declined successfully',
            };
        }
        catch (error) {
            console.error('[DeclineBookingUseCase] Error:', error);
            return {
                success: false,
                message: error.message || 'Failed to decline booking',
            };
        }
    }
};
exports.DeclineBookingUseCase = DeclineBookingUseCase;
exports.DeclineBookingUseCase = DeclineBookingUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IBookingRepository)),
    __metadata("design:paramtypes", [Object])
], DeclineBookingUseCase);
//# sourceMappingURL=DeclineBookingUseCase.js.map