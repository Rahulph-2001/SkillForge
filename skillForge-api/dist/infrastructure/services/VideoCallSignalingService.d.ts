import { Server as SocketIOServer, Socket } from 'socket.io';
import { IVideoCallSignalingService } from '../../domain/services/IVideoCallSignalingService';
import { IVideoCallPresenceService } from '../../domain/services/IVideoCallPresenceService';
import { IVideoCallRoomRepository } from '../../domain/repositories/IVideoCallRoomRepository';
export declare class VideoCallSignalingService implements IVideoCallSignalingService {
    private presenceService;
    private roomRepository;
    private io;
    constructor(presenceService: IVideoCallPresenceService, roomRepository: IVideoCallRoomRepository);
    initialize(io: SocketIOServer): void;
    handleJoinRoom(userId: string, roomId: string, socket: Socket): Promise<void>;
    handleLeaveRoom(userId: string, roomId: string, socket: Socket): Promise<void>;
}
//# sourceMappingURL=VideoCallSignalingService.d.ts.map