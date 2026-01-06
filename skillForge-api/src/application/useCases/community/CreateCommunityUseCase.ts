import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IStorageService } from '../../../domain/services/IStorageService';
import { ICommunityMapper } from '../../mappers/interfaces/ICommunityMapper';
import { Database } from '../../../infrastructure/database/Database';
import { Community } from '../../../domain/entities/Community';
import { CommunityMember } from '../../../domain/entities/CommunityMember';
import { CreateCommunityDTO } from '../../dto/community/CreateCommunityDTO';
import { CommunityResponseDTO } from '../../dto/community/CommunityResponseDTO';
import { ValidationError } from '../../../domain/errors/AppError';
import { ICreateCommunityUseCase } from './interfaces/ICreateCommunityUseCase';

@injectable()
export class CreateCommunityUseCase implements ICreateCommunityUseCase {
  constructor(
    @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository,
    @inject(TYPES.IStorageService) private readonly storageService: IStorageService,
    @inject(TYPES.ICommunityMapper) private readonly communityMapper: ICommunityMapper,
    @inject(TYPES.Database) private readonly database: Database
  ) { }

  public async execute(
    userId: string,
    dto: CreateCommunityDTO,
    imageFile?: { buffer: Buffer; originalname: string; mimetype: string }
  ): Promise<CommunityResponseDTO> {
    // Validation
    if (!dto.name || dto.name.trim().length === 0) {
      throw new ValidationError('Community name is required');
    }
    if (!dto.description || dto.description.trim().length === 0) {
      throw new ValidationError('Community description is required');
    }
    if (!dto.category || dto.category.trim().length === 0) {
      throw new ValidationError('Community category is required');
    }

    // Handle image upload
    let imageUrl: string | null = null;
    if (imageFile) {
      // Validate file size (max 5MB)
      if (imageFile.buffer.length > 5 * 1024 * 1024) {
        throw new ValidationError('Image size must be less than 5MB');
      }
      // Validate file type
      if (!imageFile.mimetype.startsWith('image/')) {
        throw new ValidationError('Only image files are allowed');
      }

      try {
        const timestamp = Date.now();
        const key = `communities/${userId}/${timestamp}-${imageFile.originalname}`;
        imageUrl = await this.storageService.uploadFile(imageFile.buffer, key, imageFile.mimetype);
      } catch (error) {
        throw new Error('Failed to upload image. Please try again.');
      }
    }

    // Create community entity
    const community = new Community({
      name: dto.name,
      description: dto.description,
      category: dto.category,
      imageUrl,
      adminId: userId,
      creditsCost: dto.creditsCost,
      creditsPeriod: dto.creditsPeriod,
    });

    // Use transaction to ensure community and admin member are created atomically
    const createdCommunity = await this.database.transaction(async (tx) => {
      // Create community using transaction client
      const communityData = community.toJSON();
      const created = await tx.community.create({
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

      // Add creator as admin member using transaction client
      const adminMember = new CommunityMember({
        communityId: community.id,
        userId,
        role: 'admin',
      });

      const memberData = adminMember.toJSON();
      await tx.communityMember.create({
        data: {
          id: memberData.id as string,
          communityId: memberData.communityId as string,
          userId: memberData.userId as string,
          role: memberData.role as string,
          isAutoRenew: memberData.isAutoRenew as boolean,
          subscriptionEndsAt: memberData.subscriptionEndsAt as Date | null,
          joinedAt: memberData.joinedAt as Date,
          isActive: memberData.isActive as boolean,
        },
      });

      // Return domain entity created from database row
      return Community.fromDatabaseRow(created);
    });

    // Return DTO using mapper
    return this.communityMapper.toDTO(community, userId);
  }
}