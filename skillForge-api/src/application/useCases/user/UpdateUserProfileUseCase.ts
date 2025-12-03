import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { PrismaClient } from '@prisma/client';
import { IS3Service } from '../../../domain/services/IS3Service';
import { AppError } from '../../../domain/errors/AppError';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';

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
  constructor(
    @inject(TYPES.PrismaClient) private prisma: PrismaClient,
    @inject(TYPES.IS3Service) private s3Service: IS3Service
  ) {}

  async execute(dto: UpdateUserProfileDTO): Promise<UpdatedProfileResponse> {
    const { userId, name, bio, location, avatarFile } = dto;

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.error('❌ [UpdateUserProfileUseCase] User not found:', userId);
      throw new AppError('User not found', HttpStatusCode.NOT_FOUND);
    }

    let avatarUrl = user.avatarUrl;

    // Upload avatar to S3 if provided
    if (avatarFile) {
      try {
        // Delete old avatar if exists and is from S3 (not Google/external URL)
        if (user.avatarUrl && user.avatarUrl.includes(process.env.AWS_S3_BUCKET_NAME || 'skillforge')) {
          const oldKey = user.avatarUrl.split('.com/')[1];
          if (oldKey) {
            await this.s3Service.deleteFile(oldKey);
          }
        }

        // Upload new avatar
        const key = `avatars/${userId}/${Date.now()}-${avatarFile.originalname}`;
        avatarUrl = await this.s3Service.uploadFile(avatarFile.buffer, key, avatarFile.mimetype);
      } catch (error) {
        console.error('❌ [UpdateUserProfileUseCase] Failed to upload avatar:', error);
        throw new AppError('Failed to upload avatar image', HttpStatusCode.INTERNAL_SERVER_ERROR);
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
