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
exports.VideoCallSignalingService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../di/types");
let VideoCallSignalingService = class VideoCallSignalingService {
    constructor(presenceService, roomRepository) {
        this.presenceService = presenceService;
        this.roomRepository = roomRepository;
        this.io = null;
    }
    initialize(io) {
        this.io = io;
        io.on('connection', (socket) => {
            const userId = socket.data.userId;
            if (!userId) {
                socket.disconnect();
                return;
            }
            socket.on('video:join-room', async ({ roomId }) => {
                try {
                    await this.handleJoinRoom(userId, roomId, socket);
                }
                catch (e) {
                    socket.emit('video:error', { message: e.message });
                }
            });
            socket.on('video:leave-room', async ({ roomId }) => {
                try {
                    await this.handleLeaveRoom(userId, roomId, socket);
                }
                catch (e) {
                    socket.emit('video:error', { message: e.message });
                }
            });
            socket.on('video:offer', ({ roomId, offer, toUserId }) => {
                socket.to(`video:${roomId}`).emit('video:offer', { roomId, offer, fromUserId: userId, toUserId });
            });
            socket.on('video:answer', ({ roomId, answer, toUserId }) => {
                socket.to(`video:${roomId}`).emit('video:answer', { roomId, answer, fromUserId: userId, toUserId });
            });
            socket.on('video:ice-candidate', ({ roomId, candidate, toUserId }) => {
                socket.to(`video:${roomId}`).emit('video:ice-candidate', { roomId, candidate, fromUserId: userId, toUserId });
            });
            socket.on('disconnect', async () => {
                const session = await this.presenceService.getUserSession(userId);
                if (session)
                    await this.handleLeaveRoom(userId, session.roomId, socket);
            });
        });
    }
    async handleJoinRoom(userId, roomId, socket) {
        const room = await this.roomRepository.findById(roomId);
        if (!room || !room.canJoin())
            throw new Error('Room not available');
        await this.presenceService.addParticipant(roomId, userId, socket.id);
        socket.join(`video:${roomId}`);
        const participants = await this.presenceService.getParticipants(roomId);
        socket.to(`video:${roomId}`).emit('video:user-joined', { userId, roomId, participants: participants.map(p => ({ userId: p.userId, joinedAt: p.joinedAt })) });
        socket.emit('video:room-joined', { roomId, participants: participants.map(p => ({ userId: p.userId, joinedAt: p.joinedAt })) });
        if (participants.length === 1 && room.status === 'waiting') {
            await this.roomRepository.updateStatus(roomId, 'active');
        }
    }
    async handleLeaveRoom(userId, roomId, socket) {
        await this.presenceService.removeParticipant(roomId, userId);
        socket.leave(`video:${roomId}`);
        socket.to(`video:${roomId}`).emit('video:user-left', { userId, roomId });
        const count = await this.presenceService.getParticipantCount(roomId);
        if (count === 0) {
            await this.roomRepository.updateStatus(roomId, 'ended', new Date());
            await this.presenceService.clearRoom(roomId);
        }
    }
};
exports.VideoCallSignalingService = VideoCallSignalingService;
exports.VideoCallSignalingService = VideoCallSignalingService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IVideoCallPresenceService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IVideoCallRoomRepository)),
    __metadata("design:paramtypes", [Object, Object])
], VideoCallSignalingService);
//# sourceMappingURL=VideoCallSignalingService.js.map