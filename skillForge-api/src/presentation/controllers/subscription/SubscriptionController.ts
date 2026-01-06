import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IListSubscriptionPlansUseCase } from '../../../application/useCases/subscription/interfaces/IListSubscriptionPlansUseCase';
import { IGetSubscriptionStatsUseCase } from '../../../application/useCases/subscription/interfaces/IGetSubscriptionStatsUseCase';
import { ICreateSubscriptionPlanUseCase } from '../../../application/useCases/subscription/interfaces/ICreateSubscriptionPlanUseCase';
import { IUpdateSubscriptionPlanUseCase } from '../../../application/useCases/subscription/interfaces/IUpdateSubscriptionPlanUseCase';
import { IDeleteSubscriptionPlanUseCase } from '../../../application/useCases/subscription/interfaces/IDeleteSubscriptionPlanUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { SUCCESS_MESSAGES } from '../../../config/messages';


@injectable()
export class SubscriptionController {
  constructor(
    @inject(TYPES.IListSubscriptionPlansUseCase) private readonly listPlansUseCase: IListSubscriptionPlansUseCase,
    @inject(TYPES.IGetSubscriptionStatsUseCase) private readonly getStatsUseCase: IGetSubscriptionStatsUseCase,
    @inject(TYPES.ICreateSubscriptionPlanUseCase) private readonly createPlanUseCase: ICreateSubscriptionPlanUseCase,
    @inject(TYPES.IUpdateSubscriptionPlanUseCase) private readonly updatePlanUseCase: IUpdateSubscriptionPlanUseCase,
    @inject(TYPES.IDeleteSubscriptionPlanUseCase) private readonly deletePlanUseCase: IDeleteSubscriptionPlanUseCase,
    @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder
  ) { }

  /**
   * GET /api/v1/admin/subscriptions/plans
   * List all subscription plans
   */
  async listPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = (req as any).user.userId;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;

      const result = await this.listPlansUseCase.execute({
        adminUserId,
        page,
        limit,
        isActive
      });
      const response = this.responseBuilder.success(
        result,
        SUCCESS_MESSAGES.SUBSCRIPTION.PLANS_FETCHED
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
        SUCCESS_MESSAGES.SUBSCRIPTION.STATS_FETCHED
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
        SUCCESS_MESSAGES.SUBSCRIPTION.PLAN_CREATED
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
      const dto = req.body;
      const plan = await this.updatePlanUseCase.execute(adminUserId, planId, dto);
      const response = this.responseBuilder.success(
        plan,
        SUCCESS_MESSAGES.SUBSCRIPTION.PLAN_UPDATED
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
        { message: SUCCESS_MESSAGES.SUBSCRIPTION.PLAN_DELETED },
        SUCCESS_MESSAGES.SUBSCRIPTION.PLAN_DELETED
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }
}
