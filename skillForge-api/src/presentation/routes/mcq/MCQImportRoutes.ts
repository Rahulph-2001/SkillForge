import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { MCQImportController } from '../../controllers/mcq/MCQImportController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { adminMiddleware } from '../../middlewares/adminMiddleware';
import { uploadImportFile } from '../../../config/multer';

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
    
    this.router.use(authMiddleware, adminMiddleware);
    
    
    this.router.post(
      '/:templateId/import', 
      uploadImportFile.single('csvFile'), 
      this.mcqImportController.startImport
    );
    
   
    this.router.get(
      '/:templateId/status', 
      this.mcqImportController.listJobs
    );
    
    
    this.router.get(
      '/errors/:jobId/download', 
      this.mcqImportController.downloadErrors
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}

