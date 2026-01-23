import { VideoCallRoomResponseDTO } from "../../../dto/videoCall/VideoCallRoomResponseDTO";

export interface IGetRoomInfoUseCase {
    execute(_userId: string, roomId: string): Promise<VideoCallRoomResponseDTO>
}