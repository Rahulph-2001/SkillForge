import { VideoCallRoom, RoomStatus } from '../entities/VideoCallRoom';
export interface IVideoCallRoomRepository {
    create(room: VideoCallRoom): Promise<VideoCallRoom>;
    findById(roomId: string): Promise<VideoCallRoom | null>;
    findByBookingId(bookingId: string): Promise<VideoCallRoom | null>;
    findByInterviewId(interviewId: string): Promise<VideoCallRoom | null>;
    findByRoomCode(roomCode: string): Promise<VideoCallRoom | null>;
    findActiveByHostId(hostId: string): Promise<VideoCallRoom | null>;
    updateStatus(roomId: string, status: RoomStatus, endedAt?: Date): Promise<VideoCallRoom>;
}
//# sourceMappingURL=IVideoCallRoomRepository.d.ts.map