import { SessionInfoDTO } from "../../../dto/videoCall/VideoCallRoomResponseDTO";

export interface IGetSessionInfoUseCase {
    execute(bookingId: string): Promise<SessionInfoDTO>
}