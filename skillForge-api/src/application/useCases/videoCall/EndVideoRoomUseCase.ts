import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IVideoCallRoomRepository } from '../../../domain/repositories/IVideoCallRoomRepository';
import { IVideoCallPresenceService } from '../../../domain/services/IVideoCallPresenceService';
import { IEndVideoRoomUseCase } from './interfaces/IEndVideoRoomUseCase';
import { IInterviewRepository } from '../../../domain/repositories/IInterviewRepository';
import { NotFoundError, ForbiddenError } from '../../../domain/errors/AppError';

@injectable()
export class EndVideoRoomUseCase implements IEndVideoRoomUseCase {
  constructor(
    @inject(TYPES.IVideoCallRoomRepository) private roomRepository: IVideoCallRoomRepository,
    @inject(TYPES.IVideoCallPresenceService) private presenceService: IVideoCallPresenceService,
    @inject(TYPES.IInterviewRepository) private interviewRepository: IInterviewRepository
  ) { }

  async execute(userId: string, roomId: string): Promise<void> {
    console.log(`[EndVideoRoomUseCase] Executing for user ${userId} room ${roomId}`);
    const room = await this.roomRepository.findById(roomId);

    if (!room) {
      console.error(`[EndVideoRoomUseCase] Room ${roomId} not found`);
      throw new NotFoundError('Room not found');
    }

    console.log(`[EndVideoRoomUseCase] Room found. Host: ${room.hostId}, InterviewId: ${room.interviewId}, Status: ${room.status}`);

    if (!room.isHost(userId)) {
      console.error(`[EndVideoRoomUseCase] User ${userId} is not host ${room.hostId}`);
      throw new ForbiddenError('Only host can end the call');
    }

    // Update Room Status
    await this.roomRepository.updateStatus(roomId, 'ended', new Date());
    await this.presenceService.clearRoom(roomId);
    console.log(`[EndVideoRoomUseCase] Room marked as ended`);

    // If it's an interview room, complete the interview
    if (room.interviewId) {
      console.log(`[EndVideoRoomUseCase] Room is linked to interview ${room.interviewId}. Updating interview status.`);
      const interview = await this.interviewRepository.findById(room.interviewId);
      if (interview) {
        interview.complete();
        await this.interviewRepository.update(interview);
        console.log(`[EndVideoRoomUseCase] Interview ${interview.id} status updated to COMPLETED`);
      } else {
        console.warn(`[EndVideoRoomUseCase] Linked interview ${room.interviewId} not found in DB`);
      }
    } else {
      console.log(`[EndVideoRoomUseCase] No interview linked to this room.`);
    }
  }
}