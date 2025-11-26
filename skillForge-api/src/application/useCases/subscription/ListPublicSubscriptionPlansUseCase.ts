import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';



export interface ListPublicSubscriptionPlansResponse {
  plans: any[];
  total: number;
}

@injectable()
export class ListPublicSubscriptionPlansUseCase {
  constructor(
    @inject(TYPES.ISubscriptionPlanRepository) private subscriptionPlanRepository: ISubscriptionPlanRepository
  ) {}

  async execute(): Promise<ListPublicSubscriptionPlansResponse> {
    
    const plans = await this.subscriptionPlanRepository.findAll();

    
    const activePlans = plans.filter(plan => plan.isActive);

    return {
      plans: activePlans.map(plan => plan.toJSON()),
      total: activePlans.length,
    };
  }
}
