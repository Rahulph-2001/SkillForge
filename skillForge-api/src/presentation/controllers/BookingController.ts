import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../infrastructure/di/types';
import { ICreateBookingUseCase } from '../../application/useCases/booking/interfaces/ICreateBookingUseCase';
import { CancelBookingUseCase } from '../../application/useCases/booking/CancelBookingUseCase';
import { IBookingRepository } from '../../domain/repositories/IBookingRepository';
import { IBookingMapper } from '../../application/mappers/interfaces/IBookingMapper';
import { IResponseBuilder } from '../../shared/http/IResponseBuilder';
import { HttpStatusCode } from '../../domain/enums/HttpStatusCode';
import { CreateBookingRequestDTO } from '../../application/dto/booking/CreateBookingRequestDTO';

@injectable()
export class BookingController {
  constructor(
    @inject(TYPES.CreateBookingUseCase) private createBookingUseCase: ICreateBookingUseCase,
    @inject(TYPES.CancelBookingUseCase) private cancelBookingUseCase: CancelBookingUseCase,
    @inject(TYPES.IBookingRepository) private bookingRepository: IBookingRepository,
    @inject(TYPES.IBookingMapper) private bookingMapper: IBookingMapper,
    @inject(TYPES.IResponseBuilder) private responseBuilder: IResponseBuilder
  ) {}
  
  public createBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        const error = this.responseBuilder.error('UNAUTHORIZED', 'Unauthorized', HttpStatusCode.UNAUTHORIZED);
        res.status(error.statusCode).json(error.body);
        return;
      }

      const { skillId, providerId, preferredDate, preferredTime, message } = req.body;

      // Validation
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
      const userId = (req as any).user?.id;
      
      if (!userId) {
        const error = this.responseBuilder.error('UNAUTHORIZED', 'Unauthorized', HttpStatusCode.UNAUTHORIZED);
        res.status(error.statusCode).json(error.body);
        return;
      }

      const bookings = await this.bookingRepository.findByLearnerId(userId);
      const bookingDTOs = this.bookingMapper.toDTOs(bookings);

      const response = this.responseBuilder.success(bookingDTOs, 'Bookings fetched successfully', HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error: any) {
      next(error);
    }
  }

  public getUpcomingSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        const error = this.responseBuilder.error('UNAUTHORIZED', 'Unauthorized', HttpStatusCode.UNAUTHORIZED);
        res.status(error.statusCode).json(error.body);
        return;
      }

      // NOTE: Repository doesn't have findUpcoming yet. Fetching all and filtering.
      // In production, add findUpcoming to Repository for efficiency.
      const bookings = await this.bookingRepository.findByLearnerId(userId);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcoming = bookings.filter(b => {
          const date = new Date(b.preferredDate);
          return date >= today && (b.status === 'pending' || b.status === 'confirmed');
      });
      
      // Sort by date asc
      upcoming.sort((a, b) => new Date(a.preferredDate).getTime() - new Date(b.preferredDate).getTime());

      const bookingDTOs = this.bookingMapper.toDTOs(upcoming);

      const response = this.responseBuilder.success(bookingDTOs, 'Upcoming sessions fetched successfully', HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error: any) {
      next(error);
    }
  }

  public getBookingById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;
      
      if (!userId) {
        const error = this.responseBuilder.error('UNAUTHORIZED', 'Unauthorized', HttpStatusCode.UNAUTHORIZED);
        res.status(error.statusCode).json(error.body);
        return;
      }

      const booking = await this.bookingRepository.findById(id);

      if (!booking) {
        const error = this.responseBuilder.error('NOT_FOUND', 'Booking not found', HttpStatusCode.NOT_FOUND);
        res.status(error.statusCode).json(error.body);
        return;
      }

      // Check ownership
      if (booking.learnerId !== userId && booking.providerId !== userId) {
         const error = this.responseBuilder.error('FORBIDDEN', 'Unauthorized to view this booking', HttpStatusCode.FORBIDDEN);
         res.status(error.statusCode).json(error.body);
         return;
      }

      const response = this.responseBuilder.success(this.bookingMapper.toDTO(booking), 'Booking fetched successfully', HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error: any) {
      next(error);
    }
  }

  public cancelBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;
      const { reason } = req.body;
      
      if (!userId) {
        const error = this.responseBuilder.error('UNAUTHORIZED', 'Unauthorized', HttpStatusCode.UNAUTHORIZED);
        res.status(error.statusCode).json(error.body);
        return;
      }

      await this.cancelBookingUseCase.execute({
          bookingId: id,
          userId,
          reason
      });

      const response = this.responseBuilder.success(null, 'Booking cancelled successfully', HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error: any) {
      next(error);
    }
  }
}
