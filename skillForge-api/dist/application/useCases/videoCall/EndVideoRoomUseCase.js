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
exports.EndVideoRoomUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
let EndVideoRoomUseCase = class EndVideoRoomUseCase {
    constructor(roomRepository, presenceService, interviewRepository) {
        this.roomRepository = roomRepository;
        this.presenceService = presenceService;
        this.interviewRepository = interviewRepository;
    }
    async execute(userId, roomId) {
        console.log(`[EndVideoRoomUseCase] Executing for user ${userId} room ${roomId}`);
        const room = await this.roomRepository.findById(roomId);
        if (!room) {
            console.error(`[EndVideoRoomUseCase] Room ${roomId} not found`);
            throw new AppError_1.NotFoundError('Room not found');
        }
        console.log(`[EndVideoRoomUseCase] Room found. Host: ${room.hostId}, InterviewId: ${room.interviewId}, Status: ${room.status}`);
        if (!room.isHost(userId)) {
            console.error(`[EndVideoRoomUseCase] User ${userId} is not host ${room.hostId}`);
            throw new AppError_1.ForbiddenError('Only host can end the call');
        }
        // Update Room Status
        await this.roomRepository.updateStatus(roomId, 'ended', new Date());
        await this.presenceService.clearRoom(roomId);
        console.log(`[EndVideoRoomUseCase] Room marked as ended`);
        // If it's an interview room, complete the interview
        if (room.interviewId) {
            console.log(`[EndVideoRoomUseCase] Room is linked to interview ${room.interviewId}. Updating interview status.`);
            const interview = await this.interviewRepository.findById(room.interviewId);
            if (interview) {
                interview.complete();
                await this.interviewRepository.update(interview);
                console.log(`[EndVideoRoomUseCase] Interview ${interview.id} status updated to COMPLETED`);
            }
            else {
                console.warn(`[EndVideoRoomUseCase] Linked interview ${room.interviewId} not found in DB`);
            }
        }
        else {
            console.log(`[EndVideoRoomUseCase] No interview linked to this room.`);
        }
    }
};
exports.EndVideoRoomUseCase = EndVideoRoomUseCase;
exports.EndVideoRoomUseCase = EndVideoRoomUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IVideoCallRoomRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IVideoCallPresenceService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IInterviewRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], EndVideoRoomUseCase);
//# sourceMappingURL=EndVideoRoomUseCase.js.map