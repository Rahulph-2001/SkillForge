import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { IListPublicSubscriptionPlansUseCase } from './interfaces/IListPublicSubscriptionPlansUseCase';
import { ListPublicSubscriptionPlansResponseDTO } from '../../dto/subscription/ListPublicSubscriptionPlansResponseDTO';
import { ISubscriptionPlanMapper } from '../../mappers/interfaces/ISubscriptionPlanMapper';
export declare class ListPublicSubscriptionPlansUseCase implements IListPublicSubscriptionPlansUseCase {
    private subscriptionPlanRepository;
    private subscriptionPlanMapper;
    constructor(subscriptionPlanRepository: ISubscriptionPlanRepository, subscriptionPlanMapper: ISubscriptionPlanMapper);
    execute(): Promise<ListPublicSubscriptionPlansResponseDTO>;
}
//# sourceMappingURL=ListPublicSubscriptionPlansUseCase.d.ts.map