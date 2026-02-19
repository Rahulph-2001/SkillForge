import React, { useState, useEffect, useCallback } from 'react';
import { Search, Users, Eye, Edit2, Ban, CheckCircle } from 'lucide-react';
import { getAdminCommunities, blockCommunityByAdmin, unblockCommunityByAdmin, Community } from '../../services/communityService';
import CommunityDetailsModal from '../../components/admin/CommunityDetailsModal';
import EditCommunityModal from '../../components/community/EditCommunityModal';
import ConfirmModal from '../../components/common/Modal/ConfirmModal';
import SuccessModal from '../../components/common/Modal/SuccessModal';
import ErrorModal from '../../components/common/Modal/ErrorModal';
import Pagination from '../../components/common/pagination/Pagination';

const AdminCommunitiesPage: React.FC = () => {
    const [communities, setCommunities] = useState<Community[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [stats, setStats] = useState({
        totalCommunities: 0,
        totalMembers: 0,
        avgMembershipCost: 0
    });

    // Pagination state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(12);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Modal states
    const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showBlockConfirm, setShowBlockConfirm] = useState(false);
    const [showUnblockConfirm, setShowUnblockConfirm] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1); // Reset to first page on search
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch communities when page, limit, or debounced search changes
    useEffect(() => {
        fetchCommunities();
    }, [page, limit, debouncedSearch]);

    const fetchCommunities = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAdminCommunities(page, limit, debouncedSearch || undefined);

            setCommunities(data.communities);
            setStats(data.stats);
            setTotalPages(data.pagination.totalPages);
            setTotalItems(data.pagination.total);
        } catch (error) {
            console.error('Failed to fetch communities:', error);
            setErrorMessage('Failed to load communities. Please try again.');
            setShowErrorModal(true);
        } finally {
            setLoading(false);
        }
    }, [page, limit, debouncedSearch]);

    // Handle pagination changes
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        setPage(1); // Reset to first page when changing limit
    };

    const handleViewDetails = (community: Community) => {
        setSelectedCommunity(community);
        setShowDetailsModal(true);
    };

    const handleEditClick = (community: Community) => {
        setSelectedCommunity(community);
        setShowEditModal(true);
    };

    const handleBlockClick = (community: Community) => {
        setSelectedCommunity(community);
        setShowBlockConfirm(true);
    };

    const handleUnblockClick = (community: Community) => {
        setSelectedCommunity(community);
        setShowUnblockConfirm(true);
    };

    const handleConfirmBlock = async () => {
        if (!selectedCommunity) return;

        setIsProcessing(true);
        try {
            await blockCommunityByAdmin(selectedCommunity.id);

            // Update local state
            setCommunities(prev => prev.map(c =>
                c.id === selectedCommunity.id ? { ...c, isActive: false } : c
            ));

            setSuccessMessage(`Community "${selectedCommunity.name}" has been successfully blocked.`);
            setShowSuccessModal(true);
            setShowBlockConfirm(false);
            setSelectedCommunity(null);
        } catch (error: any) {
            console.error('Failed to block community:', error);
            setErrorMessage(error.response?.data?.message || 'Failed to block community. Please try again.');
            setShowErrorModal(true);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleConfirmUnblock = async () => {
        if (!selectedCommunity) return;

        setIsProcessing(true);
        try {
            await unblockCommunityByAdmin(selectedCommunity.id);

            // Update local state
            setCommunities(prev => prev.map(c =>
                c.id === selectedCommunity.id ? { ...c, isActive: true } : c
            ));

            setSuccessMessage(`Community "${selectedCommunity.name}" has been successfully unblocked.`);
            setShowSuccessModal(true);
            setShowUnblockConfirm(false);
            setSelectedCommunity(null);
        } catch (error: any) {
            console.error('Failed to unblock community:', error);
            setErrorMessage(error.response?.data?.message || 'Failed to unblock community. Please try again.');
            setShowErrorModal(true);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleEditSuccess = () => {
        setShowEditModal(false);
        setSelectedCommunity(null);
        fetchCommunities(); // Refresh the list
    };

    return (
        <div className="min-h-screen bg-muted/40">
            <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-foreground">Communities Management</h1>
                    <p className="text-muted-foreground mt-1">Manage all platform communities</p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search communities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-border bg-background rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-foreground placeholder-muted-foreground"
                        />
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-muted-foreground">Total Communities</p>
                        </div>
                        <h3 className="text-3xl font-bold text-foreground">{stats.totalCommunities}</h3>
                    </div>

                    <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                        </div>
                        <h3 className="text-3xl font-bold text-foreground">{stats.totalMembers.toLocaleString()}</h3>
                    </div>

                    <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-muted-foreground">Avg. Membership Cost</p>
                        </div>
                        <h3 className="text-3xl font-bold text-foreground">{stats.avgMembershipCost}</h3>
                    </div>
                </div>

                {/* Communities Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : communities.length === 0 ? (
                    <div className="bg-card rounded-lg border border-border p-12 text-center">
                        <p className="text-muted-foreground">No communities found</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {communities.map((community) => (
                                <div
                                    key={community.id}
                                    className={`bg-card rounded-xl shadow-sm border ${community.isActive ? 'border-border' : 'border-destructive/30 bg-destructive/5'
                                        } hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col`}
                                >
                                    {/* Image Section */}
                                    <div className="h-48 relative overflow-hidden group">
                                        {community.imageUrl ? (
                                            <>
                                                <img
                                                    src={community.imageUrl}
                                                    alt={community.name}
                                                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!community.isActive ? 'opacity-60' : ''
                                                        }`}
                                                    onError={(e) => {
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
                                            <div className={`w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center ${!community.isActive ? 'opacity-60' : ''
                                                }`}>
                                                <Users className="w-16 h-16 text-white/50" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 flex gap-2">
                                            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-semibold text-foreground uppercase tracking-wide">
                                                {community.category}
                                            </span>
                                            {!community.isActive && (
                                                <span className="bg-red-500/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-semibold text-white uppercase tracking-wide">
                                                    Blocked
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1">
                                            {community.name}
                                        </h3>

                                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-grow">
                                            {community.description}
                                        </p>

                                        {/* Stats */}
                                        <div className="space-y-2 mb-4 text-sm border-b border-border pb-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-muted-foreground flex items-center gap-1.5">
                                                    <Users className="w-4 h-4 text-muted-foreground" />
                                                    {community.membersCount.toLocaleString()} members
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-muted-foreground">
                                                    {community.creditsCost} credits / {community.creditsPeriod}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-muted-foreground text-xs">
                                                    Admin: {community.adminId.substring(0, 8)}...
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleViewDetails(community)}
                                                className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleEditClick(community)}
                                                className="flex-1 bg-muted hover:bg-muted/80 text-muted-foreground py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            {community.isActive ? (
                                                <button
                                                    onClick={() => handleBlockClick(community)}
                                                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                                                    title="Block Community"
                                                >
                                                    <Ban className="w-4 h-4" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleUnblockClick(community)}
                                                    className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                                                    title="Unblock Community"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 0 && (
                            <div className="mt-6">
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    totalItems={totalItems}
                                    limit={limit}
                                    onPageChange={handlePageChange}
                                    onLimitChange={handleLimitChange}
                                    showLimitSelector={true}
                                    showInfo={true}
                                />
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Modals */}
            {selectedCommunity && (
                <>
                    <CommunityDetailsModal
                        isOpen={showDetailsModal}
                        onClose={() => {
                            setShowDetailsModal(false);
                            setSelectedCommunity(null);
                        }}
                        community={selectedCommunity}
                        onEdit={() => {
                            setShowDetailsModal(false);
                            // Don't clear selectedCommunity here - keep it for the edit modal
                            setShowEditModal(true);
                        }}
                        onDelete={() => {
                            setShowDetailsModal(false);
                            // Don't clear selectedCommunity here - keep it for the confirm modal
                            if (selectedCommunity.isActive) {
                                setShowBlockConfirm(true);
                            } else {
                                setShowUnblockConfirm(true);
                            }
                        }}
                    />

                    <EditCommunityModal
                        isOpen={showEditModal}
                        onClose={() => {
                            setShowEditModal(false);
                            setSelectedCommunity(null);
                        }}
                        community={selectedCommunity}
                        onSuccess={handleEditSuccess}
                    />
                </>
            )}

            <ConfirmModal
                isOpen={showBlockConfirm}
                title="Block Community"
                message={`Are you sure you want to block "${selectedCommunity?.name}"? This will hide the community from all public listings and prevent new members from joining. Existing members will retain access. You can unblock it later.`}
                confirmText={isProcessing ? "Blocking..." : "Block Community"}
                cancelText="Cancel"
                type="danger"
                onConfirm={handleConfirmBlock}
                onCancel={() => {
                    setShowBlockConfirm(false);
                    setSelectedCommunity(null);
                }}
            />

            <ConfirmModal
                isOpen={showUnblockConfirm}
                title="Unblock Community"
                message={`Are you sure you want to unblock "${selectedCommunity?.name}"? This will make the community visible again in public listings and allow new members to join.`}
                confirmText={isProcessing ? "Unblocking..." : "Unblock Community"}
                cancelText="Cancel"
                type="info"
                onConfirm={handleConfirmUnblock}
                onCancel={() => {
                    setShowUnblockConfirm(false);
                    setSelectedCommunity(null);
                }}
            />

            <SuccessModal
                isOpen={showSuccessModal}
                title="Success"
                message={successMessage}
                onClose={() => setShowSuccessModal(false)}
            />

            <ErrorModal
                isOpen={showErrorModal}
                message={errorMessage}
                onClose={() => setShowErrorModal(false)}
            />
        </div>
    );
};

export default AdminCommunitiesPage;
