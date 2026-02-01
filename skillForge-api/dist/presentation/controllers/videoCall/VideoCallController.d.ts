import { Request, Response, NextFunction } from 'express';
import { ICreateVideoRoomUseCase } from '../../../application/useCases/videoCall/interfaces/ICreateVideoRoomUseCase';
import { IJoinVideoRoomUseCase } from '../../../application/useCases/videoCall/interfaces/IJoinVideoRoomUseCase';
import { ILeaveVideoRoomUseCase } from '../../../application/useCases/videoCall/interfaces/ILeaveVideoRoomUseCase';
import { IGetRoomInfoUseCase } from '../../../application/useCases/videoCall/interfaces/IGetRoomInfoUseCase';
import { IEndVideoRoomUseCase } from '../../../application/useCases/videoCall/interfaces/IEndVideoRoomUseCase';
import { IGetSessionInfoUseCase } from '../../../application/useCases/videoCall/interfaces/IGetSessionInfoUseCase';
import { IGetInterviewSessionInfoUseCase } from '../../../application/useCases/videoCall/interfaces/IGetInterviewSessionInfoUseCase';
import { IValidateSessionTimeUseCase } from '../../../application/useCases/videoCall/interfaces/IValidateSessionTimeUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
export declare class VideoCallController {
    private createRoomUseCase;
    private joinRoomUseCase;
    private leaveRoomUseCase;
    private getRoomInfoUseCase;
    private endRoomUseCase;
    private getSessionInfoUseCase;
    private getInterviewSessionInfoUseCase;
    private validateSessionTimeUseCase;
    private responseBuilder;
    constructor(createRoomUseCase: ICreateVideoRoomUseCase, joinRoomUseCase: IJoinVideoRoomUseCase, leaveRoomUseCase: ILeaveVideoRoomUseCase, getRoomInfoUseCase: IGetRoomInfoUseCase, endRoomUseCase: IEndVideoRoomUseCase, getSessionInfoUseCase: IGetSessionInfoUseCase, getInterviewSessionInfoUseCase: IGetInterviewSessionInfoUseCase, validateSessionTimeUseCase: IValidateSessionTimeUseCase, responseBuilder: IResponseBuilder);
    createRoom: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    joinRoom: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    leaveRoom: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getRoomInfo: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getRoomForBooking: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getSessionInfo: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    validateSessionTime: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    endRoom: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getInterviewSessionInfo: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=VideoCallController.d.ts.map