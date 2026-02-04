import { Router } from 'express';
import { container } from '../../../infrastructure/di/container';
import { TYPES } from '../../../infrastructure/di/types';
import { ProjectController } from '../../controllers/ProjectController';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { ENDPOINTS } from '../../../config/routes';

export class ProjectRoutes {
  public router: Router;
  private projectController: ProjectController;

  constructor() {
    this.router = Router();
    this.projectController = container.get<ProjectController>(TYPES.ProjectController);

    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Public routes
    this.router.get(
      ENDPOINTS.PROJECT.ROOT,
      asyncHandler(this.projectController.listProjects.bind(this.projectController))
    );

    this.router.get(
      ENDPOINTS.PROJECT.MY_PROJECTS,
      authMiddleware,
      asyncHandler(this.projectController.getMyProjects.bind(this.projectController))
    );

    this.router.get(
      ENDPOINTS.PROJECT.CONTRIBUTING,
      authMiddleware,
      asyncHandler(this.projectController.getContributingProjects.bind(this.projectController))
    );

    this.router.get(
      ENDPOINTS.PROJECT.BY_ID,
      asyncHandler(this.projectController.getProject.bind(this.projectController))
    );

    this.router.post(
      ENDPOINTS.PROJECT.COMPLETE,
      authMiddleware,
      asyncHandler(this.projectController.requestCompletion.bind(this.projectController))
    );

    this.router.post(
      ENDPOINTS.PROJECT.REVIEW,
      authMiddleware,
      asyncHandler(this.projectController.reviewCompletion.bind(this.projectController))
    );

    // Protected routes (can be added later for create/update/delete)
    // this.router.post(
    //   ENDPOINTS.PROJECT.ROOT,
    //   authMiddleware,
    //   asyncHandler(this.projectController.createProject.bind(this.projectController))
    // );
  }
}


