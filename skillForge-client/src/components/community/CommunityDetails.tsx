import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Users,
    Crown,
    Send,
    Paperclip,
    Pin,
    Trash2,
    Settings,
    LogOut,
} from 'lucide-react';
import {
    getCommunityDetails,
    getMessages,
    sendMessage,
    leaveCommunity,
    Community,
    CommunityMessage,
} from '../../services/communityService';
import SuccessModal from '../common/Modal/SuccessModal';
import ErrorModal from '../common/Modal/ErrorModal';
import ConfirmModal from '../common/Modal/ConfirmModal';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { io, Socket } from 'socket.io-client';

export default function CommunityDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);

    const [community, setCommunity] = useState<Community | null>(null);
    const [messages, setMessages] = useState<CommunityMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [messageInput, setMessageInput] = useState('');
    const [sending, setSending] = useState(false);
    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        loadCommunityData();

        // Initialize WebSocket
        const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';
        const socket = io(SOCKET_URL, {
            auth: {
                token: localStorage.getItem('token'),
            },
        });

        socket.on('connect', () => {
            console.log('WebSocket connected');
            socket.emit('join_community', id);
        });

        socket.on('new_message', (message: CommunityMessage) => {
            setMessages((prev) => [...prev, message]);
            scrollToBottom();
        });

        socket.on('message_deleted', (data: { messageId: string }) => {
            setMessages((prev) => prev.filter((m) => m.id !== data.messageId));
        });

        socket.on('message_pinned', (message: CommunityMessage) => {
            setMessages((prev) =>
                prev.map((m) => (m.id === message.id ? { ...m, isPinned: true } : m))
            );
        });

        socket.on('message_unpinned', (message: CommunityMessage) => {
            setMessages((prev) =>
                prev.map((m) => (m.id === message.id ? { ...m, isPinned: false } : m))
            );
        });

        socket.on('member_joined', (data: { userId: string; userName: string }) => {
            if (community) {
                setCommunity({ ...community, membersCount: community.membersCount + 1 });
            }
        });

        socket.on('member_left', (data: { userId: string }) => {
            if (community) {
                setCommunity({ ...community, membersCount: community.membersCount - 1 });
            }
        });

        socketRef.current = socket;

        return () => {
            socket.emit('leave_community', id);
            socket.disconnect();
        };
    }, [id]);

    const loadCommunityData = async () => {
        if (!id) return;

        try {
            setLoading(true);
            const [communityData, messagesData] = await Promise.all([
                getCommunityDetails(id),
                getMessages(id),
            ]);
            setCommunity(communityData);
            setMessages(messagesData);
            scrollToBottom();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load community');
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim() || !id) return;

        try {
            setSending(true);
            await sendMessage({
                communityId: id,
                content: messageInput.trim(),
            });
            setMessageInput('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const handleLeave = async () => {
        if (!id) return;

        try {
            await leaveCommunity(id);
            setShowLeaveConfirm(false);
            setSuccessMessage('You have left the community successfully.');
            setShowSuccess(true);
            setTimeout(() => {
                navigate('/communities');
            }, 2000);
        } catch (err: any) {
            setShowLeaveConfirm(false);
            setError(err.response?.data?.message || 'Failed to leave community');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!community) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-gray-600 mb-4">Community not found</p>
                <button
                    onClick={() => navigate('/communities')}
                    className="text-blue-600 hover:underline"
                >
                    Back to Communities
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/communities')}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{community.name}</h1>
                        <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Users className="w-4 h-4" />
                                <span className="text-sm">{community.membersCount} members</span>
                            </div>
                            {community.isAdmin && (
                                <div className="flex items-center gap-1 text-yellow-600">
                                    <Crown className="w-4 h-4" />
                                    <span className="text-xs font-semibold">Admin</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {community.isAdmin && (
                        <button
                            onClick={() => navigate(`/communities/${id}/settings`)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                    )}
                    <button
                        onClick={() => setShowLeaveConfirm(true)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Leave
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex gap-3 ${message.isPinned ? 'bg-yellow-50 p-3 rounded-lg' : ''}`}
                    >
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                {message.senderName.charAt(0).toUpperCase()}
                            </div>
                        </div>

                        {/* Message Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-900">{message.senderName}</span>
                                <span className="text-xs text-gray-500">
                                    {new Date(message.createdAt).toLocaleTimeString()}
                                </span>
                                {message.isPinned && <Pin className="w-4 h-4 text-yellow-600" />}
                            </div>
                            <p className="text-gray-800 break-words">{message.content}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 px-6 py-4">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <button
                        type="button"
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                    >
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        type="submit"
                        disabled={!messageInput.trim() || sending}
                        className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>

            {/* Modals */}
            <ConfirmModal
                isOpen={showLeaveConfirm}
                title="Leave Community"
                message={`Are you sure you want to leave "${community.name}"? You will need to pay credits again to rejoin.`}
                type="danger"
                onConfirm={handleLeave}
                onCancel={() => setShowLeaveConfirm(false)}
            />

            <SuccessModal
                isOpen={showSuccess}
                title="Success"
                message={successMessage}
                onClose={() => setShowSuccess(false)}
            />

            <ErrorModal isOpen={!!error} message={error || ''} onClose={() => setError(null)} />
        </div>
    );
}
