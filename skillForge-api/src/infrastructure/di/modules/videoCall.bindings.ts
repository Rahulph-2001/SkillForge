import { Container } from 'inversify';
import { TYPES } from '../types';
import { IVideoCallRoomRepository } from '../../../domain/repositories/IVideoCallRoomRepository';
import { VideoCallRoomRepository } from '../../database/repositories/VideoCallRoomRepository';
import { IVideoCallPresenceService } from '../../../domain/services/IVideoCallPresenceService';
import { VideoCallPresenceService } from '../../services/VideoCallPresenceService';
import { IVideoCallSignalingService } from '../../../domain/services/IVideoCallSignalingService';
import { VideoCallSignalingService } from '../../services/VideoCallSignalingService';
import { IVideoCallRoomMapper } from '../../../application/mappers/interfaces/IVideoCallRoomMapper';
import { VideoCallRoomMapper } from '../../../application/mappers/VideoCallRoomMapper';
import { ICreateVideoRoomUseCase } from '../../../application/useCases/videoCall/interfaces/ICreateVideoRoomUseCase';
import { CreateVideoRoomUseCase } from '../../../application/useCases/videoCall/CreateVideoRoomUseCase';
import { IJoinVideoRoomUseCase } from '../../../application/useCases/videoCall/interfaces/IJoinVideoRoomUseCase';
import { JoinVideoRoomUseCase } from '../../../application/useCases/videoCall/JoinVideoRoomUseCase';
import { ILeaveVideoRoomUseCase } from '../../../application/useCases/videoCall/interfaces/ILeaveVideoRoomUseCase';
import { LeaveVideoRoomUseCase } from '../../../application/useCases/videoCall/LeaveVideoRoomUseCase';
import { IGetRoomInfoUseCase } from '../../../application/useCases/videoCall/interfaces/IGetRoomInfoUseCase';
import { GetRoomInfoUseCase } from '../../../application/useCases/videoCall/GetRoomInfoUseCase';
import { IEndVideoRoomUseCase } from '../../../application/useCases/videoCall/interfaces/IEndVideoRoomUseCase';
import { EndVideoRoomUseCase } from '../../../application/useCases/videoCall/EndVideoRoomUseCase';
import { IGetSessionInfoUseCase } from '../../../application/useCases/videoCall/interfaces/IGetSessionInfoUseCase';
import { GetSessionInfoUseCase } from '../../../application/useCases/videoCall/GetSessionInfoUseCase';
import { VideoCallController } from '../../../presentation/controllers/videoCall/VideoCallController';
import { VideoCallRoutes } from '../../../presentation/routes/videoCall/VideoCallRoutes';

export function registerVideoCallBindings(container: Container): void {
  container.bind<IVideoCallRoomRepository>(TYPES.IVideoCallRoomRepository).to(VideoCallRoomRepository).inSingletonScope();
  container.bind<IVideoCallPresenceService>(TYPES.IVideoCallPresenceService).to(VideoCallPresenceService).inSingletonScope();
  container.bind<IVideoCallSignalingService>(TYPES.IVideoCallSignalingService).to(VideoCallSignalingService).inSingletonScope();
  container.bind<IVideoCallRoomMapper>(TYPES.IVideoCallRoomMapper).to(VideoCallRoomMapper).inSingletonScope();
  container.bind<ICreateVideoRoomUseCase>(TYPES.ICreateVideoRoomUseCase).to(CreateVideoRoomUseCase).inSingletonScope();
  container.bind<IJoinVideoRoomUseCase>(TYPES.IJoinVideoRoomUseCase).to(JoinVideoRoomUseCase).inSingletonScope();
  container.bind<ILeaveVideoRoomUseCase>(TYPES.ILeaveVideoRoomUseCase).to(LeaveVideoRoomUseCase).inSingletonScope();
  container.bind<IGetRoomInfoUseCase>(TYPES.IGetRoomInfoUseCase).to(GetRoomInfoUseCase).inSingletonScope();
  container.bind<IEndVideoRoomUseCase>(TYPES.IEndVideoRoomUseCase).to(EndVideoRoomUseCase).inSingletonScope();
  container.bind<IGetSessionInfoUseCase>(TYPES.IGetSessionInfoUseCase).to(GetSessionInfoUseCase).inSingletonScope();
  container.bind<VideoCallController>(TYPES.VideoCallController).to(VideoCallController).inSingletonScope();
  container.bind<VideoCallRoutes>(TYPES.VideoCallRoutes).to(VideoCallRoutes).inSingletonScope();
}