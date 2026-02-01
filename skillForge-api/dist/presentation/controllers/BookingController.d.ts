import { Request, Response, NextFunction } from 'express';
import { ICreateBookingUseCase } from '../../application/useCases/booking/interfaces/ICreateBookingUseCase';
import { ICancelBookingUseCase } from '../../application/useCases/booking/interfaces/ICancelBookingUseCase';
import { IGetMyBookingsUseCase } from '../../application/useCases/booking/interfaces/IGetMyBookingsUseCase';
import { IGetUpcomingSessionsUseCase } from '../../application/useCases/booking/interfaces/IGetUpcomingSessionsUseCase';
import { IGetBookingByIdUseCase } from '../../application/useCases/booking/interfaces/IGetBookingByIdUseCase';
import { ICompleteSessionUseCase } from '../../application/useCases/booking/interfaces/ICompleteSessionUseCase';
import { IResponseBuilder } from '../../shared/http/IResponseBuilder';
export declare class BookingController {
    private readonly createBookingUseCase;
    private readonly cancelBookingUseCase;
    private readonly getMyBookingsUseCase;
    private readonly getUpcomingSessionsUseCase;
    private readonly getBookingByIdUseCase;
    private readonly completeSessionUseCase;
    private readonly responseBuilder;
    constructor(createBookingUseCase: ICreateBookingUseCase, cancelBookingUseCase: ICancelBookingUseCase, getMyBookingsUseCase: IGetMyBookingsUseCase, getUpcomingSessionsUseCase: IGetUpcomingSessionsUseCase, getBookingByIdUseCase: IGetBookingByIdUseCase, completeSessionUseCase: ICompleteSessionUseCase, responseBuilder: IResponseBuilder);
    createBooking: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMyBookings: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUpcomingSessions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getBookingById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    cancelBooking: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    completeSession: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=BookingController.d.ts.map