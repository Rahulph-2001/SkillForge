import { IVideoCallRoomRepository } from '../../../domain/repositories/IVideoCallRoomRepository';
import { IVideoCallPresenceService } from '../../../domain/services/IVideoCallPresenceService';
import { IEndVideoRoomUseCase } from './interfaces/IEndVideoRoomUseCase';
import { IInterviewRepository } from '../../../domain/repositories/IInterviewRepository';
export declare class EndVideoRoomUseCase implements IEndVideoRoomUseCase {
    private roomRepository;
    private presenceService;
    private interviewRepository;
    constructor(roomRepository: IVideoCallRoomRepository, presenceService: IVideoCallPresenceService, interviewRepository: IInterviewRepository);
    execute(userId: string, roomId: string): Promise<void>;
}
//# sourceMappingURL=EndVideoRoomUseCase.d.ts.map