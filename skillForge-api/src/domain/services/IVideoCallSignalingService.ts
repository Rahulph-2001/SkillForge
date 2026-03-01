import { type Server as SocketIOServer, type Socket } from 'socket.io'

export interface IVideoCallSignalingService {
    initialize(io: SocketIOServer): void;
    handleJoinRoom(userId: string, roomId: string, socket: Socket): Promise<void>
    handleLeaveRoom(userId: string, roomId: string, socket: Socket): Promise<void>
}