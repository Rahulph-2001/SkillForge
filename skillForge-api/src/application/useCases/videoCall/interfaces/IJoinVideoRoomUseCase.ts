import { type JoinVideoRoomDTO } from "../../../dto/videoCall/JoinVideoRoomDTO";
import { type VideoCallRoomResponseDTO } from "../../../dto/videoCall/VideoCallRoomResponseDTO";

export interface IJoinVideoRoomUseCase {
    execute(userId: string , dto: JoinVideoRoomDTO): Promise<VideoCallRoomResponseDTO>
}