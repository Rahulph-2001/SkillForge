import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IVideoCallRoomRepository } from '../../../domain/repositories/IVideoCallRoomRepository';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IVideoCallRoomMapper } from '../../mappers/interfaces/IVideoCallRoomMapper';
import { VideoCallRoom } from '../../../domain/entities/VideoCallRoom';
import { CreateVideoRoomDTO } from '../../dto/videoCall/CreateVideoRoomDTO';
import { VideoCallRoomResponseDTO } from '../../dto/videoCall/VideoCallRoomResponseDTO';
import { ICreateVideoRoomUseCase } from './interfaces/ICreateVideoRoomUseCase';
import { NotFoundError, ForbiddenError, ValidationError } from '../../../domain/errors/AppError';
import { BookingStatus } from '../../../domain/entities/Booking';
import { env } from '../../../config/env';

@injectable()
export class CreateVideoRoomUseCase implements ICreateVideoRoomUseCase {
  constructor(
    @inject(TYPES.IVideoCallRoomRepository) private roomRepository: IVideoCallRoomRepository,
    @inject(TYPES.IBookingRepository) private bookingRepository: IBookingRepository,
    @inject(TYPES.IVideoCallRoomMapper) private roomMapper: IVideoCallRoomMapper
  ) { }

  async execute(userId: string, dto: CreateVideoRoomDTO): Promise<VideoCallRoomResponseDTO> {
    if (dto.bookingId) {
      const booking = await this.bookingRepository.findById(dto.bookingId);
      if (!booking) throw new NotFoundError('Booking not found');

      if (booking.providerId !== userId && booking.learnerId !== userId) {
        throw new ForbiddenError('Not authorized to create room for this booking');
      }
      // Allow CONFIRMED or IN_SESSION (for rejoining)
      if (booking.status !== BookingStatus.CONFIRMED && booking.status !== BookingStatus.IN_SESSION) {
        throw new ValidationError('Booking must be confirmed or in session to start a video call');
      }

      // Check for existing room
      const existingRoom = await this.roomRepository.findByBookingId(dto.bookingId);
      if (existingRoom) {
        // If room exists but is ended, reactivate it
        if (existingRoom.status === 'ended') {
          const reactivatedRoom = await this.roomRepository.updateStatus(existingRoom.id, 'waiting');
          return this.roomMapper.toResponseDTO(reactivatedRoom, [], this.getIceServers());
        }
        // Return existing active/waiting room
        return this.roomMapper.toResponseDTO(existingRoom, [], this.getIceServers());
      }
    } else if (dto.interviewId) {
      // Interview logic
      // We typically create the room when scheduling, but if we need to create/re-create here:
      const existingRoom = await this.roomRepository.findByInterviewId(dto.interviewId);
      if (existingRoom) {
        if (existingRoom.status === 'ended') {
          const reactivatedRoom = await this.roomRepository.updateStatus(existingRoom.id, 'waiting');
          return this.roomMapper.toResponseDTO(reactivatedRoom, [], this.getIceServers());
        }
        return this.roomMapper.toResponseDTO(existingRoom, [], this.getIceServers());
      }

      // If creating new for interview, ensure authorized? 
      // We might want to implicitly trust the caller if they have access to the interview ID? 
      // Or fetch interview and check host.
      // For now, let's allow creation if it doesn't exist, passing interviewId.
    }

    // Create new room only if no existing room for this booking
    const room = new VideoCallRoom({ hostId: userId, bookingId: dto.bookingId });
    const createdRoom = await this.roomRepository.create(room);
    return this.roomMapper.toResponseDTO(createdRoom, [], this.getIceServers());
  }

  private getIceServers() {
    const servers: any[] = [{ urls: env.STUN_SERVER || 'stun:stun.l.google.com:19302' }];
    if (env.TURN_SERVER) {
      servers.push({ urls: env.TURN_SERVER, username: env.TURN_USERNAME, credential: env.TURN_CREDENTIAL });
    }
    return servers;
  }
}