import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { PrismaClient } from '@prisma/client';
import { Database } from '../../../infrastructure/database/Database';
import { IS3Service } from '../../../domain/services/IS3Service';
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
  private s3Service: IS3Service;

  constructor(
    @inject(TYPES.Database) database: Database,
    @inject(TYPES.IS3Service) s3Service: IS3Service
  ) {
    this.prisma = database.getClient();
    this.s3Service = s3Service;
  }

  async execute(dto: UpdateUserProfileDTO): Promise<UpdatedProfileResponse> {
    const { userId, name, bio, location, avatarFile } = dto;

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    let avatarUrl = user.avatarUrl;

    // Upload avatar to S3 if provided
    if (avatarFile) {
      try {
        // Delete old avatar if exists and is from S3 (not Google/external URL)
        if (user.avatarUrl && user.avatarUrl.includes(process.env.AWS_S3_BUCKET_NAME || 'skillforge')) {
          // Cast to string to satisfy type checker, though check ensures it's not null
          await this.s3Service.deleteFile(user.avatarUrl as string);
        }

        // Upload new avatar
        const key = `avatars/${userId}/${Date.now()}-${avatarFile.originalname}`;
        // Cast avatarFile to any to avoid type mismatch with Buffer
        avatarUrl = await this.s3Service.uploadFile((avatarFile as any).buffer, key, (avatarFile as any).mimetype);
      } catch (_error) {
        throw new InternalServerError('Failed to upload avatar image');
      }
    }

    // Update user profile
    const updateData = {
      ...(name && { name }),
      ...(bio !== undefined && { bio }),
      ...(location !== undefined && { location }),
      ...(avatarFile && { avatarUrl }), // Only update if new file was uploaded
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
