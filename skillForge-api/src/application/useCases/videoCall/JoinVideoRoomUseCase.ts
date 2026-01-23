import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IVideoCallRoomRepository } from '../../../domain/repositories/IVideoCallRoomRepository';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IVideoCallPresenceService } from '../../../domain/services/IVideoCallPresenceService';
import { IVideoCallRoomMapper } from '../../mappers/interfaces/IVideoCallRoomMapper';
import { JoinVideoRoomDTO } from '../../dto/videoCall/JoinVideoRoomDTO';
import { VideoCallRoomResponseDTO } from '../../dto/videoCall/VideoCallRoomResponseDTO';
import { IJoinVideoRoomUseCase } from './interfaces/IJoinVideoRoomUseCase';
import { NotFoundError, ForbiddenError, ValidationError } from '../../../domain/errors/AppError';
import { env } from '../../../config/env';

@injectable()
export class JoinVideoRoomUseCase implements IJoinVideoRoomUseCase {
  constructor(
    @inject(TYPES.IVideoCallRoomRepository) private roomRepository: IVideoCallRoomRepository,
    @inject(TYPES.IBookingRepository) private bookingRepository: IBookingRepository,
    @inject(TYPES.IVideoCallPresenceService) private presenceService: IVideoCallPresenceService,
    @inject(TYPES.IVideoCallRoomMapper) private roomMapper: IVideoCallRoomMapper
  ) {}

  async execute(userId: string, dto: JoinVideoRoomDTO): Promise<VideoCallRoomResponseDTO> {
    let room = null;
    if (dto.roomId) room = await this.roomRepository.findById(dto.roomId);
    else if (dto.roomCode) room = await this.roomRepository.findByRoomCode(dto.roomCode);
    else if (dto.bookingId) room = await this.roomRepository.findByBookingId(dto.bookingId);

    if (!room) throw new NotFoundError('Video call room not found');
    if (!room.canJoin()) throw new ValidationError('This video call has ended');

    if (room.bookingId) {
      const booking = await this.bookingRepository.findById(room.bookingId);
      if (booking && booking.providerId !== userId && booking.learnerId !== userId) {
        throw new ForbiddenError('Not authorized to join this call');
      }
    }

    const existingSession = await this.presenceService.getUserSession(userId);
    if (existingSession && existingSession.roomId !== room.id) {
      throw new ValidationError('You are already in another call');
    }

    const participants = await this.presenceService.getParticipants(room.id);
    return this.roomMapper.toResponseDTO(room, participants.map(p => ({ userId: p.userId, joinedAt: p.joinedAt })), this.getIceServers());
  }

  private getIceServers() {
    const servers: any[] = [{ urls: env.STUN_SERVER || 'stun:stun.l.google.com:19302' }];
    if (env.TURN_SERVER) servers.push({ urls: env.TURN_SERVER, username: env.TURN_USERNAME, credential: env.TURN_CREDENTIAL });
    return servers;
  }
}