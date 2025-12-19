import { v4 as uuidv4 } from 'uuid';
export type MemberRole = 'admin' | 'member';
export interface CreateCommunityMemberData {
  id?: string;
  communityId: string;
  userId: string;
  role?: MemberRole;
  isAutoRenew?: boolean;
  subscriptionEndsAt?: Date | null;
}
export class CommunityMember {
  private _id: string;
  private _communityId: string;
  private _userId: string;
  private _role: MemberRole;
  private _isAutoRenew: boolean;
  private _subscriptionEndsAt: Date | null;
  private _joinedAt: Date;
  private _leftAt: Date | null;
  private _isActive: boolean;
  private _userName?: string;
  private _userAvatar?: string;

  constructor(data: CreateCommunityMemberData) {
    this._id = data.id || uuidv4();
    this._communityId = data.communityId;
    this._userId = data.userId;
    this._role = data.role || 'member';
    this._isAutoRenew = data.isAutoRenew || false;
    this._subscriptionEndsAt = data.subscriptionEndsAt || null;
    this._joinedAt = new Date();
    this._leftAt = null;
    this._isActive = true;
  }
  // Getters
  get id(): string { return this._id; }
  get communityId(): string { return this._communityId; }
  get userId(): string { return this._userId; }
  get role(): MemberRole { return this._role; }
  get isAutoRenew(): boolean { return this._isAutoRenew; }
  get subscriptionEndsAt(): Date | null { return this._subscriptionEndsAt; }
  get joinedAt(): Date { return this._joinedAt; }
  get leftAt(): Date | null { return this._leftAt; }
  get isActive(): boolean { return this._isActive; }
  get userName(): string | undefined { return this._userName; }
  get userAvatar(): string | undefined { return this._userAvatar; }

  public toggleAutoRenew(): void {
    this._isAutoRenew = !this._isAutoRenew;
  }
  public leave(): void {
    this._isActive = false;
    this._leftAt = new Date();
  }
  public updateSubscription(endsAt: Date): void {
    this._subscriptionEndsAt = endsAt;
  }
  public toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      communityId: this._communityId,
      userId: this._userId,
      role: this._role,
      isAutoRenew: this._isAutoRenew,
      subscriptionEndsAt: this._subscriptionEndsAt,
      joinedAt: this._joinedAt,
      leftAt: this._leftAt,
      isActive: this._isActive,
      userName: this._userName,
      userAvatar: this._userAvatar,
    };
  }
  public static fromDatabaseRow(row: Record<string, any>): CommunityMember {
    const member = new CommunityMember({
      id: row.id as string,
      communityId: (row.community_id || row.communityId) as string,
      userId: (row.user_id || row.userId) as string,
      role: row.role as MemberRole,
      isAutoRenew: (row.is_auto_renew || row.isAutoRenew) as boolean,
      subscriptionEndsAt: (row.subscription_ends_at || row.subscriptionEndsAt) as Date | null,
    });
    const memberAny = member as unknown as Record<string, unknown>;
    memberAny._joinedAt = (row.joined_at || row.joinedAt) as Date || new Date();
    memberAny._leftAt = (row.left_at || row.leftAt) as Date | null;
    memberAny._isActive = (row.is_active !== undefined ? row.is_active : row.isActive) as boolean;

    // Map user details if available
    if (row.user) {
      memberAny._userName = row.user.name || null;
      memberAny._userAvatar = row.user.avatarUrl || null;
    }

    return member;
  }
}
