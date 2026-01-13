import { CommunityMemberResponseDTO } from '../../../dto/community/CommunityMemberResponseDTO';
export interface IJoinCommunityUseCase {
    execute(userId: string, communityId: string): Promise<CommunityMemberResponseDTO>;
}
//# sourceMappingURL=IJoinCommunityUseCase.d.ts.map