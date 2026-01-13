import { Request, Response, NextFunction } from 'express';
import { IAcceptBookingUseCase } from '../../application/useCases/booking/interfaces/IAcceptBookingUseCase';
import { IDeclineBookingUseCase } from '../../application/useCases/booking/interfaces/IDeclineBookingUseCase';
import { ICancelBookingUseCase } from '../../application/useCases/booking/interfaces/ICancelBookingUseCase';
import { IRescheduleBookingUseCase } from '../../application/useCases/booking/interfaces/IRescheduleBookingUseCase';
import { IAcceptRescheduleUseCase } from '../../application/useCases/booking/interfaces/IAcceptRescheduleUseCase';
import { IDeclineRescheduleUseCase } from '../../application/useCases/booking/interfaces/IDeclineRescheduleUseCase';
import { IGetProviderBookingsUseCase } from '../../application/useCases/booking/interfaces/IGetProviderBookingsUseCase';
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
    constructor(acceptBookingUseCase: IAcceptBookingUseCase, declineBookingUseCase: IDeclineBookingUseCase, cancelBookingUseCase: ICancelBookingUseCase, rescheduleBookingUseCase: IRescheduleBookingUseCase, acceptRescheduleUseCase: IAcceptRescheduleUseCase, declineRescheduleUseCase: IDeclineRescheduleUseCase, getProviderBookingsUseCase: IGetProviderBookingsUseCase, responseBuilder: IResponseBuilder);
    getProviderSessions(req: Request, res: Response, next: NextFunction): Promise<void>;
    acceptBooking(req: Request, res: Response, next: NextFunction): Promise<void>;
    declineBooking(req: Request, res: Response, next: NextFunction): Promise<void>;
    cancelBooking(req: Request, res: Response, next: NextFunction): Promise<void>;
    rescheduleBooking(req: Request, res: Response, next: NextFunction): Promise<void>;
    acceptReschedule(req: Request, res: Response, next: NextFunction): Promise<void>;
    declineReschedule(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=SessionManagementController.d.ts.map