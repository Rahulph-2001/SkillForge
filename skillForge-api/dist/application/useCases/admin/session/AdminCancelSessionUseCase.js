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
exports.AdminCancelSessionUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../../infrastructure/di/types");
const Booking_1 = require("../../../../domain/entities/Booking");
let AdminCancelSessionUseCase = class AdminCancelSessionUseCase {
    constructor(bookingRepository, escrowRepository, bookingMapper) {
        this.bookingRepository = bookingRepository;
        this.escrowRepository = escrowRepository;
        this.bookingMapper = bookingMapper;
    }
    async execute(bookingId, reason) {
        // Admin cancellation - process refund via escrow
        try {
            await this.escrowRepository.refundCredits(bookingId);
        }
        catch (error) {
            // Log error or handle specific cases (e.g. if already refunded or no escrow)
            // For now, allow proceeding to update status if refund fails (e.g. legacy booking)
            // But usually we should propagate unless we want to force status update.
            // Given "Strict Architecture", we should probably propagate error if escrow is expected.
            // However, to be robust for legacy, we can check error type.
            // Let's assume we propagate for now to ensure data consistency.
            throw error;
        }
        const booking = await this.bookingRepository.updateStatus(bookingId, Booking_1.BookingStatus.CANCELLED, reason);
        return this.bookingMapper.toDTO(booking);
    }
};
exports.AdminCancelSessionUseCase = AdminCancelSessionUseCase;
exports.AdminCancelSessionUseCase = AdminCancelSessionUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IBookingRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IEscrowRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IBookingMapper)),
    __metadata("design:paramtypes", [Object, Object, Object])
], AdminCancelSessionUseCase);
//# sourceMappingURL=AdminCancelSessionUseCase.js.map