import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { GetUserProfileUseCase } from '../../../application/useCases/user/GetUserProfileUseCase';
import { UpdateUserProfileUseCase } from '../../../application/useCases/user/UpdateUserProfileUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';

@injectable()
export class UserProfileController {
  constructor(
    @inject(TYPES.GetUserProfileUseCase) private getUserProfileUseCase: GetUserProfileUseCase,
    @inject(TYPES.UpdateUserProfileUseCase) private updateUserProfileUseCase: UpdateUserProfileUseCase,
    @inject(TYPES.IResponseBuilder) private responseBuilder: IResponseBuilder
  ) {}

  public getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.userId;

      const profile = await this.getUserProfileUseCase.execute(userId);

      const response = this.responseBuilder.success(
        profile,
        'Profile retrieved successfully',
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };

  public updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.userId;
      const { name, bio, location } = req.body;
      const avatarFile = req.file;

      const updatedProfile = await this.updateUserProfileUseCase.execute({
        userId,
        name,
        bio,
        location,
        avatarFile,
      });

      const response = this.responseBuilder.success(
        updatedProfile,
        'Profile updated successfully',
        HttpStatusCode.OK
      );
      
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };
}
