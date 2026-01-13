import React, { useState } from 'react';
import { Users, MessageSquare, Plus, Check } from 'lucide-react';
import { Community } from '../../services/communityService';
import { useNavigate } from 'react-router-dom';

interface CommunityCardProps {
    community: Community;
    onJoin: (community: Community) => void;
    onLeave?: (community: Community) => void;
    onViewMessages?: (community: Community) => void;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community, onJoin, onLeave, onViewMessages }) => {
    const navigate = useNavigate();
    const [autoRenew, setAutoRenew] = useState(false);

    return (
        <div
            className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full"
        >
            {/* Image Section */}
            <div className="h-48 relative overflow-hidden group">
                {community.imageUrl ? (
                    <>
                        <img
                            src={community.imageUrl}
                            alt={community.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                                // Fallback to placeholder if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const placeholder = target.nextElementSibling as HTMLElement;
                                if (placeholder) placeholder.style.display = 'flex';
                            }}
                        />
                        <div className="hidden w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 items-center justify-center">
                            <Users className="w-16 h-16 text-white/50" />
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <Users className="w-16 h-16 text-white/50" />
                    </div>
                )}
                <div className="absolute top-3 right-3">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        {community.category}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1 hover:text-blue-600 transition-colors cursor-pointer" onClick={() => onViewMessages ? onViewMessages(community) : navigate(`/communities/${community.id}`)}>
                        {community.name}
                    </h3>
                </div>

                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
                    {community.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-xs text-gray-500 font-medium border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{community.membersCount.toLocaleString()} members</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <span> {community.creditsCost} credits</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 mt-auto">
                    {community.isJoined || community.isAdmin ? (
                        <div className="space-y-3">
                            <button
                                onClick={() => onViewMessages ? onViewMessages(community) : navigate(`/communities/${community.id}`)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                                <MessageSquare className="w-4 h-4" />
                                View Messages
                            </button>

                            <div className="flex items-center justify-between px-1">
                                <span className="text-xs text-gray-600 font-medium flex items-center gap-1.5">
                                    <div className={`w-3 h-3 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer transition-colors ${autoRenew ? 'bg-blue-600 border-blue-600' : 'bg-transparent'}`} onClick={() => setAutoRenew(!autoRenew)}>
                                        {autoRenew && <Check className="w-2 h-2 text-white" />}
                                    </div>
                                    Auto-renew Off
                                </span>
                                {onLeave && !community.isAdmin && (
                                    <button
                                        onClick={() => onLeave(community)}
                                        className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        Leave
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => onJoin(community)}
                            className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Join ({community.creditsCost} credits)
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommunityCard;
