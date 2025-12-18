"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketService = void 0;
const inversify_1 = require("inversify");
let WebSocketService = class WebSocketService {
    constructor() {
        this.io = null;
        this.userSockets = new Map(); // userId -> Set of socketIds
        this.communitySockets = new Map(); // communityId -> Set of socketIds
    }
    initialize(io) {
        this.io = io;
        this.io.on('connection', (socket) => {
            console.log('WebSocket connected:', socket.id);
            socket.on('join_community', (data) => {
                this.joinCommunity(data.userId, data.communityId, socket.id);
                socket.join(`community:${data.communityId}`);
            });
            socket.on('leave_community', (data) => {
                this.leaveCommunity(data.userId, data.communityId, socket.id);
                socket.leave(`community:${data.communityId}`);
            });
            socket.on('disconnect', () => {
                this.handleDisconnect(socket.id);
            });
        });
    }
    sendToCommunity(communityId, message) {
        if (!this.io)
            return;
        this.io.to(`community:${communityId}`).emit('community_event', message);
    }
    sendToUser(userId, message) {
        if (!this.io)
            return;
        const socketIds = this.userSockets.get(userId);
        if (socketIds) {
            socketIds.forEach(socketId => {
                this.io?.to(socketId).emit('user_event', message);
            });
        }
    }
    joinCommunity(userId, communityId, socketId) {
        if (socketId) {
            if (!this.communitySockets.has(communityId)) {
                this.communitySockets.set(communityId, new Set());
            }
            this.communitySockets.get(communityId)?.add(socketId);
            if (!this.userSockets.has(userId)) {
                this.userSockets.set(userId, new Set());
            }
            this.userSockets.get(userId)?.add(socketId);
        }
    }
    leaveCommunity(userId, communityId, socketId) {
        if (socketId) {
            this.communitySockets.get(communityId)?.delete(socketId);
            this.userSockets.get(userId)?.delete(socketId);
        }
    }
    handleDisconnect(socketId) {
        // Clean up all mappings for this socket
        this.communitySockets.forEach((sockets) => {
            sockets.delete(socketId);
        });
        this.userSockets.forEach((sockets) => {
            sockets.delete(socketId);
        });
    }
};
exports.WebSocketService = WebSocketService;
exports.WebSocketService = WebSocketService = __decorate([
    (0, inversify_1.injectable)()
], WebSocketService);
//# sourceMappingURL=WebSocketService.js.map