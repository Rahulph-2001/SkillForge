import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IListSubscriptionPlansUseCase } from './interfaces/IListSubscriptionPlansUseCase';
import { ListSubscriptionPlansRequestDTO } from '../../dto/subscription/ListSubscriptionPlansRequestDTO';
import { ListSubscriptionPlansResponseDTO } from '../../dto/subscription/ListSubscriptionPlansResponseDTO';
import { ISubscriptionPlanMapper } from '../../mappers/interfaces/ISubscriptionPlanMapper';
export declare class ListSubscriptionPlansUseCase implements IListSubscriptionPlansUseCase {
    private userRepository;
    private subscriptionPlanRepository;
    private subscriptionPlanMapper;
    constructor(userRepository: IUserRepository, subscriptionPlanRepository: ISubscriptionPlanRepository, subscriptionPlanMapper: ISubscriptionPlanMapper);
    execute(request: ListSubscriptionPlansRequestDTO): Promise<ListSubscriptionPlansResponseDTO>;
}
//# sourceMappingURL=ListSubscriptionPlansUseCase.d.ts.map