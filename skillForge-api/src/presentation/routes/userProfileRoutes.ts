import { Router } from 'express';
import { container } from '../../infrastructure/di/container';
import { TYPES } from '../../infrastructure/di/types';
import { type UserProfileController } from '../controllers/user/UserProfileController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { ENDPOINTS } from '../../config/routes';

const router = Router();

// All routes require authentication
// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.use(authMiddleware as any);

// Lazy get controller from DI container to ensure bindings are complete
const getUserProfileController = () => {
  return container.get<UserProfileController>(TYPES.UserProfileController);
};

router.get(ENDPOINTS.USER_PROFILE.PROVIDER_PROFILE, (req, res, next) => {
  const userProfileController = getUserProfileController();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  void userProfileController.getProviderProfile(req as any, res as any, next);
});

router.get(ENDPOINTS.USER_PROFILE.PROVIDER_REVIEWS, (req, res, next) => {
  const userProfileController = getUserProfileController();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  void userProfileController.getProviderReviews(req as any, res as any, next);
});

export default router;

