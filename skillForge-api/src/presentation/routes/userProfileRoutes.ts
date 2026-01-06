import { Router } from 'express';
import { container } from '../../infrastructure/di/container';
import { TYPES } from '../../infrastructure/di/types';
import { UserProfileController } from '../controllers/user/UserProfileController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get controller from DI container
const userProfileController = container.get<UserProfileController>(TYPES.UserProfileController);

router.get('/:userId/profile', (req, res, next) => {
  userProfileController.getProviderProfile(req, res, next);
});

router.get('/:userId/reviews', (req, res, next) => {
  userProfileController.getProviderReviews(req, res, next);
});

export default router;
