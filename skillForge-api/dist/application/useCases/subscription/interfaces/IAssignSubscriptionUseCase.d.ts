import { AssignSubscriptionDTO } from '../../../dto/subscription/AssignSubscriptionDTO';
import { UserSubscriptionResponseDTO } from '../../../dto/subscription/UserSubscriptionResponseDTO';
export interface IAssignSubscriptionUseCase {
    execute(dto: AssignSubscriptionDTO): Promise<UserSubscriptionResponseDTO>;
}
//# sourceMappingURL=IAssignSubscriptionUseCase.d.ts.map