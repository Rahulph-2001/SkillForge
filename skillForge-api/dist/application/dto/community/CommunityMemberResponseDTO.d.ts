export interface CommunityMemberResponseDTO {
    id: string;
    userId: string;
    communityId: string;
    role: string;
    isAutoRenew: boolean;
    subscriptionEndsAt: Date | null;
    joinedAt: Date;
    leftAt: Date | null;
    isActive: boolean;
    userName?: string;
    userAvatar?: string;
}
//# sourceMappingURL=CommunityMemberResponseDTO.d.ts.map