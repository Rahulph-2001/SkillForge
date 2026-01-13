import { Community } from '../../../domain/entities/Community';
import { CommunityResponseDTO } from '../../dto/community/CommunityResponseDTO';
export interface ICommunityMapper {
    toDTO(community: Community, userId?: string): Promise<CommunityResponseDTO>;
    toDTOList(communities: Community[], userId?: string): Promise<CommunityResponseDTO[]>;
}
//# sourceMappingURL=ICommunityMapper.d.ts.map