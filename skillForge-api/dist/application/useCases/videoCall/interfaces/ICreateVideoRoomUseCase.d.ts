import { CreateVideoRoomDTO } from "../../../dto/videoCall/CreateVideoRoomDTO";
import { VideoCallRoomResponseDTO } from "../../../dto/videoCall/VideoCallRoomResponseDTO";
export interface ICreateVideoRoomUseCase {
    execute(userId: string, dto: CreateVideoRoomDTO): Promise<VideoCallRoomResponseDTO>;
}
//# sourceMappingURL=ICreateVideoRoomUseCase.d.ts.map