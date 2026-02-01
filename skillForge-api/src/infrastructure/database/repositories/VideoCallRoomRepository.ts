import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { Database } from '../Database';
import { VideoCallRoom, RoomStatus } from '../../../domain/entities/VideoCallRoom';
import { IVideoCallRoomRepository } from '../../../domain/repositories/IVideoCallRoomRepository';

@injectable()
export class VideoCallRoomRepository implements IVideoCallRoomRepository {
  constructor(@inject(TYPES.Database) private db: Database) { }

  private get prisma() { return this.db.getClient(); }

  async create(room: VideoCallRoom): Promise<VideoCallRoom> {
    const data = await this.prisma.videoCallRoom.create({
      data: { id: room.id, roomCode: room.roomCode, bookingId: room.bookingId, interviewId: room.interviewId, hostId: room.hostId, status: room.status }
    });
    return this.toDomain(data);
  }

  async findById(roomId: string): Promise<VideoCallRoom | null> {
    const data = await this.prisma.videoCallRoom.findUnique({ where: { id: roomId } });
    return data ? this.toDomain(data) : null;
  }

  async findByBookingId(bookingId: string): Promise<VideoCallRoom | null> {
    const data = await this.prisma.videoCallRoom.findUnique({ where: { bookingId } });
    return data ? this.toDomain(data) : null;
  }

  async findByInterviewId(interviewId: string): Promise<VideoCallRoom | null> {
    const data = await this.prisma.videoCallRoom.findUnique({ where: { interviewId } });
    return data ? this.toDomain(data) : null;
  }



  async findByRoomCode(roomCode: string): Promise<VideoCallRoom | null> {
    const data = await this.prisma.videoCallRoom.findUnique({ where: { roomCode } });
    return data ? this.toDomain(data) : null;
  }

  async findActiveByHostId(hostId: string): Promise<VideoCallRoom | null> {
    const data = await this.prisma.videoCallRoom.findFirst({
      where: { hostId, status: { in: ['waiting', 'active'] } },
      orderBy: { createdAt: 'desc' }
    });
    return data ? this.toDomain(data) : null;
  }

  async updateStatus(roomId: string, status: RoomStatus, endedAt?: Date): Promise<VideoCallRoom> {
    const data = await this.prisma.videoCallRoom.update({
      where: { id: roomId },
      data: { status, endedAt: endedAt || null }
    });
    return this.toDomain(data);
  }

  private toDomain(data: any): VideoCallRoom {
    return new VideoCallRoom({
      id: data.id, roomCode: data.roomCode, bookingId: data.bookingId, interviewId: data.interviewId,
      hostId: data.hostId, status: data.status, createdAt: data.createdAt, endedAt: data.endedAt
    });
  }
}