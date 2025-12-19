import { injectable } from 'inversify';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { IWebSocketService, WebSocketMessage } from '../../domain/services/IWebSocketService';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';

interface SocketUser {
  userId: string;
  email: string;
  role: string;
}

@injectable()
export class WebSocketService implements IWebSocketService {
  private io: SocketIOServer | null = null;
  private userSockets: Map<string, Set<string>> = new Map(); // userId -> Set of socketIds
  private communitySockets: Map<string, Set<string>> = new Map(); // communityId -> Set of socketIds

  public initialize(io: SocketIOServer): void {
    this.io = io;

    // Middleware for Authentication
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token || socket.handshake.headers.cookie?.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];

      if (!token) {
        return next(new Error('Authentication error'));
      }

      try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as SocketUser;
        socket.data.user = decoded;
        next();
      } catch (err) {
        next(new Error('Authentication error'));
      }
    });

    this.io.on('connection', (socket: Socket) => {
      const user = socket.data.user as SocketUser;
      console.log(`WebSocket connected: ${socket.id} (User: ${user.userId})`);

      // Auto-join user to their own room for direct notifications
      if (user.userId) {
        if (!this.userSockets.has(user.userId)) {
          this.userSockets.set(user.userId, new Set());
        }
        this.userSockets.get(user.userId)?.add(socket.id);
      }

      socket.on('join_community', (communityId: string) => {
        // Frontend sends string ID directly
        if (user.userId && communityId) {
          this.joinCommunity(user.userId, communityId, socket.id);
          socket.join(`community:${communityId}`);
          console.log(`User ${user.userId} joined community channel: ${communityId}`);
        }
      });

      socket.on('leave_community', (communityId: string) => {
        if (user.userId && communityId) {
          this.leaveCommunity(user.userId, communityId, socket.id);
          socket.leave(`community:${communityId}`);
          console.log(`User ${user.userId} left community channel: ${communityId}`);
        }
      });

      socket.on('disconnect', () => {
        this.handleDisconnect(socket.id);
      });
    });
  }

  public sendToCommunity(communityId: string, message: WebSocketMessage): void {
    if (!this.io) return;

    // Map internal event structure to frontend's expected events
    if (message.type === 'message') {
      this.io.to(`community:${communityId}`).emit('new_message', message.data);
    } else if (message.type === 'pin') {
      this.io.to(`community:${communityId}`).emit('message_pinned', message.data);
    } else if (message.type === 'unpin') {
      this.io.to(`community:${communityId}`).emit('message_unpinned', message.data);
    } else if (message.type === 'delete') {
      this.io.to(`community:${communityId}`).emit('message_deleted', message.data);
    } else if (message.type === 'reaction_added') {
      this.io.to(`community:${communityId}`).emit('reaction_added', message.data);
    } else if (message.type === 'reaction_removed') {
      this.io.to(`community:${communityId}`).emit('reaction_removed', message.data);
    } else {
      // Fallback for other events
      this.io.to(`community:${communityId}`).emit('community_event', message);
    }
  }

  public sendToUser(userId: string, message: WebSocketMessage): void {
    if (!this.io) return;
    const socketIds = this.userSockets.get(userId);
    if (socketIds) {
      socketIds.forEach(socketId => {
        this.io?.to(socketId).emit('user_event', message);
      });
    }
  }

  public joinCommunity(userId: string, communityId: string, socketId?: string): void {
    if (socketId) {
      if (!this.communitySockets.has(communityId)) {
        this.communitySockets.set(communityId, new Set());
      }
      this.communitySockets.get(communityId)?.add(socketId);
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)?.add(socketId);
    }
  }

  public leaveCommunity(_userId: string, communityId: string, socketId?: string): void {
    if (socketId) {
      this.communitySockets.get(communityId)?.delete(socketId);
      // We don't remove from userSockets on leave_community, only on disconnect
    }
  }

  private handleDisconnect(socketId: string): void {
    // Clean up all mappings for this socket
    this.communitySockets.forEach((sockets) => {
      sockets.delete(socketId);
    });
    this.userSockets.forEach((sockets) => {
      sockets.delete(socketId);
    });
    console.log(`WebSocket disconnected: ${socketId}`);
  }
}