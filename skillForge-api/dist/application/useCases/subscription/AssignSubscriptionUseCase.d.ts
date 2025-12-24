import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { AssignSubscriptionDTO } from '../../dto/subscription/AssignSubscriptionDTO';
import { UserSubscriptionResponseDTO } from '../../dto/subscription/UserSubscriptionResponseDTO';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
export interface IAssignSubscriptionUseCase {
    execute(dto: AssignSubscriptionDTO): Promise<UserSubscriptionResponseDTO>;
}
export declare class AssignSubscriptionUseCase implements IAssignSubscriptionUseCase {
    private subscriptionRepository;
    private planRepository;
    private userRepository;
    constructor(subscriptionRepository: IUserSubscriptionRepository, planRepository: ISubscriptionPlanRepository, userRepository: IUserRepository);
    execute(dto: AssignSubscriptionDTO): Promise<UserSubscriptionResponseDTO>;
}
//# sourceMappingURL=AssignSubscriptionUseCase.d.ts.map