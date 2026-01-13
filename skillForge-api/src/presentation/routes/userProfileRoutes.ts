import { Router } from 'express';
import { container } from '../../infrastructure/di/container';
import { TYPES } from '../../infrastructure/di/types';
import { UserProfileController } from '../controllers/user/UserProfileController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Lazy get controller from DI container to ensure bindings are complete
const getUserProfileController = () => {
  return container.get<UserProfileController>(TYPES.UserProfileController);
};

router.get('/:userId/profile', (req, res, next) => {
  const userProfileController = getUserProfileController();
  userProfileController.getProviderProfile(req, res, next);
});

router.get('/:userId/reviews', (req, res, next) => {
  const userProfileController = getUserProfileController();
  userProfileController.getProviderReviews(req, res, next);
});

export default router;
