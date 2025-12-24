import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { PrismaClient } from '@prisma/client';
import { Database } from '../../../infrastructure/database/Database';
import { IStorageService } from '../../../domain/services/IStorageService';
import { NotFoundError, InternalServerError } from '../../../domain/errors/AppError';

export interface UpdateUserProfileDTO {
  userId: string;
  name?: string;
  bio?: string;
  location?: string;
  avatarFile?: Express.Multer.File;
}

export interface UpdatedProfileResponse {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
}

@injectable()
export class UpdateUserProfileUseCase {
  private prisma: PrismaClient;
  private storageService: IStorageService;

  constructor(
    @inject(TYPES.Database) database: Database,
    @inject(TYPES.IStorageService) storageService: IStorageService
  ) {
    this.prisma = database.getClient();
    this.storageService = storageService;
  }

  async execute(dto: UpdateUserProfileDTO): Promise<UpdatedProfileResponse> {
    const { userId, name, bio, location, avatarFile } = dto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    let avatarUrl = user.avatarUrl;

    if (avatarFile) {
      try {
        const key = `avatars/${userId}/${Date.now()}-${avatarFile.originalname}`;
        avatarUrl = await this.storageService.uploadFile(
          (avatarFile as any).buffer,
          key,
          (avatarFile as any).mimetype
        );
      } catch (_error) {
        throw new InternalServerError('Failed to upload avatar image');
      }
    }

    const updateData = {
      ...(name && { name }),
      ...(bio !== undefined && { bio }),
      ...(location !== undefined && { location }),
      ...(avatarFile && { avatarUrl }),
    };

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        bio: true,
        location: true,
      },
    });

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatarUrl: updatedUser.avatarUrl,
      bio: updatedUser.bio,
      location: updatedUser.location,
    };
  }
}