import { useState, useEffect, useRef, useCallback } from 'react';
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
        if (!room || !user || !localStream) return;

        const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
            withCredentials: true,
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            socket.emit('video:join-room', { roomId: room.id });
        });

        socket.on('video:room-joined', ({ participants: p }) => {
            setParticipants(p);
            setConnectionState('connected');

            p.forEach((participant: Participant) => {
                if (participant.userId !== user?.id) {
                    createPeerConnection(participant.userId, true);
                }
            });
        });

        socket.on('video:user-joined', ({ userId, participants: p }) => {
            setParticipants(p);
            if (userId !== user?.id) {
                createPeerConnection(userId, false);
            }
        });

        socket.on('video:user-left', ({ userId }) => {
            setParticipants((prev) => prev.filter((p) => p.userId !== userId));
            setRemoteStream(null);
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }
        });

        socket.on('video:offer', async ({ offer, fromUserId }) => {
            if (!peerConnectionRef.current) {
                await createPeerConnection(fromUserId, false);
            }
            await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnectionRef.current?.createAnswer();
            await peerConnectionRef.current?.setLocalDescription(answer);
            socket.emit('video:answer', { roomId: room.id, answer, toUserId: fromUserId });
        });

        socket.on('video:answer', async ({ answer }) => {
            await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(answer));
        });

        socket.on('video:ice-candidate', async ({ candidate }) => {
            if (candidate) {
                await peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });

        socket.on('video:error', ({ message }) => {
            toast.error(message);
        });

        return () => {
            socket.disconnect();
            peerConnectionRef.current?.close();
            localStreamRef.current?.getTracks().forEach(track => track.stop());
        };
    }, [room, user]); // Removed localStream from dependencies to prevent stopping tracks

    const createPeerConnection = useCallback(
        async (peerId: string, createOffer: boolean) => {
            if (!room || !socketRef.current || !localStreamRef.current) return;

            const pc = videoCallService.createPeerConnection(room.iceServers);
            peerConnectionRef.current = pc;

            // Add local tracks
            localStreamRef.current.getTracks().forEach((track) => {
                pc.addTrack(track, localStreamRef.current!);
            });

            // Handle remote stream
            pc.ontrack = (event) => {
                setRemoteStream(event.streams[0]);
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = event.streams[0];
                }
            };

            // Handle ICE candidates
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    socketRef.current?.emit('video:ice-candidate', {
                        roomId: room.id,
                        candidate: event.candidate.toJSON(),
                        toUserId: peerId,
                    });
                }
            };

            pc.onconnectionstatechange = () => {
                if (pc.connectionState === 'connected') {
                    setConnectionState('connected');
                } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
                    setConnectionState('disconnected');
                }
            };

            // Create offer if initiator
            if (createOffer) {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                socketRef.current?.emit('video:offer', {
                    roomId: room.id,
                    offer: pc.localDescription,
                    toUserId: peerId,
                });
            }
        },
        [room]
    );

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
