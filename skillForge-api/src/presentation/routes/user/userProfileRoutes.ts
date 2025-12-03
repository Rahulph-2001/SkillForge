import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { UserProfileController } from '../../controllers/user/UserProfileController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import multer from 'multer';

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
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
    this.router.get('/', this.userProfileController.getProfile);

    // PUT /api/v1/profile - Update current user profile
    this.router.put('/', upload.single('avatar'), this.userProfileController.updateProfile);
  }

  public getRouter(): Router {
    return this.router;
  }
}
