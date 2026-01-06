export interface ILeaveCommunityUseCase {
  execute(userId: string, communityId: string): Promise<void>;
}

