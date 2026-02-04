import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { AvailabilityController } from '../../controllers/availability/AvailabilityController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { ENDPOINTS } from '../../../config/routes';

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

        this.router.get(ENDPOINTS.AVAILABILITY.ROOT, this.controller.getAvailability.bind(this.controller));
        this.router.put(ENDPOINTS.AVAILABILITY.ROOT, this.controller.updateAvailability.bind(this.controller));
        this.router.get(ENDPOINTS.AVAILABILITY.SLOTS, this.controller.getOccupiedSlots.bind(this.controller));
    }
}

