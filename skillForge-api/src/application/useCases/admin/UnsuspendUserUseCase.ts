import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ForbiddenError, NotFoundError } from '../../../domain/errors/AppError';
import { ERROR_MESSAGES } from '../../../config/messages';
import { SuspendUserDTO } from '../../dto/user/SuspendUserDTO';

export interface UnsuspendUserResponse {
  success: boolean;
  message: string;
}


@injectable()
export class UnsuspendUserUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository
  ) {}

  async execute(adminUserId: string, request: SuspendUserDTO): Promise<UnsuspendUserResponse> {
    // Verify admin privileges
    const adminUser = await this.userRepository.findById(adminUserId);
    if (!adminUser || adminUser.role !== 'admin') {
      throw new ForbiddenError(ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
    }

    // Find user to unsuspend
    const user = await this.userRepository.findById(request.userId);
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
