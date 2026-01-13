import { Request, Response, NextFunction } from 'express';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { ICreateFeatureUseCase } from '../../../application/useCases/feature/interfaces/ICreateFeatureUseCase';
import { IListFeaturesUseCase } from '../../../application/useCases/feature/interfaces/IListFeaturesUseCase';
import { IGetFeatureByIdUseCase } from '../../../application/useCases/feature/interfaces/IGetFeatureByIdUseCase';
import { IUpdateFeatureUseCase } from '../../../application/useCases/feature/interfaces/IUpdateFeatureUseCase';
import { IDeleteFeatureUseCase } from '../../../application/useCases/feature/interfaces/IDeleteFeatureUseCase';
export declare class FeatureController {
    private readonly createFeatureUseCase;
    private readonly listFeaturesUseCase;
    private readonly getFeatureByIdUseCase;
    private readonly updateFeatureUseCase;
    private readonly deleteFeatureUseCase;
    private readonly responseBuilder;
    constructor(createFeatureUseCase: ICreateFeatureUseCase, listFeaturesUseCase: IListFeaturesUseCase, getFeatureByIdUseCase: IGetFeatureByIdUseCase, updateFeatureUseCase: IUpdateFeatureUseCase, deleteFeatureUseCase: IDeleteFeatureUseCase, responseBuilder: IResponseBuilder);
    /**
     * POST /api/v1/admin/features
     * Create a new feature
     */
    createFeature(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/admin/features
     * List all features (optionally filtered by planId)
     */
    listFeatures(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/admin/features/:id
     * Get feature by ID
     */
    getFeature(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * PUT /api/v1/admin/features/:id
     * Update an existing feature
     */
    updateFeature(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * DELETE /api/v1/admin/features/:id
     * Delete (soft delete) a feature
     */
    deleteFeature(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=FeatureController.d.ts.map