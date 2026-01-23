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
  skillTitle: string;
  providerName: string;
  providerAvatar: string | null;
  learnerName: string;
  learnerAvatar: string | null;
}