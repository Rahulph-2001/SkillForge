import { injectable } from 'inversify';
import { Server } from 'socket.io';
import { ISocketNotificationService } from '../../domain/services/ISocketNotificationService';
import { logger } from '../../config/logger';

@injectable()
export class SocketNotificationService implements ISocketNotificationService {
    private io: Server | null = null;

    initialize(io: Server): void {
        this.io = io;
        logger.info('[SocketNotificationService] Initialized with Socket.IO Server');
    }

    notifyRoomEnded(roomId: string): void {
        if (this.io) {
            logger.info(`[SocketNotificationService] Broadcasting 'video:room-ended' to room: video:${roomId}`);
            this.io.to(`video:${roomId}`).emit('video:room-ended', { roomId });
        } else {
            logger.warn(`[SocketNotificationService] Cannot notify room ${roomId}, Socket.IO is not initialized!`);
        }
    }
}
