import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICreateVideoRoomUseCase } from '../../../application/useCases/videoCall/interfaces/ICreateVideoRoomUseCase';
import { IJoinVideoRoomUseCase } from '../../../application/useCases/videoCall/interfaces/IJoinVideoRoomUseCase';
import { ILeaveVideoRoomUseCase } from '../../../application/useCases/videoCall/interfaces/ILeaveVideoRoomUseCase';
import { IGetRoomInfoUseCase } from '../../../application/useCases/videoCall/interfaces/IGetRoomInfoUseCase';
import { IEndVideoRoomUseCase } from '../../../application/useCases/videoCall/interfaces/IEndVideoRoomUseCase';
import { IGetSessionInfoUseCase } from '../../../application/useCases/videoCall/interfaces/IGetSessionInfoUseCase';
import { IGetInterviewSessionInfoUseCase } from '../../../application/useCases/videoCall/interfaces/IGetInterviewSessionInfoUseCase';
import { IValidateSessionTimeUseCase } from '../../../application/useCases/videoCall/interfaces/IValidateSessionTimeUseCase';
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
    @inject(TYPES.IGetInterviewSessionInfoUseCase) private getInterviewSessionInfoUseCase: IGetInterviewSessionInfoUseCase,
    @inject(TYPES.IValidateSessionTimeUseCase) private validateSessionTimeUseCase: IValidateSessionTimeUseCase,
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
      // Create or get existing room
      const room = await this.createRoomUseCase.execute(req.user!.id, { bookingId: req.params.bookingId });

      // Also call joinRoom to update booking status to IN_SESSION (blocks cancel/reschedule)
      console.log(`[VideoCallController] Calling joinRoomUseCase for booking ${req.params.bookingId}`);
      await this.joinRoomUseCase.execute(req.user!.id, { bookingId: req.params.bookingId });
      console.log(`[VideoCallController] joinRoomUseCase completed for booking ${req.params.bookingId}`);

      const response = this.responseBuilder.success(room, SUCCESS_MESSAGES.VIDEO_CALL.ROOM_CREATED, HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error) { next(error); }
  };

  getSessionInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const info = await this.getSessionInfoUseCase.execute(req.params.bookingId);
      const response = this.responseBuilder.success(info, 'Session info retrieved', HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error) { next(error); }
  };

  validateSessionTime = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { bookingId } = req.params;
      const result = await this.validateSessionTimeUseCase.execute(userId, bookingId);
      const response = this.responseBuilder.success(result, SUCCESS_MESSAGES.SESSION.TIME_VALIDATED, HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error) { next(error); }
  };

  endRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.endRoomUseCase.execute(req.user!.id, req.params.roomId);
      const response = this.responseBuilder.success(null, SUCCESS_MESSAGES.VIDEO_CALL.ENDED, HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error) { next(error); }
  };

  getInterviewSessionInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const info = await this.getInterviewSessionInfoUseCase.execute(req.params.interviewId);
      const response = this.responseBuilder.success(info, 'Session info retrieved', HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error) { next(error); }
  };
}