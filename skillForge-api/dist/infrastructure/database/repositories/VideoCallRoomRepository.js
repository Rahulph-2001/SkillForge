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
exports.VideoCallRoomRepository = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../di/types");
const Database_1 = require("../Database");
const VideoCallRoom_1 = require("../../../domain/entities/VideoCallRoom");
let VideoCallRoomRepository = class VideoCallRoomRepository {
    constructor(db) {
        this.db = db;
    }
    get prisma() { return this.db.getClient(); }
    async create(room) {
        const data = await this.prisma.videoCallRoom.create({
            data: { id: room.id, roomCode: room.roomCode, bookingId: room.bookingId, interviewId: room.interviewId, hostId: room.hostId, status: room.status }
        });
        return this.toDomain(data);
    }
    async findById(roomId) {
        const data = await this.prisma.videoCallRoom.findUnique({ where: { id: roomId } });
        return data ? this.toDomain(data) : null;
    }
    async findByBookingId(bookingId) {
        const data = await this.prisma.videoCallRoom.findUnique({ where: { bookingId } });
        return data ? this.toDomain(data) : null;
    }
    async findByInterviewId(interviewId) {
        const data = await this.prisma.videoCallRoom.findUnique({ where: { interviewId } });
        return data ? this.toDomain(data) : null;
    }
    async findByRoomCode(roomCode) {
        const data = await this.prisma.videoCallRoom.findUnique({ where: { roomCode } });
        return data ? this.toDomain(data) : null;
    }
    async findActiveByHostId(hostId) {
        const data = await this.prisma.videoCallRoom.findFirst({
            where: { hostId, status: { in: ['waiting', 'active'] } },
            orderBy: { createdAt: 'desc' }
        });
        return data ? this.toDomain(data) : null;
    }
    async updateStatus(roomId, status, endedAt) {
        const data = await this.prisma.videoCallRoom.update({
            where: { id: roomId },
            data: { status, endedAt: endedAt || null }
        });
        return this.toDomain(data);
    }
    toDomain(data) {
        return new VideoCallRoom_1.VideoCallRoom({
            id: data.id, roomCode: data.roomCode, bookingId: data.bookingId, interviewId: data.interviewId,
            hostId: data.hostId, status: data.status, createdAt: data.createdAt, endedAt: data.endedAt
        });
    }
};
exports.VideoCallRoomRepository = VideoCallRoomRepository;
exports.VideoCallRoomRepository = VideoCallRoomRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __metadata("design:paramtypes", [Database_1.Database])
], VideoCallRoomRepository);
//# sourceMappingURL=VideoCallRoomRepository.js.map