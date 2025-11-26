import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ForbiddenError } from '../../../domain/errors/AppError';
import { ERROR_MESSAGES } from '../../../config/messages'

export interface ListUsersResponse {
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    credits: number;
    isActive: boolean;
    isDeleted: boolean;
    emailVerified: boolean;
  }>;
  total: number;
}

@injectable()
export class ListUsersUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository
  ) {}

  async execute(adminUserId: string): Promise<ListUsersResponse> {
    // Verify admin user
    const adminUser = await this.userRepository.findById(adminUserId);
    if (!adminUser || adminUser.role !== 'admin') {
      throw new ForbiddenError(ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
    }

    // Get all users
    const users = await this.userRepository.findAll();
    return {
      users: users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email.value,
        role: user.role,
        credits: user.credits,
        isActive: user.isActive,
        isDeleted: user.isDeleted,
        emailVerified: user.verification.email_verified
      })),
      total: users.length
    };
  }
}