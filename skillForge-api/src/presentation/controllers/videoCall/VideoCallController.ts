import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICreateVideoRoomUseCase } from '../../../application/useCases/videoCall/interfaces/ICreateVideoRoomUseCase';
import { IJoinVideoRoomUseCase } from '../../../application/useCases/videoCall/interfaces/IJoinVideoRoomUseCase';
import { ILeaveVideoRoomUseCase } from '../../../application/useCases/videoCall/interfaces/ILeaveVideoRoomUseCase';
import { IGetRoomInfoUseCase } from '../../../application/useCases/videoCall/interfaces/IGetRoomInfoUseCase';
import { IEndVideoRoomUseCase } from '../../../application/useCases/videoCall/interfaces/IEndVideoRoomUseCase';
import { IGetSessionInfoUseCase } from '../../../application/useCases/videoCall/interfaces/IGetSessionInfoUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { SUCCESS_MESSAGES } from '../../../config/messages';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';

@injectable()
export class VideoCallController {
  constructor(
    @inject(TYPES.ICreateVideoRoomUseCase) private createRoomUseCase: ICreateVideoRoomUseCase,
    @inject(TYPES.IJoinVideoRoomUseCase) private joinRoomUseCase: IJoinVideoRoomUseCase,
    @inject(TYPES.ILeaveVideoRoomUseCase) private leaveRoomUseCase: ILeaveVideoRoomUseCase,
    @inject(TYPES.IGetRoomInfoUseCase) private getRoomInfoUseCase: IGetRoomInfoUseCase,
    @inject(TYPES.IEndVideoRoomUseCase) private endRoomUseCase: IEndVideoRoomUseCase,
    @inject(TYPES.IGetSessionInfoUseCase) private getSessionInfoUseCase: IGetSessionInfoUseCase,
    @inject(TYPES.IResponseBuilder) private responseBuilder: IResponseBuilder
  ) { }

  createRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const room = await this.createRoomUseCase.execute(req.user!.id, req.body);
      const response = this.responseBuilder.success(room, SUCCESS_MESSAGES.VIDEO_CALL.ROOM_CREATED, HttpStatusCode.CREATED);
      res.status(response.statusCode).json(response.body);
    } catch (error) { next(error); }
  };

  joinRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const room = await this.joinRoomUseCase.execute(req.user!.id, req.body);
      const response = this.responseBuilder.success(room, SUCCESS_MESSAGES.VIDEO_CALL.JOINED, HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error) { next(error); }
  };

  leaveRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.leaveRoomUseCase.execute(req.user!.id, req.params.roomId);
      const response = this.responseBuilder.success(null, SUCCESS_MESSAGES.VIDEO_CALL.LEFT, HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error) { next(error); }
  };

  getRoomInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const room = await this.getRoomInfoUseCase.execute(req.user!.id, req.params.roomId);
      const response = this.responseBuilder.success(room, 'Room info retrieved', HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error) { next(error); }
  };

  getRoomForBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('[VideoCallController] getRoomForBooking called');
      console.log('[VideoCallController] bookingId:', req.params.bookingId);
      console.log('[VideoCallController] userId:', req.user?.id);
      const room = await this.createRoomUseCase.execute(req.user!.id, { bookingId: req.params.bookingId });
      console.log('[VideoCallController] Room created/retrieved:', room);
      const response = this.responseBuilder.success(room, SUCCESS_MESSAGES.VIDEO_CALL.ROOM_CREATED, HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      console.error('[VideoCallController] getRoomForBooking ERROR:', error);
      next(error);
    }
  };

  getSessionInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('[VideoCallController] getSessionInfo called');
      console.log('[VideoCallController] bookingId:', req.params.bookingId);
      const info = await this.getSessionInfoUseCase.execute(req.params.bookingId);
      console.log('[VideoCallController] Session info retrieved:', info);
      const response = this.responseBuilder.success(info, 'Session info retrieved', HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      console.error('[VideoCallController] getSessionInfo ERROR:', error);
      next(error);
    }
  };

  endRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.endRoomUseCase.execute(req.user!.id, req.params.roomId);
      const response = this.responseBuilder.success(null, SUCCESS_MESSAGES.VIDEO_CALL.ENDED, HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error) { next(error); }
  };
}