import { SubscriptionPlan } from '../../domain/entities/SubscriptionPlan';
import { SubscriptionPlanDTO } from '../dto/subscription/SubscriptionPlanDTO';
import { ISubscriptionPlanMapper } from './interfaces/ISubscriptionPlanMapper';
export declare class SubscriptionPlanMapper implements ISubscriptionPlanMapper {
    toDTO(plan: SubscriptionPlan): SubscriptionPlanDTO;
}
//# sourceMappingURL=SubscriptionPlanMapper.d.ts.map