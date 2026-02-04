import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { VideoCallController } from '../../../presentation/controllers/videoCall/VideoCallController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { ENDPOINTS } from '../../../config/routes';

@injectable()
export class VideoCallRoutes {
  public readonly router: Router = Router();

  constructor(
    @inject(TYPES.VideoCallController) private videoCallController: VideoCallController
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use(authMiddleware);

    this.router.post(ENDPOINTS.VIDEO_CALL.ROOM, this.videoCallController.createRoom);
    this.router.post(ENDPOINTS.VIDEO_CALL.ROOM_JOIN, this.videoCallController.joinRoom);
    this.router.post(ENDPOINTS.VIDEO_CALL.ROOM_LEAVE, this.videoCallController.leaveRoom);
    this.router.get(ENDPOINTS.VIDEO_CALL.ROOM_BY_ID, this.videoCallController.getRoomInfo);
    this.router.post(ENDPOINTS.VIDEO_CALL.ROOM_END, this.videoCallController.endRoom);

    // Booking specific
    this.router.get(ENDPOINTS.VIDEO_CALL.ROOM_FOR_BOOKING, this.videoCallController.getRoomForBooking);
    this.router.get(ENDPOINTS.VIDEO_CALL.BOOKING_ALIAS, this.videoCallController.getRoomForBooking); // Alias for client compatibility

    this.router.get(ENDPOINTS.VIDEO_CALL.SESSION, this.videoCallController.getSessionInfo);
    this.router.get(ENDPOINTS.VIDEO_CALL.SESSION_INFO, this.videoCallController.getSessionInfo); // Alias for client compatibility

    this.router.get(ENDPOINTS.VIDEO_CALL.SESSION_VALIDATE_TIME, this.videoCallController.validateSessionTime);
    this.router.get(ENDPOINTS.VIDEO_CALL.SESSION_VALIDATE, this.videoCallController.validateSessionTime); // Alias

    // Interview specific
    this.router.get(ENDPOINTS.VIDEO_CALL.INTERVIEW_SESSION, this.videoCallController.getInterviewSessionInfo);
  }
}
