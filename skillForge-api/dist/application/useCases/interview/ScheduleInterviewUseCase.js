"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleInterviewUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const Interview_1 = require("../../../domain/entities/Interview");
const VideoCallRoom_1 = require("../../../domain/entities/VideoCallRoom");
const ProjectApplication_1 = require("../../../domain/entities/ProjectApplication");
const AppError_1 = require("../../../domain/errors/AppError");
const messages_1 = require("../../../config/messages");
const Notification_1 = require("../../../domain/entities/Notification");
let ScheduleInterviewUseCase = class ScheduleInterviewUseCase {
    constructor(interviewRepository, applicationRepository, projectRepository, mapper, videoRoomRepository, notificationService) {
        this.interviewRepository = interviewRepository;
        this.applicationRepository = applicationRepository;
        this.projectRepository = projectRepository;
        this.mapper = mapper;
        this.videoRoomRepository = videoRoomRepository;
        this.notificationService = notificationService;
    }
    async execute(userId, data) {
        // 1. Get Application
        const application = await this.applicationRepository.findById(data.applicationId);
        if (!application) {
            throw new AppError_1.NotFoundError('Application not found');
        }
        // 2. Validate Project Ownership
        const project = await this.projectRepository.findById(application.projectId);
        if (!project) {
            throw new AppError_1.NotFoundError(messages_1.ERROR_MESSAGES.PROJECT.NOT_FOUND);
        }
        if (project.clientId !== userId) {
            throw new AppError_1.ForbiddenError('Only project owner can schedule interviews');
        }
        // 3. Create Interview
        const interview = new Interview_1.Interview({
            applicationId: data.applicationId,
            scheduledAt: data.scheduledAt,
            durationMinutes: data.durationMinutes,
            meetingLink: null,
        });
        const savedInterview = await this.interviewRepository.create(interview);
        // 4. Create Video Call Room
        const videoRoom = new VideoCallRoom_1.VideoCallRoom({
            hostId: userId,
            status: 'waiting',
            interviewId: savedInterview.id
        });
        const savedRoom = await this.videoRoomRepository.create(videoRoom);
        // 5. Update Interview with meeting link (room code)
        savedInterview.setMeetingLink(savedRoom.roomCode);
        const updatedInterview = await this.interviewRepository.update(savedInterview);
        // 6. Update Application Status to SHORTLISTED if PENDING/REVIEWED
        if (application.status === ProjectApplication_1.ProjectApplicationStatus.PENDING || application.status === ProjectApplication_1.ProjectApplicationStatus.REVIEWED) {
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
            type: Notification_1.NotificationType.INTERVIEW_SCHEDULED,
            title: 'Interview Scheduled',
            message: `Interview for "${project.title}" scheduled on ${formattedDate} at ${formattedTime} (${data.durationMinutes} mins)`,
            data: {
                interviewId: updatedInterview.id,
                projectId: project.id,
                applicationId: data.applicationId,
                scheduledAt: data.scheduledAt.toISOString(),
                roomCode: savedRoom.roomCode
            },
        });
        return this.mapper.toResponseDTO(updatedInterview);
    }
};
exports.ScheduleInterviewUseCase = ScheduleInterviewUseCase;
exports.ScheduleInterviewUseCase = ScheduleInterviewUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IInterviewRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IProjectApplicationRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IProjectRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IInterviewMapper)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IVideoCallRoomRepository)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.INotificationService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], ScheduleInterviewUseCase);
//# sourceMappingURL=ScheduleInterviewUseCase.js.map