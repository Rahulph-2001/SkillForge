import { IVideoCallRoomRepository } from '../../../domain/repositories/IVideoCallRoomRepository';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IVideoCallRoomMapper } from '../../mappers/interfaces/IVideoCallRoomMapper';
import { CreateVideoRoomDTO } from '../../dto/videoCall/CreateVideoRoomDTO';
import { VideoCallRoomResponseDTO } from '../../dto/videoCall/VideoCallRoomResponseDTO';
import { ICreateVideoRoomUseCase } from './interfaces/ICreateVideoRoomUseCase';
export declare class CreateVideoRoomUseCase implements ICreateVideoRoomUseCase {
    private roomRepository;
    private bookingRepository;
    private roomMapper;
    constructor(roomRepository: IVideoCallRoomRepository, bookingRepository: IBookingRepository, roomMapper: IVideoCallRoomMapper);
    execute(userId: string, dto: CreateVideoRoomDTO): Promise<VideoCallRoomResponseDTO>;
    private getIceServers;
}
//# sourceMappingURL=CreateVideoRoomUseCase.d.ts.map