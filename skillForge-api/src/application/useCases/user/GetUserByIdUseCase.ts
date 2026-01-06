import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { NotFoundError } from '../../../domain/errors/AppError';
import { IGetUserByIdUseCase } from './interfaces/IGetUserByIdUseCase';
import { User } from '../../../domain/entities/User';

@injectable()
export class GetUserByIdUseCase implements IGetUserByIdUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository
  ) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }
}

