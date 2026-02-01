"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoCallRoomMapper = void 0;
const inversify_1 = require("inversify");
let VideoCallRoomMapper = class VideoCallRoomMapper {
    toResponseDTO(room, participants, iceServers) {
        return {
            id: room.id,
            roomCode: room.roomCode,
            bookingId: room.bookingId,
            hostId: room.hostId,
            status: room.status,
            participants,
            iceServers,
            createdAt: room.createdAt,
            endedAt: room.endedAt,
        };
    }
};
exports.VideoCallRoomMapper = VideoCallRoomMapper;
exports.VideoCallRoomMapper = VideoCallRoomMapper = __decorate([
    (0, inversify_1.injectable)()
], VideoCallRoomMapper);
//# sourceMappingURL=VideoCallRoomMapper.js.map