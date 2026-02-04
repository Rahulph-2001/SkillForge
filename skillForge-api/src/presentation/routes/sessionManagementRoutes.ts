
import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { container } from '../../infrastructure/di/di';
import { TYPES } from '../../infrastructure/di/types';
import { SessionManagementController } from '../controllers/SessionManagementController';
import { ENDPOINTS } from '../../config/routes';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Lazy load controller to avoid circular dependency
const getController = () => container.get<SessionManagementController>(TYPES.SessionManagementController);


router.get(ENDPOINTS.SESSION_MANAGEMENT.PROVIDER, (req, res, next) => getController().getProviderSessions(req, res, next));


router.post(ENDPOINTS.SESSION_MANAGEMENT.ACCEPT, (req, res, next) => getController().acceptBooking(req, res, next));


router.post(ENDPOINTS.SESSION_MANAGEMENT.DECLINE, (req, res, next) => getController().declineBooking(req, res, next));


router.post(ENDPOINTS.SESSION_MANAGEMENT.CANCEL, (req, res, next) => getController().cancelBooking(req, res, next));


// Standardize to :bookingId
router.post(ENDPOINTS.SESSION_MANAGEMENT.RESCHEDULE, (req, res, next) => getController().rescheduleBooking(req, res, next));
router.post(ENDPOINTS.SESSION_MANAGEMENT.RESCHEDULE_ACCEPT, (req, res, next) => getController().acceptReschedule(req, res, next));


router.post(ENDPOINTS.SESSION_MANAGEMENT.RESCHEDULE_DECLINE, (req, res, next) => getController().declineReschedule(req, res, next));

export default router;

