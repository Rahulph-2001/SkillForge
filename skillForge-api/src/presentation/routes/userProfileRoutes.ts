import { Router } from 'express';
import { UserProfileController } from '../controllers/UserProfileController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);


router.get('/:userId/profile', UserProfileController.getProviderProfile);


router.get('/:userId/reviews', UserProfileController.getProviderReviews);

export default router;
