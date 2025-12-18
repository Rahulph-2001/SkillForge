import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Crown, Plus } from 'lucide-react';
import { getCommunities, joinCommunity, Community } from '../../services/communityService';
import CreateCommunityModal from './CreateCommunityModal';
import SuccessModal from '../common/Modal/SuccessModal';
import ErrorModal from '../common/Modal/ErrorModal';
import ConfirmModal from '../common/Modal/ConfirmModal';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

export default function CommunityList() {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user);
    const [communities, setCommunities] = useState<Community[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
    const [showJoinConfirm, setShowJoinConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        loadCommunities();
    }, []);

    const loadCommunities = async () => {
        try {
            setLoading(true);
            const data = await getCommunities();
            setCommunities(data);
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

    const handleJoinConfirm = async () => {
        if (!selectedCommunity) return;

        try {
            await joinCommunity(selectedCommunity.id);
            setShowJoinConfirm(false);
            setSuccessMessage(
                `Successfully joined ${selectedCommunity.name}! ${selectedCommunity.creditsCost} credits deducted.`
            );
            setShowSuccess(true);

            setTimeout(() => {
                navigate(`/communities/${selectedCommunity.id}`);
            }, 2000);
        } catch (err: any) {
            setShowJoinConfirm(false);
            setError(err.response?.data?.message || 'Failed to join community');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Communities</h1>
                    <p className="text-gray-600 mt-1">Connect and learn with others</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Create Community
                </button>
            </div>

            {/* Communities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {communities.map((community) => (
                    <div
                        key={community.id}
                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden cursor-pointer"
                        onClick={() => navigate(`/communities/${community.id}`)}
                    >
                        {/* Image */}
                        <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                            {community.imageUrl ? (
                                <img
                                    src={community.imageUrl}
                                    alt={community.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <Users className="w-16 h-16 text-white opacity-50" />
                                </div>
                            )}
                            <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-semibold">
                                {community.category}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                                {community.name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {community.description}
                            </p>

                            {/* Stats */}
                            <div className="flex items-center justify-between mb-4">
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

                            {/* Credits */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-sm">
                                    <span className="font-semibold text-gray-900">
                                        {community.creditsCost} credits
                                    </span>
                                    <span className="text-gray-500"> / {community.creditsPeriod}</span>
                                </div>
                            </div>

                            {/* Action Button */}
                            {!community.isAdmin && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleJoinClick(community);
                                    }}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors"
                                >
                                    Join Community
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {communities.length === 0 && (
                <div className="text-center py-16">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Communities Found</h3>
                    <p className="text-gray-600 mb-6">Be the first to create a community!</p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
                    >
                        Create Community
                    </button>
                </div>
            )}

            {/* Modals */}
            <CreateCommunityModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={loadCommunities}
            />

            <ConfirmModal
                isOpen={showJoinConfirm}
                title="Join Community"
                message={`Are you sure you want to join "${selectedCommunity?.name}"? This will deduct ${selectedCommunity?.creditsCost} credits from your account.`}
                type="warning"
                onConfirm={handleJoinConfirm}
                onCancel={() => setShowJoinConfirm(false)}
            />

            <SuccessModal
                isOpen={showSuccess}
                title="Successfully Joined!"
                message={successMessage}
                onClose={() => setShowSuccess(false)}
            />

            <ErrorModal
                isOpen={!!error}
                message={error || ''}
                onClose={() => setError(null)}
            />
        </div>
    );
}
