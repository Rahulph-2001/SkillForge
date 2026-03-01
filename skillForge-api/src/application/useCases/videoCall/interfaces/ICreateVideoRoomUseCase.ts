import { type CreateVideoRoomDTO } from "../../../dto/videoCall/CreateVideoRoomDTO";
import { type VideoCallRoomResponseDTO } from "../../../dto/videoCall/VideoCallRoomResponseDTO";

export interface ICreateVideoRoomUseCase {
    execute(userId: string , dto: CreateVideoRoomDTO) : Promise<VideoCallRoomResponseDTO>
    
}