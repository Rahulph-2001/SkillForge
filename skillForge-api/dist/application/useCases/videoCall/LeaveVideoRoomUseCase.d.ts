import { IVideoCallRoomRepository } from '../../../domain/repositories/IVideoCallRoomRepository';
import { IVideoCallPresenceService } from '../../../domain/services/IVideoCallPresenceService';
import { ILeaveVideoRoomUseCase } from './interfaces/ILeaveVideoRoomUseCase';
export declare class LeaveVideoRoomUseCase implements ILeaveVideoRoomUseCase {
    private roomRepository;
    private presenceService;
    constructor(roomRepository: IVideoCallRoomRepository, presenceService: IVideoCallPresenceService);
    execute(userId: string, roomId: string): Promise<void>;
}
//# sourceMappingURL=LeaveVideoRoomUseCase.d.ts.map