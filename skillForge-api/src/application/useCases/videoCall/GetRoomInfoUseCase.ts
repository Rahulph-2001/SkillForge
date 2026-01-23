import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IVideoCallRoomRepository } from '../../../domain/repositories/IVideoCallRoomRepository';
import { IVideoCallPresenceService } from '../../../domain/services/IVideoCallPresenceService';
import { IVideoCallRoomMapper } from '../../mappers/interfaces/IVideoCallRoomMapper';
import { VideoCallRoomResponseDTO } from '../../dto/videoCall/VideoCallRoomResponseDTO';
import { IGetRoomInfoUseCase } from './interfaces/IGetRoomInfoUseCase';
import { NotFoundError } from '../../../domain/errors/AppError';
import { env } from '../../../config/env';

@injectable()
export class GetRoomInfoUseCase implements IGetRoomInfoUseCase {
  constructor(
    @inject(TYPES.IVideoCallRoomRepository) private roomRepository: IVideoCallRoomRepository,
    @inject(TYPES.IVideoCallPresenceService) private presenceService: IVideoCallPresenceService,
    @inject(TYPES.IVideoCallRoomMapper) private roomMapper: IVideoCallRoomMapper
  ) { }

  async execute(_userId: string, roomId: string): Promise<VideoCallRoomResponseDTO> {
    const room = await this.roomRepository.findById(roomId);
    if (!room) throw new NotFoundError('Room not found');

    const participants = await this.presenceService.getParticipants(roomId);
    const iceServers: any[] = [{ urls: env.STUN_SERVER || 'stun:stun.l.google.com:19302' }];
    if (env.TURN_SERVER) iceServers.push({ urls: env.TURN_SERVER, username: env.TURN_USERNAME, credential: env.TURN_CREDENTIAL });

    return this.roomMapper.toResponseDTO(room, participants.map(p => ({ userId: p.userId, joinedAt: p.joinedAt })), iceServers);
  }
}