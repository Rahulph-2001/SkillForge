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
const HttpStatusCode_1 = require("../../domain/enums/HttpStatusCode");
let BookingController = class BookingController {
    constructor(createBookingUseCase, cancelBookingUseCase, getMyBookingsUseCase, getUpcomingSessionsUseCase, getBookingByIdUseCase, completeSessionUseCase, responseBuilder) {
        this.createBookingUseCase = createBookingUseCase;
        this.cancelBookingUseCase = cancelBookingUseCase;
        this.getMyBookingsUseCase = getMyBookingsUseCase;
        this.getUpcomingSessionsUseCase = getUpcomingSessionsUseCase;
        this.getBookingByIdUseCase = getBookingByIdUseCase;
        this.completeSessionUseCase = completeSessionUseCase;
        this.responseBuilder = responseBuilder;
        this.createBooking = async (req, res, next) => {
            try {
                const userId = req.user?.userId;
                if (!userId) {
                    const error = this.responseBuilder.error('UNAUTHORIZED', 'Unauthorized', HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED);
                    res.status(error.statusCode).json(error.body);
                    return;
                }
                const { skillId, providerId, preferredDate, preferredTime, message } = req.body;
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
                const userId = req.user?.userId;
                if (!userId) {
                    const error = this.responseBuilder.error('UNAUTHORIZED', 'Unauthorized', HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED);
                    res.status(error.statusCode).json(error.body);
                    return;
                }
                const bookings = await this.getMyBookingsUseCase.execute(userId);
                const response = this.responseBuilder.success(bookings, 'Bookings fetched successfully', HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.getUpcomingSessions = async (req, res, next) => {
            try {
                const userId = req.user?.userId;
                if (!userId) {
                    const error = this.responseBuilder.error('UNAUTHORIZED', 'Unauthorized', HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED);
                    res.status(error.statusCode).json(error.body);
                    return;
                }
                const bookings = await this.getUpcomingSessionsUseCase.execute(userId);
                const response = this.responseBuilder.success(bookings, 'Upcoming sessions fetched successfully', HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.getBookingById = async (req, res, next) => {
            try {
                const userId = req.user?.userId;
                const { id } = req.params;
                if (!userId) {
                    const error = this.responseBuilder.error('UNAUTHORIZED', 'Unauthorized', HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED);
                    res.status(error.statusCode).json(error.body);
                    return;
                }
                const booking = await this.getBookingByIdUseCase.execute(id, userId);
                const response = this.responseBuilder.success(booking, 'Booking fetched successfully', HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.cancelBooking = async (req, res, next) => {
            try {
                const userId = req.user?.userId;
                const { id } = req.params;
                const { reason } = req.body;
                if (!userId) {
                    const error = this.responseBuilder.error('UNAUTHORIZED', 'Unauthorized', HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED);
                    res.status(error.statusCode).json(error.body);
                    return;
                }
                const request = {
                    bookingId: id,
                    userId,
                    reason,
                };
                await this.cancelBookingUseCase.execute(request);
                const response = this.responseBuilder.success(null, 'Booking cancelled successfully', HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.completeSession = async (req, res, next) => {
            try {
                const userId = req.user?.userId;
                const { id } = req.params;
                if (!userId) {
                    const error = this.responseBuilder.error('UNAUTHORIZED', 'Unauthorized', HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED);
                    res.status(error.statusCode).json(error.body);
                    return;
                }
                const booking = await this.completeSessionUseCase.execute({
                    bookingId: id,
                    completedBy: userId,
                });
                const response = this.responseBuilder.success(booking, 'Session completed successfully. Credits released to provider.', HttpStatusCode_1.HttpStatusCode.OK);
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
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ICreateBookingUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ICancelBookingUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IGetMyBookingsUseCase)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IGetUpcomingSessionsUseCase)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IGetBookingByIdUseCase)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.ICompleteSessionUseCase)),
    __param(6, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], BookingController);
//# sourceMappingURL=BookingController.js.map