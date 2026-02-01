import { RedisService } from './RedisService';
import { IVideoCallPresenceService, Participant, UserSession } from '../../domain/services/IVideoCallPresenceService';
export declare class VideoCallPresenceService implements IVideoCallPresenceService {
    private redis;
    private readonly TTL;
    constructor(redis: RedisService);
    private roomKey;
    private userKey;
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
//# sourceMappingURL=VideoCallPresenceService.d.ts.map