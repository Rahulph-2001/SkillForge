import { v4 as uuidv4 } from 'uuid';
export type MessageType = 'text' | 'image' | 'video' | 'file';
export interface CreateCommunityMessageData {
  id?: string;
  communityId: string;
  senderId: string;
  content: string;
  type?: MessageType;
  fileUrl?: string | null;
  fileName?: string | null;
  replyToId?: string | null;
  forwardedFromId?: string | null;
}
export class CommunityMessage {
  private _id: string;
  private _communityId: string;
  private _senderId: string;
  private _content: string;
  private _type: MessageType;
  private _fileUrl: string | null;
  private _fileName: string | null;
  private _isPinned: boolean;
  private _pinnedAt: Date | null;
  private _pinnedBy: string | null;
  private _replyToId: string | null;
  private _forwardedFromId: string | null;
  private _isDeleted: boolean;
  private _deletedAt: Date | null;
  private _createdAt: Date;
  private _updatedAt: Date;
  constructor(data: CreateCommunityMessageData) {
    this._id = data.id || uuidv4();
    this._communityId = data.communityId;
    this._senderId = data.senderId;
    this._content = data.content;
    this._type = data.type || 'text';
    this._fileUrl = data.fileUrl || null;
    this._fileName = data.fileName || null;
    this._isPinned = false;
    this._pinnedAt = null;
    this._pinnedBy = null;
    this._replyToId = data.replyToId || null;
    this._forwardedFromId = data.forwardedFromId || null;
    this._isDeleted = false;
    this._deletedAt = null;
    const now = new Date();
    this._createdAt = now;
    this._updatedAt = now;
  }
  // Getters
  get id(): string { return this._id; }
  get communityId(): string { return this._communityId; }
  get senderId(): string { return this._senderId; }
  get content(): string { return this._content; }
  get type(): MessageType { return this._type; }
  get fileUrl(): string | null { return this._fileUrl; }
  get fileName(): string | null { return this._fileName; }
  get isPinned(): boolean { return this._isPinned; }
  get pinnedAt(): Date | null { return this._pinnedAt; }
  get pinnedBy(): string | null { return this._pinnedBy; }
  get replyToId(): string | null { return this._replyToId; }
  get forwardedFromId(): string | null { return this._forwardedFromId; }
  get isDeleted(): boolean { return this._isDeleted; }
  get deletedAt(): Date | null { return this._deletedAt; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }
  public pin(userId: string): void {
    this._isPinned = true;
    this._pinnedAt = new Date();
    this._pinnedBy = userId;
    this._updatedAt = new Date();
  }
  public unpin(): void {
    this._isPinned = false;
    this._pinnedAt = null;
    this._pinnedBy = null;
    this._updatedAt = new Date();
  }
  public delete(): void {
    this._isDeleted = true;
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }
  public toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      community_id: this._communityId,
      sender_id: this._senderId,
      content: this._content,
      type: this._type,
      file_url: this._fileUrl,
      file_name: this._fileName,
      is_pinned: this._isPinned,
      pinned_at: this._pinnedAt,
      pinned_by: this._pinnedBy,
      reply_to_id: this._replyToId,
      forwarded_from_id: this._forwardedFromId,
      is_deleted: this._isDeleted,
      deleted_at: this._deletedAt,
      created_at: this._createdAt,
      updated_at: this._updatedAt,
    };
  }
  public static fromDatabaseRow(row: Record<string, unknown>): CommunityMessage {
    const message = new CommunityMessage({
      id: row.id as string,
      communityId: (row.community_id || row.communityId) as string,
      senderId: (row.sender_id || row.senderId) as string,
      content: row.content as string,
      type: row.type as MessageType,
      fileUrl: (row.file_url || row.fileUrl) as string | null,
      fileName: (row.file_name || row.fileName) as string | null,
      replyToId: (row.reply_to_id || row.replyToId) as string | null,
      forwardedFromId: (row.forwarded_from_id || row.forwardedFromId) as string | null,
    });
    const messageAny = message as unknown as Record<string, unknown>;
    messageAny._isPinned = (row.is_pinned || row.isPinned) as boolean || false;
    messageAny._pinnedAt = (row.pinned_at || row.pinnedAt) as Date | null;
    messageAny._pinnedBy = (row.pinned_by || row.pinnedBy) as string | null;
    messageAny._isDeleted = (row.is_deleted || row.isDeleted) as boolean || false;
    messageAny._deletedAt = (row.deleted_at || row.deletedAt) as Date | null;
    messageAny._createdAt = (row.created_at || row.createdAt) as Date || new Date();
    messageAny._updatedAt = (row.updated_at || row.updatedAt) as Date || new Date();
    return message;
  }
}