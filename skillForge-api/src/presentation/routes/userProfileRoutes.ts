import { Router } from 'express';
import { UserProfileController } from '../controllers/UserProfileController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @route   GET /api/users/:userId/profile
 * @desc    Get public provider profile
 * @access  Private
 */
router.get('/:userId/profile', UserProfileController.getProviderProfile);

/**
 * @route   GET /api/users/:userId/reviews
 * @desc    Get provider reviews
 * @access  Private
 */
router.get('/:userId/reviews', UserProfileController.getProviderReviews);

export default router;
