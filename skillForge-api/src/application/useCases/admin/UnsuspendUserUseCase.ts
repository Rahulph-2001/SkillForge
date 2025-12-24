import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ForbiddenError, NotFoundError } from '../../../domain/errors/AppError';
import { UserRole } from '../../../domain/enums/UserRole';
import { ERROR_MESSAGES } from '../../../config/messages';
import { IUnsuspendUserUseCase } from './interfaces/IUnsuspendUserUseCase';
import { SuspendUserRequestDTO } from '../../dto/admin/SuspendUserRequestDTO';
import { SuspendUserResponseDTO } from '../../dto/admin/SuspendUserResponseDTO';

@injectable()
export class UnsuspendUserUseCase implements IUnsuspendUserUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository
  ) { }

  async execute(request: SuspendUserRequestDTO): Promise<SuspendUserResponseDTO> {
    // Verify admin privileges
    const adminUser = await this.userRepository.findById(request.adminUserId);
    if (!adminUser || adminUser.role !== UserRole.ADMIN) {
      throw new ForbiddenError(ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
    }

    // Find user to unsuspend
    const user = await this.userRepository.findById(request.targetUserId);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.ADMIN.USER_NOT_FOUND);
    }

    // Unsuspend (reactivate) the user
    user.activate();
    await this.userRepository.update(user);

    return {
      success: true,
      message: `User ${user.name} has been reactivated successfully`
    };
  }
}
