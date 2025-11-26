import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { ForbiddenError } from '../../../domain/errors/AppError';
import { ERROR_MESSAGES } from '../../../config/messages';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';



export interface ListSubscriptionPlansResponse {
  plans: any[];
  total: number;
}

@injectable()
export class ListSubscriptionPlansUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.ISubscriptionPlanRepository) private subscriptionPlanRepository: ISubscriptionPlanRepository
  ) {}

  async execute(adminUserId: string): Promise<ListSubscriptionPlansResponse> {
    // Verify admin privileges
    const adminUser = await this.userRepository.findById(adminUserId);
    if (!adminUser || adminUser.role !== 'admin') {
      throw new ForbiddenError(ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
    }

    // Fetch all plans
    const plans = await this.subscriptionPlanRepository.findAll();

    return {
      plans: plans.map(plan => plan.toJSON()),
      total: plans.length,
    };
  }
}
