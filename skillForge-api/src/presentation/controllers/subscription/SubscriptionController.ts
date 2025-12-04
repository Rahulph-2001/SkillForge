import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IListSubscriptionPlansUseCase } from '../../../application/useCases/subscription/interfaces/IListSubscriptionPlansUseCase';
import { GetSubscriptionStatsUseCase } from '../../../application/useCases/subscription/GetSubscriptionStatsUseCase';
import { ICreateSubscriptionPlanUseCase } from '../../../application/useCases/subscription/interfaces/ICreateSubscriptionPlanUseCase';
import { IUpdateSubscriptionPlanUseCase } from '../../../application/useCases/subscription/interfaces/IUpdateSubscriptionPlanUseCase';
import { DeleteSubscriptionPlanUseCase } from '../../../application/useCases/subscription/DeleteSubscriptionPlanUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';


@injectable()
export class SubscriptionController {
  constructor(
    @inject(TYPES.ListSubscriptionPlansUseCase) private readonly listPlansUseCase: IListSubscriptionPlansUseCase,
    @inject(TYPES.GetSubscriptionStatsUseCase) private readonly getStatsUseCase: GetSubscriptionStatsUseCase,
    @inject(TYPES.CreateSubscriptionPlanUseCase) private readonly createPlanUseCase: ICreateSubscriptionPlanUseCase,
    @inject(TYPES.UpdateSubscriptionPlanUseCase) private readonly updatePlanUseCase: IUpdateSubscriptionPlanUseCase,
    @inject(TYPES.DeleteSubscriptionPlanUseCase) private readonly deletePlanUseCase: DeleteSubscriptionPlanUseCase,
    @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder
  ) {}

  /**
   * GET /api/v1/admin/subscriptions/plans
   * List all subscription plans
   */
  async listPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = (req as any).user.userId;
      const result = await this.listPlansUseCase.execute({ adminUserId });
      const response = this.responseBuilder.success(
        result,
        'Subscription plans retrieved successfully'
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/subscriptions/stats
   * Get subscription statistics
   */
  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = (req as any).user.userId;
      const stats = await this.getStatsUseCase.execute(adminUserId);
      const response = this.responseBuilder.success(
        stats,
        'Subscription statistics retrieved successfully'
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/admin/subscriptions/plans
   * Create a new subscription plan
   */
  async createPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = (req as any).user.userId;
      const dto = req.body;
      const plan = await this.createPlanUseCase.execute(adminUserId, dto);
      const response = this.responseBuilder.success(
        plan,
        'Subscription plan created successfully'
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/admin/subscriptions/plans/:id
   * Update an existing subscription plan
   */
  async updatePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = (req as any).user.userId;
      const planId = req.params.id;
      const dto = { ...req.body, planId };
      const plan = await this.updatePlanUseCase.execute(adminUserId, dto);
      const response = this.responseBuilder.success(
        plan,
        'Subscription plan updated successfully'
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/admin/subscriptions/plans/:id
   * Delete (soft delete) a subscription plan
   */
  async deletePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = (req as any).user.userId;
      const planId = req.params.id;
      await this.deletePlanUseCase.execute(adminUserId, planId);
      const response = this.responseBuilder.success(
        { message: 'Subscription plan deleted successfully' },
        'Subscription plan deleted successfully'
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }
}
