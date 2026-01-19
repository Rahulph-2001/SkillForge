import { useState, useEffect } from 'react';
import { Users, Search, Plus, Zap, LayoutGrid, CheckCircle, Loader2 } from 'lucide-react';
import { getCommunities, joinCommunity, Community, leaveCommunity } from '../../services/communityService';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../common/Pagination';
import CreateCommunityModal from './CreateCommunityModal';
import SuccessModal from '../common/Modal/SuccessModal';
import ErrorModal from '../common/Modal/ErrorModal';
import ConfirmModal from '../common/Modal/ConfirmModal';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import ChatModal from './ChatModal';
import CommunityCard from './CommunityCard';

export default function CommunityList() {
    const user = useSelector((state: RootState) => state.auth.user);
    const [communities, setCommunities] = useState<Community[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [totalItems, setTotalItems] = useState(0);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const {
        page: currentPage,
        totalPages,
        goToPage: setCurrentPage,
    } = usePagination({
        totalItems,
        initialLimit: 12,
        initialPage: 1
    });

    const categories = ['All', 'Technology', 'Languages', 'Music', 'Fitness', 'Creative', 'Professional', 'Business'];

    // Modal States
    const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
    const [selectedCommunityForChat, setSelectedCommunityForChat] = useState<Community | null>(null);
    const [showJoinConfirm, setShowJoinConfirm] = useState(false);
    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        loadCommunities();
    }, [currentPage, searchQuery, selectedCategory]);

    const loadCommunities = async () => {
        try {
            setLoading(true);
            const data = await getCommunities(
                currentPage,
                12,
                searchQuery || undefined,
                selectedCategory !== 'All' ? selectedCategory : undefined
            );
            setCommunities(data.communities);
            setTotalItems(data.total);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load communities');
        } finally {
            setLoading(false);
        }
    };

    const handleJoinClick = (community: Community) => {
        if (!user) {
            setError('Please login to join a community');
            return;
        }
        setSelectedCommunity(community);
        setShowJoinConfirm(true);
    };

    const handleLeaveClick = (community: Community) => {
        setSelectedCommunity(community);
        setShowLeaveConfirm(true);
    };

    const handleJoinConfirm = async () => {
        if (!selectedCommunity) return;

        try {
            await joinCommunity(selectedCommunity.id);
            setShowJoinConfirm(false);
            setSuccessMessage(
                `Successfully joined ${selectedCommunity.name}! ${selectedCommunity.creditsCost} credits deducted.`
            );
            setShowSuccess(true);
            loadCommunities(); // Reload to update UI state
        } catch (err: any) {
            setShowJoinConfirm(false);
            setError(err.response?.data?.message || 'Failed to join community');
        }
    };

    const handleLeaveConfirm = async () => {
        if (!selectedCommunity) return;

        try {
            await leaveCommunity(selectedCommunity.id);
            setShowLeaveConfirm(false);
            setSuccessMessage(`You have left ${selectedCommunity.name}.`);
            setShowSuccess(true);
            loadCommunities();
        } catch (err: any) {
            setShowLeaveConfirm(false);
            setError(err.response?.data?.message || 'Failed to leave community');
        }
    };

    // Stats Logic
    const stats = [
        {
            label: 'Your Credits',
            value: user?.credits || 0,
            icon: Zap,
            color: 'text-blue-600'
        },
        {
            label: 'Total Communities',
            value: totalItems,
            icon: LayoutGrid,
            color: 'text-purple-600'
        },
        {
            label: 'Communities Joined',
            value: communities.filter(c => c.isJoined || c.isAdmin).length, // Note: This is only for current page
            icon: CheckCircle,
            color: 'text-emerald-600'
        },
        // Approximating total members from current page or just removing this stat if not available from API globally
        {
            label: 'Total Members',
            value: communities.reduce((acc, curr) => acc + curr.membersCount, 0).toLocaleString(),
            icon: Users,
            color: 'text-orange-600'
        }
    ];

    if (loading && communities.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Communities</h1>
                    <p className="text-gray-500 mt-2">Connect with like-minded learners and experts</p>
                </div>

                {/* Search Bar */}
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search communities..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm"
                    />
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                setSelectedCategory(cat);
                                setCurrentPage(1);
                            }}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <h4 className="text-sm font-medium text-gray-500 mb-1">{stat.label}</h4>
                            <div className="flex items-center gap-3">
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Communities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {communities.map((community) => (
                        <CommunityCard
                            key={community.id}
                            community={community}
                            onJoin={handleJoinClick}
                            onLeave={handleLeaveClick}
                            onViewMessages={() => setSelectedCommunityForChat(community)}
                        />
                    ))}
                </div>

                {/* Empty State */}
                {!loading && communities.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Communities Found</h3>
                        <p className="text-gray-500 mb-6">Try adjusting your filters or create a new community.</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md shadow-blue-200 transition-all flex items-center gap-2 mx-auto"
                        >
                            <Plus className="w-5 h-5" />
                            Create Community
                        </button>
                    </div>
                )}

                {/* Floating Create Button */}
                {!loading && communities.length > 0 && (
                    <div className="flex justify-center mt-12 mb-8">
                        <div className="bg-blue-50/50 p-8 rounded-2xl text-center w-full max-w-2xl border border-blue-100">
                            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Want to create your own community?</h3>
                            <p className="text-gray-600 mb-6 text-sm">Build a space for people to connect, share knowledge, and grow together</p>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-lg shadow-blue-200 hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
                            >
                                <Plus className="w-5 h-4" />
                                Create Community
                            </button>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="mt-8 mb-12">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            limit={12}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}

                {/* Modals */}
                <CreateCommunityModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        loadCommunities();
                        setShowCreateModal(false);
                    }}
                />

                <ConfirmModal
                    isOpen={showJoinConfirm}
                    title="Join Community"
                    message={`Are you sure you want to join "${selectedCommunity?.name}"? ${selectedCommunity?.creditsCost} credits will be deducted.`}
                    type="warning"
                    confirmText="Join Now"
                    onConfirm={handleJoinConfirm}
                    onCancel={() => setShowJoinConfirm(false)}
                />

                <ConfirmModal
                    isOpen={showLeaveConfirm}
                    title="Leave Community"
                    message={`Are you sure you want to leave "${selectedCommunity?.name}"? You will lose access to messages and need to pay credits again to rejoin.`}
                    type="danger"
                    confirmText="Yes, Leave"
                    onConfirm={handleLeaveConfirm}
                    onCancel={() => setShowLeaveConfirm(false)}
                />

                {selectedCommunityForChat && (
                    <ChatModal
                        isOpen={!!selectedCommunityForChat}
                        onClose={() => setSelectedCommunityForChat(null)}
                        communityId={selectedCommunityForChat.id}
                    />
                )}

                <SuccessModal
                    isOpen={showSuccess}
                    title="Success!"
                    message={successMessage}
                    onClose={() => setShowSuccess(false)}
                />

                <ErrorModal
                    isOpen={!!error}
                    message={error || ''}
                    onClose={() => setError(null)}
                />
            </div>
        </div>
    );
}
