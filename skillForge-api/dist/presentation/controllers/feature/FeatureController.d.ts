import { Request, Response, NextFunction } from 'express';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { CreateFeatureUseCase } from '../../../application/useCases/feature/CreateFeatureUseCase';
import { ListFeaturesUseCase } from '../../../application/useCases/feature/ListFeaturesUseCase';
import { GetFeatureByIdUseCase } from '../../../application/useCases/feature/GetFeatureByIdUseCase';
import { UpdateFeatureUseCase } from '../../../application/useCases/feature/UpdateFeatureUseCase';
import { DeleteFeatureUseCase } from '../../../application/useCases/feature/DeleteFeatureUseCase';
export declare class FeatureController {
    private readonly createFeatureUseCase;
    private readonly listFeaturesUseCase;
    private readonly getFeatureByIdUseCase;
    private readonly updateFeatureUseCase;
    private readonly deleteFeatureUseCase;
    private readonly responseBuilder;
    constructor(createFeatureUseCase: CreateFeatureUseCase, listFeaturesUseCase: ListFeaturesUseCase, getFeatureByIdUseCase: GetFeatureByIdUseCase, updateFeatureUseCase: UpdateFeatureUseCase, deleteFeatureUseCase: DeleteFeatureUseCase, responseBuilder: IResponseBuilder);
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