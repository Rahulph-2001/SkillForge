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
      console.log('🟢 [UserProfileController] Update profile request received');
      const userId = (req as any).user.userId;
      const { name, bio, location } = req.body;
      const avatarFile = req.file;

      console.log('🟢 [UserProfileController] Request details:', {
        userId,
        name,
        bio,
        location,
        hasFile: !!avatarFile
      });

      if (avatarFile) {
        console.log('🟢 [UserProfileController] File details:', {
          fieldname: avatarFile.fieldname,
          originalname: avatarFile.originalname,
          encoding: avatarFile.encoding,
          mimetype: avatarFile.mimetype,
          size: avatarFile.size,
          bufferLength: avatarFile.buffer?.length
        });
      } else {
        console.log('⚠️ [UserProfileController] No file in request');
      }

      const updatedProfile = await this.updateUserProfileUseCase.execute({
        userId,
        name,
        bio,
        location,
        avatarFile,
      });

      console.log('✅ [UserProfileController] Profile updated successfully');
      console.log('🟢 [UserProfileController] Response data:', updatedProfile);
      console.log('🟢 [UserProfileController] Avatar URL in response:', updatedProfile.avatarUrl);

      const response = this.responseBuilder.success(
        updatedProfile,
        'Profile updated successfully',
        HttpStatusCode.OK
      );
      
      console.log('🟢 [UserProfileController] Final response body:', JSON.stringify(response.body, null, 2));
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      console.error('❌ [UserProfileController] Error updating profile:', error);
      next(error);
    }
  };
}
