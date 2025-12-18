import { injectable } from 'inversify';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { IWebSocketService, WebSocketMessage } from '../../domain/services/IWebSocketService';


@injectable()
export class WebSocketService implements IWebSocketService {
  private io: SocketIOServer | null = null;
  private userSockets: Map<string, Set<string>> = new Map(); // userId -> Set of socketIds
  private communitySockets: Map<string, Set<string>> = new Map(); // communityId -> Set of socketIds
  public initialize(io: SocketIOServer): void {
    this.io = io;
    this.io.on('connection', (socket: Socket) => {
      console.log('WebSocket connected:', socket.id);
      socket.on('join_community', (data: { userId: string; communityId: string }) => {
        this.joinCommunity(data.userId, data.communityId, socket.id);
        socket.join(`community:${data.communityId}`);
      });
      socket.on('leave_community', (data: { userId: string; communityId: string }) => {
        this.leaveCommunity(data.userId, data.communityId, socket.id);
        socket.leave(`community:${data.communityId}`);
      });
      socket.on('disconnect', () => {
        this.handleDisconnect(socket.id);
      });
    });
  }
  public sendToCommunity(communityId: string, message: WebSocketMessage): void {
    if (!this.io) return;
    this.io.to(`community:${communityId}`).emit('community_event', message);
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
  public leaveCommunity(userId: string, communityId: string, socketId?: string): void {
    if (socketId) {
      this.communitySockets.get(communityId)?.delete(socketId);
      this.userSockets.get(userId)?.delete(socketId);
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
  }
}