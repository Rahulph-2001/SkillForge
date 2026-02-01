"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityMember = void 0;
const uuid_1 = require("uuid");
class CommunityMember {
    constructor(data) {
        this._id = data.id || (0, uuid_1.v4)();
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
    get id() { return this._id; }
    get communityId() { return this._communityId; }
    get userId() { return this._userId; }
    get role() { return this._role; }
    get isAutoRenew() { return this._isAutoRenew; }
    get subscriptionEndsAt() { return this._subscriptionEndsAt; }
    get joinedAt() { return this._joinedAt; }
    get leftAt() { return this._leftAt; }
    get isActive() { return this._isActive; }
    get userName() { return this._userName; }
    get userAvatar() { return this._userAvatar; }
    toggleAutoRenew() {
        this._isAutoRenew = !this._isAutoRenew;
    }
    leave() {
        this._isActive = false;
        this._leftAt = new Date();
    }
    expireMembership() {
        this._isActive = false;
        this._leftAt = new Date();
    }
    updateSubscription(endsAt) {
        this._subscriptionEndsAt = endsAt;
    }
    toJSON() {
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
    renewSubscription(days) {
        const newEndsAt = new Date();
        newEndsAt.setDate(newEndsAt.getDate() + days);
        this._subscriptionEndsAt = newEndsAt;
    }
    hasAutoRenewEnabled() {
        return this._isAutoRenew;
    }
    static fromDatabaseRow(row) {
        const member = new CommunityMember({
            id: row.id,
            communityId: (row.community_id || row.communityId),
            userId: (row.user_id || row.userId),
            role: row.role,
            isAutoRenew: (row.is_auto_renew || row.isAutoRenew),
            subscriptionEndsAt: (row.subscription_ends_at || row.subscriptionEndsAt),
        });
        const memberAny = member;
        memberAny._joinedAt = (row.joined_at || row.joinedAt) || new Date();
        memberAny._leftAt = (row.left_at || row.leftAt);
        memberAny._isActive = (row.is_active !== undefined ? row.is_active : row.isActive);
        // Map user details if available
        if (row.user) {
            memberAny._userName = row.user.name || null;
            memberAny._userAvatar = row.user.avatarUrl || null;
        }
        return member;
    }
}
exports.CommunityMember = CommunityMember;
//# sourceMappingURL=CommunityMember.js.map