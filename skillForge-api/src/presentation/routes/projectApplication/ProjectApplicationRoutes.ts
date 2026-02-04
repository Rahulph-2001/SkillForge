
import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { ProjectApplicationController } from '../../controllers/projectApplication/ProjectApplicationController';
import { TYPES } from '../../../infrastructure/di/types';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { ENDPOINTS } from '../../../config/routes';

@injectable()
export class ProjectApplicationRoutes {
  public router: Router;

  constructor(
    @inject(TYPES.ProjectApplicationController) private projectApplicationController: ProjectApplicationController
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Apply to a project
    this.router.post(
      ENDPOINTS.PROJECT_APPLICATION.APPLY,
      authMiddleware,
      (req, res, next) => this.projectApplicationController.applyToProject(req, res, next)
    );

    // Get applications for a project (Project Owner)
    this.router.get(
      ENDPOINTS.PROJECT_APPLICATION.GET_PROJECT_APPS,
      authMiddleware,
      (req, res, next) => this.projectApplicationController.getProjectApplications(req, res, next)
    );

    // Get my applications
    this.router.get(
      ENDPOINTS.PROJECT_APPLICATION.MY_APPLICATIONS,
      authMiddleware,
      (req, res, next) => this.projectApplicationController.getMyApplications(req, res, next)
    );

    // Get received applications
    this.router.get(
      ENDPOINTS.PROJECT_APPLICATION.RECEIVED,
      authMiddleware,
      (req, res, next) => this.projectApplicationController.getReceivedApplications(req, res, next)
    );

    // Update application status (Project Owner)
    this.router.patch(
      ENDPOINTS.PROJECT_APPLICATION.UPDATE_STATUS,
      authMiddleware,
      (req, res, next) => this.projectApplicationController.updateStatus(req, res, next)
    );

    // Withdraw application
    this.router.post(
      ENDPOINTS.PROJECT_APPLICATION.WITHDRAW,
      authMiddleware,
      (req, res, next) => this.projectApplicationController.withdrawApplication(req, res, next)
    );
  }
}
