import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IScheduleInterviewUseCase } from './interfaces/IScheduleInterviewUseCase';
import { ScheduleInterviewDTO, InterviewResponseDTO } from '../../dto/interview/ScheduleInterviewDTO';
import { IInterviewRepository } from '../../../domain/repositories/IInterviewRepository';
import { IProjectApplicationRepository } from '../../../domain/repositories/IProjectApplicationRepository';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IVideoCallRoomRepository } from '../../../domain/repositories/IVideoCallRoomRepository';
import { IInterviewMapper } from '../../mappers/interfaces/IInterviewMapper';
import { Interview } from '../../../domain/entities/Interview';
import { VideoCallRoom } from '../../../domain/entities/VideoCallRoom';
import { ProjectApplicationStatus } from '../../../domain/entities/ProjectApplication';
import { NotFoundError, ForbiddenError } from '../../../domain/errors/AppError';
import { ERROR_MESSAGES } from '../../../config/messages';
import { INotificationService } from '../../../domain/services/INotificationService';
import { NotificationType } from '../../../domain/entities/Notification';

@injectable()
export class ScheduleInterviewUseCase implements IScheduleInterviewUseCase {
    constructor(
        @inject(TYPES.IInterviewRepository) private interviewRepository: IInterviewRepository,
        @inject(TYPES.IProjectApplicationRepository) private applicationRepository: IProjectApplicationRepository,
        @inject(TYPES.IProjectRepository) private projectRepository: IProjectRepository,
        @inject(TYPES.IInterviewMapper) private mapper: IInterviewMapper,
        @inject(TYPES.IVideoCallRoomRepository) private videoRoomRepository: IVideoCallRoomRepository,
        @inject(TYPES.INotificationService) private notificationService: INotificationService
    ) { }

    async execute(userId: string, data: ScheduleInterviewDTO): Promise<InterviewResponseDTO> {
        // 1. Get Application
        const application = await this.applicationRepository.findById(data.applicationId);
        if (!application) {
            throw new NotFoundError('Application not found');
        }

        // 2. Validate Project Ownership
        const project = await this.projectRepository.findById(application.projectId);
        if (!project) {
            throw new NotFoundError(ERROR_MESSAGES.PROJECT.NOT_FOUND);
        }
        if (project.clientId !== userId) {
            throw new ForbiddenError('Only project owner can schedule interviews');
        }

        // 3. Create Interview
        const interview = new Interview({
            applicationId: data.applicationId,
            scheduledAt: data.scheduledAt,
            durationMinutes: data.durationMinutes,
            meetingLink: null,
        });

        const savedInterview = await this.interviewRepository.create(interview);

        // 4. Create Video Call Room
        const videoRoom = new VideoCallRoom({
            hostId: userId,
            status: 'waiting',
            interviewId: savedInterview.id
        });
        const savedRoom = await this.videoRoomRepository.create(videoRoom);

        // 5. Update Interview with meeting link (room code)
        savedInterview.setMeetingLink(savedRoom.roomCode);
        const updatedInterview = await this.interviewRepository.update(savedInterview);

        // 6. Update Application Status to SHORTLISTED if PENDING/REVIEWED
        if (application.status === ProjectApplicationStatus.PENDING || application.status === ProjectApplicationStatus.REVIEWED) {
            application.shortlist();
            await this.applicationRepository.update(application);
        }

        // 7. Notify applicant about interview
        const scheduledDate = new Date(data.scheduledAt);
        const formattedDate = scheduledDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        });
        const formattedTime = scheduledDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });

        await this.notificationService.send({
            userId: application.applicantId,
            type: NotificationType.INTERVIEW_SCHEDULED,
            title: 'Interview Scheduled',
            message: `Interview for "${project.title}" scheduled on ${formattedDate} at ${formattedTime} (${data.durationMinutes} mins)`,
            data: {
                interviewId: updatedInterview.id,
                projectId: project.id!,
                applicationId: data.applicationId,
                scheduledAt: data.scheduledAt.toISOString(),
                roomCode: savedRoom.roomCode
            },
        });

        return this.mapper.toResponseDTO(updatedInterview);
    }
}
