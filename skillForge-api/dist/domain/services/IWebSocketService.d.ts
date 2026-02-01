export type WebSocketMessage = {
    type: 'message_sent' | 'message_deleted' | 'message_pinned' | 'message_unpinned' | 'reaction_added' | 'reaction_removed' | 'member_joined' | 'member_left' | 'member_removed' | 'balance_updated' | 'subscription_renewed';
    communityId?: string;
    data: Record<string, unknown>;
};
export interface IWebSocketService {
    initialize(io: any): void;
    sendToCommunity(communityId: string, message: WebSocketMessage): void;
    sendToUser(userId: string, message: WebSocketMessage): void;
    joinCommunity(userId: string, communityId: string): void;
    leaveCommunity(userId: string, communityId: string): void;
}
//# sourceMappingURL=IWebSocketService.d.ts.map