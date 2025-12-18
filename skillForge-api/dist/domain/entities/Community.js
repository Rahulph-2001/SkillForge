"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Community = void 0;
const uuid_1 = require("uuid");
class Community {
    constructor(data) {
        this._id = data.id || (0, uuid_1.v4)();
        this._name = data.name;
        this._description = data.description;
        this._category = data.category;
        this._imageUrl = data.imageUrl || null;
        this._videoUrl = data.videoUrl || null;
        this._adminId = data.adminId;
        this._creditsCost = data.creditsCost || 0;
        this._creditsPeriod = data.creditsPeriod || '30 days';
        this._membersCount = 0;
        this._isActive = true;
        this._isDeleted = false;
        const now = new Date();
        this._createdAt = now;
        this._updatedAt = now;
        this.validate();
    }
    validate() {
        if (!this._name || this._name.trim().length === 0) {
            throw new Error('Community name is required');
        }
        if (!this._description || this._description.trim().length === 0) {
            throw new Error('Community description is required');
        }
        if (!this._category || this._category.trim().length === 0) {
            throw new Error('Community category is required');
        }
        if (!this._adminId) {
            throw new Error('Admin ID is required');
        }
    }
    // Getters
    get id() { return this._id; }
    get name() { return this._name; }
    get description() { return this._description; }
    get category() { return this._category; }
    get imageUrl() { return this._imageUrl; }
    get videoUrl() { return this._videoUrl; }
    get adminId() { return this._adminId; }
    get creditsCost() { return this._creditsCost; }
    get creditsPeriod() { return this._creditsPeriod; }
    get membersCount() { return this._membersCount; }
    get isActive() { return this._isActive; }
    get isDeleted() { return this._isDeleted; }
    get createdAt() { return this._createdAt; }
    get updatedAt() { return this._updatedAt; }
    updateDetails(data) {
        if (data.name !== undefined) {
            if (!data.name || data.name.trim().length === 0) {
                throw new Error('Community name cannot be empty');
            }
            this._name = data.name;
        }
        if (data.description !== undefined) {
            if (!data.description || data.description.trim().length === 0) {
                throw new Error('Community description cannot be empty');
            }
            this._description = data.description;
        }
        if (data.category !== undefined)
            this._category = data.category;
        if (data.imageUrl !== undefined)
            this._imageUrl = data.imageUrl;
        if (data.videoUrl !== undefined)
            this._videoUrl = data.videoUrl;
        if (data.creditsCost !== undefined)
            this._creditsCost = data.creditsCost;
        if (data.creditsPeriod !== undefined)
            this._creditsPeriod = data.creditsPeriod;
        this._updatedAt = new Date();
    }
    incrementMembersCount() {
        this._membersCount++;
        this._updatedAt = new Date();
    }
    decrementMembersCount() {
        if (this._membersCount > 0) {
            this._membersCount--;
        }
        this._updatedAt = new Date();
    }
    toJSON() {
        return {
            id: this._id,
            name: this._name,
            description: this._description,
            category: this._category,
            image_url: this._imageUrl,
            video_url: this._videoUrl,
            admin_id: this._adminId,
            credits_cost: this._creditsCost,
            credits_period: this._creditsPeriod,
            members_count: this._membersCount,
            is_active: this._isActive,
            is_deleted: this._isDeleted,
            created_at: this._createdAt,
            updated_at: this._updatedAt,
        };
    }
    static fromDatabaseRow(row) {
        const community = new Community({
            id: row.id,
            name: row.name,
            description: row.description,
            category: row.category,
            imageUrl: (row.image_url || row.imageUrl),
            videoUrl: (row.video_url || row.videoUrl),
            adminId: (row.admin_id || row.adminId),
            creditsCost: (row.credits_cost || row.creditsCost),
            creditsPeriod: (row.credits_period || row.creditsPeriod),
        });
        const communityAny = community;
        communityAny._membersCount = (row.members_count || row.membersCount) || 0;
        communityAny._isActive = (row.is_active !== undefined ? row.is_active : row.isActive);
        communityAny._isDeleted = (row.is_deleted || row.isDeleted) || false;
        communityAny._createdAt = (row.created_at || row.createdAt) || new Date();
        communityAny._updatedAt = (row.updated_at || row.updatedAt) || new Date();
        return community;
    }
}
exports.Community = Community;
//# sourceMappingURL=Community.js.map