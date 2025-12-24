import { Request, Response, NextFunction } from 'express';
import { AcceptBookingUseCase } from '../../application/useCases/booking/AcceptBookingUseCase';
import { DeclineBookingUseCase } from '../../application/useCases/booking/DeclineBookingUseCase';
import { CancelBookingUseCase } from '../../application/useCases/booking/CancelBookingUseCase';
import { RescheduleBookingUseCase } from '../../application/useCases/booking/RescheduleBookingUseCase';
import { AcceptRescheduleUseCase } from '../../application/useCases/booking/AcceptRescheduleUseCase';
import { DeclineRescheduleUseCase } from '../../application/useCases/booking/DeclineRescheduleUseCase';
import { GetProviderBookingsUseCase } from '../../application/useCases/booking/GetProviderBookingsUseCase';
import { IResponseBuilder } from '../../shared/http/IResponseBuilder';
export declare class SessionManagementController {
    private readonly acceptBookingUseCase;
    private readonly declineBookingUseCase;
    private readonly cancelBookingUseCase;
    private readonly rescheduleBookingUseCase;
    private readonly acceptRescheduleUseCase;
    private readonly declineRescheduleUseCase;
    private readonly getProviderBookingsUseCase;
    private readonly responseBuilder;
    constructor(acceptBookingUseCase: AcceptBookingUseCase, declineBookingUseCase: DeclineBookingUseCase, cancelBookingUseCase: CancelBookingUseCase, rescheduleBookingUseCase: RescheduleBookingUseCase, acceptRescheduleUseCase: AcceptRescheduleUseCase, declineRescheduleUseCase: DeclineRescheduleUseCase, getProviderBookingsUseCase: GetProviderBookingsUseCase, responseBuilder: IResponseBuilder);
    getProviderSessions(req: Request, res: Response, next: NextFunction): Promise<void>;
    acceptBooking(req: Request, res: Response, next: NextFunction): Promise<void>;
    declineBooking(req: Request, res: Response, next: NextFunction): Promise<void>;
    cancelBooking(req: Request, res: Response, next: NextFunction): Promise<void>;
    rescheduleBooking(req: Request, res: Response, next: NextFunction): Promise<void>;
    acceptReschedule(req: Request, res: Response, next: NextFunction): Promise<void>;
    declineReschedule(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=SessionManagementController.d.ts.map