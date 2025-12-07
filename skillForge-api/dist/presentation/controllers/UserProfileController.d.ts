import { Request, Response } from 'express';
export declare class UserProfileController {
    static getProviderProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get provider reviews
     * GET /api/users/:userId/reviews
     */
    static getProviderReviews(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=UserProfileController.d.ts.map