import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ForbiddenError, NotFoundError } from '../../../domain/errors/AppError';
import { UserRole } from '../../../domain/enums/UserRole';
import { ERROR_MESSAGES } from '../../../config/messages';
import { IDeleteSubscriptionPlanUseCase } from './interfaces/IDeleteSubscriptionPlanUseCase';


@injectable()
export class DeleteSubscriptionPlanUseCase implements IDeleteSubscriptionPlanUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.ISubscriptionPlanRepository) private subscriptionPlanRepository: ISubscriptionPlanRepository
  ) {}

  async execute(adminUserId: string, planId: string): Promise<void> {
    // Verify admin privileges
    const adminUser = await this.userRepository.findById(adminUserId);
    if (!adminUser || adminUser.role !== UserRole.ADMIN) {
      throw new ForbiddenError(ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
    }

    // Verify plan exists
    const plan = await this.subscriptionPlanRepository.findById(planId);
    if (!plan) {
      throw new NotFoundError('Subscription plan not found');
    }

    // Soft delete the plan
    await this.subscriptionPlanRepository.delete(planId);
  }
}
