import { Request, Response, NextFunction } from 'express';
import { GetUserProfileUseCase } from '../../../application/useCases/user/GetUserProfileUseCase';
import { UpdateUserProfileUseCase } from '../../../application/useCases/user/UpdateUserProfileUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
export declare class UserProfileController {
    private getUserProfileUseCase;
    private updateUserProfileUseCase;
    private responseBuilder;
    constructor(getUserProfileUseCase: GetUserProfileUseCase, updateUserProfileUseCase: UpdateUserProfileUseCase, responseBuilder: IResponseBuilder);
    getProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=UserProfileController.d.ts.map