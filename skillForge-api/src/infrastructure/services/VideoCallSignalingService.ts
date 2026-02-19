import { injectable, inject } from 'inversify';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { TYPES } from '../di/types';
import { IVideoCallSignalingService } from '../../domain/services/IVideoCallSignalingService';
import { IVideoCallPresenceService } from '../../domain/services/IVideoCallPresenceService';
import { IVideoCallRoomRepository } from '../../domain/repositories/IVideoCallRoomRepository';

@injectable()
export class VideoCallSignalingService implements IVideoCallSignalingService {
  private io: SocketIOServer | null = null;
  // Track which socket is the video socket for each user (to avoid disconnect interference from other sockets)
  private videoSockets: Map<string, string> = new Map(); // userId -> socketId

  constructor(
    @inject(TYPES.IVideoCallPresenceService) private presenceService: IVideoCallPresenceService,
    @inject(TYPES.IVideoCallRoomRepository) private roomRepository: IVideoCallRoomRepository
  ) { }

  initialize(io: SocketIOServer): void {
    this.io = io;
    io.on('connection', (socket: Socket) => {
      // WebSocketService stores the decoded JWT as socket.data.user (with userId property)
      const userId = socket.data.user?.userId || socket.data.userId;
      if (!userId) {
        console.error('[VideoCallSignaling] No userId found on socket, disconnecting:', socket.id);
        socket.disconnect();
        return;
      }
      console.log(`[VideoCallSignaling] Socket connected: ${socket.id}, userId: ${userId}`);

      socket.on('video:join-room', async ({ roomId }) => {
        try {
          console.log(`[VideoCallSignaling] video:join-room received - userId: ${userId}, roomId: ${roomId}, socketId: ${socket.id}`);
          // Track this as the video socket for this user
          this.videoSockets.set(userId, socket.id);
          await this.handleJoinRoom(userId, roomId, socket);
        }
        catch (e: any) {
          console.error(`[VideoCallSignaling] Error joining room: ${e.message}`);
          socket.emit('video:error', { message: e.message });
        }
      });

      socket.on('video:leave-room', async ({ roomId }) => {
        try {
          console.log(`[VideoCallSignaling] video:leave-room received - userId: ${userId}, roomId: ${roomId}`);
          this.videoSockets.delete(userId);
          await this.handleLeaveRoom(userId, roomId, socket);
        }
        catch (e: any) {
          console.error(`[VideoCallSignaling] Error leaving room: ${e.message}`);
          socket.emit('video:error', { message: e.message });
        }
      });

      socket.on('video:offer', ({ roomId, offer, toUserId }) => {
        console.log(`[VideoCallSignaling] 📤 Relaying offer from ${userId} to ${toUserId} in room ${roomId}`);
        socket.to(`video:${roomId}`).emit('video:offer', { roomId, offer, fromUserId: userId, toUserId });
      });

      socket.on('video:answer', ({ roomId, answer, toUserId }) => {
        console.log(`[VideoCallSignaling] 📤 Relaying answer from ${userId} to ${toUserId} in room ${roomId}`);
        socket.to(`video:${roomId}`).emit('video:answer', { roomId, answer, fromUserId: userId, toUserId });
      });

      socket.on('video:ice-candidate', ({ roomId, candidate, toUserId }) => {
        console.log(`[VideoCallSignaling] 🧊 Relaying ICE candidate from ${userId} to ${toUserId} in room ${roomId}`);
        socket.to(`video:${roomId}`).emit('video:ice-candidate', { roomId, candidate, fromUserId: userId, toUserId });
      });

      socket.on('disconnect', async () => {
        console.log(`[VideoCallSignaling] Socket disconnected: ${socket.id}, userId: ${userId}`);

        // CRITICAL: Only handle video room leave if this was the actual video socket
        // This prevents the WebSocketContext socket disconnect from removing the user
        const videoSocketId = this.videoSockets.get(userId);
        if (videoSocketId !== socket.id) {
          console.log(`[VideoCallSignaling] Ignoring disconnect - not the video socket (video: ${videoSocketId}, disconnected: ${socket.id})`);
          return;
        }

        console.log(`[VideoCallSignaling] Video socket disconnected for ${userId}, removing from room`);
        this.videoSockets.delete(userId);
        const session = await this.presenceService.getUserSession(userId);
        if (session) await this.handleLeaveRoom(userId, session.roomId, socket);
      });
    });
  }

  async handleJoinRoom(userId: string, roomId: string, socket: Socket): Promise<void> {
    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      console.error(`[VideoCallSignaling] Room not found: ${roomId}`);
      throw new Error('Room not found');
    }
    if (!room.canJoin()) {
      console.error(`[VideoCallSignaling] Room not joinable: ${roomId}, status: ${room.status}`);
      throw new Error('Room not available');
    }

    console.log(`[VideoCallSignaling] Adding participant ${userId} to room ${roomId}`);
    await this.presenceService.addParticipant(roomId, userId, socket.id);
    socket.join(`video:${roomId}`);

    const participants = await this.presenceService.getParticipants(roomId);
    const participantDTOs = participants.map(p => ({ userId: p.userId, joinedAt: p.joinedAt }));

    console.log(`[VideoCallSignaling] Room ${roomId} now has ${participants.length} participant(s):`, participantDTOs.map(p => p.userId));

    // Notify existing participants about the new user
    socket.to(`video:${roomId}`).emit('video:user-joined', { userId, roomId, participants: participantDTOs });
    // Send room info to the joining user
    socket.emit('video:room-joined', { roomId, participants: participantDTOs });

    if (participants.length === 1 && room.status === 'waiting') {
      await this.roomRepository.updateStatus(roomId, 'active');
      console.log(`[VideoCallSignaling] Room ${roomId} status updated to 'active'`);
    }
  }

  async handleLeaveRoom(userId: string, roomId: string, socket: Socket): Promise<void> {
    console.log(`[VideoCallSignaling] Removing participant ${userId} from room ${roomId}`);
    await this.presenceService.removeParticipant(roomId, userId);
    socket.leave(`video:${roomId}`);
    socket.to(`video:${roomId}`).emit('video:user-left', { userId, roomId });

    const count = await this.presenceService.getParticipantCount(roomId);
    console.log(`[VideoCallSignaling] Room ${roomId} now has ${count} participant(s)`);
    if (count === 0) {
      await this.roomRepository.updateStatus(roomId, 'ended', new Date());
      await this.presenceService.clearRoom(roomId);
      console.log(`[VideoCallSignaling] Room ${roomId} ended and cleared`);
    }
  }
}
