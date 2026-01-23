import { injectable } from 'inversify';
import { VideoCallRoom } from '../../domain/entities/VideoCallRoom';
import { VideoCallRoomResponseDTO, ParticipantDTO, RTCIceServerDTO } from '../dto/videoCall/VideoCallRoomResponseDTO';
import { IVideoCallRoomMapper } from './interfaces/IVideoCallRoomMapper';

@injectable()
export class VideoCallRoomMapper implements IVideoCallRoomMapper {
  toResponseDTO(room: VideoCallRoom, participants: ParticipantDTO[], iceServers: RTCIceServerDTO[]): VideoCallRoomResponseDTO {
    return {
      id: room.id,
      roomCode: room.roomCode,
      bookingId: room.bookingId,
      hostId: room.hostId,
      status: room.status,
      participants,
      iceServers,
      createdAt: room.createdAt,
      endedAt: room.endedAt,
    };
  }
}