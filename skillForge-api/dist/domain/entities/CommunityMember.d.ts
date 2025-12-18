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
    toggleAutoRenew(): void;
    leave(): void;
    updateSubscription(endsAt: Date): void;
    toJSON(): Record<string, unknown>;
    static fromDatabaseRow(row: Record<string, unknown>): CommunityMember;
}
//# sourceMappingURL=CommunityMember.d.ts.map