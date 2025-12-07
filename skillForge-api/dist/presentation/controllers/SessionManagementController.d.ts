import { Request, Response } from 'express';
import { AcceptBookingUseCase } from '../../application/useCases/booking/AcceptBookingUseCase';
import { DeclineBookingUseCase } from '../../application/useCases/booking/DeclineBookingUseCase';
import { CancelBookingUseCase } from '../../application/useCases/booking/CancelBookingUseCase';
import { RescheduleBookingUseCase } from '../../application/useCases/booking/RescheduleBookingUseCase';
import { AcceptRescheduleUseCase } from '../../application/useCases/booking/AcceptRescheduleUseCase';
import { DeclineRescheduleUseCase } from '../../application/useCases/booking/DeclineRescheduleUseCase';
import { GetProviderBookingsUseCase } from '../../application/useCases/booking/GetProviderBookingsUseCase';
export declare class SessionManagementController {
    private readonly acceptBookingUseCase;
    private readonly declineBookingUseCase;
    private readonly cancelBookingUseCase;
    private readonly rescheduleBookingUseCase;
    private readonly acceptRescheduleUseCase;
    private readonly declineRescheduleUseCase;
    private readonly getProviderBookingsUseCase;
    constructor(acceptBookingUseCase: AcceptBookingUseCase, declineBookingUseCase: DeclineBookingUseCase, cancelBookingUseCase: CancelBookingUseCase, rescheduleBookingUseCase: RescheduleBookingUseCase, acceptRescheduleUseCase: AcceptRescheduleUseCase, declineRescheduleUseCase: DeclineRescheduleUseCase, getProviderBookingsUseCase: GetProviderBookingsUseCase);
    /**
     * Get all bookings for provider with statistics
     * GET /api/sessions/provider
     */
    getProviderSessions(req: Request, res: Response): Promise<Response>;
    /**
     * Accept a booking request
     * POST /api/sessions/:bookingId/accept
     */
    acceptBooking(req: Request, res: Response): Promise<Response>;
    declineBooking(req: Request, res: Response): Promise<Response>;
    cancelBooking(req: Request, res: Response): Promise<Response>;
    /**
     * Request reschedule for a booking
     * POST /api/sessions/:bookingId/reschedule
     */
    rescheduleBooking(req: Request, res: Response): Promise<Response>;
    /**
     * Accept a reschedule request
     * POST /api/sessions/:bookingId/reschedule/accept
     */
    acceptReschedule(req: Request, res: Response): Promise<Response>;
    /**
     * Decline a reschedule request
     * POST /api/sessions/:bookingId/reschedule/decline
     */
    declineReschedule(req: Request, res: Response): Promise<Response>;
}
//# sourceMappingURL=SessionManagementController.d.ts.map