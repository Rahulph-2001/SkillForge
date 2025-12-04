import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ForbiddenError } from '../../../domain/errors/AppError';
import { ERROR_MESSAGES } from '../../../config/messages';
import { IListUsersUseCase } from './interfaces/IListUsersUseCase';
import { ListUsersRequestDTO } from '../../dto/admin/ListUsersRequestDTO';
import { ListUsersResponseDTO } from '../../dto/admin/ListUsersResponseDTO';
import { IAdminUserDTOMapper } from '../../mappers/interfaces/IAdminUserDTOMapper';

@injectable()
export class ListUsersUseCase implements IListUsersUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.IAdminUserDTOMapper) private userMapper: IAdminUserDTOMapper
  ) {}

  async execute(request: ListUsersRequestDTO): Promise<ListUsersResponseDTO> {
    // Verify admin user
    const adminUser = await this.userRepository.findById(request.adminUserId);
    if (!adminUser || adminUser.role !== 'admin') {
      throw new ForbiddenError(ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
    }

    // Get all users
    const users = await this.userRepository.findAll();
    return {
      users: users.map(user => this.userMapper.toDTO(user)),
      total: users.length
    };
  }
}