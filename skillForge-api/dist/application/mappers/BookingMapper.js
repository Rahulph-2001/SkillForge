"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingMapper = void 0;
const inversify_1 = require("inversify");
let BookingMapper = class BookingMapper {
    toDTO(booking) {
        // Ensure booking has been persisted (has an ID)
        if (!booking.id) {
            throw new Error('Cannot map booking to DTO: booking has not been persisted');
        }
        // Debug log to check what's being mapped
        if (!booking.providerName) {
            console.log('⚠️ [BookingMapper] Warning: providerName is missing for booking:', booking.id, 'Provider object:', booking.providerName);
        }
        return {
            id: booking.id,
            skillId: booking.skillId,
            skillTitle: booking.skillTitle,
            providerId: booking.providerId,
            providerName: booking.providerName,
            providerAvatar: booking.providerAvatar,
            learnerId: booking.learnerId,
            learnerName: booking.learnerName,
            learnerAvatar: booking.learnerAvatar,
            preferredDate: booking.preferredDate,
            preferredTime: booking.preferredTime,
            duration: booking.duration,
            message: booking.message,
            status: booking.status,
            sessionCost: booking.sessionCost,
            rescheduleInfo: booking.rescheduleInfo,
            rejectionReason: booking.rejectionReason,
            isReviewed: booking.isReviewed,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt,
        };
    }
    toDTOs(bookings) {
        return bookings.map(b => this.toDTO(b));
    }
};
exports.BookingMapper = BookingMapper;
exports.BookingMapper = BookingMapper = __decorate([
    (0, inversify_1.injectable)()
], BookingMapper);
//# sourceMappingURL=BookingMapper.js.map