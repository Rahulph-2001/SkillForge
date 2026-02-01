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
exports.LeaveVideoRoomUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
let LeaveVideoRoomUseCase = class LeaveVideoRoomUseCase {
    constructor(roomRepository, presenceService) {
        this.roomRepository = roomRepository;
        this.presenceService = presenceService;
    }
    async execute(userId, roomId) {
        const room = await this.roomRepository.findById(roomId);
        if (!room)
            throw new AppError_1.NotFoundError('Room not found');
        await this.presenceService.removeParticipant(roomId, userId);
        const count = await this.presenceService.getParticipantCount(roomId);
        if (count === 0) {
            await this.roomRepository.updateStatus(roomId, 'ended', new Date());
            await this.presenceService.clearRoom(roomId);
        }
    }
};
exports.LeaveVideoRoomUseCase = LeaveVideoRoomUseCase;
exports.LeaveVideoRoomUseCase = LeaveVideoRoomUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IVideoCallRoomRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IVideoCallPresenceService)),
    __metadata("design:paramtypes", [Object, Object])
], LeaveVideoRoomUseCase);
//# sourceMappingURL=LeaveVideoRoomUseCase.js.map