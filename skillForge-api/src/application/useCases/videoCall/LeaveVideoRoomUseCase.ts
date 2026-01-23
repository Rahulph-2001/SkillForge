import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IVideoCallRoomRepository } from '../../../domain/repositories/IVideoCallRoomRepository';
import { IVideoCallPresenceService } from '../../../domain/services/IVideoCallPresenceService';
import { ILeaveVideoRoomUseCase } from './interfaces/ILeaveVideoRoomUseCase';
import { NotFoundError } from '../../../domain/errors/AppError';

@injectable()
export class LeaveVideoRoomUseCase implements ILeaveVideoRoomUseCase {
  constructor(
    @inject(TYPES.IVideoCallRoomRepository) private roomRepository: IVideoCallRoomRepository,
    @inject(TYPES.IVideoCallPresenceService) private presenceService: IVideoCallPresenceService
  ) {}

  async execute(userId: string, roomId: string): Promise<void> {
    const room = await this.roomRepository.findById(roomId);
    if (!room) throw new NotFoundError('Room not found');

    await this.presenceService.removeParticipant(roomId, userId);
    const count = await this.presenceService.getParticipantCount(roomId);
    if (count === 0) {
      await this.roomRepository.updateStatus(roomId, 'ended', new Date());
      await this.presenceService.clearRoom(roomId);
    }
  }
}