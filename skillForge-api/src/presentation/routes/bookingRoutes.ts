import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../infrastructure/di/types';
import { BookingController } from '../controllers/BookingController';
import { authMiddleware } from '../middlewares/authMiddleware';

@injectable()
export class BookingRoutes {
  public router = Router();

  constructor(
    @inject(TYPES.BookingController) private bookingController: BookingController
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use(authMiddleware);

    this.router.post('/', this.bookingController.createBooking);
    this.router.get('/my-bookings', this.bookingController.getMyBookings);
    this.router.get('/upcoming', this.bookingController.getUpcomingSessions);
    this.router.get('/:id', this.bookingController.getBookingById);
    this.router.patch('/:id/cancel', this.bookingController.cancelBooking);
    this.router.post('/:id/complete', this.bookingController.completeSession);
  }
}