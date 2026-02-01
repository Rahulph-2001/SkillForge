export interface ParticipantDTO {
    userId: string;
    userName?: string;
    avatarUrl?: string;
    joinedAt: Date;
}
export interface RTCIceServerDTO {
    urls: string | string[];
    username?: string;
    credential?: string;
}
export interface VideoCallRoomResponseDTO {
    id: string;
    roomCode: string;
    bookingId: string | null;
    hostId: string;
    status: string;
    participants: ParticipantDTO[];
    iceServers: RTCIceServerDTO[];
    createdAt: Date;
    endedAt: Date | null;
}
export interface SessionInfoDTO {
    providerId: string;
    skillTitle: string;
    providerName: string;
    providerAvatar: string | null;
    learnerName: string;
    learnerAvatar: string | null;
    scheduledAt: Date;
    duration: number;
}
//# sourceMappingURL=VideoCallRoomResponseDTO.d.ts.map