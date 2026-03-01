import { type VideoCallRoom } from '../../../domain/entities/VideoCallRoom';
import { type VideoCallRoomResponseDTO, type ParticipantDTO, type RTCIceServerDTO } from '../../dto/videoCall/VideoCallRoomResponseDTO';

export interface IVideoCallRoomMapper {
  toResponseDTO(room: VideoCallRoom, participants: ParticipantDTO[], iceServers: RTCIceServerDTO[]): VideoCallRoomResponseDTO;
}