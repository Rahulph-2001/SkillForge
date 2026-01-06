import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../infrastructure/di/types';
import { IGetProviderProfileUseCase } from '../../application/useCases/user/interfaces/IGetProviderProfileUseCase';
import { IGetProviderReviewsUseCase } from '../../application/useCases/user/interfaces/IGetProviderReviewsUseCase';
import { IResponseBuilder } from '../../shared/http/IResponseBuilder';
import { HttpStatusCode } from '../../domain/enums/HttpStatusCode';

@injectable()
export class UserProfileController {
  constructor(
    @inject(TYPES.IGetProviderProfileUseCase) private readonly getProviderProfileUseCase: IGetProviderProfileUseCase,
    @inject(TYPES.IGetProviderReviewsUseCase) private readonly getProviderReviewsUseCase: IGetProviderReviewsUseCase,
    @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder
  ) {}

  async getProviderProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const profile = await this.getProviderProfileUseCase.execute(userId);
      const response = this.responseBuilder.success(profile, 'Profile fetched successfully', HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error: any) {
      next(error);
    }
  }

  async getProviderReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const reviews = await this.getProviderReviewsUseCase.execute(userId);
      const response = this.responseBuilder.success(reviews, 'Reviews fetched successfully', HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error: any) {
      next(error);
    }
  }
}
