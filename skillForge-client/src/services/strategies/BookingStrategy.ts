import { videoCallService, SessionInfo, SessionTimeValidation, VideoCallRoom } from '../videoCallService';
import { IVideoCallStrategy } from './IVideoCallStrategy';

export class BookingStrategy implements IVideoCallStrategy {
    async getSessionInfo(id: string): Promise<SessionInfo> {
        return await videoCallService.getSessionInfo(id);
    }

    async getRoom(id: string): Promise<VideoCallRoom> {
        return await videoCallService.getRoomForBooking(id);
    }

    async validateTime(id: string): Promise<SessionTimeValidation | null> {
        return await videoCallService.validateSessionTime(id);
    }
}
