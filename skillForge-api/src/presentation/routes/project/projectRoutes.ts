import { Router } from 'express';
import { container } from '../../../infrastructure/di/container';
import { TYPES } from '../../../infrastructure/di/types';
import { ProjectController } from '../../controllers/ProjectController';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { authMiddleware } from '../../middlewares/authMiddleware';

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
      '/',
      asyncHandler(this.projectController.listProjects.bind(this.projectController))
    );

    // Protected routes (can be added later for create/update/delete)
    // this.router.post(
    //   '/',
    //   authMiddleware,
    //   asyncHandler(this.projectController.createProject.bind(this.projectController))
    // );
  }
}

