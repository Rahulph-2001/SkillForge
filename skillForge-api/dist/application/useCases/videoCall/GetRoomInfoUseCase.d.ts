import { IVideoCallRoomRepository } from '../../../domain/repositories/IVideoCallRoomRepository';
import { IVideoCallPresenceService } from '../../../domain/services/IVideoCallPresenceService';
import { IVideoCallRoomMapper } from '../../mappers/interfaces/IVideoCallRoomMapper';
import { VideoCallRoomResponseDTO } from '../../dto/videoCall/VideoCallRoomResponseDTO';
import { IGetRoomInfoUseCase } from './interfaces/IGetRoomInfoUseCase';
export declare class GetRoomInfoUseCase implements IGetRoomInfoUseCase {
    private roomRepository;
    private presenceService;
    private roomMapper;
    constructor(roomRepository: IVideoCallRoomRepository, presenceService: IVideoCallPresenceService, roomMapper: IVideoCallRoomMapper);
    execute(_userId: string, roomId: string): Promise<VideoCallRoomResponseDTO>;
}
//# sourceMappingURL=GetRoomInfoUseCase.d.ts.map