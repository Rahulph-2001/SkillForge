import { injectable, inject } from 'inversify';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { TYPES } from '../di/types';
import { IVideoCallSignalingService } from '../../domain/services/IVideoCallSignalingService';
import { IVideoCallPresenceService } from '../../domain/services/IVideoCallPresenceService';
import { IVideoCallRoomRepository } from '../../domain/repositories/IVideoCallRoomRepository';

@injectable()
export class VideoCallSignalingService implements IVideoCallSignalingService {
  private io: SocketIOServer | null = null;

  constructor(
    @inject(TYPES.IVideoCallPresenceService) private presenceService: IVideoCallPresenceService,
    @inject(TYPES.IVideoCallRoomRepository) private roomRepository: IVideoCallRoomRepository
  ) {}

  initialize(io: SocketIOServer): void {
    this.io = io;
    io.on('connection', (socket: Socket) => {
      const userId = socket.data.userId;
      if (!userId) { socket.disconnect(); return; }

      socket.on('video:join-room', async ({ roomId }) => {
        try { await this.handleJoinRoom(userId, roomId, socket); }
        catch (e: any) { socket.emit('video:error', { message: e.message }); }
      });

      socket.on('video:leave-room', async ({ roomId }) => {
        try { await this.handleLeaveRoom(userId, roomId, socket); }
        catch (e: any) { socket.emit('video:error', { message: e.message }); }
      });

      socket.on('video:offer', ({ roomId, offer, toUserId }) => {
        socket.to(`video:${roomId}`).emit('video:offer', { roomId, offer, fromUserId: userId, toUserId });
      });

      socket.on('video:answer', ({ roomId, answer, toUserId }) => {
        socket.to(`video:${roomId}`).emit('video:answer', { roomId, answer, fromUserId: userId, toUserId });
      });

      socket.on('video:ice-candidate', ({ roomId, candidate, toUserId }) => {
        socket.to(`video:${roomId}`).emit('video:ice-candidate', { roomId, candidate, fromUserId: userId, toUserId });
      });

      socket.on('disconnect', async () => {
        const session = await this.presenceService.getUserSession(userId);
        if (session) await this.handleLeaveRoom(userId, session.roomId, socket);
      });
    });
  }

  async handleJoinRoom(userId: string, roomId: string, socket: Socket): Promise<void> {
    const room = await this.roomRepository.findById(roomId);
    if (!room || !room.canJoin()) throw new Error('Room not available');

    await this.presenceService.addParticipant(roomId, userId, socket.id);
    socket.join(`video:${roomId}`);

    const participants = await this.presenceService.getParticipants(roomId);
    socket.to(`video:${roomId}`).emit('video:user-joined', { userId, roomId, participants: participants.map(p => ({ userId: p.userId, joinedAt: p.joinedAt })) });
    socket.emit('video:room-joined', { roomId, participants: participants.map(p => ({ userId: p.userId, joinedAt: p.joinedAt })) });

    if (participants.length === 1 && room.status === 'waiting') {
      await this.roomRepository.updateStatus(roomId, 'active');
    }
  }

  async handleLeaveRoom(userId: string, roomId: string, socket: Socket): Promise<void> {
    await this.presenceService.removeParticipant(roomId, userId);
    socket.leave(`video:${roomId}`);
    socket.to(`video:${roomId}`).emit('video:user-left', { userId, roomId });

    const count = await this.presenceService.getParticipantCount(roomId);
    if (count === 0) {
      await this.roomRepository.updateStatus(roomId, 'ended', new Date());
      await this.presenceService.clearRoom(roomId);
    }
  }
}