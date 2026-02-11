import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { SUCCESS_MESSAGES } from '../../../config/messages';
import { ICreateFeatureUseCase } from '../../../application/useCases/feature/interfaces/ICreateFeatureUseCase';
import { IListFeaturesUseCase } from '../../../application/useCases/feature/interfaces/IListFeaturesUseCase';
import { IGetFeatureByIdUseCase } from '../../../application/useCases/feature/interfaces/IGetFeatureByIdUseCase';
import { IUpdateFeatureUseCase } from '../../../application/useCases/feature/interfaces/IUpdateFeatureUseCase';
import { IDeleteFeatureUseCase } from '../../../application/useCases/feature/interfaces/IDeleteFeatureUseCase';

@injectable()
export class FeatureController {
    constructor(
        @inject(TYPES.ICreateFeatureUseCase) private readonly createFeatureUseCase: ICreateFeatureUseCase,
        @inject(TYPES.IListFeaturesUseCase) private readonly listFeaturesUseCase: IListFeaturesUseCase,
        @inject(TYPES.IGetFeatureByIdUseCase) private readonly getFeatureByIdUseCase: IGetFeatureByIdUseCase,
        @inject(TYPES.IUpdateFeatureUseCase) private readonly updateFeatureUseCase: IUpdateFeatureUseCase,
        @inject(TYPES.IDeleteFeatureUseCase) private readonly deleteFeatureUseCase: IDeleteFeatureUseCase,
        @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder
    ) { }

    
    async createFeature(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto = req.body;
            const feature = await this.createFeatureUseCase.execute(dto);

            const response = this.responseBuilder.success(
                feature,
                SUCCESS_MESSAGES.FEATURE.CREATED
            );
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            next(error);
        }
    }

   
    async listFeatures(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const planId = req.query.planId as string | undefined;
            const highlightedOnly = req.query.highlightedOnly === 'true';
            const page = req.query.page ? parseInt(req.query.page as string): undefined;
            const limit = req.query.limit ? parseInt(req.query.limit as string): undefined;
            const search = req.query.search as string | undefined;

            const result = await this.listFeaturesUseCase.execute(page, limit, search, planId, highlightedOnly);

            const response = this.responseBuilder.success(
                result,
                SUCCESS_MESSAGES.FEATURE.FETCHED
            );
            res.status(response.statusCode).json(response.body)
            
        } catch (error) {
            next(error)
        }
    }

   
    async getFeature(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const featureId = req.params.id;
            const feature = await this.getFeatureByIdUseCase.execute(featureId);

            const response = this.responseBuilder.success(
                feature,
                SUCCESS_MESSAGES.FEATURE.FEATURE_FETCHED
            );
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            next(error);
        }
    }

    /**
     * PUT /api/v1/admin/features/:id
     * Update an existing feature
     */
    async updateFeature(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const featureId = req.params.id;
            const dto = req.body;
            const feature = await this.updateFeatureUseCase.execute(featureId, dto);

            const response = this.responseBuilder.success(
                feature,
                SUCCESS_MESSAGES.FEATURE.UPDATED
            );
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /api/v1/admin/features/:id
     * Delete (soft delete) a feature
     */
    async deleteFeature(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const featureId = req.params.id;
            await this.deleteFeatureUseCase.execute(featureId);

            const response = this.responseBuilder.success(
                { message: SUCCESS_MESSAGES.FEATURE.DELETED },
                SUCCESS_MESSAGES.FEATURE.DELETED
            );
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            next(error);
        }
    }
}
