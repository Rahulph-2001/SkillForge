import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { MCQImportController } from '../../controllers/mcq/MCQImportController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { adminMiddleware } from '../../middlewares/adminMiddleware';
import { uploadImportFile } from '../../../config/multer';
import { ENDPOINTS } from '../../../config/routes';

@injectable()
export class MCQImportRoutes {
  public router: Router;

  constructor(
    @inject(TYPES.MCQImportController) private mcqImportController: MCQImportController
  ) {
    console.log('[MCQImportRoutes] Constructor called - initializing routes');
    this.router = Router();
    this.setupRoutes();
    console.log('[MCQImportRoutes] Routes setup complete');
  }

  private setupRoutes(): void {
    console.log('[MCQImportRoutes] Setting up MCQ import routes');

    this.router.use(authMiddleware, adminMiddleware);

    // Add logging middleware to track requests
    this.router.use((req, _res, next) => {
      console.log('[MCQImportRoutes] Request received:', {
        method: req.method,
        path: req.path,
        params: req.params,
        hasFile: !!req.file
      });
      next();
    });

    this.router.post(
      ENDPOINTS.MCQ_IMPORT.START_IMPORT,
      uploadImportFile.single('csvFile'),
      this.mcqImportController.startImport
    );


    this.router.get(
      ENDPOINTS.MCQ_IMPORT.STATUS,
      this.mcqImportController.listJobs
    );


    this.router.get(
      ENDPOINTS.MCQ_IMPORT.DOWNLOAD_ERRORS,
      this.mcqImportController.downloadErrors
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}

