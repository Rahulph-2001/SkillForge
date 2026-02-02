
import React, { useState, useEffect, useRef } from 'react';
import { Send, Check } from 'lucide-react';
import { useWebSocket } from '../../contexts/WebSocketContext';
import projectService, { ProjectMessage } from '../../services/projectService';
import { useAppSelector } from '../../store/hooks';
import { toast } from 'react-hot-toast';

interface ProjectChatProps {
    projectId: string;
    currentUserId: string;
    isClient: boolean;
    isModal?: boolean;
}

export default function ProjectChat({ projectId, currentUserId, isClient, isModal = false }: ProjectChatProps) {
    const [messages, setMessages] = useState<ProjectMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { socket } = useWebSocket();
    const user = useAppSelector(state => state.auth.user);

    useEffect(() => {
        fetchMessages();
    }, [projectId]);

    useEffect(() => {
        if (!socket) return;

        const handleMessage = (data: { message: ProjectMessage, projectId: string }) => {
            if (data.projectId === projectId) {
                setMessages(prev => [...prev, data.message]);
                scrollToBottom();
            }
        };

        socket.on('project_message_received', handleMessage);

        return () => {
            socket.off('project_message_received', handleMessage);
        };
    }, [socket, projectId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const data = await projectService.getMessages(projectId);
            setMessages(data);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
            if (!isModal) toast.error('Failed to load chat history');
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        try {
            setSending(true);
            const message = await projectService.sendMessage(projectId, newMessage);
            setMessages(prev => [...prev, { ...message, isMine: true, sender: { id: user?.id || '', name: user?.name || 'Me', avatarUrl: user?.avatar || undefined } }]);
            setNewMessage('');
            scrollToBottom();
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col h-full ${!isModal ? 'bg-white rounded-xl border border-gray-200 shadow-sm h-[600px]' : ''}`}>
            {/* Header - Only render if not in modal */}
            {!isModal && (
                <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                    <h3 className="font-semibold text-gray-900">Project Chat</h3>
                    <p className="text-xs text-gray-500">
                        Communication with {isClient ? 'Contributor' : 'Project Owner'}
                    </p>
                </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/50">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-2">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <Send className="w-5 h-5 text-gray-300 ml-1" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-600">No messages yet</p>
                            <p className="text-sm">Start the conversation!</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.senderId === currentUserId;
                        const showAvatar = !isMe && (index === 0 || messages[index - 1].senderId !== msg.senderId);

                        return (
                            <div
                                key={msg.id}
                                className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                {!isMe && (
                                    <div className="w-8 h-8 flex-shrink-0 mt-1">
                                        {showAvatar ? (
                                            msg.sender?.avatarUrl ? (
                                                <img src={msg.sender.avatarUrl} alt={msg.sender.name} className="w-full h-full rounded-full object-cover border border-gray-200" />
                                            ) : (
                                                <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold border border-blue-200">
                                                    {msg.sender?.name?.charAt(0) || '?'}
                                                </div>
                                            )
                                        ) : <div className="w-8" />}
                                    </div>
                                )}

                                <div className={`max-w-[75%] space-y-1`}>
                                    {!isMe && showAvatar && (
                                        <p className="text-xs text-gray-500 ml-1">
                                            {msg.sender?.name || 'User'}
                                        </p>
                                    )}
                                    <div
                                        className={`px-4 py-2.5 shadow-sm relative group ${isMe
                                            ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm'
                                            : 'bg-white text-gray-900 border border-gray-200 rounded-2xl rounded-tl-sm'
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                        <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity ${isMe ? 'text-blue-100' : 'text-gray-400'
                                            }`}>
                                            <span>
                                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                            {isMe && (
                                                <Check className="w-3 h-3" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className={`p-4 border-t border-gray-100 bg-white ${!isModal ? 'rounded-b-xl' : ''}`}>
                <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm placeholder:text-gray-400"
                        disabled={sending}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg shadow-blue-600/20 active:scale-95 flex-shrink-0"
                    >
                        <Send className="w-5 h-5 pointer-events-none" />
                    </button>
                </div>
            </form>
        </div>
    );
}
