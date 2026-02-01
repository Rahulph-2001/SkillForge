import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { VideoCallController } from '../../../presentation/controllers/videoCall/VideoCallController';
import { authMiddleware } from '../../middlewares/authMiddleware';

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

    this.router.post('/room', this.videoCallController.createRoom);
    this.router.post('/room/join', this.videoCallController.joinRoom);
    this.router.post('/room/:roomId/leave', this.videoCallController.leaveRoom);
    this.router.get('/room/:roomId', this.videoCallController.getRoomInfo);
    this.router.post('/room/:roomId/end', this.videoCallController.endRoom);

    // Booking specific
    this.router.get('/room/booking/:bookingId', this.videoCallController.getRoomForBooking);
    this.router.get('/booking/:bookingId', this.videoCallController.getRoomForBooking); // Alias for client compatibility

    this.router.get('/session/:bookingId', this.videoCallController.getSessionInfo);
    this.router.get('/session/:bookingId/info', this.videoCallController.getSessionInfo); // Alias for client compatibility

    this.router.get('/session/:bookingId/validate-time', this.videoCallController.validateSessionTime);
    this.router.get('/session/:bookingId/validate', this.videoCallController.validateSessionTime); // Alias

    // Interview specific
    this.router.get('/session/interview/:interviewId', this.videoCallController.getInterviewSessionInfo);
  }
}