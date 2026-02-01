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
exports.GetSessionInfoUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
let GetSessionInfoUseCase = class GetSessionInfoUseCase {
    constructor(bookingRepository) {
        this.bookingRepository = bookingRepository;
    }
    async execute(bookingId) {
        const booking = await this.bookingRepository.findById(bookingId);
        if (!booking)
            throw new AppError_1.NotFoundError('Booking not found');
        return {
            providerId: booking.providerId,
            skillTitle: booking.skillTitle || 'Video Session',
            providerName: booking.providerName || 'Provider',
            providerAvatar: booking.providerAvatar || null,
            learnerName: booking.learnerName || 'Learner',
            learnerAvatar: booking.learnerAvatar || null,
            scheduledAt: this.parseDateTime(booking.preferredDate, booking.preferredTime),
            duration: booking.duration || 60,
        };
    }
    parseDateTime(dateString, timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date(dateString);
        date.setHours(hours, minutes, 0, 0);
        return date;
    }
};
exports.GetSessionInfoUseCase = GetSessionInfoUseCase;
exports.GetSessionInfoUseCase = GetSessionInfoUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IBookingRepository)),
    __metadata("design:paramtypes", [Object])
], GetSessionInfoUseCase);
//# sourceMappingURL=GetSessionInfoUseCase.js.map