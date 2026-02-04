import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../infrastructure/di/types';
import { BookingController } from '../controllers/BookingController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { ENDPOINTS } from '../../config/routes';

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

    this.router.post(ENDPOINTS.BOOKING.ROOT, this.bookingController.createBooking);
    this.router.get(ENDPOINTS.BOOKING.MY_BOOKINGS, this.bookingController.getMyBookings);
    this.router.get(ENDPOINTS.BOOKING.UPCOMING, this.bookingController.getUpcomingSessions);
    this.router.get(ENDPOINTS.BOOKING.BY_ID, this.bookingController.getBookingById);
    this.router.patch(ENDPOINTS.BOOKING.CANCEL, this.bookingController.cancelBooking);
    this.router.post(ENDPOINTS.BOOKING.COMPLETE, this.bookingController.completeSession);
  }
}
