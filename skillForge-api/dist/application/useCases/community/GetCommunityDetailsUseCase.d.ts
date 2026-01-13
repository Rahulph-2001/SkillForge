import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { ICommunityMapper } from '../../mappers/interfaces/ICommunityMapper';
import { CommunityResponseDTO } from '../../dto/community/CommunityResponseDTO';
import { IGetCommunityDetailsUseCase } from './interfaces/IGetCommunityDetailsUseCase';
export declare class GetCommunityDetailsUseCase implements IGetCommunityDetailsUseCase {
    private readonly communityRepository;
    private readonly communityMapper;
    constructor(communityRepository: ICommunityRepository, communityMapper: ICommunityMapper);
    execute(communityId: string, userId?: string): Promise<CommunityResponseDTO>;
}
//# sourceMappingURL=GetCommunityDetailsUseCase.d.ts.map