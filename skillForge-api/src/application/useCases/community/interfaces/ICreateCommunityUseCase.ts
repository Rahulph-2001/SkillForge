import { CreateCommunityDTO } from '../../../dto/community/CreateCommunityDTO';
import { CommunityResponseDTO } from '../../../dto/community/CommunityResponseDTO';

export interface ICreateCommunityUseCase {
  execute(
    userId: string,
    dto: CreateCommunityDTO,
    imageFile?: { buffer: Buffer; originalname: string; mimetype: string }
  ): Promise<CommunityResponseDTO>;
}

