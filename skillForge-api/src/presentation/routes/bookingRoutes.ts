import { Router } from 'express';
import { BookingController } from '../controllers/BookingController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// All booking routes require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking
 * @access  Private
 */
router.post('/', BookingController.createBooking);

/**
 * @route   GET /api/bookings/my-bookings
 * @desc    Get all bookings for the current user
 * @access  Private
 */
router.get('/my-bookings', BookingController.getMyBookings);

/**
 * @route   GET /api/bookings/upcoming
 * @desc    Get upcoming sessions for the current user
 * @access  Private
 */
router.get('/upcoming', BookingController.getUpcomingSessions);

/**
 * @route   GET /api/bookings/:id
 * @desc    Get a specific booking by ID
 * @access  Private
 */
router.get('/:id', BookingController.getBookingById);

/**
 * @route   PATCH /api/bookings/:id/cancel
 * @desc    Cancel a booking
 * @access  Private
 */
router.patch('/:id/cancel', BookingController.cancelBooking);

export default router;
