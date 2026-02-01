import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
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
import { NotFoundError, ForbiddenError, ValidationError } from '../../../domain/errors/AppError';
import { ERROR_MESSAGES } from '../../../config/messages';
import { BookingStatus } from '../../../domain/entities/Booking';
import { env } from '../../../config/env';

@injectable()
export class JoinVideoRoomUseCase implements IJoinVideoRoomUseCase {
  // Allow joining 15 minutes before session start
  private static readonly JOIN_WINDOW_MINUTES_BEFORE = 15;
  // Allow joining 15 minutes after session end (grace period)
  private static readonly GRACE_PERIOD_MINUTES_AFTER = 15;

  constructor(
    @inject(TYPES.IVideoCallRoomRepository) private roomRepository: IVideoCallRoomRepository,
    @inject(TYPES.IBookingRepository) private bookingRepository: IBookingRepository,
    @inject(TYPES.IInterviewRepository) private interviewRepository: IInterviewRepository,
    @inject(TYPES.IProjectApplicationRepository) private applicationRepository: IProjectApplicationRepository,
    @inject(TYPES.IProjectRepository) private projectRepository: IProjectRepository,
    @inject(TYPES.IVideoCallPresenceService) private presenceService: IVideoCallPresenceService,
    @inject(TYPES.IVideoCallRoomMapper) private roomMapper: IVideoCallRoomMapper
  ) { }

  async execute(userId: string, dto: JoinVideoRoomDTO): Promise<VideoCallRoomResponseDTO> {
    let room = null;
    if (dto.roomId) room = await this.roomRepository.findById(dto.roomId);
    else if (dto.roomCode) room = await this.roomRepository.findByRoomCode(dto.roomCode);
    else if (dto.bookingId) room = await this.roomRepository.findByBookingId(dto.bookingId);

    if (!room) throw new NotFoundError('Video call room not found');
    if (!room.canJoin()) throw new ValidationError('This video call has ended');

    if (room.bookingId) {
      const booking = await this.bookingRepository.findById(room.bookingId);

      if (!booking) {
        throw new NotFoundError('Booking not found');
      }

      // Authorization check
      if (booking.providerId !== userId && booking.learnerId !== userId) {
        throw new ForbiddenError('Not authorized to join this call');
      }

      // Status check - allow CONFIRMED or IN_SESSION
      if (booking.status !== BookingStatus.CONFIRMED && booking.status !== BookingStatus.IN_SESSION) {
        throw new ValidationError(ERROR_MESSAGES.SESSION.NOT_CONFIRMED);
      }

      // Time validation
      const timeValidation = this.validateSessionTime(booking);
      if (!timeValidation.canJoin) {
        throw new ValidationError(timeValidation.message);
      }

      // Transition to IN_SESSION if currently CONFIRMED (blocks cancel/reschedule)
      if (booking.status === BookingStatus.CONFIRMED) {
        console.log(`[JoinVideoRoom] Updating booking ${room.bookingId} from CONFIRMED to IN_SESSION`);
        await this.bookingRepository.updateStatus(room.bookingId, BookingStatus.IN_SESSION);
        console.log(`[JoinVideoRoom] Booking ${room.bookingId} status updated to IN_SESSION successfully`);
      }
    } else if (room.interviewId) {
      // --- INTERVIEW VALIDATION LOGIC ---
      const interview = await this.interviewRepository.findById(room.interviewId);
      if (!interview) {
        throw new NotFoundError('Interview not found');
      }

      const application = await this.applicationRepository.findById(interview.applicationId);
      if (!application) {
        throw new NotFoundError('Application not found');
      }

      const project = await this.projectRepository.findById(application.projectId);
      if (!project) {
        throw new NotFoundError('Project not found');
      }

      // Authorization check: Applicant or Project Owner
      if (application.applicantId !== userId && project.clientId !== userId) {
        throw new ForbiddenError('Not authorized to join this interview');
      }

      // Time validation for interview
      const timeValidation = this.validateInterviewTime(interview);
      if (!timeValidation.canJoin) {
        throw new ValidationError(timeValidation.message);
      }
    }

    const existingSession = await this.presenceService.getUserSession(userId);
    if (existingSession && existingSession.roomId !== room.id) {
      throw new ValidationError('You are already in another call');
    }

    const participants = await this.presenceService.getParticipants(room.id);
    return this.roomMapper.toResponseDTO(room, participants.map(p => ({ userId: p.userId, joinedAt: p.joinedAt })), this.getIceServers());
  }

  private validateSessionTime(booking: any): { canJoin: boolean; message: string } {
    const sessionStartAt = this.parseDateTime(booking.preferredDate, booking.preferredTime);
    const sessionDurationMinutes = booking.duration || 60;
    const sessionEndAt = new Date(sessionStartAt.getTime() + sessionDurationMinutes * 60 * 1000);

    const now = new Date();

    // Calculate join window
    const joinWindowStart = new Date(
      sessionStartAt.getTime() - JoinVideoRoomUseCase.JOIN_WINDOW_MINUTES_BEFORE * 60 * 1000
    );

    // Check if session has expired
    if (now > sessionEndAt) {
      return {
        canJoin: false,
        message: ERROR_MESSAGES.SESSION.SESSION_EXPIRED,
      };
    }

    // Check if it's too early to join
    if (now < joinWindowStart) {
      return {
        canJoin: false,
        message: ERROR_MESSAGES.SESSION.JOIN_WINDOW_NOT_OPEN,
      };
    }

    return {
      canJoin: true,
      message: 'Session is available to join',
    };
  }

  private validateInterviewTime(interview: any): { canJoin: boolean; message: string } {
    const sessionStartAt = new Date(interview.scheduledAt);
    const sessionDurationMinutes = interview.durationMinutes || 30;
    const sessionEndAt = new Date(sessionStartAt.getTime() + sessionDurationMinutes * 60 * 1000);

    const now = new Date();

    // Join window: 15 mins before
    const joinWindowStart = new Date(
      sessionStartAt.getTime() - JoinVideoRoomUseCase.JOIN_WINDOW_MINUTES_BEFORE * 60 * 1000
    );

    // End window: 15 mins after end (Grace period)
    const joinWindowEnd = new Date(
      sessionEndAt.getTime() + JoinVideoRoomUseCase.GRACE_PERIOD_MINUTES_AFTER * 60 * 1000
    );

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

  private parseDateTime(dateString: string, timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date(dateString);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  private getIceServers() {
    const servers: any[] = [{ urls: env.STUN_SERVER || 'stun:stun.l.google.com:19302' }];
    if (env.TURN_SERVER) servers.push({ urls: env.TURN_SERVER, username: env.TURN_USERNAME, credential: env.TURN_CREDENTIAL });
    return servers;
  }
}