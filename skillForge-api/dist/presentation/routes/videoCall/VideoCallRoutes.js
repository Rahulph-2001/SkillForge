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
exports.VideoCallRoutes = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const VideoCallController_1 = require("../../../presentation/controllers/videoCall/VideoCallController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
let VideoCallRoutes = class VideoCallRoutes {
    constructor(videoCallController) {
        this.videoCallController = videoCallController;
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.use(authMiddleware_1.authMiddleware);
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
};
exports.VideoCallRoutes = VideoCallRoutes;
exports.VideoCallRoutes = VideoCallRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.VideoCallController)),
    __metadata("design:paramtypes", [VideoCallController_1.VideoCallController])
], VideoCallRoutes);
//# sourceMappingURL=VideoCallRoutes.js.map