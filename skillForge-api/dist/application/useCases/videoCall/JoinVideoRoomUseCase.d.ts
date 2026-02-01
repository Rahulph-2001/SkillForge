import { IVideoCallRoomRepository } from '../../../domain/repositories/IVideoCallRoomRepository';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IInterviewRepository } from '../../../domain/repositories/IInterviewRepository';
import { IProjectApplicationRepository } from '../../../domain/repositories/IProjectApplicationRepository';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IVideoCallPresenceService } from '../../../domain/services/IVideoCallPresenceService';
import { IVideoCallRoomMapper } from '../../mappers/interfaces/IVideoCallRoomMapper';
import { JoinVideoRoomDTO } from '../../dto/videoCall/JoinVideoRoomDTO';
import { VideoCallRoomResponseDTO } from '../../dto/videoCall/VideoCallRoomResponseDTO';
import { IJoinVideoRoomUseCase } from './interfaces/IJoinVideoRoomUseCase';
export declare class JoinVideoRoomUseCase implements IJoinVideoRoomUseCase {
    private roomRepository;
    private bookingRepository;
    private interviewRepository;
    private applicationRepository;
    private projectRepository;
    private presenceService;
    private roomMapper;
    private static readonly JOIN_WINDOW_MINUTES_BEFORE;
    private static readonly GRACE_PERIOD_MINUTES_AFTER;
    constructor(roomRepository: IVideoCallRoomRepository, bookingRepository: IBookingRepository, interviewRepository: IInterviewRepository, applicationRepository: IProjectApplicationRepository, projectRepository: IProjectRepository, presenceService: IVideoCallPresenceService, roomMapper: IVideoCallRoomMapper);
    execute(userId: string, dto: JoinVideoRoomDTO): Promise<VideoCallRoomResponseDTO>;
    private validateSessionTime;
    private validateInterviewTime;
    private parseDateTime;
    private getIceServers;
}
//# sourceMappingURL=JoinVideoRoomUseCase.d.ts.map