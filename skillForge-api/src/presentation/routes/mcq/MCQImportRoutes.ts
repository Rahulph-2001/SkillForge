import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { MCQImportController } from '../../controllers/mcq/MCQImportController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { adminMiddleware } from '../../middlewares/adminMiddleware';
import { uploadCSV } from '../../../config/multer'; // Import CSV multer config

@injectable()
export class MCQImportRoutes {
  public router: Router;

  constructor(
    @inject(TYPES.MCQImportController) private mcqImportController: MCQImportController
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // All routes require authentication and admin role
    this.router.use(authMiddleware, adminMiddleware);
    
    // POST /api/v1/admin/mcq/import/:templateId
    // Use multer configured for memory storage and CSV file filtering
    this.router.post(
      '/:templateId/import', 
      uploadCSV.single('csvFile'), 
      this.mcqImportController.startImport
    );
    
    // GET /api/v1/admin/mcq/import/:templateId/status
    this.router.get(
      '/:templateId/status', 
      this.mcqImportController.listJobs
    );
    
    // GET /api/v1/admin/mcq/import/errors/:jobId/download
    this.router.get(
      '/errors/:jobId/download', 
      this.mcqImportController.downloadErrors
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}