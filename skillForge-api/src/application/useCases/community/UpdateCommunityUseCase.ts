import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IStorageService } from '../../../domain/services/IStorageService';
import { Community } from '../../../domain/entities/Community';
import { UpdateCommunityDTO } from '../../dto/community/UpdateCommunityDTO';
import { NotFoundError, ForbiddenError } from '../../../domain/errors/AppError';
import { UserRole } from '../../../domain/enums/UserRole';
import { IUpdateCommunityUseCase } from './interfaces/IUpdateCommunityUseCase';

@injectable()
export class UpdateCommunityUseCase implements IUpdateCommunityUseCase {
  constructor(
    @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository,
    @inject(TYPES.IStorageService) private readonly storageService: IStorageService,
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository
  ) { }

  public async execute(
    communityId: string,
    userId: string,
    dto: UpdateCommunityDTO,
    imageFile?: { buffer: Buffer; originalname: string; mimetype: string }
  ): Promise<Community> {
    // 1. Verify community exists
    const community = await this.communityRepository.findById(communityId);
    if (!community) {
      throw new NotFoundError('Community not found');
    }

    // 2. Verify user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ForbiddenError('User not found');
    }

    // 3. Authorization: Allow both community creator AND platform admin
    const isCommunityCreator = community.adminId === userId;
    const isPlatformAdmin = user.role === UserRole.ADMIN;

    if (!isCommunityCreator && !isPlatformAdmin) {
      throw new ForbiddenError('Only community admin or platform admin can update community details');
    }

    // 4. Handle image upload
    let imageUrl = dto.imageUrl;
    if (imageFile) {
      // Delete old image if exists
      if (community.imageUrl) {
        await this.storageService.deleteFile(community.imageUrl);
      }
      const timestamp = Date.now();
      // Sanitize filename: replace spaces with hyphens and remove special characters
      const sanitizedFilename = imageFile.originalname
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^a-zA-Z0-9.-]/g, '') // Remove special characters except dots and hyphens
        .toLowerCase(); // Convert to lowercase for consistency
      const key = `communities/${userId}/${timestamp}-${sanitizedFilename}`;
      imageUrl = await this.storageService.uploadFile(imageFile.buffer, key, imageFile.mimetype);
    }

    // 5. Update community
    community.updateDetails({
      name: dto.name,
      description: dto.description,
      category: dto.category,
      imageUrl,
      videoUrl: dto.videoUrl,
      creditsCost: dto.creditsCost,
      creditsPeriod: dto.creditsPeriod,
    });

    return await this.communityRepository.update(communityId, community);
  }
}