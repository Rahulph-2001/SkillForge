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
    console.log('[CreateVideoRoomUseCase] execute called');
    console.log('[CreateVideoRoomUseCase] userId:', userId);
    console.log('[CreateVideoRoomUseCase] dto:', dto);

    if (dto.bookingId) {
      console.log('[CreateVideoRoomUseCase] Finding booking...');
      const booking = await this.bookingRepository.findById(dto.bookingId);
      console.log('[CreateVideoRoomUseCase] Booking found:', booking ? 'yes' : 'no');
      if (!booking) throw new NotFoundError('Booking not found');

      console.log('[CreateVideoRoomUseCase] Booking providerId:', booking.providerId);
      console.log('[CreateVideoRoomUseCase] Booking learnerId:', booking.learnerId);
      console.log('[CreateVideoRoomUseCase] Booking status:', booking.status);

      if (booking.providerId !== userId && booking.learnerId !== userId) {
        console.log('[CreateVideoRoomUseCase] Authorization failed - user not part of booking');
        throw new ForbiddenError('Not authorized to create room for this booking');
      }
      if (booking.status !== BookingStatus.CONFIRMED) {
        console.log('[CreateVideoRoomUseCase] Booking not confirmed, status:', booking.status);
        throw new ValidationError('Booking must be confirmed to start a video call');
      }

      // Check for existing room
      console.log('[CreateVideoRoomUseCase] Checking for existing room...');
      const existingRoom = await this.roomRepository.findByBookingId(dto.bookingId);
      console.log('[CreateVideoRoomUseCase] Existing room:', existingRoom ? existingRoom.status : 'none');
      if (existingRoom) {
        // If room exists but is ended, reactivate it
        if (existingRoom.status === 'ended') {
          console.log('[CreateVideoRoomUseCase] Reactivating ended room');
          const reactivatedRoom = await this.roomRepository.updateStatus(existingRoom.id, 'waiting');
          return this.roomMapper.toResponseDTO(reactivatedRoom, [], this.getIceServers());
        }
        // Return existing active/waiting room
        console.log('[CreateVideoRoomUseCase] Returning existing room');
        return this.roomMapper.toResponseDTO(existingRoom, [], this.getIceServers());
      }
    }

    // Create new room only if no existing room for this booking
    console.log('[CreateVideoRoomUseCase] Creating new room');
    const room = new VideoCallRoom({ hostId: userId, bookingId: dto.bookingId });
    const createdRoom = await this.roomRepository.create(room);
    console.log('[CreateVideoRoomUseCase] New room created:', createdRoom.id);
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