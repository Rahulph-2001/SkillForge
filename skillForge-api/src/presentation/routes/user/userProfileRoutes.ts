import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { UserProfileController } from '../../controllers/user/UserProfileController';
import { authMiddleware } from '../../middlewares/authMiddleware';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import multer, { FileFilterCallback } from 'multer';
import { ENDPOINTS } from '../../../config/routes';

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fileFilter: (_req: any, file: any, cb: any) => {
    // Accept only image files
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (file.mimetype.startsWith('image/')) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      cb(null, true);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      cb(new Error('Only image files are allowed'));
    }
  },
});

@injectable()
export class UserProfileRoutes {
  private router: Router;

  constructor(
    @inject(TYPES.UserProfileController) private userProfileController: UserProfileController
  ) {
    this.router = Router();
    this.configureRoutes();
  }

  private configureRoutes(): void {
    // Apply auth middleware to all routes
    this.router.use(authMiddleware);

    // GET /api/v1/profile - Get current user profile
    this.router.get(ENDPOINTS.USER_PROFILE.ROOT, this.userProfileController.getProfile.bind(this.userProfileController));

    // PUT /api/v1/profile - Update current user profile
    this.router.put(ENDPOINTS.USER_PROFILE.ROOT, upload.single('avatar'), this.userProfileController.updateProfile.bind(this.userProfileController));
  }

  public getRouter(): Router {
    return this.router;
  }
}

