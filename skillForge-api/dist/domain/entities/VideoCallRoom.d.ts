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
export declare class VideoCallRoom {
    private readonly _id;
    private readonly _roomCode;
    private readonly _bookingId;
    private readonly _interviewId;
    private readonly _hostId;
    private _status;
    private readonly _createdAt;
    private _endedAt;
    constructor(props: CreateVideoCallRoomProps);
    private validate;
    private generateRoomCode;
    get id(): string;
    get roomCode(): string;
    get bookingId(): string | null;
    get interviewId(): string | null;
    get hostId(): string;
    get status(): RoomStatus;
    get createdAt(): Date;
    get endedAt(): Date | null;
    canJoin(): boolean;
    isHost(userId: string): boolean;
    activate(): void;
    end(): void;
}
//# sourceMappingURL=VideoCallRoom.d.ts.map