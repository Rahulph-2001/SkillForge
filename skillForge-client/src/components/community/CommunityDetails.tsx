import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import {
    ArrowLeft,
    Users,
    Crown,
    Send,
    Paperclip,
    Pin,
    Settings,
    LogOut,
    MoreVertical,
    FileText,
    Image as ImageIcon,
    Download,
    Clock,
    Search,
    Reply,
    X,
    Smile
} from 'lucide-react';
import {
    getCommunityDetails,
    getMessages,
    sendMessage,
    leaveCommunity,
    getCommunityMembers,
    removeCommunityMember,
    pinMessage,
    unpinMessage,
    deleteMessage,
    addReaction,
    removeReaction,
    Community,
    CommunityMessage,
    CommunityMember
} from '../../services/communityService';
import SuccessModal from '../common/Modal/SuccessModal';
import ErrorModal from '../common/Modal/ErrorModal';
import ConfirmModal from '../common/Modal/ConfirmModal';
import { RootState } from '../../store/store';

interface CommunityDetailsProps {
    communityId?: string;
    isModal?: boolean;
}

export default function CommunityDetails({ communityId: propCommunityId, isModal = false }: CommunityDetailsProps) {
    const { id: paramId } = useParams<{ id: string }>();
    const id = propCommunityId || paramId;
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);

    // State
    const [community, setCommunity] = useState<Community | null>(null);
    const [messages, setMessages] = useState<CommunityMessage[]>([]);
    const [members, setMembers] = useState<CommunityMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'chat' | 'members' | 'files'>('chat');

    // Pagination State
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const MESSAGES_PER_PAGE = 50;

    // Chat State
    const [messageInput, setMessageInput] = useState('');
    const [sending, setSending] = useState(false);
    const [pinnedMessage, setPinnedMessage] = useState<CommunityMessage | null>(null);

    // Filter State (for files tab)
    const [searchQuery, setSearchQuery] = useState('');

    // Modals
    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Ref for scroll container to handle scroll position preservation
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Reply State
    const [replyingTo, setReplyingTo] = useState<CommunityMessage | null>(null);

    // Context Menu State
    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        message: CommunityMessage;
    } | null>(null);

    // File Upload State
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);

    // Delete & Reaction State
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [emojiPickerMessageId, setEmojiPickerMessageId] = useState<string | null>(null);

    // Kick Member State
    const [kickMemberConfirm, setKickMemberConfirm] = useState<{ userId: string; userName: string } | null>(null);
    const [kickingMember, setKickingMember] = useState(false);

    useEffect(() => {
        if (!id) return;
        loadCommunityData();
        loadMembers();

        // Initialize WebSocket
        const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';
        const socket = io(SOCKET_URL, {
            withCredentials: true,
        });

        socket.on('connect', () => {
            console.log('WebSocket connected');
            socket.emit('join_community', id);
        });

        socket.on('connect_error', (err) => {
            console.error('WebSocket connection error:', err);
        });

        socket.on('new_message', (message: CommunityMessage) => {
            setMessages((prev) => [...prev, message]);
            scrollToBottom();
        });

        socket.on('message_pinned', (message: CommunityMessage) => {
            setMessages(prev => prev.map(m => m.id === message.id ? { ...m, isPinned: true } : m));
            setPinnedMessage(message);
        });

        socket.on('message_unpinned', (message: CommunityMessage) => {
            setMessages(prev => prev.map(m => m.id === message.id ? { ...m, isPinned: false } : m));
            if (pinnedMessage?.id === message.id) setPinnedMessage(null);
        });

        socket.on('message_deleted', (data: { messageId: string }) => {
            setMessages(prev => prev.filter(m => m.id !== data.messageId));
        });

        socket.on('reaction_added', (data: { messageId: string; reactions: any[] }) => {
            console.log('=== WEBSOCKET: reaction_added ===', data);
            setMessages(prev => prev.map(m => m.id === data.messageId ? { ...m, reactions: data.reactions } : m));
        });

        socket.on('reaction_removed', (data: { messageId: string; reactions: any[] }) => {
            console.log('=== WEBSOCKET: reaction_removed ===', data);
            setMessages(prev => prev.map(m => m.id === data.messageId ? { ...m, reactions: data.reactions } : m));
        });

        socket.on('member_removed', (data: { userId: string; userName: string; removedBy: string; timestamp: string }) => {
            console.log('=== WEBSOCKET: member_removed ===', data);
            // Remove member from list
            setMembers(prev => prev.filter(m => m.userId !== data.userId));
            // Update member count
            if (community) {
                setCommunity({ ...community, membersCount: community.membersCount - 1 });
            }
            // If current user was removed, redirect
            if (data.userId === user?.id) {
                setError(`You have been removed from this community`);
                setTimeout(() => navigate('/communities'), 2000);
            }
        });

        socketRef.current = socket;

        return () => {
            if (id) {
                socket.emit('leave_community', id);
            }
            socket.disconnect();
        };
    }, [id]);

    useEffect(() => {
        const pinned = messages.find(m => m.isPinned);
        if (pinned) setPinnedMessage(pinned);
    }, [messages]);

    const loadCommunityData = async () => {
        if (!id) return;

        try {
            setLoading(true);
            setPage(0);
            const [communityData, messagesData] = await Promise.all([
                getCommunityDetails(id),
                getMessages(id, MESSAGES_PER_PAGE, 0),
            ]);
            setCommunity(communityData);
            setMessages(messagesData);
            setHasMore(messagesData.length >= MESSAGES_PER_PAGE);
            scrollToBottom();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load community');
        } finally {
            setLoading(false);
        }
    };

    const loadMoreMessages = async () => {
        if (!id || loadingMore || !hasMore) return;

        const scrollContainer = scrollContainerRef.current;
        const oldScrollHeight = scrollContainer?.scrollHeight || 0;

        try {
            setLoadingMore(true);
            const nextPage = page + 1;
            const offset = nextPage * MESSAGES_PER_PAGE;
            const newMessages = await getMessages(id, MESSAGES_PER_PAGE, offset);

            if (newMessages.length < MESSAGES_PER_PAGE) {
                setHasMore(false);
            }

            setMessages(prev => [...newMessages, ...prev]);
            setPage(nextPage);

            requestAnimationFrame(() => {
                if (scrollContainer) {
                    const newScrollHeight = scrollContainer.scrollHeight;
                    scrollContainer.scrollTop = newScrollHeight - oldScrollHeight;
                }
            });

        } catch (err) {
            console.error("Failed to load more messages", err);
        } finally {
            setLoadingMore(false);
        }
    };

    const loadMembers = async () => {
        if (!id || activeTab !== 'members') return;
        try {
            const data = await getCommunityMembers(id);
            setMembers(data.members);
        } catch (err: any) {
            console.error('Failed to load members', err);
        }
    };

    useEffect(() => {
        if (activeTab === 'members') loadMembers();
    }, [activeTab]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!messageInput.trim() && !selectedFile) || !id) return;

        try {
            setSending(true);
            await sendMessage({
                communityId: id,
                content: messageInput.trim() || (selectedFile ? 'File attachment' : ''),
                replyToId: replyingTo?.id,
                file: selectedFile || undefined,
            });
            setMessageInput('');
            setReplyingTo(null);
            setSelectedFile(null);
            setFilePreview(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);

        // Create preview for images and videos
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else if (file.type.startsWith('video/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setFilePreview(null);
        }
    };

    const handleContextMenu = (e: React.MouseEvent, message: CommunityMessage) => {
        e.preventDefault();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            message,
        });
    };

    const handleReply = (message: CommunityMessage) => {
        setReplyingTo(message);
        setContextMenu(null);
    };

    const handlePinToggle = async (message: CommunityMessage) => {
        try {
            if (message.isPinned) {
                await unpinMessage(message.id);
            } else {
                await pinMessage(message.id);
            }
            setContextMenu(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update pin status');
        }
    };

    const scrollToMessage = (messageId: string) => {
        const el = document.getElementById(`message-${messageId}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const handleDelete = async (messageId: string) => {
        try {
            await deleteMessage(messageId);
            setMessages(prev => prev.filter(m => m.id !== messageId));
            setDeleteConfirm(null);
            setContextMenu(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete message');
        }
    };

    const handleReaction = async (messageId: string, emoji: string) => {
        try {
            const message = messages.find(m => m.id === messageId);
            if (!message || !user) return;

            // Find if user already has ANY reaction on this message
            const existingUserReaction = message.reactions?.find(r =>
                r.users?.some((u: any) => u.id === user.id)
            );

            if (existingUserReaction) {
                if (existingUserReaction.emoji === emoji) {
                    // Same emoji tapped -> Remove it (toggle off)
                    await removeReaction(messageId, emoji);
                } else {
                    // Different emoji tapped -> Switch (remove old, add new)
                    await removeReaction(messageId, existingUserReaction.emoji);
                    await addReaction(messageId, emoji);
                }
            } else {
                // No existing reaction -> Add new
                await addReaction(messageId, emoji);
            }

            setEmojiPickerMessageId(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update reaction');
        }
    };

    const toggleEmojiPicker = (messageId: string | null) => {
        setEmojiPickerMessageId(prev => prev === messageId ? null : messageId);
    };

    // Close context menu on click outside
    useEffect(() => {
        const handleClick = () => setContextMenu(null);
        if (contextMenu) {
            document.addEventListener('click', handleClick);
            return () => document.removeEventListener('click', handleClick);
        }
    }, [contextMenu]);

    const handleKickMember = async () => {
        if (!id || !kickMemberConfirm) return;

        try {
            setKickingMember(true);
            await removeCommunityMember(id, kickMemberConfirm.userId);
            setMembers(prev => prev.filter(m => m.userId !== kickMemberConfirm.userId));
            if (community) {
                setCommunity({ ...community, membersCount: community.membersCount - 1 });
            }
            setSuccessMessage(`${kickMemberConfirm.userName} has been removed from the community`);
            setShowSuccess(true);
            setKickMemberConfirm(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to remove member');
            setKickMemberConfirm(null);
        } finally {
            setKickingMember(false);
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
            <div className="flex items-center justify-center h-full min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!community) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[50vh]">
                <p className="text-gray-600 mb-4">Community not found</p>
                {!isModal && (
                    <button onClick={() => navigate('/communities')} className="text-blue-600 hover:underline">
                        Back to Communities
                    </button>
                )}
            </div>
        );
    }

    const fileMessages = messages.filter(m => m.type === 'file' || m.type === 'image' || m.type === 'video');

    return (
        <div className={`flex flex-col bg-white ${isModal ? 'h-full' : 'h-screen'}`}>
            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex-shrink-0">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                        {!isModal && (
                            <button onClick={() => navigate('/communities')} className="lg:hidden text-gray-500">
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                        )}

                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-xl font-bold text-gray-900">{community.name}</h1>
                                <span className="px-2 py-0.5 bg-gray-100 text-xs font-medium text-gray-600 rounded-full">{community.category}</span>
                                {community.isAdmin && (
                                    <button onClick={() => navigate(`/communities/${id}/settings`)} className="text-gray-400 hover:text-gray-600">
                                        <Settings className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <div className="text-sm text-gray-500 mt-0.5 line-clamp-1 max-w-xl">
                                {community.description}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{community.membersCount.toLocaleString()} members</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{community.creditsPeriod} remaining</span>
                        </div>
                        <button onClick={() => setShowLeaveConfirm(true)} className="text-gray-400 hover:text-red-500 transition-colors" title="Leave Community">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6">
                    {['chat', 'members', 'files'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`pb-2 text-sm font-semibold capitalize transition-all border-b-2 ${activeTab === tab
                                ? 'text-gray-900 border-gray-900'
                                : 'text-gray-500 border-transparent hover:text-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden bg-gray-50/50 relative">

                {/* CHAT TAB */}
                {activeTab === 'chat' && (
                    <div className="h-full flex flex-col bg-[#efeae2] relative">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

                        {/* Pinned Message */}
                        {pinnedMessage && (
                            <div className="bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-2 flex items-center gap-3 flex-shrink-0 z-10 shadow-sm mx-4 mt-2 rounded-lg cursor-pointer" onClick={() => {
                                const el = document.getElementById(`message-${pinnedMessage.id}`);
                                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }}>
                                <Pin className="w-3.5 h-3.5 text-blue-600 shrink-0 fill-current" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-xs font-bold text-blue-900 line-clamp-1">{pinnedMessage.senderName}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 line-clamp-1">{pinnedMessage.content}</p>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); setPinnedMessage(null); }} className="text-gray-400 hover:text-gray-600">
                                    <span className="sr-only">Dismiss</span>
                                    &times;
                                </button>
                            </div>
                        )}

                        {/* Messages List */}
                        <div
                            className="flex-1 overflow-y-auto px-4 py-4"
                            ref={scrollContainerRef}
                        >
                            {/* Load More Button */}
                            {hasMore && (
                                <div className="flex justify-center pt-2 pb-4">
                                    <button
                                        onClick={loadMoreMessages}
                                        disabled={loadingMore}
                                        className="px-4 py-1.5 bg-white/80 shadow-sm rounded-full text-xs font-medium text-gray-600 hover:bg-white transition-all disabled:opacity-50"
                                    >
                                        {loadingMore ? 'Loading history...' : 'Load older messages'}
                                    </button>
                                </div>
                            )}

                            {/* Empty State */}
                            {messages.length === 0 && !loading && (
                                <div className="flex flex-col items-center justify-center h-[60%] text-center text-gray-500">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                                        <Send className="w-6 h-6 text-gray-400 ml-1" />
                                    </div>
                                    <p className="text-sm font-medium">No messages yet</p>
                                    <p className="text-xs mt-1">Be the first to say hello!</p>
                                </div>
                            )}

                            {/* Messages */}
                            {messages.map((message) => {
                                const currentUserId = user?.id;
                                const isMe = currentUserId && message.senderId === currentUserId;

                                return (
                                    <div
                                        key={message.id}
                                        id={`message-${message.id}`}
                                        className={`flex mb-2 group ${isMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {/* Message Container */}
                                        <div className={`flex items-end gap-2 max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                            {/* Avatar (only for others) */}
                                            {!isMe && (
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 overflow-hidden">
                                                    {message.senderAvatar ? (
                                                        <img src={message.senderAvatar} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        message.senderName?.charAt(0).toUpperCase() || 'U'
                                                    )}
                                                </div>
                                            )}

                                            {/* Message Bubble */}
                                            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                {/* Sender Name (only for others) */}
                                                {!isMe && (
                                                    <div className="text-xs font-semibold text-gray-700 mb-1 px-3">
                                                        {message.senderName}
                                                    </div>
                                                )}

                                                {/* Bubble */}
                                                <div
                                                    onContextMenu={(e) => handleContextMenu(e, message)}
                                                    className={`relative px-3 py-2 rounded-lg shadow-sm cursor-pointer ${isMe
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-white text-gray-900'
                                                        } ${message.isPinned ? 'ring-2 ring-yellow-400/50' : ''}`}
                                                >
                                                    {message.isPinned && <Pin className="w-3 h-3 absolute -top-1.5 -right-1.5 bg-yellow-100 text-yellow-600 rounded-full p-0.5 box-content border border-white z-10" />}

                                                    {/* Reply Preview */}
                                                    {message.replyTo && (
                                                        <div
                                                            onClick={() => scrollToMessage(message.replyTo!.id)}
                                                            className={`mb-2 p-2 rounded border-l-2 cursor-pointer ${isMe
                                                                ? 'bg-blue-700/30 border-blue-300'
                                                                : 'bg-gray-100 border-gray-400'
                                                                }`}
                                                        >
                                                            <div className={`text-xs font-semibold ${isMe ? 'text-blue-200' : 'text-gray-600'}`}>
                                                                {message.replyTo.senderName}
                                                            </div>
                                                            <div className={`text-xs line-clamp-1 ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                                                                {message.replyTo.content}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Attached Media */}
                                                    {message.type === 'image' && message.fileUrl && (
                                                        <div className="mb-2 -mx-1 -mt-1">
                                                            <img src={message.fileUrl} alt="attachment" className="rounded-lg max-h-60 object-cover w-full cursor-pointer hover:opacity-95 transition-opacity" onClick={() => message.fileUrl && window.open(message.fileUrl, '_blank')} />
                                                        </div>
                                                    )}

                                                    {message.type === 'video' && message.fileUrl && (
                                                        <div className="mb-2 -mx-1 -mt-1">
                                                            <video controls className="rounded-lg max-h-60 w-full" src={message.fileUrl}></video>
                                                        </div>
                                                    )}

                                                    {message.type === 'file' && message.fileUrl && (
                                                        <div className="mb-2 p-3 bg-gray-100 rounded-lg flex items-center gap-3">
                                                            <FileText className="w-8 h-8 text-blue-600" />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-medium truncate">{message.fileName || 'Document'}</div>
                                                            </div>
                                                            <a href={message.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                                                <Download className="w-5 h-5" />
                                                            </a>
                                                        </div>
                                                    )}

                                                    {/* Content - hide if just file placeholder */}
                                                    {message.content && message.content !== 'File attachment' && (
                                                        <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">{message.content}</p>
                                                    )}

                                                    {/* Timestamp */}
                                                    <div className="flex items-center justify-end gap-1 mt-1">
                                                        <span className={`text-[10px] ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                                                            {new Date(message.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                                        </span>
                                                    </div>

                                                    {/* Reactions */}
                                                    {message.reactions && message.reactions.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                                            {message.reactions.map((reaction, idx) => {
                                                                const hasUserReacted = reaction.users?.some((u: any) => u.id === user?.id);
                                                                const userNames = reaction.users?.map((u: any) => u.name).join(', ') || '';
                                                                return (
                                                                    <button
                                                                        key={idx}
                                                                        onClick={() => handleReaction(message.id, reaction.emoji)}
                                                                        className={`group relative px-2.5 py-1 rounded-full text-sm flex items-center gap-1 transition-all duration-200 hover:scale-105 ${hasUserReacted
                                                                            ? 'bg-blue-100 border-2 border-blue-400 shadow-sm'
                                                                            : 'bg-white border border-gray-200 hover:bg-gray-50 shadow-sm'
                                                                            }`}
                                                                    >
                                                                        <span className="text-base">{reaction.emoji}</span>
                                                                        <span className={`text-xs font-semibold ${hasUserReacted ? 'text-blue-600' : 'text-gray-600'}`}>
                                                                            {reaction.count}
                                                                        </span>
                                                                        {/* Tooltip */}
                                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-20">
                                                                            {userNames}
                                                                        </div>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    )}

                                                    {/* Emoji Picker */}
                                                    {emojiPickerMessageId === message.id && (
                                                        <div
                                                            className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex gap-1 z-10"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {['👍', '❤️', '😂', '😮', '😢', '🎉'].map(emoji => (
                                                                <button
                                                                    key={emoji}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        console.log('Emoji button clicked:', emoji);
                                                                        handleReaction(message.id, emoji);
                                                                    }}
                                                                    className="text-2xl hover:scale-125 transition-transform p-1 hover:bg-gray-100 rounded"
                                                                >
                                                                    {emoji}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Message Action Buttons (Visible on Hover/Touch) */}
                                                    <div className={`absolute top-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${isMe ? '-left-16' : '-right-16'}`}>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleEmojiPicker(message.id);
                                                            }}
                                                            className={`p-1 rounded-full shadow-sm ${isMe ? 'bg-gray-100 text-gray-600 hover:bg-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                                        >
                                                            <Smile className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleContextMenu(e, message);
                                                            }}
                                                            className={`p-1 rounded-full shadow-sm ${isMe ? 'bg-gray-100 text-gray-600 hover:bg-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                                        >
                                                            <MoreVertical className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} className="h-2" />
                        </div>

                        {/* Input Area */}
                        <div className="bg-[#f0f2f5] flex flex-col shrink-0">
                            {/* Reply Preview Bar */}
                            {replyingTo && (
                                <div className="px-4 pt-3 pb-2 bg-white/50 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <Reply className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs font-semibold text-blue-600">
                                                    Replying to {replyingTo.senderName}
                                                </div>
                                                <div className="text-xs text-gray-500 truncate">
                                                    {replyingTo.content}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setReplyingTo(null)}
                                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                                        >
                                            <X className="w-4 h-4 text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* File Preview */}
                            {selectedFile && (
                                <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                                    <div className="flex items-center justify-between bg-white rounded-lg p-2 shadow-sm">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            {filePreview && selectedFile.type.startsWith('image/') ? (
                                                <img src={filePreview} alt="preview" className="w-12 h-12 object-cover rounded" />
                                            ) : filePreview && selectedFile.type.startsWith('video/') ? (
                                                <video src={filePreview} className="w-12 h-12 object-cover rounded" />
                                            ) : (
                                                <div className="w-12 h-12 bg-blue-50 rounded flex items-center justify-center">
                                                    <FileText className="w-6 h-6 text-blue-600" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium truncate">
                                                    {selectedFile.name}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {(selectedFile.size / 1024).toFixed(1)} KB
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedFile(null);
                                                setFilePreview(null);
                                            }}
                                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                                        >
                                            <X className="w-4 h-4 text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="px-4 py-3 flex items-end gap-2">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*,video/*,.pdf,.doc,.docx"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors mb-1"
                                >
                                    <Paperclip className="w-6 h-6" />
                                </button>

                                <form onSubmit={handleSendMessage} className="flex-1 flex items-end gap-2 bg-white rounded-2xl px-4 py-2 shadow-sm border border-transparent focus-within:border-gray-200 focus-within:shadow-md transition-all">
                                    <textarea
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage(e as any);
                                            }
                                        }}
                                        placeholder="Type a message"
                                        className="flex-1 max-h-32 min-h-[24px] py-1 bg-transparent border-none focus:ring-0 resize-none text-[15px] outline-none placeholder:text-gray-400 scrollbar-hide"
                                        rows={1}
                                        style={{ height: 'auto', overflow: 'hidden' }}
                                        onInput={(e) => {
                                            const target = e.target as HTMLTextAreaElement;
                                            target.style.height = 'auto';
                                            target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                                        }}
                                    />
                                </form>

                                <button
                                    onClick={(e) => handleSendMessage(e as any)}
                                    disabled={(!messageInput.trim() && !selectedFile) || sending}
                                    className={`p-3 rounded-full mb-1 transition-all shadow-sm ${(messageInput.trim() || selectedFile)
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 rotate-0 scale-100'
                                        : 'bg-transparent text-gray-400 scale-90'
                                        }`}
                                >
                                    <Send className="w-5 h-5 fill-current" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MEMBERS TAB */}
                {activeTab === 'members' && (
                    <div className="h-full overflow-y-auto p-6">
                        <div className="max-w-3xl mx-auto space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Community Members ({community.membersCount})</h3>
                            {members.map((member) => (
                                <div key={member.id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold overflow-hidden">
                                            {member.userAvatar ? <img src={member.userAvatar} alt="" className="w-full h-full object-cover" /> : (member.userName?.[0] || 'U')}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{member.userName || 'Unknown User'}</h4>
                                            <p className="text-xs text-gray-500">Joined {new Date(member.joinedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {member.role === 'admin' ? (
                                            <span className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded-md border border-yellow-100 flex items-center gap-1">
                                                <Crown className="w-3 h-3" /> Admin
                                            </span>
                                        ) : (
                                            <span className="text-xs text-gray-500 px-2">Member</span>
                                        )}
                                        {community.isAdmin && member.userId !== user?.id && member.role !== 'admin' && (
                                            <button
                                                onClick={() => setKickMemberConfirm({ userId: member.userId, userName: member.userName || 'this member' })}
                                                className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
                                                title="Remove member"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* FILES TAB */}
                {activeTab === 'files' && (
                    <div className="h-full overflow-y-auto p-6">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Shared Files</h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search files..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {fileMessages.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>No files shared yet</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {fileMessages.map((msg) => (
                                        <div key={msg.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 group hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className={`p-2 rounded-lg ${msg.type === 'image' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                                    {msg.type === 'image' ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                                </div>
                                                <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <h4 className="font-medium text-gray-900 mb-1 truncate" title={msg.fileName || 'Untitled'}>{msg.fileName || 'Attachment'}</h4>
                                            <p className="text-xs text-gray-500 mb-4">Shared by {msg.senderName}</p>
                                            <a
                                                href={msg.fileUrl || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full text-center py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                                            >
                                                Download
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Context Menu */}
            {contextMenu && (
                <div
                    className="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[160px]"
                    style={{
                        top: contextMenu.y,
                        left: contextMenu.x,
                    }}
                >
                    <button
                        onClick={() => handleReply(contextMenu.message)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 transition-colors"
                    >
                        <Reply className="w-4 h-4" />
                        Reply
                    </button>
                    {community?.isAdmin && (
                        <button
                            onClick={() => handlePinToggle(contextMenu.message)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 transition-colors"
                        >
                            <Pin className="w-4 h-4" />
                            {contextMenu.message.isPinned ? 'Unpin' : 'Pin'}
                        </button>
                    )}
                    {(contextMenu.message.senderId === user?.id || community?.isAdmin) && (
                        <button
                            onClick={() => { setDeleteConfirm(contextMenu.message.id); setContextMenu(null); }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors"
                        >
                            <X className="w-4 h-4" />
                            Delete
                        </button>
                    )}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Message?</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            This action cannot be undone. The message will be permanently deleted.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Kick Member Confirmation Modal */}
            {kickMemberConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Remove Member?</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to remove <span className="font-semibold">{kickMemberConfirm.userName}</span> from this community? 
                            They will be notified and will need to rejoin if they want to come back.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setKickMemberConfirm(null)}
                                disabled={kickingMember}
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleKickMember}
                                disabled={kickingMember}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {kickingMember ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Removing...
                                    </>
                                ) : (
                                    'Remove Member'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
