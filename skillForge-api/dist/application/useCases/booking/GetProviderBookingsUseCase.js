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
exports.GetProviderBookingsUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
let GetProviderBookingsUseCase = class GetProviderBookingsUseCase {
    constructor(bookingRepository) {
        this.bookingRepository = bookingRepository;
    }
    async execute(request) {
        try {
            // 1. Get bookings based on filter
            let bookings;
            if (request.status) {
                bookings = await this.bookingRepository.findByProviderIdAndStatus(request.providerId, request.status);
            }
            else {
                bookings = await this.bookingRepository.findByProviderId(request.providerId);
            }
            // 2. Get statistics
            const stats = await this.bookingRepository.getProviderStats(request.providerId);
            return {
                success: true,
                message: 'Bookings retrieved successfully',
                bookings: bookings.map((b) => b.toObject()),
                stats,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to retrieve bookings',
            };
        }
    }
};
exports.GetProviderBookingsUseCase = GetProviderBookingsUseCase;
exports.GetProviderBookingsUseCase = GetProviderBookingsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IBookingRepository)),
    __metadata("design:paramtypes", [Object])
], GetProviderBookingsUseCase);
//# sourceMappingURL=GetProviderBookingsUseCase.js.map