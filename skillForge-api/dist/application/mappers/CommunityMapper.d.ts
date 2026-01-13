import { ICommunityMapper } from './interfaces/ICommunityMapper';
import { Community } from '../../domain/entities/Community';
import { CommunityResponseDTO } from '../dto/community/CommunityResponseDTO';
import { ICommunityRepository } from '../../domain/repositories/ICommunityRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
export declare class CommunityMapper implements ICommunityMapper {
    private readonly communityRepository;
    private readonly userRepository;
    constructor(communityRepository: ICommunityRepository, userRepository: IUserRepository);
    toDTO(community: Community, userId?: string): Promise<CommunityResponseDTO>;
    toDTOList(communities: Community[], userId?: string): Promise<CommunityResponseDTO[]>;
}
//# sourceMappingURL=CommunityMapper.d.ts.map