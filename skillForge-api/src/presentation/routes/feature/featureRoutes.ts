import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { FeatureController } from '../../controllers/feature/FeatureController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { adminMiddleware } from '../../middlewares/adminMiddleware';

@injectable()
export class FeatureRoutes {
    public router = Router();

    constructor(
        @inject(TYPES.FeatureController) private readonly featureController: FeatureController
    ) {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // All feature routes require admin authentication
        this.router.use(authMiddleware);
        this.router.use(adminMiddleware);

        // POST /api/v1/admin/features - Create feature
        this.router.post(
            '/',
            (req, res, next) => this.featureController.createFeature(req, res, next)
        );

        // GET /api/v1/admin/features - List features
        this.router.get(
            '/',
            (req, res, next) => this.featureController.listFeatures(req, res, next)
        );

        // GET /api/v1/admin/features/:id - Get feature by ID
        this.router.get(
            '/:id',
            (req, res, next) => this.featureController.getFeature(req, res, next)
        );

        // PUT /api/v1/admin/features/:id - Update feature
        this.router.put(
            '/:id',
            (req, res, next) => this.featureController.updateFeature(req, res, next)
        );

        // DELETE /api/v1/admin/features/:id - Delete feature
        this.router.delete(
            '/:id',
            (req, res, next) => this.featureController.deleteFeature(req, res, next)
        );
    }
}
