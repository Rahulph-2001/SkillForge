import { type AssignSubscriptionDTO } from '../../../dto/subscription/AssignSubscriptionDTO';
import { type UserSubscriptionResponseDTO } from '../../../dto/subscription/UserSubscriptionResponseDTO';

export interface IAssignSubscriptionUseCase {
    execute(dto: AssignSubscriptionDTO): Promise<UserSubscriptionResponseDTO>;
}

