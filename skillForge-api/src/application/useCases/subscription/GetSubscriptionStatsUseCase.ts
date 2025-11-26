import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISubscriptionPlanRepository, SubscriptionStats } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { ForbiddenError } from '../../../domain/errors/AppError';
import { ERROR_MESSAGES } from '../../../config/messages';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';


@injectable()
export class GetSubscriptionStatsUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.ISubscriptionPlanRepository) private subscriptionPlanRepository: ISubscriptionPlanRepository
  ) {}

  async execute(adminUserId: string): Promise<SubscriptionStats> {
    // Verify admin privileges
    const adminUser = await this.userRepository.findById(adminUserId);
    if (!adminUser || adminUser.role !== 'admin') {
      throw new ForbiddenError(ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
    }

    // Fetch statistics
    const stats = await this.subscriptionPlanRepository.getStats();
    return stats;
  }
}
