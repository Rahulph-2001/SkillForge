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
exports.VideoCallPresenceService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../di/types");
const RedisService_1 = require("./RedisService");
let VideoCallPresenceService = class VideoCallPresenceService {
    constructor(redis) {
        this.redis = redis;
        this.TTL = 86400;
    }
    roomKey(roomId) { return `video:room:${roomId}:participants`; }
    userKey(userId) { return `video:user:${userId}`; }
    async addParticipant(roomId, userId, socketId) {
        const client = this.redis.getClient();
        await client.hset(this.roomKey(roomId), userId, JSON.stringify({ userId, socketId, joinedAt: new Date().toISOString() }));
        await client.expire(this.roomKey(roomId), this.TTL);
        await this.setUserSession(userId, roomId, socketId);
    }
    async removeParticipant(roomId, userId) {
        await this.redis.getClient().hdel(this.roomKey(roomId), userId);
        await this.clearUserSession(userId);
    }
    async getParticipants(roomId) {
        const data = await this.redis.getClient().hgetall(this.roomKey(roomId));
        return Object.values(data).map(p => { const x = JSON.parse(p); return { userId: x.userId, socketId: x.socketId, joinedAt: new Date(x.joinedAt) }; });
    }
    async getParticipantCount(roomId) {
        return await this.redis.getClient().hlen(this.roomKey(roomId));
    }
    async isUserInRoom(roomId, userId) {
        const result = await this.redis.getClient().hexists(this.roomKey(roomId), userId);
        return result === 1;
    }
    async setUserSession(userId, roomId, socketId) {
        const client = this.redis.getClient();
        await client.set(this.userKey(userId), JSON.stringify({ roomId, socketId }));
        await client.expire(this.userKey(userId), this.TTL);
    }
    async getUserSession(userId) {
        const data = await this.redis.getClient().get(this.userKey(userId));
        return data ? JSON.parse(data) : null;
    }
    async clearUserSession(userId) {
        await this.redis.getClient().del(this.userKey(userId));
    }
    async clearRoom(roomId) {
        await this.redis.getClient().del(this.roomKey(roomId));
    }
};
exports.VideoCallPresenceService = VideoCallPresenceService;
exports.VideoCallPresenceService = VideoCallPresenceService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.RedisService)),
    __metadata("design:paramtypes", [RedisService_1.RedisService])
], VideoCallPresenceService);
//# sourceMappingURL=VideoCallPresenceService.js.map