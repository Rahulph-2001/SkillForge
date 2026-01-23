import { JoinVideoRoomDTO } from "../../../dto/videoCall/JoinVideoRoomDTO";
import { VideoCallRoomResponseDTO } from "../../../dto/videoCall/VideoCallRoomResponseDTO";

export interface IJoinVideoRoomUseCase {
    execute(userId: string , dto: JoinVideoRoomDTO): Promise<VideoCallRoomResponseDTO>
}