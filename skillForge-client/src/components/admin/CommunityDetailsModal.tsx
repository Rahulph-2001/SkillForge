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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-border">
                {/* Header */}
                <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex justify-between items-center z-10">
                    <h2 className="text-2xl font-bold text-foreground">Community Details</h2>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Community Image */}
                    {community.imageUrl ? (
                        <div className="w-full h-64 rounded-lg overflow-hidden border border-border">
                            <img
                                src={community.imageUrl}
                                alt={community.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-full h-64 bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg flex items-center justify-center border border-border">
                            <Users className="w-24 h-24 text-primary opacity-50" />
                        </div>
                    )}

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                        {community.isActive ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm font-medium">
                                <CheckCircle className="w-4 h-4" />
                                Active
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm font-medium">
                                <XCircle className="w-4 h-4" />
                                Inactive
                            </span>
                        )}
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                            {community.category}
                        </span>
                    </div>

                    {/* Community Name */}
                    <div>
                        <h3 className="text-3xl font-bold text-foreground mb-2">{community.name}</h3>
                        <p className="text-muted-foreground text-lg leading-relaxed">{community.description}</p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Members Count */}
                        <div className="bg-muted/40 rounded-lg p-4 border border-border">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <Users className="w-5 h-5" />
                                <span className="text-sm font-medium">Members</span>
                            </div>
                            <p className="text-2xl font-bold text-foreground">{community.membersCount}</p>
                        </div>

                        {/* Credits Cost */}
                        <div className="bg-muted/40 rounded-lg p-4 border border-border">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <DollarSign className="w-5 h-5" />
                                <span className="text-sm font-medium">Membership Cost</span>
                            </div>
                            <p className="text-2xl font-bold text-foreground">
                                {community.creditsCost} credits
                                <span className="text-sm font-normal text-muted-foreground ml-2">/ {community.creditsPeriod}</span>
                            </p>
                        </div>

                        {/* Admin ID */}
                        <div className="bg-muted/40 rounded-lg p-4 border border-border">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <Shield className="w-5 h-5" />
                                <span className="text-sm font-medium">Admin ID</span>
                            </div>
                            <p className="text-sm font-mono text-foreground break-all">{community.adminId}</p>
                        </div>

                        {/* Created Date */}
                        <div className="bg-muted/40 rounded-lg p-4 border border-border">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <Calendar className="w-5 h-5" />
                                <span className="text-sm font-medium">Created</span>
                            </div>
                            <p className="text-sm text-foreground">{formatDate(community.createdAt)}</p>
                        </div>
                    </div>

                    {/* Last Updated */}
                    <div className="text-sm text-muted-foreground">
                        Last updated: {formatDate(community.updatedAt)}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-border">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-border text-foreground font-medium rounded-lg hover:bg-muted transition-colors"
                        >
                            Close
                        </button>
                        {onEdit && (
                            <button
                                onClick={() => {
                                    onClose();
                                    onEdit();
                                }}
                                className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors"
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
                                    ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
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
