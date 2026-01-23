import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { VideoCallController } from '../../controllers/videoCall/VideoCallController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { validateBody } from '../../middlewares/validationMiddleware';
import { CreateVideoRoomSchema } from '../../../application/dto/videoCall/CreateVideoRoomDTO';
import { JoinVideoRoomSchema } from '../../../application/dto/videoCall/JoinVideoRoomDTO';

@injectable()
export class VideoCallRoutes {
  public readonly router: Router = Router();

  constructor(@inject(TYPES.VideoCallController) private controller: VideoCallController) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use(authMiddleware);
    this.router.post('/rooms', validateBody(CreateVideoRoomSchema), this.controller.createRoom);
    this.router.post('/rooms/join', validateBody(JoinVideoRoomSchema), this.controller.joinRoom);
    this.router.get('/rooms/:roomId', this.controller.getRoomInfo);
    this.router.post('/rooms/:roomId/leave', this.controller.leaveRoom);
    this.router.post('/rooms/:roomId/end', this.controller.endRoom);
    this.router.get('/booking/:bookingId', this.controller.getRoomForBooking);
    this.router.get('/session/:bookingId/info', this.controller.getSessionInfo);
  }
}