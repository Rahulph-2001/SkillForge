import { Request, Response, NextFunction } from 'express';
import { IListSubscriptionPlansUseCase } from '../../../application/useCases/subscription/interfaces/IListSubscriptionPlansUseCase';
import { IGetSubscriptionStatsUseCase } from '../../../application/useCases/subscription/interfaces/IGetSubscriptionStatsUseCase';
import { ICreateSubscriptionPlanUseCase } from '../../../application/useCases/subscription/interfaces/ICreateSubscriptionPlanUseCase';
import { IUpdateSubscriptionPlanUseCase } from '../../../application/useCases/subscription/interfaces/IUpdateSubscriptionPlanUseCase';
import { IDeleteSubscriptionPlanUseCase } from '../../../application/useCases/subscription/interfaces/IDeleteSubscriptionPlanUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
export declare class SubscriptionController {
    private readonly listPlansUseCase;
    private readonly getStatsUseCase;
    private readonly createPlanUseCase;
    private readonly updatePlanUseCase;
    private readonly deletePlanUseCase;
    private readonly responseBuilder;
    constructor(listPlansUseCase: IListSubscriptionPlansUseCase, getStatsUseCase: IGetSubscriptionStatsUseCase, createPlanUseCase: ICreateSubscriptionPlanUseCase, updatePlanUseCase: IUpdateSubscriptionPlanUseCase, deletePlanUseCase: IDeleteSubscriptionPlanUseCase, responseBuilder: IResponseBuilder);
    /**
     * GET /api/v1/admin/subscriptions/plans
     * List all subscription plans
     */
    listPlans(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/admin/subscriptions/stats
     * Get subscription statistics
     */
    getStats(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/admin/subscriptions/plans
     * Create a new subscription plan
     */
    createPlan(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * PUT /api/v1/admin/subscriptions/plans/:id
     * Update an existing subscription plan
     */
    updatePlan(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * DELETE /api/v1/admin/subscriptions/plans/:id
     * Delete (soft delete) a subscription plan
     */
    deletePlan(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=SubscriptionController.d.ts.map