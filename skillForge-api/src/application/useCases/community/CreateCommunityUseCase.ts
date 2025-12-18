import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IS3Service } from '../../../domain/services/IS3Service';
import { Community } from '../../../domain/entities/Community';
import { CommunityMember } from '../../../domain/entities/CommunityMember';
import { CreateCommunityDTO } from '../../dto/community/CreateCommunityDTO';
import { ValidationError } from '../../../domain/errors/AppError';
import { PrismaClient } from '@prisma/client';

export interface ICreateCommunityUseCase {
  execute(
    userId: string,
    dto: CreateCommunityDTO,
    imageFile?: { buffer: Buffer; originalname: string; mimetype: string }
  ): Promise<Community>;
}

@injectable()
export class CreateCommunityUseCase implements ICreateCommunityUseCase {
  constructor(
    @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository,
    @inject(TYPES.IS3Service) private readonly s3Service: IS3Service,
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) { }

  public async execute(
    userId: string,
    dto: CreateCommunityDTO,
    imageFile?: { buffer: Buffer; originalname: string; mimetype: string }
  ): Promise<Community> {
    console.log('🏗️  CreateCommunityUseCase - START');
    console.log('📝 Received DTO:', { name: dto.name, category: dto.category, creditsCost: dto.creditsCost });
    console.log('👤 User ID:', userId);
    console.log('🖼️  Has image file:', !!imageFile);

    if (!dto.name || dto.name.trim().length === 0) {
      console.error('❌ Validation failed: name is required');
      throw new ValidationError('Community name is required');
    }
    if (!dto.description || dto.description.trim().length === 0) {
      console.error('❌ Validation failed: description is required');
      throw new ValidationError('Community description is required');
    }
    if (!dto.category || dto.category.trim().length === 0) {
      console.error('❌ Validation failed: category is required');
      throw new ValidationError('Community category is required');
    }

    console.log('✅ Basic validation passed');

    let imageUrl: string | null = null;
    if (imageFile) {
      console.log('📸 Processing image upload...');
      // Validate file size (max 5MB)
      if (imageFile.buffer.length > 5 * 1024 * 1024) {
        console.error('❌ Image too large:', imageFile.buffer.length);
        throw new ValidationError('Image size must be less than 5MB');
      }
      // Validate file type
      if (!imageFile.mimetype.startsWith('image/')) {
        console.error('❌ Invalid file type:', imageFile.mimetype);
        throw new ValidationError('Only image files are allowed');
      }

      try {
        const timestamp = Date.now();
        const key = `communities/${userId}/${timestamp}-${imageFile.originalname}`;
        console.log('☁️  Uploading to S3 with key:', key);
        imageUrl = await this.s3Service.uploadFile(imageFile.buffer, key, imageFile.mimetype);
        console.log('✅ Image uploaded successfully:', imageUrl);
      } catch (error) {
        console.error('❌ S3 upload failed:', error);
        throw new Error('Failed to upload image. Please try again.');
      }
    }

    console.log('🔄 Starting database transaction...');
    // Use transaction to ensure community and admin member are created atomically
    return await this.prisma.$transaction(async (tx) => {
      console.log('🏛️  Creating Community entity...');
      const community = new Community({
        name: dto.name,
        description: dto.description,
        category: dto.category,
        imageUrl,
        adminId: userId,
        creditsCost: dto.creditsCost,
        creditsPeriod: dto.creditsPeriod,
      });

      console.log('📦 Community entity created:', community.id);

      const communityData = community.toJSON();
      console.log('💾 Inserting community to database...');
      await tx.community.create({
        data: {
          id: communityData.id as string,
          name: communityData.name as string,
          description: communityData.description as string,
          category: communityData.category as string,
          imageUrl: communityData.image_url as string | null,
          videoUrl: communityData.video_url as string | null,
          adminId: communityData.admin_id as string,
          creditsCost: communityData.credits_cost as number,
          creditsPeriod: communityData.credits_period as string,
          membersCount: 1, // Admin is first member
          isActive: communityData.is_active as boolean,
          isDeleted: communityData.is_deleted as boolean,
          createdAt: communityData.created_at as Date,
          updatedAt: communityData.updated_at as Date,
        },
      });

      console.log('✅ Community inserted to database');

      // Add creator as admin member
      console.log('👑 Creating admin member record...');
      const adminMember = new CommunityMember({
        communityId: community.id,
        userId,
        role: 'admin',
      });

      const memberData = adminMember.toJSON();
      await tx.communityMember.create({
        data: {
          id: memberData.id as string,
          communityId: memberData.community_id as string,
          userId: memberData.user_id as string,
          role: memberData.role as string,
          isAutoRenew: memberData.is_auto_renew as boolean,
          subscriptionEndsAt: memberData.subscription_ends_at as Date | null,
          joinedAt: memberData.joined_at as Date,
          isActive: memberData.is_active as boolean,
        },
      });

      console.log('✅ Admin member created');
      console.log('🎉 Transaction completed successfully!');

      return community;
    });
  }
}