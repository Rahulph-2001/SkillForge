import { v4 as uuidv4 } from 'uuid';
export interface CreateCommunityData {
  id?: string;
  name: string;
  description: string;
  category: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  adminId: string;
  creditsCost?: number;
  creditsPeriod?: string;
}
export class Community {
  private _id: string;
  private _name: string;
  private _description: string;
  private _category: string;
  private _imageUrl: string | null;
  private _videoUrl: string | null;
  private _adminId: string;
  private _creditsCost: number;
  private _creditsPeriod: string;
  private _membersCount: number;
  private _isActive: boolean;
  private _isDeleted: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;
  constructor(data: CreateCommunityData) {
    this._id = data.id || uuidv4();
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
  private validate(): void {
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
  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get description(): string { return this._description; }
  get category(): string { return this._category; }
  get imageUrl(): string | null { return this._imageUrl; }
  get videoUrl(): string | null { return this._videoUrl; }
  get adminId(): string { return this._adminId; }
  get creditsCost(): number { return this._creditsCost; }
  get creditsPeriod(): string { return this._creditsPeriod; }
  get membersCount(): number { return this._membersCount; }
  get isActive(): boolean { return this._isActive; }
  get isDeleted(): boolean { return this._isDeleted; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }
  public updateDetails(data: {
    name?: string;
    description?: string;
    category?: string;
    imageUrl?: string | null;
    videoUrl?: string | null;
    creditsCost?: number;
    creditsPeriod?: string;
  }): void {
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
    if (data.category !== undefined) this._category = data.category;
    if (data.imageUrl !== undefined) this._imageUrl = data.imageUrl;
    if (data.videoUrl !== undefined) this._videoUrl = data.videoUrl;
    if (data.creditsCost !== undefined) this._creditsCost = data.creditsCost;
    if (data.creditsPeriod !== undefined) this._creditsPeriod = data.creditsPeriod;
    this._updatedAt = new Date();
  }
  public incrementMembersCount(): void {
    this._membersCount++;
    this._updatedAt = new Date();
  }
  public decrementMembersCount(): void {
    if (this._membersCount > 0) {
      this._membersCount--;
    }
    this._updatedAt = new Date();
  }
  private _isJoined?: boolean;
  private _isAdmin?: boolean;

  // Getters only - no public setters on entities
  get isJoined(): boolean | undefined { return this._isJoined; }
  get isAdmin(): boolean | undefined { return this._isAdmin; }

  // Domain methods to set view-model properties
  public setIsJoined(value: boolean): void {
    this._isJoined = value;
  }

  public setIsAdmin(value: boolean): void {
    this._isAdmin = value;
  }

  public toJSON(): Record<string, unknown> {
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
      isJoined: this._isJoined,
      isAdmin: this._isAdmin,
    };
  }
  public static fromDatabaseRow(row: Record<string, unknown>): Community {
    const community = new Community({
      id: row.id as string,
      name: row.name as string,
      description: row.description as string,
      category: row.category as string,
      imageUrl: (row.image_url || row.imageUrl) as string | null,
      videoUrl: (row.video_url || row.videoUrl) as string | null,
      adminId: (row.admin_id || row.adminId) as string,
      creditsCost: (row.credits_cost || row.creditsCost) as number,
      creditsPeriod: (row.credits_period || row.creditsPeriod) as string,
    });
    const communityAny = community as unknown as Record<string, unknown>;
    communityAny._membersCount = (row.members_count || row.membersCount) as number || 0;
    communityAny._isActive = (row.is_active !== undefined ? row.is_active : row.isActive) as boolean;
    communityAny._isDeleted = (row.is_deleted || row.isDeleted) as boolean || false;
    communityAny._createdAt = (row.created_at || row.createdAt) as Date || new Date();
    communityAny._updatedAt = (row.updated_at || row.updatedAt) as Date || new Date();
    // Assuming these are not in DB row but might be preserved if re-hydrating
    communityAny._isJoined = row.isJoined as boolean | undefined;
    communityAny._isAdmin = row.isAdmin as boolean | undefined;
    return community;
  }
}