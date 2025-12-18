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
export declare class Community {
    private _id;
    private _name;
    private _description;
    private _category;
    private _imageUrl;
    private _videoUrl;
    private _adminId;
    private _creditsCost;
    private _creditsPeriod;
    private _membersCount;
    private _isActive;
    private _isDeleted;
    private _createdAt;
    private _updatedAt;
    constructor(data: CreateCommunityData);
    private validate;
    get id(): string;
    get name(): string;
    get description(): string;
    get category(): string;
    get imageUrl(): string | null;
    get videoUrl(): string | null;
    get adminId(): string;
    get creditsCost(): number;
    get creditsPeriod(): string;
    get membersCount(): number;
    get isActive(): boolean;
    get isDeleted(): boolean;
    get createdAt(): Date;
    get updatedAt(): Date;
    updateDetails(data: {
        name?: string;
        description?: string;
        category?: string;
        imageUrl?: string | null;
        videoUrl?: string | null;
        creditsCost?: number;
        creditsPeriod?: string;
    }): void;
    incrementMembersCount(): void;
    decrementMembersCount(): void;
    toJSON(): Record<string, unknown>;
    static fromDatabaseRow(row: Record<string, unknown>): Community;
}
//# sourceMappingURL=Community.d.ts.map