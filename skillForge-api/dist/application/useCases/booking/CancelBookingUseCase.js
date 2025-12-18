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
exports.CancelBookingUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
let CancelBookingUseCase = class CancelBookingUseCase {
    constructor(bookingRepository) {
        this.bookingRepository = bookingRepository;
    }
    async execute(request) {
        const { bookingId, userId, reason } = request;
        // 1. Fetch Booking
        const booking = await this.bookingRepository.findById(bookingId);
        if (!booking)
            throw new AppError_1.NotFoundError('Booking not found');
        // 2. Authorization Check
        if (booking.learnerId !== userId && booking.providerId !== userId) {
            throw new AppError_1.ForbiddenError('You are not authorized to cancel this booking');
        }
        // 3. Status Validation
        if (!booking.canBeCancelled()) {
            throw new AppError_1.ValidationError('Booking cannot be cancelled in its current state');
        }
        // 4. Perform Transactional Cancellation (Refunds credits automatically)
        await this.bookingRepository.cancelTransactional(bookingId, userId, reason || 'Cancelled by user');
    }
};
exports.CancelBookingUseCase = CancelBookingUseCase;
exports.CancelBookingUseCase = CancelBookingUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IBookingRepository)),
    __metadata("design:paramtypes", [Object])
], CancelBookingUseCase);
//# sourceMappingURL=CancelBookingUseCase.js.map