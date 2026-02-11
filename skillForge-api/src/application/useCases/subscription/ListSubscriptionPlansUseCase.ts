import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { ForbiddenError } from '../../../domain/errors/AppError';
import { UserRole } from '../../../domain/enums/UserRole';
import { ERROR_MESSAGES } from '../../../config/messages';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IListSubscriptionPlansUseCase } from './interfaces/IListSubscriptionPlansUseCase';
import { ListSubscriptionPlansRequestDTO, ListSubscriptionPlansRequestSchema } from '../../dto/subscription/ListSubscriptionPlansRequestDTO';
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
    const validatedRequest = ListSubscriptionPlansRequestSchema.parse(request);

    const adminUser = await this.userRepository.findById(validatedRequest.adminUserId);
    if (!adminUser || adminUser.role !== UserRole.ADMIN) {
      throw new ForbiddenError(ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
    }

    const result = await this.subscriptionPlanRepository.findWithPagination({
      page: validatedRequest.page,
      limit: validatedRequest.limit,
      isActive: validatedRequest.isActive,
    });

    return {
      plans: result.plans.map(plan => this.subscriptionPlanMapper.toDTO(plan)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      hasNextPage: result.page < result.totalPages,
      hasPreviousPage: result.page > 1,
    };
  }
}