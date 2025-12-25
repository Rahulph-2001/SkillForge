import { User } from '../../domain/entities/User';
import { UserResponseDTO } from '../dto/auth/UserResponseDTO';
import { IUserDTOMapper } from './interfaces/IUserDTOMapper';
import { IUserSubscriptionRepository } from '../../domain/repositories/IUserSubscriptionRepository';
import { ISubscriptionPlanRepository } from '../../domain/repositories/ISubscriptionPlanRepository';
export declare class UserDTOMapper implements IUserDTOMapper {
    private subscriptionRepository;
    private planRepository;
    constructor(subscriptionRepository: IUserSubscriptionRepository, planRepository: ISubscriptionPlanRepository);
    toUserResponseDTO(user: User): Promise<UserResponseDTO>;
}
//# sourceMappingURL=UserDTOMapper.d.ts.map