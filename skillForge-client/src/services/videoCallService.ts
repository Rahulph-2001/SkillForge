import api from './api';

export interface RTCIceServerConfig {
  urls: string | string[];
  username?: string;
  credential?: string;
}

export interface Participant {
  userId: string;
  userName?: string;
  avatarUrl?: string;
  joinedAt: Date;
}

export interface VideoCallRoom {
  id: string;
  roomCode: string;
  bookingId: string | null;
  hostId: string;
  status: string;
  participants: Participant[];
  iceServers: RTCIceServerConfig[];
  createdAt: Date;
  endedAt: Date | null;
}

export interface SessionInfo {
  skillTitle: string;
  providerName: string;
  providerAvatar: string | null;
  learnerName: string;
  learnerAvatar: string | null;
}

export interface CreateRoomParams {
  bookingId?: string;
}

export interface JoinRoomParams {
  roomId?: string;
  roomCode?: string;
  bookingId?: string;
}

export const videoCallService = {
  /**
   * Create a new video call room
   */
  async createRoom(params: CreateRoomParams = {}): Promise<VideoCallRoom> {
    const response = await api.post('/video-call/rooms', params);
    return response.data.data;
  },

  /**
   * Join an existing room
   */
  async joinRoom(params: JoinRoomParams): Promise<VideoCallRoom> {
    const response = await api.post('/video-call/rooms/join', params);
    return response.data.data;
  },

  /**
   * Get room info
   */
  async getRoomInfo(roomId: string): Promise<VideoCallRoom> {
    const response = await api.get(`/video-call/rooms/${roomId}`);
    return response.data.data;
  },

  /**
   * Get or create room for a booking
   */
  async getRoomForBooking(bookingId: string): Promise<VideoCallRoom> {
    console.log('[videoCallService] getRoomForBooking called with:', bookingId);
    const response = await api.get(`/video-call/booking/${bookingId}`);
    console.log('[videoCallService] getRoomForBooking response:', response.data);
    return response.data.data;
  },

  /**
   * Get session info (skill title, provider/learner names)
   */
  async getSessionInfo(bookingId: string): Promise<SessionInfo> {
    console.log('[videoCallService] getSessionInfo called with:', bookingId);
    const response = await api.get(`/video-call/session/${bookingId}/info`);
    console.log('[videoCallService] getSessionInfo response:', response.data);
    return response.data.data;
  },

  /**
   * Leave a room
   */
  async leaveRoom(roomId: string): Promise<void> {
    await api.post(`/video-call/rooms/${roomId}/leave`);
  },

  /**
   * End a room (host only)
   */
  async endRoom(roomId: string): Promise<void> {
    await api.post(`/video-call/rooms/${roomId}/end`);
  },

  /**
   * Get user media stream
   */
  async getUserMedia(video: boolean = true, audio: boolean = true): Promise<MediaStream> {
    // Check if we're in a secure context (HTTPS or localhost)
    if (!window.isSecureContext) {
      throw new Error('Camera/microphone access requires HTTPS. Please use localhost or enable HTTPS.');
    }

    // Check if mediaDevices API is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Your browser does not support camera/microphone access. Please use a modern browser like Chrome, Firefox, or Edge.');
    }

    return await navigator.mediaDevices.getUserMedia({
      video: video
        ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        }
        : false,
      audio: audio
        ? {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
        : false,
    });
  },

  /**
   * Get display media for screen sharing
   */
  async getDisplayMedia(): Promise<MediaStream> {
    return await navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: 'always',
      } as MediaTrackConstraints,
      audio: false,
    });
  },

  /**
   * Create RTCPeerConnection with given ICE servers
   */
  createPeerConnection(iceServers: RTCIceServerConfig[]): RTCPeerConnection {
    return new RTCPeerConnection({
      iceServers,
      iceCandidatePoolSize: 10,
    });
  },
};