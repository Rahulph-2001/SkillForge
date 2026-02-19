import { useState } from 'react';
import { X, Users, UserMinus } from 'lucide-react';
import {
    getCommunityMembers,
    removeCommunityMember,
    CommunityMember,
} from '../../services/communityService';
import SuccessModal from '../common/Modal/SuccessModal';
import ErrorModal from '../common/Modal/ErrorModal';
import ConfirmModal from '../common/Modal/ConfirmModal';
import { useEffect } from 'react';

interface MemberListModalProps {
    isOpen: boolean;
    onClose: () => void;
    communityId: string;
    isAdmin: boolean;
}

export default function MemberListModal({
    isOpen,
    onClose,
    communityId,
    isAdmin,
}: MemberListModalProps) {
    const [members, setMembers] = useState<CommunityMember[]>([]);
    const [loading, setLoading] = useState(false);
    const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
    const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            loadMembers();
        }
    }, [isOpen, communityId]);

    const loadMembers = async () => {
        try {
            setLoading(true);
            const data = await getCommunityMembers(communityId);
            setMembers(data.members);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load members');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveClick = (member: CommunityMember) => {
        setSelectedMember(member);
        setShowRemoveConfirm(true);
    };

    const handleRemoveConfirm = async () => {
        if (!selectedMember) return;

        try {
            await removeCommunityMember(communityId, selectedMember.userId);
            setShowRemoveConfirm(false);
            setShowSuccess(true);

            // Remove member from list
            setMembers((prev) => prev.filter((m) => m.userId !== selectedMember.userId));

            setTimeout(() => {
                setShowSuccess(false);
            }, 2000);
        } catch (err: any) {
            setShowRemoveConfirm(false);
            setError(err.response?.data?.message || 'Failed to remove member');
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col border border-border">
                    {/* Header */}
                    <div className="bg-card border-b border-border px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Users className="w-6 h-6 text-primary" />
                            <div>
                                <h2 className="text-xl font-bold text-foreground">Community Members</h2>
                                <p className="text-sm text-muted-foreground">{members.length} total members</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Members List */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : members.length === 0 ? (
                            <div className="text-center py-8">
                                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                                <p className="text-muted-foreground">No members found</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {members.map((member) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center justify-between p-4 bg-muted/40 rounded-lg hover:bg-muted/70 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Avatar */}
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-primary-foreground font-semibold text-lg">
                                                {(member.userName ? member.userName.charAt(0) : 'U').toUpperCase()}
                                            </div>

                                            {/* Info */}
                                            <div>
                                                <p className="font-semibold text-foreground">
                                                    {member.userName || 'Unknown User'}
                                                </p>
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                    <span className="capitalize">{member.role}</span>
                                                    <span>•</span>
                                                    <span>
                                                        Joined {new Date(member.joinedAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        {isAdmin && member.role !== 'admin' && (
                                            <button
                                                onClick={() => handleRemoveClick(member)}
                                                className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                                title="Remove member"
                                            >
                                                <UserMinus className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-muted/10 px-6 py-4 border-t border-border">
                        <button
                            onClick={onClose}
                            className="w-full px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ConfirmModal
                isOpen={showRemoveConfirm}
                title="Remove Member"
                message={`Are you sure you want to remove ${selectedMember?.userName} from the community?`}
                type="danger"
                onConfirm={handleRemoveConfirm}
                onCancel={() => setShowRemoveConfirm(false)}
            />

            <SuccessModal
                isOpen={showSuccess}
                title="Member Removed"
                message="The member has been removed from the community successfully."
                onClose={() => setShowSuccess(false)}
            />

            <ErrorModal isOpen={!!error} message={error || ''} onClose={() => setError(null)} />
        </>
    );
}
