import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IGetUserSubscriptionUseCase } from '../../../application/useCases/subscription/interfaces/IGetUserSubscriptionUseCase';
import { ICancelSubscriptionUseCase } from '../../../application/useCases/subscription/interfaces/ICancelSubscriptionUseCase';
import { IReactivateSubscriptionUseCase } from '../../../application/useCases/subscription/interfaces/IReactivateSubscriptionUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../../config/messages';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';
import { NotFoundError } from '../../../domain/errors/AppError';

@injectable()
export class UserSubscriptionController {
    constructor(
        @inject(TYPES.IGetUserSubscriptionUseCase) private readonly getUserSubscriptionUseCase: IGetUserSubscriptionUseCase,
        @inject(TYPES.ICancelSubscriptionUseCase) private readonly cancelSubscriptionUseCase: ICancelSubscriptionUseCase,
        @inject(TYPES.IReactivateSubscriptionUseCase) private readonly reactivateSubscriptionUseCase: IReactivateSubscriptionUseCase,
        @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder
    ) { }

    /**
     * GET /api/v1/subscriptions/me
     * Get current user's subscription
     */
    async getCurrentSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as any).user.userId;

            try {
                const subscription = await this.getUserSubscriptionUseCase.execute(userId);
                const response = this.responseBuilder.success(
                    subscription,
                    SUCCESS_MESSAGES.SUBSCRIPTION.SUBSCRIPTION_FETCHED
                );
                res.status(response.statusCode).json(response.body);
            } catch (error) {
                // If no subscription found, return null (free plan)
                if (error instanceof NotFoundError) {
                    const response = this.responseBuilder.success(
                        null,
                        'No active subscription'
                    );
                    res.status(response.statusCode).json(response.body);
                    return;
                }
                throw error;
            }
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/v1/subscriptions/cancel
     * Cancel current user's subscription
     */
    async cancelSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as any).user.userId;
            const { immediately = false } = req.body;

            await this.cancelSubscriptionUseCase.execute(userId, immediately);

            const response = this.responseBuilder.success(
                { cancelled: true },
                SUCCESS_MESSAGES.SUBSCRIPTION.SUBSCRIPTION_CANCELLED
            );
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/v1/subscriptions/reactivate
     * Reactivate (Undo Cancel) subscription
     */
    async reactivateSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as any).user.userId;

            await this.reactivateSubscriptionUseCase.execute(userId);

            const response = this.responseBuilder.success(
                { reactivated: true },
                'Subscription reactivated successfully'
            );
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            next(error);
        }
    }
}
