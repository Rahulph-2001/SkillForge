import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IGetCommunityMembersUseCase } from './interfaces/IGetCommunityMembersUseCase';
import { CommunityMemberResponseDTO } from '../../dto/community/CommunityMemberResponseDTO';
export declare class GetCommunityMembersUseCase implements IGetCommunityMembersUseCase {
    private readonly communityRepository;
    private readonly userRepository;
    constructor(communityRepository: ICommunityRepository, userRepository: IUserRepository);
    execute(communityId: string, limit: number, offset: number): Promise<{
        members: CommunityMemberResponseDTO[];
        total: number;
        limit: number;
        offset: number;
    }>;
}
//# sourceMappingURL=GetCommunityMembersUseCase.d.ts.map