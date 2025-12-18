import { Server as SocketIOServer } from 'socket.io';
import { IWebSocketService, WebSocketMessage } from '../../domain/services/IWebSocketService';
export declare class WebSocketService implements IWebSocketService {
    private io;
    private userSockets;
    private communitySockets;
    initialize(io: SocketIOServer): void;
    sendToCommunity(communityId: string, message: WebSocketMessage): void;
    sendToUser(userId: string, message: WebSocketMessage): void;
    joinCommunity(userId: string, communityId: string, socketId?: string): void;
    leaveCommunity(userId: string, communityId: string, socketId?: string): void;
    private handleDisconnect;
}
//# sourceMappingURL=WebSocketService.d.ts.map