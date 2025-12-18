import { UpdateSubscriptionPlanDTO } from '../../../dto/subscription/UpdateSubscriptionPlanDTO';
import { SubscriptionPlanDTO } from '../../../dto/subscription/SubscriptionPlanDTO';
export interface IUpdateSubscriptionPlanUseCase {
    execute(adminUserId: string, dto: UpdateSubscriptionPlanDTO): Promise<SubscriptionPlanDTO>;
}
//# sourceMappingURL=IUpdateSubscriptionPlanUseCase.d.ts.map