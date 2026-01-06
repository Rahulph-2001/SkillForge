export interface IRemoveCommunityMemberUseCase {
  execute(adminId: string, communityId: string, memberId: string): Promise<void>;
}

