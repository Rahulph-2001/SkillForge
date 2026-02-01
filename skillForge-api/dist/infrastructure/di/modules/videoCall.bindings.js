"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerVideoCallBindings = registerVideoCallBindings;
const types_1 = require("../types");
const VideoCallRoomRepository_1 = require("../../database/repositories/VideoCallRoomRepository");
const VideoCallPresenceService_1 = require("../../services/VideoCallPresenceService");
const VideoCallSignalingService_1 = require("../../services/VideoCallSignalingService");
const VideoCallRoomMapper_1 = require("../../../application/mappers/VideoCallRoomMapper");
const CreateVideoRoomUseCase_1 = require("../../../application/useCases/videoCall/CreateVideoRoomUseCase");
const JoinVideoRoomUseCase_1 = require("../../../application/useCases/videoCall/JoinVideoRoomUseCase");
const LeaveVideoRoomUseCase_1 = require("../../../application/useCases/videoCall/LeaveVideoRoomUseCase");
const GetRoomInfoUseCase_1 = require("../../../application/useCases/videoCall/GetRoomInfoUseCase");
const EndVideoRoomUseCase_1 = require("../../../application/useCases/videoCall/EndVideoRoomUseCase");
const GetSessionInfoUseCase_1 = require("../../../application/useCases/videoCall/GetSessionInfoUseCase");
const ValidateSessionTimeUseCase_1 = require("../../../application/useCases/videoCall/ValidateSessionTimeUseCase");
const VideoCallController_1 = require("../../../presentation/controllers/videoCall/VideoCallController");
const GetInterviewSessionInfoUseCase_1 = require("../../../application/useCases/videoCall/GetInterviewSessionInfoUseCase");
const VideoCallRoutes_1 = require("../../../presentation/routes/videoCall/VideoCallRoutes");
function registerVideoCallBindings(container) {
    container.bind(types_1.TYPES.IVideoCallRoomRepository).to(VideoCallRoomRepository_1.VideoCallRoomRepository).inSingletonScope();
    container.bind(types_1.TYPES.IVideoCallPresenceService).to(VideoCallPresenceService_1.VideoCallPresenceService).inSingletonScope();
    container.bind(types_1.TYPES.IVideoCallSignalingService).to(VideoCallSignalingService_1.VideoCallSignalingService).inSingletonScope();
    container.bind(types_1.TYPES.IVideoCallRoomMapper).to(VideoCallRoomMapper_1.VideoCallRoomMapper).inSingletonScope();
    container.bind(types_1.TYPES.ICreateVideoRoomUseCase).to(CreateVideoRoomUseCase_1.CreateVideoRoomUseCase).inSingletonScope();
    container.bind(types_1.TYPES.IJoinVideoRoomUseCase).to(JoinVideoRoomUseCase_1.JoinVideoRoomUseCase).inSingletonScope();
    container.bind(types_1.TYPES.ILeaveVideoRoomUseCase).to(LeaveVideoRoomUseCase_1.LeaveVideoRoomUseCase).inSingletonScope();
    container.bind(types_1.TYPES.IGetRoomInfoUseCase).to(GetRoomInfoUseCase_1.GetRoomInfoUseCase).inSingletonScope();
    container.bind(types_1.TYPES.IEndVideoRoomUseCase).to(EndVideoRoomUseCase_1.EndVideoRoomUseCase).inSingletonScope();
    container.bind(types_1.TYPES.IGetSessionInfoUseCase).to(GetSessionInfoUseCase_1.GetSessionInfoUseCase).inSingletonScope();
    container.bind(types_1.TYPES.IValidateSessionTimeUseCase).to(ValidateSessionTimeUseCase_1.ValidateSessionTimeUseCase).inSingletonScope();
    container.bind(types_1.TYPES.IGetInterviewSessionInfoUseCase).to(GetInterviewSessionInfoUseCase_1.GetInterviewSessionInfoUseCase).inSingletonScope();
    container.bind(types_1.TYPES.VideoCallController).to(VideoCallController_1.VideoCallController).inSingletonScope();
    container.bind(types_1.TYPES.VideoCallRoutes).to(VideoCallRoutes_1.VideoCallRoutes).inSingletonScope();
}
//# sourceMappingURL=videoCall.bindings.js.map