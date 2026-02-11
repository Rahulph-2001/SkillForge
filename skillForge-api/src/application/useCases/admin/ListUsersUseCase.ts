import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ForbiddenError } from '../../../domain/errors/AppError';
import { UserRole } from '../../../domain/enums/UserRole';
import { ERROR_MESSAGES } from '../../../config/messages';
import { IListUsersUseCase } from './interfaces/IListUsersUseCase';
import { ListUsersRequestDTO, ListUsersRequestDTOSchema } from '../../dto/admin/ListUsersRequestDTO';
import { ListUsersResponseDTO } from '../../dto/admin/ListUsersResponseDTO';
import { IAdminUserDTOMapper } from '../../mappers/interfaces/IAdminUserDTOMapper';
import { IPaginationService } from '../../../domain/services/IPaginationService';

@injectable()
export class ListUsersUseCase implements IListUsersUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.IAdminUserDTOMapper) private userMapper: IAdminUserDTOMapper,
    @inject(TYPES.IPaginationService) private paginationService: IPaginationService
  ) {}

  async execute(request: ListUsersRequestDTO): Promise<ListUsersResponseDTO> {
    // Validate request
    const validatedRequest = ListUsersRequestDTOSchema.parse(request);

    // Verify admin user
    const adminUser = await this.userRepository.findById(validatedRequest.adminUserId);
    if (!adminUser || adminUser.role !== UserRole.ADMIN) {
      throw new ForbiddenError(ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
    }

    // Create pagination params
    const paginationParams = this.paginationService.createParams(
      validatedRequest.page,
      validatedRequest.limit
    );

    // Get paginated users
    const { users, total } = await this.userRepository.findWithPagination(
      {
        search: validatedRequest.search,
        role: validatedRequest.role,
        isActive: validatedRequest.isActive
      },
      paginationParams
    );

    // Create pagination result
    const paginationResult = this.paginationService.createResult(
      users,
      total,
      validatedRequest.page,
      validatedRequest.limit
    );

    return {
      users: users.map(user => this.userMapper.toDTO(user)),
      pagination: {
        total: paginationResult.total,
        page: paginationResult.page,
        limit: paginationResult.limit,
        totalPages: paginationResult.totalPages,
        hasNextPage: paginationResult.hasNextPage,
        hasPreviousPage: paginationResult.hasPreviousPage,
      }
    };
  }
}