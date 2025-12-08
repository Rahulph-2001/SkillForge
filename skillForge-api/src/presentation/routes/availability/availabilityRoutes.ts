import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { AvailabilityController } from '../../controllers/availability/AvailabilityController';
import { authMiddleware } from '../../middlewares/authMiddleware';

@injectable()
export class AvailabilityRoutes {
    public router: Router;

    constructor(
        @inject(TYPES.AvailabilityController) private controller: AvailabilityController
    ) {
        this.router = Router();
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.router.use(authMiddleware);

        this.router.get('/', this.controller.getAvailability.bind(this.controller));
        this.router.put('/', this.controller.updateAvailability.bind(this.controller));
    }
}
