import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IVideoCallRoomRepository } from '../../../domain/repositories/IVideoCallRoomRepository';
import { IVideoCallPresenceService } from '../../../domain/services/IVideoCallPresenceService';
import { IEndVideoRoomUseCase } from './interfaces/IEndVideoRoomUseCase';
import { NotFoundError, ForbiddenError } from '../../../domain/errors/AppError';

@injectable()
export class EndVideoRoomUseCase implements IEndVideoRoomUseCase {
  constructor(
    @inject(TYPES.IVideoCallRoomRepository) private roomRepository: IVideoCallRoomRepository,
    @inject(TYPES.IVideoCallPresenceService) private presenceService: IVideoCallPresenceService
  ) {}

  async execute(userId: string, roomId: string): Promise<void> {
    const room = await this.roomRepository.findById(roomId);
    if (!room) throw new NotFoundError('Room not found');
    if (!room.isHost(userId)) throw new ForbiddenError('Only host can end the call');

    await this.roomRepository.updateStatus(roomId, 'ended', new Date());
    await this.presenceService.clearRoom(roomId);
  }
}