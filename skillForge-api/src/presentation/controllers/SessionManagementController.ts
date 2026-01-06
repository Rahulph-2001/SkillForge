import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../infrastructure/di/types';
import { IAcceptBookingUseCase } from '../../application/useCases/booking/interfaces/IAcceptBookingUseCase';
import { IDeclineBookingUseCase } from '../../application/useCases/booking/interfaces/IDeclineBookingUseCase';
import { ICancelBookingUseCase } from '../../application/useCases/booking/interfaces/ICancelBookingUseCase';
import { IRescheduleBookingUseCase } from '../../application/useCases/booking/interfaces/IRescheduleBookingUseCase';
import { IAcceptRescheduleUseCase } from '../../application/useCases/booking/interfaces/IAcceptRescheduleUseCase';
import { IDeclineRescheduleUseCase } from '../../application/useCases/booking/interfaces/IDeclineRescheduleUseCase';
import { IGetProviderBookingsUseCase } from '../../application/useCases/booking/interfaces/IGetProviderBookingsUseCase';
import { IResponseBuilder } from '../../shared/http/IResponseBuilder';
import { HttpStatusCode } from '../../domain/enums/HttpStatusCode';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../config/messages';

@injectable()
export class SessionManagementController {
  constructor(
    @inject(TYPES.IAcceptBookingUseCase)
    private readonly acceptBookingUseCase: IAcceptBookingUseCase,
    @inject(TYPES.IDeclineBookingUseCase)
    private readonly declineBookingUseCase: IDeclineBookingUseCase,
    @inject(TYPES.ICancelBookingUseCase)
    private readonly cancelBookingUseCase: ICancelBookingUseCase,
    @inject(TYPES.IRescheduleBookingUseCase)
    private readonly rescheduleBookingUseCase: IRescheduleBookingUseCase,
    @inject(TYPES.IAcceptRescheduleUseCase)
    private readonly acceptRescheduleUseCase: IAcceptRescheduleUseCase,
    @inject(TYPES.IDeclineRescheduleUseCase)
    private readonly declineRescheduleUseCase: IDeclineRescheduleUseCase,
    @inject(TYPES.IGetProviderBookingsUseCase)
    private readonly getProviderBookingsUseCase: IGetProviderBookingsUseCase,
    @inject(TYPES.IResponseBuilder)
    private readonly responseBuilder: IResponseBuilder
  ) { }

  async getProviderSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const providerId = req.user?.id;
      const { status } = req.query;

      if (!providerId) {
        const response = this.responseBuilder.error(
          'UNAUTHORIZED',
          ERROR_MESSAGES.GENERAL.UNAUTHORIZED,
          HttpStatusCode.UNAUTHORIZED
        );
        res.status(response.statusCode).json(response.body);
        return;
      }

      const result = await this.getProviderBookingsUseCase.execute({
        providerId,
        status: status as string,
      });

      if (!result.success) {
        const response = this.responseBuilder.error(
          'FETCH_FAILED',
          result.message || ERROR_MESSAGES.BOOKING.SESSIONS_FETCH_FAILED,
          HttpStatusCode.BAD_REQUEST
        );
        res.status(response.statusCode).json(response.body);
        return;
      }

      const response = this.responseBuilder.success(
        { sessions: result.bookings, stats: result.stats },
        SUCCESS_MESSAGES.BOOKING.SESSIONS_FETCHED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  async acceptBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const providerId = req.user?.id;
      const { bookingId } = req.params;

      if (!providerId) {
        const response = this.responseBuilder.error(
          'UNAUTHORIZED',
          ERROR_MESSAGES.GENERAL.UNAUTHORIZED,
          HttpStatusCode.UNAUTHORIZED
        );
        res.status(response.statusCode).json(response.body);
        return;
      }

      const booking = await this.acceptBookingUseCase.execute({
        bookingId,
        providerId,
      });

      const response = this.responseBuilder.success(
        booking,
        SUCCESS_MESSAGES.BOOKING.ACCEPTED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  async declineBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const providerId = req.user?.id;
      const { bookingId } = req.params;
      const { reason } = req.body;

      if (!providerId) {
        const response = this.responseBuilder.error(
          'UNAUTHORIZED',
          ERROR_MESSAGES.GENERAL.UNAUTHORIZED,
          HttpStatusCode.UNAUTHORIZED
        );
        res.status(response.statusCode).json(response.body);
        return;
      }

      await this.declineBookingUseCase.execute({
        bookingId,
        providerId,
        reason,
      });

      const response = this.responseBuilder.success(
        { bookingId },
        SUCCESS_MESSAGES.BOOKING.DECLINED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  async cancelBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const { bookingId } = req.params;
      const { reason } = req.body;

      if (!userId) {
        const response = this.responseBuilder.error(
          'UNAUTHORIZED',
          ERROR_MESSAGES.GENERAL.UNAUTHORIZED,
          HttpStatusCode.UNAUTHORIZED
        );
        res.status(response.statusCode).json(response.body);
        return;
      }

      await this.cancelBookingUseCase.execute({
        bookingId,
        userId,
        reason,
      });

      const response = this.responseBuilder.success(
        { bookingId },
        SUCCESS_MESSAGES.BOOKING.CANCELLED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  async rescheduleBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const { bookingId } = req.params;
      const { newDate, newTime, reason } = req.body;

      if (!userId) {
        const response = this.responseBuilder.error(
          'UNAUTHORIZED',
          ERROR_MESSAGES.GENERAL.UNAUTHORIZED,
          HttpStatusCode.UNAUTHORIZED
        );
        res.status(response.statusCode).json(response.body);
        return;
      }

      if (!newDate || !newTime || !reason) {
        const response = this.responseBuilder.error(
          'VALIDATION_ERROR',
          ERROR_MESSAGES.BOOKING.REQUIRED_FIELDS,
          HttpStatusCode.BAD_REQUEST
        );
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

      const response = this.responseBuilder.success(
        { bookingId },
        SUCCESS_MESSAGES.BOOKING.RESCHEDULE_REQUESTED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  async acceptReschedule(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const { bookingId } = req.params;

      if (!userId) {
        const response = this.responseBuilder.error(
          'UNAUTHORIZED',
          ERROR_MESSAGES.GENERAL.UNAUTHORIZED,
          HttpStatusCode.UNAUTHORIZED
        );
        res.status(response.statusCode).json(response.body);
        return;
      }

      await this.acceptRescheduleUseCase.execute({
        bookingId,
        userId,
      });

      const response = this.responseBuilder.success(
        { bookingId },
        SUCCESS_MESSAGES.BOOKING.RESCHEDULE_ACCEPTED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  async declineReschedule(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const { bookingId } = req.params;
      const { reason } = req.body;

      if (!userId) {
        const response = this.responseBuilder.error(
          'UNAUTHORIZED',
          ERROR_MESSAGES.GENERAL.UNAUTHORIZED,
          HttpStatusCode.UNAUTHORIZED
        );
        res.status(response.statusCode).json(response.body);
        return;
      }

      if (!reason) {
        const response = this.responseBuilder.error(
          'VALIDATION_ERROR',
          ERROR_MESSAGES.BOOKING.REASON_REQUIRED,
          HttpStatusCode.BAD_REQUEST
        );
        res.status(response.statusCode).json(response.body);
        return;
      }

      await this.declineRescheduleUseCase.execute({
        bookingId,
        userId,
        reason,
      });

      const response = this.responseBuilder.success(
        { bookingId },
        SUCCESS_MESSAGES.BOOKING.RESCHEDULE_DECLINED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }
}
