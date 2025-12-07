import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { ForbiddenError } from '../../../domain/errors/AppError';
import { UserRole } from '../../../domain/enums/UserRole';
import { ERROR_MESSAGES } from '../../../config/messages';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IListSubscriptionPlansUseCase } from './interfaces/IListSubscriptionPlansUseCase';
import { ListSubscriptionPlansRequestDTO } from '../../dto/subscription/ListSubscriptionPlansRequestDTO';
import { ListSubscriptionPlansResponseDTO } from '../../dto/subscription/ListSubscriptionPlansResponseDTO';
import { ISubscriptionPlanMapper } from '../../mappers/interfaces/ISubscriptionPlanMapper';

@injectable()
export class ListSubscriptionPlansUseCase implements IListSubscriptionPlansUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.ISubscriptionPlanRepository) private subscriptionPlanRepository: ISubscriptionPlanRepository,
    @inject(TYPES.ISubscriptionPlanMapper) private subscriptionPlanMapper: ISubscriptionPlanMapper
  ) {}

  async execute(request: ListSubscriptionPlansRequestDTO): Promise<ListSubscriptionPlansResponseDTO> {
    // Verify admin privileges
    const adminUser = await this.userRepository.findById(request.adminUserId);
    if (!adminUser || adminUser.role !== UserRole.ADMIN) {
      throw new ForbiddenError(ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
    }

    // Fetch all plans
    const plans = await this.subscriptionPlanRepository.findAll();

    return {
      plans: plans.map(plan => this.subscriptionPlanMapper.toDTO(plan)),
      total: plans.length,
    };
  }
}
