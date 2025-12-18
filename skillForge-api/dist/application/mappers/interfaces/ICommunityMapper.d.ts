import { Community } from '../../../domain/entities/Community';
import { CommunityResponseDTO } from '../../dto/community/CommunityResponseDTO';
export interface ICommunityMapper {
    toDTO(community: Community, userId?: string): CommunityResponseDTO;
    toDTOList(communities: Community[], userId?: string): CommunityResponseDTO[];
}
//# sourceMappingURL=ICommunityMapper.d.ts.map