import { type SessionInfo, type SessionTimeValidation, type VideoCallRoom } from '../videoCallService';

export interface IVideoCallStrategy {
    getSessionInfo(id: string): Promise<SessionInfo>;
    getRoom(id: string): Promise<VideoCallRoom>;
    validateTime(id: string): Promise<SessionTimeValidation | null>;
}
