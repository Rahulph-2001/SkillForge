import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { ForbiddenError } from '../../../domain/errors/AppError';
import { UserRole } from '../../../domain/enums/UserRole';
import { ERROR_MESSAGES } from '../../../config/messages';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IGetSubscriptionStatsUseCase } from './interfaces/IGetSubscriptionStatsUseCase';


@injectable()
export class GetSubscriptionStatsUseCase implements IGetSubscriptionStatsUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.ISubscriptionPlanRepository) private subscriptionPlanRepository: ISubscriptionPlanRepository
  ) {}

  async execute(adminUserId: string): Promise<SubscriptionStats> {
    // Verify admin privileges
    const adminUser = await this.userRepository.findById(adminUserId);
    if (!adminUser || adminUser.role !== UserRole.ADMIN) {
      throw new ForbiddenError(ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
    }

    // Fetch statistics
    const stats = await this.subscriptionPlanRepository.getStats();
    return stats;
  }
}
