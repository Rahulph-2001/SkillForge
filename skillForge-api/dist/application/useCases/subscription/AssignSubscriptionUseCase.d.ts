import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { IUserSubscriptionMapper } from '../../mappers/interfaces/IUserSubscriptionMapper';
import { AssignSubscriptionDTO } from '../../dto/subscription/AssignSubscriptionDTO';
import { UserSubscriptionResponseDTO } from '../../dto/subscription/UserSubscriptionResponseDTO';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IAssignSubscriptionUseCase } from './interfaces/IAssignSubscriptionUseCase';
export declare class AssignSubscriptionUseCase implements IAssignSubscriptionUseCase {
    private subscriptionRepository;
    private planRepository;
    private userRepository;
    private userSubscriptionMapper;
    constructor(subscriptionRepository: IUserSubscriptionRepository, planRepository: ISubscriptionPlanRepository, userRepository: IUserRepository, userSubscriptionMapper: IUserSubscriptionMapper);
    execute(dto: AssignSubscriptionDTO): Promise<UserSubscriptionResponseDTO>;
}
//# sourceMappingURL=AssignSubscriptionUseCase.d.ts.map