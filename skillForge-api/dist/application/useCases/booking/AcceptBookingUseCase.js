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
exports.AcceptBookingUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
let AcceptBookingUseCase = class AcceptBookingUseCase {
    constructor(bookingRepository, bookingMapper) {
        this.bookingRepository = bookingRepository;
        this.bookingMapper = bookingMapper;
    }
    async execute(request) {
        // 1. Find the booking
        const booking = await this.bookingRepository.findById(request.bookingId);
        if (!booking) {
            throw new AppError_1.NotFoundError('Booking not found');
        }
        // 2. Verify the provider owns this booking
        if (booking.providerId !== request.providerId) {
            throw new AppError_1.ForbiddenError('Unauthorized: You can only accept your own bookings');
        }
        // 3. Check if booking can be accepted
        if (!booking.canBeAccepted()) {
            throw new AppError_1.ValidationError(`Cannot accept booking with status: ${booking.status}`);
        }
        // 4. Update booking status to confirmed (Transactional: Credits Provider)
        const updatedBooking = await this.bookingRepository.confirmTransactional(request.bookingId);
        // TODO: Send notification to learner
        // TODO: Add to calendar
        // TODO: Update provider statistics
        return this.bookingMapper.toDTO(updatedBooking);
    }
};
exports.AcceptBookingUseCase = AcceptBookingUseCase;
exports.AcceptBookingUseCase = AcceptBookingUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IBookingRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IBookingMapper)),
    __metadata("design:paramtypes", [Object, Object])
], AcceptBookingUseCase);
//# sourceMappingURL=AcceptBookingUseCase.js.map