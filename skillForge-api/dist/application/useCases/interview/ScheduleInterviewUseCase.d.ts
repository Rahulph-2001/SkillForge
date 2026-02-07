import { IScheduleInterviewUseCase } from './interfaces/IScheduleInterviewUseCase';
import { ScheduleInterviewDTO, InterviewResponseDTO } from '../../dto/interview/ScheduleInterviewDTO';
import { IInterviewRepository } from '../../../domain/repositories/IInterviewRepository';
import { IProjectApplicationRepository } from '../../../domain/repositories/IProjectApplicationRepository';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IVideoCallRoomRepository } from '../../../domain/repositories/IVideoCallRoomRepository';
import { IInterviewMapper } from '../../mappers/interfaces/IInterviewMapper';
import { INotificationService } from '../../../domain/services/INotificationService';
export declare class ScheduleInterviewUseCase implements IScheduleInterviewUseCase {
    private interviewRepository;
    private applicationRepository;
    private projectRepository;
    private mapper;
    private videoRoomRepository;
    private notificationService;
    constructor(interviewRepository: IInterviewRepository, applicationRepository: IProjectApplicationRepository, projectRepository: IProjectRepository, mapper: IInterviewMapper, videoRoomRepository: IVideoCallRoomRepository, notificationService: INotificationService);
    execute(userId: string, data: ScheduleInterviewDTO): Promise<InterviewResponseDTO>;
}
//# sourceMappingURL=ScheduleInterviewUseCase.d.ts.map