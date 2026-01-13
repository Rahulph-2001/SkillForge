import { Request, Response, NextFunction } from 'express';
import { IGetUserSubscriptionUseCase } from '../../../application/useCases/subscription/interfaces/IGetUserSubscriptionUseCase';
import { ICancelSubscriptionUseCase } from '../../../application/useCases/subscription/interfaces/ICancelSubscriptionUseCase';
import { IReactivateSubscriptionUseCase } from '../../../application/useCases/subscription/interfaces/IReactivateSubscriptionUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
export declare class UserSubscriptionController {
    private readonly getUserSubscriptionUseCase;
    private readonly cancelSubscriptionUseCase;
    private readonly reactivateSubscriptionUseCase;
    private readonly responseBuilder;
    constructor(getUserSubscriptionUseCase: IGetUserSubscriptionUseCase, cancelSubscriptionUseCase: ICancelSubscriptionUseCase, reactivateSubscriptionUseCase: IReactivateSubscriptionUseCase, responseBuilder: IResponseBuilder);
    /**
     * GET /api/v1/subscriptions/me
     * Get current user's subscription
     */
    getCurrentSubscription(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/subscriptions/cancel
     * Cancel current user's subscription
     */
    cancelSubscription(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/subscriptions/reactivate
     * Reactivate (Undo Cancel) subscription
     */
    reactivateSubscription(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=UserSubscriptionController.d.ts.map