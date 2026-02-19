import { useState, useEffect, useRef } from 'react';
import {
    Video, VideoOff, Mic, MicOff, Monitor, Volume2, PhoneOff,
    MessageSquare, Users, Settings, MoreVertical, Grid3X3, Clock,
    User, X, Send
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { useAppSelector } from '../../store/hooks';
import {
    videoCallService,
    VideoCallRoom as IVideoCallRoom,
    Participant,
    SessionInfo
} from '../../services/videoCallService';
import { toast } from 'react-hot-toast';

interface VideoCallRoomProps {
    room: IVideoCallRoom;
    sessionInfo: SessionInfo;
    onLeave: () => void;
    onSessionEnd?: () => void;
}

export default function VideoCallRoom({ room, sessionInfo, onLeave, onSessionEnd }: VideoCallRoomProps) {
    const { user } = useAppSelector((state) => state.auth);

    // Call state
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

    // Controls state
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [volume, setVolume] = useState(80);

    // Panels
    const [showChat, setShowChat] = useState(false);
    const [showParticipants, setShowParticipants] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState(2);
    const [chatMessage, setChatMessage] = useState('');
    const [messages, setMessages] = useState<{ from: string; text: string; time: Date }[]>([]);

    // Refs
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const socketRef = useRef<Socket | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);

    // Initialize Media
    useEffect(() => {
        const initMedia = async () => {
            try {
                console.log('[VideoCall] Requesting camera/microphone access...');
                const stream = await videoCallService.getUserMedia(true, true);
                console.log('[VideoCall] Got media stream:', stream);
                console.log('[VideoCall] Video tracks:', stream.getVideoTracks());
                console.log('[VideoCall] Audio tracks:', stream.getAudioTracks());

                setLocalStream(stream);
                localStreamRef.current = stream;
                console.log('[VideoCall] Local stream set successfully');
            } catch (err: any) {
                console.error("[VideoCall] Failed to get user media:", err);
                console.error("[VideoCall] Error name:", err.name);
                console.error("[VideoCall] Error message:", err.message);

                // Provide specific error messages
                if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                    toast.error("Camera/microphone permission denied. Please allow access and refresh.");
                } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                    toast.error("No camera/microphone found. Please connect a device.");
                } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
                    toast.error("Camera/microphone is already in use by another application.");
                } else if (err.message?.includes('HTTPS')) {
                    toast.error("Camera access requires HTTPS. Please use localhost or enable HTTPS.");
                } else {
                    toast.error(`Failed to access camera/microphone: ${err.message}`);
                }
            }
        };
        initMedia();
    }, []);

    // Assign local stream to video element
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            // Only set srcObject if it's not already set to this stream
            if (localVideoRef.current.srcObject !== localStream) {
                console.log('[VideoCall] Assigning stream to video element');
                localVideoRef.current.srcObject = localStream;

                // Add event listener to play video once metadata is loaded
                localVideoRef.current.onloadedmetadata = () => {
                    console.log('[VideoCall] Video metadata loaded, attempting to play...');
                    localVideoRef.current?.play().catch(err => {
                        console.error('[VideoCall] Error playing video:', err);
                    });
                };

                console.log('[VideoCall] Video element srcObject set:', localVideoRef.current.srcObject);
            }
        }
    }, [localStream]);

    // WebRTC signaling
    useEffect(() => {
        if (!room || !user) return;

        // Wait for local stream to be ready before starting signaling
        if (!localStreamRef.current) {
            console.log('[VideoCall] Waiting for local stream before starting signaling...');
            return;
        }

        // IMPORTANT: Strip /api/v1 from URL — Socket.IO connects to the base server, not the API path
        const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';
        console.log('[VideoCall] Connecting Socket.IO to:', SOCKET_URL);

        // Extract auth token from cookie for explicit authentication
        // This is critical for cross-origin connections (Vercel frontend → EC2 backend)
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('accessToken='))
            ?.split('=')[1];

        console.log('[VideoCall] Auth token found:', !!token);

        const socket = io(SOCKET_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling'],
            auth: { token },
        });
        socketRef.current = socket;

        // --- Helper: Create Peer Connection (defined inside useEffect to avoid stale closures) ---
        const setupPeerConnection = async (peerId: string, shouldCreateOffer: boolean) => {
            if (!localStreamRef.current) {
                console.warn('[VideoCall] Cannot create peer connection - no local stream');
                return;
            }

            // Close existing peer connection if any
            if (peerConnectionRef.current) {
                console.log('[VideoCall] Closing existing peer connection before creating new one');
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }

            console.log('[VideoCall] Creating peer connection for peer:', peerId, 'createOffer:', shouldCreateOffer);
            const pc = videoCallService.createPeerConnection(room.iceServers);
            peerConnectionRef.current = pc;

            // Add local tracks
            const tracks = localStreamRef.current.getTracks();
            console.log('[VideoCall] Adding', tracks.length, 'local tracks to peer connection');
            tracks.forEach((track) => {
                pc.addTrack(track, localStreamRef.current!);
            });

            // Handle remote stream
            pc.ontrack = (event) => {
                console.log('[VideoCall] ✅ Received remote track:', event.track.kind, 'streams:', event.streams.length);
                if (event.streams[0]) {
                    setRemoteStream(event.streams[0]);
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = event.streams[0];
                    }
                }
            };

            // Handle ICE candidates
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    console.log('[VideoCall] Sending ICE candidate to:', peerId);
                    socket.emit('video:ice-candidate', {
                        roomId: room.id,
                        candidate: event.candidate.toJSON(),
                        toUserId: peerId,
                    });
                }
            };

            pc.oniceconnectionstatechange = () => {
                console.log('[VideoCall] ICE connection state:', pc.iceConnectionState);
            };

            pc.onconnectionstatechange = () => {
                console.log('[VideoCall] Connection state:', pc.connectionState);
                if (pc.connectionState === 'connected') {
                    console.log('[VideoCall] ✅ Peer connection ESTABLISHED!');
                    setConnectionState('connected');
                } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
                    console.log('[VideoCall] ❌ Peer connection', pc.connectionState);
                    setConnectionState('disconnected');
                }
            };

            // Create offer if this side is the initiator
            if (shouldCreateOffer) {
                try {
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);
                    console.log('[VideoCall] Sending offer to:', peerId);
                    socket.emit('video:offer', {
                        roomId: room.id,
                        offer: pc.localDescription,
                        toUserId: peerId,
                    });
                } catch (err) {
                    console.error('[VideoCall] Error creating offer:', err);
                }
            }

            return pc;
        };

        // --- Socket event handlers ---
        socket.on('connect', () => {
            console.log('[VideoCall] ✅ Socket connected:', socket.id, 'joining room:', room.id);
            socket.emit('video:join-room', { roomId: room.id });
        });

        socket.on('connect_error', (err) => {
            console.error('[VideoCall] ❌ Socket connection error:', err.message);
            toast.error('Failed to connect to video call server');
        });

        socket.on('video:room-joined', ({ participants: p }) => {
            console.log('[VideoCall] Room joined, participants:', JSON.stringify(p));
            setParticipants(p);
            setConnectionState('connected');

            // If other participants exist, create an offer to connect to them
            p.forEach((participant: Participant) => {
                if (participant.userId !== user?.id) {
                    console.log('[VideoCall] Found existing participant, creating offer for:', participant.userId);
                    setupPeerConnection(participant.userId, true);
                }
            });
        });

        socket.on('video:user-joined', ({ userId: joinedUserId, participants: p }) => {
            console.log('[VideoCall] New user joined:', joinedUserId);
            setParticipants(p);
            // Don't create peer connection here — wait for the joiner to send an offer
            // The joining user (who received video:room-joined with existing participants) is the offerer
        });

        socket.on('video:user-left', ({ userId: leftUserId }) => {
            console.log('[VideoCall] User left:', leftUserId);
            setParticipants((prev) => prev.filter((p) => p.userId !== leftUserId));
            setRemoteStream(null);
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }
        });

        socket.on('video:offer', async ({ offer, fromUserId }) => {
            console.log('[VideoCall] 📨 Received offer from:', fromUserId);
            try {
                // Create a peer connection to handle the incoming offer (we are the answerer)
                await setupPeerConnection(fromUserId, false);

                if (peerConnectionRef.current) {
                    await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
                    const answer = await peerConnectionRef.current.createAnswer();
                    await peerConnectionRef.current.setLocalDescription(answer);
                    console.log('[VideoCall] 📤 Sending answer to:', fromUserId);
                    socket.emit('video:answer', { roomId: room.id, answer: peerConnectionRef.current.localDescription, toUserId: fromUserId });
                }
            } catch (err) {
                console.error('[VideoCall] Error handling offer:', err);
            }
        });

        socket.on('video:answer', async ({ answer, fromUserId }) => {
            console.log('[VideoCall] 📨 Received answer from:', fromUserId);
            try {
                if (peerConnectionRef.current) {
                    await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
                    console.log('[VideoCall] ✅ Remote description set from answer');
                }
            } catch (err) {
                console.error('[VideoCall] Error handling answer:', err);
            }
        });

        socket.on('video:ice-candidate', async ({ candidate, fromUserId }) => {
            if (candidate) {
                try {
                    if (peerConnectionRef.current) {
                        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                        console.log('[VideoCall] Added ICE candidate from:', fromUserId);
                    } else {
                        console.warn('[VideoCall] Received ICE candidate but no peer connection exists yet');
                    }
                } catch (err) {
                    console.warn('[VideoCall] Failed to add ICE candidate:', err);
                }
            }
        });

        socket.on('video:error', ({ message }) => {
            console.error('[VideoCall] Server error:', message);
            toast.error(message);
        });

        return () => {
            console.log('[VideoCall] Cleaning up socket and peer connection');
            socket.disconnect();
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }
        };
    }, [room, user, localStream]); // localStream triggers re-run when media is ready

    // Control handlers
    const toggleCamera = () => {
        localStreamRef.current?.getVideoTracks().forEach((track) => {
            track.enabled = !track.enabled;
        });
        setIsCameraOn((prev) => !prev);
    };

    const toggleMic = () => {
        localStreamRef.current?.getAudioTracks().forEach((track) => {
            track.enabled = !track.enabled;
        });
        setIsMicOn((prev) => !prev);
    };

    const toggleScreenShare = async () => {
        if (isScreenSharing) {
            const videoTrack = localStreamRef.current?.getVideoTracks()[0];
            if (videoTrack) {
                const sender = peerConnectionRef.current?.getSenders().find((s) => s.track?.kind === 'video');
                if (sender) sender.replaceTrack(videoTrack);
            }
            setIsScreenSharing(false);
        } else {
            try {
                const screenStream = await videoCallService.getDisplayMedia();
                const screenTrack = screenStream.getVideoTracks()[0];
                const sender = peerConnectionRef.current?.getSenders().find((s) => s.track?.kind === 'video');
                if (sender) sender.replaceTrack(screenTrack);

                screenTrack.onended = () => {
                    setIsScreenSharing(false);
                    const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
                    if (cameraTrack && sender) sender.replaceTrack(cameraTrack);
                };

                setIsScreenSharing(true);
            } catch (err) {
                console.error('Screen share error:', err);
            }
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setVolume(value);
        if (remoteVideoRef.current) {
            remoteVideoRef.current.volume = value / 100;
        }
    };

    const internalEndSession = async () => {
        localStreamRef.current?.getTracks().forEach((track) => track.stop());
        peerConnectionRef.current?.close();
        socketRef.current?.emit('video:leave-room', { roomId: room?.id });
        socketRef.current?.disconnect();

        if (room) {
            try {
                if (room.hostId === user?.id) {
                    await videoCallService.endRoom(room.id);
                    toast.success('Session ended for everyone');
                } else {
                    await videoCallService.leaveRoom(room.id);
                }
            } catch (err) {
                console.error('End/Leave room error:', err);
                // Fallback to leave if end fails? Or just log.
            }
        }

        if (onLeave) onLeave();
    };

    const sendChatMessage = () => {
        if (!chatMessage.trim()) return;
        setMessages((prev) => [...prev, { from: 'You', text: chatMessage, time: new Date() }]);
        setChatMessage('');
    };



    // FIXING THE BUG HERE while refactoring:
    const isProvider = user?.id === sessionInfo.providerId;
    const displayRemoteName = isProvider ? sessionInfo.learnerName : sessionInfo.providerName;

    return (
        <div className="h-screen bg-[#1a2332] flex flex-col overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-3 bg-[#1a2332] border-b border-gray-700/50">
                <div className="flex items-center gap-3">
                    {/* Provider Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center overflow-hidden">
                        {sessionInfo?.providerAvatar ? (
                            <img src={sessionInfo.providerAvatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-5 h-5 text-white" />
                        )}
                    </div>

                    {/* Session Info */}
                    <div>
                        <h1 className="text-white font-semibold text-sm">
                            {sessionInfo?.skillTitle || 'Video Session'}
                        </h1>
                        <p className="text-gray-400 text-xs">with {displayRemoteName}</p>
                    </div>

                    {/* Live Badge */}
                    <div className="flex items-center gap-1.5 bg-red-600 px-2.5 py-1 rounded-full ml-2">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        <span className="text-white text-xs font-medium">LIVE</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {sessionInfo && (
                        <div className="flex items-center gap-2">
                            <SessionTimer
                                sessionStartAt={sessionInfo.scheduledAt}
                                sessionDurationMinutes={sessionInfo.duration}
                                onExpire={onSessionEnd}
                            />
                        </div>
                    )}

                    {/* Grid View */}
                    <button className="text-gray-400 hover:text-white transition p-2">
                        <Grid3X3 className="w-5 h-5" />
                    </button>

                    {/* More Options */}
                    <button className="text-gray-400 hover:text-white transition p-2">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 relative p-4 overflow-hidden">
                {/* Remote Video (Main) */}
                <div className="w-full h-full rounded-xl overflow-hidden bg-[#243447] flex items-center justify-center">
                    {remoteStream ? (
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-4 text-gray-500">
                                <Video className="w-full h-full" />
                            </div>
                            <p className="text-gray-400 text-sm">Video feed from {displayRemoteName}</p>
                        </div>
                    )}
                </div>

                {/* Local Video (PiP - Top Right) */}
                <div className="absolute top-8 right-8 w-48 h-32 rounded-lg overflow-hidden bg-[#2a5a6a] shadow-2xl border border-gray-600/30">
                    {localStream && isCameraOn ? (
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                            style={{ transform: 'scaleX(-1)' }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#2a5a6a]">
                            <User className="w-12 h-12 text-[#5a9aaa]" />
                        </div>
                    )}
                    {/* You Label */}
                    <div className="absolute bottom-2 right-2 bg-gray-900/80 px-2 py-0.5 rounded text-white text-xs">
                        You
                    </div>
                </div>
            </main>

            {/* Controls Bar */}
            <footer className="bg-[#232f3e] border-t border-gray-700 px-6 py-4">
                <div className="flex items-center justify-between max-w-5xl mx-auto">
                    {/* Left Controls */}
                    <div className="flex items-center gap-3">
                        {/* Camera */}
                        <button
                            onClick={toggleCamera}
                            className={`w-11 h-11 rounded-lg flex items-center justify-center transition ${isCameraOn
                                ? 'bg-[#3d4f61] text-white hover:bg-[#4a5f73]'
                                : 'bg-red-600 text-white hover:bg-red-700'
                                }`}
                            title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
                        >
                            {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                        </button>

                        {/* Microphone */}
                        <button
                            onClick={toggleMic}
                            className={`w-11 h-11 rounded-lg flex items-center justify-center transition ${isMicOn
                                ? 'bg-[#3d4f61] text-white hover:bg-[#4a5f73]'
                                : 'bg-red-600 text-white hover:bg-red-700'
                                }`}
                            title={isMicOn ? 'Mute' : 'Unmute'}
                        >
                            {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                        </button>

                        {/* Screen Share */}
                        <button
                            onClick={toggleScreenShare}
                            className={`w-11 h-11 rounded-lg flex items-center justify-center transition ${isScreenSharing
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-[#3d4f61] text-white hover:bg-[#4a5f73]'
                                }`}
                            title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
                        >
                            <Monitor className="w-5 h-5" />
                        </button>

                        {/* Volume Slider */}
                        <div className="flex items-center gap-2 ml-3">
                            <Volume2 className="w-5 h-5 text-gray-400" />
                            <div className="relative w-20">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                                    style={{
                                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume}%, #4b5563 ${volume}%, #4b5563 100%)`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Center - End Session Button */}
                    <button
                        onClick={internalEndSession}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
                    >
                        <PhoneOff className="w-5 h-5" />
                        <span>End Session</span>
                    </button>

                    {/* DEV TEST BUTTON - Can make optional prop if needed, removing for generic room unless debugging */}
                    {onSessionEnd && (
                        <button
                            onClick={onSessionEnd}
                            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
                            title="Test: Simulates session timer expiry"
                        >
                            <Clock className="w-4 h-4" />
                            <span>Test End</span>
                        </button>
                    )}

                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-3">
                    {/* Chat */}
                    <button
                        onClick={() => {
                            setShowChat(!showChat);
                            setShowParticipants(false);
                            setShowSettings(false);
                            if (!showChat) setUnreadMessages(0);
                        }}
                        className={`relative w-11 h-11 rounded-lg flex items-center justify-center transition ${showChat ? 'bg-blue-600 text-white' : 'bg-[#3d4f61] text-white hover:bg-[#4a5f73]'
                            }`}
                        title="Chat"
                    >
                        <MessageSquare className="w-5 h-5" />
                        {unreadMessages > 0 && !showChat && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full text-xs flex items-center justify-center font-medium">
                                {unreadMessages}
                            </span>
                        )}
                    </button>

                    {/* Participants */}
                    <button
                        onClick={() => {
                            setShowParticipants(!showParticipants);
                            setShowChat(false);
                            setShowSettings(false);
                        }}
                        className={`w-11 h-11 rounded-lg flex items-center justify-center transition ${showParticipants ? 'bg-blue-600 text-white' : 'bg-[#3d4f61] text-white hover:bg-[#4a5f73]'
                            }`}
                        title="Participants"
                    >
                        <Users className="w-5 h-5" />
                    </button>

                    {/* Settings */}
                    <button
                        onClick={() => {
                            setShowSettings(!showSettings);
                            setShowChat(false);
                            setShowParticipants(false);
                        }}
                        className={`w-11 h-11 rounded-lg flex items-center justify-center transition ${showSettings ? 'bg-blue-600 text-white' : 'bg-[#3d4f61] text-white hover:bg-[#4a5f73]'
                            }`}
                        title="Settings"
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </footer>

            {/* Floating Right Controls - wait, they were in Footer?
            Let's correct footer structure below.
        */}

            {/* Chat Panel */}
            {showChat && (
                <div className="fixed right-0 top-0 bottom-0 w-80 bg-[#1e2936] border-l border-gray-700 shadow-2xl z-50 flex flex-col">
                    <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                        <h3 className="text-white font-semibold">Chat</h3>
                        <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto">
                        {messages.length === 0 ? (
                            <p className="text-gray-500 text-sm text-center">No messages yet</p>
                        ) : (
                            messages.map((msg, i) => (
                                <div key={i} className="mb-3">
                                    <span className="text-blue-400 text-sm font-medium">{msg.from}</span>
                                    <p className="text-white text-sm">{msg.text}</p>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="p-4 border-t border-gray-700">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                                placeholder="Type a message..."
                                className="flex-1 bg-[#2a3744] text-white text-sm px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                            />
                            <button
                                onClick={sendChatMessage}
                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Participants Panel */}
            {showParticipants && (
                <div className="fixed right-0 top-0 bottom-0 w-80 bg-[#1e2936] border-l border-gray-700 shadow-2xl z-50">
                    <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                        <h3 className="text-white font-semibold">Participants ({participants.length + 1})</h3>
                        <button onClick={() => setShowParticipants(false)} className="text-gray-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-4">
                        {/* Current user */}
                        <div className="flex items-center gap-3 py-3 border-b border-gray-700">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="text-white text-sm">You</span>
                                <p className="text-gray-500 text-xs">Host</p>
                            </div>
                        </div>
                        {/* Other participants */}
                        {participants
                            .filter((p) => p.userId !== user?.id)
                            .map((p) => (
                                <div key={p.userId} className="flex items-center gap-3 py-3">
                                    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-white text-sm">{p.userName || displayRemoteName}</span>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Settings Panel */}
            {showSettings && (
                <div className="fixed right-0 top-0 bottom-0 w-80 bg-[#1e2936] border-l border-gray-700 shadow-2xl z-50">
                    <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                        <h3 className="text-white font-semibold">Settings</h3>
                        <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-4 space-y-6">
                        <div>
                            <h4 className="text-gray-400 text-sm mb-3">Audio</h4>
                            <div className="flex items-center justify-between">
                                <span className="text-white text-sm">Microphone</span>
                                <span className={`text-sm ${isMicOn ? 'text-green-400' : 'text-red-400'}`}>
                                    {isMicOn ? 'On' : 'Off'}
                                </span>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-gray-400 text-sm mb-3">Video</h4>
                            <div className="flex items-center justify-between">
                                <span className="text-white text-sm">Camera</span>
                                <span className={`text-sm ${isCameraOn ? 'text-green-400' : 'text-red-400'}`}>
                                    {isCameraOn ? 'On' : 'Off'}
                                </span>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-gray-400 text-sm mb-3">Connection</h4>
                            <div className="flex items-center justify-between">
                                <span className="text-white text-sm">Status</span>
                                <span className={`text-sm ${connectionState === 'connected' ? 'text-green-400' : 'text-yellow-400'}`}>
                                    {connectionState === 'connected' ? 'Connected' : 'Connecting...'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function SessionTimer({
    sessionStartAt,
    sessionDurationMinutes,
    onExpire,
}: {
    sessionStartAt: Date | string | undefined;
    sessionDurationMinutes: number;
    onExpire?: () => void;
}) {
    const [remainingTime, setRemainingTime] = useState('--:--');
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (!sessionStartAt) return;

        const startTime = new Date(sessionStartAt).getTime();
        const endTime = startTime + sessionDurationMinutes * 60 * 1000;

        const updateTimer = () => {
            const now = Date.now();
            const remaining = endTime - now;

            if (remaining <= 0) {
                setRemainingTime('00:00');
                if (!isExpired) {
                    setIsExpired(true);
                    onExpire?.();
                }
                return;
            }

            const totalSeconds = Math.floor(remaining / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            setRemainingTime(
                `${hours > 0 ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            );
        };

        const interval = setInterval(updateTimer, 1000);
        updateTimer();

        return () => clearInterval(interval);
    }, [sessionStartAt, sessionDurationMinutes, isExpired, onExpire]);

    return (
        <div className={`px-3 py-1 rounded-full text-sm font-medium font-mono ${remainingTime === '00:00' ? 'bg-red-900/50 text-red-400' : 'bg-gray-800 text-white'
            }`}>
            {remainingTime}
        </div>
    );
}
