import { CommunityResponseDTO } from '../../../dto/community/CommunityResponseDTO';

export interface IGetCommunityDetailsUseCase {
  execute(communityId: string, userId?: string): Promise<CommunityResponseDTO>;
}

