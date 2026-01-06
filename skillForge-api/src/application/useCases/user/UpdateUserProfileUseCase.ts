import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IStorageService } from '../../../domain/services/IStorageService';
import { NotFoundError, InternalServerError } from '../../../domain/errors/AppError';
import { IUpdateUserProfileUseCase, UpdateUserProfileDTO, UpdatedProfileResponse } from './interfaces/IUpdateUserProfileUseCase';

@injectable()
export class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
    @inject(TYPES.IStorageService) private readonly storageService: IStorageService
  ) {}

  async execute(dto: UpdateUserProfileDTO): Promise<UpdatedProfileResponse> {
    const { userId, name, bio, location, avatarFile } = dto;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    let avatarUrl = user.avatarUrl;

    if (avatarFile) {
      try {
        const key = `avatars/${userId}/${Date.now()}-${avatarFile.originalname}`;
        avatarUrl = await this.storageService.uploadFile(
          avatarFile.buffer,
          key,
          avatarFile.mimetype
        );
      } catch (_error) {
        throw new InternalServerError('Failed to upload avatar image');
      }
    }

    // Update user entity
    user.updateProfile({
      name,
      bio,
      location,
      avatarUrl,
    });

    const updatedUser = await this.userRepository.update(user);

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email.value,
      avatarUrl: updatedUser.avatarUrl,
      bio: updatedUser.bio,
      location: updatedUser.location,
    };
  }
}