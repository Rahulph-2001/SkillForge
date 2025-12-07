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
exports.DeclineRescheduleUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
let DeclineRescheduleUseCase = class DeclineRescheduleUseCase {
    constructor(bookingRepository) {
        this.bookingRepository = bookingRepository;
    }
    async execute(request) {
        try {
            // 1. Get the booking
            const booking = await this.bookingRepository.findById(request.bookingId);
            if (!booking) {
                return {
                    success: false,
                    message: 'Booking not found',
                };
            }
            // 2. Verify authorization (Must be the provider)
            if (booking.providerId !== request.providerId) {
                return {
                    success: false,
                    message: 'Unauthorized to decline this reschedule request',
                };
            }
            // 3. Verify booking has a reschedule request
            if (!booking.isRescheduleRequest()) {
                return {
                    success: false,
                    message: 'No reschedule request found for this booking',
                };
            }
            // 4. Decline the reschedule request (revert to confirmed status and clear reschedule info)
            await this.bookingRepository.declineReschedule(request.bookingId, request.reason);
            // TODO: Send notification to learner about declined reschedule
            return {
                success: true,
                message: 'Reschedule request declined',
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to decline reschedule request',
            };
        }
    }
};
exports.DeclineRescheduleUseCase = DeclineRescheduleUseCase;
exports.DeclineRescheduleUseCase = DeclineRescheduleUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IBookingRepository)),
    __metadata("design:paramtypes", [Object])
], DeclineRescheduleUseCase);
//# sourceMappingURL=DeclineRescheduleUseCase.js.map