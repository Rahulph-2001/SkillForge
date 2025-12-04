import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { IListPublicSubscriptionPlansUseCase } from './interfaces/IListPublicSubscriptionPlansUseCase';
import { ListPublicSubscriptionPlansResponseDTO } from '../../dto/subscription/ListPublicSubscriptionPlansResponseDTO';
import { ISubscriptionPlanMapper } from '../../mappers/interfaces/ISubscriptionPlanMapper';

@injectable()
export class ListPublicSubscriptionPlansUseCase implements IListPublicSubscriptionPlansUseCase {
  constructor(
    @inject(TYPES.ISubscriptionPlanRepository) private subscriptionPlanRepository: ISubscriptionPlanRepository,
    @inject(TYPES.ISubscriptionPlanMapper) private subscriptionPlanMapper: ISubscriptionPlanMapper
  ) {}

  async execute(): Promise<ListPublicSubscriptionPlansResponseDTO> {
    
    const plans = await this.subscriptionPlanRepository.findAll();

    
    const activePlans = plans.filter(plan => plan.isActive);

    return {
      plans: activePlans.map(plan => this.subscriptionPlanMapper.toDTO(plan)),
      total: activePlans.length,
    };
  }
}
