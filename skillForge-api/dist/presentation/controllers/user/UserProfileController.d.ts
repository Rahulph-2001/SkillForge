import { Request, Response, NextFunction } from 'express';
import { IGetProviderProfileUseCase } from '../../../application/useCases/user/interfaces/IGetProviderProfileUseCase';
import { IGetProviderReviewsUseCase } from '../../../application/useCases/user/interfaces/IGetProviderReviewsUseCase';
import { IGetUserProfileUseCase } from '../../../application/useCases/user/interfaces/IGetUserProfileUseCase';
import { IUpdateUserProfileUseCase } from '../../../application/useCases/user/interfaces/IUpdateUserProfileUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
export declare class UserProfileController {
    private readonly getProviderProfileUseCase;
    private readonly getProviderReviewsUseCase;
    private readonly getUserProfileUseCase;
    private readonly updateUserProfileUseCase;
    private readonly responseBuilder;
    constructor(getProviderProfileUseCase: IGetProviderProfileUseCase, getProviderReviewsUseCase: IGetProviderReviewsUseCase, getUserProfileUseCase: IGetUserProfileUseCase, updateUserProfileUseCase: IUpdateUserProfileUseCase, responseBuilder: IResponseBuilder);
    getProviderProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    getProviderReviews(req: Request, res: Response, next: NextFunction): Promise<void>;
    getProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=UserProfileController.d.ts.map