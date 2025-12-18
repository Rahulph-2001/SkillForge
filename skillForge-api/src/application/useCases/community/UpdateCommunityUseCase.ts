import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IS3Service } from '../../../domain/services/IS3Service';
import { Community } from '../../../domain/entities/Community';
import { UpdateCommunityDTO } from '../../dto/community/UpdateCommunityDTO';
import { NotFoundError, ForbiddenError, ValidationError } from '../../../domain/errors/AppError';
export interface IUpdateCommunityUseCase {
  execute(
    communityId: string,
    userId: string,
    dto: UpdateCommunityDTO,
    imageFile?: { buffer: Buffer; originalname: string; mimetype: string }
  ): Promise<Community>;
}
@injectable()
export class UpdateCommunityUseCase implements IUpdateCommunityUseCase {
  constructor(
    @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository,
    @inject(TYPES.IS3Service) private readonly s3Service: IS3Service
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
        await this.s3Service.deleteFile(community.imageUrl);
      }
      const timestamp = Date.now();
      const key = `communities/${userId}/${timestamp}-${imageFile.originalname}`;
      imageUrl = await this.s3Service.uploadFile(imageFile.buffer, key, imageFile.mimetype);
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