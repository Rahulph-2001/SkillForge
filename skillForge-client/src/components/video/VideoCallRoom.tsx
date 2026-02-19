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

    // Sync remote stream to video element when React renders it
    // This is critical because ontrack fires before React re-renders the conditional <video>
    useEffect(() => {
        if (remoteStream && remoteVideoRef.current) {
            console.log('[VideoCall] Syncing remote stream to video element');
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    // WebRTC signaling
    useEffect(() => {
        if (!room || !user) return;

        // Wait for local stream to be ready before starting signaling
        if (!localStreamRef.current) {
            console.log('[VideoCall] Waiting for local stream before starting signaling...');
            return;
        }

        // If socket is already connected (re-run due to localStream becoming available), skip reconnect
        if (socketRef.current?.connected) {
            console.log('[VideoCall] Socket already connected, skipping reconnect');
            return;
        }

        // IMPORTANT: Strip /api/v1 from URL — Socket.IO connects to the base server, not the API path
        const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';
        console.log('[VideoCall] Connecting Socket.IO to:', SOCKET_URL);

        // Auth: cookies are sent automatically via withCredentials (the accessToken is httpOnly)
        const socket = io(SOCKET_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling'],
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
            console.log('[VideoCall] Using ICE servers:', JSON.stringify(room.iceServers, null, 2));
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
                    // Only set state — the useEffect above will sync to the video element
                    // after React re-renders and the <video> element exists in the DOM
                    setRemoteStream(event.streams[0]);
                }
            };

            // Handle ICE candidates
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    console.log('[VideoCall] Sending ICE candidate to:', peerId, 'Type:', event.candidate.type, event.candidate.candidate);
                    socketRef.current?.emit('video:ice-candidate', {
                        roomId: room.id,
                        candidate: event.candidate,
                        toUserId: peerId
                    });
                }
            };

            // ICE connection state changes
            pc.oniceconnectionstatechange = () => {
                console.log('[VideoCall] ICE connection state:', pc.iceConnectionState);
            };

            // Connection state changes
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
            socketRef.current = null;
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }
        };
    }, [room, user, localStream]); // localStream is needed to trigger setup when media becomes ready

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
        <div className="h-screen bg-background flex flex-col overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
                <div className="flex items-center gap-3">
                    {/* Provider Avatar */}
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-border">
                        {sessionInfo?.providerAvatar ? (
                            <img src={sessionInfo.providerAvatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-5 h-5 text-primary" />
                        )}
                    </div>

                    {/* Session Info */}
                    <div>
                        <h1 className="text-foreground font-semibold text-sm">
                            {sessionInfo?.skillTitle || 'Video Session'}
                        </h1>
                        <p className="text-muted-foreground text-xs">with {displayRemoteName}</p>
                    </div>

                    {/* Live Badge */}
                    <div className="flex items-center gap-1.5 bg-destructive px-2.5 py-1 rounded-full ml-2">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        <span className="text-destructive-foreground text-xs font-medium">LIVE</span>
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
                    <button className="text-muted-foreground hover:text-foreground transition p-2 hover:bg-secondary rounded-lg">
                        <Grid3X3 className="w-5 h-5" />
                    </button>

                    {/* More Options */}
                    <button className="text-muted-foreground hover:text-foreground transition p-2 hover:bg-secondary rounded-lg">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Main Video Area */}
            <div className="flex-1 flex overflow-hidden">
                <main className="flex-1 relative flex items-center justify-center p-4">
                    {/* Grid Layout */}
                    <div className="w-full h-full max-w-6xl mx-auto flex gap-4 transition-all duration-300">
                        {/* Remote Video */}
                        <div className={`relative flex-1 bg-muted/20 rounded-2xl overflow-hidden border border-border shadow-2xl transition-all ${connectionState === 'connected' ? 'opacity-100' : 'opacity-70'
                            }`}>
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                            />

                            {/* Overlay info */}
                            <div className="absolute bottom-4 left-4 bg-background/60 backdrop-blur-md px-4 py-2 rounded-lg flex items-center gap-3 border border-white/10">
                                {connectionState === 'connected' ? (
                                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                ) : (
                                    <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse"></div>
                                )}
                                <span className="text-foreground font-medium text-sm">
                                    {displayRemoteName}
                                </span>
                                <div className="h-4 w-[1px] bg-white/20"></div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Users className="w-3.5 h-3.5" />
                                    <span>{participants.length}</span>
                                </div>
                            </div>

                            {/* Connecting State Overlay */}
                            {connectionState !== 'connected' && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10 p-6 text-center">
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                                        <div className="relative bg-background p-4 rounded-full border border-border shadow-xl">
                                            <User className="w-12 h-12 text-muted-foreground" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold text-foreground mb-2">Waiting to connect...</h3>
                                    <p className="text-muted-foreground max-w-sm">
                                        We're establishing a secure connection with the other participant.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Local Video - PiP style or split */}
                        <div className="absolute bottom-8 right-8 w-64 aspect-video bg-muted rounded-xl overflow-hidden border-2 border-border shadow-2xl transition-all hover:scale-105 active:scale-95 group z-20">
                            <video
                                ref={localVideoRef}
                                muted
                                autoPlay
                                playsInline
                                className={`w-full h-full object-cover transform ${isCameraOn ? 'scale-100' : 'scale-110 blur-md grayscale'} transition-all duration-300`}
                            />
                            <div className="absolute bottom-2 left-2 bg-background/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-2 text-xs font-medium text-foreground">
                                <span>You</span>
                                {!isMicOn && <MicOff className="w-3 h-3 text-destructive" />}
                            </div>
                            {!isCameraOn && (
                                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                                    <VideoOff className="w-8 h-8 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* Chat Details Sidebar */}
            </div>

            {/* Bottom Control Bar */}
            <div className="h-20 bg-background/90 backdrop-blur-xl border-t border-border flex items-center justify-between px-6 lg:px-12 z-50">
                <div className="flex items-center gap-3">
                    {/* Left Controls */}
                    <div className="flex items-center gap-3">
                        {/* Camera */}
                        <button
                            onClick={toggleCamera}
                            className={`w-11 h-11 rounded-lg flex items-center justify-center transition ${isCameraOn
                                ? 'bg-secondary text-foreground hover:bg-secondary/80'
                                : 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                }`}
                            title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
                        >
                            {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                        </button>

                        {/* Microphone */}
                        <button
                            onClick={toggleMic}
                            className={`w-11 h-11 rounded-lg flex items-center justify-center transition ${isMicOn
                                ? 'bg-secondary text-foreground hover:bg-secondary/80'
                                : 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                }`}
                            title={isMicOn ? 'Mute' : 'Unmute'}
                        >
                            {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                        </button>

                        {/* Screen Share */}
                        <button
                            onClick={toggleScreenShare}
                            className={`w-11 h-11 rounded-lg flex items-center justify-center transition ${isScreenSharing
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                : 'bg-secondary text-foreground hover:bg-secondary/80'
                                }`}
                            title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
                        >
                            <Monitor className="w-5 h-5" />
                        </button>

                        {/* Volume Slider */}
                        <div className="flex items-center gap-2 ml-3">
                            <Volume2 className="w-5 h-5 text-muted-foreground" />
                            <div className="relative w-20">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-muted"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Center - End Session Button */}
                    <button
                        onClick={internalEndSession}
                        className="flex items-center gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground px-5 py-2.5 rounded-lg font-medium transition"
                    >
                        <PhoneOff className="w-5 h-5" />
                        <span>End Session</span>
                    </button>

                    {/* DEV TEST BUTTON - Can make optional prop if needed, removing for generic room unless debugging */}
                    {onSessionEnd && (
                        <button
                            onClick={onSessionEnd}
                            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-foreground px-4 py-2 rounded-lg font-medium transition text-sm"
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
                        className={`relative w-11 h-11 rounded-lg flex items-center justify-center transition ${showChat ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'
                            }`}
                        title="Chat"
                    >
                        <MessageSquare className="w-5 h-5" />
                        {unreadMessages > 0 && !showChat && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full text-xs flex items-center justify-center font-medium text-primary-foreground border border-background">
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
                        className={`w-11 h-11 rounded-lg flex items-center justify-center transition ${showParticipants ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'
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
                        className={`w-11 h-11 rounded-lg flex items-center justify-center transition ${showSettings ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'
                            }`}
                        title="Settings"
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Floating Right Controls - wait, they were in Footer?
            Let's correct footer structure below.
        */}

            {/* Chat Panel */}
            {showChat && (
                <div className="fixed right-0 top-0 bottom-0 w-80 bg-card border-l border-border shadow-2xl z-50 flex flex-col">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                        <h3 className="text-foreground font-semibold">Chat</h3>
                        <button onClick={() => setShowChat(false)} className="text-muted-foreground hover:text-foreground">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto">
                        {messages.length === 0 ? (
                            <p className="text-muted-foreground text-sm text-center">No messages yet</p>
                        ) : (
                            messages.map((msg, i) => (
                                <div key={i} className="mb-3">
                                    <span className="text-primary text-sm font-medium">{msg.from}</span>
                                    <p className="text-foreground text-sm">{msg.text}</p>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="p-4 border-t border-border">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                                placeholder="Type a message..."
                                className="flex-1 bg-input text-foreground text-sm px-3 py-2 rounded-lg border border-border focus:outline-none focus:border-blue-500"
                            />
                            <button
                                onClick={sendChatMessage}
                                className="p-2 bg-primary text-foreground rounded-lg hover:bg-blue-700"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Participants Panel */}
            {showParticipants && (
                <div className="fixed right-0 top-0 bottom-0 w-80 bg-card border-l border-border shadow-2xl z-50">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                        <h3 className="text-foreground font-semibold">Participants ({participants.length + 1})</h3>
                        <button onClick={() => setShowParticipants(false)} className="text-muted-foreground hover:text-foreground">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-4">
                        {/* Current user */}
                        <div className="flex items-center gap-3 py-3 border-b border-border">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                                <User className="w-5 h-5 text-foreground" />
                            </div>
                            <div>
                                <span className="text-foreground text-sm">You</span>
                                <p className="text-muted-foreground text-xs">Host</p>
                            </div>
                        </div>
                        {/* Other participants */}
                        {participants
                            .filter((p) => p.userId !== user?.id)
                            .map((p) => (
                                <div key={p.userId} className="flex items-center gap-3 py-3">
                                    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                                        <User className="w-5 h-5 text-foreground" />
                                    </div>
                                    <span className="text-foreground text-sm">{p.userName || displayRemoteName}</span>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Settings Panel */}
            {showSettings && (
                <div className="fixed right-0 top-0 bottom-0 w-80 bg-card border-l border-border shadow-2xl z-50">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                        <h3 className="text-foreground font-semibold">Settings</h3>
                        <button onClick={() => setShowSettings(false)} className="text-muted-foreground hover:text-foreground">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-4 space-y-6">
                        <div>
                            <h4 className="text-muted-foreground text-sm mb-3">Audio</h4>
                            <div className="flex items-center justify-between">
                                <span className="text-foreground text-sm">Microphone</span>
                                <span className={`text-sm ${isMicOn ? 'text-green-400' : 'text-red-400'}`}>
                                    {isMicOn ? 'On' : 'Off'}
                                </span>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-muted-foreground text-sm mb-3">Video</h4>
                            <div className="flex items-center justify-between">
                                <span className="text-foreground text-sm">Camera</span>
                                <span className={`text-sm ${isCameraOn ? 'text-green-400' : 'text-red-400'}`}>
                                    {isCameraOn ? 'On' : 'Off'}
                                </span>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-muted-foreground text-sm mb-3">Connection</h4>
                            <div className="flex items-center justify-between">
                                <span className="text-foreground text-sm">Status</span>
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
        <div className={`px-3 py-1 rounded-full text-sm font-medium font-mono ${remainingTime === '00:00' ? 'bg-red-900/50 text-red-400' : 'bg-gray-800 text-foreground'
            }`}>
            {remainingTime}
        </div>
    );
}
