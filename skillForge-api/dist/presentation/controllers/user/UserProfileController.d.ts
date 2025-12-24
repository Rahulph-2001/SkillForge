import { Request, Response, NextFunction } from 'express';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { PrismaClient } from '@prisma/client';
export declare class UserProfileController {
    private readonly prisma;
    private readonly responseBuilder;
    constructor(prisma: PrismaClient, responseBuilder: IResponseBuilder);
    getProviderProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getProviderReviews: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=UserProfileController.d.ts.map