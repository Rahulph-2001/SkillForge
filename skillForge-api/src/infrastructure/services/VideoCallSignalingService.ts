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

      socket.on('video:join-room', ({ roomId }: { roomId: string }) => {
        try {
          console.log(`[VideoCallSignaling] video:join-room received - userId: ${userId}, roomId: ${roomId}, socketId: ${socket.id}`);
          // Track this as the video socket for this user
           
          this.videoSockets.set(userId, socket.id);
           
          void this.handleJoinRoom(userId, roomId, socket).catch((e: unknown) => {
            const msg = e instanceof Error ? e.message : String(e);
            console.error(`[VideoCallSignaling] Error joining room: ${msg}`);
            socket.emit('video:error', { message: msg });
          });
        }
        catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e);
          console.error(`[VideoCallSignaling] Error joining room: ${msg}`);
          socket.emit('video:error', { message: msg });
        }
      });

      socket.on('video:leave-room', (data: { roomId: string }) => {
        const { roomId } = data;
        console.log(`[VideoCallSignaling] video:leave-room received - userId: ${userId}, roomId: ${roomId}`);
         
        this.videoSockets.delete(userId);
         
        void this.handleLeaveRoom(userId, roomId, socket).catch((e: unknown) => {
          const msg = e instanceof Error ? e.message : String(e);
          console.error(`[VideoCallSignaling] Error leaving room: ${msg}`);
          socket.emit('video:error', { message: msg });
        });
      });

      socket.on('video:offer', (data: { roomId: string, offer: unknown, toUserId: string }) => {
        const { roomId, offer, toUserId } = data;
        console.log(`[VideoCallSignaling] 📤 Relaying offer from ${userId} to ${toUserId} in room ${roomId}`);
         
        socket.to(`video:${roomId}`).emit('video:offer', { roomId, offer, fromUserId: userId, toUserId });
      });

      socket.on('video:answer', (data: { roomId: string, answer: unknown, toUserId: string }) => {
        const { roomId, answer, toUserId } = data;
        console.log(`[VideoCallSignaling] 📤 Relaying answer from ${userId} to ${toUserId} in room ${roomId}`);
         
        socket.to(`video:${roomId}`).emit('video:answer', { roomId, answer, fromUserId: userId, toUserId });
      });

      socket.on('video:ice-candidate', (data: { roomId: string, candidate: unknown, toUserId: string }) => {
        const { roomId, candidate, toUserId } = data;
        console.log(`[VideoCallSignaling] 🧊 Relaying ICE candidate from ${userId} to ${toUserId} in room ${roomId}`);
         
        socket.to(`video:${roomId}`).emit('video:ice-candidate', { roomId, candidate, fromUserId: userId, toUserId });
      });

      socket.on('disconnect', () => {
        console.log(`[VideoCallSignaling] Socket disconnected: ${socket.id}, userId: ${userId}`);

        // CRITICAL: Only handle video room leave if this was the actual video socket
         
        const videoSocketId = this.videoSockets.get(userId);
        if (videoSocketId !== socket.id) {
          console.log(`[VideoCallSignaling] Ignoring disconnect - not the video socket (video: ${videoSocketId}, disconnected: ${socket.id})`);
          return;
        }

        console.log(`[VideoCallSignaling] Video socket disconnected for ${userId}, removing from room`);
         
        this.videoSockets.delete(userId);
         
        void this.presenceService.getUserSession(userId).then(async (session) => {
           
          if (session) await this.handleLeaveRoom(userId, session.roomId, socket);
        });
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
    void socket.join(`video:${roomId}`);

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
    void socket.leave(`video:${roomId}`);
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
