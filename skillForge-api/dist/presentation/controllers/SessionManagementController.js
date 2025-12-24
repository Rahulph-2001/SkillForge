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
exports.SessionManagementController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../infrastructure/di/types");
const AcceptBookingUseCase_1 = require("../../application/useCases/booking/AcceptBookingUseCase");
const DeclineBookingUseCase_1 = require("../../application/useCases/booking/DeclineBookingUseCase");
const CancelBookingUseCase_1 = require("../../application/useCases/booking/CancelBookingUseCase");
const RescheduleBookingUseCase_1 = require("../../application/useCases/booking/RescheduleBookingUseCase");
const AcceptRescheduleUseCase_1 = require("../../application/useCases/booking/AcceptRescheduleUseCase");
const DeclineRescheduleUseCase_1 = require("../../application/useCases/booking/DeclineRescheduleUseCase");
const GetProviderBookingsUseCase_1 = require("../../application/useCases/booking/GetProviderBookingsUseCase");
const HttpStatusCode_1 = require("../../domain/enums/HttpStatusCode");
const messages_1 = require("../../config/messages");
let SessionManagementController = class SessionManagementController {
    constructor(acceptBookingUseCase, declineBookingUseCase, cancelBookingUseCase, rescheduleBookingUseCase, acceptRescheduleUseCase, declineRescheduleUseCase, getProviderBookingsUseCase, responseBuilder) {
        this.acceptBookingUseCase = acceptBookingUseCase;
        this.declineBookingUseCase = declineBookingUseCase;
        this.cancelBookingUseCase = cancelBookingUseCase;
        this.rescheduleBookingUseCase = rescheduleBookingUseCase;
        this.acceptRescheduleUseCase = acceptRescheduleUseCase;
        this.declineRescheduleUseCase = declineRescheduleUseCase;
        this.getProviderBookingsUseCase = getProviderBookingsUseCase;
        this.responseBuilder = responseBuilder;
    }
    async getProviderSessions(req, res, next) {
        try {
            const providerId = req.user?.id;
            const { status } = req.query;
            if (!providerId) {
                const response = this.responseBuilder.error('UNAUTHORIZED', messages_1.ERROR_MESSAGES.GENERAL.UNAUTHORIZED, HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED);
                res.status(response.statusCode).json(response.body);
                return;
            }
            const result = await this.getProviderBookingsUseCase.execute({
                providerId,
                status: status,
            });
            if (!result.success) {
                const response = this.responseBuilder.error('FETCH_FAILED', result.message || messages_1.ERROR_MESSAGES.BOOKING.SESSIONS_FETCH_FAILED, HttpStatusCode_1.HttpStatusCode.BAD_REQUEST);
                res.status(response.statusCode).json(response.body);
                return;
            }
            const response = this.responseBuilder.success({ sessions: result.bookings, stats: result.stats }, messages_1.SUCCESS_MESSAGES.BOOKING.SESSIONS_FETCHED, HttpStatusCode_1.HttpStatusCode.OK);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    async acceptBooking(req, res, next) {
        try {
            const providerId = req.user?.id;
            const { bookingId } = req.params;
            if (!providerId) {
                const response = this.responseBuilder.error('UNAUTHORIZED', messages_1.ERROR_MESSAGES.GENERAL.UNAUTHORIZED, HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED);
                res.status(response.statusCode).json(response.body);
                return;
            }
            const booking = await this.acceptBookingUseCase.execute({
                bookingId,
                providerId,
            });
            const response = this.responseBuilder.success(booking, messages_1.SUCCESS_MESSAGES.BOOKING.ACCEPTED, HttpStatusCode_1.HttpStatusCode.OK);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    async declineBooking(req, res, next) {
        try {
            const providerId = req.user?.id;
            const { bookingId } = req.params;
            const { reason } = req.body;
            if (!providerId) {
                const response = this.responseBuilder.error('UNAUTHORIZED', messages_1.ERROR_MESSAGES.GENERAL.UNAUTHORIZED, HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED);
                res.status(response.statusCode).json(response.body);
                return;
            }
            await this.declineBookingUseCase.execute({
                bookingId,
                providerId,
                reason,
            });
            const response = this.responseBuilder.success({ bookingId }, messages_1.SUCCESS_MESSAGES.BOOKING.DECLINED, HttpStatusCode_1.HttpStatusCode.OK);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    async cancelBooking(req, res, next) {
        try {
            const userId = req.user?.id;
            const { bookingId } = req.params;
            const { reason } = req.body;
            if (!userId) {
                const response = this.responseBuilder.error('UNAUTHORIZED', messages_1.ERROR_MESSAGES.GENERAL.UNAUTHORIZED, HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED);
                res.status(response.statusCode).json(response.body);
                return;
            }
            await this.cancelBookingUseCase.execute({
                bookingId,
                userId,
                reason,
            });
            const response = this.responseBuilder.success({ bookingId }, messages_1.SUCCESS_MESSAGES.BOOKING.CANCELLED, HttpStatusCode_1.HttpStatusCode.OK);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    async rescheduleBooking(req, res, next) {
        try {
            const userId = req.user?.id;
            const { bookingId } = req.params;
            const { newDate, newTime, reason } = req.body;
            if (!userId) {
                const response = this.responseBuilder.error('UNAUTHORIZED', messages_1.ERROR_MESSAGES.GENERAL.UNAUTHORIZED, HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED);
                res.status(response.statusCode).json(response.body);
                return;
            }
            if (!newDate || !newTime || !reason) {
                const response = this.responseBuilder.error('VALIDATION_ERROR', messages_1.ERROR_MESSAGES.BOOKING.REQUIRED_FIELDS, HttpStatusCode_1.HttpStatusCode.BAD_REQUEST);
                res.status(response.statusCode).json(response.body);
                return;
            }
            await this.rescheduleBookingUseCase.execute({
                bookingId,
                userId,
                newDate,
                newTime,
                reason,
            });
            const response = this.responseBuilder.success({ bookingId }, messages_1.SUCCESS_MESSAGES.BOOKING.RESCHEDULE_REQUESTED, HttpStatusCode_1.HttpStatusCode.OK);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    async acceptReschedule(req, res, next) {
        try {
            const userId = req.user?.id;
            const { bookingId } = req.params;
            if (!userId) {
                const response = this.responseBuilder.error('UNAUTHORIZED', messages_1.ERROR_MESSAGES.GENERAL.UNAUTHORIZED, HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED);
                res.status(response.statusCode).json(response.body);
                return;
            }
            await this.acceptRescheduleUseCase.execute({
                bookingId,
                userId,
            });
            const response = this.responseBuilder.success({ bookingId }, messages_1.SUCCESS_MESSAGES.BOOKING.RESCHEDULE_ACCEPTED, HttpStatusCode_1.HttpStatusCode.OK);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    async declineReschedule(req, res, next) {
        try {
            const userId = req.user?.id;
            const { bookingId } = req.params;
            const { reason } = req.body;
            if (!userId) {
                const response = this.responseBuilder.error('UNAUTHORIZED', messages_1.ERROR_MESSAGES.GENERAL.UNAUTHORIZED, HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED);
                res.status(response.statusCode).json(response.body);
                return;
            }
            if (!reason) {
                const response = this.responseBuilder.error('VALIDATION_ERROR', messages_1.ERROR_MESSAGES.BOOKING.REASON_REQUIRED, HttpStatusCode_1.HttpStatusCode.BAD_REQUEST);
                res.status(response.statusCode).json(response.body);
                return;
            }
            await this.declineRescheduleUseCase.execute({
                bookingId,
                userId,
                reason,
            });
            const response = this.responseBuilder.success({ bookingId }, messages_1.SUCCESS_MESSAGES.BOOKING.RESCHEDULE_DECLINED, HttpStatusCode_1.HttpStatusCode.OK);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
};
exports.SessionManagementController = SessionManagementController;
exports.SessionManagementController = SessionManagementController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.AcceptBookingUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.DeclineBookingUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.CancelBookingUseCase)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.RescheduleBookingUseCase)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.AcceptRescheduleUseCase)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.DeclineRescheduleUseCase)),
    __param(6, (0, inversify_1.inject)(types_1.TYPES.GetProviderBookingsUseCase)),
    __param(7, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [AcceptBookingUseCase_1.AcceptBookingUseCase,
        DeclineBookingUseCase_1.DeclineBookingUseCase,
        CancelBookingUseCase_1.CancelBookingUseCase,
        RescheduleBookingUseCase_1.RescheduleBookingUseCase,
        AcceptRescheduleUseCase_1.AcceptRescheduleUseCase,
        DeclineRescheduleUseCase_1.DeclineRescheduleUseCase,
        GetProviderBookingsUseCase_1.GetProviderBookingsUseCase, Object])
], SessionManagementController);
//# sourceMappingURL=SessionManagementController.js.map