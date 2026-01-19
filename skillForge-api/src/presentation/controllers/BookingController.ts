import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../infrastructure/di/types';
import { ICreateBookingUseCase } from '../../application/useCases/booking/interfaces/ICreateBookingUseCase';
import { ICancelBookingUseCase } from '../../application/useCases/booking/interfaces/ICancelBookingUseCase';
import { IGetMyBookingsUseCase } from '../../application/useCases/booking/interfaces/IGetMyBookingsUseCase';
import { IGetUpcomingSessionsUseCase } from '../../application/useCases/booking/interfaces/IGetUpcomingSessionsUseCase';
import { IGetBookingByIdUseCase } from '../../application/useCases/booking/interfaces/IGetBookingByIdUseCase';
import { ICompleteSessionUseCase } from '../../application/useCases/booking/interfaces/ICompleteSessionUseCase';
import { IResponseBuilder } from '../../shared/http/IResponseBuilder';
import { HttpStatusCode } from '../../domain/enums/HttpStatusCode';
import { CreateBookingRequestDTO } from '../../application/dto/booking/CreateBookingRequestDTO';
import { CancelBookingRequestDTO } from '../../application/dto/booking/CancelBookingRequestDTO';

@injectable()
export class BookingController {
  constructor(
    @inject(TYPES.ICreateBookingUseCase) private readonly createBookingUseCase: ICreateBookingUseCase,
    @inject(TYPES.ICancelBookingUseCase) private readonly cancelBookingUseCase: ICancelBookingUseCase,
    @inject(TYPES.IGetMyBookingsUseCase) private readonly getMyBookingsUseCase: IGetMyBookingsUseCase,
    @inject(TYPES.IGetUpcomingSessionsUseCase) private readonly getUpcomingSessionsUseCase: IGetUpcomingSessionsUseCase,
    @inject(TYPES.IGetBookingByIdUseCase) private readonly getBookingByIdUseCase: IGetBookingByIdUseCase,
    @inject(TYPES.ICompleteSessionUseCase) private readonly completeSessionUseCase: ICompleteSessionUseCase,
    @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder
  ) { }

  public createBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        const error = this.responseBuilder.error('UNAUTHORIZED', 'Unauthorized', HttpStatusCode.UNAUTHORIZED);
        res.status(error.statusCode).json(error.body);
        return;
      }

      const { skillId, providerId, preferredDate, preferredTime, message } = req.body;

      if (!skillId || !providerId || !preferredDate || !preferredTime) {
        const error = this.responseBuilder.error('VALIDATION_ERROR', 'Missing required fields', HttpStatusCode.BAD_REQUEST);
        res.status(error.statusCode).json(error.body);
        return;
      }

      const request: CreateBookingRequestDTO = {
        learnerId: userId,
        skillId,
        providerId,
        preferredDate,
        preferredTime,
        message,
      };

      const booking = await this.createBookingUseCase.execute(request);

      const response = this.responseBuilder.success(booking, 'Booking created successfully', HttpStatusCode.CREATED);
      res.status(response.statusCode).json(response.body);
    } catch (error: any) {
      next(error);
    }
  }

  public getMyBookings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        const error = this.responseBuilder.error('UNAUTHORIZED', 'Unauthorized', HttpStatusCode.UNAUTHORIZED);
        res.status(error.statusCode).json(error.body);
        return;
      }

      const bookings = await this.getMyBookingsUseCase.execute(userId);
      const response = this.responseBuilder.success(bookings, 'Bookings fetched successfully', HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error: any) {
      next(error);
    }
  }

  public getUpcomingSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        const error = this.responseBuilder.error('UNAUTHORIZED', 'Unauthorized', HttpStatusCode.UNAUTHORIZED);
        res.status(error.statusCode).json(error.body);
        return;
      }

      const bookings = await this.getUpcomingSessionsUseCase.execute(userId);
      const response = this.responseBuilder.success(bookings, 'Upcoming sessions fetched successfully', HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error: any) {
      next(error);
    }
  }

  public getBookingById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;

      if (!userId) {
        const error = this.responseBuilder.error('UNAUTHORIZED', 'Unauthorized', HttpStatusCode.UNAUTHORIZED);
        res.status(error.statusCode).json(error.body);
        return;
      }

      const booking = await this.getBookingByIdUseCase.execute(id, userId);
      const response = this.responseBuilder.success(booking, 'Booking fetched successfully', HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error: any) {
      next(error);
    }
  }

  public cancelBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;
      const { reason } = req.body;

      if (!userId) {
        const error = this.responseBuilder.error('UNAUTHORIZED', 'Unauthorized', HttpStatusCode.UNAUTHORIZED);
        res.status(error.statusCode).json(error.body);
        return;
      }

      const request: CancelBookingRequestDTO = {
        bookingId: id,
        userId,
        reason,
      };

      await this.cancelBookingUseCase.execute(request);

      const response = this.responseBuilder.success(null, 'Booking cancelled successfully', HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error: any) {
      next(error);
    }
  }

  public completeSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;

      if (!userId) {
        const error = this.responseBuilder.error('UNAUTHORIZED', 'Unauthorized', HttpStatusCode.UNAUTHORIZED);
        res.status(error.statusCode).json(error.body);
        return;
      }

      const booking = await this.completeSessionUseCase.execute({
        bookingId: id,
        completedBy: userId,
      });

      const response = this.responseBuilder.success(
        booking,
        'Session completed successfully. Credits released to provider.',
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error: any) {
      next(error);
    }
  }
}