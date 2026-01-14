import { X, Users, Calendar, DollarSign, Shield, CheckCircle, XCircle } from 'lucide-react';
import { Community } from '../../types/community';

interface CommunityDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    community: Community;
    onEdit?: () => void;
    onDelete?: () => void;
}

export default function CommunityDetailsModal({
    isOpen,
    onClose,
    community,
    onEdit,
    onDelete,
}: CommunityDetailsModalProps) {
    if (!isOpen) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-gray-900">Community Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Community Image */}
                    {community.imageUrl ? (
                        <div className="w-full h-64 rounded-lg overflow-hidden">
                            <img
                                src={community.imageUrl}
                                alt={community.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-full h-64 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <Users className="w-24 h-24 text-white opacity-50" />
                        </div>
                    )}

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                        {community.isActive ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                <CheckCircle className="w-4 h-4" />
                                Active
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                                <XCircle className="w-4 h-4" />
                                Inactive
                            </span>
                        )}
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {community.category}
                        </span>
                    </div>

                    {/* Community Name */}
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">{community.name}</h3>
                        <p className="text-gray-600 text-lg leading-relaxed">{community.description}</p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Members Count */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <Users className="w-5 h-5" />
                                <span className="text-sm font-medium">Members</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{community.membersCount}</p>
                        </div>

                        {/* Credits Cost */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <DollarSign className="w-5 h-5" />
                                <span className="text-sm font-medium">Membership Cost</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {community.creditsCost} credits
                                <span className="text-sm font-normal text-gray-600 ml-2">/ {community.creditsPeriod}</span>
                            </p>
                        </div>

                        {/* Admin ID */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <Shield className="w-5 h-5" />
                                <span className="text-sm font-medium">Admin ID</span>
                            </div>
                            <p className="text-sm font-mono text-gray-900 break-all">{community.adminId}</p>
                        </div>

                        {/* Created Date */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <Calendar className="w-5 h-5" />
                                <span className="text-sm font-medium">Created</span>
                            </div>
                            <p className="text-sm text-gray-900">{formatDate(community.createdAt)}</p>
                        </div>
                    </div>

                    {/* Last Updated */}
                    <div className="text-sm text-gray-500">
                        Last updated: {formatDate(community.updatedAt)}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Close
                        </button>
                        {onEdit && (
                            <button
                                onClick={() => {
                                    onClose();
                                    onEdit();
                                }}
                                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                            >
                                Edit Community
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={() => {
                                    onClose();
                                    onDelete();
                                }}
                                className={`flex-1 px-4 py-3 font-semibold rounded-lg transition-colors ${community.isActive
                                        ? 'bg-red-600 hover:bg-red-700 text-white'
                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                    }`}
                            >
                                {community.isActive ? 'Block Community' : 'Unblock Community'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
