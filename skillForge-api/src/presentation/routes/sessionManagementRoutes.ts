

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


router.get('/provider', (req, res) => getController().getProviderSessions(req, res));


router.post('/:bookingId/accept', (req, res) => getController().acceptBooking(req, res));


router.post('/:bookingId/decline', (req, res) => getController().declineBooking(req, res));


router.post('/:bookingId/cancel', (req, res) => getController().cancelBooking(req, res));


router.post('/:bookingId/reschedule', (req, res) => getController().rescheduleBooking(req, res));


router.post('/:bookingId/reschedule/accept', (req, res) => getController().acceptReschedule(req, res));


router.post('/:bookingId/reschedule/decline', (req, res) => getController().declineReschedule(req, res));

export default router;
