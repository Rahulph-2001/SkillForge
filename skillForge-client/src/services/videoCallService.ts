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
  providerId: string;
  skillTitle: string;
  providerName: string;
  providerAvatar: string | null;
  learnerName: string;
  learnerAvatar: string | null;
  scheduledAt: string;
  duration: number;
  meetingLink?: string | null;
}

export interface CreateRoomParams {
  bookingId?: string;
}

export interface JoinRoomParams {
  roomId?: string;
  roomCode?: string;
  bookingId?: string;
}

export interface SessionTimeValidation {
  canJoin: boolean;
  message: string;
  sessionStartAt: string;
  sessionEndAt: string;
  remainingSeconds: number;
  sessionDurationMinutes: number;
}

export const videoCallService = {
  /**
   * Create a new video call room
   */
  async createRoom(params: CreateRoomParams = {}): Promise<VideoCallRoom> {
    const response = await api.post('/video-call/room', params);
    return response.data.data;
  },

  /**
   * Join an existing room
   */
  async joinRoom(params: JoinRoomParams): Promise<VideoCallRoom> {
    const response = await api.post('/video-call/room/join', params);
    return response.data.data;
  },

  /**
   * Get room info
   */
  async getRoomInfo(roomId: string): Promise<VideoCallRoom> {
    const response = await api.get(`/video-call/room/${roomId}`);
    return response.data.data;
  },

  /**
   * Get or create room for a booking
   */
  async getRoomForBooking(bookingId: string): Promise<VideoCallRoom> {
    const response = await api.get(`/video-call/booking/${bookingId}`);
    return response.data.data;
  },

  /**
   * Get session info (skill title, provider/learner names)
   */
  async getSessionInfo(bookingId: string): Promise<SessionInfo> {
    const response = await api.get(`/video-call/session/${bookingId}/info`);
    return response.data.data;
  },

  /**
   * Get session info for interview
   */
  async getInterviewSessionInfo(interviewId: string): Promise<SessionInfo> {
    const response = await api.get(`/video-call/session/interview/${interviewId}`);
    return response.data.data;
  },

  /**
   * Validate if user can join session at current time
   */
  async validateSessionTime(bookingId: string): Promise<SessionTimeValidation> {
    const response = await api.get(`/video-call/session/${bookingId}/validate-time`);
    return response.data.data;
  },

  /**
   * Leave a room
   */
  async leaveRoom(roomId: string): Promise<void> {
    await api.post(`/video-call/room/${roomId}/leave`);
  },

  /**
   * End a room (host only)
   */
  async endRoom(roomId: string): Promise<void> {
    await api.post(`/video-call/room/${roomId}/end`);
  },

  /**
   * Complete session (release escrow and mark completed)
   */
  async completeSession(bookingId: string): Promise<void> {
    await api.post(`/bookings/${bookingId}/complete`);
  },

  /**
   * Submit review
   */
  async createReview(data: { bookingId: string; rating: number; review: string }): Promise<void> {
    await api.post('/reviews', data);
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
