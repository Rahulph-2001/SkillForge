import { VideoCallRoom } from '../../../domain/entities/VideoCallRoom';
import { VideoCallRoomResponseDTO, ParticipantDTO, RTCIceServerDTO } from '../../dto/videoCall/VideoCallRoomResponseDTO';
export interface IVideoCallRoomMapper {
    toResponseDTO(room: VideoCallRoom, participants: ParticipantDTO[], iceServers: RTCIceServerDTO[]): VideoCallRoomResponseDTO;
}
//# sourceMappingURL=IVideoCallRoomMapper.d.ts.map