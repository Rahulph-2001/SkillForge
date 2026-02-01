export type MemberRole = 'admin' | 'member';
export interface CreateCommunityMemberData {
    id?: string;
    communityId: string;
    userId: string;
    role?: MemberRole;
    isAutoRenew?: boolean;
    subscriptionEndsAt?: Date | null;
}
export declare class CommunityMember {
    private _id;
    private _communityId;
    private _userId;
    private _role;
    private _isAutoRenew;
    private _subscriptionEndsAt;
    private _joinedAt;
    private _leftAt;
    private _isActive;
    private _userName?;
    private _userAvatar?;
    constructor(data: CreateCommunityMemberData);
    get id(): string;
    get communityId(): string;
    get userId(): string;
    get role(): MemberRole;
    get isAutoRenew(): boolean;
    get subscriptionEndsAt(): Date | null;
    get joinedAt(): Date;
    get leftAt(): Date | null;
    get isActive(): boolean;
    get userName(): string | undefined;
    get userAvatar(): string | undefined;
    toggleAutoRenew(): void;
    leave(): void;
    expireMembership(): void;
    updateSubscription(endsAt: Date): void;
    toJSON(): Record<string, unknown>;
    renewSubscription(days: number): void;
    hasAutoRenewEnabled(): boolean;
    static fromDatabaseRow(row: Record<string, any>): CommunityMember;
}
//# sourceMappingURL=CommunityMember.d.ts.map