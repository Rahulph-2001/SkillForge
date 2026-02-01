"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoCallController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const messages_1 = require("../../../config/messages");
const HttpStatusCode_1 = require("../../../domain/enums/HttpStatusCode");
let VideoCallController = class VideoCallController {
    constructor(createRoomUseCase, joinRoomUseCase, leaveRoomUseCase, getRoomInfoUseCase, endRoomUseCase, getSessionInfoUseCase, getInterviewSessionInfoUseCase, validateSessionTimeUseCase, responseBuilder) {
        this.createRoomUseCase = createRoomUseCase;
        this.joinRoomUseCase = joinRoomUseCase;
        this.leaveRoomUseCase = leaveRoomUseCase;
        this.getRoomInfoUseCase = getRoomInfoUseCase;
        this.endRoomUseCase = endRoomUseCase;
        this.getSessionInfoUseCase = getSessionInfoUseCase;
        this.getInterviewSessionInfoUseCase = getInterviewSessionInfoUseCase;
        this.validateSessionTimeUseCase = validateSessionTimeUseCase;
        this.responseBuilder = responseBuilder;
        this.createRoom = async (req, res, next) => {
            try {
                const room = await this.createRoomUseCase.execute(req.user.id, req.body);
                const response = this.responseBuilder.success(room, messages_1.SUCCESS_MESSAGES.VIDEO_CALL.ROOM_CREATED, HttpStatusCode_1.HttpStatusCode.CREATED);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.joinRoom = async (req, res, next) => {
            try {
                const room = await this.joinRoomUseCase.execute(req.user.id, req.body);
                const response = this.responseBuilder.success(room, messages_1.SUCCESS_MESSAGES.VIDEO_CALL.JOINED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.leaveRoom = async (req, res, next) => {
            try {
                await this.leaveRoomUseCase.execute(req.user.id, req.params.roomId);
                const response = this.responseBuilder.success(null, messages_1.SUCCESS_MESSAGES.VIDEO_CALL.LEFT, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.getRoomInfo = async (req, res, next) => {
            try {
                const room = await this.getRoomInfoUseCase.execute(req.user.id, req.params.roomId);
                const response = this.responseBuilder.success(room, 'Room info retrieved', HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.getRoomForBooking = async (req, res, next) => {
            try {
                // Create or get existing room
                const room = await this.createRoomUseCase.execute(req.user.id, { bookingId: req.params.bookingId });
                // Also call joinRoom to update booking status to IN_SESSION (blocks cancel/reschedule)
                console.log(`[VideoCallController] Calling joinRoomUseCase for booking ${req.params.bookingId}`);
                await this.joinRoomUseCase.execute(req.user.id, { bookingId: req.params.bookingId });
                console.log(`[VideoCallController] joinRoomUseCase completed for booking ${req.params.bookingId}`);
                const response = this.responseBuilder.success(room, messages_1.SUCCESS_MESSAGES.VIDEO_CALL.ROOM_CREATED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.getSessionInfo = async (req, res, next) => {
            try {
                const info = await this.getSessionInfoUseCase.execute(req.params.bookingId);
                const response = this.responseBuilder.success(info, 'Session info retrieved', HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.validateSessionTime = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const { bookingId } = req.params;
                const result = await this.validateSessionTimeUseCase.execute(userId, bookingId);
                const response = this.responseBuilder.success(result, messages_1.SUCCESS_MESSAGES.SESSION.TIME_VALIDATED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.endRoom = async (req, res, next) => {
            try {
                await this.endRoomUseCase.execute(req.user.id, req.params.roomId);
                const response = this.responseBuilder.success(null, messages_1.SUCCESS_MESSAGES.VIDEO_CALL.ENDED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.getInterviewSessionInfo = async (req, res, next) => {
            try {
                const info = await this.getInterviewSessionInfoUseCase.execute(req.params.interviewId);
                const response = this.responseBuilder.success(info, 'Session info retrieved', HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
    }
};
exports.VideoCallController = VideoCallController;
exports.VideoCallController = VideoCallController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ICreateVideoRoomUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IJoinVideoRoomUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.ILeaveVideoRoomUseCase)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IGetRoomInfoUseCase)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IEndVideoRoomUseCase)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.IGetSessionInfoUseCase)),
    __param(6, (0, inversify_1.inject)(types_1.TYPES.IGetInterviewSessionInfoUseCase)),
    __param(7, (0, inversify_1.inject)(types_1.TYPES.IValidateSessionTimeUseCase)),
    __param(8, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object])
], VideoCallController);
//# sourceMappingURL=VideoCallController.js.map