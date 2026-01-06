import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IListPublicSubscriptionPlansUseCase } from '../../../application/useCases/subscription/interfaces/IListPublicSubscriptionPlansUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';


@injectable()
export class PublicSubscriptionController {
  constructor(
    @inject(TYPES.IListPublicSubscriptionPlansUseCase)
    private readonly listPublicPlansUseCase: IListPublicSubscriptionPlansUseCase,
    @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder
  ) {}

  
  async listPlans(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // No authentication required - public endpoint
      const result = await this.listPublicPlansUseCase.execute();

      const response = this.responseBuilder.success(
        result,
        'Subscription plans retrieved successfully'
      );

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
}
