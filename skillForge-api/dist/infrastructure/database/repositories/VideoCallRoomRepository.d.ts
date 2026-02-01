import { Database } from '../Database';
import { VideoCallRoom, RoomStatus } from '../../../domain/entities/VideoCallRoom';
import { IVideoCallRoomRepository } from '../../../domain/repositories/IVideoCallRoomRepository';
export declare class VideoCallRoomRepository implements IVideoCallRoomRepository {
    private db;
    constructor(db: Database);
    private get prisma();
    create(room: VideoCallRoom): Promise<VideoCallRoom>;
    findById(roomId: string): Promise<VideoCallRoom | null>;
    findByBookingId(bookingId: string): Promise<VideoCallRoom | null>;
    findByInterviewId(interviewId: string): Promise<VideoCallRoom | null>;
    findByRoomCode(roomCode: string): Promise<VideoCallRoom | null>;
    findActiveByHostId(hostId: string): Promise<VideoCallRoom | null>;
    updateStatus(roomId: string, status: RoomStatus, endedAt?: Date): Promise<VideoCallRoom>;
    private toDomain;
}
//# sourceMappingURL=VideoCallRoomRepository.d.ts.map