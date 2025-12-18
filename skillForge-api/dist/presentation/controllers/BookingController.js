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
exports.BookingController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../infrastructure/di/types");
const CancelBookingUseCase_1 = require("../../application/useCases/booking/CancelBookingUseCase");
const HttpStatusCode_1 = require("../../domain/enums/HttpStatusCode");
let BookingController = class BookingController {
    constructor(createBookingUseCase, cancelBookingUseCase, bookingRepository, bookingMapper, responseBuilder) {
        this.createBookingUseCase = createBookingUseCase;
        this.cancelBookingUseCase = cancelBookingUseCase;
        this.bookingRepository = bookingRepository;
        this.bookingMapper = bookingMapper;
        this.responseBuilder = responseBuilder;
        this.createBooking = async (req, res, next) => {
            try {
                const userId = req.user?.id;
                if (!userId) {
                    const error = this.responseBuilder.error('UNAUTHORIZED', 'Unauthorized', HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED);
                    res.status(error.statusCode).json(error.body);
                    return;
                }
                const { skillId, providerId, preferredDate, preferredTime, message } = req.body;
                // Validation
                if (!skillId || !providerId || !preferredDate || !preferredTime) {
                    const error = this.responseBuilder.error('VALIDATION_ERROR', 'Missing required fields', HttpStatusCode_1.HttpStatusCode.BAD_REQUEST);
                    res.status(error.statusCode).json(error.body);
                    return;
                }
                const request = {
                    learnerId: userId,
                    skillId,
                    providerId,
                    preferredDate,
                    preferredTime,
                    message,
                };
                const booking = await this.createBookingUseCase.execute(request);
                const response = this.responseBuilder.success(booking, 'Booking created successfully', HttpStatusCode_1.HttpStatusCode.CREATED);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.getMyBookings = async (req, res, next) => {
            try {
                const userId = req.user?.id;
                if (!userId) {
                    const error = this.responseBuilder.error('UNAUTHORIZED', 'Unauthorized', HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED);
                    res.status(error.statusCode).json(error.body);
                    return;
                }
                const bookings = await this.bookingRepository.findByLearnerId(userId);
                const bookingDTOs = this.bookingMapper.toDTOs(bookings);
                console.log('🔍 [BookingController] getMyBookings response DTOs (first 1):', bookingDTOs.length > 0 ? JSON.stringify(bookingDTOs[0], null, 2) : 'No bookings');
                const response = this.responseBuilder.success(bookingDTOs, 'Bookings fetched successfully', HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.getUpcomingSessions = async (req, res, next) => {
            try {
                const userId = req.user?.id;
                if (!userId) {
                    const error = this.responseBuilder.error('UNAUTHORIZED', 'Unauthorized', HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED);
                    res.status(error.statusCode).json(error.body);
                    return;
                }
                // NOTE: Repository doesn't have findUpcoming yet. Fetching all and filtering.
                // In production, add findUpcoming to Repository for efficiency.
                const bookings = await this.bookingRepository.findByLearnerId(userId);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const upcoming = bookings.filter(b => {
                    const date = new Date(b.preferredDate);
                    return date >= today && (b.status === 'pending' || b.status === 'confirmed');
                });
                // Sort by date asc
                upcoming.sort((a, b) => new Date(a.preferredDate).getTime() - new Date(b.preferredDate).getTime());
                const bookingDTOs = this.bookingMapper.toDTOs(upcoming);
                const response = this.responseBuilder.success(bookingDTOs, 'Upcoming sessions fetched successfully', HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.getBookingById = async (req, res, next) => {
            try {
                const userId = req.user?.id;
                const { id } = req.params;
                if (!userId) {
                    const error = this.responseBuilder.error('UNAUTHORIZED', 'Unauthorized', HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED);
                    res.status(error.statusCode).json(error.body);
                    return;
                }
                const booking = await this.bookingRepository.findById(id);
                if (!booking) {
                    const error = this.responseBuilder.error('NOT_FOUND', 'Booking not found', HttpStatusCode_1.HttpStatusCode.NOT_FOUND);
                    res.status(error.statusCode).json(error.body);
                    return;
                }
                // Check ownership
                if (booking.learnerId !== userId && booking.providerId !== userId) {
                    const error = this.responseBuilder.error('FORBIDDEN', 'Unauthorized to view this booking', HttpStatusCode_1.HttpStatusCode.FORBIDDEN);
                    res.status(error.statusCode).json(error.body);
                    return;
                }
                const response = this.responseBuilder.success(this.bookingMapper.toDTO(booking), 'Booking fetched successfully', HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.cancelBooking = async (req, res, next) => {
            try {
                const userId = req.user?.id;
                const { id } = req.params;
                const { reason } = req.body;
                if (!userId) {
                    const error = this.responseBuilder.error('UNAUTHORIZED', 'Unauthorized', HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED);
                    res.status(error.statusCode).json(error.body);
                    return;
                }
                await this.cancelBookingUseCase.execute({
                    bookingId: id,
                    userId,
                    reason
                });
                const response = this.responseBuilder.success(null, 'Booking cancelled successfully', HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
    }
};
exports.BookingController = BookingController;
exports.BookingController = BookingController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CreateBookingUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.CancelBookingUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IBookingRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IBookingMapper)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [Object, CancelBookingUseCase_1.CancelBookingUseCase, Object, Object, Object])
], BookingController);
//# sourceMappingURL=BookingController.js.map