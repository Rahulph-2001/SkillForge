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
exports.AcceptRescheduleUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
let AcceptRescheduleUseCase = class AcceptRescheduleUseCase {
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
                    message: 'Unauthorized to accept this reschedule request',
                };
            }
            // 3. Verify booking has a reschedule request
            if (!booking.isRescheduleRequest()) {
                return {
                    success: false,
                    message: 'No reschedule request found for this booking',
                };
            }
            // 4. Get reschedule info
            const rescheduleInfo = booking.rescheduleInfo;
            if (!rescheduleInfo) {
                return {
                    success: false,
                    message: 'Reschedule information not found',
                };
            }
            // 5. Update booking with new date/time and set status to confirmed
            // We need to update the booking's preferred date and time
            await this.bookingRepository.acceptReschedule(request.bookingId, rescheduleInfo.newDate, rescheduleInfo.newTime);
            // TODO: Send notification to learner about accepted reschedule
            return {
                success: true,
                message: 'Reschedule request accepted successfully',
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to accept reschedule request',
            };
        }
    }
};
exports.AcceptRescheduleUseCase = AcceptRescheduleUseCase;
exports.AcceptRescheduleUseCase = AcceptRescheduleUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IBookingRepository)),
    __metadata("design:paramtypes", [Object])
], AcceptRescheduleUseCase);
//# sourceMappingURL=AcceptRescheduleUseCase.js.map