"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketService = void 0;
const inversify_1 = require("inversify");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
let WebSocketService = class WebSocketService {
    constructor() {
        this.io = null;
        this.userSockets = new Map(); // userId -> Set of socketIds
        this.communitySockets = new Map(); // communityId -> Set of socketIds
    }
    initialize(io) {
        this.io = io;
        // Middleware for Authentication
        this.io.use((socket, next) => {
            const token = socket.handshake.auth.token || socket.handshake.headers.cookie?.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
            if (!token) {
                return next(new Error('Authentication error'));
            }
            try {
                const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
                socket.data.user = decoded;
                next();
            }
            catch (err) {
                next(new Error('Authentication error'));
            }
        });
        this.io.on('connection', (socket) => {
            const user = socket.data.user;
            console.log(`WebSocket connected: ${socket.id} (User: ${user.userId})`);
            // Auto-join user to their own room for direct notifications
            if (user.userId) {
                if (!this.userSockets.has(user.userId)) {
                    this.userSockets.set(user.userId, new Set());
                }
                this.userSockets.get(user.userId)?.add(socket.id);
            }
            socket.on('join_community', (communityId) => {
                // Frontend sends string ID directly
                if (user.userId && communityId) {
                    this.joinCommunity(user.userId, communityId, socket.id);
                    socket.join(`community:${communityId}`);
                    console.log(`User ${user.userId} joined community channel: ${communityId}`);
                }
            });
            socket.on('leave_community', (communityId) => {
                if (user.userId && communityId) {
                    this.leaveCommunity(user.userId, communityId, socket.id);
                    socket.leave(`community:${communityId}`);
                    console.log(`User ${user.userId} left community channel: ${communityId}`);
                }
            });
            socket.on('disconnect', () => {
                this.handleDisconnect(socket.id);
            });
        });
    }
    sendToCommunity(communityId, message) {
        if (!this.io)
            return;
        // Map internal event structure to frontend's expected events
        if (message.type === 'message') {
            this.io.to(`community:${communityId}`).emit('new_message', message.data);
        }
        else if (message.type === 'pin') {
            this.io.to(`community:${communityId}`).emit('message_pinned', message.data);
        }
        else if (message.type === 'unpin') {
            this.io.to(`community:${communityId}`).emit('message_unpinned', message.data);
        }
        else if (message.type === 'delete') {
            this.io.to(`community:${communityId}`).emit('message_deleted', message.data);
        }
        else if (message.type === 'reaction_added') {
            this.io.to(`community:${communityId}`).emit('reaction_added', message.data);
        }
        else if (message.type === 'reaction_removed') {
            this.io.to(`community:${communityId}`).emit('reaction_removed', message.data);
        }
        else {
            // Fallback for other events
            this.io.to(`community:${communityId}`).emit('community_event', message);
        }
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
    leaveCommunity(_userId, communityId, socketId) {
        if (socketId) {
            this.communitySockets.get(communityId)?.delete(socketId);
            // We don't remove from userSockets on leave_community, only on disconnect
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
        console.log(`WebSocket disconnected: ${socketId}`);
    }
};
exports.WebSocketService = WebSocketService;
exports.WebSocketService = WebSocketService = __decorate([
    (0, inversify_1.injectable)()
], WebSocketService);
//# sourceMappingURL=WebSocketService.js.map