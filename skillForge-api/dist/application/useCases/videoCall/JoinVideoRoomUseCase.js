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
var JoinVideoRoomUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinVideoRoomUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const messages_1 = require("../../../config/messages");
const Booking_1 = require("../../../domain/entities/Booking");
const env_1 = require("../../../config/env");
let JoinVideoRoomUseCase = JoinVideoRoomUseCase_1 = class JoinVideoRoomUseCase {
    constructor(roomRepository, bookingRepository, interviewRepository, applicationRepository, projectRepository, presenceService, roomMapper) {
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
        this.interviewRepository = interviewRepository;
        this.applicationRepository = applicationRepository;
        this.projectRepository = projectRepository;
        this.presenceService = presenceService;
        this.roomMapper = roomMapper;
    }
    async execute(userId, dto) {
        let room = null;
        if (dto.roomId)
            room = await this.roomRepository.findById(dto.roomId);
        else if (dto.roomCode)
            room = await this.roomRepository.findByRoomCode(dto.roomCode);
        else if (dto.bookingId)
            room = await this.roomRepository.findByBookingId(dto.bookingId);
        if (!room)
            throw new AppError_1.NotFoundError('Video call room not found');
        if (!room.canJoin())
            throw new AppError_1.ValidationError('This video call has ended');
        if (room.bookingId) {
            const booking = await this.bookingRepository.findById(room.bookingId);
            if (!booking) {
                throw new AppError_1.NotFoundError('Booking not found');
            }
            // Authorization check
            if (booking.providerId !== userId && booking.learnerId !== userId) {
                throw new AppError_1.ForbiddenError('Not authorized to join this call');
            }
            // Status check - allow CONFIRMED or IN_SESSION
            if (booking.status !== Booking_1.BookingStatus.CONFIRMED && booking.status !== Booking_1.BookingStatus.IN_SESSION) {
                throw new AppError_1.ValidationError(messages_1.ERROR_MESSAGES.SESSION.NOT_CONFIRMED);
            }
            // Time validation
            const timeValidation = this.validateSessionTime(booking);
            if (!timeValidation.canJoin) {
                throw new AppError_1.ValidationError(timeValidation.message);
            }
            // Transition to IN_SESSION if currently CONFIRMED (blocks cancel/reschedule)
            if (booking.status === Booking_1.BookingStatus.CONFIRMED) {
                console.log(`[JoinVideoRoom] Updating booking ${room.bookingId} from CONFIRMED to IN_SESSION`);
                await this.bookingRepository.updateStatus(room.bookingId, Booking_1.BookingStatus.IN_SESSION);
                console.log(`[JoinVideoRoom] Booking ${room.bookingId} status updated to IN_SESSION successfully`);
            }
        }
        else if (room.interviewId) {
            // --- INTERVIEW VALIDATION LOGIC ---
            const interview = await this.interviewRepository.findById(room.interviewId);
            if (!interview) {
                throw new AppError_1.NotFoundError('Interview not found');
            }
            const application = await this.applicationRepository.findById(interview.applicationId);
            if (!application) {
                throw new AppError_1.NotFoundError('Application not found');
            }
            const project = await this.projectRepository.findById(application.projectId);
            if (!project) {
                throw new AppError_1.NotFoundError('Project not found');
            }
            // Authorization check: Applicant or Project Owner
            if (application.applicantId !== userId && project.clientId !== userId) {
                throw new AppError_1.ForbiddenError('Not authorized to join this interview');
            }
            // Time validation for interview
            const timeValidation = this.validateInterviewTime(interview);
            if (!timeValidation.canJoin) {
                throw new AppError_1.ValidationError(timeValidation.message);
            }
        }
        const existingSession = await this.presenceService.getUserSession(userId);
        if (existingSession && existingSession.roomId !== room.id) {
            throw new AppError_1.ValidationError('You are already in another call');
        }
        const participants = await this.presenceService.getParticipants(room.id);
        return this.roomMapper.toResponseDTO(room, participants.map(p => ({ userId: p.userId, joinedAt: p.joinedAt })), this.getIceServers());
    }
    validateSessionTime(booking) {
        const sessionStartAt = this.parseDateTime(booking.preferredDate, booking.preferredTime);
        const sessionDurationMinutes = booking.duration || 60;
        const sessionEndAt = new Date(sessionStartAt.getTime() + sessionDurationMinutes * 60 * 1000);
        const now = new Date();
        // Calculate join window
        const joinWindowStart = new Date(sessionStartAt.getTime() - JoinVideoRoomUseCase_1.JOIN_WINDOW_MINUTES_BEFORE * 60 * 1000);
        // Check if session has expired
        if (now > sessionEndAt) {
            return {
                canJoin: false,
                message: messages_1.ERROR_MESSAGES.SESSION.SESSION_EXPIRED,
            };
        }
        // Check if it's too early to join
        if (now < joinWindowStart) {
            return {
                canJoin: false,
                message: messages_1.ERROR_MESSAGES.SESSION.JOIN_WINDOW_NOT_OPEN,
            };
        }
        return {
            canJoin: true,
            message: 'Session is available to join',
        };
    }
    validateInterviewTime(interview) {
        const sessionStartAt = new Date(interview.scheduledAt);
        const sessionDurationMinutes = interview.durationMinutes || 30;
        const sessionEndAt = new Date(sessionStartAt.getTime() + sessionDurationMinutes * 60 * 1000);
        const now = new Date();
        // Join window: 15 mins before
        const joinWindowStart = new Date(sessionStartAt.getTime() - JoinVideoRoomUseCase_1.JOIN_WINDOW_MINUTES_BEFORE * 60 * 1000);
        // End window: 15 mins after end (Grace period)
        const joinWindowEnd = new Date(sessionEndAt.getTime() + JoinVideoRoomUseCase_1.GRACE_PERIOD_MINUTES_AFTER * 60 * 1000);
        if (now > joinWindowEnd) {
            return {
                canJoin: false,
                message: 'Interview session has expired',
            };
        }
        if (now < joinWindowStart) {
            return {
                canJoin: false,
                message: 'Interview session check-in not yet open',
            };
        }
        return {
            canJoin: true,
            message: 'Interview is available to join',
        };
    }
    parseDateTime(dateString, timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date(dateString);
        date.setHours(hours, minutes, 0, 0);
        return date;
    }
    getIceServers() {
        const servers = [{ urls: env_1.env.STUN_SERVER || 'stun:stun.l.google.com:19302' }];
        if (env_1.env.TURN_SERVER)
            servers.push({ urls: env_1.env.TURN_SERVER, username: env_1.env.TURN_USERNAME, credential: env_1.env.TURN_CREDENTIAL });
        return servers;
    }
};
exports.JoinVideoRoomUseCase = JoinVideoRoomUseCase;
// Allow joining 15 minutes before session start
JoinVideoRoomUseCase.JOIN_WINDOW_MINUTES_BEFORE = 15;
// Allow joining 15 minutes after session end (grace period)
JoinVideoRoomUseCase.GRACE_PERIOD_MINUTES_AFTER = 15;
exports.JoinVideoRoomUseCase = JoinVideoRoomUseCase = JoinVideoRoomUseCase_1 = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IVideoCallRoomRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IBookingRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IInterviewRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IProjectApplicationRepository)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IProjectRepository)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.IVideoCallPresenceService)),
    __param(6, (0, inversify_1.inject)(types_1.TYPES.IVideoCallRoomMapper)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], JoinVideoRoomUseCase);
//# sourceMappingURL=JoinVideoRoomUseCase.js.map