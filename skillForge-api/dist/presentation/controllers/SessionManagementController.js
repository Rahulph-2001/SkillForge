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
let SessionManagementController = class SessionManagementController {
    constructor(acceptBookingUseCase, declineBookingUseCase, cancelBookingUseCase, rescheduleBookingUseCase, acceptRescheduleUseCase, declineRescheduleUseCase, getProviderBookingsUseCase) {
        this.acceptBookingUseCase = acceptBookingUseCase;
        this.declineBookingUseCase = declineBookingUseCase;
        this.cancelBookingUseCase = cancelBookingUseCase;
        this.rescheduleBookingUseCase = rescheduleBookingUseCase;
        this.acceptRescheduleUseCase = acceptRescheduleUseCase;
        this.declineRescheduleUseCase = declineRescheduleUseCase;
        this.getProviderBookingsUseCase = getProviderBookingsUseCase;
    }
    /**
     * Get all bookings for provider with statistics
     * GET /api/sessions/provider
     */
    async getProviderSessions(req, res) {
        try {
            const providerId = req.user?.id;
            const { status } = req.query;
            if (!providerId) {
                console.error(' [SessionManagementController] No provider ID found');
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }
            const result = await this.getProviderBookingsUseCase.execute({
                providerId,
                status: status,
            });
            if (!result.success) {
                console.error(' [SessionManagementController] Use case failed:', result.message);
                return res.status(400).json(result);
            }
            return res.status(200).json({
                success: true,
                data: {
                    sessions: result.bookings,
                    stats: result.stats,
                },
            });
        }
        catch (error) {
            console.error(' [SessionManagementController] Error:', error);
            console.error(' [SessionManagementController] Error stack:', error.stack);
            return res.status(500).json({
                success: false,
                message: 'Failed to retrieve sessions',
            });
        }
    }
    /**
     * Accept a booking request
     * POST /api/sessions/:bookingId/accept
     */
    async acceptBooking(req, res) {
        try {
            const providerId = req.user?.id;
            const { bookingId } = req.params;
            if (!providerId) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }
            const booking = await this.acceptBookingUseCase.execute({
                bookingId,
                providerId,
            });
            return res.status(200).json({
                success: true,
                message: 'Booking accepted successfully',
                data: booking,
            });
        }
        catch (error) {
            console.error(' [SessionManagementController] Error:', error);
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json({
                success: false,
                message: error.message || 'Failed to accept booking',
            });
        }
    }
    async declineBooking(req, res) {
        try {
            const providerId = req.user?.id;
            const { bookingId } = req.params;
            const { reason } = req.body;
            if (!providerId) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }
            await this.declineBookingUseCase.execute({
                bookingId,
                providerId,
                reason,
            });
            return res.status(200).json({
                success: true,
                message: 'Booking declined successfully',
            });
        }
        catch (error) {
            console.error('❌ [SessionManagementController] Error:', error);
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json({
                success: false,
                message: error.message || 'Failed to decline booking',
            });
        }
    }
    async cancelBooking(req, res) {
        try {
            const userId = req.user?.id;
            const { bookingId } = req.params;
            const { reason } = req.body;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }
            await this.cancelBookingUseCase.execute({
                bookingId,
                userId,
                reason,
            });
            return res.status(200).json({
                success: true,
                message: 'Booking cancelled successfully',
            });
        }
        catch (error) {
            console.error('❌ [SessionManagementController] Error:', error);
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json({
                success: false,
                message: error.message || 'Failed to cancel booking',
            });
        }
    }
    /**
     * Request reschedule for a booking
     * POST /api/sessions/:bookingId/reschedule
     */
    async rescheduleBooking(req, res) {
        try {
            const userId = req.user?.id;
            const { bookingId } = req.params;
            const { newDate, newTime, reason } = req.body;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }
            if (!newDate || !newTime || !reason) {
                return res.status(400).json({
                    success: false,
                    message: 'New date, time, and reason are required',
                });
            }
            await this.rescheduleBookingUseCase.execute({
                bookingId,
                userId,
                newDate,
                newTime,
                reason,
            });
            return res.status(200).json({
                success: true,
                message: 'Reschedule request submitted successfully. Waiting for approval.',
            });
        }
        catch (error) {
            console.error('❌ [SessionManagementController] Error:', error);
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json({
                success: false,
                message: error.message || 'Failed to request reschedule',
            });
        }
    }
    /**
     * Accept a reschedule request
     * POST /api/sessions/:bookingId/reschedule/accept
     */
    async acceptReschedule(req, res) {
        try {
            const userId = req.user?.id;
            const { bookingId } = req.params;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }
            await this.acceptRescheduleUseCase.execute({
                bookingId,
                userId,
            });
            return res.status(200).json({
                success: true,
                message: 'Reschedule request accepted successfully',
            });
        }
        catch (error) {
            console.error('❌ [SessionManagementController] Error:', error);
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json({
                success: false,
                message: error.message || 'Failed to accept reschedule',
            });
        }
    }
    /**
     * Decline a reschedule request
     * POST /api/sessions/:bookingId/reschedule/decline
     */
    async declineReschedule(req, res) {
        try {
            const userId = req.user?.id;
            const { bookingId } = req.params;
            const { reason } = req.body;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }
            if (!reason) {
                return res.status(400).json({
                    success: false,
                    message: 'Reason is required to decline a reschedule request',
                });
            }
            await this.declineRescheduleUseCase.execute({
                bookingId,
                userId,
                reason,
            });
            return res.status(200).json({
                success: true,
                message: 'Reschedule request declined',
            });
        }
        catch (error) {
            console.error('❌ [SessionManagementController] Error:', error);
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json({
                success: false,
                message: error.message || 'Failed to decline reschedule',
            });
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
    __metadata("design:paramtypes", [AcceptBookingUseCase_1.AcceptBookingUseCase,
        DeclineBookingUseCase_1.DeclineBookingUseCase,
        CancelBookingUseCase_1.CancelBookingUseCase,
        RescheduleBookingUseCase_1.RescheduleBookingUseCase,
        AcceptRescheduleUseCase_1.AcceptRescheduleUseCase,
        DeclineRescheduleUseCase_1.DeclineRescheduleUseCase,
        GetProviderBookingsUseCase_1.GetProviderBookingsUseCase])
], SessionManagementController);
//# sourceMappingURL=SessionManagementController.js.map