import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IStorageService } from '../../../domain/services/IStorageService';
import { Community } from '../../../domain/entities/Community';
import { UpdateCommunityDTO } from '../../dto/community/UpdateCommunityDTO';
import { NotFoundError, ForbiddenError, ValidationError } from '../../../domain/errors/AppError';
import { IUpdateCommunityUseCase } from './interfaces/IUpdateCommunityUseCase';
@injectable()
export class UpdateCommunityUseCase implements IUpdateCommunityUseCase {
  constructor(
    @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository,
    @inject(TYPES.IStorageService) private readonly storageService: IStorageService
  ) {}
  public async execute(
    communityId: string,
    userId: string,
    dto: UpdateCommunityDTO,
    imageFile?: { buffer: Buffer; originalname: string; mimetype: string }
  ): Promise<Community> {
    const community = await this.communityRepository.findById(communityId);
    if (!community) {
      throw new NotFoundError('Community not found');
    }
    if (community.adminId !== userId) {
      throw new ForbiddenError('Only community admin can update community details');
    }
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