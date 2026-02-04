
import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ProjectMessageController } from '../../controllers/project/ProjectMessageController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { ENDPOINTS } from '../../../config/routes';

@injectable()
export class ProjectMessageRoutes {
    public router: Router;

    constructor(
        @inject(TYPES.ProjectMessageController) private readonly controller: ProjectMessageController
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // These routes will be mounted under /projects/:projectId/messages
        // OR /messages/project/:projectId if needed, but nesting is better.
        // Assuming this router is mounted at /projects/:projectId/messages or similar
        // Let's implement full paths assuming it is mounted at API root or under project

        // Actually, cleaner design is:
        // GET /projects/:projectId/messages
        // POST /projects/:projectId/messages

        this.router.get(ENDPOINTS.PROJECT_MESSAGE.GET_MESSAGES, authMiddleware, this.controller.getMessages);
        this.router.post(ENDPOINTS.PROJECT_MESSAGE.SEND_MESSAGE, authMiddleware, this.controller.sendMessage);
    }
}

