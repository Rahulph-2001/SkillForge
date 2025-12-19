export interface WebSocketMessage {
  type: 'message' | 'pin' | 'unpin' | 'delete' | 'member_joined' | 'member_left' | 'reaction_added' | 'reaction_removed';
  communityId: string;
  data: unknown;
}
export interface IWebSocketService {
  initialize(io: any): void;
  sendToCommunity(communityId: string, message: WebSocketMessage): void;
  sendToUser(userId: string, message: WebSocketMessage): void;
  joinCommunity(userId: string, communityId: string): void;
  leaveCommunity(userId: string, communityId: string): void;
}
