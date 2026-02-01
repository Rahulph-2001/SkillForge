import { v4 as uuidv4 } from 'uuid';

export type RoomStatus = 'waiting' | 'active' | 'ended';

export interface CreateVideoCallRoomProps {
  id?: string;
  roomCode?: string;
  bookingId?: string | null;
  interviewId?: string | null;
  hostId: string;
  status?: RoomStatus;
  createdAt?: Date;
  endedAt?: Date | null;
}

export class VideoCallRoom {
  private readonly _id: string;
  private readonly _roomCode: string;
  private readonly _bookingId: string | null;
  private readonly _interviewId: string | null;
  private readonly _hostId: string;
  private _status: RoomStatus;
  private readonly _createdAt: Date;
  private _endedAt: Date | null;

  constructor(props: CreateVideoCallRoomProps) {
    this._id = props.id || uuidv4();
    this._roomCode = props.roomCode || this.generateRoomCode();
    this._bookingId = props.bookingId || null;
    this._interviewId = props.interviewId || null;
    this._hostId = props.hostId;
    this._status = props.status || 'waiting';
    this._createdAt = props.createdAt || new Date();
    this._endedAt = props.endedAt || null;
    this.validate();
  }

  private validate(): void {
    if (!this._hostId) throw new Error('Host ID is required');
  }

  private generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 3; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    code += '-';
    for (let i = 0; i < 3; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return code;
  }

  get id(): string { return this._id; }
  get roomCode(): string { return this._roomCode; }
  get bookingId(): string | null { return this._bookingId; }
  get interviewId(): string | null { return this._interviewId; }
  get hostId(): string { return this._hostId; }
  get status(): RoomStatus { return this._status; }
  get createdAt(): Date { return this._createdAt; }
  get endedAt(): Date | null { return this._endedAt; }

  canJoin(): boolean { return this._status !== 'ended'; }
  isHost(userId: string): boolean { return this._hostId === userId; }
  activate(): void { if (this._status === 'waiting') this._status = 'active'; }
  end(): void { this._status = 'ended'; this._endedAt = new Date(); }
}