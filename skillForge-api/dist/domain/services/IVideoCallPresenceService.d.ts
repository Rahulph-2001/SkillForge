export interface Participant {
    userId: string;
    socketId: string;
    joinedAt: Date;
}
export interface UserSession {
    roomId: string;
    socketId: string;
}
export interface IVideoCallPresenceService {
    addParticipant(roomId: string, userId: string, socketId: string): Promise<void>;
    removeParticipant(roomId: string, userId: string): Promise<void>;
    getParticipants(roomId: string): Promise<Participant[]>;
    getParticipantCount(roomId: string): Promise<number>;
    isUserInRoom(roomId: string, userId: string): Promise<boolean>;
    setUserSession(userId: string, roomId: string, socketId: string): Promise<void>;
    getUserSession(userId: string): Promise<UserSession | null>;
    clearUserSession(userId: string): Promise<void>;
    clearRoom(roomId: string): Promise<void>;
}
//# sourceMappingURL=IVideoCallPresenceService.d.ts.map