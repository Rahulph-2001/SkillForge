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

    console.log('🔵 [UpdateUserProfileUseCase] Starting profile update');
    console.log('🔵 [UpdateUserProfileUseCase] User ID:', userId);
    console.log('🔵 [UpdateUserProfileUseCase] Name:', name);
    console.log('🔵 [UpdateUserProfileUseCase] Bio:', bio);
    console.log('🔵 [UpdateUserProfileUseCase] Location:', location);
    console.log('🔵 [UpdateUserProfileUseCase] Avatar file present:', !!avatarFile);
    if (avatarFile) {
      console.log('🔵 [UpdateUserProfileUseCase] Avatar file details:', {
        originalname: avatarFile.originalname,
        mimetype: avatarFile.mimetype,
        size: avatarFile.size,
        bufferLength: avatarFile.buffer?.length
      });
    }

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.error('❌ [UpdateUserProfileUseCase] User not found:', userId);
      throw new AppError('User not found', HttpStatusCode.NOT_FOUND);
    }

    console.log('✅ [UpdateUserProfileUseCase] User found');
    console.log('🔵 [UpdateUserProfileUseCase] Current avatar URL:', user.avatarUrl);

    let avatarUrl = user.avatarUrl;

    // Upload avatar to S3 if provided
    if (avatarFile) {
      console.log('📤 [UpdateUserProfileUseCase] Processing avatar upload...');
      try {
        // Delete old avatar if exists and is from S3 (not Google/external URL)
        if (user.avatarUrl && user.avatarUrl.includes(process.env.AWS_S3_BUCKET_NAME || 'skillforge')) {
          console.log('🗑️ [UpdateUserProfileUseCase] Deleting old S3 avatar:', user.avatarUrl);
          const oldKey = user.avatarUrl.split('.com/')[1];
          if (oldKey) {
            console.log('🗑️ [UpdateUserProfileUseCase] Old avatar key:', oldKey);
            await this.s3Service.deleteFile(oldKey);
            console.log('✅ [UpdateUserProfileUseCase] Old avatar deleted');
          }
        } else if (user.avatarUrl) {
          console.log('ℹ️ [UpdateUserProfileUseCase] Skipping deletion - avatar is external (Google/etc):', user.avatarUrl);
        }

        // Upload new avatar
        const key = `avatars/${userId}/${Date.now()}-${avatarFile.originalname}`;
        console.log('📤 [UpdateUserProfileUseCase] Uploading new avatar with key:', key);
        avatarUrl = await this.s3Service.uploadFile(avatarFile.buffer, key, avatarFile.mimetype);
        console.log('✅ [UpdateUserProfileUseCase] New avatar uploaded successfully');
        console.log('🔵 [UpdateUserProfileUseCase] New avatar URL:', avatarUrl);
      } catch (error) {
        console.error('❌ [UpdateUserProfileUseCase] Failed to upload avatar:', error);
        throw new AppError('Failed to upload avatar image', HttpStatusCode.INTERNAL_SERVER_ERROR);
      }
    } else {
      console.log('ℹ️ [UpdateUserProfileUseCase] No avatar file provided, keeping existing avatar');
    }

    // Update user profile
    console.log('💾 [UpdateUserProfileUseCase] Updating user in database...');
    console.log('💾 [UpdateUserProfileUseCase] Update data:', {
      name: name || 'unchanged',
      bio: bio !== undefined ? bio : 'unchanged',
      location: location !== undefined ? location : 'unchanged',
      avatarUrl: avatarFile ? avatarUrl : 'unchanged'
    });

    // Log the exact data being sent to Prisma
    const updateData = {
      ...(name && { name }),
      ...(bio !== undefined && { bio }),
      ...(location !== undefined && { location }),
      ...(avatarFile && { avatarUrl }), // Only update if new file was uploaded
    };
    
    console.log('💾 [UpdateUserProfileUseCase] Prisma update data:', JSON.stringify(updateData, null, 2));
    console.log('💾 [UpdateUserProfileUseCase] Will update avatarUrl?', !!avatarFile);
    console.log('💾 [UpdateUserProfileUseCase] New avatarUrl value:', avatarUrl);

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

    console.log('✅ [UpdateUserProfileUseCase] User updated in database');
    console.log('🔵 [UpdateUserProfileUseCase] Updated user data:', {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatarUrl: updatedUser.avatarUrl,
      bio: updatedUser.bio,
      location: updatedUser.location
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
