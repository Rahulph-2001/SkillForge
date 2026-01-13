import { CommunityMemberResponseDTO } from '../../../dto/community/CommunityMemberResponseDTO';
export interface IGetCommunityMembersUseCase {
    execute(communityId: string, limit: number, offset: number): Promise<{
        members: CommunityMemberResponseDTO[];
        total: number;
        limit: number;
        offset: number;
    }>;
}
//# sourceMappingURL=IGetCommunityMembersUseCase.d.ts.map