import { videoCallService, SessionInfo, SessionTimeValidation, VideoCallRoom } from '../videoCallService';
import { IVideoCallStrategy } from './IVideoCallStrategy';

export class InterviewStrategy implements IVideoCallStrategy {
    async getSessionInfo(id: string): Promise<SessionInfo> {
        return await videoCallService.getInterviewSessionInfo(id);
    }

    async getRoom(id: string): Promise<VideoCallRoom> {
        // Interviews are room-based (via link) or we fetch session info which has the link.
        // For now, we assume joining via room code or similar flow.
        // However, the interface requires getRoom.
        // If the flow is different, we might need to adapt.
        // Based on previous analysis, interviews use session info to get a meeting link/room code.
        const session = await this.getSessionInfo(id);
        // We might need a method to join by code if we don't have a direct "getRoomForInterview" endpoint yet.
        // But let's assume we can use the specific logic or reuse joinRoom.
        // Actually, for consistency, let's just throw or return null if not applicable, 
        // OR better, implement logic to finding the room via the link/code from session info.
        if (session.meetingLink) {
            return await videoCallService.joinRoom({ roomCode: session.meetingLink });
        }
        throw new Error("Interview room not ready");
    }

    async validateTime(_id: string): Promise<SessionTimeValidation | null> {
        // Interviews might have different or no strict backend validation endpoint yet.
        // Returning null signifies no validation needed or handled differently.
        return null;
    }
}
