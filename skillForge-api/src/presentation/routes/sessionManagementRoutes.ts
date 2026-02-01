
import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { container } from '../../infrastructure/di/di';
import { TYPES } from '../../infrastructure/di/types';
import { SessionManagementController } from '../controllers/SessionManagementController';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Lazy load controller to avoid circular dependency
const getController = () => container.get<SessionManagementController>(TYPES.SessionManagementController);


router.get('/provider', (req, res, next) => getController().getProviderSessions(req, res, next));


router.post('/:bookingId/accept', (req, res, next) => getController().acceptBooking(req, res, next));


router.post('/:bookingId/decline', (req, res, next) => getController().declineBooking(req, res, next));


router.post('/:bookingId/cancel', (req, res, next) => getController().cancelBooking(req, res, next));


// Standardize to :bookingId
router.post('/reschedule/:bookingId', (req, res, next) => getController().rescheduleBooking(req, res, next));
router.post('/reschedule/:bookingId/accept', (req, res, next) => getController().acceptReschedule(req, res, next));


router.post('/:bookingId/reschedule/decline', (req, res, next) => getController().declineReschedule(req, res, next));

export default router;
