import React, { useState } from 'react';
import { Search, Link as LinkIcon, Users, MessageSquare, LogOut, RefreshCw } from 'lucide-react';
import { Community } from '../../types/community';
// import CommunityChatModal from '../../components/communities/CommunityChatModal';
// import CreateCommunityModal from '../../components/communities/CreateCommunityModal';

// Mock Data
const MOCK_COMMUNITIES: Community[] = [
    {
        id: '1',
        name: 'Web Developers Circle',
        description: 'Connect with fellow developers, share resources, and collaborate on projects',
        category: 'Technology',
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
        membersCount: 1247,
        creditsCost: 5,
        creditsPeriod: '30 days',
        isJoined: true,
        daysRemaining: 25,
        isAutoRenew: true
    },
    {
        id: '2',
        name: 'Language Learners Hub',
        description: 'Practice languages with native speakers and polyglots from around the world',
        category: 'Languages',
        imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800',
        membersCount: 892,
        creditsCost: 3,
        creditsPeriod: '30 days',
        isJoined: false
    },
    {
        id: '3',
        name: 'Creative Minds',
        description: 'Artists, designers, and creative professionals sharing inspiration',
        category: 'Creative',
        imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800',
        membersCount: 634,
        creditsCost: 4,
        creditsPeriod: '30 days',
        isJoined: false
    },
    {
        id: '4',
        name: 'Fitness & Wellness',
        description: 'Health enthusiasts supporting each other on fitness journeys',
        category: 'Fitness',
        imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800',
        membersCount: 1056,
        creditsCost: 4,
        creditsPeriod: '30 days',
        isJoined: false
    }
];

const FILTERS = ['All', 'Technology', 'Languages', 'Music', 'Fitness', 'Creative', 'Professional', 'Business'];

export default function CommunitiesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('All');
    // const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
    // const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // In a real app, this would be handled by a backend call and redux/context
    const [communities, setCommunities] = useState<Community[]>(MOCK_COMMUNITIES);

    // const handleCreateCommunity = (newCommunity: Partial<Community>) => {
    //     const community: Community = {
    //         id: Date.now().toString(),
    //         name: newCommunity.name || 'New Community',
    //         description: newCommunity.description || '',
    //         category: newCommunity.category || 'Technology',
    //         imageUrl: newCommunity.imageUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
    //         membersCount: 1,
    //         creditsCost: newCommunity.creditsCost || 0,
    //         creditsPeriod: newCommunity.creditsPeriod || '30 days',
    //         isJoined: true,
    //         isAutoRenew: true, // Default to true for creator
    //         daysRemaining: 30, // Default for creator
    //         adminId: 'currentUser', // Mock user ID
    //         ...newCommunity
    //     } as Community;

    //     setCommunities([community, ...communities]);
    // };

    const handleToggleAutoRenew = (id: string) => {
        setCommunities(communities.map(c =>
            c.id === id ? { ...c, isAutoRenew: !c.isAutoRenew } : c
        ));
    };

    const filteredCommunities = communities.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = selectedFilter === 'All' || c.category === selectedFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200 pt-8 pb-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Communities</h1>
                    <p className="text-gray-500 mb-8">Connect with like-minded learners and experts</p>

                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1 max-w-lg">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search communities..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {FILTERS.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setSelectedFilter(filter)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedFilter === filter
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    <StatsCard title="Your Credits" value="45" icon={<LinkIcon className="w-5 h-5 text-blue-600" />} />
                    <StatsCard title="Total Communities" value={communities.length.toString()} />
                    <StatsCard title="Communities Joined" value={communities.filter(c => c.isJoined).length.toString()} />
                </div>

                {/* Communities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {filteredCommunities.map((community) => (
                        <CommunityCard
                            key={community.id}
                            community={community}
                            onViewMessages={() => {/* setSelectedCommunity(community) */ }}
                            onToggleAutoRenew={() => handleToggleAutoRenew(community.id)}
                        />
                    ))}
                </div>

                {/* Create Community CTA */}
                <div className="mt-16 text-center bg-gradient-to-b from-blue-50/50 to-white rounded-3xl p-12 border border-blue-100 shadow-sm">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl rotate-3 flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Users className="w-8 h-8 text-blue-600 -rotate-3" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Want to create your own community?</h2>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">Build a space for people to connect, share knowledge, and grow together.</p>
                    <button
                        onClick={() => {/* setIsCreateModalOpen(true) */ }}
                        className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 active:scale-95 flex items-center gap-2 mx-auto"
                    >
                        <Users className="w-5 h-5" />
                        Create Community
                    </button>
                </div>
            </div>

            {/* Modals */}
            {/* TODO: Implement CommunityChatModal component */}
            {/* {selectedCommunity && (
                <CommunityChatModal
                    community={selectedCommunity}
                    onClose={() => setSelectedCommunity(null)}
                />
            )} */}

            {/* TODO: Implement CreateCommunityModal component */}
            {/* {isCreateModalOpen && (
                <CreateCommunityModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreate={handleCreateCommunity}
                />
            )} */}
        </div>
    );
}

function StatsCard({ title, value, icon }: { title: string; value: string; icon?: React.ReactNode }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-gray-500 text-sm font-medium mb-4">{title}</p>
            <div className="flex items-center gap-3">
                {icon ? (
                    <div className="flex items-center gap-2">
                        {icon}
                        <span className="text-3xl font-bold text-gray-900">{value}</span>
                    </div>
                ) : (
                    <span className="text-3xl font-bold text-gray-900">{value}</span>
                )}
            </div>
        </div>
    );
}

function CommunityCard({
    community,
    onViewMessages,
    onToggleAutoRenew
}: {
    community: Community;
    onViewMessages: () => void;
    onToggleAutoRenew: () => void;
}) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full">
            <div className="h-48 overflow-hidden relative">
                <img
                    src={community.imageUrl}
                    alt={community.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
                    {community.category}
                </div>
            </div>
            <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{community.name}</h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-1">{community.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{community.membersCount.toLocaleString()} members</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" />
                        <span>{community.creditsCost} credits/{community.creditsPeriod === '30 days' ? 'mo' : 'period'}</span>
                    </div>
                </div>

                {community.isJoined ? (
                    <div className="flex flex-col gap-3 mt-auto">
                        <div className="flex gap-3">
                            <button
                                onClick={onViewMessages}
                                className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/10 hover:shadow-blue-600/20 flex items-center justify-center gap-2 active:scale-95"
                            >
                                <MessageSquare className="w-4 h-4" />
                                View Messages
                            </button>

                            <button className="text-gray-400 hover:text-red-500 px-3 py-2 border border-gray-200 rounded-lg hover:bg-red-50 transition-colors" title="Leave Community">
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Restore Auto-Renew Option */}
                        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-gray-100 mt-1">
                            <div className="flex items-center gap-2">
                                <RefreshCw className={`w-3.5 h-3.5 ${community.isAutoRenew ? 'text-blue-600' : 'text-gray-400'}`} />
                                <span className={`text-xs font-medium ${community.isAutoRenew ? 'text-blue-700' : 'text-gray-500'}`}>
                                    {community.isAutoRenew ? 'Auto-renew On' : 'Auto-renew Off'}
                                </span>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleAutoRenew();
                                }}
                                className={`text-[10px] font-bold px-2 py-1 rounded-md transition-colors ${community.isAutoRenew
                                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                    }`}
                            >
                                {community.isAutoRenew ? 'DISABLE' : 'ENABLE'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <button className="w-full bg-white text-blue-600 border-2 border-blue-600 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-2 mt-auto group">
                        <span>Join Community</span>
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold group-hover:bg-blue-200 transition-colors">
                            {community.creditsCost} credits
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
}
