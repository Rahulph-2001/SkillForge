import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ListPublicSubscriptionPlansUseCase } from '../../../application/useCases/subscription/ListPublicSubscriptionPlansUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { handleAsync } from '../../middlewares/responseHandler';


@injectable()
export class PublicSubscriptionController {
  constructor(
    @inject(TYPES.ListPublicSubscriptionPlansUseCase)
    private readonly listPublicPlansUseCase: ListPublicSubscriptionPlansUseCase,
    @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder
  ) {}

  
  async listPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
    await handleAsync(async () => {
      // No authentication required - public endpoint
      const result = await this.listPublicPlansUseCase.execute();

      const response = this.responseBuilder.success(
        result,
        'Subscription plans retrieved successfully'
      );

      res.status(response.statusCode).json(response);
    }, req, res, next);
  }
}
