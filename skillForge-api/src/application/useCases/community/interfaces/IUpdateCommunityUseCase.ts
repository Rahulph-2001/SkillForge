import { Community } from '../../../../domain/entities/Community';
import { UpdateCommunityDTO } from '../../../dto/community/UpdateCommunityDTO';

export interface IUpdateCommunityUseCase {
  execute(
    communityId: string,
    userId: string,
    dto: UpdateCommunityDTO,
    imageFile?: { buffer: Buffer; originalname: string; mimetype: string }
  ): Promise<Community>;
}

