import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IGetProviderProfileUseCase } from '../../../application/useCases/user/interfaces/IGetProviderProfileUseCase';
import { IGetProviderReviewsUseCase } from '../../../application/useCases/user/interfaces/IGetProviderReviewsUseCase';
import { IGetUserProfileUseCase } from '../../../application/useCases/user/interfaces/IGetUserProfileUseCase';
import { IUpdateUserProfileUseCase } from '../../../application/useCases/user/interfaces/IUpdateUserProfileUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';

@injectable()
export class UserProfileController {
  constructor(
    @inject(TYPES.IGetProviderProfileUseCase) private readonly getProviderProfileUseCase: IGetProviderProfileUseCase,
    @inject(TYPES.IGetProviderReviewsUseCase) private readonly getProviderReviewsUseCase: IGetProviderReviewsUseCase,
    @inject(TYPES.IGetUserProfileUseCase) private readonly getUserProfileUseCase: IGetUserProfileUseCase,
    @inject(TYPES.IUpdateUserProfileUseCase) private readonly updateUserProfileUseCase: IUpdateUserProfileUseCase,
    @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder
  ) {}

  async getProviderProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const profile = await this.getProviderProfileUseCase.execute(userId);
      const response = this.responseBuilder.success(profile, 'Profile fetched successfully', HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error: unknown) {
      next(error);
    }
  }

  async getProviderReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const reviews = await this.getProviderReviewsUseCase.execute(userId);
      const response = this.responseBuilder.success(reviews, 'Reviews fetched successfully', HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error: unknown) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(HttpStatusCode.UNAUTHORIZED).json({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }
      const profile = await this.getUserProfileUseCase.execute(userId);
      const response = this.responseBuilder.success(profile, 'Profile fetched successfully', HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error: unknown) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(HttpStatusCode.UNAUTHORIZED).json({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }

      const { name, bio, location } = req.body;
      const avatarFile = req.file as Express.Multer.File | undefined;

      const result = await this.updateUserProfileUseCase.execute({
        userId,
        name,
        bio,
        location,
        avatarFile: avatarFile ? {
          buffer: avatarFile.buffer,
          originalname: avatarFile.originalname,
          mimetype: avatarFile.mimetype,
        } : undefined,
      });

      const response = this.responseBuilder.success(result, 'Profile updated successfully', HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error: unknown) {
      next(error);
    }
  }
}
