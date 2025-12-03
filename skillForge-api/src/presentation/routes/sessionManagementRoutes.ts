/**
 * Session Management Routes
 * Defines routes for provider session management
 */

import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { container } from '../../infrastructure/di/container';
import { TYPES } from '../../infrastructure/di/types';
import { SessionManagementController } from '../controllers/SessionManagementController';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Lazy load controller to avoid circular dependency
const getController = () => container.get<SessionManagementController>(TYPES.SessionManagementController);

/**
 * @route   GET /api/sessions/provider
 * @desc    Get all sessions for provider with statistics
 * @access  Private (Provider only)
 */
router.get('/provider', (req, res) => getController().getProviderSessions(req, res));

/**
 * @route   POST /api/sessions/:bookingId/accept
 * @desc    Accept a booking request
 * @access  Private (Provider only)
 */
router.post('/:bookingId/accept', (req, res) => getController().acceptBooking(req, res));

/**
 * @route   POST /api/sessions/:bookingId/decline
 * @desc    Decline a booking request
 * @access  Private (Provider only)
 */
router.post('/:bookingId/decline', (req, res) => getController().declineBooking(req, res));

/**
 * @route   POST /api/sessions/:bookingId/cancel
 * @desc    Cancel a booking
 * @access  Private
 */
router.post('/:bookingId/cancel', (req, res) => getController().cancelBooking(req, res));

/**
 * @route   POST /api/sessions/:bookingId/reschedule
 * @desc    Request reschedule for a booking
 * @access  Private
 */
router.post('/:bookingId/reschedule', (req, res) => getController().rescheduleBooking(req, res));

/**
 * @route   POST /api/sessions/:bookingId/reschedule/accept
 * @desc    Accept a reschedule request
 * @access  Private (Provider only)
 */
router.post('/:bookingId/reschedule/accept', (req, res) => getController().acceptReschedule(req, res));

/**
 * @route   POST /api/sessions/:bookingId/reschedule/decline
 * @desc    Decline a reschedule request
 * @access  Private (Provider only)
 */
router.post('/:bookingId/reschedule/decline', (req, res) => getController().declineReschedule(req, res));

export default router;
