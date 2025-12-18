import { Request, Response, NextFunction } from 'express';
import { IListPublicSubscriptionPlansUseCase } from '../../../application/useCases/subscription/interfaces/IListPublicSubscriptionPlansUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
export declare class PublicSubscriptionController {
    private readonly listPublicPlansUseCase;
    private readonly responseBuilder;
    constructor(listPublicPlansUseCase: IListPublicSubscriptionPlansUseCase, responseBuilder: IResponseBuilder);
    listPlans(_req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=PublicSubscriptionController.d.ts.map