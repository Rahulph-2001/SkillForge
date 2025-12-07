import { Request, Response, NextFunction } from 'express';
import { ICreateBookingUseCase } from '../../application/useCases/booking/interfaces/ICreateBookingUseCase';
import { CancelBookingUseCase } from '../../application/useCases/booking/CancelBookingUseCase';
import { IBookingRepository } from '../../domain/repositories/IBookingRepository';
import { IBookingMapper } from '../../application/mappers/interfaces/IBookingMapper';
import { IResponseBuilder } from '../../shared/http/IResponseBuilder';
export declare class BookingController {
    private createBookingUseCase;
    private cancelBookingUseCase;
    private bookingRepository;
    private bookingMapper;
    private responseBuilder;
    constructor(createBookingUseCase: ICreateBookingUseCase, cancelBookingUseCase: CancelBookingUseCase, bookingRepository: IBookingRepository, bookingMapper: IBookingMapper, responseBuilder: IResponseBuilder);
    createBooking: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMyBookings: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUpcomingSessions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getBookingById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    cancelBooking: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=BookingController.d.ts.map