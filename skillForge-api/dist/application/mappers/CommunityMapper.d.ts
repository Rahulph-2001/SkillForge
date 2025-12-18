import { ICommunityMapper } from './interfaces/ICommunityMapper';
import { Community } from '../../domain/entities/Community';
import { CommunityResponseDTO } from '../dto/community/CommunityResponseDTO';
import { ICommunityRepository } from '../../domain/repositories/ICommunityRepository';
export declare class CommunityMapper implements ICommunityMapper {
    private readonly communityRepository;
    constructor(communityRepository: ICommunityRepository);
    toDTO(community: Community, userId?: string): CommunityResponseDTO;
    toDTOList(communities: Community[], userId?: string): CommunityResponseDTO[];
}
//# sourceMappingURL=CommunityMapper.d.ts.map