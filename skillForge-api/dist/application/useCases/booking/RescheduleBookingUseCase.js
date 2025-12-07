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
let RescheduleBookingUseCase = class RescheduleBookingUseCase {
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
            // 2. Verify authorization (User must be learner or provider)
            const isLearner = booking.learnerId === request.userId;
            const isProvider = booking.providerId === request.userId;
            if (!isLearner && !isProvider) {
                return {
                    success: false,
                    message: 'Unauthorized to reschedule this booking',
                };
            }
            // 3. Verify booking can be rescheduled
            if (!booking.canBeRescheduled()) {
                return {
                    success: false,
                    message: `Cannot reschedule booking with status: ${booking.status}`,
                };
            }
            // 4. Validate new date is in the future
            const newDateTime = new Date(`${request.newDate}T${request.newTime}`);
            if (newDateTime <= new Date()) {
                return {
                    success: false,
                    message: 'Reschedule date must be in the future',
                };
            }
            // 5. Create reschedule info
            const rescheduleInfo = {
                newDate: request.newDate,
                newTime: request.newTime,
                reason: request.reason,
                requestedBy: isLearner ? 'learner' : 'provider',
                requestedAt: new Date(),
            };
            // 6. Update booking with reschedule request
            await this.bookingRepository.updateWithReschedule(request.bookingId, rescheduleInfo);
            return {
                success: true,
                message: 'Reschedule request submitted successfully. Waiting for approval.',
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to request reschedule',
            };
        }
    }
};
exports.RescheduleBookingUseCase = RescheduleBookingUseCase;
exports.RescheduleBookingUseCase = RescheduleBookingUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IBookingRepository)),
    __metadata("design:paramtypes", [Object])
], RescheduleBookingUseCase);
//# sourceMappingURL=RescheduleBookingUseCase.js.map