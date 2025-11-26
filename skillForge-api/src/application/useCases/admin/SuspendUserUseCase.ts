import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ForbiddenError, NotFoundError } from '../../../domain/errors/AppError';
import { ERROR_MESSAGES } from '../../../config/messages';
import { SuspendUserDTO } from '../../dto/user/SuspendUserDTO';

export interface SuspendUserResponse {
  success: boolean;
  message: string;
}

@injectable()
export class SuspendUserUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository
  ) {}

  async execute(adminUserId: string, request: SuspendUserDTO): Promise<SuspendUserResponse> {
    const adminUser = await this.userRepository.findById(adminUserId);
    if (!adminUser || adminUser.role !== 'admin') {
      throw new ForbiddenError(ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
    }

    const user = await this.userRepository.findById(request.userId);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.ADMIN.USER_NOT_FOUND);
    }

    if (user.role === 'admin') {
      throw new ForbiddenError(ERROR_MESSAGES.ADMIN.CANNOT_SUSPEND_ADMIN);
    }

    user.suspend();
    await this.userRepository.update(user);
    return {
      success: true,
      message: `User ${user.name} has been suspended successfully`
    };
  }
}