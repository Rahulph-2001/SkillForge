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
exports.CreateVideoRoomUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const VideoCallRoom_1 = require("../../../domain/entities/VideoCallRoom");
const AppError_1 = require("../../../domain/errors/AppError");
const Booking_1 = require("../../../domain/entities/Booking");
const env_1 = require("../../../config/env");
let CreateVideoRoomUseCase = class CreateVideoRoomUseCase {
    constructor(roomRepository, bookingRepository, roomMapper) {
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
        this.roomMapper = roomMapper;
    }
    async execute(userId, dto) {
        if (dto.bookingId) {
            const booking = await this.bookingRepository.findById(dto.bookingId);
            if (!booking)
                throw new AppError_1.NotFoundError('Booking not found');
            if (booking.providerId !== userId && booking.learnerId !== userId) {
                throw new AppError_1.ForbiddenError('Not authorized to create room for this booking');
            }
            // Allow CONFIRMED or IN_SESSION (for rejoining)
            if (booking.status !== Booking_1.BookingStatus.CONFIRMED && booking.status !== Booking_1.BookingStatus.IN_SESSION) {
                throw new AppError_1.ValidationError('Booking must be confirmed or in session to start a video call');
            }
            // Check for existing room
            const existingRoom = await this.roomRepository.findByBookingId(dto.bookingId);
            if (existingRoom) {
                // If room exists but is ended, reactivate it
                if (existingRoom.status === 'ended') {
                    const reactivatedRoom = await this.roomRepository.updateStatus(existingRoom.id, 'waiting');
                    return this.roomMapper.toResponseDTO(reactivatedRoom, [], this.getIceServers());
                }
                // Return existing active/waiting room
                return this.roomMapper.toResponseDTO(existingRoom, [], this.getIceServers());
            }
        }
        else if (dto.interviewId) {
            // Interview logic
            // We typically create the room when scheduling, but if we need to create/re-create here:
            const existingRoom = await this.roomRepository.findByInterviewId(dto.interviewId);
            if (existingRoom) {
                if (existingRoom.status === 'ended') {
                    const reactivatedRoom = await this.roomRepository.updateStatus(existingRoom.id, 'waiting');
                    return this.roomMapper.toResponseDTO(reactivatedRoom, [], this.getIceServers());
                }
                return this.roomMapper.toResponseDTO(existingRoom, [], this.getIceServers());
            }
            // If creating new for interview, ensure authorized? 
            // We might want to implicitly trust the caller if they have access to the interview ID? 
            // Or fetch interview and check host.
            // For now, let's allow creation if it doesn't exist, passing interviewId.
        }
        // Create new room only if no existing room for this booking
        const room = new VideoCallRoom_1.VideoCallRoom({ hostId: userId, bookingId: dto.bookingId });
        const createdRoom = await this.roomRepository.create(room);
        return this.roomMapper.toResponseDTO(createdRoom, [], this.getIceServers());
    }
    getIceServers() {
        const servers = [{ urls: env_1.env.STUN_SERVER || 'stun:stun.l.google.com:19302' }];
        if (env_1.env.TURN_SERVER) {
            servers.push({ urls: env_1.env.TURN_SERVER, username: env_1.env.TURN_USERNAME, credential: env_1.env.TURN_CREDENTIAL });
        }
        return servers;
    }
};
exports.CreateVideoRoomUseCase = CreateVideoRoomUseCase;
exports.CreateVideoRoomUseCase = CreateVideoRoomUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IVideoCallRoomRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IBookingRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IVideoCallRoomMapper)),
    __metadata("design:paramtypes", [Object, Object, Object])
], CreateVideoRoomUseCase);
//# sourceMappingURL=CreateVideoRoomUseCase.js.map