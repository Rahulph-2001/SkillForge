import { VideoCallRoom } from '../../domain/entities/VideoCallRoom';
import { VideoCallRoomResponseDTO, ParticipantDTO, RTCIceServerDTO } from '../dto/videoCall/VideoCallRoomResponseDTO';
import { IVideoCallRoomMapper } from './interfaces/IVideoCallRoomMapper';
export declare class VideoCallRoomMapper implements IVideoCallRoomMapper {
    toResponseDTO(room: VideoCallRoom, participants: ParticipantDTO[], iceServers: RTCIceServerDTO[]): VideoCallRoomResponseDTO;
}
//# sourceMappingURL=VideoCallRoomMapper.d.ts.map